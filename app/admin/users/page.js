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
    Users,
    UserCheck,
    UserX,
    Shield,
    FileText,
    Eye,
    Building2,
    CheckCircle,
    Clock,
} from 'lucide-react';
import Link from 'next/link';
import { users, departments } from '@/lib/data/mockData';

const roleConfig = {
    TEACHER: { label: 'Teacher', variant: 'info' },
    HOD: { label: 'HOD', variant: 'warning' },
    IQAC: { label: 'IQAC', variant: 'purple' },
    PRINCIPAL: { label: 'Principal', variant: 'danger' },
    ADMIN: { label: 'Admin', variant: 'secondary' },
};

const statusConfig = {
    DRAFT: { label: 'Draft', variant: 'secondary' },
    SUBMITTED: { label: 'With HOD', variant: 'warning' },
    HOD_REVIEWED: { label: 'With IQAC', variant: 'info' },
    IQAC_REVIEWED: { label: 'With Principal', variant: 'purple' },
    PRINCIPAL_REVIEWED: { label: 'Completed', variant: 'success' },
    NOT_STARTED: { label: 'Not Started', variant: 'secondary' },
};

export default function AdminUsersPage() {
    const { user: currentUser } = useAuth();
    const { getAllAppraisals } = useAppraisal();

    const allAppraisals = getAllAppraisals();

    const [userList, setUserList] = useState(users);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'TEACHER',
        department: '',
        designation: '',
        employeeId: '',
        isActive: true,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');

    const filteredUsers = useMemo(() => {
        let list = userList;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            list = list.filter(u =>
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query) ||
                u.employeeId?.toLowerCase().includes(query)
            );
        }

        if (roleFilter) {
            list = list.filter(u => u.role === roleFilter);
        }

        if (departmentFilter) {
            list = list.filter(u => u.department === departmentFilter);
        }

        return list;
    }, [userList, searchQuery, roleFilter, departmentFilter]);

    // Stats
    const totalUsers = userList.length;
    const activeUsers = userList.filter(u => u.isActive !== false).length;
    const teacherCount = userList.filter(u => u.role === 'TEACHER').length;
    const adminCount = userList.filter(u => ['HOD', 'IQAC', 'PRINCIPAL', 'ADMIN'].includes(u.role)).length;

    const handleAdd = () => {
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            role: 'TEACHER',
            department: '',
            designation: '',
            employeeId: '',
            isActive: true,
        });
        setShowModal(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department || '',
            designation: user.designation || '',
            employeeId: user.employeeId || '',
            isActive: user.isActive !== false,
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (editingUser) {
            setUserList(userList.map(u =>
                u.id === editingUser.id ? { ...u, ...formData } : u
            ));
        } else {
            setUserList([...userList, {
                ...formData,
                id: `user-${Date.now()}`,
                createdAt: new Date().toISOString(),
            }]);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUserList(userList.filter(u => u.id !== id));
        }
    };

    const handleToggleActive = (id) => {
        setUserList(userList.map(u =>
            u.id === id ? { ...u, isActive: !u.isActive } : u
        ));
    };

    // Get appraisal status for a user
    const getAppraisalStatus = (userId) => {
        const appraisal = allAppraisals.find(a => a.teacherId === userId);
        return appraisal?.status || 'NOT_STARTED';
    };

    const columns = [
        {
            key: 'name',
            label: 'User',
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {value?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">{value}</p>
                        <p className="text-sm text-slate-500">{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => {
                const config = roleConfig[value] || { label: value, variant: 'secondary' };
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            key: 'department',
            label: 'Department',
            render: (value) => value || '—',
        },
        {
            key: 'appraisalStatus',
            label: 'Appraisal',
            render: (_, row) => {
                if (row.role !== 'TEACHER') return <span className="text-slate-400 text-sm">N/A</span>;
                const status = getAppraisalStatus(row.id);
                const config = statusConfig[status] || { label: status, variant: 'secondary' };
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            key: 'isActive',
            label: 'Account',
            render: (value) => (
                <Badge variant={value !== false ? 'success' : 'danger'}>
                    {value !== false ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: '',
            render: (_, row) => (
                <div className="flex gap-1">
                    {row.role === 'TEACHER' && (
                        <Link href={`/review/${allAppraisals.find(a => a.teacherId === row.id)?.id || ''}`}>
                            <button
                                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
                                title="View Appraisal"
                                disabled={!allAppraisals.find(a => a.teacherId === row.id)}
                            >
                                <Eye size={16} />
                            </button>
                        </Link>
                    )}
                    <button
                        onClick={() => handleToggleActive(row.id)}
                        className={`p-2 rounded-lg ${row.isActive !== false
                            ? 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                            : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'
                            }`}
                        title={row.isActive !== false ? 'Deactivate' : 'Activate'}
                    >
                        {row.isActive !== false ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
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
                title="Manage Users"
                subtitle="Create and manage user accounts"
            />

            <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <StatCard
                        title="Total Users"
                        value={totalUsers}
                        icon={Users}
                        color="blue"
                    />
                    <StatCard
                        title="Active"
                        value={activeUsers}
                        icon={UserCheck}
                        color="emerald"
                    />
                    <StatCard
                        title="Teachers"
                        value={teacherCount}
                        icon={Users}
                        color="indigo"
                    />
                    <StatCard
                        title="HODs"
                        value={userList.filter(u => u.role === 'HOD').length}
                        icon={Building2}
                        color="amber"
                    />
                    <StatCard
                        title="Departments"
                        value={departments.length}
                        icon={Building2}
                        color="purple"
                    />
                    <StatCard
                        title="Admin Staff"
                        value={adminCount}
                        icon={Shield}
                        color="slate"
                    />
                </div>

                {/* Teacher Appraisal Summary */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <FileText size={20} />
                            Teacher Appraisal Summary
                        </Card.Title>
                    </Card.Header>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-slate-600">{teacherCount - allAppraisals.filter(a => a.status !== 'NOT_STARTED').length}</p>
                            <p className="text-sm text-slate-500">Not Started</p>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-amber-600">{allAppraisals.filter(a => a.status === 'DRAFT').length}</p>
                            <p className="text-sm text-slate-500">Draft</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-blue-600">{allAppraisals.filter(a => ['SUBMITTED', 'HOD_REVIEWED', 'IQAC_REVIEWED'].includes(a.status)).length}</p>
                            <p className="text-sm text-slate-500">In Review</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-emerald-600">{allAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED').length}</p>
                            <p className="text-sm text-slate-500">Completed</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-purple-600">{Math.round((allAppraisals.filter(a => a.status === 'PRINCIPAL_REVIEWED').length / teacherCount) * 100) || 0}%</p>
                            <p className="text-sm text-slate-500">Completion Rate</p>
                        </div>
                    </div>
                </Card>

                {/* Filters & Add Button */}
                <Card>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full md:max-w-md">
                            <Input
                                placeholder="Search by name, email, or employee ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={Search}
                            />
                        </div>
                        <div className="w-full md:w-40">
                            <Select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'All Roles' },
                                    { value: 'TEACHER', label: 'Teacher' },
                                    { value: 'HOD', label: 'HOD' },
                                    { value: 'IQAC', label: 'IQAC' },
                                    { value: 'PRINCIPAL', label: 'Principal' },
                                    { value: 'ADMIN', label: 'Admin' },
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
                        <Button icon={Plus} onClick={handleAdd}>
                            Add User
                        </Button>
                    </div>
                </Card>

                {/* Table */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center gap-2">
                            <Users size={20} />
                            Users ({filteredUsers.length})
                        </Card.Title>
                    </Card.Header>

                    {filteredUsers.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="No users found"
                            description="Try adjusting your filters or add a new user."
                            action={{
                                label: 'Add User',
                                onClick: handleAdd,
                            }}
                        />
                    ) : (
                        <Table columns={columns} data={filteredUsers} />
                    )}
                </Card>

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={editingUser ? 'Edit User' : 'Add New User'}
                    size="md"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button onClick={handleSave}>
                                {editingUser ? 'Save Changes' : 'Add User'}
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <Input
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter full name"
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter email address"
                            required
                        />
                        <Input
                            label="Employee ID"
                            value={formData.employeeId}
                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                            placeholder="e.g., EMP001"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                options={[
                                    { value: 'TEACHER', label: 'Teacher' },
                                    { value: 'HOD', label: 'HOD' },
                                    { value: 'IQAC', label: 'IQAC' },
                                    { value: 'PRINCIPAL', label: 'Principal' },
                                    { value: 'ADMIN', label: 'Admin' },
                                ]}
                            />
                            <Select
                                label="Department"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                options={[
                                    { value: '', label: 'Select Department' },
                                    ...departments.map(d => ({ value: d, label: d })),
                                ]}
                            />
                        </div>
                        <Input
                            label="Designation"
                            value={formData.designation}
                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            placeholder="e.g., Assistant Professor"
                        />
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                                Active User
                            </label>
                        </div>
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    );
}
