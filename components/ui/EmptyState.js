'use client';

import { FileX, Plus } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
    icon: Icon = FileX,
    title = 'No data found',
    description,
    action,
    actionLabel = 'Add New',
    className = '',
}) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Icon size={32} className="text-slate-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-slate-900">{title}</h3>
            {description && (
                <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
                    {description}
                </p>
            )}
            {action && (
                <Button onClick={action} icon={Plus} className="mt-6">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
