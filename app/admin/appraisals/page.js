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
} from 'lucide-react';
import Link from 'next/link';

const statusConfig = {
    DRAFT: { label: 'Draft', variant: 'secondary' },
    SUBMITTED: { label: 'Submitted', variant: 'warning' },
    HOD_REVIEWED: { label: 'HOD Reviewed', variant: 'info' },
    IQAC_REVIEWED: { label: 'IQAC Reviewed', variant: 'info' },
    PRINCIPAL_REVIEWED: { label: 'Completed', variant: 'success' },
};

export default function AdminAppraisalsPage() {
    const { getAllAppraisals } = useAppraisal();

    const allAppraisals = getAllAppraisals();
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
                a.teacherEmail?.toLowerCase().includes(query) ||
                a.department?.toLowerCase().includes(query)
            );
        }

        if (statusFilter) {
            list = list.filter(a => a.status === statusFilter);
        }

        if (departmentFilter) {
            list = list.filter(a => a.department === departmentFilter);
        }

        if (cycleFilter) {
            list = list.filter(a => a.cycleId === cycleFilter);
        }

        return list;
    }, [allAppraisals, searchQuery, statusFilter, departmentFilter, cycleFilter]);

    // Get unique values for filters
    const departments = [...new Set(allAppraisals.map(a => a.department).filter(Boolean))];
    const cycles = [...new Set(allAppraisals.map(a => a.cycleId).filter(Boolean))];

    // Stats
    const totalAppraisals = allAppraisals.length;
    const completedAppraisals = allAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED').length;
    const inProgressAppraisals = allAppraisals.filter(a =>
        ['SUBMITTED', 'HOD_REVIEWED', 'IQAC_REVIEWED'].includes(a.status)
    ).length;
    const draftAppraisals = allAppraisals.filter(a => a.status === 'DRAFT').length;

    // Calculate average scores
    const completedWithScores = allAppraisals.filter(a => a.finalScore && a.status === 'PRINCIPAL_REVIEWED');
    const averageScore = completedWithScores.length > 0
        ? Math.round(completedWithScores.reduce((sum, a) => sum + a.finalScore, 0) / completedWithScores.length)
        : 0;

    // Department-wise stats
    const departmentStats = useMemo(() => {
        const stats = {};
        allAppraisals.forEach(a => {
            if (!stats[a.department]) {
                stats[a.department] = { total: 0, completed: 0, avgScore: 0, scores: [] };
            }
            stats[a.department].total++;
            if (a.status === 'PRINCIPAL_REVIEWED') {
                stats[a.department].completed++;
                if (a.finalScore) {
                    stats[a.department].scores.push(a.finalScore);
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
                    <p className="font-medium text-slate-900">{row.teacherName}</p>
                    <p className="text-sm text-slate-500">{row.teacherEmail}</p>
                </div>
            ),
        },
        {
            key: 'department',
            label: 'Department',
        },
        {
            key: 'cycleName',
            label: 'Cycle',
            render: (value) => value || 'Current Cycle',
        },
        {
            key: 'selfScore',
            label: 'Self Score',
            render: (value) => (
                <span className="font-semibold text-slate-900">{value || 0}</span>
            ),
        },
        {
            key: 'finalScore',
            label: 'Final Score',
            render: (value) => (
                <span className={`font-semibold ${value ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {value || '—'}
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
        const headers = ['Teacher Name', 'Email', 'Department', 'Status', 'Self Score', 'Final Score'];
        const rows = filteredAppraisals.map(a => [
            a.teacherName,
            a.teacherEmail,
            a.department,
            statusConfig[a.status]?.label || a.status,
            a.selfScore || 0,
            a.finalScore || '',
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
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <StatCard
                        title="Total Appraisals"
                        value={totalAppraisals}
                        icon={FileText}
                    />
                    <StatCard
                        title="Completed"
                        value={completedAppraisals}
                        icon={CheckCircle}
                        color="emerald"
                    />
                    <StatCard
                        title="In Progress"
                        value={inProgressAppraisals}
                        icon={Clock}
                        color="amber"
                    />
                    <StatCard
                        title="Draft"
                        value={draftAppraisals}
                        icon={AlertTriangle}
                        color="purple"
                    />
                    <StatCard
                        title="Average Score"
                        value={averageScore}
                        icon={TrendingUp}
                        color="blue"
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
                                    { value: 'SUBMITTED', label: 'Submitted' },
                                    { value: 'HOD_REVIEWED', label: 'HOD Reviewed' },
                                    { value: 'IQAC_REVIEWED', label: 'IQAC Reviewed' },
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
