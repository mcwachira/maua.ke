<?php

namespace App\Services\Payments;

use App\Enums\PaymentAttemptStatus;
use App\Enums\PaymentStatus;
use App\Enums\PaymentTransactionType;
use App\Models\PaymentAttempt;
use App\Models\PaymentCallback;
use App\Models\PaymentTransaction;
use Illuminate\Support\Facades\DB;
use Throwable;

class PaymentCallbackProcessor
{
    /**
     * Process a saved callback from a payment provider.
     */
    public function process(PaymentCallback $callback): void
    {
        try {
            DB::transaction(function () use ($callback): void {
                // Lock the callback to prevent concurrent processing.
                $callback = PaymentCallback::query()
                    ->lockForUpdate()
                    ->findOrFail($callback->id);

                // Skip callbacks already handled successfully.
                if ($callback->processed) {
                    return;
                }

                // Find and lock the matching payment attempt.
                $attempt = PaymentAttempt::query()
                    ->where('provider', $callback->provider->value)
                    ->where(
                        'provider_reference',
                        $callback->provider_reference
                    )
                    ->lockForUpdate()
                    ->firstOrFail();

                // This processor currently handles M-Pesa callbacks only.
                if ($callback->provider->value !== 'mpesa') {
                    return;
                }

                // Leave callbacks without a result code pending.
                $resultCode = $callback->payload['result_code'] ?? null;

                if ($resultCode === null) {
                    return;
                }

                // Lock the associated payment before changing its state.
                $payment = $attempt->payment()
                    ->lockForUpdate()
                    ->firstOrFail();

                // Prevent duplicate captures for an already captured attempt.
                $alreadyCaptured = PaymentTransaction::query()
                    ->where('payment_attempt_id', $attempt->id)
                    ->where('type', PaymentTransactionType::Captured)
                    ->exists();

                if ($alreadyCaptured) {
                    $callback->update([
                        'processed' => true,
                        'processed_at' => now(),
                        'processing_error' => null,
                    ]);

                    return;
                }

                $successful = (int) $resultCode === 0;


            // Prevent duplicate failed transactions for the same attempt.
            if (! $successful) {
                $alreadyFailed = PaymentTransaction::query()
                    ->where('payment_attempt_id', $attempt->id)
                    ->where('type', PaymentTransactionType::Failed)
                    ->exists();

                if ($alreadyFailed) {
                    $callback->update([
                        'processed' => true,
                        'processed_at' => now(),
                        'processing_error' => null,
                    ]);

                    return;
                }
            }


                if ($successful) {
                    $attempt->update([
                        'status' => PaymentAttemptStatus::Succeeded,
                        'completed_at' => now(),
                    ]);

                    $payment->update([
                        'status' => PaymentStatus::Paid,
                        'paid_at' => now(),
                    ]);

                    PaymentTransaction::create([
                        'payment_id' => $payment->id,
                        'payment_attempt_id' => $attempt->id,
                        'type' => PaymentTransactionType::Captured,
                        'provider_reference' => $callback->provider_reference,
                        'amount_minor' => $attempt->amount_minor,
                        'currency' => $payment->currency,
                        'metadata' => [
                            'callback_id' => $callback->id,
                            'event_type' => $callback->event_type,
                            'result_code' => $resultCode,
                        ],
                    ]);
                } else {
                    $attempt->update([
                        'status' => PaymentAttemptStatus::Failed,
                        'completed_at' => now(),
                        'failure_code' => (string) $resultCode,
                        'failure_message' => $callback->payload[
                            'result_description'
                            ] ?? 'The payment provider reported a failure.',
                    ]);

                    PaymentTransaction::create([
                        'payment_id' => $payment->id,
                        'payment_attempt_id' => $attempt->id,
                        'type' => PaymentTransactionType::Failed,
                        'provider_reference' => $callback->provider_reference,
                        'amount_minor' => $attempt->amount_minor,
                        'currency' => $payment->currency,
                        'metadata' => [
                            'callback_id' => $callback->id,
                            'event_type' => $callback->event_type,
                            'result_code' => $resultCode,
                            'result_description' => $callback->payload[
                                'result_description'
                                ] ?? null,
                        ],
                    ]);
                }

                // Complete the callback only after all changes succeed.
                $callback->update([
                    'processed' => true,
                    'processed_at' => now(),
                    'processing_error' => null,
                ]);
            });
        } catch (Throwable $exception) {
            // The transaction has rolled back before we reach this point.
            // Store the error separately so failed callbacks remain diagnosable.
            try {
                PaymentCallback::query()
                    ->whereKey($callback->id)
                    ->where('processed', false)
                    ->update([
                        'processing_error' => mb_substr(
                            get_class($exception) . ': ' . $exception->getMessage(),
                            0,
                            4000
                        ),
                    ]);
            } catch (Throwable) {
                // Do not let an error-recording failure hide the original error.
            }

            // Preserve the original exception so callers can retry or alert.
            throw $exception;
        }
    }
}
