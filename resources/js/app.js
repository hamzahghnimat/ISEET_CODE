import './bootstrap';


const state = {
    view: 'home',
    user: null,
    roleChoice: 'employee',
    crmTab: 'customers',
    selectedClient: null,
    data: { clients: [], jobs: [], projects: [], reports: [], scheduledMeetings: [], forecast: {}, availableSlots: [] },
};

const csrfMeta = document.querySelector('meta[name="csrf-token"]');
const token = csrfMeta ? csrfMeta.content : '';

const sectors = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Construction', 'Energy', 'Transportation', 'Agriculture', 'Entertainment', 'Real Estate', 'Consulting', 'Other'];
const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Australia', 'Japan', 'China', 'India', 'Brazil', 'Mexico', 'Argentina', 'South Africa', 'Egypt', 'Saudi Arabia', 'UAE', 'Singapore', 'South Korea', 'Netherlands', 'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Jordan', 'Other'];

function icon(name) {
    const paths = {
        video: '<path d="M4 7h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><path d="m16 10 6-3v10l-6-3Z"/>',
        briefcase: '<path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"/><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 12h18"/>',
        users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
        mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
        map: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
    };
    return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${paths[name] || paths.users}</svg>`;
}

async function api(path, options = {}) {
    const response = await fetch(path, {
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token, 'Accept': 'application/json' },
        ...options,
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }
    return response.json();
}



function shell(content) {
    return `<header class="topbar">
        <button class="brand" onclick="go('home')">ISEET</button>
        <nav class="nav">
            <button class="nav-link" onclick="openConsultations()">${icon('video')} Consultations</button>
            <button class="nav-link" onclick="go('jobs')">${icon('briefcase')} Job Opportunities</button>
            <button class="btn" onclick="go('talk')">Talk to Us</button>
            <button class="btn dark" onclick="go('login')">CRM Access</button>
        </nav>
    </header>${content}`;
}

function featureCard(iconName, title, copy, action) {
    return `<article class="feature-card" style="cursor:pointer" onclick="${action}">
        <div class="feature-icon">${icon(iconName)}</div>
        <h3>${title}</h3>
        <p>${copy}</p>
    </article>`;
}

function home() {
    return shell(`<main class="hero">
        <h1>Welcome to ISEET</h1>
        <p class="lead">Your trusted partner for innovative solutions and consulting services</p>
        <section class="feature-grid">
            ${featureCard('users', 'Expert Consulting', 'Get personalized consulting services tailored to your business needs', "openConsultations()")}
            ${featureCard('briefcase', 'Project Solutions', 'Comprehensive project management and implementation services', "go('jobs')")}
            ${featureCard('video', '24/7 Support', 'Round-the-clock support and consultation for all your needs', "go('talk')")}
        </section>
    </main>`);
}


function jobs() {
    const projectCopy = [
        ['Enterprise Digital Transformation', 'Leading digital transformation initiatives for Fortune 500 companies.'],
        ['Cloud Migration', 'Helping organizations migrate to cloud platforms with enhanced security.'],
        ['AI Analytics', 'Implementing AI solutions for data-driven decision making.'],
    ];
    return shell(`<main class="page">
        <section class="jobs-layout">
            <div class="page-header"><h1 class="page-title">Opportunities & Projects</h1></div>
            <div class="two-col">
                <section class="section-card"><h2>Our Current Projects</h2><div class="project-list">${projectCopy.map(p => `<div class="project-item" style="cursor:pointer" onclick="go('talk')"><h3>${p[0]}</h3><p>${p[1]}</p></div>`).join('')}</div></section>
                <section class="section-card"><h2>Available Positions</h2><div class="job-list">${state.data.jobs.length ? state.data.jobs.map(jobCard).join('') : '<p>No current openings.</p>'}</div></section>
            </div>
        </section>
    </main>`);
}


function jobCard(job) {
    const benefits = JSON.parse(job.benefits || '[]');
    return `<article class="job-item"><h3>${job.title}</h3><p>${job.department}</p><p><span class="pill">${job.employment_type}</span> <span class="pill">${job.work_mode}</span></p><p>${job.description}</p><p>${benefits.map(b => `<span class="pill">${b}</span>`).join(' ')}</p></article>`;
}

function talk() {
    return `<main class="page"><div class="page-header"><button class="btn ghost" onclick="go('home')">Back to Home</button></div>
        <section class="form-shell">
            <h1>Talk to Us</h1><p class="subtitle">We'd love to hear from you. Fill out the form below and we'll get in touch.</p>
            <form id="leadForm">
                <label>Name *</label><input name="name" required>
                <label>Organization *</label><input name="organization" required>
                <label>Sector *</label><select name="sector" required><option value="">Select sector</option>${sectors.map(x => `<option>${x}</option>`).join('')}</select>
                <label>Country *</label><select name="country" required><option value="">Select country</option>${countries.map(x => `<option>${x}</option>`).join('')}</select>
                <label>Location (Google Maps URL)</label><input name="location" placeholder="e.g. https://maps.app.goo.gl/..." type="text">
                <label>Email Address *</label><input name="email" type="email" required><div class="hint">Must contain the @ symbol</div>
                <label>Phone Number *</label><input name="phone" pattern="[0-9+()\\-\\s]+" required><div class="hint">Numbers only (symbols like +, -, () are allowed)</div>
                <button class="btn" style="width:100%;margin-top:24px">Submit to CRM System</button>
                <div id="leadSuccess" class="success"></div>
            </form>
        </section></main>`;
}

function login() {
    return `<main class="page"><div class="page-header"><button class="btn ghost" onclick="go('home')">Back to ISEET Website</button></div>
        <section class="login-card">
            <h1>CRM System</h1><p class="subtitle">Login to access customer management</p>
            <form id="loginForm">
                <label>Role</label><div class="tabs"><button type="button" class="tab ${state.roleChoice === 'employee' ? 'active' : ''}" onclick="setRole('employee')">Employee</button><button type="button" class="tab ${state.roleChoice === 'manager' ? 'active' : ''}" onclick="setRole('manager')">Manager</button></div>
                <label>Email Address</label><input name="username" value="Manager@gmail.com" required>
                <label>Password</label><input name="password" type="password" value="Manager" required>
                <button class="btn" style="width:100%;margin-top:24px">Login to CRM</button>
                <p class="hint" style="text-align:center">Demo: Manager@gmail.com (Manager) or Employee@gmail.com (Employee)</p>
            </form>
        </section></main>`;
}

function crm() {
    if (state.user.role === 'employee') return employeeDashboard();
    if (state.view === 'forecast') return forecastPage();
    return managerDashboard();
}

function crmHeader(title, actions = '') {
    return `<header class="crm-topbar"><div><h2>${title}<span class="role-badge">${state.user.role === 'manager' ? 'Manager View' : 'Employee View'}</span></h2></div><div class="nav">${actions}<button class="btn dark" onclick="logout()">Logout</button></div></header>`;
}

function employeeDashboard() {
    const myClients = state.data.clients.filter(c => Number(c.assigned_employee_id) === Number(state.user.id));
    const myMeetings = state.data.scheduledMeetings.filter(m => Number(m.employee_id) === Number(state.user.id));
    const myReports = state.data.reports.filter(r => Number(r.employee_id) === Number(state.user.id));

    return `<div class="crm-shell">${crmHeader('CRM - Employee')}
        <main class="crm-main">
            <section class="stats">
                ${stat('My Customers', myClients.length)}
                ${stat('Upcoming Meetings', myMeetings.length)}
                ${stat('Reports Submitted', myReports.length)}
            </section>
            <div class="two-col">
                <section class="section-card">
                    <h2>Upcoming Scheduled Meetings</h2>
                    ${myMeetings.length ? myMeetings.map(m => `<div class="meeting-item"><h3>${m.client_name}</h3><p>${dateTime(m.meeting_at)}</p><p>${m.purpose}</p></div>`).join('') : '<p>No upcoming meetings.</p>'}
                </section>
                <section class="section-card"><h2>Consultation Requests</h2>${consultationNotice()}</section>
            </div>
            <section class="section-card" style="margin-top:24px">
                <h2>My Customer Profiles</h2>
                <div class="customer-grid">
                    ${myClients.length ? myClients.map(clientButton).join('') : '<p>No customers assigned yet.</p>'}
                </div>
            </section>
        </main></div>`;
}

function consultationNotice() {
    const myClients = state.data.clients.filter(c => Number(c.assigned_employee_id) === Number(state.user.id));
    const client = myClients.find(c => c.consultations && c.consultations.length);
    if (!client) return '<p>No pending consultation requests.</p>';
    const req = client.consultations[0];
    return `<div class="notice"><strong>${client.name} - ${client.organization}</strong><p>Requested: ${req.requested_slot}</p><p>Topic: ${req.topic}</p><p>Notification will appear when you open this customer's profile</p></div>`;
}

