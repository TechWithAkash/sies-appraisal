'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    color = 'emerald',
    className = '',
}) {
    const colors = {
        emerald: {
            bg: 'bg-emerald-50',
            icon: 'bg-emerald-100 text-emerald-600',
            accent: 'text-emerald-600',
        },
        blue: {
            bg: 'bg-blue-50',
            icon: 'bg-blue-100 text-blue-600',
            accent: 'text-blue-600',
        },
        amber: {
            bg: 'bg-amber-50',
            icon: 'bg-amber-100 text-amber-600',
            accent: 'text-amber-600',
        },
        purple: {
            bg: 'bg-purple-50',
            icon: 'bg-purple-100 text-purple-600',
            accent: 'text-purple-600',
        },
        red: {
            bg: 'bg-red-50',
            icon: 'bg-red-100 text-red-600',
            accent: 'text-red-600',
        },
        indigo: {
            bg: 'bg-indigo-50',
            icon: 'bg-indigo-100 text-indigo-600',
            accent: 'text-indigo-600',
        },
        slate: {
            bg: 'bg-slate-50',
            icon: 'bg-slate-100 text-slate-600',
            accent: 'text-slate-600',
        },
    };

    const colorConfig = colors[color];

    return (
        <div className={`rounded-xl border border-slate-200 bg-white p-6 ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
                    {subtitle && (
                        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                    )}
                    {trend && (
                        <div className="mt-2 flex items-center gap-1">
                            {trend === 'up' && (
                                <>
                                    <TrendingUp size={16} className="text-green-500" />
                                    <span className="text-sm font-medium text-green-600">
                                        +{trendValue}%
                                    </span>
                                </>
                            )}
                            {trend === 'down' && (
                                <>
                                    <TrendingDown size={16} className="text-red-500" />
                                    <span className="text-sm font-medium text-red-600">
                                        -{trendValue}%
                                    </span>
                                </>
                            )}
                            {trend === 'neutral' && (
                                <>
                                    <Minus size={16} className="text-slate-400" />
                                    <span className="text-sm font-medium text-slate-500">
                                        {trendValue}%
                                    </span>
                                </>
                            )}
                            <span className="text-xs text-slate-400">vs last period</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`rounded-lg p-3 ${colorConfig.icon}`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>
        </div>
    );
}
