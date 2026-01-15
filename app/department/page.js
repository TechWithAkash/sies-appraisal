'use client';

import { useMemo } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import ProgressBar from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import {
    Users,
    FileText,
    CheckCircle,
    Clock,
    AlertTriangle,
    TrendingUp,
    Building2,
} from 'lucide-react';
import { users } from '@/lib/data/mockData';

export default function DepartmentPage() {
    const { user } = useAuth();
    const { getAllAppraisals, appraisalCycles } = useAppraisal();

    const allAppraisals = getAllAppraisals();
    const currentCycle = appraisalCycles.find(c => c.isOpen);

    // Get department teachers
    const departmentTeachers = useMemo(() => {
        if (!user?.department) return [];
        return users.filter(u => u.department === user.department && u.role === 'TEACHER');
    }, [user]);

    // Get department appraisals for current cycle
    const departmentAppraisals = useMemo(() => {
        if (!user?.department || !currentCycle) return [];
        return allAppraisals.filter(a =>
            a.department === user.department &&
            a.cycleId === currentCycle.id
        );
    }, [allAppraisals, user, currentCycle]);

    // Calculate stats
    const stats = useMemo(() => {
        const total = departmentTeachers.length;
        const submitted = departmentAppraisals.filter(a =>
            ['SUBMITTED', 'HOD_REVIEWED', 'IQAC_REVIEWED', 'PRINCIPAL_REVIEWED'].includes(a.status)
        ).length;
        const pendingReview = departmentAppraisals.filter(a => a.status === 'SUBMITTED').length;
        const completed = departmentAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED').length;
        const notStarted = total - departmentAppraisals.length;

        const completedWithScores = departmentAppraisals.filter(a =>
            a.status === 'PRINCIPAL_REVIEWED' && a.grandTotal
        );
        const avgScore = completedWithScores.length > 0
            ? Math.round(completedWithScores.reduce((sum, a) => sum + a.grandTotal, 0) / completedWithScores.length)
            : 0;

        return { total, submitted, pendingReview, completed, notStarted, avgScore };
    }, [departmentTeachers, departmentAppraisals]);

    // Teacher status table data
    const teacherStatusData = useMemo(() => {
        return departmentTeachers.map(teacher => {
            const appraisal = departmentAppraisals.find(a => a.teacherId === teacher.id);
            return {
                id: teacher.id,
                name: teacher.name,
                email: teacher.email,
                status: appraisal?.status || 'NOT_STARTED',
                partB: appraisal?.totalPartB || '-',
                partC: appraisal?.totalPartC || '-',
                partD: appraisal?.totalPartD || '-',
                total: appraisal?.grandTotal || '-',
                submittedAt: appraisal?.submittedAt ? new Date(appraisal.submittedAt).toLocaleDateString() : '-',
            };
        });
    }, [departmentTeachers, departmentAppraisals]);

    const columns = [
        { key: 'name', label: 'Teacher Name' },
        { key: 'email', label: 'Email' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                if (value === 'NOT_STARTED') {
                    return <span className="text-sm text-slate-400">Not Started</span>;
                }
                return <StatusBadge status={value} />;
            },
        },
        { key: 'partB', label: 'Part B' },
        { key: 'partC', label: 'Part C' },
        { key: 'partD', label: 'Part D' },
        { key: 'total', label: 'Total' },
        { key: 'submittedAt', label: 'Submitted' },
    ];

    // Only HOD can access this page
    if (user?.role !== 'HOD') {
        return (
            <DashboardLayout>
                <div className="flex h-full items-center justify-center">
                    <Card className="max-w-md">
                        <div className="text-center">
                            <Building2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
                            <p className="text-slate-600">Only HODs can access the department overview.</p>
                        </div>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Header
                title="Department Overview"
                subtitle={`${user?.department || 'Department'} - ${currentCycle?.academicYear || 'Current Cycle'}`}
            />

            <div className="p-6 space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <StatCard
                        title="Total Teachers"
                        value={stats.total}
                        icon={Users}
                        color="blue"
                    />
                    <StatCard
                        title="Submitted"
                        value={stats.submitted}
                        icon={FileText}
                        color="amber"
                    />
                    <StatCard
                        title="Pending Review"
                        value={stats.pendingReview}
                        icon={Clock}
                        color="amber"
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completed}
                        icon={CheckCircle}
                        color="emerald"
                    />
                    <StatCard
                        title="Not Started"
                        value={stats.notStarted}
                        icon={AlertTriangle}
                        color="red"
                    />
                    <StatCard
                        title="Avg Score"
                        value={stats.avgScore > 0 ? `${stats.avgScore}/250` : 'N/A'}
                        icon={TrendingUp}
                        color="emerald"
                    />
                </div>

                {/* Progress Card */}
                <Card>
                    <Card.Header>
                        <Card.Title>Department Progress</Card.Title>
                    </Card.Header>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600">Submission Rate</span>
                                <span className="text-sm font-medium text-slate-900">
                                    {stats.total > 0 ? Math.round((stats.submitted / stats.total) * 100) : 0}%
                                </span>
                            </div>
                            <ProgressBar
                                value={stats.submitted}
                                max={stats.total || 1}
                                showLabel={false}
                                color="blue"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600">Completion Rate</span>
                                <span className="text-sm font-medium text-slate-900">
                                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                                </span>
                            </div>
                            <ProgressBar
                                value={stats.completed}
                                max={stats.total || 1}
                                showLabel={false}
                                color="emerald"
                            />
                        </div>
                    </div>
                </Card>

                {/* Teacher Status Table */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <Users size={20} />
                            Teacher Appraisal Status
                        </Card.Title>
                    </Card.Header>
                    {teacherStatusData.length > 0 ? (
                        <Table columns={columns} data={teacherStatusData} />
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            No teachers found in your department.
                        </div>
                    )}
                </Card>

                {/* Quick Stats by Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <Card.Header>
                            <Card.Title>Status Breakdown</Card.Title>
                        </Card.Header>
                        <div className="space-y-3">
                            {[
                                { label: 'Not Started', count: stats.notStarted, color: 'bg-slate-200' },
                                { label: 'Draft', count: departmentAppraisals.filter(a => a.status === 'DRAFT').length, color: 'bg-slate-400' },
                                { label: 'Submitted', count: departmentAppraisals.filter(a => a.status === 'SUBMITTED').length, color: 'bg-amber-500' },
                                { label: 'HOD Reviewed', count: departmentAppraisals.filter(a => a.status === 'HOD_REVIEWED').length, color: 'bg-blue-500' },
                                { label: 'IQAC Reviewed', count: departmentAppraisals.filter(a => a.status === 'IQAC_REVIEWED').length, color: 'bg-purple-500' },
                                { label: 'Completed', count: stats.completed, color: 'bg-emerald-500' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                        <span className="text-sm text-slate-600">{item.label}</span>
                                    </div>
                                    <span className="font-medium text-slate-900">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <Card.Header>
                            <Card.Title>Score Distribution</Card.Title>
                        </Card.Header>
                        <div className="space-y-3">
                            {departmentAppraisals
                                .filter(a => a.status === 'PRINCIPAL_REVIEWED' && a.grandTotal)
                                .sort((a, b) => (b.grandTotal || 0) - (a.grandTotal || 0))
                                .slice(0, 5)
                                .map((a, index) => (
                                    <div key={a.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-500">#{index + 1}</span>
                                            <span className="text-sm text-slate-700">{a.teacherName}</span>
                                        </div>
                                        <span className="font-medium text-emerald-600">{a.grandTotal}</span>
                                    </div>
                                ))}
                            {departmentAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED' && a.grandTotal).length === 0 && (
                                <p className="text-sm text-slate-500 text-center py-4">
                                    No completed appraisals with scores yet.
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
