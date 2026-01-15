'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Demo credentials
    const demoUsers = [
        { role: 'Teacher', email: 'akash.v@sies.edu.in', password: 'teacher123' },
        { role: 'HOD', email: 'priya.m@sies.edu.in', password: 'hod123' },
        { role: 'IQAC', email: 'meera.j@sies.edu.in', password: 'iqac123' },
        { role: 'Principal', email: 'vijay.d@sies.edu.in', password: 'principal123' },
        { role: 'Admin', email: 'admin@sies.edu.in', password: 'admin123' },
    ];

    const fillDemo = (user) => {
        setEmail(user.email);
        setPassword(user.password);
        setError('');
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side - Branding */}
            <div className="hidden w-1/2 bg-linear-to-br from-emerald-600 via-emerald-700 to-slate-900 lg:flex lg:flex-col lg:justify-between p-12">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white font-bold text-emerald-600 text-xl">
                            TA
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">SIES ERP</h1>
                            <p className="text-emerald-200">Teacher Appraisal System</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-4xl font-bold text-white leading-tight">
                        Streamline Your<br />
                        Academic Excellence<br />
                        Journey
                    </h2>
                    <p className="text-lg text-emerald-100 max-w-md">
                        A comprehensive teacher appraisal system designed to evaluate, track,
                        and enhance academic performance across all departments.
                    </p>
                    <div className="flex gap-8 pt-4">
                        <div>
                            <p className="text-3xl font-bold text-white">250+</p>
                            <p className="text-sm text-emerald-200">Teachers Evaluated</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">15+</p>
                            <p className="text-sm text-emerald-200">Departments</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">98%</p>
                            <p className="text-sm text-emerald-200">Satisfaction Rate</p>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-emerald-200">
                    © 2026 SIES Graduate School of Technology. All rights reserved.
                </p>
            </div>

            {/* Right side - Login Form */}
            <div className="flex flex-1 flex-col justify-center px-8 lg:px-16 xl:px-24">
                <div className="mx-auto w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="inline-flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 font-bold text-white">
                                TA
                            </div>
                            <span className="text-xl font-bold text-slate-900">SIES ERP</span>
                        </div>
                    </div>

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
                        <p className="mt-2 text-slate-600">
                            Please enter your credentials to access the appraisal system
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@sies.edu.in"
                            required
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="text-sm text-slate-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                                Forgot password?
                            </a>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            loading={loading}
                            icon={LogIn}
                        >
                            Sign in
                        </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-8">
                        <p className="text-sm text-slate-500 text-center mb-3">
                            Demo Credentials (click to auto-fill)
                        </p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {demoUsers.map((user) => (
                                <button
                                    key={user.role}
                                    onClick={() => fillDemo(user)}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-emerald-300 transition-colors"
                                >
                                    {user.role}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
