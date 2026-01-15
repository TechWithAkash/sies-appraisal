'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatCard from '@/components/ui/StatCard';
import ProgressBar from '@/components/ui/ProgressBar';
import Table from '@/components/ui/Table';
import Select from '@/components/ui/Select';
import {
    Building2,
    Users,
    FileText,
    CheckCircle,
    Clock,
    TrendingUp,
    Eye,
    Filter,
} from 'lucide-react';
import { users, departments } from '@/lib/data/mockData';

export default function DepartmentsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { getAllAppraisals, appraisalCycles } = useAppraisal();

    const [selectedCycle, setSelectedCycle] = useState('');

    const allAppraisals = getAllAppraisals();
    const currentCycle = appraisalCycles.find(c => c.isOpen);
    const activeCycleId = selectedCycle ? parseInt(selectedCycle) : currentCycle?.id;

    // Calculate department-wise stats
    const departmentStats = useMemo(() => {
        return departments.map(dept => {
            const deptTeachers = users.filter(u => u.department === dept && u.role === 'TEACHER');
            const deptAppraisals = allAppraisals.filter(a =>
                a.department === dept &&
                (!activeCycleId || a.cycleId === activeCycleId)
            );

            const submitted = deptAppraisals.filter(a =>
                ['SUBMITTED', 'HOD_REVIEWED', 'IQAC_REVIEWED', 'PRINCIPAL_REVIEWED'].includes(a.status)
            ).length;
            const pendingReview = deptAppraisals.filter(a =>
                ['SUBMITTED', 'HOD_REVIEWED', 'IQAC_REVIEWED'].includes(a.status)
            ).length;
            const completed = deptAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED').length;

            const completedWithScores = deptAppraisals.filter(a =>
                a.status === 'PRINCIPAL_REVIEWED' && a.grandTotal
            );
            const avgScore = completedWithScores.length > 0
                ? Math.round(completedWithScores.reduce((sum, a) => sum + a.grandTotal, 0) / completedWithScores.length)
                : 0;

            // Find HOD
            const hod = users.find(u => u.department === dept && u.role === 'HOD');

            return {
                name: dept,
                hod: hod?.name || 'Not Assigned',
                totalTeachers: deptTeachers.length,
                submitted,
                pendingReview,
                completed,
                notStarted: deptTeachers.length - deptAppraisals.length,
                avgScore,
                submissionRate: deptTeachers.length > 0
                    ? Math.round((submitted / deptTeachers.length) * 100)
                    : 0,
                completionRate: deptTeachers.length > 0
                    ? Math.round((completed / deptTeachers.length) * 100)
                    : 0,
            };
        });
    }, [departments, allAppraisals, activeCycleId]);

    // Overall stats
    const overallStats = useMemo(() => {
        const totalTeachers = users.filter(u => u.role === 'TEACHER').length;
        const cycleAppraisals = allAppraisals.filter(a =>
            !activeCycleId || a.cycleId === activeCycleId
        );
        const totalSubmitted = cycleAppraisals.filter(a =>
            ['SUBMITTED', 'HOD_REVIEWED', 'IQAC_REVIEWED', 'PRINCIPAL_REVIEWED'].includes(a.status)
        ).length;
        const totalPending = cycleAppraisals.filter(a =>
            ['SUBMITTED', 'HOD_REVIEWED', 'IQAC_REVIEWED'].includes(a.status)
        ).length;
        const totalCompleted = cycleAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED').length;

        const completedWithScores = cycleAppraisals.filter(a =>
            a.status === 'PRINCIPAL_REVIEWED' && a.grandTotal
        );
        const avgScore = completedWithScores.length > 0
            ? Math.round(completedWithScores.reduce((sum, a) => sum + a.grandTotal, 0) / completedWithScores.length)
            : 0;

        return {
            totalDepartments: departments.length,
            totalTeachers,
            totalSubmitted,
            totalPending,
            totalCompleted,
            avgScore,
        };
    }, [allAppraisals, activeCycleId]);

    const columns = [
        {
            key: 'name',
            label: 'Department',
            render: (value) => (
                <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-slate-400" />
                    <span className="font-medium">{value}</span>
                </div>
            ),
        },
        { key: 'hod', label: 'HOD' },
        { key: 'totalTeachers', label: 'Teachers' },
        { key: 'submitted', label: 'Submitted' },
        { key: 'pendingReview', label: 'Pending' },
        { key: 'completed', label: 'Completed' },
        {
            key: 'submissionRate',
            label: 'Submission Rate',
            render: (value) => (
                <div className="flex items-center gap-2">
                    <div className="w-16">
                        <ProgressBar value={value} max={100} showLabel={false} size="sm" />
                    </div>
                    <span className="text-sm font-medium">{value}%</span>
                </div>
            ),
        },
        {
            key: 'avgScore',
            label: 'Avg Score',
            render: (value) => (
                <span className={`font-medium ${value > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {value > 0 ? value : '-'}
                </span>
            ),
        },
    ];

    // Only IQAC, Principal, Admin can access
    if (!['IQAC', 'PRINCIPAL', 'ADMIN'].includes(user?.role)) {
        return (
            <DashboardLayout>
                <div className="flex h-full items-center justify-center">
                    <Card className="max-w-md">
                        <div className="text-center">
                            <Building2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
                            <p className="text-slate-600">Only IQAC, Principal, and Admin can access this page.</p>
                        </div>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Header
                title="All Departments"
                subtitle={`Overview for ${currentCycle?.academicYear || 'Current Cycle'}`}
            />

            <div className="p-6 space-y-6">
                {/* Filter */}
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-600">Filter by Cycle:</span>
                        </div>
                        <Select
                            value={selectedCycle}
                            onChange={(e) => setSelectedCycle(e.target.value)}
                            className="w-48"
                        >
                            <option value="">Current Cycle</option>
                            {appraisalCycles.map(c => (
                                <option key={c.id} value={c.id}>{c.academicYear}</option>
                            ))}
                        </Select>
                    </div>
                </Card>

                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <StatCard
                        title="Departments"
                        value={overallStats.totalDepartments}
                        icon={Building2}
                        color="purple"
                    />
                    <StatCard
                        title="Total Teachers"
                        value={overallStats.totalTeachers}
                        icon={Users}
                        color="blue"
                    />
                    <StatCard
                        title="Submitted"
                        value={overallStats.totalSubmitted}
                        icon={FileText}
                        color="amber"
                    />
                    <StatCard
                        title="Pending Review"
                        value={overallStats.totalPending}
                        icon={Clock}
                        color="amber"
                    />
                    <StatCard
                        title="Completed"
                        value={overallStats.totalCompleted}
                        icon={CheckCircle}
                        color="emerald"
                    />
                    <StatCard
                        title="Avg Score"
                        value={overallStats.avgScore > 0 ? `${overallStats.avgScore}/250` : 'N/A'}
                        icon={TrendingUp}
                        color="emerald"
                    />
                </div>

                {/* Departments Table */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <Building2 size={20} />
                            Department-wise Status
                        </Card.Title>
                    </Card.Header>
                    <Table columns={columns} data={departmentStats} />
                </Card>

                {/* Department Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {departmentStats.map(dept => (
                        <Card key={dept.name} className="hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900">{dept.name}</h3>
                                    <p className="text-sm text-slate-500">HOD: {dept.hod}</p>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-medium ${dept.completionRate >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                        dept.completionRate >= 50 ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {dept.completionRate}% Complete
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-500">Submission Progress</span>
                                        <span className="font-medium">{dept.submitted}/{dept.totalTeachers}</span>
                                    </div>
                                    <ProgressBar
                                        value={dept.submissionRate}
                                        max={100}
                                        showLabel={false}
                                        size="sm"
                                        color="blue"
                                    />
                                </div>

                                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                                    <div className="p-2 bg-slate-50 rounded">
                                        <p className="font-semibold text-slate-900">{dept.totalTeachers}</p>
                                        <p className="text-xs text-slate-500">Total</p>
                                    </div>
                                    <div className="p-2 bg-amber-50 rounded">
                                        <p className="font-semibold text-amber-600">{dept.submitted}</p>
                                        <p className="text-xs text-slate-500">Submitted</p>
                                    </div>
                                    <div className="p-2 bg-emerald-50 rounded">
                                        <p className="font-semibold text-emerald-600">{dept.completed}</p>
                                        <p className="text-xs text-slate-500">Done</p>
                                    </div>
                                    <div className="p-2 bg-slate-50 rounded">
                                        <p className="font-semibold text-slate-600">{dept.avgScore || '-'}</p>
                                        <p className="text-xs text-slate-500">Avg</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
