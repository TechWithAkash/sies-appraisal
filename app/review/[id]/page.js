'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import Table from '@/components/ui/Table';
import Textarea from '@/components/ui/Textarea';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import ProgressBar from '@/components/ui/ProgressBar';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    FileText,
    User,
    BookOpen,
    Award,
    Heart,
    Target,
    Edit,
    AlertTriangle,
    Clock,
} from 'lucide-react';
import Link from 'next/link';
import { PART_B_CAPS, PART_C_CAPS, PART_D_VALUES, PART_B_TOTAL_MAX, PART_C_TOTAL_MAX, PART_D_TOTAL_MAX } from '@/lib/calculations';

const statusConfig = {
    DRAFT: { label: 'Draft', variant: 'secondary' },
    SUBMITTED: { label: 'Submitted', variant: 'warning' },
    HOD_REVIEWED: { label: 'HOD Reviewed', variant: 'info' },
    IQAC_REVIEWED: { label: 'IQAC Reviewed', variant: 'info' },
    PRINCIPAL_REVIEWED: { label: 'Completed', variant: 'success' },
};

function ScoreComparisonRow({ label, selfScore, reviewerScore, maxScore, onReviewerChange, disabled }) {
    const diff = (reviewerScore || 0) - (selfScore || 0);

    return (
        <div className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
            <div className="flex-1">
                <p className="font-medium text-slate-700">{label}</p>
            </div>
            <div className="w-24 text-center">
                <p className="text-sm text-slate-500">Self</p>
                <p className="font-semibold text-slate-900">{selfScore || 0}</p>
            </div>
            <div className="w-32">
                <p className="text-sm text-slate-500 text-center">Reviewer</p>
                <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max={maxScore}
                    value={reviewerScore || ''}
                    onChange={(e) => onReviewerChange(Math.min(maxScore, parseFloat(e.target.value) || 0))}
                    disabled={disabled}
                    className="text-center"
                />
            </div>
            <div className="w-16 text-center">
                <p className="text-sm text-slate-500">Max</p>
                <p className="text-slate-600">{maxScore}</p>
            </div>
            <div className="w-20 text-right">
                <span className={`text-sm font-medium ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-600' : 'text-slate-400'}`}>
                    {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                </span>
            </div>
        </div>
    );
}

function PartAReview({ data }) {
    if (!data) return <p className="text-slate-500">No data available</p>;

    return (
        <div className="space-y-6">
            {/* Basic Details */}
            <Card>
                <Card.Header>
                    <Card.Title>Basic Details</Card.Title>
                </Card.Header>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(data.basicDetails || {}).map(([key, value]) => (
                        <div key={key}>
                            <p className="text-sm text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                            <p className="font-medium text-slate-900">{value || '—'}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Qualifications */}
            <Card>
                <Card.Header>
                    <Card.Title>Qualifications</Card.Title>
                </Card.Header>
                <Table
                    columns={[
                        { key: 'degree', label: 'Degree' },
                        { key: 'specialization', label: 'Specialization' },
                        { key: 'university', label: 'University' },
                        { key: 'year', label: 'Year' },
                    ]}
                    data={data.qualifications || []}
                    emptyMessage="No qualifications listed"
                />
            </Card>

            {/* Experience */}
            <Card>
                <Card.Header>
                    <Card.Title>Experience</Card.Title>
                </Card.Header>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-slate-500">Teaching Experience</p>
                        <p className="text-2xl font-bold text-slate-900">{data.experience?.teachingYears || 0} years</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Industry Experience</p>
                        <p className="text-2xl font-bold text-slate-900">{data.experience?.industryYears || 0} years</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Current Institution</p>
                        <p className="text-2xl font-bold text-slate-900">{data.experience?.currentInstitutionYears || 0} years</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function PartBReview({ data, reviewScores, onScoreChange, disabled }) {
    if (!data) return <p className="text-slate-500">No data available</p>;

    const sections = Object.keys(PART_B_CAPS);

    return (
        <Card>
            <Card.Header>
                <Card.Title>Research & Academic Contributions</Card.Title>
                <span className="text-lg font-semibold text-slate-600">
                    Max: {PART_B_TOTAL_MAX} marks
                </span>
            </Card.Header>
            <div className="space-y-1">
                {sections.map((section) => {
                    const cap = PART_B_CAPS[section];
                    const sectionData = data[section] || [];
                    const selfScore = Array.isArray(sectionData)
                        ? sectionData.reduce((sum, item) => sum + (parseFloat(item.calculatedMarks) || parseFloat(item.marks) || 0), 0)
                        : parseFloat(sectionData.selfMarks) || 0;

                    return (
                        <ScoreComparisonRow
                            key={section}
                            label={section.replace(/([A-Z])/g, ' $1').trim()}
                            selfScore={Math.min(selfScore, cap.max)}
                            reviewerScore={reviewScores?.[section]}
                            maxScore={cap.max}
                            onReviewerChange={(val) => onScoreChange(section, val)}
                            disabled={disabled}
                        />
                    );
                })}
            </div>
        </Card>
    );
}

function PartCReview({ data, reviewScores, onScoreChange, disabled }) {
    if (!data) return <p className="text-slate-500">No data available</p>;

    const sections = Object.keys(PART_C_CAPS);

    const getSelfScore = (section) => {
        const sectionData = data[section];
        if (!sectionData) return 0;

        if (Array.isArray(sectionData)) {
            return sectionData.reduce((sum, item) => sum + (parseFloat(item.selfMarks) || 0), 0);
        }

        if (section === 'studentFeedback') {
            return parseFloat(sectionData.convertedMarks) || 0;
        }

        return parseFloat(sectionData.selfMarks) || 0;
    };

    return (
        <Card>
            <Card.Header>
                <Card.Title>Administrative Contributions</Card.Title>
                <span className="text-lg font-semibold text-slate-600">
                    Max: {PART_C_TOTAL_MAX} marks
                </span>
            </Card.Header>
            <div className="space-y-1">
                {sections.map((section) => {
                    const cap = PART_C_CAPS[section];
                    const selfScore = Math.min(getSelfScore(section), cap.max);

                    return (
                        <ScoreComparisonRow
                            key={section}
                            label={section.replace(/([A-Z])/g, ' $1').trim()}
                            selfScore={selfScore}
                            reviewerScore={reviewScores?.[section]}
                            maxScore={cap.max}
                            onReviewerChange={(val) => onScoreChange(section, val)}
                            disabled={disabled}
                        />
                    );
                })}
            </div>
        </Card>
    );
}

function PartDReview({ data, reviewScores, onScoreChange, disabled }) {
    if (!data) return <p className="text-slate-500">No data available</p>;

    return (
        <Card>
            <Card.Header>
                <Card.Title>Values & Ethics</Card.Title>
                <span className="text-lg font-semibold text-slate-600">
                    Max: {PART_D_TOTAL_MAX} marks
                </span>
            </Card.Header>
            <div className="space-y-1">
                {Object.entries(PART_D_VALUES).map(([key, max]) => (
                    <ScoreComparisonRow
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        selfScore={data[key] || 0}
                        reviewerScore={reviewScores?.[key]}
                        maxScore={max}
                        onScoreChange={(val) => onScoreChange(key, val)}
                        disabled={disabled}
                    />
                ))}
            </div>
        </Card>
    );
}

function PartEReview({ data }) {
    if (!data) return <p className="text-slate-500">No data available</p>;

    return (
        <div className="space-y-4">
            <Card>
                <Card.Header>
                    <Card.Title>Self Summary</Card.Title>
                </Card.Header>
                <p className="text-slate-600 whitespace-pre-wrap">{data.selfSummary || 'Not provided'}</p>
            </Card>

            <Card>
                <Card.Header>
                    <Card.Title>Goals for Next Period</Card.Title>
                </Card.Header>
                <p className="text-slate-600 whitespace-pre-wrap">{data.goals || 'Not provided'}</p>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <Card.Header>
                        <Card.Title>Strengths</Card.Title>
                    </Card.Header>
                    <p className="text-slate-600 whitespace-pre-wrap">{data.strengths || 'Not provided'}</p>
                </Card>
                <Card>
                    <Card.Header>
                        <Card.Title>Areas for Improvement</Card.Title>
                    </Card.Header>
                    <p className="text-slate-600 whitespace-pre-wrap">{data.areasForImprovement || 'Not provided'}</p>
                </Card>
            </div>

            <Card>
                <Card.Header>
                    <Card.Title>Training Needs</Card.Title>
                </Card.Header>
                <p className="text-slate-600 whitespace-pre-wrap">{data.trainingNeeds || 'Not provided'}</p>
            </Card>
        </div>
    );
}

export default function ReviewDetailPage({ params }) {
    const router = useRouter();
    const { user } = useAuth();
    const { getAppraisal, getFullAppraisalData, hodReview, iqacReview, principalReview } = useAppraisal();

    const unwrappedParams = use(params);
    const appraisalId = unwrappedParams.id;

    const appraisal = getAppraisal(appraisalId);
    const fullData = appraisal ? getFullAppraisalData(appraisalId) : null;

    const [partBScores, setPartBScores] = useState({});
    const [partCScores, setPartCScores] = useState({});
    const [partDScores, setPartDScores] = useState({});
    const [comments, setComments] = useState('');
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Initialize scores from existing review data
    useEffect(() => {
        if (appraisal && user) {
            // Load existing review scores if available
            const existingReview = user.role === 'HOD' ? appraisal.hodReview
                : user.role === 'IQAC' ? appraisal.iqacReview
                    : appraisal.principalReview;

            if (existingReview?.scores) {
                setPartBScores(existingReview.scores.partB || {});
                setPartCScores(existingReview.scores.partC || {});
                setPartDScores(existingReview.scores.partD || {});
            }

            if (existingReview?.comments) {
                setComments(existingReview.comments);
            }
        }
    }, [appraisal, user]);

    // Check if user has access to this appraisal
    const hasAccess = appraisal && fullData && user && (
        user.role === 'ADMIN' ||
        user.role === 'PRINCIPAL' ||
        user.role === 'IQAC' ||
        (user.role === 'HOD' && fullData.teacher?.department === user.department)
    );

    if (!appraisal || !fullData) {
        return (
            <DashboardLayout>
                <div className="p-6">
                    <Alert variant="error">
                        Appraisal not found. The appraisal may have been deleted or the ID is invalid.
                    </Alert>
                    <Link href="/review" className="mt-4 inline-block">
                        <Button variant="secondary" icon={ArrowLeft}>Back to Reviews</Button>
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    if (!hasAccess) {
        return (
            <DashboardLayout>
                <div className="p-6">
                    <Alert variant="error">
                        Access denied. You don't have permission to view this appraisal. HODs can only view appraisals from their department.
                    </Alert>
                    <Link href="/review" className="mt-4 inline-block">
                        <Button variant="secondary" icon={ArrowLeft}>Back to Reviews</Button>
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    // Determine if user can review
    const canReview = user && (
        (user.role === 'HOD' && appraisal.status === 'SUBMITTED') ||
        (user.role === 'IQAC' && appraisal.status === 'HOD_REVIEWED') ||
        (user.role === 'PRINCIPAL' && appraisal.status === 'IQAC_REVIEWED')
    );

    // Calculate total reviewed score
    const calculateReviewedTotal = () => {
        const partBTotal = Object.values(partBScores).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
        const partCTotal = Object.values(partCScores).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
        const partDTotal = Object.values(partDScores).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
        return Math.round((partBTotal + partCTotal + partDTotal) * 100) / 100;
    };

    const handleApprove = async () => {
        setSubmitting(true);
        try {
            const reviewData = {
                scores: {
                    partB: partBScores,
                    partC: partCScores,
                    partD: partDScores,
                },
                comments,
                decision: 'APPROVED',
                reviewedAt: new Date().toISOString(),
            };

            if (user.role === 'HOD') {
                hodReview(appraisalId, reviewData);
            } else if (user.role === 'IQAC') {
                iqacReview(appraisalId, reviewData);
            } else if (user.role === 'PRINCIPAL') {
                principalReview(appraisalId, reviewData);
            }

            router.push('/review');
        } catch (error) {
            console.error('Review failed:', error);
        } finally {
            setSubmitting(false);
            setShowApproveModal(false);
        }
    };

    const handleReject = async () => {
        setSubmitting(true);
        try {
            const reviewData = {
                scores: {},
                comments,
                decision: 'REJECTED',
                reviewedAt: new Date().toISOString(),
            };

            if (user.role === 'HOD') {
                hodReview(appraisalId, { ...reviewData, rejectToTeacher: true });
            }

            router.push('/review');
        } catch (error) {
            console.error('Rejection failed:', error);
        } finally {
            setSubmitting(false);
            setShowRejectModal(false);
        }
    };

    const config = statusConfig[appraisal.status];

    const tabs = [
        {
            id: 'partA',
            label: 'Part A - Basic Info',
            icon: User,
            content: <PartAReview data={fullData.partA} />,
        },
        {
            id: 'partB',
            label: 'Part B - Research',
            icon: BookOpen,
            content: (
                <PartBReview
                    data={fullData.partB}
                    reviewScores={partBScores}
                    onScoreChange={(section, val) => setPartBScores(prev => ({ ...prev, [section]: val }))}
                    disabled={!canReview}
                />
            ),
        },
        {
            id: 'partC',
            label: 'Part C - Admin',
            icon: Award,
            content: (
                <PartCReview
                    data={fullData.partC}
                    reviewScores={partCScores}
                    onScoreChange={(section, val) => setPartCScores(prev => ({ ...prev, [section]: val }))}
                    disabled={!canReview}
                />
            ),
        },
        {
            id: 'partD',
            label: 'Part D - Values',
            icon: Heart,
            content: (
                <PartDReview
                    data={fullData.partD}
                    reviewScores={partDScores}
                    onScoreChange={(key, val) => setPartDScores(prev => ({ ...prev, [key]: val }))}
                    disabled={!canReview}
                />
            ),
        },
        {
            id: 'partE',
            label: 'Part E - Self Assessment',
            icon: Target,
            content: <PartEReview data={fullData.partE} />,
        },
    ];

    return (
        <DashboardLayout>
            <Header
                title="Review Appraisal"
                subtitle={`${appraisal.teacherName} - ${appraisal.department}`}
            />

            <div className="p-6 space-y-6">
                {/* Back Link */}
                <Link href="/review" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                    <ArrowLeft size={16} />
                    Back to Reviews
                </Link>

                {/* Status & Score Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Teacher Info */}
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                                {appraisal.teacherName?.charAt(0) || 'T'}
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">{appraisal.teacherName}</h3>
                                <p className="text-sm text-slate-500">{appraisal.department}</p>
                                <Badge variant={config.variant} className="mt-1">{config.label}</Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Self Score */}
                    <Card className="bg-blue-50 border-blue-200">
                        <p className="text-sm text-blue-600 font-medium">Self Assessment Score</p>
                        <p className="text-3xl font-bold text-blue-700">{appraisal.selfScore || 0}</p>
                        <ProgressBar value={appraisal.selfScore || 0} max={330} showLabel={false} color="blue" className="mt-2" />
                    </Card>

                    {/* Reviewed Score */}
                    <Card className={canReview ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}>
                        <p className="text-sm text-emerald-600 font-medium">
                            {canReview ? 'Your Review Score' : 'Final Score'}
                        </p>
                        <p className="text-3xl font-bold text-emerald-700">
                            {canReview ? calculateReviewedTotal() : (appraisal.finalScore || '—')}
                        </p>
                        {canReview && (
                            <ProgressBar value={calculateReviewedTotal()} max={330} showLabel={false} color="green" className="mt-2" />
                        )}
                    </Card>
                </div>

                {/* Review Status Timeline */}
                <Card>
                    <Card.Header>
                        <Card.Title>Review Progress</Card.Title>
                    </Card.Header>
                    <div className="flex items-center gap-4">
                        {['SUBMITTED', 'HOD_REVIEWED', 'IQAC_REVIEWED', 'PRINCIPAL_REVIEWED'].map((status, i, arr) => {
                            const isComplete = arr.indexOf(appraisal.status) >= i;
                            const isCurrent = appraisal.status === status;

                            return (
                                <div key={status} className="flex items-center flex-1">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isComplete ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : isCurrent ? 'bg-white border-amber-500 text-amber-500'
                                                : 'bg-white border-slate-300 text-slate-400'
                                        }`}>
                                        {isComplete ? <CheckCircle size={20} /> : <Clock size={20} />}
                                    </div>
                                    {i < arr.length - 1 && (
                                        <div className={`flex-1 h-1 mx-2 ${isComplete ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex mt-2">
                        <p className="flex-1 text-xs text-center text-slate-500">Submitted</p>
                        <p className="flex-1 text-xs text-center text-slate-500">HOD Review</p>
                        <p className="flex-1 text-xs text-center text-slate-500">IQAC Review</p>
                        <p className="flex-1 text-xs text-center text-slate-500">Principal</p>
                    </div>
                </Card>

                {/* Tabs for each part */}
                <Tabs tabs={tabs} defaultTab="partB" />

                {/* Review Comments */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <Edit size={18} />
                            Review Comments
                        </Card.Title>
                    </Card.Header>
                    <Textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        disabled={!canReview}
                        rows={4}
                        placeholder="Add your comments, observations, and recommendations..."
                    />
                </Card>

                {/* Action Buttons */}
                {canReview && (
                    <Card className="bg-slate-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900">Ready to submit your review?</p>
                                <p className="text-sm text-slate-500">
                                    Review all sections and scores before submitting.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                {user?.role === 'HOD' && (
                                    <Button
                                        variant="danger"
                                        icon={XCircle}
                                        onClick={() => setShowRejectModal(true)}
                                    >
                                        Send Back
                                    </Button>
                                )}
                                <Button
                                    variant="primary"
                                    icon={CheckCircle}
                                    onClick={() => setShowApproveModal(true)}
                                >
                                    Approve & Forward
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Approve Modal */}
                <Modal
                    isOpen={showApproveModal}
                    onClose={() => setShowApproveModal(false)}
                    title="Confirm Approval"
                    size="md"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setShowApproveModal(false)}>Cancel</Button>
                            <Button variant="primary" onClick={handleApprove} loading={submitting}>
                                Confirm Approval
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <Alert variant="info">
                            You are about to approve this appraisal with a reviewed score of <strong>{calculateReviewedTotal()}</strong> marks.
                        </Alert>
                        <p className="text-slate-600">
                            {user?.role === 'HOD' && 'This will forward the appraisal to IQAC for further review.'}
                            {user?.role === 'IQAC' && 'This will forward the appraisal to the Principal for final approval.'}
                            {user?.role === 'PRINCIPAL' && 'This will finalize the appraisal. The teacher will be notified of the completion.'}
                        </p>
                    </div>
                </Modal>

                {/* Reject Modal */}
                <Modal
                    isOpen={showRejectModal}
                    onClose={() => setShowRejectModal(false)}
                    title="Send Back for Revision"
                    size="md"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setShowRejectModal(false)}>Cancel</Button>
                            <Button variant="danger" onClick={handleReject} loading={submitting}>
                                Send Back
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <Alert variant="warning" icon={AlertTriangle}>
                            This will send the appraisal back to the teacher for revisions.
                        </Alert>
                        <Textarea
                            label="Reason for Sending Back"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={3}
                            placeholder="Provide clear feedback on what needs to be corrected..."
                            required
                        />
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    );
}
