'use client';

import { forwardRef } from 'react';

const Input = forwardRef(function Input(
    {
        label,
        error,
        helperText,
        icon: Icon,
        className = '',
        type = 'text',
        required = false,
        disabled = false,
        ...props
    },
    ref
) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon className="h-4 w-4 text-slate-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    disabled={disabled}
                    className={`
            block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 
            placeholder:text-slate-400
            focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500
            disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}
          `}
                    {...props}
                />
            </div>
            {(error || helperText) && (
                <p className={`text-xs ${error ? 'text-red-500' : 'text-slate-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

export default Input;
