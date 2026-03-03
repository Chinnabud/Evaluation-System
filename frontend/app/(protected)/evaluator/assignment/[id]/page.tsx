'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAssignmentForEvaluator, giveScore } from '../../../../../services/evaluator';
import BackButton from '../../../../../components/BackButton';
import Swal from 'sweetalert2';
import { Save } from 'lucide-react';

export default function EvaluatorAssignmentPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const assignmentId = parseInt(params.id);

    const [assignment, setAssignment] = useState<any>(null);
    const [scores, setScores] = useState<Record<number, number>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await getAssignmentForEvaluator(assignmentId);
                if (res.status === 'success') {
                    setAssignment(res.data.assignment);

                    const initialScores: Record<number, number> = {};
                    res.data.assignment.results?.forEach((r: any) => {
                        initialScores[r.indicatorId] = r.score;
                    });
                    setScores(initialScores);
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'ไม่สามารถโหลดข้อมูลแบบประเมินได้',
                    background: '#0f172a',
                    color: '#fff',
                    confirmButtonColor: '#6366f1'
                });
            }
        };

        fetchAssignment();
    }, [assignmentId]);

    if (!assignment) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                    <p className="text-slate-500">Loading evaluation data...</p>
                </div>
            </div>
        );
    }

    const evaluation = assignment.evaluation;
    const evaluatee = assignment.evaluatee;

    const handleScoreChange = (indicatorId: number, score: number) => {
        setScores(prev => ({ ...prev, [indicatorId]: score }));
    };

    const handleSubmit = async () => {
        // ✅ Validation: ต้องให้คะแนนครบทุกข้อ
        const totalIndicators = evaluation.topics
            .flatMap((t: any) => t.indicators)
            .length;

        if (Object.keys(scores).length !== totalIndicators) {
            Swal.fire({
                icon: 'warning',
                title: 'ยังให้คะแนนไม่ครบ',
                text: 'กรุณาให้คะแนนทุกข้อก่อนบันทึก',
                confirmButtonColor: '#6366f1'
            });
            return;
        }

        setSaving(true);

        try {
            // 🔥 บันทึกพร้อมกันทั้งหมด (เร็วขึ้น)
            await Promise.all(
                Object.entries(scores).map(([indicatorId, score]) =>
                    giveScore(assignmentId, {
                        indicatorId: Number(indicatorId),
                        score
                    })
                )
            );

            await Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'บันทึกผลการประเมินเรียบร้อยแล้ว',
                confirmButtonColor: '#6366f1'
            });

            // ✅ Redirect ไปหน้า result
            router.push(`/evaluator/assignments/${assignmentId}/result`);

        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึก',
                confirmButtonColor: '#6366f1'
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8">

            <BackButton label="รายการประเมินที่ได้รับมอบหมาย" />

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold">
                    ประเมิน {evaluatee?.name}
                </h1>
                <p className="mt-2 text-indigo-100">
                    แบบประเมิน: {evaluation?.name}
                </p>
            </div>

            <div className="space-y-8">
                {evaluation?.topics?.map((topic: any, index: number) => (
                    <div
                        key={topic.id}
                        className="bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-lg overflow-hidden transition hover:shadow-xl"
                    >
                        <div className="bg-slate-100 px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold text-slate-800">
                                ส่วนที่ {index + 1}: {topic.name}
                            </h2>
                        </div>

                        <div className="p-6 space-y-8">
                            {topic.indicators?.map((indicator: any, indIndex: number) => {
                                const currentScore = scores[indicator.id];

                                return (
                                    <div key={indicator.id} className="space-y-4">

                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                {indIndex + 1}. {indicator.name}
                                                <span className="ml-3 text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                                                    น้ำหนัก {indicator.weight}%
                                                </span>
                                            </p>
                                            {indicator.description && (
                                                <p className="text-sm text-slate-500 mt-1">
                                                    {indicator.description}
                                                </p>
                                            )}
                                        </div>

                                        {indicator.type === 'SCALE_1_4' && (
                                            <div className="flex gap-4">
                                                {[1, 2, 3, 4].map(scoreVal => (
                                                    <button
                                                        key={scoreVal}
                                                        onClick={() => handleScoreChange(indicator.id, scoreVal)}
                                                        className={`px-6 py-3 rounded-xl border transition-all font-semibold
                                                        ${currentScore === scoreVal
                                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105'
                                                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:scale-105'
                                                            }`}
                                                    >
                                                        ระดับ {scoreVal}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {indicator.type === 'YES_NO' && (
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleScoreChange(indicator.id, 1)}
                                                    className={`px-6 py-3 rounded-xl font-semibold border transition-all
                                                    ${currentScore === 1
                                                            ? 'bg-green-600 text-white border-green-600 shadow-lg'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-green-50'
                                                        }`}
                                                >
                                                    ใช่ / ผ่าน
                                                </button>

                                                <button
                                                    onClick={() => handleScoreChange(indicator.id, 0)}
                                                    className={`px-6 py-3 rounded-xl font-semibold border transition-all
                                                    ${currentScore === 0
                                                            ? 'bg-red-600 text-white border-red-600 shadow-lg'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-red-50'
                                                        }`}
                                                >
                                                    ไม่ใช่ / ไม่ผ่าน
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-6">
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-105 disabled:opacity-70"
                >
                    {saving ? 'กำลังบันทึก...' : <><Save size={22} /> บันทึกผลการประเมิน</>}
                </button>
            </div>

        </div>
    );
}