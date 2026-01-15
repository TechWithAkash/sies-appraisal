'use client';

import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function Table({
    columns,
    data,
    onRowClick,
    emptyMessage = 'No data available',
    loading = false,
    sortable = false,
}) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        if (!sortable) return;

        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    if (loading) {
        return (
            <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 ${sortable && column.sortable !== false ? 'cursor-pointer select-none hover:bg-slate-100' : ''
                                    } ${column.className || ''}`}
                                style={{ width: column.width }}
                                onClick={() => column.sortable !== false && handleSort(column.key)}
                            >
                                <div className="flex items-center gap-1">
                                    {column.label}
                                    {sortable && column.sortable !== false && sortConfig.key === column.key && (
                                        sortConfig.direction === 'asc' ? (
                                            <ChevronUp size={14} />
                                        ) : (
                                            <ChevronDown size={14} />
                                        )
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                    {sortedData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-slate-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        sortedData.map((row, idx) => (
                            <tr
                                key={row.id || idx}
                                className={`${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                                onClick={() => onRowClick?.(row)}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`whitespace-nowrap px-4 py-3 text-sm text-slate-700 ${column.cellClassName || ''}`}
                                    >
                                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

// Action menu for table rows
export function TableActions({ actions, row }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
                <MoreHorizontal size={18} />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
                    <div className="absolute right-0 top-full z-20 mt-1 min-w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                        {actions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(row);
                                    setOpen(false);
                                }}
                                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-slate-50 ${action.variant === 'danger' ? 'text-red-600' : 'text-slate-700'
                                    }`}
                            >
                                {action.icon && <action.icon size={16} />}
                                {action.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
