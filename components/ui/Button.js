'use client';

import { forwardRef } from 'react';

const variants = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

const Button = forwardRef(function Button(
    {
        children,
        variant = 'primary',
        size = 'md',
        className = '',
        disabled = false,
        loading = false,
        icon: Icon,
        iconPosition = 'left',
        fullWidth = false,
        type = 'button',
        ...props
    },
    ref
) {
    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            {...props}
        >
            {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
            {!loading && Icon && iconPosition === 'left' && <Icon size={18} />}
            {children}
            {!loading && Icon && iconPosition === 'right' && <Icon size={18} />}
        </button>
    );
});

export default Button;