function clientButton(client) {
    return `<button class="profile-button" onclick="openClient(${client.id})"><h3>${client.name} - ${client.organization}</h3><p>${client.sector}</p><p>Last contact: ${client.last_contact_at || '-'}</p></button>`;
}

function stat(label, number) {
    return `<article class="stat"><div>${label}</div><div class="stat-number">${number}</div></article>`;
}

function profile() {
    const c = state.selectedClient;
    return `<div class="crm-shell">${crmHeader(c.name + ' - ' + c.organization, `<button class="btn ghost" onclick="go('crm')">Back</button>`)}
        <main class="crm-main">
            <section class="profile-card">
                ${c.consultations.length ? '<span class="pill">Consultation Requested</span>' : ''}
                <div class="profile-head"><div class="avatar">${c.name.split(' ').map(x => x[0]).join('')}</div><div><h1>${c.name}</h1><p>${c.organization} - ${c.sector}</p><p>${c.country}</p><p>${c.phone}</p><p>${c.location || ''}</p></div></div>
                <div class="action-grid">
                    <button class="action" onclick="openEmail()">Email Chat</button>
                    <button class="action" onclick="openConsultationDetails()">Consultation Request</button>
                    <button class="action" onclick="openLocation()">Location</button>
                    <button class="action" onclick="openMeetings()">All Meetings</button>
                </div>
                <section class="stats">${stat('Total Meetings', c.meetings.length || 0)}${stat('Last Contact', c.last_contact_at || '-')}${stat('Engagement Level', c.engagement_level)}</section>
            </section>
        </main></div>`;
}

