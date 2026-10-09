<?php

namespace Tests\Feature;

use App\Enums\PaymentProvider;
use App\Models\Payment;
use App\Models\PaymentAttempt;
use App\Models\PaymentCallback;
use Illuminate\Support\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentCallbackTest extends TestCase
{
    use RefreshDatabase;

    /*
 |--------------------------------------------------------------------------
 | Relationships
 |--------------------------------------------------------------------------
 */

    public function test_payment_callback_belongs_to_payment(): void
    {
        $payment = Payment::factory()->create();

        $callback = PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
        ]);

        // The callback should resolve back to the payment that owns it.
        $this->assertTrue(
            $callback->payment->is($payment)
        );
    }

    public function test_payment_has_many_callbacks(): void
    {
        $payment = Payment::factory()->create();

        // First callback belonging to this payment.
        PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
        ]);

        // Second callback belonging to the same payment.
        PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
        ]);

        // The payment should now have two callback records.
        $this->assertCount(
            2,
            $payment->fresh()->callbacks
        );
    }

    public function test_payment_callback_belongs_to_payment_attempt(): void
    {
        $payment = Payment::factory()->create();

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'attempt_number' => 1,
        ]);

        $callback = PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
        ]);

        // The callback should resolve to the payment attempt
        // that produced the callback.
        $this->assertTrue(
            $callback->paymentAttempt->is($attempt)
        );
    }

    public function test_payment_attempt_has_many_callbacks(): void
    {
        $payment = Payment::factory()->create();

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'attempt_number' => 1,
        ]);

        // First callback belonging to this attempt.
        PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
        ]);

        // Second callback belonging to the same attempt.
        PaymentCallback::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
        ]);

        // The attempt should now have two callbacks.
        $this->assertCount(
            2,
            $attempt->fresh()->callbacks
        );
    }


    /*
     *  Enum Casts
     */

    public function test_payment_callback_casts_provider_to_enum():void
    {
        $callback = PaymentCallback::factory()->create([
            'provider'=> PaymentProvider::Mpesa,
        ]);

        // Laravel should return the enum instead of the raw database string.
        $this->assertSame( PaymentProvider::Mpesa, $callback->provider );
    }

    /*
    |-------------------------------------------------------------------------- |
    JSON casts
    |--------------------------------------------------------------------------
     */
    public function test_payment_callback_casts_payload_to_array(): void
    {
        $payload = [
            'result_code' => 0,
            'result_description' => 'Success',
            'receipt_number' => 'ABC123',
            ];
        $callback = PaymentCallback::factory()->create([ 'payload' => $payload, ]);
        // JSON stored in the database should come back as a PHP array.
        $this->assertIsArray($callback->payload);
        $this->assertSame( $payload, $callback->payload );
    }

    public function test_payment_callback_casts_headers_to_array(): void
    {
        $headers = [
            'content-type' => 'application/json',
            'user-agent' =>
                'payment-provider', ];
        $callback = PaymentCallback::factory()->create([ 'headers' => $headers, ]);
        // Headers are JSON in the database but should be an array in PHP.
         $this->assertIsArray($callback->headers);
         $this->assertSame( $headers, $callback->headers );
    }

    /* |-------------------------------------------------------------------------- |
    Processing state
      |-------------------------------------------------------------------------- */

    public function test_payment_callback_casts_processed_to_boolean(): void
    {
        $callback = PaymentCallback::factory()->create(['processed' => true,]);


        //Laravel should cast  the database value  to a real boolean
        $this->assertIsBool($callback->processed);

        $this->assertTrue($callback->processed);

    }

    public function test_payment_callback_casts_processed_at_to_datetime(): void
    {
        $processedAt = Carbon::parse('2026-10-08 12:00:00');
        $callback = PaymentCallback::factory()->create([
            'processed' => true,
            'processed_at' => $processedAt,
            ]);

        // Laravel should return a Carbon date instead of a raw string.

        $this->assertInstanceOf( Carbon::class, $callback->processed_at );

        $this->assertEquals( $processedAt->timestamp, $callback->processed_at->timestamp );
    }

    public function test_payment_callback_can_be_unprocessed(): void
    {
        $callback = PaymentCallback::factory()->create([
            'processed' => false,
            'processed_at' => null, ]);

        // A newly received callback should not be marked as processed.
        $this->assertFalse($callback->processed);

        $this->assertNull($callback->processed_at);

    }

    /*
    |-------------------------------------------------------------------------- |
     Nullable fields
     |--------------------------------------------------------------------------
    */
    public function test_payment_callback_can_exist_without_payment(): void {
        $callback = PaymentCallback::factory()->create([ 'payment_id' => null, ]);
        // We may receive a provider callback before we can identify //
        // which internal payment it belongs to.
        $this->assertNull($callback->payment_id);
        $this->assertNull($callback->payment);
    }

    public function test_payment_callback_can_store_processing_error(): void {
        $callback = PaymentCallback::factory()->create([ 'processed' => false,
            'processing_error' => 'Payment reference could not be matched.', ]);
        // Failed processing should be recorded so the callback can
        // // be investigated or retried later.
        $this->assertFalse($callback->processed);
        $this->assertSame( 'Payment reference could not be matched.', $callback->processing_error );
    }

    /*
    |-------------------------------------------------------------------------- |
    Provider callback data
    |--------------------------------------------------------------------------
    */

    public function test_payment_callback_stores_provider_reference_and_event_type(): void {
        $callback = PaymentCallback::factory()->create([ 'provider' => PaymentProvider::Mpesa,
            'provider_reference' => 'WS_CO_123456',
            'event_type' => 'payment.completed', ]);

        // These fields allow us to identify and reason about the
        // // provider event later during callback processing.
         $this->assertSame( 'WS_CO_123456', $callback->provider_reference );
         $this->assertSame( 'payment.completed', $callback->event_type );
    }

}
