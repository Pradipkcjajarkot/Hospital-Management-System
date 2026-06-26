<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        foreach ($users as $user) {
            $user->notifications()->create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\InfoNotification',
                'data' => json_encode(['title' => 'Welcome to MediCare', 'body' => 'Your account has been created successfully.']),
                'created_at' => now()->subHours(rand(1, 48)),
            ]);
            $user->notifications()->create([
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\InfoNotification',
                'data' => json_encode(['title' => 'New Appointment', 'body' => 'A new appointment has been scheduled for tomorrow.']),
                'created_at' => now()->subHours(rand(1, 24)),
            ]);
        }
        $this->command->info('Seeded ' . ($users->count() * 2) . ' notifications');
    }
}
