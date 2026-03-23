<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Welcome Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
</head>

<body style="margin:0; padding:0; font-family:'Poppins', Arial, sans-serif; background-color:#f5f7fa;">

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding:20px;">

                <!-- MAIN CONTAINER -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600"
                    style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0;">

                    <!-- Company Logo and Name -->
                    <tr>
                        <td align="center" style="padding:25px 0 15px;">
                            @if(isset($parentCompanyInfo['logo']) && $parentCompanyInfo['logo'])
                                <img src="{{ $parentCompanyInfo['logo'] }}" 
                                     alt="{{ $parentCompanyInfo['name'] ?? 'Company' }} Logo" 
                                     style="max-width:180px; height:auto; display:block;" />
                                @if(isset($parentCompanyInfo['name']) && $parentCompanyInfo['name'])
                                    <div style="font-size:18px; font-weight:bold; color:#333; margin-top:10px;">
                                        {{ $parentCompanyInfo['name'] }}
                                    </div>
                                @endif
                            @else
                                <div style="font-size:24px; font-weight:bold; color:#0d958a; margin-bottom:10px;">
                                    {{ config('app.name') }}
                                </div>
                            @endif
                        </td>
                    </tr>

                    <!-- Welcome Text -->
                    <tr>
                        <td align="center" style="padding:0 20px 20px;">
                            <h2 style="color:#1e293b; margin:0; font-size:20px; font-weight:700;">
                                Welcome, {{ $name }}!
                            </h2>
                            <p style="color:#475569; font-size:14px; font-weight:400; margin: 10px 0 0;">
                                Your driver account has been successfully created. You can now access the system using the credentials below.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Credentials Section -->
                    <tr>
                        <td style="padding:0 30px 15px;">

                            <!-- Email Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="border:1px solid #e2e8f0; border-radius:10px; background:#f9fafb; margin-bottom:15px;">
                                <tr>
                                    <td style="padding:15px;">
                                        <div>
                                            <p style="margin:0; font-size:13px; color:#64748b;">Email Address</p>
                                            <p style="margin:4px 0 0; font-size:14px; font-weight:600; color:#334155;">
                                                {{ $username }}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Password Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="border:1px solid #e2e8f0; border-radius:10px; background:#f9fafb;">
                                <tr>
                                    <td style="padding:15px;">
                                        <div>
                                            <p style="margin:0; font-size:13px; color:#64748b;">Temporary Password</p>
                                            <p style="margin:4px 0 0; font-size:16px; font-family:monospace; font-weight:700; color:#0d958a; letter-spacing:1px;">
                                                {{ $password }}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Security Reminder -->
                    <tr>
                        <td style="padding:0 30px 25px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="border:1px solid #fcd34d; background:#fffbeb; border-radius:10px;">
                                <tr>
                                    <td style="padding:15px;">
                                        <div>
                                            <p style="margin:0; color:#92400e; font-size:13px; font-weight:600;">
                                                ⚠️ Security Reminder
                                            </p>
                                            <p style="margin:5px 0 0; color:#b45309; font-size:13px; font-weight:400;">
                                                For security reasons, please change your password immediately after your first login.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Login Button -->
                    <tr>
                        <td style="padding:0 30px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="border-radius:5px; background:#0d958a;">
                                        <a href="{{ url('/login') }}"
                                            style="text-decoration:none; font-size:14px; padding:12px 30px; 
                                                   color:#ffffff; font-weight:600; display:inline-block;">
                                            Login to Your Account
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
                <!-- END MAIN CONTAINER -->

                <!-- Footer -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600"
                    style="max-width:600px; margin:20px auto 0;">
                    <tr>
                        <td style="padding:20px; text-align:center; color:#94a3b8; font-size:12px;">
                            <p style="margin:0;">This email was sent to {{ $username }} as part of your driver account creation.</p>
                            <p style="margin:10px 0 0;">&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>

</body>

</html>