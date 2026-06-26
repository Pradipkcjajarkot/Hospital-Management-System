<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        if (User::count() === 0) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@hospital.com',
                'password' => 'admin123',
                'role' => 'admin',
                'status' => 'active',
            ]);
            $this->command->info('Default admin user created: admin@hospital.com / admin123');
        }

        $user = User::where('email', 'neupane0123456@yopmail.com')->first()
              ?? User::whereNull('role')->orderBy('id')->first()
              ?? User::orderBy('id')->first();
        if ($user && $user->role !== 'admin') {
            $user->update(['role' => 'admin']);
            $this->command->info("User '{$user->email}' has been set as admin.");
        }
    }
}
