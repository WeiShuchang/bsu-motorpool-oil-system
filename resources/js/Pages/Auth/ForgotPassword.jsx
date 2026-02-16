import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Droplet, ArrowLeft, Mail, HelpCircle } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password - BSU Motorpool" />
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
                {/* Back to Home Button */}
                <div className="absolute top-4 left-4">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium text-green-700 hover:bg-green-50 h-9 px-4 py-2 transition-colors"
                    >
                        <ArrowLeft className="size-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                {/* Back to Login Button */}
                <div className="absolute top-4 right-4">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium text-green-600 hover:text-green-700 h-9 px-4 py-2 transition-colors"
                    >
                        Back to Login
                    </Link>
                </div>

                {/* Forgot Password Card */}
                <div className="bg-white rounded-xl border w-full max-w-md shadow-lg border-green-100 mt-10">
                    {/* Card Header */}
                    <div className="px-6 pt-6 pb-2 space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="bg-green-600 p-3 rounded-full">
                                <HelpCircle className="size-8 text-white" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h4 className="text-xl font-bold text-green-700">
                                Forgot Password?
                            </h4>
                            <p className="text-sm text-gray-500">
                                Reset your password in two easy steps
                            </p>
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="px-6 pb-6">
                        {/* Instructions */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-600">
                                Forgot your password? No problem. Just let us know your email address 
                                and we'll send you a password reset link.
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-green-100 w-6 h-6 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-semibold text-green-700">1</span>
                                </div>
                                <span className="text-xs text-gray-600">Enter email</span>
                            </div>
                            <div className="w-8 h-px bg-green-200"></div>
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-semibold text-gray-400">2</span>
                                </div>
                                <span className="text-xs text-gray-400">Check inbox</span>
                            </div>
                            <div className="w-8 h-px bg-green-200"></div>
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-semibold text-gray-400">3</span>
                                </div>
                                <span className="text-xs text-gray-400">Reset password</span>
                            </div>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                                <p className="text-sm font-medium text-green-700">
                                    {status}
                                </p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label 
                                    htmlFor="email" 
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                                >
                                    <Mail className="size-3.5" />
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-green-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:border-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter your email address"
                                    required
                                    autoComplete="email"
                                    autoFocus
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-medium h-10 px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin size-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending Reset Link...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="size-4 mr-2" />
                                        Send Password Reset Link
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Help Tips */}
                        <div className="mt-6 space-y-2">
                            <div className="flex items-start gap-2 text-xs text-gray-500">
                                <div className="w-1 h-1 bg-green-400 rounded-full mt-1.5"></div>
                                <p>Check your spam folder if you don't see the email in your inbox</p>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-gray-500">
                                <div className="w-1 h-1 bg-green-400 rounded-full mt-1.5"></div>
                                <p>The reset link will expire after 60 minutes for security</p>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-gray-500">
                                <div className="w-1 h-1 bg-green-400 rounded-full mt-1.5"></div>
                                <p>Make sure to use the email associated with your account</p>
                            </div>
                        </div>

                        {/* Contact Support */}
                        <div className="mt-6 pt-4 border-t border-green-100 text-center">
                            <p className="text-xs text-gray-400">
                                Still having trouble?{' '}
                                <Link 
                                    href="#" 
                                    className="text-green-600 hover:text-green-700 font-medium"
                                >
                                    Contact Support
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}