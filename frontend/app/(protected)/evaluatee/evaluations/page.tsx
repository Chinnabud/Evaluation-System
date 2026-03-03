'use client';

import { useState, useEffect } from 'react';
import { getMyEvaluations } from '../../../../services/evaluatee';
import BackButton from '../../../../components/BackButton';
import Link from 'next/link';
import { FileText, ClipboardList, CalendarDays } from 'lucide-react';

export default function EvaluateeEvaluationsPage() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getMyEvaluations();
                if (res.status === 'success') {
                    setAssignments(res.data.assignments || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStatusBadge = (assignment: any) => {
        if (assignment.status === 'COMPLETED') {
            return (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                    ประเมินแล้ว
                </span>
            );
        }
        return (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                รอการประเมิน
            </span>
        );
    };

    return (
        <div className="space-y-8">

            <BackButton />

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <ClipboardList size={28} />
                    การประเมินของฉัน
                </h1>
                <p className="mt-2 text-indigo-100">
                    คุณมีทั้งหมด {assignments.length} รายการ
                </p>
            </div>

            {/* Content */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500">กำลังโหลดข้อมูล...</p>
                    </div>
                ) : assignments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                        <ClipboardList size={40} className="mb-4 opacity-40" />
                        <p className="text-lg font-medium">ไม่มีข้อมูลการประเมิน</p>
                        <p className="text-sm mt-2">เมื่อมีการมอบหมายแบบประเมิน รายการจะแสดงที่นี่</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 text-left">#</th>
                                    <th className="px-6 py-4 text-left">ชื่อการประเมิน</th>
                                    <th className="px-6 py-4 text-left">ผู้ประเมิน</th>
                                    <th className="px-6 py-4 text-left">สถานะ</th>
                                    <th className="px-6 py-4 text-center">จัดการ</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200">
                                {assignments.map((assignment, index) => (
                                    <tr
                                        key={assignment.id}
                                        className="hover:bg-indigo-50/50 transition"
                                    >
                                        <td className="px-6 py-5 text-sm text-slate-500">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="font-semibold text-slate-800">
                                                {assignment.evaluation?.name}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                <CalendarDays size={14} />
                                                {assignment.evaluation?.startAt &&
                                                    new Date(assignment.evaluation.startAt).toLocaleDateString()}
                                                {' - '}
                                                {assignment.evaluation?.endAt &&
                                                    new Date(assignment.evaluation.endAt).toLocaleDateString()}
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            {assignment.evaluator?.name}
                                        </td>

                                        <td className="px-6 py-5">
                                            {getStatusBadge(assignment)}
                                        </td>

                                        <td className="px-6 py-5 text-center">
                                            <Link
                                                href={`/evaluatee/evaluations/${assignment.evaluationId}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg text-sm font-semibold"
                                            >
                                                <FileText size={16} />
                                                ดูรายละเอียด
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

        </div>
    );
}