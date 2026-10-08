<?php


namespace Tests\Feature;

use App\Enums\PaymentTransactionType;
use App\Models\Payment;
use App\Models\PaymentAttempt;
use App\Models\PaymentTransaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentTransactionTest extends TestCase
{

    use RefreshDatabase;

    /**
     * A transaction belongs to the payment it was recorded against
     *  payment_transactions.payment_id is the foreign key that
     *  connects the transaction back to the payments table.
     */

    public function test_payment_transaction_belongs_to_payment(): void
    {
        $payment = Payment::factory()->create();

        $transaction = PaymentTransaction::factory()->create([
            'payment_id' => $payment->id,
        ]);

        $this->assertTrue(
            $transaction->payment->is($payment)
        );
    }



    /**
     * A payment can have many transaction records.
     *
     * This is important because a payment is not represented by
     * one database row for every state change.
     *
     * Example:
     *
     * Payment
     *   ├── initiated
     *   ├── processing
     *   └── captured
     */

    public function test_payment_has_many_transactions(): void
    {
        $payment = Payment::factory()->create();

        PaymentTransaction::factory()->create([
            'payment_id' => $payment->id,
            'type' => PaymentTransactionType::Initiated,
        ]);

        // Second transaction belonging to the same payment.
        PaymentTransaction::factory()->create([
            'payment_id' => $payment->id,
            'type' => PaymentTransactionType::Processing,
        ]);
        $this->assertCount(
            2,
            $payment->fresh()->transactions
        );
    }

    /**
     * A transaction can belong to a specific payment attempt.
     *
     * This allows us to trace which retry produced a transaction.
     */
    public function test_payment_transaction_belongs_to_payment_attempt(): void
    {
        $payment = Payment::factory()->create();

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'attempt_number' => 1,
        ]);

        $transaction = PaymentTransaction::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
        ]);

        $this->assertTrue(
            $transaction->paymentAttempt->is($attempt)
        );
    }

    /*
     * A payment attempt can have many transaction records.
     *
     */
    public function test_payment_attempt_has_many_transactions(): void
    {

        $payment = Payment::factory()->create();

        $attempt = PaymentAttempt::factory()->create([
            'payment_id' => $payment->id,
            'attempt_number' => 1,
        ]);

        // First transaction belonging to this payment attempt.
        PaymentTransaction::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'type' => PaymentTransactionType::Initiated,
        ]);

        // Second transaction belonging to the same payment attempt.
        PaymentTransaction::factory()->create([
            'payment_id' => $payment->id,
            'payment_attempt_id' => $attempt->id,
            'type' => PaymentTransactionType::Failed,
        ]);


        $this->assertCount(
            2,
            $payment->fresh()->transactions
        );
    }

    /**
     * The transaction type should be converted from the database
     * string into the PaymentTransactionType enum.
     */
    public function test_payment_transaction_casts_type_to_enum(): void
    {
        $transaction = PaymentTransaction::factory()->create([
            'type' => PaymentTransactionType::Captured,
        ]);

        $this->assertInstanceOf(
            PaymentTransactionType::class,
            $transaction->type
        );

        $this->assertSame(
            PaymentTransactionType::Captured,
            $transaction->type
        );
    }

    /**
     * Money should be stored as an integer in minor units.
     *
     * Example:
     *
     * KES 4,000.00 → 400000
     *
     * This avoids floating-point precision problems.
     */
    public function test_payment_transaction_stores_amount_as_integer_minor_units(): void
    {
        $transaction = PaymentTransaction::factory()->create([
            'amount_minor' => 400000,
        ]);

        $this->assertIsInt(
            $transaction->amount_minor
        );

        $this->assertSame(
            400000,
            $transaction->amount_minor
        );
    }

    /**
     * Metadata is stored as JSON in PostgreSQL but should b
     * returned TO PHP as an array.
     *
     * This allows us to store provider-specific information
     * without adding provider-specific columns to this table.
     */

    public function test_payment_transaction_casts_metadata_to_array(): void
    {
        $metadata = [
            'provider'=>'mpesa',
            'receipt_number'=>'ABC56789',
            'phone'=> '2547000000'
        ];

        $transaction  = PaymentTransaction::factory()->create([
            'metadata'=>$metadata,
        ]);
        $this->assertIsArray(
            $transaction->metadata
        );

        $this->assertSame(
            $metadata,
            $transaction->metadata
        );
    }

    /**
     * Provider reference is nullable because the provider may not
     * have returned a reference yet.
     */
    public function test_payment_transaction_can_have_no_provider_reference(): void
    {
        $transaction = PaymentTransaction::factory()->create([
            'provider_reference' => null,
        ]);

        $this->assertNull(
            $transaction->provider_reference
        );
    }

    /**
     * Different transaction types should be stored correctly.
     *
     * This verifies that our enum supports the payment lifecycle.
     */

    public function test_payment_transaction_supports_different_transaction_types(): void
    {
        $types = [
            PaymentTransactionType::Initiated,
            PaymentTransactionType::Processing,
            PaymentTransactionType::Authorized,
            PaymentTransactionType::Captured,
            PaymentTransactionType::Failed,
            PaymentTransactionType::Cancelled,
            PaymentTransactionType::Refunded,
        ];

        foreach ($types as $type) {
            $transaction = PaymentTransaction::factory()->create([
                'type' => $type,
            ]);

            $this->assertSame(
                $type,
                $transaction->type
            );
        }
    }
}
