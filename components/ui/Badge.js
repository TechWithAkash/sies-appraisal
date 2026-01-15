'use client';

const variants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-emerald-100 text-emerald-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
};

const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    dot = false,
}) {
    return (
        <span
            className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
        >
            {dot && (
                <span
                    className={`h-1.5 w-1.5 rounded-full ${variant === 'success'
                            ? 'bg-green-500'
                            : variant === 'danger'
                                ? 'bg-red-500'
                                : variant === 'warning'
                                    ? 'bg-amber-500'
                                    : variant === 'info'
                                        ? 'bg-blue-500'
                                        : variant === 'primary'
                                            ? 'bg-emerald-500'
                                            : 'bg-slate-500'
                        }`}
                />
            )}
            {children}
        </span>
    );
}

// Status badge helper
export function StatusBadge({ status }) {
    const statusConfig = {
        DRAFT: { variant: 'default', label: 'Draft' },
        SUBMITTED: { variant: 'info', label: 'Submitted' },
        HOD_REVIEWED: { variant: 'warning', label: 'HOD Reviewed' },
        IQAC_REVIEWED: { variant: 'primary', label: 'IQAC Reviewed' },
        APPROVED: { variant: 'success', label: 'Approved' },
        REJECTED: { variant: 'danger', label: 'Rejected' },
        LOCKED: { variant: 'default', label: 'Locked' },
    };

    const config = statusConfig[status] || { variant: 'default', label: status };

    return (
        <Badge variant={config.variant} dot>
            {config.label}
        </Badge>
    );
}
