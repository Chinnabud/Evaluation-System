'use client';

import { useState, useEffect, use } from 'react';
import { getEvaluationsForEvaluator } from '../../../../../services/evaluator';
import BackButton from '../../../../../components/BackButton';
import Link from 'next/link';

export default function EvaluatorAssignmentsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const evaluationId = parseInt(resolvedParams.id);
    const [evaluation, setEvaluation] = useState<any>(null);
    const [assignments, setAssignments] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getEvaluationsForEvaluator(evaluationId);
                if (res.status === 'success') {
                    setEvaluation(res.data.evaluation);
                    setAssignments(res.data.assignments || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [evaluationId]);

    if (!evaluation)
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 text-sm">กำลังโหลดข้อมูลการประเมิน...</p>
                </div>
            </div>
        );

    const totalIndicators =
        evaluation.topics?.reduce(
            (acc: number, topic: any) => acc + (topic.indicators?.length || 0),
            0
        ) || 0;

    return (
        <div className="space-y-6">

            <BackButton label="รายการการประเมิน" />

            {/* Evaluation Header */}
            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-slate-200">
                <h1 className="text-3xl font-bold text-slate-800">
                    {evaluation.name}
                </h1>
                <p className="text-sm text-slate-500 mt-3">
                    เริ่ม {new Date(evaluation.startAt).toLocaleDateString()} 
                    {' '}–{' '}
                    สิ้นสุด {new Date(evaluation.endAt).toLocaleDateString()}
                </p>
            </div>

            {/* Assignments Table */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-slate-100/70 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ลำดับ</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ชื่อผู้รับการประเมิน</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">สถานะการแนบหลักฐาน</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ความคืบหน้าการประเมิน</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">จัดการ</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200">
                            {assignments.map((assignment, index) => {
                                const scoredCount = assignment.results?.length || 0;
                                const progress =
                                    totalIndicators > 0
                                        ? (scoredCount / totalIndicators) * 100
                                        : 0;

                                const isCompleted =
                                    scoredCount === totalIndicators && totalIndicators > 0;

                                return (
                                    <tr
                                        key={assignment.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                            {assignment.evaluatee?.name}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-amber-600 font-medium">
                                            รอตรวจสอบหลักฐาน
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-full bg-slate-200 rounded-full h-2 min-w-[120px] max-w-[220px] overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-slate-500 font-medium">
                                                    {scoredCount}/{totalIndicators}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            {isCompleted ? (
                                                <Link
                                                    href={`/evaluator/assignment/${assignment.id}/result`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 hover:scale-[1.03] active:scale-[0.97] transition-all text-sm font-semibold"
                                                >
                                                    ✓ ดูผลการประเมิน
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/evaluator/assignment/${assignment.id}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all text-sm font-semibold"
                                                >
                                                    เริ่มประเมิน
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {assignments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-slate-400 text-sm">
                                        ยังไม่มีผู้รับการประเมินในแบบประเมินนี้
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