function managerDashboard() {
    const content = state.crmTab === 'reports' ? reportsTab() : state.crmTab === 'schedule' ? scheduleTab() : state.crmTab === 'projects' ? projectsTab() : customersTab();
    return `<div class="crm-shell">${crmHeader('CRM - Manager', `<button class="btn" onclick="openAddJobModal()">Add Job Opening</button><button class="btn" onclick="go('forecast')">AI Sales Forecast</button>`)}
        <main class="crm-main">
            <section class="stats">${stat('Total Customers', '156')}${stat('New Reports', '24')}${stat('Scheduled Meetings', '12')}${stat('Active Projects', '18')}</section>
            <div class="tabs">${tab('customers', 'Customers')}${tab('reports', 'Reports')}${tab('schedule', 'Schedule Meetings')}${tab('projects', 'Projects')}</div>
            ${content}
        </main></div>`;
}

function tab(id, label) {
    return `<button class="tab ${state.crmTab === id ? 'active' : ''}" onclick="switchTab('${id}')">${label}</button>`;
}

function switchTab(id) {
    state.crmTab = id;
    render();
}

function customersTab() {
    return `<section class="section-card"><h2>All Customer Profiles</h2><div class="customer-grid">${state.data.clients.map(clientButton).join('')}</div></section>`;
}

function reportsTab() {
    return `<section class="section-card"><div class="notice"><strong>Auto-Synced Reports</strong><p>All reports are automatically received from the "All Meetings" section when employees add notes, reports, or concerns about customers.</p></div><h2>Employee Reports & Customer Feedback</h2>${state.data.reports.map(r => `<article class="report-item"><h3>${r.client_name}</h3><p>Report by: ${r.employee_name}</p><p>${r.report_date}</p><h4>Summary:</h4><p>${r.summary}</p><h4>Customer Feedback:</h4><p>${r.customer_feedback}</p></article>`).join('')}</section>`;
}

function scheduleTab() {
    return `<section class="section-card"><h2>Schedule Customer Meetings</h2>
        <h3>Consultation Requests</h3>
        ${state.data.consultations && state.data.consultations.length ? state.data.consultations.map(c => `<article class="meeting-item"><strong>${c.organization} - ${c.client_name}</strong><p>Requested Slot: ${c.requested_slot}</p><p>Topic: ${c.topic}</p><span class="pill">${c.status}</span></article>`).join('') : '<p>No pending consultation requests.</p>'}
        <h3 style="margin-top:24px">Upcoming Meetings</h3>
        ${state.data.scheduledMeetings.map(m => `<article class="meeting-item"><h3>${m.organization} - ${m.client_name}</h3><p>${dateTime(m.meeting_at)}</p><span class="pill">${m.status}</span></article>`).join('')}
        <h3>New Meeting</h3>
        <div class="two-col">
            <input type="date" id="meeting_date">
            <input type="time" id="meeting_time">
        </div>
        <button class="btn" style="margin-top:18px; width:100%" onclick="scheduleMeeting()">Schedule Meeting</button>
    </section>`;
}


