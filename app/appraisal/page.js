'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { CircularProgress } from '@/components/ui/ProgressBar';
import Alert from '@/components/ui/Alert';
import {
    User,
    BookOpen,
    Award,
    Heart,
    Target,
    CheckCircle,
    Clock,
    Send,
    Eye,
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ConfirmModal, SuccessModal } from '@/components/ui/Modal';

// Clean Section Card Component
function SectionCard({ section, index, isReadOnly }) {
    const Icon = section.icon;
    const isScored = section.max !== null;
    const progress = isScored ? Math.round((section.score / section.max) * 100) : 0;

    return (
        <Link href={section.href}>
            <div className={`group relative bg-white rounded-2xl border-2 p-5 transition-all duration-200 hover:shadow-lg ${section.complete ? 'border-emerald-200 hover:border-emerald-300' : 'border-slate-200 hover:border-slate-300'
                }`}>
                {/* Step Number Badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                    {index + 1}
                </div>

                {/* Completion Badge */}
                {section.complete && (
                    <div className="absolute -top-2 -right-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                            <CheckCircle size={16} />
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-xl transition-colors ${section.complete ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                        }`}>
                        <Icon size={24} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">{section.label}</span>
                        </div>
                        <h3 className="font-semibold text-slate-900 text-lg">{section.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{section.description}</p>

                        {/* Score Bar (for scored sections) */}
                        {isScored && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-sm mb-1.5">
                                    <span className="text-slate-500">Your Score</span>
                                    <span className="font-bold text-slate-900">{section.score}/{section.max}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${progress >= 80 ? 'bg-emerald-500' :
                                                progress >= 50 ? 'bg-blue-500' :
                                                    progress >= 25 ? 'bg-amber-500' :
                                                        'bg-slate-300'
                                            }`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Arrow */}
                    <div className="self-center">
                        <ChevronRight size={24} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function AppraisalPage() {
    const { user } = useAuth();
    const {
        getCurrentAppraisal,
        getFullAppraisalData,
        createAppraisal,
        submitAppraisal,
        appraisalCycles,
        recalculateTotals
    } = useAppraisal();

    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [appraisalCreated, setAppraisalCreated] = useState(false);

    const currentCycle = appraisalCycles.find(c => c.isOpen);
    let appraisal = user ? getCurrentAppraisal(user.id) : null;

    // Auto-create appraisal if none exists for current cycle
    useEffect(() => {
        if (!appraisal && currentCycle && user && !appraisalCreated) {
            const newAppraisal = createAppraisal(user.id, currentCycle.id);
            if (newAppraisal) {
                setAppraisalCreated(true);
            }
        }
    }, [appraisal, currentCycle, user, createAppraisal, appraisalCreated]);

    // Recalculate totals on page load
    useEffect(() => {
        if (appraisal) {
            recalculateTotals(appraisal.id);
        }
    }, []);

    const fullData = appraisal ? getFullAppraisalData(appraisal.id) : null;

    const sections = [
        {
            id: 'part-a',
            label: 'Part A',
            title: 'General Information',
            description: 'Personal details, academic qualifications & teaching experience',
            icon: User,
            href: '/appraisal/part-a',
            complete: !!fullData?.partA?.basic,
            max: null,
            score: null,
        },
        {
            id: 'part-b',
            label: 'Part B',
            title: 'Research & Academic',
            description: 'Publications, projects, patents, awards & academic contributions',
            icon: BookOpen,
            href: '/appraisal/part-b',
            complete: (fullData?.partB?.researchJournals?.length || 0) > 0,
            max: 120,
            score: appraisal?.totalPartB || 0,
        },
        {
            id: 'part-c',
            label: 'Part C',
            title: 'Contributions',
            description: 'Key contributions, committee roles & professional memberships',
            icon: Award,
            href: '/appraisal/part-c',
            complete: !!fullData?.partC?.keyContribution,
            max: 100,
            score: appraisal?.totalPartC || 0,
        },
        {
            id: 'part-d',
            label: 'Part D',
            title: 'Values',
            description: 'Self-rating on professional values & ethical conduct',
            icon: Heart,
            href: '/appraisal/part-d',
            complete: !!fullData?.partD,
            max: 30,
            score: appraisal?.totalPartD || 0,
        },
        {
            id: 'part-e',
            label: 'Part E',
            title: 'Self Assessment',
            description: 'Summary of achievements, goals & development needs',
            icon: Target,
            href: '/appraisal/part-e',
            complete: !!fullData?.partE,
            max: null,
            score: null,
        },
    ];

    const totalScore = appraisal?.grandTotal || 0;
    const completedSections = sections.filter(s => s.complete).length;
    const isReadOnly = appraisal?.status !== 'DRAFT';
    const canSubmit = completedSections === sections.length && appraisal?.status === 'DRAFT';

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            submitAppraisal(appraisal.id);
            setShowSubmitModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Failed to submit:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <Header
                title="My Appraisal"
                subtitle={currentCycle ? `Academic Year ${currentCycle.academicYear}` : 'No active cycle'}
            />

            <div className="p-6 space-y-6">
                {/* Rejection Alert */}
                {appraisal?.rejectionReason && appraisal?.status === 'DRAFT' && (
                    <Alert variant="warning" title="Appraisal Sent Back for Revision">
                        <div className="space-y-2">
                            <p><strong>Rejected by:</strong> {appraisal?.rejectedBy || 'Reviewer'} on {appraisal?.rejectedAt}</p>
                            <p><strong>Reason:</strong> {appraisal?.rejectionReason}</p>
                            <p className="text-sm mt-2">Please review and make corrections before resubmitting.</p>
                        </div>
                    </Alert>
                )}

                {/* Status Banner for Submitted Appraisals */}
                {isReadOnly && (
                    <div className={`rounded-xl p-5 ${appraisal?.status === 'SUBMITTED' ? 'bg-blue-50 border border-blue-200' :
                            appraisal?.status === 'HOD_REVIEWED' ? 'bg-purple-50 border border-purple-200' :
                                appraisal?.status === 'IQAC_REVIEWED' ? 'bg-indigo-50 border border-indigo-200' :
                                    appraisal?.status === 'PRINCIPAL_REVIEWED' ? 'bg-emerald-50 border border-emerald-200' :
                                        'bg-slate-50 border border-slate-200'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {appraisal?.status === 'PRINCIPAL_REVIEWED' ? (
                                    <CheckCircle size={24} className="text-emerald-600" />
                                ) : (
                                    <Clock size={24} className="text-blue-600" />
                                )}
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        {appraisal?.status === 'SUBMITTED' && 'Awaiting HOD Review'}
                                        {appraisal?.status === 'HOD_REVIEWED' && 'Awaiting IQAC Review'}
                                        {appraisal?.status === 'IQAC_REVIEWED' && 'Awaiting Principal Approval'}
                                        {appraisal?.status === 'PRINCIPAL_REVIEWED' && 'Appraisal Approved! 🎉'}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Current Status: <StatusBadge status={appraisal?.status} />
                                    </p>
                                </div>
                            </div>
                            <Link href="/appraisal/view">
                                <Button variant="outline" icon={Eye}>View Details</Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Score Summary - Left Side */}
                    <div className="lg:col-span-1 space-y-4">
                        <Card>
                            <div className="text-center py-4">
                                <h3 className="text-sm font-medium text-slate-500 mb-4">Total Score</h3>
                                <CircularProgress
                                    value={totalScore}
                                    max={250}
                                    size={150}
                                    strokeWidth={12}
                                    label="Score"
                                    sublabel={`${totalScore}/250`}
                                />
                            </div>
                        </Card>

                        {/* Completion Progress */}
                        <Card className="bg-slate-50">
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-slate-700">Completion</span>
                                    <span className="text-sm font-bold text-slate-900">{completedSections}/5</span>
                                </div>
                                <div className="flex gap-1">
                                    {sections.map((section, i) => (
                                        <div
                                            key={i}
                                            className={`h-2 flex-1 rounded-full ${section.complete ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-2 text-center">
                                    {completedSections === 5 ? 'All sections complete!' : `${5 - completedSections} section(s) remaining`}
                                </p>
                            </div>
                        </Card>

                        {/* Score Breakdown */}
                        <Card>
                            <div className="p-4 space-y-3">
                                <h4 className="text-sm font-semibold text-slate-700 mb-3">Score Breakdown</h4>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Part B</span>
                                    <span className="font-bold">{appraisal?.totalPartB || 0}/120</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Part C</span>
                                    <span className="font-bold">{appraisal?.totalPartC || 0}/100</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Part D</span>
                                    <span className="font-bold">{appraisal?.totalPartD || 0}/30</span>
                                </div>
                                <div className="border-t border-slate-200 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-slate-900">Total</span>
                                        <span className="text-xl font-bold text-emerald-600">{totalScore}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sections List - Right Side */}
                    <div className="lg:col-span-3">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-slate-900">Appraisal Sections</h2>
                                <p className="text-sm text-slate-500">Complete all sections in order</p>
                            </div>

                            {sections.map((section, index) => (
                                <SectionCard
                                    key={section.id}
                                    section={section}
                                    index={index}
                                    isReadOnly={isReadOnly}
                                />
                            ))}

                            {/* Submit Button */}
                            {!isReadOnly && (
                                <div className={`mt-6 rounded-2xl p-6 ${canSubmit ? 'bg-linear-to-r from-emerald-500 to-teal-500' : 'bg-slate-100'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${canSubmit ? 'bg-white/20' : 'bg-slate-200'}`}>
                                                <Send size={24} className={canSubmit ? 'text-white' : 'text-slate-400'} />
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-semibold ${canSubmit ? 'text-white' : 'text-slate-600'}`}>
                                                    {canSubmit ? 'Ready to Submit!' : 'Complete All Sections'}
                                                </h3>
                                                <p className={`text-sm ${canSubmit ? 'text-white/80' : 'text-slate-500'}`}>
                                                    {canSubmit
                                                        ? 'Your appraisal will be sent to HOD for review'
                                                        : `${5 - completedSections} section(s) remaining to complete`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            size="lg"
                                            variant={canSubmit ? 'secondary' : 'ghost'}
                                            icon={Send}
                                            disabled={!canSubmit}
                                            onClick={() => setShowSubmitModal(true)}
                                            className={canSubmit ? 'bg-white text-emerald-600 hover:bg-white/90' : ''}
                                        >
                                            Submit Appraisal
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ConfirmModal
                isOpen={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                onConfirm={handleSubmit}
                title="Submit Appraisal"
                message="Are you sure you want to submit? Once submitted, you won't be able to make changes until the review is complete."
                confirmText="Submit"
                variant="primary"
                loading={submitting}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Appraisal Submitted!"
                message="Your appraisal has been sent for HOD review. You can track progress from your dashboard."
            />
        </DashboardLayout>
    );
}
