<?php
//.....
namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;

class CrmController extends Controller
{
    public function index(): View
    {
        return view('iseet');
    }

    public function bootstrap(): JsonResponse
    {
        return response()->json([
            'clients' => $this->clients(),
            'jobs' => DB::table('job_opportunities')->where('is_active', true)->latest()->get(),
            'projects' => $this->projects(),
            'reports' => $this->reports(),
            'scheduledMeetings' => $this->scheduledMeetings(),
            'forecast' => $this->forecast(),
            'availableSlots' => ['Monday: 5:00 PM', 'Wednesday: 3:00 PM', 'Friday: 4:00 PM'],
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
            'role' => ['required', 'in:manager,employee'],
        ]);

        $user = DB::table('crm_users')
            ->where('username', $data['username'])
            ->where('role', $data['role'])
            ->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials. Use Manager@gmail.com (Manager) or Employee@gmail.com (Employee).'], 422);
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'role' => $user->role,
        ]);
    }

    public function storeLead(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'organization' => ['required', 'string', 'max:160'],
            'sector' => ['required', 'string', 'max:120'],
            'country' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['required', 'regex:/^[0-9+()\\-\\s]+$/', 'max:40'],
        ]);

        $clientId = DB::table('clients')->updateOrInsert(
            ['email' => $data['email']],
            $data + [
                'location' => $data['country'],
                'engagement_level' => 'New',
                'assigned_employee_id' => 2,
                'last_contact_at' => now()->toDateString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Customer profile saved to CRM.',
            'client' => $clientId,
            'clients' => $this->clients(),
        ]);
    }

    public function requestConsultation(Request $request): JsonResponse
    {
        $data = $request->validate([
            'client_id' => ['nullable', 'exists:clients,id'],
            'name' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
            'slot' => ['required', 'string'],
            'topic' => ['required', 'string', 'max:180'],
        ]);

        $clientId = $data['client_id'] ?? DB::table('clients')->where('email', $data['email'] ?? '')->value('id') ?? 1;

        DB::table('consultations')->insert([
            'client_id' => $clientId,
            'requested_slot' => $data['slot'],
            'topic' => $data['topic'],
            'status' => 'requested',
            'requested_at' => now()->toDateString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Consultation request sent to the employee profile.']);
    }

    public function sendMessage(Request $request, int $client): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
        ]);

        DB::table('communications')->insert([
            'client_id' => $client,
            'direction' => 'outbound',
            'message' => $data['message'],
            'sent_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Message logged and queued for email delivery.',
            'communications' => DB::table('communications')->where('client_id', $client)->orderBy('sent_at')->get(),
        ]);
    }

    public function addMeetingNote(Request $request, int $client): JsonResponse
    {
        $data = $request->validate([
            'notes' => ['required', 'string'],
            'interests' => ['nullable', 'string'],
            'customer_feedback' => ['nullable', 'string'],
            'employee_feedback' => ['nullable', 'string'],
        ]);

        DB::table('meetings')->insert([
            'client_id' => $client,
            'employee_id' => 2,
            'meeting_at' => now(),
            'duration' => 'New note',
            'attendees' => 'Employee follow-up',
            'notes' => $data['notes'],
            'interests' => $data['interests'] ?? '',
            'customer_feedback' => $data['customer_feedback'] ?? '',
            'customer_activity' => 'Updated from employee profile',
            'employee_feedback' => $data['employee_feedback'] ?? '',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('manager_reports')->insert([
            'client_id' => $client,
            'employee_id' => 2,
            'report_date' => now()->toDateString(),
            'summary' => $data['notes'],
            'customer_feedback' => $data['customer_feedback'] ?? 'No feedback recorded.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Meeting note saved and synced to Manager Reports.',
            'clients' => $this->clients(),
            'reports' => $this->reports(),
        ]);
    }

    public function addProject(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:180'],
            'client_id' => ['nullable', 'exists:clients,id'],
            'status' => ['required', 'string', 'max:80'],
            'progress' => ['required', 'integer', 'between:0,100'],
        ]);

        DB::table('projects')->insert($data + ['created_at' => now(), 'updated_at' => now()]);

        return response()->json(['projects' => $this->projects()]);
    }

    public function addJob(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:140'],
            'department' => ['required', 'string', 'max:120'],
            'employment_type' => ['required', 'string', 'max:80'],
            'work_mode' => ['required', 'string', 'max:80'],
            'description' => ['required', 'string', 'max:1200'],
        ]);

        DB::table('job_opportunities')->insert($data + [
            'benefits' => json_encode(['Company Benefits']),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['jobs' => DB::table('job_opportunities')->where('is_active', true)->latest()->get()]);
    }

    private function clients()
    {
        return DB::table('clients')
            ->leftJoin('crm_users', 'clients.assigned_employee_id', '=', 'crm_users.id')
            ->select('clients.*', 'crm_users.name as employee_name')
            ->orderBy('clients.id')
            ->get()
            ->map(function ($client) {
                $client->communications = DB::table('communications')->where('client_id', $client->id)->orderBy('sent_at')->get();
                $client->meetings = DB::table('meetings')->where('client_id', $client->id)->orderByDesc('meeting_at')->get();
                $client->consultations = DB::table('consultations')->where('client_id', $client->id)->orderByDesc('requested_at')->get();
                return $client;
            });
    }

    private function projects()
    {
        return DB::table('projects')
            ->leftJoin('clients', 'projects.client_id', '=', 'clients.id')
            ->select('projects.*', 'clients.organization')
            ->latest('projects.created_at')
            ->get();
    }

    private function reports()
    {
        return DB::table('manager_reports')
            ->join('clients', 'manager_reports.client_id', '=', 'clients.id')
            ->leftJoin('crm_users', 'manager_reports.employee_id', '=', 'crm_users.id')
            ->select('manager_reports.*', 'clients.name as client_name', 'crm_users.name as employee_name')
            ->orderByDesc('report_date')
            ->get();
    }

    private function scheduledMeetings()
    {
        return DB::table('scheduled_meetings')
            ->join('clients', 'scheduled_meetings.client_id', '=', 'clients.id')
            ->leftJoin('crm_users', 'scheduled_meetings.employee_id', '=', 'crm_users.id')
            ->select('scheduled_meetings.*', 'clients.name as client_name', 'clients.organization', 'crm_users.name as employee_name')
            ->orderBy('meeting_at')
            ->get();
    }

    private function forecast(): array
    {
        return [
            'revenue' => 225000,
            'highProbabilityLeads' => 23,
            'avgDealSize' => 134000,
            'avgResponseTime' => '4.5h',
            'customers' => [
                ['name' => 'Tech Corp', 'percentage' => 85, 'value' => 150000],
                ['name' => 'HealthCare Plus', 'percentage' => 78, 'value' => 120000],
                ['name' => 'Finance Solutions', 'percentage' => 92, 'value' => 200000],
                ['name' => 'Retail Group', 'percentage' => 65, 'value' => 90000],
                ['name' => 'Education Hub', 'percentage' => 70, 'value' => 110000],
            ],
        ];
    }
}
