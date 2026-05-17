<?php

use App\Http\Controllers\CrmController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', [CrmController::class, 'index'])->name('home');
Route::get('/jobs', [CrmController::class, 'index'])->name('jobs');
Route::get('/talk', [CrmController::class, 'index'])->name('talk');
Route::get('/login', [CrmController::class, 'index'])->name('login');
Route::get('/crm', [CrmController::class, 'index'])->name('crm');
Route::get('/forecast', [CrmController::class, 'index'])->name('forecast');


Route::prefix('api')->group(function () {
    Route::get('/bootstrap', [CrmController::class, 'bootstrap']);
    Route::post('/login', [CrmController::class, 'login']);
    Route::post('/leads', [CrmController::class, 'storeLead']);
    Route::post('/consultations', [CrmController::class, 'requestConsultation']);
    Route::post('/clients/{client}/messages', [CrmController::class, 'sendMessage']);
    Route::post('/clients/{client}/meetings', [CrmController::class, 'addMeetingNote']);
    Route::post('/projects', [CrmController::class, 'addProject']);
    Route::post('/jobs', [CrmController::class, 'addJob']);
    Route::post('/available-slots', [CrmController::class, 'addAvailableSlot']);
});

