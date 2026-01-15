'use client';

import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
    {
        label,
        error,
        helperText,
        className = '',
        rows = 4,
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
            <textarea
                ref={ref}
                rows={rows}
                disabled={disabled}
                className={`
          block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 
          placeholder:text-slate-400 resize-none
          focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500
          disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}
        `}
                {...props}
            />
            {(error || helperText) && (
                <p className={`text-xs ${error ? 'text-red-500' : 'text-slate-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

export default Textarea;
