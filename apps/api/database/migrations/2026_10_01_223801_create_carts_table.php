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
        Schema::create('carts', function (Blueprint $table) {
            $table->id();


            // Nullable because guests can have carts
            // before creating an account.
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();

            /*
            * Guest carts need identification.
            * Example:
            * browser session UUID.
            */
            $table->uuid('session_id')
                ->nullable()
                ->unique();


            /*
             * Cart lifecycle.
             */
            $table->string('status')
                ->default('active');

            /*
            * Used for abandoned cart cleanup.
            */
            $table->timestamp('last_activity_at')
                ->nullable();


            $table->timestamps();


            $table->index([
                'user_id',
                'status'
            ]);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