function projectsTab() {
    return `<section class="section-card"><h2>Manage All Projects</h2><form id="projectForm" class="two-col"><input name="name" placeholder="Add New Project" required><select name="client_id"><option value="">Client</option>${state.data.clients.map(c => `<option value="${c.id}">${c.organization}</option>`).join('')}</select><input name="status" placeholder="Status" value="Planning" required><input name="progress" type="number" min="0" max="100" value="10" required><button class="btn">Add Project</button></form>${state.data.projects.map(p => `<article class="project-item"><h3>${p.name}</h3><p>Client: ${p.organization || 'Internal'}</p><span class="pill">${p.status}</span><p>Progress</p><div class="progress"><span style="width:${p.progress}%"></span></div><strong>${p.progress}%</strong></article>`).join('')}</section>`;
}

function forecastPage() {
    const f = state.data.forecast;
    return `<div class="crm-shell">${crmHeader('AI Sales Forecast', `<button class="btn ghost" onclick="go('crm')">Back</button><button class="btn" onclick="alert('Report shared with management.')">Share</button><button class="btn ghost" onclick="alert('PDF generation requires server-side library.')">PDF</button>`)}
    <main class="crm-main">
        <section class="forecast-grid">${stat('Forecasted Revenue', '$225K')}${stat('Leads', f.highProbabilityLeads)}${stat('Avg Deal', '$134K')}${stat('Response', f.avgResponseTime)}</section>
        <section class="two-col" style="margin-top:24px"><div class="section-card"><h2>Revenue Forecast</h2><div class="bar-chart">${[40, 55, 70, 82, 94, 100].map(h => `<div class="bar" style="height:${h}%"></div>`).join('')}</div></div><div class="section-card"><h2>AI Analysis</h2>${f.customers.map(c => `<div class="project-item"><strong>${c.name}</strong><div class="progress"><span style="width:${c.percentage}%"></span></div></div>`).join('')}</div></section>
    </main></div>`;
}


function render() {
    const app = document.getElementById('app');

    if (state.view === 'home') app.innerHTML = home();
    else if (state.view === 'jobs') app.innerHTML = jobs();
    else if (state.view === 'talk') app.innerHTML = talk();
    else if (state.view === 'login') app.innerHTML = login();
    else if (state.view === 'crm' || state.view === 'forecast') {
        if (!state.user && state.view !== 'login') {
            go('login');
        } else {
            app.innerHTML = crm();
        }
    }
    else if (state.view === 'profile') app.innerHTML = profile();

    bindForms();
}

function syncView() {
    const path = window.location.pathname;
    if (path === '/jobs') state.view = 'jobs';
    else if (path === '/talk') state.view = 'talk';
    else if (path === '/login') state.view = 'login';
    else if (path === '/crm') state.view = 'crm';
    else if (path === '/forecast') state.view = 'forecast';
    else if (path === '/dashboard' || path === '/') state.view = 'home';
}


function bindForms() {
    const leadForm = document.getElementById('leadForm');
    if (leadForm) leadForm.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            const result = await api('/api/leads', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(leadForm))) });
            state.data.clients = result.clients;
            document.getElementById('leadSuccess').textContent = result.message;
            document.getElementById('leadSuccess').classList.add('show');
            leadForm.reset();
        } catch (err) {
            alert(err.message);
        }
    });
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            const payload = Object.fromEntries(new FormData(loginForm));
            payload.role = state.roleChoice;
            state.user = await api('/api/login', { method: 'POST', body: JSON.stringify(payload) });
            go('crm');
        } catch (err) {
            alert(err.message);
        }
    });
    const projectForm = document.getElementById('projectForm');
    if (projectForm) projectForm.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            const result = await api('/api/projects', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(projectForm))) });
            state.data.projects = result.projects;
            render();
        } catch (err) {
            alert(err.message);
        }
    });
}

