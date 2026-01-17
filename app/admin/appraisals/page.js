'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import StatCard from '@/components/ui/StatCard';
import ProgressBar from '@/components/ui/ProgressBar';
import {
    Search,
    Eye,
    Download,
    FileText,
    CheckCircle,
    Clock,
    AlertTriangle,
    BarChart3,
    TrendingUp,
    Users,
    ArrowRight,
    Building2,
} from 'lucide-react';
import Link from 'next/link';

const statusConfig = {
    DRAFT: { label: 'Draft', variant: 'secondary' },
    SUBMITTED: { label: 'With HOD', variant: 'warning' },
    HOD_REVIEWED: { label: 'With IQAC', variant: 'info' },
    IQAC_REVIEWED: { label: 'With Principal', variant: 'purple' },
    PRINCIPAL_REVIEWED: { label: 'Completed', variant: 'success' },
};

export default function AdminAppraisalsPage() {
    const { getAllAppraisalsWithDetails, appraisalCycles } = useAppraisal();

    const allAppraisals = getAllAppraisalsWithDetails();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [cycleFilter, setCycleFilter] = useState('');

    const filteredAppraisals = useMemo(() => {
        let list = allAppraisals;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            list = list.filter(a =>
                a.teacherName?.toLowerCase().includes(query) ||
                a.teacher?.name?.toLowerCase().includes(query) ||
                a.teacherEmail?.toLowerCase().includes(query) ||
                a.teacher?.email?.toLowerCase().includes(query) ||
                a.department?.toLowerCase().includes(query) ||
                a.teacher?.department?.toLowerCase().includes(query)
            );
        }

        if (statusFilter) {
            list = list.filter(a => a.status === statusFilter);
        }

        if (departmentFilter) {
            list = list.filter(a => (a.department || a.teacher?.department) === departmentFilter);
        }

        if (cycleFilter) {
            list = list.filter(a => a.cycleId === parseInt(cycleFilter));
        }

        return list;
    }, [allAppraisals, searchQuery, statusFilter, departmentFilter, cycleFilter]);

    // Get unique values for filters
    const departments = [...new Set(allAppraisals.map(a => a.department || a.teacher?.department).filter(Boolean))];

    // Workflow Stats
    const workflowStats = useMemo(() => ({
        draft: allAppraisals.filter(a => a.status === 'DRAFT').length,
        withHOD: allAppraisals.filter(a => a.status === 'SUBMITTED').length,
        withIQAC: allAppraisals.filter(a => a.status === 'HOD_REVIEWED').length,
        withPrincipal: allAppraisals.filter(a => a.status === 'IQAC_REVIEWED').length,
        completed: allAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED').length,
    }), [allAppraisals]);

    // Calculate average scores
    const completedWithScores = allAppraisals.filter(a => (a.finalScore || a.grandTotal) && a.status === 'PRINCIPAL_REVIEWED');
    const averageScore = completedWithScores.length > 0
        ? Math.round(completedWithScores.reduce((sum, a) => sum + (a.finalScore || a.grandTotal), 0) / completedWithScores.length)
        : 0;

    // Department-wise stats
    const departmentStats = useMemo(() => {
        const stats = {};
        allAppraisals.forEach(a => {
            const dept = a.department || a.teacher?.department || 'Unknown';
            if (!stats[dept]) {
                stats[dept] = { total: 0, completed: 0, avgScore: 0, scores: [] };
            }
            stats[dept].total++;
            if (a.status === 'PRINCIPAL_REVIEWED') {
                stats[dept].completed++;
                if (a.finalScore || a.grandTotal) {
                    stats[dept].scores.push(a.finalScore || a.grandTotal);
                }
            }
        });

        Object.keys(stats).forEach(dept => {
            if (stats[dept].scores.length > 0) {
                stats[dept].avgScore = Math.round(
                    stats[dept].scores.reduce((a, b) => a + b, 0) / stats[dept].scores.length
                );
            }
        });

        return stats;
    }, [allAppraisals]);

    const columns = [
        {
            key: 'teacher',
            label: 'Teacher',
            render: (_, row) => (
                <div>
                    <p className="font-medium text-slate-900">{row.teacher?.name || row.teacherName}</p>
                    <p className="text-sm text-slate-500">{row.teacher?.email || row.teacherEmail}</p>
                </div>
            ),
        },
        {
            key: 'department',
            label: 'Department',
            render: (val, row) => val || row.teacher?.department || '—',
        },
        {
            key: 'grandTotal',
            label: 'Self Score',
            render: (value, row) => (
                <span className="font-semibold text-slate-900">{value || row.selfScore || 0}/250</span>
            ),
        },
        {
            key: 'finalScore',
            label: 'Final Score',
            render: (value, row) => (
                <span className={`font-semibold ${value ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {value ? `${value}/250` : '—'}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const config = statusConfig[value] || { label: value, variant: 'secondary' };
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            key: 'workflow',
            label: 'Review Stage',
            render: (_, row) => {
                const stages = ['SUBMITTED', 'HOD_REVIEWED', 'IQAC_REVIEWED', 'PRINCIPAL_REVIEWED'];
                const currentIndex = stages.indexOf(row.status);
                if (row.status === 'DRAFT') return <span className="text-slate-400 text-sm">Not submitted</span>;
                return (
                    <div className="flex items-center gap-1">
                        {['H', 'I', 'P'].map((letter, i) => (
                            <div
                                key={letter}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${currentIndex > i ? 'bg-emerald-500 text-white' :
                                        currentIndex === i ? 'bg-amber-500 text-white' :
                                            'bg-slate-200 text-slate-500'
                                    }`}
                            >
                                {letter}
                            </div>
                        ))}
                    </div>
                );
            },
        },
        {
            key: 'actions',
            label: '',
            render: (_, row) => (
                <Link href={`/review/${row.id}`}>
                    <Button variant="secondary" size="sm" icon={Eye}>
                        View
                    </Button>
                </Link>
            ),
        },
    ];

    const handleExport = () => {
        // Create CSV content
        const headers = ['Teacher Name', 'Email', 'Department', 'Status', 'Self Score', 'Final Score', 'HOD Reviewed', 'IQAC Reviewed', 'Principal Approved'];
        const rows = filteredAppraisals.map(a => [
            a.teacher?.name || a.teacherName,
            a.teacher?.email || a.teacherEmail,
            a.department || a.teacher?.department,
            statusConfig[a.status]?.label || a.status,
            a.grandTotal || a.selfScore || 0,
            a.finalScore || '',
            a.hodReviewedAt || a.hodReview?.reviewedAt || '',
            a.iqacApprovedAt || a.iqacReview?.reviewedAt || '',
            a.principalApprovedAt || a.principalReview?.reviewedAt || '',
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.map(c => `"${c}"`).join(',')),
        ].join('\n');

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appraisals-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <DashboardLayout>
            <Header
                title="All Appraisals"
                subtitle="View and manage all teacher appraisals"
            />

            <div className="p-6 space-y-6">
                {/* Workflow Pipeline Stats */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <BarChart3 size={20} />
                            Workflow Pipeline
                        </Card.Title>
                    </Card.Header>
                    <div className="flex items-center justify-between gap-2">
                        {[
                            { label: 'Draft', count: workflowStats.draft, bgColor: 'bg-slate-100', textColor: 'text-slate-700' },
                            { label: 'With HOD', count: workflowStats.withHOD, bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
                            { label: 'With IQAC', count: workflowStats.withIQAC, bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
                            { label: 'With Principal', count: workflowStats.withPrincipal, bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
                            { label: 'Completed', count: workflowStats.completed, bgColor: 'bg-emerald-100', textColor: 'text-emerald-700' },
                        ].map((stage, i, arr) => (
                            <div key={stage.label} className="flex items-center flex-1">
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

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Appraisals"
                        value={allAppraisals.length}
                        icon={FileText}
                        color="blue"
                    />
                    <StatCard
                        title="Completion Rate"
                        value={`${allAppraisals.length ? Math.round((workflowStats.completed / allAppraisals.length) * 100) : 0}%`}
                        icon={CheckCircle}
                        color="emerald"
                    />
                    <StatCard
                        title="Pending Review"
                        value={workflowStats.withHOD + workflowStats.withIQAC + workflowStats.withPrincipal}
                        icon={Clock}
                        color="amber"
                    />
                    <StatCard
                        title="Average Score"
                        value={averageScore > 0 ? `${averageScore}/250` : 'N/A'}
                        icon={TrendingUp}
                        color="purple"
                    />
                </div>

                {/* Department Stats */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <BarChart3 size={20} />
                            Department Overview
                        </Card.Title>
                    </Card.Header>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(departmentStats).map(([dept, stats]) => (
                            <div key={dept} className="p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-slate-900">{dept}</h4>
                                    <span className="text-sm text-slate-500">
                                        {stats.completed}/{stats.total}
                                    </span>
                                </div>
                                <ProgressBar
                                    value={stats.completed}
                                    max={stats.total}
                                    showLabel={false}
                                    className="mb-2"
                                />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">
                                        {Math.round((stats.completed / stats.total) * 100)}% complete
                                    </span>
                                    {stats.avgScore > 0 && (
                                        <span className="font-medium text-emerald-600">
                                            Avg: {stats.avgScore}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Filters */}
                <Card>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full md:max-w-md">
                            <Input
                                placeholder="Search by teacher name, email, or department..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={Search}
                            />
                        </div>
                        <div className="w-full md:w-40">
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'All Statuses' },
                                    { value: 'DRAFT', label: 'Draft' },
                                    { value: 'SUBMITTED', label: 'With HOD' },
                                    { value: 'HOD_REVIEWED', label: 'With IQAC' },
                                    { value: 'IQAC_REVIEWED', label: 'With Principal' },
                                    { value: 'PRINCIPAL_REVIEWED', label: 'Completed' },
                                ]}
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <Select
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'All Departments' },
                                    ...departments.map(d => ({ value: d, label: d })),
                                ]}
                            />
                        </div>
                        <div className="w-full md:w-40">
                            <Select
                                value={cycleFilter}
                                onChange={(e) => setCycleFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'All Cycles' },
                                    ...appraisalCycles.map(c => ({ value: c.id.toString(), label: c.academicYear })),
                                ]}
                            />
                        </div>
                        <Button variant="secondary" icon={Download} onClick={handleExport}>
                            Export CSV
                        </Button>
                    </div>
                </Card>

                {/* Table */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <FileText size={20} />
                            Appraisals ({filteredAppraisals.length})
                        </Card.Title>
                    </Card.Header>

                    {filteredAppraisals.length === 0 ? (
                        <EmptyState
                            icon={FileText}
                            title="No appraisals found"
                            description="Try adjusting your filters."
                        />
                    ) : (
                        <Table columns={columns} data={filteredAppraisals} />
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
}
