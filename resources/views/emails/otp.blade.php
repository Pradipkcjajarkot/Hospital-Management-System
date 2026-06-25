<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f4f7; margin: 0; padding: 0; }
        .container { max-width: 480px; margin: 40px auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .logo { text-align: center; margin-bottom: 24px; }
        .logo span { font-size: 28px; font-weight: 700; color: #dc2626; }
        h1 { text-align: center; font-size: 20px; color: #1f2937; margin-bottom: 8px; }
        p { text-align: center; color: #6b7280; font-size: 14px; line-height: 1.6; }
        .code { text-align: center; font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #dc2626; margin: 24px 0; padding: 16px; background: #fef2f2; border-radius: 8px; }
        .footer { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo"><span>MediCare Hospital</span></div>
        <h1>Your Verification Code</h1>
        <p>Use the code below to complete your login. This code expires in 10 minutes.</p>
        <div class="code">{{ $otp }}</div>
        <p>If you did not request this code, please ignore this email.</p>
        <div class="footer">&copy; {{ date('Y') }} MediCare Hospital Management System</div>
    </div>
</body>
</html>
