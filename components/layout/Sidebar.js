'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    ClipboardCheck,
    BarChart3,
    Calendar,
    LogOut,
    ChevronLeft,
    ChevronRight,
    User,
    Building2,
    Award,
    BookOpen,
    Heart,
    Target,
} from 'lucide-react';
import { useState } from 'react';

const roleNavItems = {
    TEACHER: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Appraisal', href: '/appraisal', icon: FileText },
        { name: 'Part A - General Info', href: '/appraisal/part-a', icon: User },
        { name: 'Part B - Research', href: '/appraisal/part-b', icon: BookOpen },
        { name: 'Part C - Contributions', href: '/appraisal/part-c', icon: Award },
        { name: 'Part D - Values', href: '/appraisal/part-d', icon: Heart },
        { name: 'Part E - Self Assessment', href: '/appraisal/part-e', icon: Target },
    ],
    HOD: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Review Appraisals', href: '/review', icon: ClipboardCheck },
        { name: 'Department Overview', href: '/department', icon: Building2 },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
    ],
    IQAC: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Review Appraisals', href: '/review', icon: ClipboardCheck },
        { name: 'All Departments', href: '/departments', icon: Building2 },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
    ],
    PRINCIPAL: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Final Approval', href: '/review', icon: ClipboardCheck },
        { name: 'All Departments', href: '/departments', icon: Building2 },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
    ],
    ADMIN: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Appraisal Cycles', href: '/admin/cycles', icon: Calendar },
        { name: 'User Management', href: '/admin/users', icon: Users },
        { name: 'All Appraisals', href: '/admin/appraisals', icon: FileText },
        { name: 'All Departments', href: '/departments', icon: Building2 },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
};

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    if (!user) return null;

    const navItems = roleNavItems[user.role] || [];

    return (
        <aside
            className={`fixed left-0 top-0 z-40 h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 font-bold text-white">
                            TA
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">SIES ERP</h1>
                            <p className="text-xs text-slate-400">Teacher Appraisal</p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 font-bold">
                        TA
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Navigation */}
            <nav className="mt-6 px-3">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                        }`}
                                    title={collapsed ? item.name : ''}
                                >
                                    <Icon size={20} className="shrink-0" />
                                    {!collapsed && <span>{item.name}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-4">
                {!collapsed ? (
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-600 text-sm font-semibold uppercase">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium">{user.name}</p>
                            <p className="truncate text-xs text-slate-400">{user.role}</p>
                        </div>
                    </div>
                ) : (
                    <div className="mb-3 flex justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-600 text-sm font-semibold uppercase">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                )}
                <button
                    onClick={logout}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/20 hover:text-red-400 ${collapsed ? 'justify-center' : ''
                        }`}
                    title={collapsed ? 'Logout' : ''}
                >
                    <LogOut size={18} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
