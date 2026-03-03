'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getMyEvaluationDetails, uploadEvidence } from '../../../../../services/evaluatee';
import BackButton from '../../../../../components/BackButton';
import Swal from 'sweetalert2';
import { Upload, CheckCircle2 } from 'lucide-react';

export default function EvaluateeEvaluationDetailsPage() {
    const params = useParams();
    const evaluationId = parseInt(params.id as string);

    const [assignment, setAssignment] = useState<any>(null);
    const [evidenceList, setEvidenceList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingIndicatorId, setUploadingIndicatorId] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            const res = await getMyEvaluationDetails(evaluationId);
            if (res.status === 'success') {
                setAssignment(res.data.assignment);
                setEvidenceList(res.data.evidence || []);
            } else {
                throw new Error('โหลดข้อมูลไม่สำเร็จ');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'ไม่สามารถดึงข้อมูลได้', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!evaluationId || isNaN(evaluationId)) return; // 🔥 กัน NaN
        fetchData();
    }, [evaluationId]);

    const handleFileUpload = async (
        indicatorId: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const MAX_SIZE_MB = 10;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            Swal.fire('Error', `ขนาดไฟล์ต้องไม่เกิน ${MAX_SIZE_MB}MB`, 'error');
            e.target.value = '';
            return;
        }

        setUploadingIndicatorId(indicatorId);

        const formData = new FormData();
        formData.append('indicatorId', String(indicatorId));
        formData.append('evidence', file);

        try {
            const res = await uploadEvidence(evaluationId, formData);

            if (res.status !== 'success') {
                throw new Error(res.message);
            }

            Swal.fire('สำเร็จ', 'อัปโหลดหลักฐานเรียบร้อยแล้ว', 'success');
            fetchData();
        } catch (err: any) {
            console.error(err);
            Swal.fire('Error', err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปโหลด', 'error');
        } finally {
            setUploadingIndicatorId(null);
            e.target.value = '';
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading...</div>;
    }

    if (!assignment) {
        return <div className="p-8 text-center text-slate-500">ไม่พบข้อมูลการประเมินนี้</div>;
    }

    const evaluation = assignment.evaluation;
    const evaluator = assignment.evaluator;

    const getEvidenceForIndicator = (indicatorId: number) => {
        return evidenceList.find(e => e.indicatorId === indicatorId);
    };

    return (
        <div>
            <div className="mb-6">
                <BackButton label="รายการประเมินของฉัน" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    {evaluation.name}
                </h1>
                <div className="mt-3 text-sm text-slate-600 space-y-1">
                    <p>ผู้ประเมิน: {evaluator?.name}</p>
                    <p>
                        ระยะเวลา:{' '}
                        {new Date(evaluation.startAt).toLocaleDateString()} -{' '}
                        {new Date(evaluation.endAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {evaluation.topics?.map((topic: any, index: number) => (
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
                                    const evidence =
                                        getEvidenceForIndicator(indicator.id);
                                    const isUploading =
                                        uploadingIndicatorId === indicator.id;

                                    return (
                                        <div
                                            key={indicator.id}
                                            className="mb-6 last:mb-0 pb-6 last:pb-0 border-b border-slate-100 last:border-0"
                                        >
                                            <div className="flex flex-col md:flex-row justify-between gap-4 md:items-start">
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-800">
                                                        {indIndex + 1}.{' '}
                                                        {indicator.name}
                                                        {indicator.requireEvidence && (
                                                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded ml-2 font-semibold">
                                                                จำเป็นต้องแนบหลักฐาน
                                                            </span>
                                                        )}
                                                    </p>

                                                    {indicator.description && (
                                                        <p className="text-sm text-slate-500 mt-1">
                                                            {indicator.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {indicator.requireEvidence && (
                                                    <div className="w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100 flex flex-col md:items-end gap-2">
                                                        {evidence ? (
                                                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200 text-sm">
                                                                <CheckCircle2 size={16} />
                                                                แนบหลักฐานแล้ว
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-amber-600 font-medium">
                                                                รอการแนบหลักฐาน
                                                            </div>
                                                        )}

                                                        <label className={`inline-flex items-center gap-2 px-4 py-2 ${
                                                            isUploading
                                                                ? 'bg-slate-100 text-slate-400'
                                                                : 'bg-white text-slate-700 hover:bg-slate-50'
                                                        } border border-slate-300 rounded-lg text-sm font-medium cursor-pointer transition-colors shadow-sm`}>
                                                            <Upload size={16} />
                                                            {isUploading
                                                                ? 'อัปโหลด...'
                                                                : evidence
                                                                ? 'เปลี่ยนไฟล์'
                                                                : 'อัปโหลดหลักฐาน'}

                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                onChange={(e) =>
                                                                    handleFileUpload(
                                                                        indicator.id,
                                                                        e
                                                                    )
                                                                }
                                                                disabled={isUploading}
                                                            />
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            )}

                            {topic.indicators?.length === 0 && (
                                <p className="text-slate-400 text-sm">
                                    ไม่มีตัวชี้วัดในหัวข้อนี้
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {evaluation.topics?.length === 0 && (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
                        ยังไม่มีหัวข้อการประเมิน
                    </div>
                )}
            </div>
        </div>
    );
}