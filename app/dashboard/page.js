'use client';

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
} from 'lucide-react';
import Link from 'next/link';
import { users, appraisalCycles } from '@/lib/data/mockData';

function TeacherDashboard() {
    const { user } = useAuth();
    const { getCurrentAppraisal, getFullAppraisalData, appraisalCycles } = useAppraisal();

    const currentAppraisal = getCurrentAppraisal(user.id);
    const fullData = currentAppraisal ? getFullAppraisalData(currentAppraisal.id) : null;
    const currentCycle = appraisalCycles.find(c => c.isOpen);

    const appraisalStatus = currentAppraisal?.status || 'NOT_STARTED';
    const grandTotal = currentAppraisal?.grandTotal || 0;
    const percentage = Math.round((grandTotal / 250) * 100);

    const sections = [
        { id: 'part-a', label: 'Part A - General Information', icon: Users, href: '/appraisal/part-a', complete: !!fullData?.partA?.basic },
        { id: 'part-b', label: 'Part B - Research & Academic', icon: BookOpen, href: '/appraisal/part-b', complete: (fullData?.partB?.researchJournals?.length || 0) > 0 },
        { id: 'part-c', label: 'Part C - Contributions', icon: Award, href: '/appraisal/part-c', complete: !!fullData?.partC?.keyContribution },
        { id: 'part-d', label: 'Part D - Values', icon: Heart, href: '/appraisal/part-d', complete: !!fullData?.partD },
        { id: 'part-e', label: 'Part E - Self Assessment', icon: Target, href: '/appraisal/part-e', complete: !!fullData?.partE },
    ];

    return (
        <>
            <Header
                title={`Welcome back, ${user.name?.split(' ')[0]}`}
                subtitle={`${user.designation} • ${user.department}`}
            />

            <div className="p-6 space-y-6">
                {/* Alert Banner */}
                {currentCycle && appraisalStatus === 'DRAFT' && (
                    <div className="flex items-center gap-4 rounded-xl bg-amber-50 border border-amber-200 p-4">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <div className="flex-1">
                            <p className="font-medium text-amber-800">Appraisal Submission Pending</p>
                            <p className="text-sm text-amber-700">
                                Complete your appraisal for {currentCycle.academicYear} before the deadline.
                            </p>
                        </div>
                        <Link href="/appraisal">
                            <Button size="sm" icon={ArrowRight} iconPosition="right">
                                Continue Appraisal
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Appraisal Review Progress Tracker */}
                {currentAppraisal && (
                    <Card>
                        <Card.Header>
                            <Card.Title>Appraisal Review Progress</Card.Title>
                            <StatusBadge status={appraisalStatus} />
                        </Card.Header>
                        <div className="py-4">
                            {/* Progress Steps */}
                            <div className="relative">
                                {/* Progress Line Background */}
                                <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 rounded-full mx-8" />

                                {/* Active Progress Line */}
                                <div
                                    className="absolute top-6 left-0 h-1 bg-emerald-500 rounded-full mx-8 transition-all duration-500"
                                    style={{
                                        width: `calc(${appraisalStatus === 'DRAFT' ? '0%' :
                                                appraisalStatus === 'SUBMITTED' ? '25%' :
                                                    appraisalStatus === 'HOD_REVIEWED' ? '50%' :
                                                        appraisalStatus === 'IQAC_REVIEWED' ? '75%' :
                                                            appraisalStatus === 'PRINCIPAL_REVIEWED' ? '100%' : '0%'
                                            } - 4rem)`
                                    }}
                                />

                                {/* Steps */}
                                <div className="relative flex justify-between">
                                    {[
                                        { key: 'DRAFT', label: 'Draft', sublabel: 'Fill Form', icon: FileText },
                                        { key: 'SUBMITTED', label: 'Submitted', sublabel: 'Awaiting HOD', icon: Clock },
                                        { key: 'HOD_REVIEWED', label: 'HOD Review', sublabel: 'Department Head', icon: Users },
                                        { key: 'IQAC_REVIEWED', label: 'IQAC Review', sublabel: 'Quality Cell', icon: Award },
                                        { key: 'PRINCIPAL_REVIEWED', label: 'Approved', sublabel: 'Principal', icon: CheckCircle },
                                    ].map((step, index) => {
                                        const statusOrder = ['NOT_STARTED', 'DRAFT', 'SUBMITTED', 'HOD_REVIEWED', 'IQAC_REVIEWED', 'PRINCIPAL_REVIEWED'];
                                        const currentIndex = statusOrder.indexOf(appraisalStatus);
                                        const stepIndex = statusOrder.indexOf(step.key);
                                        const isCompleted = stepIndex < currentIndex;
                                        const isCurrent = stepIndex === currentIndex;
                                        const isPending = stepIndex > currentIndex;

                                        return (
                                            <div key={step.key} className="flex flex-col items-center z-10">
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${isCompleted
                                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                                            : isCurrent
                                                                ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                                                                : 'bg-white border-slate-300 text-slate-400'
                                                        }`}
                                                >
                                                    {isCompleted ? (
                                                        <CheckCircle size={24} />
                                                    ) : (
                                                        <step.icon size={20} />
                                                    )}
                                                </div>
                                                <p className={`mt-2 text-sm font-medium ${isCompleted ? 'text-emerald-600' :
                                                        isCurrent ? 'text-blue-600' :
                                                            'text-slate-400'
                                                    }`}>
                                                    {step.label}
                                                </p>
                                                <p className={`text-xs ${isCompleted ? 'text-emerald-500' :
                                                        isCurrent ? 'text-blue-500' :
                                                            'text-slate-400'
                                                    }`}>
                                                    {step.sublabel}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Status Message */}
                            <div className={`mt-6 p-4 rounded-lg text-center ${appraisalStatus === 'DRAFT' ? 'bg-amber-50 border border-amber-200' :
                                    appraisalStatus === 'SUBMITTED' ? 'bg-blue-50 border border-blue-200' :
                                        appraisalStatus === 'HOD_REVIEWED' ? 'bg-purple-50 border border-purple-200' :
                                            appraisalStatus === 'IQAC_REVIEWED' ? 'bg-indigo-50 border border-indigo-200' :
                                                appraisalStatus === 'PRINCIPAL_REVIEWED' ? 'bg-emerald-50 border border-emerald-200' :
                                                    'bg-slate-50 border border-slate-200'
                                }`}>
                                <p className={`font-medium ${appraisalStatus === 'DRAFT' ? 'text-amber-800' :
                                        appraisalStatus === 'SUBMITTED' ? 'text-blue-800' :
                                            appraisalStatus === 'HOD_REVIEWED' ? 'text-purple-800' :
                                                appraisalStatus === 'IQAC_REVIEWED' ? 'text-indigo-800' :
                                                    appraisalStatus === 'PRINCIPAL_REVIEWED' ? 'text-emerald-800' :
                                                        'text-slate-800'
                                    }`}>
                                    {appraisalStatus === 'DRAFT' && '📝 Your appraisal is in draft. Complete all sections and submit.'}
                                    {appraisalStatus === 'SUBMITTED' && '⏳ Your appraisal has been submitted and is awaiting HOD review.'}
                                    {appraisalStatus === 'HOD_REVIEWED' && '✅ HOD has reviewed. Now pending IQAC review.'}
                                    {appraisalStatus === 'IQAC_REVIEWED' && '✅ IQAC has reviewed. Now pending Principal approval.'}
                                    {appraisalStatus === 'PRINCIPAL_REVIEWED' && '🎉 Congratulations! Your appraisal has been fully approved.'}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Current Appraisal"
                        value={currentCycle?.academicYear || 'N/A'}
                        subtitle={`Status: ${appraisalStatus}`}
                        icon={Calendar}
                        color="blue"
                    />
                    <StatCard
                        title="Part B Score"
                        value={`${currentAppraisal?.totalPartB || 0}/120`}
                        subtitle="Research & Academic"
                        icon={BookOpen}
                        color="emerald"
                    />
                    <StatCard
                        title="Part C Score"
                        value={`${currentAppraisal?.totalPartC || 0}/100`}
                        subtitle="Contributions"
                        icon={Award}
                        color="amber"
                    />
                    <StatCard
                        title="Part D Score"
                        value={`${currentAppraisal?.totalPartD || 0}/30`}
                        subtitle="Values"
                        icon={Heart}
                        color="purple"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Progress Card */}
                    <Card className="lg:col-span-1">
                        <Card.Header>
                            <Card.Title>Overall Progress</Card.Title>
                        </Card.Header>
                        <div className="flex flex-col items-center py-4">
                            <CircularProgress
                                value={grandTotal}
                                max={250}
                                size={180}
                                strokeWidth={14}
                                label="Score"
                                sublabel={`${grandTotal}/250`}
                            />
                            <div className="mt-6 w-full space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Status</span>
                                    <StatusBadge status={appraisalStatus} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Grand Total</span>
                                    <span className="font-semibold text-slate-900">{grandTotal} / 250</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Sections Card */}
                    <Card className="lg:col-span-2">
                        <Card.Header>
                            <Card.Title>Appraisal Sections</Card.Title>
                            <Link href="/appraisal">
                                <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                                    View All
                                </Button>
                            </Link>
                        </Card.Header>
                        <div className="space-y-3">
                            {sections.map((section) => (
                                <Link
                                    key={section.id}
                                    href={section.href}
                                    className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50/50"
                                >
                                    <div className={`rounded-lg p-2 ${section.complete ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <section.icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900">{section.label}</p>
                                    </div>
                                    {section.complete ? (
                                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-slate-400" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </Card>
                </div>
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
    const reviewed = allAppraisals.filter(a => ['IQAC_REVIEWED', 'APPROVED'].includes(a.status));
    const totalSubmitted = allAppraisals.filter(a => a.status !== 'DRAFT').length;

    const columns = [
        {
            key: 'teacher', label: 'Teacher', render: (_, row) => (
                <div>
                    <p className="font-medium text-slate-900">{row.teacher?.name}</p>
                    <p className="text-xs text-slate-500">{row.teacher?.department}</p>
                </div>
            )
        },
        { key: 'grandTotal', label: 'Score', render: (val) => `${val || 0}/250` },
        { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
        { key: 'hodApprovedAt', label: 'HOD Reviewed', render: (val) => val || '-' },
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
                title="IQAC Dashboard"
                subtitle="Quality Assurance Overview"
            />

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
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
                    />
                    <StatCard
                        title="IQAC Reviewed"
                        value={reviewed.length}
                        icon={CheckCircle}
                        color="emerald"
                    />
                    <StatCard
                        title="Submitted"
                        value={totalSubmitted}
                        icon={TrendingUp}
                        color="purple"
                    />
                </div>

                <Card>
                    <Card.Header>
                        <Card.Title>Pending IQAC Review</Card.Title>
                    </Card.Header>
                    <Table
                        columns={columns}
                        data={pendingIQAC}
                        emptyMessage="No appraisals pending IQAC review"
                    />
                </Card>
            </div>
        </>
    );
}

function PrincipalDashboard() {
    const { getAllAppraisalsWithDetails } = useAppraisal();

    const allAppraisals = getAllAppraisalsWithDetails();
    const pendingApproval = allAppraisals.filter(a => a.status === 'IQAC_REVIEWED');
    const approved = allAppraisals.filter(a => a.status === 'APPROVED');

    const deptStats = {};
    allAppraisals.forEach(a => {
        const dept = a.teacher?.department || 'Unknown';
        if (!deptStats[dept]) deptStats[dept] = { count: 0, total: 0 };
        deptStats[dept].count++;
        deptStats[dept].total += a.grandTotal || 0;
    });

    const columns = [
        {
            key: 'teacher', label: 'Teacher', render: (_, row) => (
                <div>
                    <p className="font-medium text-slate-900">{row.teacher?.name}</p>
                    <p className="text-xs text-slate-500">{row.teacher?.department}</p>
                </div>
            )
        },
        { key: 'grandTotal', label: 'Score', render: (val) => `${val || 0}/250` },
        { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
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
                title="Principal Dashboard"
                subtitle="Final Approval & Overview"
            />

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <StatCard
                        title="Total Faculty"
                        value={allAppraisals.length}
                        icon={Users}
                        color="blue"
                    />
                    <StatCard
                        title="Pending Approval"
                        value={pendingApproval.length}
                        icon={Clock}
                        color="amber"
                    />
                    <StatCard
                        title="Approved"
                        value={approved.length}
                        icon={CheckCircle}
                        color="emerald"
                    />
                    <StatCard
                        title="Avg Score"
                        value={allAppraisals.length ? Math.round(allAppraisals.reduce((acc, a) => acc + (a.grandTotal || 0), 0) / allAppraisals.length) : 0}
                        subtitle="out of 250"
                        icon={TrendingUp}
                        color="purple"
                    />
                </div>

                <Card>
                    <Card.Header>
                        <Card.Title>Pending Final Approval</Card.Title>
                    </Card.Header>
                    <Table
                        columns={columns}
                        data={pendingApproval}
                        emptyMessage="No appraisals pending approval"
                    />
                </Card>
            </div>
        </>
    );
}

function AdminDashboard() {
    const { getAllAppraisalsWithDetails, appraisalCycles } = useAppraisal();

    const allAppraisals = getAllAppraisalsWithDetails();
    const currentCycle = appraisalCycles.find(c => c.isOpen);
    const teachers = users.filter(u => u.role === 'TEACHER');

    const statusCounts = {
        DRAFT: allAppraisals.filter(a => a.status === 'DRAFT').length,
        SUBMITTED: allAppraisals.filter(a => a.status === 'SUBMITTED').length,
        HOD_REVIEWED: allAppraisals.filter(a => a.status === 'HOD_REVIEWED').length,
        IQAC_REVIEWED: allAppraisals.filter(a => a.status === 'IQAC_REVIEWED').length,
        APPROVED: allAppraisals.filter(a => a.status === 'APPROVED').length,
    };

    return (
        <>
            <Header
                title="Admin Dashboard"
                subtitle="System Overview & Management"
            />

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <StatCard
                        title="Active Cycle"
                        value={currentCycle?.academicYear || 'None'}
                        icon={Calendar}
                        color="blue"
                    />
                    <StatCard
                        title="Total Teachers"
                        value={teachers.length}
                        icon={Users}
                        color="emerald"
                    />
                    <StatCard
                        title="Total Appraisals"
                        value={allAppraisals.length}
                        icon={FileText}
                        color="amber"
                    />
                    <StatCard
                        title="Completed"
                        value={statusCounts.APPROVED}
                        icon={CheckCircle}
                        color="purple"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Status Distribution */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Appraisal Status Distribution</Card.Title>
                        </Card.Header>
                        <div className="space-y-4">
                            {Object.entries(statusCounts).map(([status, count]) => (
                                <div key={status} className="flex items-center gap-4">
                                    <div className="w-32">
                                        <StatusBadge status={status} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 rounded-full bg-slate-200">
                                            <div
                                                className="h-2 rounded-full bg-emerald-500"
                                                style={{ width: `${allAppraisals.length ? (count / allAppraisals.length) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="w-8 text-right text-sm font-medium text-slate-600">{count}</span>
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
                                <div className="rounded-lg border border-slate-200 p-4 text-center transition-all hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer">
                                    <Calendar className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
                                    <p className="text-sm font-medium text-slate-900">Manage Cycles</p>
                                </div>
                            </Link>
                            <Link href="/admin/users">
                                <div className="rounded-lg border border-slate-200 p-4 text-center transition-all hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer">
                                    <Users className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                                    <p className="text-sm font-medium text-slate-900">Manage Users</p>
                                </div>
                            </Link>
                            <Link href="/admin/appraisals">
                                <div className="rounded-lg border border-slate-200 p-4 text-center transition-all hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer">
                                    <FileText className="mx-auto h-8 w-8 text-amber-600 mb-2" />
                                    <p className="text-sm font-medium text-slate-900">All Appraisals</p>
                                </div>
                            </Link>
                            <Link href="/reports">
                                <div className="rounded-lg border border-slate-200 p-4 text-center transition-all hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer">
                                    <TrendingUp className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                                    <p className="text-sm font-medium text-slate-900">Reports</p>
                                </div>
                            </Link>
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
