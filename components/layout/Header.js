'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { Bell, Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { notifications } from '@/lib/data/mockData';

export default function Header({ title, subtitle }) {
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);

    const userNotifications = notifications.filter(n => n.userId === user?.id);
    const unreadCount = userNotifications.filter(n => !n.read).length;

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            {/* Left side - Title */}
            <div>
                <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
                {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg">
                            <div className="border-b border-slate-100 px-4 py-3">
                                <h3 className="font-medium text-slate-900">Notifications</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {userNotifications.length === 0 ? (
                                    <p className="px-4 py-8 text-center text-sm text-slate-500">
                                        No notifications
                                    </p>
                                ) : (
                                    userNotifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`border-b border-slate-100 px-4 py-3 last:border-0 ${!notif.read ? 'bg-emerald-50/50' : ''
                                                }`}
                                        >
                                            <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                                            <p className="mt-0.5 text-xs text-slate-500">{notif.message}</p>
                                            <p className="mt-1 text-xs text-slate-400">{notif.createdAt}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Avatar */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500">{user?.department}</p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
}
