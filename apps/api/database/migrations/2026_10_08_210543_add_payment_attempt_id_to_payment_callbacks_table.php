<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payment_callbacks', function (Blueprint $table) {

            // Once we Identify which payment attempts produces this callback,
            // we store that relationship for auditing and later processing

            $table->foreignId('payment_attempt_id')->nullable()->after('payment_id')->constrained()->nullOnDelete();

            //Allow us to quickly find callback belonging to attempt.

            $table->index([
                'payment_attempt_id',
            'created_at'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_callbacks', function (Blueprint $table) {

            $table->dropForeign(['payment_attempt_id']);
            $table->dropIndex(['payment_attempt_id', 'created_at']);
            $table->dropColumn('payment_attempt_id');
        });
    }
};
