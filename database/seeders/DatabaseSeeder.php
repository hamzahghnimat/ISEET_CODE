<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('crm_users')->insert([
            [
                'id' => 1,
                'name' => 'Maya Hassan',
                'username' => 'manager',
                'password' => Hash::make('demo'),
                'role' => 'manager',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'Alice Brown',
                'username' => 'employee',
                'password' => Hash::make('demo'),
                'role' => 'employee',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'Bob Wilson',
                'username' => 'bob',
                'password' => Hash::make('demo'),
                'role' => 'employee',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('clients')->insert([
            [
                'id' => 1,
                'name' => 'John Smith',
                'organization' => 'Tech Corp',
                'sector' => 'Technology',
                'country' => 'United States',
                'email' => 'john@techcorp.com',
                'phone' => '+1 (555) 123-4567',
                'location' => 'San Francisco, CA',
                'latitude' => 37.7749,
                'longitude' => -122.4194,
                'engagement_level' => 'High',
                'last_contact_at' => '2026-03-29',
                'assigned_employee_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'Sarah Johnson',
                'organization' => 'HealthCare Plus',
                'sector' => 'Healthcare',
                'country' => 'United States',
                'email' => 'sarah@healthcareplus.com',
                'phone' => '+1 (555) 234-5678',
                'location' => 'Boston, MA',
                'latitude' => 42.3601,
                'longitude' => -71.0589,
                'engagement_level' => 'Medium',
                'last_contact_at' => '2026-03-30',
                'assigned_employee_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'Michael Chen',
                'organization' => 'Finance Solutions',
                'sector' => 'Finance',
                'country' => 'Singapore',
                'email' => 'michael@financesol.com',
                'phone' => '+1 (555) 345-6789',
                'location' => 'Singapore',
                'latitude' => 1.3521,
                'longitude' => 103.8198,
                'engagement_level' => 'High',
                'last_contact_at' => '2026-03-24',
                'assigned_employee_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('consultations')->insert([
            [
                'client_id' => 1,
                'requested_slot' => 'Monday: 5:00 PM',
                'topic' => 'Enterprise Digital Transformation',
                'status' => 'requested',
                'requested_at' => '2026-03-28',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('meetings')->insert([
            [
                'client_id' => 1,
                'employee_id' => 2,
                'meeting_at' => '2026-03-29 14:00:00',
                'duration' => '1 hour',
                'attendees' => 'John Smith, Alice Brown (Employee)',
                'notes' => 'Discussed enterprise digital transformation project. Customer expressed strong interest in cloud migration solutions. Reviewed current infrastructure and identified key pain points.',
                'interests' => 'Cloud services, Data analytics, Security solutions',
                'customer_feedback' => 'Very positive response. Customer is ready to move forward with proposal. Mentioned budget has been approved for Q2 implementation.',
                'customer_activity' => 'High engagement, asked detailed technical questions, requested follow-up materials',
                'employee_feedback' => 'Excellent meeting. Client is highly motivated and well-prepared. Recommend fast-tracking proposal.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'client_id' => 1,
                'employee_id' => 2,
                'meeting_at' => '2026-03-15 10:00:00',
                'duration' => '45 minutes',
                'attendees' => 'John Smith, Alice Brown (Employee)',
                'notes' => 'Initial consultation. Reviewed current infrastructure and pain points. Customer needs scalable solution for growing team of 50+ employees.',
                'interests' => 'Infrastructure scaling, Team collaboration tools, Cloud migration',
                'customer_feedback' => 'Interested in learning more. Requested detailed proposal and pricing information.',
                'customer_activity' => 'Good participation, took notes, scheduled follow-up',
                'employee_feedback' => 'Promising lead. Client understands their needs well and has decision-making authority.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('communications')->insert([
            ['client_id' => 1, 'direction' => 'outbound', 'message' => "Thank you for the meeting yesterday. I've attached the proposal we discussed.", 'sent_at' => '2026-03-30 15:45:00', 'created_at' => now(), 'updated_at' => now()],
            ['client_id' => 1, 'direction' => 'inbound', 'message' => 'Thanks! The proposal looks great. Can we schedule a follow-up to discuss the implementation timeline?', 'sent_at' => '2026-03-30 17:20:00', 'created_at' => now(), 'updated_at' => now()],
            ['client_id' => 1, 'direction' => 'outbound', 'message' => "Looking forward to our meeting today at 2 PM. I've prepared some materials to share.", 'sent_at' => '2026-03-29 09:15:00', 'created_at' => now(), 'updated_at' => now()],
            ['client_id' => 1, 'direction' => 'inbound', 'message' => 'Perfect! See you then.', 'sent_at' => '2026-03-29 09:30:00', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('manager_reports')->insert([
            ['client_id' => 1, 'employee_id' => 2, 'report_date' => '2026-03-30', 'summary' => 'Initial consultation completed. Customer interested in enterprise solutions.', 'customer_feedback' => 'Very positive response, ready to move forward with proposal.', 'created_at' => now(), 'updated_at' => now()],
            ['client_id' => 2, 'employee_id' => 3, 'report_date' => '2026-03-29', 'summary' => 'Follow-up meeting scheduled. Discussed implementation timeline.', 'customer_feedback' => 'Customer requested additional information about pricing tiers.', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('scheduled_meetings')->insert([
            ['client_id' => 1, 'employee_id' => 2, 'meeting_at' => '2026-04-05 11:00:00', 'purpose' => 'Project proposal discussion', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['client_id' => 2, 'employee_id' => 3, 'meeting_at' => '2026-04-12 15:00:00', 'purpose' => 'Implementation planning meeting', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('projects')->insert([
            ['client_id' => 1, 'name' => 'Enterprise Digital Transformation', 'status' => 'In Progress', 'progress' => 65, 'created_at' => now(), 'updated_at' => now()],
            ['client_id' => 2, 'name' => 'Healthcare Management System', 'status' => 'Planning', 'progress' => 25, 'created_at' => now(), 'updated_at' => now()],
            ['client_id' => 3, 'name' => 'Financial Analytics Platform', 'status' => 'In Progress', 'progress' => 80, 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('job_opportunities')->insert([
            ['title' => 'Senior Consultant', 'department' => 'Technology Sector', 'employment_type' => 'Full-time', 'work_mode' => 'Remote', 'description' => 'Lead strategic consulting projects for enterprise clients. 5+ years experience required.', 'benefits' => json_encode(['Healthcare Benefits', 'Stock Options']), 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Project Manager', 'department' => 'Multiple Projects', 'employment_type' => 'Full-time', 'work_mode' => 'Hybrid', 'description' => 'Oversee client projects from inception to completion. Strong communication skills essential.', 'benefits' => json_encode(['Professional Development', 'Competitive Salary']), 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
