'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
import {
    Search,
    Eye,
    CheckCircle,
    Clock,
    Filter,
    FileText,
    Users,
} from 'lucide-react';
import Link from 'next/link';

const statusConfig = {
    DRAFT: { label: 'Draft', variant: 'secondary' },
    SUBMITTED: { label: 'Submitted', variant: 'warning' },
    HOD_REVIEWED: { label: 'HOD Reviewed', variant: 'info' },
    IQAC_REVIEWED: { label: 'IQAC Reviewed', variant: 'info' },
    PRINCIPAL_REVIEWED: { label: 'Completed', variant: 'success' },
};

function ReviewListContent() {
    const { user } = useAuth();
    const { getAllAppraisals } = useAppraisal();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');

    // Initialize department filter from URL
    useEffect(() => {
        const deptFromUrl = searchParams.get('department');
        if (deptFromUrl) {
            setDepartmentFilter(deptFromUrl);
        }
    }, [searchParams]);

    // Get appraisals based on user role
    const filteredAppraisals = useMemo(() => {
        if (!user) return [];

        let list = getAllAppraisals();

        // Filter based on role
        if (user.role === 'HOD') {
            // HOD sees submitted appraisals from their department
            list = list.filter(a =>
                a.department === user.department &&
                a.status !== 'DRAFT'
            );
        } else if (user.role === 'IQAC') {
            // IQAC sees HOD reviewed appraisals
            list = list.filter(a =>
                ['HOD_REVIEWED', 'IQAC_REVIEWED', 'PRINCIPAL_REVIEWED'].includes(a.status)
            );
        } else if (user.role === 'PRINCIPAL') {
            // Principal sees IQAC reviewed appraisals
            list = list.filter(a =>
                ['IQAC_REVIEWED', 'PRINCIPAL_REVIEWED'].includes(a.status)
            );
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            list = list.filter(a =>
                a.teacherName?.toLowerCase().includes(query) ||
                a.teacherEmail?.toLowerCase().includes(query)
            );
        }

        // Apply status filter
        if (statusFilter) {
            list = list.filter(a => a.status === statusFilter);
        }

        // Apply department filter (for IQAC and Principal)
        if (departmentFilter) {
            list = list.filter(a => a.department === departmentFilter);
        }

        return list;
    }, [user, getAllAppraisals, searchQuery, statusFilter, departmentFilter]);

    // Get unique departments
    const departments = [...new Set(getAllAppraisals().map(a => a.department))];

    // Get available statuses based on role
    const getAvailableStatuses = () => {
        if (!user) return [];
        if (user.role === 'HOD') {
            return [
                { value: 'SUBMITTED', label: 'Pending Review' },
                { value: 'HOD_REVIEWED', label: 'Reviewed' },
            ];
        } else if (user.role === 'IQAC') {
            return [
                { value: 'HOD_REVIEWED', label: 'Pending Review' },
                { value: 'IQAC_REVIEWED', label: 'Reviewed' },
            ];
        } else if (user.role === 'PRINCIPAL') {
            return [
                { value: 'IQAC_REVIEWED', label: 'Pending Review' },
                { value: 'PRINCIPAL_REVIEWED', label: 'Approved' },
            ];
        }
        return [];
    };

    // Stats
    const pendingCount = filteredAppraisals.filter(a => {
        if (!user) return false;
        if (user.role === 'HOD') return a.status === 'SUBMITTED';
        if (user.role === 'IQAC') return a.status === 'HOD_REVIEWED';
        if (user.role === 'PRINCIPAL') return a.status === 'IQAC_REVIEWED';
        return false;
    }).length;

    const reviewedCount = filteredAppraisals.filter(a => {
        if (!user) return false;
        if (user.role === 'HOD') return a.status === 'HOD_REVIEWED';
        if (user.role === 'IQAC') return a.status === 'IQAC_REVIEWED';
        if (user.role === 'PRINCIPAL') return a.status === 'PRINCIPAL_REVIEWED';
        return false;
    }).length;

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
            key: 'cycle',
            label: 'Cycle',
            render: (_, row) => (
                <span className="text-sm text-slate-600">{row.cycleName || 'Current Cycle'}</span>
            ),
        },
        {
            key: 'selfScore',
            label: 'Self Score',
            render: (value, row) => (
                <span className="font-semibold text-slate-900">{value || row.grandTotal || 0}</span>
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
            render: (_, row) => {
                const isPending = user && (
                    (user.role === 'HOD' && row.status === 'SUBMITTED') ||
                    (user.role === 'IQAC' && row.status === 'HOD_REVIEWED') ||
                    (user.role === 'PRINCIPAL' && row.status === 'IQAC_REVIEWED')
                );

                return (
                    <Link href={`/review/${row.id}`}>
                        <Button
                            variant={isPending ? 'primary' : 'secondary'}
                            size="sm"
                            icon={isPending ? CheckCircle : Eye}
                        >
                            {isPending ? 'Review' : 'View'}
                        </Button>
                    </Link>
                );
            },
        },
    ];

    return (
        <DashboardLayout>
            <Header
                title="Review Appraisals"
                subtitle={`${user?.role || ''} Review Dashboard`}
            />

            <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <Clock size={24} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
                            <p className="text-sm text-slate-500">Pending Review</p>
                        </div>
                    </Card>
                    <Card className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <CheckCircle size={24} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{reviewedCount}</p>
                            <p className="text-sm text-slate-500">Reviewed</p>
                        </div>
                    </Card>
                    <Card className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Users size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{filteredAppraisals.length}</p>
                            <p className="text-sm text-slate-500">Total Appraisals</p>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by teacher name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={Search}
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'All Statuses' },
                                    ...getAvailableStatuses(),
                                ]}
                            />
                        </div>
                        {user && (user.role === 'IQAC' || user.role === 'PRINCIPAL') && (
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
                        )}
                    </div>
                </Card>

                {/* Table */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <FileText size={20} />
                            Appraisals for Review
                        </Card.Title>
                    </Card.Header>

                    {filteredAppraisals.length === 0 ? (
                        <EmptyState
                            icon={FileText}
                            title="No appraisals found"
                            description="There are no appraisals matching your filters."
                        />
                    ) : (
                        <Table columns={columns} data={filteredAppraisals} />
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
}

// Wrapper component with Suspense boundary
export default function ReviewListPage() {
    return (
        <Suspense fallback={
            <DashboardLayout>
                <Header title="Reviews" subtitle="Loading..." />
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-10 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-64 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </DashboardLayout>
        }>
            <ReviewListContent />
        </Suspense>
    );
}
