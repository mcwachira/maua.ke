<?php

namespace Tests\Feature;

use App\Enums\PaymentAttemptStatus;
use App\Enums\PaymentProvider;
use App\Enums\PaymentStatus;
use App\Enums\PaymentTransactionType;
use App\Models\Payment;
use App\Models\PaymentAttempt;
use App\Models\PaymentCallback;
use App\Models\PaymentTransaction;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\QueryException;
use Tests\TestCase;

class PaymentCallbackProcessorTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_callback_marks_payment_attempt_as_succeeded(): void
    {
        $payment = Payment::factory()->create([
            'status' => PaymentStatus::Processing,
        ]);

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_123456',
            'status' => PaymentAttemptStatus::Processing,
        ]);

        $callback = PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_123456',
            'event_type' => 'payment.completed',
            'payload' => [
                'result_code' => 0,
                'result_description' => 'Success',
            ],
        ]);

        $processor = app(
            \App\Services\Payments\PaymentCallbackProcessor::class
        );

        $processor->process($callback);

        $attempt->refresh();

        $this->assertSame(
            PaymentAttemptStatus::Succeeded,
            $attempt->status
        );
    }

    public function test_successful_callback_marks_payment_as_paid(): void
    {
        $payment = Payment::factory()->create([
            'status' => PaymentStatus::Processing,
        ]);

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_123456',
            'status' => PaymentAttemptStatus::Processing,
        ]);

        $callback = PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_123456',
            'event_type' => 'payment.completed',
            'payload' => [
                'result_code' => 0,
                'result_description' => 'Success',
            ],
        ]);

        $processor = app(
            \App\Services\Payments\PaymentCallbackProcessor::class
        );

        $processor->process($callback);

        $payment->refresh();

        $this->assertSame(PaymentStatus::Paid, $payment->status);
        $this->assertNotNull($payment->paid_at);
    }

    public function test_successful_callback_creates_captured_transaction(): void
    {
        $payment = Payment::factory()->create([
            'status' => PaymentStatus::Processing,
        ]);

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_123456',
            'amount_minor' => 400000,
            'status' => PaymentAttemptStatus::Processing,
        ]);

        $callback = PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_123456',
            'event_type' => 'payment.completed',
            'payload' => [
                'result_code' => 0,
                'result_description' => 'Success',
            ],
        ]);

        $processor = app(
            \App\Services\Payments\PaymentCallbackProcessor::class
        );

        $processor->process($callback);

        $this->assertDatabaseHas('payment_transactions', [
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'type' => 'captured',
            'provider_reference' => 'WS_CO_123456',
            'amount_minor' => 400000,
            'currency' => 'KES',
        ]);
    }

    public function test_successful_callback_marks_callback_as_processed(): void
    {
        $payment = Payment::factory()->create([
            'status' => PaymentStatus::Processing,
        ]);

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_123456',
            'status' => PaymentAttemptStatus::Processing,
        ]);

        $callback = PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_123456',
            'event_type' => 'payment.completed',
            'payload' => [
                'result_code' => 0,
                'result_description' => 'Success',
            ],
            'processed' => false,
            'processed_at' => null,
        ]);

        $processor = app(
            \App\Services\Payments\PaymentCallbackProcessor::class
        );

        $processor->process($callback);

        $callback->refresh();

        $this->assertTrue($callback->processed);
        $this->assertNotNull($callback->processed_at);
    }

    public function test_processing_the_same_callback_twice_does_not_duplicate_transactions(): void
    {
        $payment = Payment::factory()->create([
            'status' => PaymentStatus::Processing,
        ]);

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_DUPLICATE_123',
            'status' => PaymentAttemptStatus::Processing,
        ]);

        $callback = PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_DUPLICATE_123',
            'event_type' => 'payment.completed',
            'payload' => [
                'result_code' => 0,
                'result_description' => 'Success',
            ],
        ]);

        $processor = app(
            \App\Services\Payments\PaymentCallbackProcessor::class
        );

        $processor->process($callback);
        $processor->process($callback);

        $this->assertDatabaseCount('payment_transactions', 1);
    }

    public function test_failed_callback_marks_payment_attempt_as_failed(): void
    {
        $payment = Payment::factory()->create([
            'status' => PaymentStatus::Processing,
        ]);

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_FAILED_123',
            'status' => PaymentAttemptStatus::Processing,
        ]);

        $callback = PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_FAILED_123',
            'event_type' => 'payment.failed',
            'payload' => [
                'result_code' => 1032,
                'result_description' => 'Request cancelled by user.',
            ],
        ]);

        $processor = app(
            \App\Services\Payments\PaymentCallbackProcessor::class
        );

        $processor->process($callback);

        $attempt->refresh();

        $this->assertSame(
            PaymentAttemptStatus::Failed,
            $attempt->status
        );
    }

    public function test_failed_callback_creates_failed_transaction(): void
    {
        $payment = Payment::factory()->create([
            'status' => PaymentStatus::Processing,
        ]);

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_FAILED_TXN_123',
            'amount_minor' => 400000,
            'status' => PaymentAttemptStatus::Processing,
        ]);

        $callback = PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_FAILED_TXN_123',
            'event_type' => 'payment.failed',
            'payload' => [
                'result_code' => 1032,
                'result_description' => 'Request cancelled by user.',
            ],
        ]);

        $processor = app(
            \App\Services\Payments\PaymentCallbackProcessor::class
        );

        $processor->process($callback);

        $this->assertDatabaseHas('payment_transactions', [
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'type' => 'failed',
            'provider_reference' => 'WS_CO_FAILED_TXN_123',
            'amount_minor' => 400000,
            'currency' => 'KES',
        ]);
    }

    public function test_failed_callback_is_marked_as_processed(): void
    {
        $payment = Payment::factory()->create([
            'status' => PaymentStatus::Processing,
        ]);

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_FAILED_PROCESSED_123',
            'status' => PaymentAttemptStatus::Processing,
        ]);

        $callback = PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_FAILED_PROCESSED_123',
            'event_type' => 'payment.failed',
            'payload' => [
                'result_code' => 1032,
                'result_description' => 'Request cancelled by user.',
            ],
            'processed' => false,
            'processed_at' => null,
        ]);

        $processor = app(
            \App\Services\Payments\PaymentCallbackProcessor::class
        );

        $processor->process($callback);

        $callback->refresh();

        $this->assertTrue($callback->processed);
        $this->assertNotNull($callback->processed_at);
        $this->assertNull($callback->processing_error);
    }

    public function test_failed_callback_does_not_mark_overall_payment_as_failed(): void
    {
        $payment = Payment::factory()->create([
            'status' => PaymentStatus::Processing,
        ]);

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_RETRY_123',
            'status' => PaymentAttemptStatus::Processing,
        ]);

        $callback = PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_RETRY_123',
            'event_type' => 'payment.failed',
            'payload' => [
                'result_code' => 1032,
                'result_description' => 'Request cancelled by user.',
            ],
        ]);

        $processor = app(
            \App\Services\Payments\PaymentCallbackProcessor::class
        );

        $processor->process($callback);

        $payment->refresh();

        $this->assertSame(
            PaymentStatus::Processing,
            $payment->status
        );

        $this->assertNull($payment->paid_at);
    }

    public function test_two_successful_callbacks_for_same_attempt_do_not_duplicate_captured_transactions(): void
    {
        $payment = Payment::factory()->create([
            'status' => PaymentStatus::Processing,
        ]);

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_DUPLICATE_EVENT_123',
            'amount_minor' => 400000,
            'status' => PaymentAttemptStatus::Processing,
        ]);

        $callbackData = [
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_DUPLICATE_EVENT_123',
            'event_type' => 'payment.completed',
            'payload' => [
                'result_code' => 0,
                'result_description' => 'Success',
            ],
        ];

        $firstCallback = PaymentCallback::factory()->create($callbackData);
        $secondCallback = PaymentCallback::factory()->create($callbackData);

        $processor = app(
            \App\Services\Payments\PaymentCallbackProcessor::class
        );

        $processor->process($firstCallback);
        $processor->process($secondCallback);

        $this->assertDatabaseCount('payment_transactions', 1);
    }

    public function test_failure_callback_cannot_reverse_a_successful_attempt(): void
    {
        $payment = Payment::factory()->create([
            'status' => PaymentStatus::Processing,
        ]);

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_OUT_OF_ORDER_123',
            'amount_minor' => 400000,
            'status' => PaymentAttemptStatus::Processing,
        ]);

        $successfulCallback = PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_OUT_OF_ORDER_123',
            'event_type' => 'payment.completed',
            'payload' => [
                'result_code' => 0,
                'result_description' => 'Success',
            ],
        ]);

        $failureCallback = PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_OUT_OF_ORDER_123',
            'event_type' => 'payment.failed',
            'payload' => [
                'result_code' => 1032,
                'result_description' => 'Request cancelled by user.',
            ],
        ]);

        $processor = app(
            \App\Services\Payments\PaymentCallbackProcessor::class
        );

        $processor->process($successfulCallback);
        $processor->process($failureCallback);

        $attempt->refresh();
        $payment->refresh();

        $this->assertSame(
            PaymentAttemptStatus::Succeeded,
            $attempt->status
        );

        $this->assertSame(
            PaymentStatus::Paid,
            $payment->status
        );

        $this->assertDatabaseCount('payment_transactions', 1);
    }

    public function test_payment_attempt_cannot_have_two_captured_transactions(): void
    {
        $payment = Payment::factory()->create();

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'attempt_number' => 1,
        ]);

        PaymentTransaction::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'type' => PaymentTransactionType::Captured,
        ]);

        $this->expectException(QueryException::class);

        PaymentTransaction::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'type' => PaymentTransactionType::Captured,
        ]);
    }

    public function test_processing_error_is_recorded_when_payment_attempt_is_missing(): void
    {
        $callback = PaymentCallback::factory()->create([
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'MISSING_ATTEMPT_123',
            'payload' => [
                'result_code' => 0,
                'result_description' => 'Success',
            ],
            'processed' => false,
            'processed_at' => null,
            'processing_error' => null,
        ]);

        $processor = app(
            \App\Services\Payments\PaymentCallbackProcessor::class
        );

        try {
            $processor->process($callback);
            $this->fail(
                'Expected processing to fail when the payment attempt is missing.'
            );
        } catch (ModelNotFoundException $exception) {
            $this->assertNotEmpty($exception->getMessage());
        }

        $callback->refresh();

        $this->assertFalse($callback->processed);
        $this->assertNull($callback->processed_at);
        $this->assertNotEmpty($callback->processing_error);
    }

    public function test_two_failure_callbacks_for_same_attempt_do_not_duplicate_failed_transactions(): void
    {
        $payment = Payment::factory()->create([
            'status' => PaymentStatus::Processing,
        ]);

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_DUPLICATE_FAILURE_123',
            'amount_minor' => 400000,
            'status' => PaymentAttemptStatus::Processing,
        ]);

        $callbackData = [
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_DUPLICATE_FAILURE_123',
            'event_type' => 'payment.failed',
            'payload' => [
                'result_code' => 1032,
                'result_description' => 'Request cancelled by user.',
            ],
        ];

        $firstCallback = PaymentCallback::factory()->create($callbackData);
        $secondCallback = PaymentCallback::factory()->create($callbackData);

        $processor = app(
            \App\Services\Payments\PaymentCallbackProcessor::class
        );

        $processor->process($firstCallback);
        $processor->process($secondCallback);

        $this->assertDatabaseCount('payment_transactions', 1);

        $this->assertDatabaseHas('payment_transactions', [
            'payment_attempt_id' => $attempt->id,
            'type' => 'failed',
        ]);

        $secondCallback->refresh();

        $this->assertTrue($secondCallback->processed);
        $this->assertNotNull($secondCallback->processed_at);
        $this->assertNull($secondCallback->processing_error);
    }
}

