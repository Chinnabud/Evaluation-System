'use client';

import { useState, useEffect } from 'react';
import { getEvaluationsForEvaluator } from '../../../../services/evaluator';
import BackButton from '../../../../components/BackButton';
import Link from 'next/link';
import { Users } from 'lucide-react';

export default function EvaluatorEvaluationsPage() {
    const [evaluations, setEvaluations] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getEvaluationsForEvaluator();
                if (res.status === 'success') {
                    setEvaluations(res.data.evaluations || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">

            <BackButton />

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">
                    รายการแบบประเมินที่ได้รับมอบหมาย
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                    จัดการผู้ถูกประเมินในแต่ละแบบประเมิน
                </p>
            </div>

            {/* Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-slate-100/70 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    ลำดับ
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    ชื่อการประเมิน
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    จัดการคู่ประเมิน
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200">
                            {evaluations.map((ev, index) => (
                                <tr
                                    key={ev.id}
                                    className="hover:bg-slate-50 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {index + 1}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                        {ev.name}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <Link
                                            href={`/evaluator/evaluations/${ev.id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all text-sm font-medium"
                                        >
                                            <Users size={16} />
                                            จัดการคู่ประเมิน
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {evaluations.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <Users size={36} className="opacity-40" />
                                            <p className="text-sm">
                                                ยังไม่มีแบบประเมินที่ได้รับมอบหมาย
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}