function go(view) {
    state.view = view;

    let url = `/${view}`;

    if (view === 'home') url = '/dashboard';

    history.pushState({ view }, '', url);

    closeModal();

    render();
}



window.onpopstate = (e) => {
    if (e.state && e.state.view) {
        state.view = e.state.view;
    } else {
        syncView();
    }
    render();
};

function setRole(role) { state.roleChoice = role; render(); }
function logout() { state.user = null; go('home'); }
function openClient(id) { state.selectedClient = state.data.clients.find(c => Number(c.id) === Number(id)); state.view = 'profile'; render(); }
function dateTime(value) { return new Date(value.replace(' ', 'T')).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }); }
function modal(content) { document.getElementById('modal-root').innerHTML = `<div class="modal"><button class="close" onclick="closeModal()">x</button>${content}</div>`; document.getElementById('modal-root').classList.add('show'); bindModalForms(); }
function closeModal() { const root = document.getElementById('modal-root'); root.classList.remove('show'); root.innerHTML = ''; }

function openConsultations() {
    modal(`<h1>Consultations</h1><h2>Watch Our Services Demo</h2><div class="video-container" style="margin: 18px 0 28px; border-radius: 10px; overflow: hidden; background: #000; box-shadow: var(--shadow);">
        <video controls style="width: 100%; display: block; max-height: 400px;">
            <source src="/videos/welcome.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div><h2>Request a Consultation</h2><p><strong>Available Consultation Times:</strong></p><p>Our managers are available for consultations at the following times</p><form id="consultForm"><label>Your Name</label><input name="name" required placeholder="Full Name"><label>Email Address</label><input name="email" type="email" required placeholder="email@example.com"><label>Preferred Slot</label><select name="slot">${state.data.availableSlots.map(s => `<option>${s}</option>`).join('')}</select><label>Topic</label><input name="topic" value="Enterprise Digital Transformation"><button class="btn" style="width:100%;margin-top:18px">Request Consultation</button><div class="success" id="consultSuccess"></div></form>`);
}

function openEmail() {
    const c = state.selectedClient;
    modal(`<h2>Email Chat with ${c.name}</h2><p>${c.email}</p><div style="max-height:300px;overflow:auto;margin-bottom:20px">${c.communications.map(m => `<div class="message ${m.direction === 'inbound' ? 'inbound' : ''}"><p>${m.message}</p><small>${dateTime(m.sent_at)}</small></div>`).join('')}</div><p class="hint">Messages sent here will appear in the customer's email inbox.</p><form id="messageForm"><textarea name="message" placeholder="Write a message..." required></textarea><button class="btn" style="width:100%;margin-top:12px">Send Message</button></form>`);
}

function openConsultationDetails() {
    const c = state.selectedClient;
    const req = c.consultations[0];
    modal(`<h2>Consultation Request</h2>${req ? `<div class="notice"><strong>Consultation Requested</strong><p>by ${c.name}</p><p>Requested Time: ${req.requested_slot}</p><p>Requested At: ${req.requested_at}</p><p>Topic: ${req.topic}</p></div>` : '<p>No consultation request.</p>'}<h3>Available Times Set by Manager:</h3><p>Monday: 5:00 PM</p><p>Wednesday: 3:00 PM</p><p>Friday: 4:00 PM</p>`);
}

