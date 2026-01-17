'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { CircularProgress } from '@/components/ui/ProgressBar';
import ProgressBar from '@/components/ui/ProgressBar';
import Alert from '@/components/ui/Alert';
import {
    User,
    BookOpen,
    Award,
    Heart,
    Target,
    CheckCircle,
    Clock,
    ArrowRight,
    Send,
    FileText,
    AlertCircle,
    Eye,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ConfirmModal, SuccessModal } from '@/components/ui/Modal';

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
            title: 'General Information & Academic Background',
            description: 'Basic details, qualifications, and experience',
            icon: User,
            href: '/appraisal/part-a',
            complete: !!fullData?.partA?.basic,
            max: '-',
            score: '-',
        },
        {
            id: 'part-b',
            label: 'Part B',
            title: 'Research & Academic Contributions',
            description: '14 subsections including publications, projects, patents',
            icon: BookOpen,
            href: '/appraisal/part-b',
            complete: (fullData?.partB?.researchJournals?.length || 0) > 0,
            max: 120,
            score: appraisal?.totalPartB || 0,
        },
        {
            id: 'part-c',
            label: 'Part C',
            title: 'Academic / Administrative Contribution',
            description: 'Key contributions, committee roles, professional bodies',
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
            description: 'Self-assessment on core values and professional conduct',
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
            description: 'Summary of achievements and future goals',
            icon: Target,
            href: '/appraisal/part-e',
            complete: !!fullData?.partE,
            max: '-',
            score: '-',
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
                {/* Rejection Alert - Show when appraisal was sent back */}
                {appraisal?.rejectionReason && appraisal?.status === 'DRAFT' && (
                    <Alert variant="warning" title="Appraisal Sent Back for Revision">
                        <div className="space-y-2">
                            <p>
                                <strong>Rejected by:</strong> {appraisal?.rejectedBy || 'Reviewer'} on {appraisal?.rejectedAt}
                            </p>
                            <p>
                                <strong>Reason:</strong> {appraisal?.rejectionReason}
                            </p>
                            <p className="text-sm mt-2">
                                Please review the feedback above and make the necessary corrections before resubmitting.
                            </p>
                        </div>
                    </Alert>
                )}

                {/* Status Alert */}
                {isReadOnly && (
                    <Alert variant="info" title="Appraisal Status">
                        <div className="flex items-center justify-between">
                            <span>
                                Your appraisal has been submitted and is currently in{' '}
                                <strong>{appraisal?.status?.replace('_', ' ')}</strong> status.
                                {appraisal?.status === 'PRINCIPAL_REVIEWED' && ' Congratulations!'}
                            </span>
                            <Link href={`/appraisal/view`}>
                                <Button variant="outline" size="sm" icon={Eye}>
                                    View Submitted Data
                                </Button>
                            </Link>
                        </div>
                    </Alert>
                )}

                {/* Overview Cards */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Progress Circle */}
                    <Card className="flex flex-col items-center py-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Overall Score</h3>
                        <CircularProgress
                            value={totalScore}
                            max={250}
                            size={200}
                            strokeWidth={16}
                            label="Score"
                            sublabel={`${totalScore}/250`}
                        />
                        <div className="mt-6 flex items-center gap-2">
                            <span className="text-sm text-slate-600">Status:</span>
                            <StatusBadge status={appraisal?.status || 'NOT_STARTED'} />
                        </div>
                    </Card>

                    {/* Score Breakdown */}
                    <Card className="lg:col-span-2">
                        <Card.Header>
                            <Card.Title>Score Breakdown</Card.Title>
                        </Card.Header>
                        <div className="space-y-4">
                            <ProgressBar
                                value={appraisal?.totalPartB || 0}
                                max={120}
                                label="Part B - Research & Academic"
                                color="emerald"
                            />
                            <ProgressBar
                                value={appraisal?.totalPartC || 0}
                                max={100}
                                label="Part C - Contributions"
                                color="blue"
                            />
                            <ProgressBar
                                value={appraisal?.totalPartD || 0}
                                max={30}
                                label="Part D - Values"
                                color="amber"
                            />
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-900">Grand Total</span>
                                <span className="text-2xl font-bold text-emerald-600">{totalScore} / 250</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sections */}
                <Card>
                    <Card.Header>
                        <div>
                            <Card.Title>Appraisal Sections</Card.Title>
                            <p className="text-sm text-slate-500 mt-1">
                                Complete all sections to submit your appraisal
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span>{completedSections} of {sections.length} completed</span>
                        </div>
                    </Card.Header>

                    <div className="space-y-4">
                        {sections.map((section) => (
                            <Link
                                key={section.id}
                                href={section.href}
                                className="flex items-center gap-4 rounded-xl border border-slate-200 p-5 transition-all hover:border-emerald-300 hover:shadow-sm"
                            >
                                <div className={`rounded-xl p-3 ${section.complete ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                    <section.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-emerald-600">{section.label}</span>
                                        <span className="text-lg font-semibold text-slate-900">{section.title}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-0.5">{section.description}</p>
                                </div>
                                <div className="text-right">
                                    {section.max !== '-' && (
                                        <p className="text-lg font-bold text-slate-900">
                                            {section.score} <span className="text-sm font-normal text-slate-400">/ {section.max}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {section.complete ? (
                                        <CheckCircle className="h-6 w-6 text-emerald-500" />
                                    ) : (
                                        <Clock className="h-6 w-6 text-slate-400" />
                                    )}
                                    <ArrowRight className="h-5 w-5 text-slate-400" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </Card>

                {/* Submit Section */}
                {!isReadOnly && (
                    <Card className="bg-linear-to-r from-emerald-50 to-teal-50 border-emerald-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl bg-emerald-100 p-3">
                                    <Send className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Ready to Submit?</h3>
                                    <p className="text-sm text-slate-600">
                                        {canSubmit
                                            ? 'All sections are complete. You can submit your appraisal for review.'
                                            : `Complete all ${sections.length - completedSections} remaining section(s) to enable submission.`
                                        }
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                icon={Send}
                                disabled={!canSubmit}
                                onClick={() => setShowSubmitModal(true)}
                            >
                                Submit Appraisal
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Review Status */}
                {isReadOnly && appraisal?.status !== 'DRAFT' && appraisal && (
                    <Card>
                        <Card.Header>
                            <Card.Title>Review Progress</Card.Title>
                        </Card.Header>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className={`rounded-full p-2 ${appraisal?.submittedAt ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Send size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900">Submitted</p>
                                    <p className="text-sm text-slate-500">{appraisal?.submittedAt || 'Pending'}</p>
                                </div>
                                {appraisal?.submittedAt && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`rounded-full p-2 ${appraisal?.hodApprovedAt ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <User size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900">HOD Review</p>
                                    <p className="text-sm text-slate-500">{appraisal?.hodRemarks || (appraisal?.hodApprovedAt ? 'Approved' : 'Pending')}</p>
                                </div>
                                {appraisal?.hodApprovedAt && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`rounded-full p-2 ${appraisal?.iqacApprovedAt ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Award size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900">IQAC Review</p>
                                    <p className="text-sm text-slate-500">{appraisal?.iqacRemarks || (appraisal?.iqacApprovedAt ? 'Approved' : 'Pending')}</p>
                                </div>
                                {appraisal?.iqacApprovedAt && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`rounded-full p-2 ${appraisal?.principalApprovedAt ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900">Principal Approval</p>
                                    <p className="text-sm text-slate-500">{appraisal?.principalRemarks || (appraisal?.principalApprovedAt ? 'Approved' : 'Pending')}</p>
                                </div>
                                {appraisal?.principalApprovedAt && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            <ConfirmModal
                isOpen={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                onConfirm={handleSubmit}
                title="Submit Appraisal"
                message="Are you sure you want to submit your appraisal? Once submitted, you won't be able to make any changes. Your appraisal will be sent for HOD review."
                confirmText="Submit"
                variant="primary"
                loading={submitting}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Appraisal Submitted!"
                message="Your appraisal has been successfully submitted. It will now be reviewed by your HOD. You can track the review progress on this page."
            />
        </DashboardLayout>
    );
}
