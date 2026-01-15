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
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import StatCard from '@/components/ui/StatCard';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Calendar,
    CheckCircle,
    Clock,
    PlayCircle,
    PauseCircle,
} from 'lucide-react';
import { cycles } from '@/lib/data/mockData';

const cycleStatusConfig = {
    UPCOMING: { label: 'Upcoming', variant: 'secondary', icon: Clock },
    ACTIVE: { label: 'Active', variant: 'success', icon: PlayCircle },
    COMPLETED: { label: 'Completed', variant: 'info', icon: CheckCircle },
    ARCHIVED: { label: 'Archived', variant: 'secondary', icon: PauseCircle },
};

export default function AdminCyclesPage() {
    const { user } = useAuth();
    const { getAllAppraisals } = useAppraisal();

    const [cycleList, setCycleList] = useState(cycles);
    const [showModal, setShowModal] = useState(false);
    const [editingCycle, setEditingCycle] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        academicYear: '',
        startDate: '',
        endDate: '',
        status: 'UPCOMING',
    });
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCycles = useMemo(() => {
        if (!searchQuery) return cycleList;
        const query = searchQuery.toLowerCase();
        return cycleList.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.academicYear.toLowerCase().includes(query)
        );
    }, [cycleList, searchQuery]);

    // Stats
    const activeCycles = cycleList.filter(c => c.status === 'ACTIVE').length;
    const upcomingCycles = cycleList.filter(c => c.status === 'UPCOMING').length;
    const completedCycles = cycleList.filter(c => c.status === 'COMPLETED').length;

    const handleAdd = () => {
        setEditingCycle(null);
        setFormData({
            name: '',
            academicYear: '',
            startDate: '',
            endDate: '',
            status: 'UPCOMING',
        });
        setShowModal(true);
    };

    const handleEdit = (cycle) => {
        setEditingCycle(cycle);
        setFormData({
            name: cycle.name,
            academicYear: cycle.academicYear,
            startDate: cycle.startDate,
            endDate: cycle.endDate,
            status: cycle.status,
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (editingCycle) {
            setCycleList(cycleList.map(c =>
                c.id === editingCycle.id ? { ...c, ...formData } : c
            ));
        } else {
            setCycleList([...cycleList, {
                ...formData,
                id: `cycle-${Date.now()}`,
                createdAt: new Date().toISOString(),
            }]);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this cycle?')) {
            setCycleList(cycleList.filter(c => c.id !== id));
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setCycleList(cycleList.map(c =>
            c.id === id ? { ...c, status: newStatus } : c
        ));
    };

    const columns = [
        {
            key: 'name',
            label: 'Cycle Name',
            render: (value, row) => (
                <div>
                    <p className="font-medium text-slate-900">{value}</p>
                    <p className="text-sm text-slate-500">{row.academicYear}</p>
                </div>
            ),
        },
        {
            key: 'startDate',
            label: 'Start Date',
            render: (value) => new Date(value).toLocaleDateString(),
        },
        {
            key: 'endDate',
            label: 'End Date',
            render: (value) => new Date(value).toLocaleDateString(),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                const config = cycleStatusConfig[value];
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            key: 'actions',
            label: '',
            render: (_, row) => (
                <div className="flex gap-2">
                    {row.status === 'UPCOMING' && (
                        <Button
                            size="sm"
                            variant="secondary"
                            icon={PlayCircle}
                            onClick={() => handleStatusChange(row.id, 'ACTIVE')}
                        >
                            Activate
                        </Button>
                    )}
                    {row.status === 'ACTIVE' && (
                        <Button
                            size="sm"
                            variant="secondary"
                            icon={CheckCircle}
                            onClick={() => handleStatusChange(row.id, 'COMPLETED')}
                        >
                            Complete
                        </Button>
                    )}
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <Header
                title="Manage Cycles"
                subtitle="Create and manage appraisal cycles"
            />

            <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Cycles"
                        value={cycleList.length}
                        icon={Calendar}
                    />
                    <StatCard
                        title="Active"
                        value={activeCycles}
                        icon={PlayCircle}
                        color="emerald"
                    />
                    <StatCard
                        title="Upcoming"
                        value={upcomingCycles}
                        icon={Clock}
                        color="amber"
                    />
                    <StatCard
                        title="Completed"
                        value={completedCycles}
                        icon={CheckCircle}
                        color="blue"
                    />
                </div>

                {/* Filters & Add Button */}
                <Card>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full md:max-w-md">
                            <Input
                                placeholder="Search cycles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={Search}
                            />
                        </div>
                        <Button icon={Plus} onClick={handleAdd}>
                            Create New Cycle
                        </Button>
                    </div>
                </Card>

                {/* Table */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <Calendar size={20} />
                            Appraisal Cycles
                        </Card.Title>
                    </Card.Header>

                    {filteredCycles.length === 0 ? (
                        <EmptyState
                            icon={Calendar}
                            title="No cycles found"
                            description="Create a new appraisal cycle to get started."
                            action={{
                                label: 'Create Cycle',
                                onClick: handleAdd,
                            }}
                        />
                    ) : (
                        <Table columns={columns} data={filteredCycles} />
                    )}
                </Card>

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={editingCycle ? 'Edit Cycle' : 'Create New Cycle'}
                    size="md"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button onClick={handleSave}>
                                {editingCycle ? 'Save Changes' : 'Create Cycle'}
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <Input
                            label="Cycle Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Annual Appraisal 2024-25"
                            required
                        />
                        <Input
                            label="Academic Year"
                            value={formData.academicYear}
                            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                            placeholder="e.g., 2024-2025"
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Start Date"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                            <Input
                                label="End Date"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required
                            />
                        </div>
                        <Select
                            label="Status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { value: 'UPCOMING', label: 'Upcoming' },
                                { value: 'ACTIVE', label: 'Active' },
                                { value: 'COMPLETED', label: 'Completed' },
                                { value: 'ARCHIVED', label: 'Archived' },
                            ]}
                        />
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    );
}
