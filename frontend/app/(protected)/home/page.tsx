'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getAdminEvaluations } from '../../../services/admin';
import { getEvaluationsForEvaluator } from '../../../services/evaluator';
import { getMyEvaluations } from '../../../services/evaluatee';
import { Users, ClipboardList, CheckSquare } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalEvaluations: 0,
        totalEvaluators: 24,
        totalEvaluatees: 156,
        assignedEvaluations: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.role === 'ADMIN') {
                    const res = await getAdminEvaluations();
                    if (res.status === 'success') {
                        setStats(prev => ({
                            ...prev,
                            totalEvaluations: res.data.evaluations.length,
                        }));
                    }
                } else if (user?.role === 'EVALUATOR') {
                    const res = await getEvaluationsForEvaluator();
                    if (res.status === 'success') {
                        setStats(prev => ({
                            ...prev,
                            assignedEvaluations: res.data.evaluations?.length || 0,
                        }));
                    }
                } else if (user?.role === 'EVALUATEE') {
                    const res = await getMyEvaluations();
                    if (res.status === 'success') {
                        setStats(prev => ({
                            ...prev,
                            assignedEvaluations: res.data.assignments?.length || 0,
                        }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    if (!user) return null;

    const Card = ({ children }: { children: React.ReactNode }) => (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            {children}
        </div>
    );

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-xl">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-indigo-100 mt-2">
                    ยินดีต้อนรับ {user.name} ({user.role})
                </p>
            </div>

            {loading && (
                <div className="flex justify-center py-12">
                    <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                </div>
            )}

            {!loading && (
                <>
                    {user.role === 'ADMIN' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            <Link href="/admin/evaluations">
                                <Card>
                                    <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600 rounded-full flex items-center justify-center mb-5 shadow-inner">
                                        <ClipboardList size={26} />
                                    </div>
                                    <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                                        {stats.totalEvaluations}
                                    </h2>
                                    <p className="text-slate-500 font-medium mt-2">
                                        จำนวนการประเมินทั้งหมด
                                    </p>
                                </Card>
                            </Link>

                            <Card>
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-full flex items-center justify-center mb-5 shadow-inner">
                                    <Users size={26} />
                                </div>
                                <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                                    {stats.totalEvaluators}
                                </h2>
                                <p className="text-slate-500 font-medium mt-2">
                                    จำนวน EVALUATOR
                                </p>
                            </Card>

                            <Card>
                                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-full flex items-center justify-center mb-5 shadow-inner">
                                    <Users size={26} />
                                </div>
                                <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                                    {stats.totalEvaluatees}
                                </h2>
                                <p className="text-slate-500 font-medium mt-2">
                                    จำนวน EVALUATEE
                                </p>
                            </Card>

                        </div>
                    )}

                    {user.role === 'EVALUATOR' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Link href="/evaluator/evaluations">
                                <Card>
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 rounded-full flex items-center justify-center mb-5 shadow-inner">
                                        <CheckSquare size={26} />
                                    </div>
                                    <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                                        {stats.assignedEvaluations}
                                    </h2>
                                    <p className="text-slate-500 font-medium mt-2">
                                        รายการประเมินที่ได้รับมอบหมาย
                                    </p>
                                </Card>
                            </Link>
                        </div>
                    )}

                    {user.role === 'EVALUATEE' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Link href="/evaluatee/evaluations">
                                <Card>
                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mb-5 shadow-inner">
                                        <CheckSquare size={26} />
                                    </div>
                                    <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                                        {stats.assignedEvaluations}
                                    </h2>
                                    <p className="text-slate-500 font-medium mt-2">
                                        การประเมินที่ต้องรับการประเมิน
                                    </p>
                                </Card>
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}