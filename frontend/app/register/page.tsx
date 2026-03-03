'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../services/auth';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'EVALUATEE',
        departmentId: 1
    });
    const [loading, setLoading] = useState(false);

    const departments = [
        { id: 1, name: 'HR' },
        { id: 2, name: 'IT' },
        { id: 3, name: 'Sales' },
        { id: 4, name: 'Marketing' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) return;

        setLoading(true);
        try {
            const res = await register({
                ...formData,
                departmentId: Number(formData.departmentId)
            });
            if (res.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'ลงทะเบียนสำเร็จ',
                    text: 'กรุณาเข้าสู่ระบบเพื่อใช้งาน',
                    timer: 2000,
                    showConfirmButton: false,
                });
                router.push('/login');
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'ลงทะเบียนไม่สำเร็จ',
                text: error.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/40">
                    
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary-700">
                            ลงทะเบียนเข้าใช้งาน
                        </h1>
                        <p className="text-slate-500 text-sm mt-2">
                            Personnel Assessment System
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                ชื่อ - นามสกุล
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                แผนก
                            </label>
                            <select
                                value={formData.departmentId}
                                onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
                            >
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                บทบาท (Role)
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
                            >
                                <option value="EVALUATEE">ผู้รับการประเมิน (EVALUATEE)</option>
                                <option value="EVALUATOR">ผู้ประเมิน (EVALUATOR)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {loading ? 'กำลังบันทึก...' : 'ลงทะเบียน'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        มีบัญชีผู้ใช้งานอยู่แล้ว?{' '}
                        <Link
                            href="/login"
                            className="text-primary-600 hover:text-primary-800 font-semibold transition"
                        >
                            เข้าสู่ระบบ
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}