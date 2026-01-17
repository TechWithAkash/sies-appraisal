'use client';

import { useMemo } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { CircularProgress } from '@/components/ui/ProgressBar';
import Table from '@/components/ui/Table';
import {
    FileText,
    Users,
    CheckCircle,
    Clock,
    ArrowRight,
    TrendingUp,
    Calendar,
    Award,
    BookOpen,
    Heart,
    Target,
    AlertCircle,
    AlertTriangle,
    ClipboardCheck,
    Building2,
    BarChart3,
    Eye,
} from 'lucide-react';
import Link from 'next/link';
import { users, appraisalCycles, departments } from '@/lib/data/mockData';

function TeacherDashboard() {
    const { user } = useAuth();
    const { getCurrentAppraisal, getFullAppraisalData, appraisalCycles } = useAppraisal();

    const currentAppraisal = getCurrentAppraisal(user.id);
    const fullData = currentAppraisal ? getFullAppraisalData(currentAppraisal.id) : null;
    const currentCycle = appraisalCycles.find(c => c.isOpen);

    const appraisalStatus = currentAppraisal?.status || 'NOT_STARTED';
    const grandTotal = currentAppraisal?.grandTotal || 0;

    // Simplified sections with clear descriptions
    const sections = [
        {
            id: 'part-a',
            label: 'Part A',
            title: 'General Information',
            desc: 'Personal details, qualifications & experience',
            icon: Users,
            href: '/appraisal/part-a',
            complete: !!fullData?.partA?.basic,
            score: null,
            maxScore: null,
        },
        {
            id: 'part-b',
            label: 'Part B',
            title: 'Research & Academic',
            desc: 'Publications, projects, patents & awards',
            icon: BookOpen,
            href: '/appraisal/part-b',
            complete: (fullData?.partB?.researchJournals?.length || 0) > 0,
            score: currentAppraisal?.totalPartB || 0,
            maxScore: 120,
        },
        {
            id: 'part-c',
            label: 'Part C',
            title: 'Contributions',
            desc: 'Committee roles, memberships & feedback',
            icon: Award,
            href: '/appraisal/part-c',
            complete: !!fullData?.partC?.keyContribution,
            score: currentAppraisal?.totalPartC || 0,
            maxScore: 100,
        },
        {
            id: 'part-d',
            label: 'Part D',
            title: 'Values',
            desc: 'Professional conduct & ethics',
            icon: Heart,
            href: '/appraisal/part-d',
            complete: !!fullData?.partD,
            score: currentAppraisal?.totalPartD || 0,
            maxScore: 30,
        },
        {
            id: 'part-e',
            label: 'Part E',
            title: 'Self Assessment',
            desc: 'Achievements, goals & development',
            icon: Target,
            href: '/appraisal/part-e',
            complete: !!fullData?.partE,
            score: null,
            maxScore: null,
        },
    ];

    const completedCount = sections.filter(s => s.complete).length;
    const isReadOnly = appraisalStatus !== 'DRAFT';

    // Status steps for progress tracker
    const statusSteps = [
        { key: 'DRAFT', label: 'Draft', desc: 'Fill all sections' },
        { key: 'SUBMITTED', label: 'Submitted', desc: 'Sent for review' },
        { key: 'HOD_REVIEWED', label: 'HOD Review', desc: 'Department head' },
        { key: 'IQAC_REVIEWED', label: 'IQAC Review', desc: 'Quality check' },
        { key: 'PRINCIPAL_REVIEWED', label: 'Approved', desc: 'Final approval' },
    ];
    const statusOrder = ['NOT_STARTED', 'DRAFT', 'SUBMITTED', 'HOD_REVIEWED', 'IQAC_REVIEWED', 'PRINCIPAL_REVIEWED'];
    const currentStatusIndex = statusOrder.indexOf(appraisalStatus);

    return (
        <>
            <Header
                title={`Welcome, ${user.name?.split(' ')[0]}!`}
                subtitle={currentCycle ? `Appraisal Year: ${currentCycle.academicYear}` : 'No active appraisal cycle'}
            />

            <div className="p-6 space-y-6">
                {/* Simple Status Banner */}
                <div className={`rounded-xl p-5 ${appraisalStatus === 'DRAFT' ? 'bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200' :
                        appraisalStatus === 'SUBMITTED' ? 'bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200' :
                            appraisalStatus === 'HOD_REVIEWED' ? 'bg-linear-to-r from-purple-50 to-pink-50 border border-purple-200' :
                                appraisalStatus === 'IQAC_REVIEWED' ? 'bg-linear-to-r from-indigo-50 to-violet-50 border border-indigo-200' :
                                    appraisalStatus === 'PRINCIPAL_REVIEWED' ? 'bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200' :
                                        'bg-linear-to-r from-slate-50 to-gray-50 border border-slate-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${appraisalStatus === 'DRAFT' ? 'bg-amber-100' :
                                    appraisalStatus === 'PRINCIPAL_REVIEWED' ? 'bg-emerald-100' :
                                        'bg-blue-100'
                                }`}>
                                {appraisalStatus === 'DRAFT' ? <FileText size={24} className="text-amber-600" /> :
                                    appraisalStatus === 'PRINCIPAL_REVIEWED' ? <CheckCircle size={24} className="text-emerald-600" /> :
                                        <Clock size={24} className="text-blue-600" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {appraisalStatus === 'DRAFT' && 'Complete Your Appraisal'}
                                    {appraisalStatus === 'SUBMITTED' && 'Awaiting HOD Review'}
                                    {appraisalStatus === 'HOD_REVIEWED' && 'Awaiting IQAC Review'}
                                    {appraisalStatus === 'IQAC_REVIEWED' && 'Awaiting Principal Approval'}
                                    {appraisalStatus === 'PRINCIPAL_REVIEWED' && 'Appraisal Approved! 🎉'}
                                    {appraisalStatus === 'NOT_STARTED' && 'Start Your Appraisal'}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    {appraisalStatus === 'DRAFT' && `${completedCount}/5 sections completed`}
                                    {appraisalStatus === 'SUBMITTED' && 'Your appraisal is under review by your department head'}
                                    {appraisalStatus === 'HOD_REVIEWED' && 'HOD approved. Now with IQAC for quality review'}
                                    {appraisalStatus === 'IQAC_REVIEWED' && 'IQAC approved. Pending final Principal approval'}
                                    {appraisalStatus === 'PRINCIPAL_REVIEWED' && 'Congratulations! Your appraisal is complete'}
                                    {appraisalStatus === 'NOT_STARTED' && 'Begin your annual appraisal submission'}
                                </p>
                            </div>
                        </div>
                        {appraisalStatus === 'DRAFT' && (
                            <Link href="/appraisal">
                                <Button icon={ArrowRight} iconPosition="right">
                                    Continue
                                </Button>
                            </Link>
                        )}
                        {isReadOnly && (
                            <Link href="/appraisal/view">
                                <Button variant="outline" icon={Eye}>
                                    View Details
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Appraisal Progress Tracker - Always visible */}
                <div className="bg-white rounded-xl border p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800">Appraisal Progress</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            appraisalStatus === 'DRAFT' ? 'bg-amber-100 text-amber-700' :
                            appraisalStatus === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                            appraisalStatus === 'HOD_REVIEWED' ? 'bg-purple-100 text-purple-700' :
                            appraisalStatus === 'IQAC_REVIEWED' ? 'bg-indigo-100 text-indigo-700' :
                            appraisalStatus === 'PRINCIPAL_REVIEWED' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-600'
                        }`}>
                            {appraisalStatus === 'NOT_STARTED' ? 'Not Started' : 
                             appraisalStatus === 'DRAFT' ? 'In Progress' :
                             appraisalStatus === 'SUBMITTED' ? 'Under Review' :
                             appraisalStatus === 'PRINCIPAL_REVIEWED' ? 'Complete' : 'Processing'}
                        </span>
                    </div>
                    
                    {/* Progress Steps */}
                    <div className="relative">
                        {/* Progress Line Background */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200" />
                        {/* Progress Line Filled */}
                        <div 
                            className="absolute top-5 left-0 h-0.5 bg-emerald-500 transition-all duration-500"
                            style={{ width: `${Math.max(0, (currentStatusIndex - 1) / (statusSteps.length - 1) * 100)}%` }}
                        />
                        
                        <div className="relative flex justify-between">
                            {statusSteps.map((step, index) => {
                                const stepIndex = statusOrder.indexOf(step.key);
                                const isCompleted = stepIndex < currentStatusIndex;
                                const isCurrent = stepIndex === currentStatusIndex;
                                const isPending = stepIndex > currentStatusIndex;

                                return (
                                    <div key={step.key} className="flex flex-col items-center" style={{ width: '20%' }}>
                                        {/* Step Circle */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                                            isCompleted 
                                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                                : isCurrent 
                                                    ? 'bg-white border-blue-500 text-blue-600 shadow-lg shadow-blue-100' 
                                                    : 'bg-white border-slate-200 text-slate-400'
                                        }`}>
                                            {isCompleted ? (
                                                <CheckCircle size={18} />
                                            ) : isCurrent ? (
                                                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                                            ) : (
                                                index + 1
                                            )}
                                        </div>
                                        
                                        {/* Step Label */}
                                        <span className={`text-xs font-medium mt-2 text-center ${
                                            isCompleted ? 'text-emerald-600' :
                                            isCurrent ? 'text-blue-600' :
                                            'text-slate-400'
                                        }`}>
                                            {step.label}
                                        </span>
                                        
                                        {/* Step Description */}
                                        <span className="text-[10px] text-slate-400 mt-0.5 text-center hidden sm:block">
                                            {step.desc}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Current Status Message */}
                    <div className={`mt-5 p-3 rounded-lg text-sm ${
                        appraisalStatus === 'DRAFT' ? 'bg-amber-50 text-amber-800' :
                        appraisalStatus === 'SUBMITTED' ? 'bg-blue-50 text-blue-800' :
                        appraisalStatus === 'HOD_REVIEWED' ? 'bg-purple-50 text-purple-800' :
                        appraisalStatus === 'IQAC_REVIEWED' ? 'bg-indigo-50 text-indigo-800' :
                        appraisalStatus === 'PRINCIPAL_REVIEWED' ? 'bg-emerald-50 text-emerald-800' :
                        'bg-slate-50 text-slate-700'
                    }`}>
                        {appraisalStatus === 'NOT_STARTED' && (
                            <span>📝 Start your appraisal by filling Part A - General Information</span>
                        )}
                        {appraisalStatus === 'DRAFT' && (
                            <span>✏️ Complete all 5 sections and submit for review ({completedCount}/5 done)</span>
                        )}
                        {appraisalStatus === 'SUBMITTED' && (
                            <span>⏳ Your HOD is reviewing your appraisal. You'll be notified once reviewed.</span>
                        )}
                        {appraisalStatus === 'HOD_REVIEWED' && (
                            <span>✅ HOD approved! Now with IQAC for quality assurance review.</span>
                        )}
                        {appraisalStatus === 'IQAC_REVIEWED' && (
                            <span>✅ IQAC approved! Awaiting final approval from Principal.</span>
                        )}
                        {appraisalStatus === 'PRINCIPAL_REVIEWED' && (
                            <span>🎉 Congratulations! Your appraisal has been fully approved.</span>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Score Summary Card */}
                    <Card className="lg:col-span-1">
                        <div className="text-center py-4">
                            <h3 className="text-sm font-medium text-slate-500 mb-4">Total Score</h3>
                            <CircularProgress
                                value={grandTotal}
                                max={250}
                                size={160}
                                strokeWidth={12}
                                label="Score"
                                sublabel={`${grandTotal}/250`}
                            />
                            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Part B</span>
                                    <span className="font-semibold">{currentAppraisal?.totalPartB || 0}/120</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Part C</span>
                                    <span className="font-semibold">{currentAppraisal?.totalPartC || 0}/100</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Part D</span>
                                    <span className="font-semibold">{currentAppraisal?.totalPartD || 0}/30</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Sections List */}
                    <div className="lg:col-span-3">
                        <Card>
                            <Card.Header>
                                <Card.Title>Appraisal Sections</Card.Title>
                                <span className="text-sm text-slate-500">{completedCount}/5 completed</span>
                            </Card.Header>
                            <div className="divide-y divide-slate-100">
                                {sections.map((section, index) => (
                                    <Link
                                        key={section.id}
                                        href={section.href}
                                        className={`flex items-center gap-4 p-4 transition-all hover:bg-slate-50 ${isReadOnly ? 'cursor-default' : ''
                                            }`}
                                    >
                                        {/* Section Number & Icon */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${section.complete ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            <section.icon size={22} />
                                        </div>

                                        {/* Section Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-400">{section.label}</span>
                                                {section.complete && (
                                                    <CheckCircle size={14} className="text-emerald-500" />
                                                )}
                                            </div>
                                            <h4 className="font-semibold text-slate-900">{section.title}</h4>
                                            <p className="text-sm text-slate-500 truncate">{section.desc}</p>
                                        </div>

                                        {/* Score (if applicable) */}
                                        {section.maxScore && (
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-slate-900">
                                                    {section.score}<span className="text-sm font-normal text-slate-400">/{section.maxScore}</span>
                                                </div>
                                                <div className="w-20 h-1.5 bg-slate-200 rounded-full mt-1">
                                                    <div
                                                        className="h-full bg-emerald-500 rounded-full transition-all"
                                                        style={{ width: `${Math.min((section.score / section.maxScore) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Arrow */}
                                        <ArrowRight size={18} className="text-slate-400" />
                                    </Link>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Quick Tips for Draft Status */}
                {appraisalStatus === 'DRAFT' && (
                    <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-100">
                        <div className="p-4">
                            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <AlertCircle size={18} />
                                Quick Tips
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                                    <p className="text-blue-800">Fill all sections in order from Part A to Part E</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                                    <p className="text-blue-800">Upload supporting documents for each entry</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                                    <p className="text-blue-800">Save frequently - your progress is auto-saved</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </>
    );
}

function HODDashboard() {
    const { user } = useAuth();
    const { getAppraisalsByDepartment, getAppraisalsByStatus } = useAppraisal();

    const deptAppraisals = getAppraisalsByDepartment(user.department);
    const pendingReview = deptAppraisals.filter(a => a.status === 'SUBMITTED');
    const reviewed = deptAppraisals.filter(a => ['HOD_REVIEWED', 'IQAC_REVIEWED', 'APPROVED'].includes(a.status));

    const columns = [
        {
            key: 'teacher', label: 'Teacher', render: (_, row) => (
                <div>
                    <p className="font-medium text-slate-900">{row.teacher?.name}</p>
                    <p className="text-xs text-slate-500">{row.teacher?.designation}</p>
                </div>
            )
        },
        { key: 'grandTotal', label: 'Score', render: (val) => `${val || 0}/250` },
        { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
        { key: 'submittedAt', label: 'Submitted', render: (val) => val || '-' },
        {
            key: 'actions', label: '', render: (_, row) => (
                <Link href={`/review/${row.id}`}>
                    <Button variant="ghost" size="sm">Review</Button>
                </Link>
            )
        },
    ];

    return (
        <>
            <Header
                title="HOD Dashboard"
                subtitle={`${user.department} Department`}
            />

            <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <StatCard
                        title="Total Faculty"
                        value={deptAppraisals.length}
                        icon={Users}
                        color="blue"
                    />
                    <StatCard
                        title="Pending Review"
                        value={pendingReview.length}
                        icon={Clock}
                        color="amber"
                    />
                    <StatCard
                        title="Reviewed"
                        value={reviewed.length}
                        icon={CheckCircle}
                        color="emerald"
                    />
                    <StatCard
                        title="Avg Score"
                        value={deptAppraisals.length ? Math.round(deptAppraisals.reduce((acc, a) => acc + (a.grandTotal || 0), 0) / deptAppraisals.length) : 0}
                        subtitle="out of 250"
                        icon={TrendingUp}
                        color="purple"
                    />
                </div>

                {/* Pending Reviews */}
                <Card>
                    <Card.Header>
                        <Card.Title>Pending Reviews</Card.Title>
                        <Link href="/review">
                            <Button variant="ghost" size="sm">View All</Button>
                        </Link>
                    </Card.Header>
                    <Table
                        columns={columns}
                        data={pendingReview}
                        emptyMessage="No appraisals pending review"
                    />
                </Card>
            </div>
        </>
    );
}

function IQACDashboard() {
    const { getAllAppraisalsWithDetails, getAppraisalsByStatus } = useAppraisal();

    const allAppraisals = getAllAppraisalsWithDetails();
    const pendingIQAC = allAppraisals.filter(a => a.status === 'HOD_REVIEWED');
    const reviewed = allAppraisals.filter(a => ['IQAC_REVIEWED', 'PRINCIPAL_REVIEWED'].includes(a.status));
    const totalSubmitted = allAppraisals.filter(a => a.status !== 'DRAFT').length;
    const inProgress = allAppraisals.filter(a => ['SUBMITTED', 'HOD_REVIEWED'].includes(a.status));

    // Department-wise statistics
    const departmentStats = useMemo(() => {
        const stats = {};
        allAppraisals.forEach(a => {
            const dept = a.teacher?.department || 'Unknown';
            if (!stats[dept]) {
                stats[dept] = { total: 0, pending: 0, reviewed: 0, totalScore: 0, completed: 0 };
            }
            stats[dept].total++;
            if (a.status === 'HOD_REVIEWED') stats[dept].pending++;
            if (['IQAC_REVIEWED', 'PRINCIPAL_REVIEWED'].includes(a.status)) {
                stats[dept].reviewed++;
                stats[dept].totalScore += a.grandTotal || 0;
            }
            if (a.status === 'PRINCIPAL_REVIEWED') stats[dept].completed++;
        });
        return Object.entries(stats).map(([name, data]) => ({
            name,
            ...data,
            avgScore: data.reviewed > 0 ? Math.round(data.totalScore / data.reviewed) : 0,
        }));
    }, [allAppraisals]);

    // Recent activity
    const recentActivity = useMemo(() => {
        return [...allAppraisals]
            .filter(a => a.iqacApprovedAt || a.hodApprovedAt)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);
    }, [allAppraisals]);

    const columns = [
        {
            key: 'teacher', label: 'Teacher', render: (_, row) => (
                <div>
                    <p className="font-medium text-slate-900">{row.teacher?.name}</p>
                    <p className="text-xs text-slate-500">{row.teacher?.department}</p>
                </div>
            )
        },
        { key: 'grandTotal', label: 'Self Score', render: (val) => <span className="font-semibold">{val || 0}/250</span> },
        {
            key: 'hodReviewedScore',
            label: 'HOD Score',
            render: (val, row) => (
                <span className="font-semibold text-blue-600">
                    {val || row.hodReview?.reviewedScore || '—'}
                </span>
            )
        },
        { key: 'hodApprovedAt', label: 'HOD Reviewed', render: (val) => val || '-' },
        {
            key: 'actions', label: '', render: (_, row) => (
                <Link href={`/review/${row.id}`}>
                    <Button variant="primary" size="sm" icon={ClipboardCheck}>Review</Button>
                </Link>
            )
        },
    ];

    const deptColumns = [
        { key: 'name', label: 'Department' },
        { key: 'total', label: 'Total', render: (val) => <span className="font-medium">{val}</span> },
        {
            key: 'pending', label: 'Pending', render: (val) => (
                <span className={`font-medium ${val > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{val}</span>
            )
        },
        {
            key: 'reviewed', label: 'Reviewed', render: (val) => (
                <span className="font-medium text-emerald-600">{val}</span>
            )
        },
        { key: 'avgScore', label: 'Avg Score', render: (val) => val > 0 ? `${val}/250` : '—' },
    ];

    return (
        <>
            <Header
                title="IQAC Dashboard"
                subtitle="Internal Quality Assurance Cell - Appraisal Review & Monitoring"
            />

            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                    <StatCard
                        title="Total Appraisals"
                        value={allAppraisals.length}
                        icon={FileText}
                        color="blue"
                    />
                    <StatCard
                        title="Pending IQAC Review"
                        value={pendingIQAC.length}
                        icon={Clock}
                        color="amber"
                        subtitle={pendingIQAC.length > 0 ? "Requires attention" : "All clear"}
                    />
                    <StatCard
                        title="IQAC Reviewed"
                        value={reviewed.length}
                        icon={CheckCircle}
                        color="emerald"
                    />
                    <StatCard
                        title="With HOD"
                        value={inProgress.filter(a => a.status === 'SUBMITTED').length}
                        icon={Users}
                        color="purple"
                        subtitle="Awaiting HOD review"
                    />
                    <StatCard
                        title="Fully Completed"
                        value={allAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED').length}
                        icon={Award}
                        color="indigo"
                        subtitle="Principal approved"
                    />
                </div>

                {/* Pending Review Alert */}
                {pendingIQAC.length > 0 && (
                    <div className="flex items-center gap-4 rounded-xl bg-amber-50 border border-amber-200 p-4">
                        <Clock className="h-6 w-6 text-amber-500" />
                        <div className="flex-1">
                            <p className="font-medium text-amber-800">
                                {pendingIQAC.length} Appraisal{pendingIQAC.length > 1 ? 's' : ''} Pending Your Review
                            </p>
                            <p className="text-sm text-amber-700">
                                These appraisals have been reviewed by their respective HODs and are awaiting IQAC review.
                            </p>
                        </div>
                        <Link href="/review">
                            <Button icon={ArrowRight} iconPosition="right">
                                Review All
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pending Reviews Table */}
                    <div className="lg:col-span-2">
                        <Card>
                            <Card.Header>
                                <Card.Title className="flex items-center gap-2">
                                    <ClipboardCheck size={20} className="text-amber-500" />
                                    Pending IQAC Review
                                </Card.Title>
                                <Link href="/review">
                                    <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                                        View All
                                    </Button>
                                </Link>
                            </Card.Header>
                            <Table
                                columns={columns}
                                data={pendingIQAC.slice(0, 5)}
                                emptyMessage="No appraisals pending IQAC review"
                            />
                        </Card>
                    </div>

                    {/* Department Summary */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center gap-2">
                                <Building2 size={20} className="text-blue-500" />
                                Department Summary
                            </Card.Title>
                        </Card.Header>
                        <div className="space-y-3">
                            {departmentStats.map(dept => (
                                <div key={dept.name} className="p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium text-slate-900">{dept.name}</p>
                                        <span className="text-xs text-slate-500">{dept.total} total</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all"
                                                style={{ width: `${dept.total > 0 ? (dept.reviewed / dept.total) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-600 w-12 text-right">
                                            {dept.reviewed}/{dept.total}
                                        </span>
                                    </div>
                                    {dept.pending > 0 && (
                                        <p className="text-xs text-amber-600 mt-1">
                                            {dept.pending} pending review
                                        </p>
                                    )}
                                </div>
                            ))}
                            {departmentStats.length === 0 && (
                                <p className="text-slate-500 text-center py-4">No department data</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Department Overview Table */}
                <Card>
                    <Card.Header>
                        <Card.Title>Department-wise Analysis</Card.Title>
                        <Link href="/departments">
                            <Button variant="secondary" size="sm" icon={Eye}>
                                Detailed View
                            </Button>
                        </Link>
                    </Card.Header>
                    <Table
                        columns={deptColumns}
                        data={departmentStats}
                        emptyMessage="No department data available"
                    />
                </Card>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/review" className="block">
                        <Card className="hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl bg-emerald-100 p-3">
                                    <ClipboardCheck className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Review Appraisals</h3>
                                    <p className="text-sm text-slate-500">Evaluate and approve submissions</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                    <Link href="/departments" className="block">
                        <Card className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl bg-blue-100 p-3">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">All Departments</h3>
                                    <p className="text-sm text-slate-500">View department-wise progress</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                    <Link href="/reports" className="block">
                        <Card className="hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl bg-purple-100 p-3">
                                    <BarChart3 className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Reports</h3>
                                    <p className="text-sm text-slate-500">Analytics and insights</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </>
    );
}

function PrincipalDashboard() {
    const { getAllAppraisalsWithDetails } = useAppraisal();

    const allAppraisals = getAllAppraisalsWithDetails();
    const pendingApproval = allAppraisals.filter(a => a.status === 'IQAC_REVIEWED');
    const approved = allAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED');
    const inProgress = allAppraisals.filter(a => ['SUBMITTED', 'HOD_REVIEWED'].includes(a.status));
    const withIQAC = allAppraisals.filter(a => a.status === 'HOD_REVIEWED');
    const withHOD = allAppraisals.filter(a => a.status === 'SUBMITTED');

    // Department statistics
    const departmentStats = useMemo(() => {
        const stats = {};
        allAppraisals.forEach(a => {
            const dept = a.teacher?.department || 'Unknown';
            if (!stats[dept]) {
                stats[dept] = {
                    name: dept,
                    total: 0,
                    pending: 0,
                    approved: 0,
                    inProgress: 0,
                    avgScore: 0,
                    scores: []
                };
            }
            stats[dept].total++;
            if (a.status === 'IQAC_REVIEWED') stats[dept].pending++;
            if (a.status === 'PRINCIPAL_REVIEWED') {
                stats[dept].approved++;
                stats[dept].scores.push(a.finalScore || a.grandTotal || 0);
            }
            if (['SUBMITTED', 'HOD_REVIEWED'].includes(a.status)) stats[dept].inProgress++;
        });

        return Object.values(stats).map(dept => ({
            ...dept,
            avgScore: dept.scores.length > 0
                ? Math.round(dept.scores.reduce((a, b) => a + b, 0) / dept.scores.length)
                : 0,
            completionRate: dept.total > 0 ? Math.round((dept.approved / dept.total) * 100) : 0
        }));
    }, [allAppraisals]);

    // Recently approved
    const recentlyApproved = useMemo(() => {
        return [...approved]
            .sort((a, b) => new Date(b.principalApprovedAt || b.updatedAt) - new Date(a.principalApprovedAt || a.updatedAt))
            .slice(0, 5);
    }, [approved]);

    const columns = [
        {
            key: 'teacher', label: 'Teacher', render: (_, row) => (
                <div>
                    <p className="font-medium text-slate-900">{row.teacher?.name}</p>
                    <p className="text-xs text-slate-500">{row.teacher?.department}</p>
                </div>
            )
        },
        { key: 'grandTotal', label: 'Self Score', render: (val) => <span className="font-medium">{val || 0}/250</span> },
        {
            key: 'iqacReviewedScore',
            label: 'IQAC Score',
            render: (val, row) => (
                <span className="font-medium text-purple-600">
                    {val || row.iqacReview?.reviewedScore || '—'}
                </span>
            )
        },
        { key: 'iqacApprovedAt', label: 'IQAC Reviewed', render: (val) => val || '-' },
        {
            key: 'actions', label: '', render: (_, row) => (
                <Link href={`/review/${row.id}`}>
                    <Button variant="primary" size="sm" icon={CheckCircle}>Approve</Button>
                </Link>
            )
        },
    ];

    const approvedColumns = [
        {
            key: 'teacher', label: 'Teacher', render: (_, row) => (
                <div>
                    <p className="font-medium text-slate-900">{row.teacher?.name}</p>
                    <p className="text-xs text-slate-500">{row.teacher?.department}</p>
                </div>
            )
        },
        {
            key: 'finalScore',
            label: 'Final Score',
            render: (val, row) => (
                <span className="font-bold text-emerald-600">{val || row.grandTotal || 0}/250</span>
            )
        },
        { key: 'principalApprovedAt', label: 'Approved On', render: (val) => val || '-' },
        {
            key: 'actions', label: '', render: (_, row) => (
                <Link href={`/review/${row.id}`}>
                    <Button variant="ghost" size="sm" icon={Eye}>View</Button>
                </Link>
            )
        },
    ];

    const deptColumns = [
        { key: 'name', label: 'Department' },
        { key: 'total', label: 'Total', render: (val) => <span className="font-medium">{val}</span> },
        {
            key: 'pending', label: 'Pending', render: (val) => (
                <span className={`font-medium ${val > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{val}</span>
            )
        },
        {
            key: 'approved', label: 'Approved', render: (val) => (
                <span className="font-medium text-emerald-600">{val}</span>
            )
        },
        {
            key: 'completionRate', label: 'Completion', render: (val) => (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${val}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium">{val}%</span>
                </div>
            )
        },
        { key: 'avgScore', label: 'Avg Score', render: (val) => val > 0 ? `${val}/250` : '—' },
    ];

    return (
        <>
            <Header
                title="Principal Dashboard"
                subtitle="Final Approval & Institutional Overview"
            />

            <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                    <StatCard
                        title="Total Faculty"
                        value={allAppraisals.length}
                        icon={Users}
                        color="blue"
                    />
                    <StatCard
                        title="In Progress"
                        value={inProgress.length}
                        icon={Clock}
                        color="slate"
                        subtitle="With HOD/IQAC"
                    />
                    <StatCard
                        title="Pending Approval"
                        value={pendingApproval.length}
                        icon={Clock}
                        color="amber"
                        subtitle="Requires your action"
                    />
                    <StatCard
                        title="Approved"
                        value={approved.length}
                        icon={CheckCircle}
                        color="emerald"
                    />
                    <StatCard
                        title="Avg Score"
                        value={approved.length ? Math.round(approved.reduce((acc, a) => acc + (a.finalScore || a.grandTotal || 0), 0) / approved.length) : 0}
                        subtitle="of approved"
                        icon={TrendingUp}
                        color="purple"
                    />
                </div>

                {/* Pending Alert */}
                {pendingApproval.length > 0 && (
                    <div className="flex items-center gap-4 rounded-xl bg-amber-50 border border-amber-200 p-4">
                        <Clock className="h-6 w-6 text-amber-500" />
                        <div className="flex-1">
                            <p className="font-medium text-amber-800">
                                {pendingApproval.length} Appraisal{pendingApproval.length > 1 ? 's' : ''} Pending Final Approval
                            </p>
                            <p className="text-sm text-amber-700">
                                These appraisals have been reviewed by IQAC and are ready for your final approval.
                            </p>
                        </div>
                        <Link href="/review">
                            <Button icon={ArrowRight} iconPosition="right">
                                Review All
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Pending Table */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <Card.Header>
                                <Card.Title className="flex items-center gap-2">
                                    <ClipboardCheck size={20} className="text-amber-500" />
                                    Pending Final Approval
                                </Card.Title>
                                <Link href="/review">
                                    <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                                        View All
                                    </Button>
                                </Link>
                            </Card.Header>
                            <Table
                                columns={columns}
                                data={pendingApproval.slice(0, 5)}
                                emptyMessage="No appraisals pending approval"
                            />
                        </Card>
                    </div>

                    {/* Workflow Status Summary */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center gap-2">
                                <Clock size={20} className="text-blue-500" />
                                Workflow Status
                            </Card.Title>
                        </Card.Header>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-amber-500 rounded-full" />
                                    <span className="font-medium text-slate-700">With HOD</span>
                                </div>
                                <span className="text-lg font-bold text-amber-600">{withHOD.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                                    <span className="font-medium text-slate-700">With IQAC</span>
                                </div>
                                <span className="text-lg font-bold text-purple-600">{withIQAC.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                    <span className="font-medium text-slate-700">Awaiting Your Approval</span>
                                </div>
                                <span className="text-lg font-bold text-blue-600">{pendingApproval.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                                    <span className="font-medium text-slate-700">Completed</span>
                                </div>
                                <span className="text-lg font-bold text-emerald-600">{approved.length}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Department Overview */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <Building2 size={20} className="text-blue-500" />
                            Department-wise Progress
                        </Card.Title>
                        <Link href="/departments">
                            <Button variant="secondary" size="sm" icon={Eye}>
                                Detailed View
                            </Button>
                        </Link>
                    </Card.Header>
                    <Table
                        columns={deptColumns}
                        data={departmentStats}
                        emptyMessage="No department data available"
                    />
                </Card>

                {/* Recently Approved */}
                {recentlyApproved.length > 0 && (
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center gap-2">
                                <CheckCircle size={20} className="text-emerald-500" />
                                Recently Approved
                            </Card.Title>
                        </Card.Header>
                        <Table
                            columns={approvedColumns}
                            data={recentlyApproved}
                            emptyMessage="No approved appraisals yet"
                        />
                    </Card>
                )}

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/review" className="block">
                        <Card className="hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl bg-emerald-100 p-3">
                                    <ClipboardCheck className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Final Approval</h3>
                                    <p className="text-sm text-slate-500">Review and approve appraisals</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                    <Link href="/departments" className="block">
                        <Card className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl bg-blue-100 p-3">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">All Departments</h3>
                                    <p className="text-sm text-slate-500">View department-wise progress</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                    <Link href="/reports" className="block">
                        <Card className="hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl bg-purple-100 p-3">
                                    <BarChart3 className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Reports</h3>
                                    <p className="text-sm text-slate-500">Analytics and insights</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </>
    );
}

function AdminDashboard() {
    const { getAllAppraisalsWithDetails, appraisalCycles } = useAppraisal();

    const allAppraisals = getAllAppraisalsWithDetails();
    const currentCycle = appraisalCycles.find(c => c.isOpen);
    const teachers = users.filter(u => u.role === 'TEACHER');
    const hods = users.filter(u => u.role === 'HOD');
    const allUsers = users;

    // Status counts with proper status names
    const statusCounts = useMemo(() => ({
        DRAFT: allAppraisals.filter(a => a.status === 'DRAFT').length,
        SUBMITTED: allAppraisals.filter(a => a.status === 'SUBMITTED').length,
        HOD_REVIEWED: allAppraisals.filter(a => a.status === 'HOD_REVIEWED').length,
        IQAC_REVIEWED: allAppraisals.filter(a => a.status === 'IQAC_REVIEWED').length,
        PRINCIPAL_REVIEWED: allAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED').length,
    }), [allAppraisals]);

    // Calculate completion percentage
    const completionRate = allAppraisals.length > 0
        ? Math.round((statusCounts.PRINCIPAL_REVIEWED / allAppraisals.length) * 100)
        : 0;

    // Department-wise stats
    const departmentStats = useMemo(() => {
        const stats = {};
        allAppraisals.forEach(a => {
            const dept = a.department || a.teacher?.department || 'Unknown';
            if (!stats[dept]) {
                stats[dept] = {
                    name: dept,
                    total: 0,
                    draft: 0,
                    submitted: 0,
                    hodReviewed: 0,
                    iqacReviewed: 0,
                    completed: 0,
                    scores: []
                };
            }
            stats[dept].total++;
            if (a.status === 'DRAFT') stats[dept].draft++;
            if (a.status === 'SUBMITTED') stats[dept].submitted++;
            if (a.status === 'HOD_REVIEWED') stats[dept].hodReviewed++;
            if (a.status === 'IQAC_REVIEWED') stats[dept].iqacReviewed++;
            if (a.status === 'PRINCIPAL_REVIEWED') {
                stats[dept].completed++;
                stats[dept].scores.push(a.finalScore || a.grandTotal || 0);
            }
        });

        return Object.values(stats).map(dept => ({
            ...dept,
            avgScore: dept.scores.length > 0
                ? Math.round(dept.scores.reduce((a, b) => a + b, 0) / dept.scores.length)
                : 0,
            completionRate: dept.total > 0 ? Math.round((dept.completed / dept.total) * 100) : 0
        }));
    }, [allAppraisals]);

    // Recent activities - last 10 appraisals by updated date
    const recentActivities = useMemo(() => {
        return [...allAppraisals]
            .sort((a, b) => new Date(b.updatedAt || b.submittedAt || 0) - new Date(a.updatedAt || a.submittedAt || 0))
            .slice(0, 8);
    }, [allAppraisals]);

    // Bottleneck analysis - where are appraisals stuck
    const bottlenecks = useMemo(() => {
        const withHOD = statusCounts.SUBMITTED;
        const withIQAC = statusCounts.HOD_REVIEWED;
        const withPrincipal = statusCounts.IQAC_REVIEWED;
        const total = withHOD + withIQAC + withPrincipal;

        return {
            withHOD,
            withIQAC,
            withPrincipal,
            total,
            mostBacklog: withHOD >= withIQAC && withHOD >= withPrincipal ? 'HOD'
                : withIQAC >= withPrincipal ? 'IQAC' : 'Principal'
        };
    }, [statusCounts]);

    // Average score of completed appraisals
    const avgScore = useMemo(() => {
        const completed = allAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED' && (a.finalScore || a.grandTotal));
        if (completed.length === 0) return 0;
        return Math.round(completed.reduce((sum, a) => sum + (a.finalScore || a.grandTotal || 0), 0) / completed.length);
    }, [allAppraisals]);

    const deptColumns = [
        { key: 'name', label: 'Department' },
        { key: 'total', label: 'Total' },
        {
            key: 'draft', label: 'Draft', render: (val) => (
                <span className={`font-medium ${val > 0 ? 'text-slate-600' : 'text-slate-400'}`}>{val}</span>
            )
        },
        {
            key: 'submitted', label: 'With HOD', render: (val) => (
                <span className={`font-medium ${val > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{val}</span>
            )
        },
        {
            key: 'hodReviewed', label: 'With IQAC', render: (val) => (
                <span className={`font-medium ${val > 0 ? 'text-purple-600' : 'text-slate-400'}`}>{val}</span>
            )
        },
        {
            key: 'iqacReviewed', label: 'With Principal', render: (val) => (
                <span className={`font-medium ${val > 0 ? 'text-blue-600' : 'text-slate-400'}`}>{val}</span>
            )
        },
        {
            key: 'completed', label: 'Completed', render: (val) => (
                <span className="font-medium text-emerald-600">{val}</span>
            )
        },
        {
            key: 'completionRate', label: 'Progress', render: (val) => (
                <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${val}%` }} />
                    </div>
                    <span className="text-sm font-medium">{val}%</span>
                </div>
            )
        },
    ];

    return (
        <>
            <Header
                title="Admin Dashboard"
                subtitle="System Overview & Management"
            />

            <div className="p-6 space-y-6">
                {/* Main Stats Row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                    <StatCard
                        title="Active Cycle"
                        value={currentCycle?.academicYear || 'None'}
                        icon={Calendar}
                        color="blue"
                    />
                    <StatCard
                        title="Total Users"
                        value={allUsers.length}
                        icon={Users}
                        color="purple"
                        subtitle={`${teachers.length} Teachers`}
                    />
                    <StatCard
                        title="Departments"
                        value={departments.length}
                        icon={Building2}
                        color="indigo"
                        subtitle={`${hods.length} HODs`}
                    />
                    <StatCard
                        title="Total Appraisals"
                        value={allAppraisals.length}
                        icon={FileText}
                        color="amber"
                    />
                    <StatCard
                        title="Completed"
                        value={statusCounts.PRINCIPAL_REVIEWED}
                        icon={CheckCircle}
                        color="emerald"
                        subtitle={`${completionRate}% completion`}
                    />
                    <StatCard
                        title="Avg Score"
                        value={avgScore > 0 ? `${avgScore}/250` : 'N/A'}
                        icon={TrendingUp}
                        color="emerald"
                    />
                </div>

                {/* Bottleneck Alert */}
                {bottlenecks.total > 0 && (
                    <div className="flex items-center gap-4 rounded-xl bg-amber-50 border border-amber-200 p-4">
                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                        <div className="flex-1">
                            <p className="font-medium text-amber-800">
                                {bottlenecks.total} Appraisal{bottlenecks.total > 1 ? 's' : ''} Pending Review
                            </p>
                            <p className="text-sm text-amber-700">
                                {bottlenecks.withHOD} with HOD • {bottlenecks.withIQAC} with IQAC • {bottlenecks.withPrincipal} with Principal
                                {bottlenecks.total > 3 && ` — Most backlog at ${bottlenecks.mostBacklog} stage`}
                            </p>
                        </div>
                        <Link href="/admin/appraisals">
                            <Button icon={ArrowRight} iconPosition="right">View All</Button>
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Workflow Pipeline */}
                    <Card className="lg:col-span-2">
                        <Card.Header>
                            <Card.Title className="flex items-center gap-2">
                                <ClipboardCheck size={20} />
                                Appraisal Workflow Pipeline
                            </Card.Title>
                        </Card.Header>
                        <div className="flex items-center justify-between gap-2">
                            {[
                                { key: 'DRAFT', label: 'Draft', bgColor: 'bg-slate-100', textColor: 'text-slate-700', count: statusCounts.DRAFT },
                                { key: 'SUBMITTED', label: 'With HOD', bgColor: 'bg-amber-100', textColor: 'text-amber-700', count: statusCounts.SUBMITTED },
                                { key: 'HOD_REVIEWED', label: 'With IQAC', bgColor: 'bg-purple-100', textColor: 'text-purple-700', count: statusCounts.HOD_REVIEWED },
                                { key: 'IQAC_REVIEWED', label: 'With Principal', bgColor: 'bg-blue-100', textColor: 'text-blue-700', count: statusCounts.IQAC_REVIEWED },
                                { key: 'PRINCIPAL_REVIEWED', label: 'Completed', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700', count: statusCounts.PRINCIPAL_REVIEWED },
                            ].map((stage, i, arr) => (
                                <div key={stage.key} className="flex items-center flex-1">
                                    <div className={`flex-1 text-center p-4 rounded-lg ${stage.bgColor}`}>
                                        <p className={`text-2xl font-bold ${stage.textColor}`}>{stage.count}</p>
                                        <p className={`text-xs mt-1 ${stage.textColor}`}>{stage.label}</p>
                                    </div>
                                    {i < arr.length - 1 && (
                                        <ArrowRight size={16} className="mx-1 text-slate-400 shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Quick Actions</Card.Title>
                        </Card.Header>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/admin/cycles">
                                <div className="rounded-lg border border-slate-200 p-3 text-center transition-all hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer">
                                    <Calendar className="mx-auto h-6 w-6 text-emerald-600 mb-1" />
                                    <p className="text-xs font-medium text-slate-900">Manage Cycles</p>
                                </div>
                            </Link>
                            <Link href="/admin/users">
                                <div className="rounded-lg border border-slate-200 p-3 text-center transition-all hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer">
                                    <Users className="mx-auto h-6 w-6 text-blue-600 mb-1" />
                                    <p className="text-xs font-medium text-slate-900">Manage Users</p>
                                </div>
                            </Link>
                            <Link href="/admin/appraisals">
                                <div className="rounded-lg border border-slate-200 p-3 text-center transition-all hover:border-amber-300 hover:bg-amber-50/50 cursor-pointer">
                                    <FileText className="mx-auto h-6 w-6 text-amber-600 mb-1" />
                                    <p className="text-xs font-medium text-slate-900">All Appraisals</p>
                                </div>
                            </Link>
                            <Link href="/reports">
                                <div className="rounded-lg border border-slate-200 p-3 text-center transition-all hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer">
                                    <BarChart3 className="mx-auto h-6 w-6 text-purple-600 mb-1" />
                                    <p className="text-xs font-medium text-slate-900">Reports</p>
                                </div>
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* Department Overview Table */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <Building2 size={20} />
                            Department-wise Progress
                        </Card.Title>
                        <Link href="/departments">
                            <Button variant="ghost" size="sm" icon={Eye}>View Details</Button>
                        </Link>
                    </Card.Header>
                    <Table
                        columns={deptColumns}
                        data={departmentStats}
                        emptyMessage="No department data available"
                    />
                </Card>

                {/* Recent Activity */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <Clock size={20} />
                            Recent Activity
                        </Card.Title>
                        <Link href="/admin/appraisals">
                            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">View All</Button>
                        </Link>
                    </Card.Header>
                    <div className="space-y-3">
                        {recentActivities.map(a => (
                            <div key={a.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                                <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {a.teacher?.name?.charAt(0) || a.teacherName?.charAt(0) || 'T'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 truncate">
                                        {a.teacher?.name || a.teacherName}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {a.department || a.teacher?.department} • Updated {a.updatedAt || a.submittedAt || 'Recently'}
                                    </p>
                                </div>
                                <StatusBadge status={a.status} />
                                <Link href={`/review/${a.id}`}>
                                    <Button variant="ghost" size="sm" icon={Eye}>View</Button>
                                </Link>
                            </div>
                        ))}
                        {recentActivities.length === 0 && (
                            <p className="text-center text-slate-500 py-4">No recent activity</p>
                        )}
                    </div>
                </Card>

                {/* System Health */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="text-center">
                        <div className="p-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-3">
                                <CheckCircle className="h-6 w-6 text-emerald-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{completionRate}%</p>
                            <p className="text-sm text-slate-500">Overall Completion</p>
                        </div>
                    </Card>
                    <Card className="text-center">
                        <div className="p-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{teachers.length - allAppraisals.length}</p>
                            <p className="text-sm text-slate-500">Not Started</p>
                        </div>
                    </Card>
                    <Card className="text-center">
                        <div className="p-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-3">
                                <Clock className="h-6 w-6 text-amber-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{bottlenecks.total}</p>
                            <p className="text-sm text-slate-500">In Review Queue</p>
                        </div>
                    </Card>
                    <Card className="text-center">
                        <div className="p-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-3">
                                <Calendar className="h-6 w-6 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{appraisalCycles.length}</p>
                            <p className="text-sm text-slate-500">Total Cycles</p>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default function DashboardPage() {
    const { user } = useAuth();

    const getDashboard = () => {
        switch (user?.role) {
            case 'TEACHER':
                return <TeacherDashboard />;
            case 'HOD':
                return <HODDashboard />;
            case 'IQAC':
                return <IQACDashboard />;
            case 'PRINCIPAL':
                return <PrincipalDashboard />;
            case 'ADMIN':
                return <AdminDashboard />;
            default:
                return <TeacherDashboard />;
        }
    };

    return (
        <DashboardLayout>
            {getDashboard()}
        </DashboardLayout>
    );
}
