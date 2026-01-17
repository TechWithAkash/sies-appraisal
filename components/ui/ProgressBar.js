'use client';

export default function ProgressBar({
    value,
    max = 100,
    size = 'md',
    showLabel = true,
    label,
    className = '',
    color = 'emerald',
}) {
    const percentage = Math.min(Math.round((value / max) * 100), 100);

    const sizes = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
    };

    const colors = {
        emerald: 'bg-emerald-500',
        blue: 'bg-blue-500',
        amber: 'bg-amber-500',
        red: 'bg-red-500',
        green: 'bg-green-500',
        indigo: 'bg-indigo-500',
        purple: 'bg-purple-500',
    };

    return (
        <div className={className}>
            {(showLabel || label) && (
                <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{label}</span>
                    <span className="text-slate-500">
                        {value} / {max} ({percentage}%)
                    </span>
                </div>
            )}
            <div className={`w-full overflow-hidden rounded-full bg-slate-200 ${sizes[size]}`}>
                <div
                    className={`${sizes[size]} rounded-full transition-all duration-500 ${colors[color]}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// Circular Progress
export function CircularProgress({
    value,
    max = 100,
    size = 120,
    strokeWidth = 10,
    label,
    sublabel,
    color = '#10b981',
}) {
    const percentage = Math.min(Math.round((value / max) * 100), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{percentage}%</span>
                {label && <span className="text-sm text-slate-600">{label}</span>}
                {sublabel && <span className="text-xs text-slate-400">{sublabel}</span>}
            </div>
        </div>
    );
}
