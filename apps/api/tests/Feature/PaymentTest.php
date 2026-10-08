<?php

namespace Tests\Feature;


use App\Enums\PaymentMethod;
use App\Enums\PaymentProvider;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentAttempt;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentTest extends TestCase
{
        /*
    * RefreshDatabase gives every test a clean database.
    *
    * Laravel runs the migrations for the test database and
    * resets the database between tests so one test cannot
    * affect another.
    */

    use RefreshDatabase;
    public function test_payment_belongs_to_order(): void
    {

        /*
      * Create an order using the OrderFactory.
      *
      * We do not need to manually insert an order into the
      * database because the factory handles that for us.
      */
        $order = Order::factory()->create();

        /*
         * Create a payment belonging to that order.
         *
         * We explicitly provide order_id so we know exactly
         * which order the payment belongs to.
         */
        $payment = Payment::factory()->create([
            'order_id' => $order->id,
        ]);

        /*
         * Payment::order should return the Order model related
         * through the order_id foreign key.
         *
         * is() checks whether both Eloquent models represent
         * the same database record.
         */
        $this->assertTrue(
            $payment->order->is($order)
        );
    }

public function test_order_has_one_payment(): void
{

    /*
     * Create the Order First
     */
    $order = Order::factory()->create();

    /*
     * Create one payment belonging to the order.
     */

    $payment = Payment::factory()->create([
        'order_id' => $order->id,
    ]);

    /*
        * fresh() reloads the order from the database.
        *
        * payment is the hasOne() relationship defined on Order.
        *
        * We are testing the reverse side of the relationship:
        *
        * Order → Payment
        */

    $this->assertTrue(
        $order->fresh()->payment->is($payment)
    );
}

    public function test_payment_stores_amount_as_integer_minor_units(): void
    {



        /*
         * Money is stored as an integer in minor units.
         *
         * For example:
         *
         * KES 3,500.00
         *
         * becomes:
         *
         * 350000
         *
         * This prevents floating-point precision problems.
         */
        $payment = Payment::factory()->create([
            'amount_minor' => 350000,
        ]);

        /*
         * Confirm Laravel returns the  value of an integer
         */

        $this->assertIsInt($payment->amount_minor);

        /*
        * Confirm the exact amount was stored.
        */
        $this->assertSame(350000, $payment->amount_minor);
    }

    public function test_payments_casts_status_to_enum(): void
    {

        /*
    * Store the payment using our PaymentStatus enum.
    */
        $payment = Payment::factory()->create([
            'status' => PaymentStatus::Pending,
        ]);

        /*
         * Because Payment::$casts contains:
         *
         * 'status' => PaymentStatus::class
         *
         * Laravel automatically converts the database string
         * "pending" back into PaymentStatus::Pending.
         */
        $this->assertInstanceOf(
            PaymentStatus::class,
            $payment->status
        );

        /*
         * Make sure the specific enum value is correct.
         */
        $this->assertSame(
            PaymentStatus::Pending,
            $payment->status
        );
    }

    public function test_payment_casts_method_to_enum(): void
    {
        /*
         * Payment methods are also represented by an enum.
         */
        $payment = Payment::factory()->create([
            'method' => PaymentMethod::Mpesa,
        ]);

        /*
         * Laravel should return PaymentMethod rather than
         * returning the raw string "mpesa".
         */
        $this->assertInstanceOf(
            PaymentMethod::class,
            $payment->method
        );

        $this->assertSame(
            PaymentMethod::Mpesa,
            $payment->method
        );
    }

    public function test_payments_casts_provider_to_enum(): void
    {
        /*
               * A provider is different from a payment method.
               *
               * Example:
               *
               * provider = paystack
               * method   = card
               *
               * Here we are testing that the provider is converted
               * into the PaymentProvider enum.
         */
        $payment = Payment::factory()->create([
            'provider'=>PaymentProvider::Mpesa,
        ]);

        /*
       * Laravel should return PaymentMethod rather than
       * returning the raw string "mpesa".
       */

        $this->assertInstanceOf(
            PaymentProvider::class,
            $payment->provider
        );

        $this->assertSame(
            PaymentProvider::Mpesa,
            $payment->provider
        );
    }

    public function test_payment_casts_expiration_and_paid_dates(): void
    {

        /*
         * Stores  both timestamps
         *
           * paid_at represents when the payment succeeded.
         *
         * expires_at represents when the payment attempt/payment
         * should no longer be considered valid.
         */
        $payment = Payment::factory()->create([
            'paid_at' => now(),
            'expires_at' => now()->addMinutes(15),
        ]);

        /*
    * The Payment model casts these fields to datetime.
    *
    * Therefore Laravel should return Carbon objects instead
    * of raw database timestamp strings.
    */

        $this->assertInstanceOf(
            \Illuminate\Support\Carbon::class,
            $payment->paid_at
        );

        $this->assertInstanceOf(
            \Illuminate\Support\Carbon::class,
            $payment->expires_at
        );
    }

    public function test_payment_reference_is_unique(): void
    {
        /*
      * Payment references are public/business identifiers.
      *
      * The database migration defines reference as UNIQUE.
      *
      * Therefore two payments must never have the same
      * payment reference.
      */
        $reference = 'PAY-TEST-123456';

        /*
         * First Payment successfully  uses the reference
         */

        Payment::factory()->create([
            'reference' => $reference,
        ]);


        /*
         * Creating another payment with the same reference
         * should cause the database UNIQUE constraint to fail.
         */

        $this->expectException(
            \Illuminate\Database\QueryException::class
        );

        Payment::factory()->create([
            'reference' => $reference,
        ]);
    }

    public function test_payment_has_many_attempts(): void
    {


        /*
            * Create the parent payment.
         */
        $payment = Payment::factory()->create();

        /*
         * A payment can have multiple attempts.
         *
         * For example:
         *
         * Attempt 1 → failed
         * Attempt 2 → failed
         * Attempt 3 → succeeded
         *
         * Each attempt belongs to the same payment.
         */

        PaymentAttempt::factory()->for($payment)->create([
            'attempt_number' => 1,
        ]);

        PaymentAttempt::factory()->for($payment)->create([
            'attempt_number' => 2,
        ]);

        PaymentAttempt::factory()->for($payment)->create([
            'attempt_number' => 3,
        ]);

        /*
         * Reload the payment and attempts its attempts\
         *
         * We should get all three attempts
         */

        $this->assertCount(
            3,
            $payment->fresh()->attempts
        );

    }

    public function test_payment_attempt_belongs_to_payment(): void
    {
        /*
         * Create the parent payment.
         */
        $payment = Payment::factory()->create();

        /*
         * Create an attempt belonging to that payment.
         */
        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
        ]);

        /*
         * Test the inverse relationship:
         *
         * PaymentAttempt → Payment
         */
        $this->assertTrue(
            $attempt->payment->is($payment)
        );
    }

}
