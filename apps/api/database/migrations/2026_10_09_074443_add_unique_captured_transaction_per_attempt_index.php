<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const INDEX_NAME =
        'payment_transactions_one_capture_per_attempt';

    public function up(): void
    {
        DB::statement("
            CREATE UNIQUE INDEX " . self::INDEX_NAME . "
            ON payment_transactions (payment_attempt_id)
            WHERE type = 'captured'
              AND payment_attempt_id IS NOT NULL
        ");
    }

    public function down(): void
    {
        DB::statement(
            'DROP INDEX IF EXISTS ' . self::INDEX_NAME
        );
    }
};
