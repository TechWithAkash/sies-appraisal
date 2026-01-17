'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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

// Success Modal with animation
export function SuccessModal({
    isOpen,
    onClose,
    title = 'Success!',
    message = 'Your changes have been saved successfully.',
    buttonText = 'Continue',
    onButtonClick,
    redirectUrl,
    showConfetti = true,
}) {
    const router = useRouter();
    
    const handleClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else if (redirectUrl) {
            router.push(redirectUrl);
            onClose();
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Success Icon with Animation */}
                <div className="pt-8 pb-4 flex justify-center">
                    <div className="relative">
                        {/* Outer ring animation */}
                        <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-75" style={{ animationDuration: '1.5s' }} />
                        {/* Inner circle */}
                        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg">
                            <svg 
                                className="w-10 h-10 text-white" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                style={{
                                    strokeDasharray: 50,
                                    strokeDashoffset: 50,
                                    animation: 'checkmark 0.5s ease-out 0.2s forwards'
                                }}
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={3} 
                                    d="M5 13l4 4L19 7" 
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-2 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
                    <p className="text-slate-600">{message}</p>
                </div>

                {/* Decorative elements */}
                {showConfetti && (
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][i % 5],
                                    left: `${10 + (i * 7)}%`,
                                    top: '-10px',
                                    animation: `confetti-fall 1s ease-out ${i * 0.1}s forwards`,
                                    opacity: 0,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Button */}
                <div className="p-6 pt-4">
                    <Button 
                        onClick={handleClick} 
                        fullWidth 
                        size="lg"
                        className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>

            {/* Keyframe animations */}
            <style jsx global>{`
                @keyframes checkmark {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(150px) rotate(720deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}
