import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Droplet, ArrowLeft, User, Users } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [userType, setUserType] = useState('driver');
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        user_type: 'driver', // Add user_type to form data
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Make sure user_type is set before submitting
        setData('user_type', userType);
        
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleTabChange = (type) => {
        setUserType(type);
        setData('user_type', type);
    };

    return (
        <>
            <Head title="Log in - BSU Motorpool" />
            
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

                {/* Login Card */}
                <div className="bg-white rounded-xl border w-full max-w-md shadow-lg border-green-100 mt-10">
                    {/* Card Header */}
                    <div className="px-6 pt-6 pb-2 space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="bg-green-600 p-3 rounded-full">
                                <Droplet className="size-8 text-white" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h4 className="text-xl font-bold text-green-700">
                                BSU Motorpool
                            </h4>
                            <p className="text-sm text-gray-500">
                                Oil & Lubrication Tracking System
                            </p>
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="px-6 pb-6">
                        {/* Tab Selection */}
                        <div className="flex flex-col gap-2 w-full">
                            <div className="bg-gray-100 text-gray-500 h-9 items-center justify-center rounded-xl p-[3px] grid w-full grid-cols-2">
                                <button
                                    type="button"
                                    role="tab"
                                    onClick={() => handleTabChange('driver')}
                                    className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium transition-all ${
                                        userType === 'driver'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Driver Login
                                </button>
                                <button
                                    type="button"
                                    role="tab"
                                    onClick={() => handleTabChange('admin')}
                                    className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium transition-all ${
                                        userType === 'admin'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Admin Login
                                </button>
                            </div>

                            {/* Login Form */}
                            <div className="space-y-4 mt-4">
                                <form onSubmit={submit} className="space-y-4">
                                    {/* Status Message */}
                                    {status && (
                                        <div className="mb-4 text-sm font-medium text-green-600">
                                            {status}
                                        </div>
                                    )}

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label 
                                            htmlFor="email" 
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-green-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:border-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Enter your email"
                                            required
                                            autoComplete="username"
                                            autoFocus
                                        />
                                        <InputError message={errors.email} className="mt-1" />
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <label 
                                            htmlFor="password" 
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700"
                                        >
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-green-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:border-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Enter your password"
                                            required
                                            autoComplete="current-password"
                                        />
                                        <InputError message={errors.password} className="mt-1" />
                                    </div>

                                    {/* Remember Me Checkbox */}
                                    <div className="flex items-center">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
                                        />
                                        <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                            Remember me
                                        </label>
                                    </div>

                                    {/* Hidden user_type field */}
                                    <input type="hidden" name="user_type" value={userType} />

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-medium h-9 px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {userType === 'driver' ? (
                                            <User className="size-4 mr-2" />
                                        ) : (
                                            <Users className="size-4 mr-2" />
                                        )}
                                        Login as {userType === 'driver' ? 'Driver' : 'Administrator'}
                                    </button>
                                </form>

                                {/* Forgot Password Link */}
                                {canResetPassword && (
                                    <div className="text-center mt-4">
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-gray-600 hover:text-green-700 underline underline-offset-2 transition-colors"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                )}

                              
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}