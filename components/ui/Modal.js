'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showClose = true,
    footer,
}) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-6xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className={`relative w-full ${sizes[size]} mx-4 max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl`}
            >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                        {description && (
                            <p className="mt-1 text-sm text-slate-500">{description}</p>
                        )}
                    </div>
                    {showClose && (
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto px-6 py-4">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

// Confirmation Modal
export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    loading = false,
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p className="text-slate-600">{message}</p>
        </Modal>
    );
}
