'use client';

export default function Card({
    children,
    className = '',
    padding = 'md',
    hover = false,
    onClick,
}) {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`
        rounded-xl border border-slate-200 bg-white shadow-sm
        ${paddings[padding]}
        ${hover ? 'cursor-pointer transition-shadow hover:shadow-md' : ''}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

Card.Header = function CardHeader({ children, className = '' }) {
    return (
        <div className={`mb-4 flex items-center justify-between ${className}`}>
            {children}
        </div>
    );
};

Card.Title = function CardTitle({ children, className = '' }) {
    return (
        <h3 className={`text-lg font-semibold text-slate-900 ${className}`}>
            {children}
        </h3>
    );
};

Card.Description = function CardDescription({ children, className = '' }) {
    return (
        <p className={`text-sm text-slate-500 ${className}`}>
            {children}
        </p>
    );
};

Card.Content = function CardContent({ children, className = '' }) {
    return <div className={className}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
    return (
        <div className={`mt-4 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 ${className}`}>
            {children}
        </div>
    );
};
