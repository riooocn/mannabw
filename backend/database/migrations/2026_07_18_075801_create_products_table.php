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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);
            $table->enum('type', ['ready_stock', 'pre_order'])->default('ready_stock');
            $table->json('images')->nullable();
            $table->integer('weight_grams')->default(500); // Default weight for t-shirt
            $table->integer('po_quota')->nullable();
            $table->date('po_close_date')->nullable();
            $table->string('po_estimated_shipping')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
