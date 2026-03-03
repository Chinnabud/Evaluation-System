'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { login } from '@/services/auth';

export default function LoginPage() {
    const { loginState } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setLoading(true);
        try {
            const res = await login({ email, password });
            if (res.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'เข้าสู่ระบบสำเร็จ',
                    timer: 1500,
                    showConfirmButton: false,
                });
                loginState(res.token, res.data.user);
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: error.response?.data?.message || 'Email หรือ Password ไม่ถูกต้อง',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 relative overflow-hidden">

            {/* subtle background glow */}
            <div className="absolute w-96 h-96 bg-primary-400/10 rounded-full blur-3xl -top-20 -left-20"></div>
            <div className="absolute w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -bottom-20 -right-20"></div>

            <div className="relative bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full transition-all duration-300">

                <h1 className="text-3xl font-extrabold text-center text-primary-700 mb-10 tracking-tight">
                    Personnel Assessment System
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl 
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                            shadow-sm transition-all duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl 
                            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                            shadow-sm transition-all duration-200"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-indigo-600 
                        text-white rounded-xl font-semibold shadow-lg 
                        hover:shadow-xl hover:scale-[1.02] 
                        transition-all duration-300 disabled:opacity-60 disabled:scale-100"
                    >
                        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>

                </form>

                <p className="mt-8 text-center text-slate-500 text-sm">
                    ยังไม่มีบัญชีผู้ใช้งานใช่หรือไม่?{' '}
                    <Link
                        href="/register"
                        className="text-primary-600 hover:text-primary-800 font-semibold transition"
                    >
                        สมัครตรงนี้เลย
                    </Link>
                </p>
            </div>
        </div>
    );
}