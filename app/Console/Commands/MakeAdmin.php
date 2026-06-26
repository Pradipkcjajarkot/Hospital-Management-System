<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeAdmin extends Command
{
    protected $signature = 'make:admin {email?}';

    protected $description = 'Set a user as admin (or create one if no email given)';

    public function handle()
    {
        $email = $this->argument('email');

        if ($email) {
            $user = User::where('email', $email)->first();
            if (!$user) {
                $this->error("User with email '{$email}' not found.");
                return 1;
            }
            $user->update(['role' => 'admin']);
            $this->info("User '{$email}' is now admin!");
            return 0;
        }

        $name = $this->ask('Name', 'Admin');
        $email = $this->ask('Email', 'admin@hospital.com');
        $password = $this->secret('Password');

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role' => 'admin',
            'status' => 'active',
        ]);

        $this->info("Admin user '{$email}' created successfully!");
        return 0;
    }
}
