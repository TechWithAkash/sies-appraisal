'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import StatCard from '@/components/ui/StatCard';
import ProgressBar from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import {
    BarChart3,
    TrendingUp,
    Users,
    FileText,
    Download,
    Filter,
    Award,
    CheckCircle,
    Clock,
    Building2,
} from 'lucide-react';
import { users, departments } from '@/lib/data/mockData';

export default function ReportsPage() {
    const { user } = useAuth();
    const { getAllAppraisals, appraisalCycles } = useAppraisal();

    const [selectedCycle, setSelectedCycle] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const allAppraisals = getAllAppraisals();
    const currentCycle = appraisalCycles.find(c => c.isOpen);

    // Filter based on user role
    const filteredAppraisals = useMemo(() => {
        let list = allAppraisals;

        // HOD can only see their department
        if (user?.role === 'HOD') {
            list = list.filter(a => a.department === user.department);
        }

        // Apply cycle filter
        if (selectedCycle) {
            list = list.filter(a => a.cycleId === parseInt(selectedCycle));
        }

        // Apply department filter (for IQAC, Principal, Admin)
        if (selectedDepartment && user?.role !== 'HOD') {
            list = list.filter(a => a.department === selectedDepartment);
        }

        return list;
    }, [allAppraisals, user, selectedCycle, selectedDepartment]);

    // Calculate stats
    const stats = useMemo(() => {
        const total = filteredAppraisals.length;
        const completed = filteredAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED').length;
        const inProgress = filteredAppraisals.filter(a =>
            ['SUBMITTED', 'HOD_REVIEWED', 'IQAC_REVIEWED'].includes(a.status)
        ).length;
        const draft = filteredAppraisals.filter(a => a.status === 'DRAFT').length;

        const completedWithScores = filteredAppraisals.filter(a =>
            a.status === 'PRINCIPAL_REVIEWED' && a.grandTotal
        );
        const avgScore = completedWithScores.length > 0
            ? Math.round(completedWithScores.reduce((sum, a) => sum + a.grandTotal, 0) / completedWithScores.length)
            : 0;

        return { total, completed, inProgress, draft, avgScore };
    }, [filteredAppraisals]);

    // Department-wise breakdown
    const departmentBreakdown = useMemo(() => {
        const breakdown = {};
        filteredAppraisals.forEach(a => {
            if (!breakdown[a.department]) {
                breakdown[a.department] = {
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    draft: 0,
                    scores: [],
                };
            }
            breakdown[a.department].total++;
            if (a.status === 'PRINCIPAL_REVIEWED') {
                breakdown[a.department].completed++;
                if (a.grandTotal) breakdown[a.department].scores.push(a.grandTotal);
            } else if (['SUBMITTED', 'HOD_REVIEWED', 'IQAC_REVIEWED'].includes(a.status)) {
                breakdown[a.department].inProgress++;
            } else {
                breakdown[a.department].draft++;
            }
        });

        return Object.entries(breakdown).map(([dept, data]) => ({
            department: dept,
            ...data,
            avgScore: data.scores.length > 0
                ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
                : 0,
            completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
        }));
    }, [filteredAppraisals]);

    // Score distribution
    const scoreDistribution = useMemo(() => {
        const ranges = [
            { label: '0-50', min: 0, max: 50, count: 0 },
            { label: '51-100', min: 51, max: 100, count: 0 },
            { label: '101-150', min: 101, max: 150, count: 0 },
            { label: '151-200', min: 151, max: 200, count: 0 },
            { label: '201-250', min: 201, max: 250, count: 0 },
        ];

        filteredAppraisals.forEach(a => {
            if (a.grandTotal) {
                const range = ranges.find(r => a.grandTotal >= r.min && a.grandTotal <= r.max);
                if (range) range.count++;
            }
        });

        return ranges;
    }, [filteredAppraisals]);

    const handleExportCSV = () => {
        const headers = ['Teacher', 'Department', 'Status', 'Part B', 'Part C', 'Part D', 'Total'];
        const rows = filteredAppraisals.map(a => [
            a.teacherName || 'N/A',
            a.department || 'N/A',
            a.status,
            a.totalPartB || 0,
            a.totalPartC || 0,
            a.totalPartD || 0,
            a.grandTotal || 0,
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appraisal-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const departmentColumns = [
        { key: 'department', label: 'Department' },
        { key: 'total', label: 'Total' },
        { key: 'completed', label: 'Completed' },
        { key: 'inProgress', label: 'In Progress' },
        { key: 'draft', label: 'Draft' },
        {
            key: 'completionRate',
            label: 'Completion Rate',
            render: (value) => (
                <div className="flex items-center gap-2">
                    <div className="w-20">
                        <ProgressBar value={value} max={100} showLabel={false} size="sm" />
                    </div>
                    <span className="text-sm font-medium">{value}%</span>
                </div>
            ),
        },
        {
            key: 'avgScore',
            label: 'Avg Score',
            render: (value) => <span className="font-medium text-emerald-600">{value}</span>,
        },
    ];

    return (
        <DashboardLayout>
            <Header
                title="Reports & Analytics"
                subtitle={user?.role === 'HOD' ? `${user.department} Department` : 'Institution Overview'}
            />

            <div className="p-6 space-y-6">
                {/* Filters */}
                <Card>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-600">Filters:</span>
                        </div>
                        <Select
                            value={selectedCycle}
                            onChange={(e) => setSelectedCycle(e.target.value)}
                            className="w-48"
                        >
                            <option value="">All Cycles</option>
                            {appraisalCycles.map(c => (
                                <option key={c.id} value={c.id}>{c.academicYear}</option>
                            ))}
                        </Select>
                        {user?.role !== 'HOD' && (
                            <Select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-48"
                            >
                                <option value="">All Departments</option>
                                {departments.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </Select>
                        )}
                        <div className="ml-auto">
                            <Button variant="secondary" icon={Download} onClick={handleExportCSV}>
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <StatCard
                        title="Total Appraisals"
                        value={stats.total}
                        icon={FileText}
                        color="blue"
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completed}
                        icon={CheckCircle}
                        color="emerald"
                    />
                    <StatCard
                        title="In Progress"
                        value={stats.inProgress}
                        icon={Clock}
                        color="amber"
                    />
                    <StatCard
                        title="Draft"
                        value={stats.draft}
                        icon={FileText}
                        color="purple"
                    />
                    <StatCard
                        title="Avg Score"
                        value={`${stats.avgScore}/250`}
                        icon={TrendingUp}
                        color="emerald"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Status Distribution */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center gap-2">
                                <BarChart3 size={20} />
                                Status Distribution
                            </Card.Title>
                        </Card.Header>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <StatusBadge status="DRAFT" />
                                <div className="flex-1">
                                    <ProgressBar
                                        value={stats.draft}
                                        max={stats.total || 1}
                                        showLabel={false}
                                        color="blue"
                                    />
                                </div>
                                <span className="w-12 text-right text-sm font-medium">{stats.draft}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <StatusBadge status="SUBMITTED" />
                                <div className="flex-1">
                                    <ProgressBar
                                        value={filteredAppraisals.filter(a => a.status === 'SUBMITTED').length}
                                        max={stats.total || 1}
                                        showLabel={false}
                                        color="amber"
                                    />
                                </div>
                                <span className="w-12 text-right text-sm font-medium">
                                    {filteredAppraisals.filter(a => a.status === 'SUBMITTED').length}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <StatusBadge status="HOD_REVIEWED" />
                                <div className="flex-1">
                                    <ProgressBar
                                        value={filteredAppraisals.filter(a => a.status === 'HOD_REVIEWED').length}
                                        max={stats.total || 1}
                                        showLabel={false}
                                        color="blue"
                                    />
                                </div>
                                <span className="w-12 text-right text-sm font-medium">
                                    {filteredAppraisals.filter(a => a.status === 'HOD_REVIEWED').length}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <StatusBadge status="PRINCIPAL_REVIEWED" />
                                <div className="flex-1">
                                    <ProgressBar
                                        value={stats.completed}
                                        max={stats.total || 1}
                                        showLabel={false}
                                        color="emerald"
                                    />
                                </div>
                                <span className="w-12 text-right text-sm font-medium">{stats.completed}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Score Distribution */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center gap-2">
                                <Award size={20} />
                                Score Distribution
                            </Card.Title>
                        </Card.Header>
                        <div className="space-y-4">
                            {scoreDistribution.map(range => (
                                <div key={range.label} className="flex items-center gap-4">
                                    <span className="w-20 text-sm font-medium text-slate-600">{range.label}</span>
                                    <div className="flex-1">
                                        <ProgressBar
                                            value={range.count}
                                            max={Math.max(...scoreDistribution.map(r => r.count), 1)}
                                            showLabel={false}
                                            color="emerald"
                                        />
                                    </div>
                                    <span className="w-12 text-right text-sm font-medium">{range.count}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Department Breakdown */}
                {user?.role !== 'HOD' && departmentBreakdown.length > 0 && (
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center gap-2">
                                <Building2 size={20} />
                                Department-wise Breakdown
                            </Card.Title>
                        </Card.Header>
                        <Table columns={departmentColumns} data={departmentBreakdown} />
                    </Card>
                )}

                {/* Top Performers */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <Award size={20} />
                            Top Performers
                        </Card.Title>
                    </Card.Header>
                    <div className="space-y-3">
                        {filteredAppraisals
                            .filter(a => a.status === 'PRINCIPAL_REVIEWED' && a.grandTotal)
                            .sort((a, b) => (b.grandTotal || 0) - (a.grandTotal || 0))
                            .slice(0, 5)
                            .map((a, index) => (
                                <div
                                    key={a.id}
                                    className={`flex items-center gap-4 p-3 rounded-lg ${index === 0 ? 'bg-amber-50 border border-amber-200' :
                                            index === 1 ? 'bg-slate-50 border border-slate-200' :
                                                index === 2 ? 'bg-orange-50 border border-orange-200' :
                                                    'bg-white border border-slate-100'
                                        }`}
                                >
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${index === 0 ? 'bg-amber-500 text-white' :
                                            index === 1 ? 'bg-slate-400 text-white' :
                                                index === 2 ? 'bg-orange-400 text-white' :
                                                    'bg-slate-200 text-slate-600'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900">{a.teacherName}</p>
                                        <p className="text-sm text-slate-500">{a.department}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-emerald-600">{a.grandTotal}</p>
                                        <p className="text-xs text-slate-500">/ 250</p>
                                    </div>
                                </div>
                            ))}
                        {filteredAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED' && a.grandTotal).length === 0 && (
                            <p className="text-center text-slate-500 py-4">No completed appraisals with scores yet.</p>
                        )}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
