<?php

namespace App\Http\Controllers;

use App\Models\OtpLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

class AdminOtpController extends Controller
{
    public function index()
    {
        $otps = OtpLog::orderBy('id', 'desc')->paginate(20);
        return response()->json($otps);
    }

    public function show($id)
    {
        return response()->json(OtpLog::findOrFail($id));
    }

    public function resend($id)
    {
        $otpLog = OtpLog::findOrFail($id);
        $newOtp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $otpLog->update([
            'otp' => $newOtp,
            'status' => 'resent',
            'expires_at' => now()->addMinutes(5),
        ]);

        Mail::to($otpLog->email)->send(new OtpMail($newOtp, $otpLog->purpose));

        return response()->json(['message' => 'OTP resent successfully']);
    }
}