function openLocation() {
    const c = state.selectedClient;
    const isUrl = c.location && (c.location.startsWith('http://') || c.location.startsWith('https://'));
    const mapUrl = isUrl ? c.location : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.location || c.country)}`;

    modal(`<h2>Location</h2>
        <div class="map-box" style="text-align:center; padding:24px 16px;">
            <div style="margin-bottom:16px;">${icon('map')}</div>
            <h3 style="margin-bottom:8px;">${c.location || c.country}</h3>
            <p style="color:var(--text-muted); margin-bottom:20px; font-size:0.9rem;">
                ${isUrl ? 'Stored Google Maps Location' : 'Google Maps Search Target'}
            </p>
            <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="btn" style="display:inline-block; text-decoration:none; padding:10px 24px;">
                Open in Google Maps
            </a>
        </div>`);
}

function openMeetings() {
    const c = state.selectedClient;
    modal(`<h2>All Meetings - History</h2><div style="max-height:400px;overflow:auto;margin-bottom:24px">${c.meetings.map(m => `<article class="timeline-card" style="margin-bottom:12px"><h3>${dateTime(m.meeting_at)}</h3><p>Duration: ${m.duration}</p><p>${m.notes}</p></article>`).join('')}</div><form id="noteForm"><label>Add Meeting Note</label><textarea name="notes" required></textarea><button class="btn" style="width:100%;margin-top:12px">Save and Sync</button><div class="success" id="noteSuccess"></div></form>`);
}

function openAddJobModal() {
    modal(`<h2>Add Job Opening</h2>
    <p class="subtitle">Create a new job opportunity to be posted in the Job Opportunities section.</p>
    <form id="addJobForm">
        <label>Job Title *</label>
        <input name="title" required placeholder="e.g. Senior Product Manager">
        <label>Department *</label>
        <input name="department" required placeholder="e.g. Product & Design">
        <div class="two-col">
            <div>
                <label>Employment Type *</label>
                <select name="employment_type" required>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                </select>
            </div>
            <div>
                <label>Work Mode *</label>
                <select name="work_mode" required>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                </select>
            </div>
        </div>
        <label>Description *</label>
        <textarea name="description" required placeholder="Describe the responsibilities and requirements..." rows="4"></textarea>
        <button class="btn" style="width:100%;margin-top:18px">Post Job Opening</button>
        <div class="success" id="addJobSuccess"></div>
    </form>`);
}

function bindModalForms() {
    const consultForm = document.getElementById('consultForm');
    if (consultForm) consultForm.addEventListener('submit', async e => {
        e.preventDefault();
        const payload = Object.fromEntries(new FormData(consultForm));
        const result = await api('/api/consultations', { method: 'POST', body: JSON.stringify(payload) });
        document.getElementById('consultSuccess').textContent = result.message;
        document.getElementById('consultSuccess').classList.add('show');
    });
    const messageForm = document.getElementById('messageForm');
    if (messageForm) messageForm.addEventListener('submit', async e => {
        e.preventDefault();
        const result = await api(`/api/clients/${state.selectedClient.id}/messages`, { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(messageForm))) });
        state.selectedClient.communications = result.communications;
        openEmail();
    });
    const noteForm = document.getElementById('noteForm');
    if (noteForm) noteForm.addEventListener('submit', async e => {
        e.preventDefault();
        const result = await api(`/api/clients/${state.selectedClient.id}/meetings`, { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(noteForm))) });
        state.data.clients = result.clients;
        state.data.reports = result.reports;
        state.selectedClient = state.data.clients.find(c => Number(c.id) === Number(state.selectedClient.id));
        openMeetings();
    });
    const addJobForm = document.getElementById('addJobForm');
    if (addJobForm) addJobForm.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            const payload = Object.fromEntries(new FormData(addJobForm));
            const result = await api('/api/jobs', { method: 'POST', body: JSON.stringify(payload) });
            state.data.jobs = result.jobs;
            document.getElementById('addJobSuccess').textContent = 'Job opening successfully posted!';
            document.getElementById('addJobSuccess').classList.add('show');
            addJobForm.reset();
            setTimeout(() => {
                closeModal();
            }, 1500);
        } catch (err) {
            alert(err.message);
        }
    });
}

async function scheduleMeeting() {
    const dateInput = document.getElementById('meeting_date').value;
    const timeInput = document.getElementById('meeting_time').value;

    if (!dateInput || !timeInput) {
        return alert('Please select both a date and a time.');
    }

    const localDate = new Date(dateInput + 'T00:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[localDate.getDay()];

    let [hours, minutes] = timeInput.split(':');
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const slot = `${dayName}: ${hours}:${minutes} ${ampm}`;

    try {
        const result = await api('/api/available-slots', {
            method: 'POST',
            body: JSON.stringify({ slot })
        });
        state.data.availableSlots = result.availableSlots;
        render();
        alert('Slot added to available consultation times successfully!');
    } catch (err) {
        alert('Error adding slot.');
    }
}


async function load() {
    state.data = await api('/api/bootstrap');
    syncView();
    render();
}

load();

window.go = go;
window.openConsultations = openConsultations;
window.setRole = setRole;
window.logout = logout;
window.openClient = openClient;
window.closeModal = closeModal;
window.scheduleMeeting = scheduleMeeting;
window.openEmail = openEmail;
window.openConsultationDetails = openConsultationDetails;
window.openLocation = openLocation;
window.openMeetings = openMeetings;
window.render = render;
window.switchTab = switchTab;
window.openAddJobModal = openAddJobModal;