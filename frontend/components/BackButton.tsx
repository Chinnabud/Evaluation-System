'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ label = "ย้อนกลับ" }: { label?: string }) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="
                group
                inline-flex items-center gap-2
                px-4 py-2
                rounded-xl
                bg-white/70 backdrop-blur
                border border-slate-200
                text-slate-600
                hover:text-indigo-600
                hover:border-indigo-300
                hover:bg-indigo-50/60
                transition-all duration-200
                shadow-sm hover:shadow-md
                active:scale-95
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
            "
        >
            <ArrowLeft
                size={18}
                className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span className="font-medium text-sm">
                {label}
            </span>
        </button>
    );
}