'use client';

import { useState, useMemo } from 'react';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import ProgressBar from '@/components/ui/ProgressBar';
import {
    Download,
    BarChart3,
    PieChart,
    TrendingUp,
    Users,
    Award,
    FileText,
} from 'lucide-react';

export default function AdminReportsPage() {
    const { getAllAppraisals } = useAppraisal();
    const allAppraisals = getAllAppraisals();

    const [selectedCycle, setSelectedCycle] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    // Filter appraisals
    const filteredAppraisals = useMemo(() => {
        let list = allAppraisals;
        if (selectedCycle) list = list.filter(a => a.cycleId === selectedCycle);
        if (selectedDepartment) list = list.filter(a => a.department === selectedDepartment);
        return list;
    }, [allAppraisals, selectedCycle, selectedDepartment]);

    // Get unique values
    const departments = [...new Set(allAppraisals.map(a => a.department).filter(Boolean))];
    const cycles = [...new Set(allAppraisals.map(a => a.cycleId).filter(Boolean))];

    // Calculate statistics
    const stats = useMemo(() => {
        const completed = filteredAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED');
        const scores = completed.filter(a => a.finalScore).map(a => a.finalScore);

        return {
            total: filteredAppraisals.length,
            completed: completed.length,
            pending: filteredAppraisals.length - completed.length,
            avgScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
            maxScore: scores.length > 0 ? Math.max(...scores) : 0,
            minScore: scores.length > 0 ? Math.min(...scores) : 0,
        };
    }, [filteredAppraisals]);

    // Status distribution
    const statusDistribution = useMemo(() => {
        const dist = {
            DRAFT: 0,
            SUBMITTED: 0,
            HOD_REVIEWED: 0,
            IQAC_REVIEWED: 0,
            PRINCIPAL_REVIEWED: 0,
        };
        filteredAppraisals.forEach(a => {
            if (dist[a.status] !== undefined) dist[a.status]++;
        });
        return dist;
    }, [filteredAppraisals]);

    // Score distribution
    const scoreDistribution = useMemo(() => {
        const ranges = [
            { label: '0-50', min: 0, max: 50, count: 0, color: 'bg-red-500' },
            { label: '51-100', min: 51, max: 100, count: 0, color: 'bg-orange-500' },
            { label: '101-150', min: 101, max: 150, count: 0, color: 'bg-amber-500' },
            { label: '151-200', min: 151, max: 200, count: 0, color: 'bg-yellow-500' },
            { label: '201-250', min: 201, max: 250, count: 0, color: 'bg-lime-500' },
            { label: '251-300', min: 251, max: 300, count: 0, color: 'bg-green-500' },
            { label: '301-330', min: 301, max: 330, count: 0, color: 'bg-emerald-500' },
        ];

        filteredAppraisals
            .filter(a => a.finalScore)
            .forEach(a => {
                const range = ranges.find(r => a.finalScore >= r.min && a.finalScore <= r.max);
                if (range) range.count++;
            });

        return ranges;
    }, [filteredAppraisals]);

    // Department comparison
    const departmentComparison = useMemo(() => {
        const deptStats = {};
        filteredAppraisals.forEach(a => {
            if (!deptStats[a.department]) {
                deptStats[a.department] = { total: 0, completed: 0, scores: [] };
            }
            deptStats[a.department].total++;
            if (a.status === 'PRINCIPAL_REVIEWED') {
                deptStats[a.department].completed++;
                if (a.finalScore) deptStats[a.department].scores.push(a.finalScore);
            }
        });

        return Object.entries(deptStats).map(([dept, data]) => ({
            department: dept,
            total: data.total,
            completed: data.completed,
            completionRate: Math.round((data.completed / data.total) * 100),
            avgScore: data.scores.length > 0
                ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
                : 0,
        })).sort((a, b) => b.avgScore - a.avgScore);
    }, [filteredAppraisals]);

    // Top performers
    const topPerformers = useMemo(() => {
        return filteredAppraisals
            .filter(a => a.finalScore && a.status === 'PRINCIPAL_REVIEWED')
            .sort((a, b) => b.finalScore - a.finalScore)
            .slice(0, 10);
    }, [filteredAppraisals]);

    const handleExportReport = () => {
        const reportData = {
            generatedAt: new Date().toISOString(),
            filters: { cycle: selectedCycle || 'All', department: selectedDepartment || 'All' },
            summary: stats,
            statusDistribution,
            scoreDistribution: scoreDistribution.map(s => ({ range: s.label, count: s.count })),
            departmentComparison,
            topPerformers: topPerformers.map(p => ({
                name: p.teacherName,
                department: p.department,
                score: p.finalScore,
            })),
        };

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appraisal-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <DashboardLayout>
            <Header
                title="Reports & Analytics"
                subtitle="Comprehensive appraisal analytics and insights"
            />

            <div className="p-6 space-y-6">
                {/* Filters */}
                <Card>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="w-full md:w-48">
                                <Select
                                    label="Cycle"
                                    value={selectedCycle}
                                    onChange={(e) => setSelectedCycle(e.target.value)}
                                    options={[
                                        { value: '', label: 'All Cycles' },
                                        ...cycles.map(c => ({ value: c, label: c })),
                                    ]}
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Select
                                    label="Department"
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    options={[
                                        { value: '', label: 'All Departments' },
                                        ...departments.map(d => ({ value: d, label: d })),
                                    ]}
                                />
                            </div>
                        </div>
                        <Button icon={Download} onClick={handleExportReport}>
                            Export Report
                        </Button>
                    </div>
                </Card>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card className="text-center">
                        <FileText className="mx-auto mb-2 text-slate-400" size={24} />
                        <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                        <p className="text-sm text-slate-500">Total</p>
                    </Card>
                    <Card className="text-center">
                        <Users className="mx-auto mb-2 text-emerald-500" size={24} />
                        <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
                        <p className="text-sm text-slate-500">Completed</p>
                    </Card>
                    <Card className="text-center">
                        <TrendingUp className="mx-auto mb-2 text-blue-500" size={24} />
                        <p className="text-2xl font-bold text-blue-600">{stats.avgScore}</p>
                        <p className="text-sm text-slate-500">Avg Score</p>
                    </Card>
                    <Card className="text-center">
                        <Award className="mx-auto mb-2 text-amber-500" size={24} />
                        <p className="text-2xl font-bold text-amber-600">{stats.maxScore}</p>
                        <p className="text-sm text-slate-500">Highest</p>
                    </Card>
                    <Card className="text-center">
                        <BarChart3 className="mx-auto mb-2 text-purple-500" size={24} />
                        <p className="text-2xl font-bold text-purple-600">{stats.minScore}</p>
                        <p className="text-sm text-slate-500">Lowest</p>
                    </Card>
                    <Card className="text-center">
                        <PieChart className="mx-auto mb-2 text-teal-500" size={24} />
                        <p className="text-2xl font-bold text-teal-600">
                            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                        </p>
                        <p className="text-sm text-slate-500">Completion</p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Status Distribution */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Status Distribution</Card.Title>
                        </Card.Header>
                        <div className="space-y-3">
                            {Object.entries(statusDistribution).map(([status, count]) => {
                                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                                const colors = {
                                    DRAFT: 'bg-slate-400',
                                    SUBMITTED: 'bg-amber-500',
                                    HOD_REVIEWED: 'bg-blue-500',
                                    IQAC_REVIEWED: 'bg-indigo-500',
                                    PRINCIPAL_REVIEWED: 'bg-emerald-500',
                                };
                                const labels = {
                                    DRAFT: 'Draft',
                                    SUBMITTED: 'Submitted',
                                    HOD_REVIEWED: 'HOD Reviewed',
                                    IQAC_REVIEWED: 'IQAC Reviewed',
                                    PRINCIPAL_REVIEWED: 'Completed',
                                };

                                return (
                                    <div key={status}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-700">{labels[status]}</span>
                                            <span className="text-sm text-slate-500">{count} ({Math.round(percentage)}%)</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${colors[status]} rounded-full transition-all`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Score Distribution */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Score Distribution</Card.Title>
                        </Card.Header>
                        <div className="space-y-3">
                            {scoreDistribution.map((range) => {
                                const maxCount = Math.max(...scoreDistribution.map(r => r.count));
                                const percentage = maxCount > 0 ? (range.count / maxCount) * 100 : 0;

                                return (
                                    <div key={range.label}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-700">{range.label} marks</span>
                                            <span className="text-sm text-slate-500">{range.count} teachers</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${range.color} rounded-full transition-all`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Department Comparison */}
                <Card>
                    <Card.Header>
                        <Card.Title>Department Comparison</Card.Title>
                    </Card.Header>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Department</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Total</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Completed</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Completion Rate</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Avg Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departmentComparison.map((dept, i) => (
                                    <tr key={dept.department} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                {i === 0 && <Award className="text-amber-500" size={16} />}
                                                <span className="font-medium text-slate-900">{dept.department}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center text-slate-600">{dept.total}</td>
                                        <td className="py-3 px-4 text-center text-slate-600">{dept.completed}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <ProgressBar value={dept.completionRate} max={100} showLabel={false} className="flex-1" />
                                                <span className="text-sm text-slate-600 w-12">{dept.completionRate}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`font-semibold ${dept.avgScore >= 200 ? 'text-emerald-600' : 'text-slate-600'}`}>
                                                {dept.avgScore || '—'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Top Performers */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <Award className="text-amber-500" size={20} />
                            Top Performers
                        </Card.Title>
                    </Card.Header>
                    {topPerformers.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No completed appraisals with scores yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {topPerformers.map((performer, i) => (
                                <div
                                    key={performer.id}
                                    className={`flex items-center gap-4 p-4 rounded-lg ${i === 0 ? 'bg-linear-to-r from-amber-50 to-yellow-50 border border-amber-200' :
                                            i === 1 ? 'bg-linear-to-r from-slate-50 to-gray-50 border border-slate-200' :
                                                i === 2 ? 'bg-linear-to-r from-orange-50 to-amber-50 border border-orange-200' :
                                                    'bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-amber-500 text-white' :
                                            i === 1 ? 'bg-slate-400 text-white' :
                                                i === 2 ? 'bg-orange-400 text-white' :
                                                    'bg-slate-200 text-slate-600'
                                        }`}>
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900">{performer.teacherName}</p>
                                        <p className="text-sm text-slate-500">{performer.department}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-emerald-600">{performer.finalScore}</p>
                                        <p className="text-xs text-slate-500">marks</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
}
