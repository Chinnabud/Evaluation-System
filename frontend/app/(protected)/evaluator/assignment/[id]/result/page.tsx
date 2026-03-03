'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getAssignmentForEvaluator } from '../../../../../../services/evaluator';
import BackButton from '../../../../../../components/BackButton';

export default function EvaluatorAssignmentResultPage() {
    const params = useParams();
    const assignmentId = parseInt(params.id as string);

    const [assignment, setAssignment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!assignmentId || isNaN(assignmentId)) return; // 🔥 กัน NaN

        const fetchAssignment = async () => {
            try {
                const res = await getAssignmentForEvaluator(assignmentId);

                if (res.status === 'success') {
                    setAssignment(res.data.assignment);
                } else {
                    throw new Error('โหลดข้อมูลไม่สำเร็จ');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();
    }, [assignmentId]);

    if (loading) {
        return (
            <div className="p-8 text-center text-slate-500">
                Loading...
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="p-8 text-center text-slate-500">
                ไม่พบข้อมูลการประเมิน
            </div>
        );
    }

    const evaluation = assignment.evaluation;
    const evaluatee = assignment.evaluatee;

    // 🔥 ป้องกัน undefined
    const resultsMap: Record<number, number> = {};
    assignment.results?.forEach((r: any) => {
        resultsMap[r.indicatorId] = r.score;
    });

    return (
        <div>
            <div className="mb-6">
                <BackButton label="รายการประเมินที่ได้รับมอบหมาย" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 bg-green-50">
                <h1 className="text-2xl font-bold text-green-800">
                    ผลการประเมิน {evaluatee?.name} (เสร็จสิ้น)
                </h1>
                <p className="text-sm text-green-600 mt-1">
                    แบบประเมิน: {evaluation?.name}
                </p>
            </div>

            <div className="space-y-6 opacity-70">
                {evaluation?.topics?.map((topic: any, index: number) => (
                    <div
                        key={topic.id}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800">
                                ส่วนที่ {index + 1}: {topic.name}
                            </h2>
                        </div>

                        <div className="p-6">
                            {topic.indicators?.map(
                                (indicator: any, indIndex: number) => {
                                    const currentScore =
                                        resultsMap[indicator.id];

                                    return (
                                        <div
                                            key={indicator.id}
                                            className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-slate-100 last:border-0 flex justify-between items-center"
                                        >
                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {indIndex + 1}.{' '}
                                                    {indicator.name}
                                                    <span className="text-xs text-primary-600 ml-2">
                                                        (น้ำหนัก {indicator.weight}%)
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                {indicator.type ===
                                                    'SCALE_1_4' && (
                                                    <span className="font-bold text-lg bg-primary-100 text-primary-800 px-4 py-1.5 rounded-lg border border-primary-200">
                                                        ระดับ{' '}
                                                        {currentScore ?? '-'}
                                                    </span>
                                                )}

                                                {indicator.type ===
                                                    'YES_NO' && (
                                                    <span
                                                        className={`font-bold text-lg px-4 py-1.5 rounded-lg border ${
                                                            currentScore === 1
                                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                                : currentScore === 0
                                                                ? 'bg-red-100 text-red-800 border-red-200'
                                                                : 'bg-gray-100 text-gray-600 border-gray-200'
                                                        }`}
                                                    >
                                                        {currentScore === 1
                                                            ? 'ใช่ / ผ่าน'
                                                            : currentScore === 0
                                                            ? 'ไม่ใช่ / ไม่ผ่าน'
                                                            : '-'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}