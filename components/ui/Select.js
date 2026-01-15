'use client';

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
    {
        label,
        error,
        helperText,
        options = [],
        placeholder = 'Select an option',
        className = '',
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
                <select
                    ref={ref}
                    disabled={disabled}
                    className={`
            block w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-slate-900
            focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500
            disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}
          `}
                    {...props}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
            </div>
            {(error || helperText) && (
                <p className={`text-xs ${error ? 'text-red-500' : 'text-slate-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

export default Select;
