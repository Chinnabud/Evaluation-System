'use client';

import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    // 🔥 Map path → role (scalable กว่า if-else)
    const requiredRole = useMemo(() => {
        if (pathname.startsWith('/admin')) return 'ADMIN';
        if (pathname.startsWith('/evaluator')) return 'EVALUATOR';
        if (pathname.startsWith('/evaluatee')) return 'EVALUATEE';
        return null;
    }, [pathname]);

    useEffect(() => {
        if (!loading && user && requiredRole && user.role !== requiredRole) {
            Swal.fire({
                icon: 'error',
                title: 'Unauthorized',
                text: 'You do not have permission to access this page.',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#6366f1',
            }).then(() => {
                router.replace('/home'); // 🔥 replace ป้องกัน back กลับมา
            });
        }
    }, [user, loading, requiredRole, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="flex flex-col items-center gap-5">
                    <div className="relative">
                        <div className="h-16 w-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl"></div>
                    </div>
                    <p className="text-slate-300 tracking-wide animate-pulse text-lg">
                        Loading secure session...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-64 overflow-y-auto relative">
                {/* subtle background glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="p-8 max-w-7xl mx-auto relative z-10"
                >
                    <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200 p-8 transition-all duration-300">
                        {children}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}