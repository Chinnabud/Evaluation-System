'use client';

import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    LogOut,
    CheckSquare,
    ClipboardList,
    Settings,
    User
} from 'lucide-react';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const menus = [
        { name: 'Dashboard', path: '/home', icon: LayoutDashboard },
    ];

    if (user.role === 'ADMIN') {
        menus.push({ name: 'จัดการการประเมิน', path: '/admin/evaluations', icon: Settings });
    } else if (user.role === 'EVALUATOR') {
        menus.push({ name: 'รายการประเมิน', path: '/evaluator/evaluations', icon: ClipboardList });
    } else if (user.role === 'EVALUATEE') {
        menus.push({ name: 'การประเมินของฉัน', path: '/evaluatee/evaluations', icon: CheckSquare });
    }

    const getRoleBadgeColor = () => {
        switch (user.role) {
            case 'ADMIN':
                return 'bg-purple-100 text-purple-700';
            case 'EVALUATOR':
                return 'bg-blue-100 text-blue-700';
            case 'EVALUATEE':
                return 'bg-emerald-100 text-emerald-700';
            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200 flex flex-col h-screen fixed shadow-2xl">

            {/* Logo */}
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Evaluation System
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                    Performance Dashboard
                </p>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto py-6">
                <nav className="space-y-2 px-4">
                    {menus.map((m) => {
                        const Icon = m.icon;
                        const active = pathname.startsWith(m.path);

                        return (
                            <Link
                                key={m.path}
                                href={m.path}
                                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                    ${active
                                        ? 'bg-indigo-500/20 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                    }`}
                            >
                                {active && (
                                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-400 rounded-r-full"></span>
                                )}

                                <Icon size={20} className={`${active ? 'text-indigo-400' : ''}`} />
                                <span className="text-sm font-medium">
                                    {m.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User Section */}
            <div className="p-4 border-t border-slate-700 bg-slate-900/40 backdrop-blur">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <User size={20} className="text-white" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">
                            {user.name}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleBadgeColor()}`}>
                            {user.role}
                        </span>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200 text-sm font-medium"
                >
                    <LogOut size={18} />
                    ออกจากระบบ
                </button>
            </div>
        </aside>
    );
}