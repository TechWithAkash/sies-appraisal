'use client';

import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const variants = {
    info: {
        bg: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-500',
        title: 'text-blue-800',
        text: 'text-blue-700',
        Icon: Info,
    },
    success: {
        bg: 'bg-green-50 border-green-200',
        icon: 'text-green-500',
        title: 'text-green-800',
        text: 'text-green-700',
        Icon: CheckCircle,
    },
    warning: {
        bg: 'bg-amber-50 border-amber-200',
        icon: 'text-amber-500',
        title: 'text-amber-800',
        text: 'text-amber-700',
        Icon: AlertTriangle,
    },
    error: {
        bg: 'bg-red-50 border-red-200',
        icon: 'text-red-500',
        title: 'text-red-800',
        text: 'text-red-700',
        Icon: AlertCircle,
    },
};

export default function Alert({
    variant = 'info',
    title,
    children,
    onClose,
    className = '',
}) {
    const config = variants[variant];
    const IconComponent = config.Icon;

    return (
        <div className={`rounded-lg border p-4 ${config.bg} ${className}`}>
            <div className="flex">
                <div className="shrink-0">
                    <IconComponent className={`h-5 w-5 ${config.icon}`} />
                </div>
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className={`text-sm font-medium ${config.title}`}>{title}</h3>
                    )}
                    <div className={`text-sm ${config.text} ${title ? 'mt-1' : ''}`}>
                        {children}
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`ml-3 inline-flex rounded-md p-1.5 hover:bg-white/50 ${config.icon}`}
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
