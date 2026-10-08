<?php

namespace Tests\Feature;

use App\Enums\PaymentAttemptStatus;
use App\Enums\PaymentProvider;
use App\Models\Payment;
use App\Models\PaymentAttempt;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Database\QueryException;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class PaymentAttemptTest extends TestCase
{
        /*
     * Give every test a fresh database.
     *
     * This keeps tests independent from each other.
     */

    use RefreshDatabase;

    public function test_payment_attempt_belongs_to_payments():void
    {

        /*
         * Create the Parent Payment
         */
        $payment = Payment::factory()->create();

        /*
         * Create an attempt belonging to the payment.
         */

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
        ]);

        /*
         * Test the BelongTo() relationship defined on
         * PaymentAttempt.
         */

        $this->assertTrue(
            $attempt->payment->is($payment)
        );
    }

    public function test_payment_casts_status_to_enum():void
    {


        /*
         * Store the attempt with a specific enum value.
         */
        $attempt = PaymentAttempt::factory()->create([
            'status' => PaymentAttemptStatus::Pending,
        ]);

        /*
       * Laravel should convert the database string back into
       * the PaymentAttemptStatus enum.
       */

        $this->assertInstanceOf(PaymentAttemptStatus::class, $attempt->status);

        $this->assertSame(
            PaymentAttemptStatus::Pending,
            $attempt->status
        );
    }

    public function test_payment_attempt_casts_provider_to_enum(): void
    {
        /*
         * Providers are represented by the PaymentProvider enum.
         */
        $attempt = PaymentAttempt::factory()->create([
            'provider' => PaymentProvider::Mpesa,
        ]);

        /*
         * Verify that Laravel performs the enum cast.
         */
        $this->assertInstanceOf(
            PaymentProvider::class,
            $attempt->provider
        );

        $this->assertSame(
            PaymentProvider::Mpesa,
            $attempt->provider
        );
    }


    public function test_payment_attempt_stores_amount_as_integer_minor_units():void
    {

        /*
        * Payment attempts use the same money representation
        * as orders and payments.
        *
        * KES 3,500.00 → 350000 minor units.
        */
        $attempt = PaymentAttempt::factory()->create([
            'amount_minor' => 350000,
        ]);
        $this->assertIsInt($attempt->amount_minor);
        $this->assertSame(350000, $attempt->amount_minor);
    }

    public function test_payment_attempt_number_can_be_used_for_different_payments():void
    {

        /*
      * Create the parent payment.
      */
        $payment = Payment::factory()->create();

        /*
         * the First attempt gets number 1
         */

        PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'attempt_number' => 1,
        ]);

        /*
       * The migration contains a composite UNIQUE constraint:
       *
       * UNIQUE(payment_id, attempt_number)
       *
       * Therefore another attempt #1 for the same payment
       * must fail.
       */

        $this->expectException(QueryException::class);

        PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'attempt_number' => 1,
        ]);
    }

    public function test_same_attempt_number_can_be_used_for_different_payments(): void
    {

        /*
      * The uniqueness rule is scoped to a payment.
      *
      * This means:
      *
      * Payment A → Attempt 1
      * Payment B → Attempt 1
      *
      * is perfectly valid.
      */


        // Create two completely separate payments.
        $paymentOne = Payment::factory()->create();
        $paymentTwo = Payment::factory()->create();


        // Payment #1 can have attempt #1.
        $attemptOne = PaymentAttempt::factory()->create([
            'payment_id' => $paymentOne->id,
            'attempt_number' => 1,
        ]);


        // Payment #2 can ALSO have attempt #1.
        //
        // This is allowed because attempt_number only needs to be
        // unique within the same payment.
        $attemptTwo = PaymentAttempt::factory()->create([
            'payment_id' => $paymentTwo->id,
            'attempt_number' => 1,
        ]);

        /*
        * They are two different database records.
        */

        $this->assertNotSame(
            $attemptOne->id,
            $attemptTwo->id
        );

        $this->assertSame(
            1,
            $attemptOne->attempt_number
        );

        $this->assertSame(
            1,
            $attemptTwo->attempt_number
        );

    }

    public function test_payment_attempt_casts_request_payload_to_array(): void
    {

        /*
        * Providers usually require us to send structured data.
        *
        * For example, an M-Pesa request may contain:
        *
        * phone number
        * amount
        * account reference
        *
        * We store that request as JSON in the database.
        */
        $payload = [
            'phone' => '254700000000',
            'amount' => 3500,
            'account_reference' => 'MAU-TEST-001',
        ];

        $attempt = PaymentAttempt::factory()->create([
            'request_payload' => $payload,
        ]);

        $this->assertIsArray($attempt->request_payload);

        $this->assertSame(
            $payload,
            $attempt->request_payload
        );
    }

    public function test_payment_attempt_can_store_failure_details(): void
    {
        /*
         * Failed payment attempts should preserve enough
         * information to understand why the attempt failed.
         */
        $attempt = PaymentAttempt::factory()->create([
            'status' => PaymentAttemptStatus::Failed,
            'failure_code' => 'INSUFFICIENT_FUNDS',
            'failure_message' =>
                'The customer did not have sufficient funds.',
        ]);

        /*
         * Verify the status is represented by the enum.
         */
        $this->assertSame(
            PaymentAttemptStatus::Failed,
            $attempt->status
        );

        /*
         * Verify the provider's failure information is preserved.
         */
        $this->assertSame(
            'INSUFFICIENT_FUNDS',
            $attempt->failure_code
        );

        $this->assertSame(
            'The customer did not have sufficient funds.',
            $attempt->failure_message
        );
    }
    public function test_payment_attempt_casts_started_and_completed_dates(): void
    {
        /*
         * started_at records when we began communicating with
         * the payment provider.
         *
         * completed_at records when that attempt finished.
         */
        $attempt = PaymentAttempt::factory()->create([
            'started_at' => now(),
            'completed_at' => now()->addSeconds(10),
        ]);

        /*
         * Laravel casts both columns to Carbon instances.
         */
        $this->assertInstanceOf(
            Carbon::class,
            $attempt->started_at
        );

        $this->assertInstanceOf(
            Carbon::class,
            $attempt->completed_at
        );
    }
}
