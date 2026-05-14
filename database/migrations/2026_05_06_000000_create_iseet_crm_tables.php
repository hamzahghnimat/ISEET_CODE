<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crm_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('password');
            $table->enum('role', ['manager', 'employee']);
            $table->timestamps();
        });

        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('organization');
            $table->string('sector');
            $table->string('country');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('location')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('engagement_level')->default('New');
            $table->date('last_contact_at')->nullable();
            $table->foreignId('assigned_employee_id')->nullable()->constrained('crm_users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('requested_slot');
            $table->string('topic');
            $table->enum('status', ['requested', 'confirmed', 'completed'])->default('requested');
            $table->date('requested_at');
            $table->timestamps();
        });

        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained('crm_users')->nullOnDelete();
            $table->dateTime('meeting_at');
            $table->string('duration')->nullable();
            $table->string('attendees')->nullable();
            $table->text('notes');
            $table->text('interests')->nullable();
            $table->text('customer_feedback')->nullable();
            $table->text('customer_activity')->nullable();
            $table->text('employee_feedback')->nullable();
            $table->timestamps();
        });

        Schema::create('communications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->enum('direction', ['outbound', 'inbound']);
            $table->text('message');
            $table->dateTime('sent_at');
            $table->timestamps();
        });

        Schema::create('manager_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained('crm_users')->nullOnDelete();
            $table->date('report_date');
            $table->text('summary');
            $table->text('customer_feedback');
            $table->timestamps();
        });

        Schema::create('scheduled_meetings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained('crm_users')->nullOnDelete();
            $table->dateTime('meeting_at');
            $table->string('purpose');
            $table->enum('status', ['confirmed', 'pending'])->default('confirmed');
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('status');
            $table->unsignedTinyInteger('progress')->default(0);
            $table->timestamps();
        });

        Schema::create('job_opportunities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('department');
            $table->string('employment_type');
            $table->string('work_mode');
            $table->text('description');
            $table->json('benefits')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_opportunities');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('scheduled_meetings');
        Schema::dropIfExists('manager_reports');
        Schema::dropIfExists('communications');
        Schema::dropIfExists('meetings');
        Schema::dropIfExists('consultations');
        Schema::dropIfExists('clients');
        Schema::dropIfExists('crm_users');
    }
};
