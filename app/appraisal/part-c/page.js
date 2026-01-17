'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Alert from '@/components/ui/Alert';
import Modal, { SuccessModal } from '@/components/ui/Modal';
import FileUpload from '@/components/ui/FileUpload';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  Save,
  ArrowLeft,
  CheckCircle,
  Award,
  Users,
  Building2,
  Plus,
  Trash2,
  Edit,
  AlertCircle,
  Upload,
  Paperclip,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { PART_C_CAPS, PART_C_TOTAL_MAX } from '@/lib/calculations';

// Compact Section Header Component
function SectionHeader({ title, icon: Icon, color, score, maxScore, count, docsCount }) {
  const colorClasses = {
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  };
  const classes = colorClasses[color] || colorClasses.emerald;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${classes.bg}`}>
          <Icon size={18} className={classes.text} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {count !== undefined && (
            <p className="text-xs text-slate-500">
              {count} entries
              {docsCount !== undefined && (
                <span className={docsCount === count ? ' • text-emerald-600' : ' • text-amber-500'}>
                  {' '}• {docsCount}/{count} docs
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        <span className={`text-xl font-bold ${classes.text}`}>{score}</span>
        <span className="text-sm text-slate-400">/{maxScore}</span>
      </div>
    </div>
  );
}

// Compact Committee Role Card
function CommitteeRoleCard({ role, onEdit, onDelete, disabled }) {
  const hasDocument = !!role.document;

  return (
    <div className="p-3 rounded-lg border border-slate-200 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 text-sm truncate">{role.committeeName}</h4>
          <p className="text-xs text-slate-500">{role.role} • {role.level}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
            {role.selfMarks} pts
          </span>
          {!disabled && (
            <>
              <button onClick={() => onEdit(role)} className="p-1 rounded hover:bg-slate-100">
                <Edit size={12} className="text-slate-400" />
              </button>
              <button onClick={() => onDelete(role.id)} className="p-1 rounded hover:bg-red-50">
                <Trash2 size={12} className="text-red-400" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
        <span>{role.fromDate ? new Date(role.fromDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}</span>
        <span>→</span>
        <span>{role.toDate ? new Date(role.toDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}</span>
        <span className="ml-auto">
          {hasDocument ? (
            <span className="flex items-center gap-1 text-emerald-600"><CheckCircle size={12} /> Doc</span>
          ) : (
            <span className="flex items-center gap-1 text-amber-500"><AlertCircle size={12} /> No doc</span>
          )}
        </span>
      </div>
    </div>
  );
}

// Compact Professional Body Card
function ProfessionalBodyCard({ body, onEdit, onDelete, disabled }) {
  const hasDocument = !!body.document;

  return (
    <div className="p-3 rounded-lg border border-slate-200 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 text-sm truncate">{body.bodyName}</h4>
          <p className="text-xs text-slate-500">{body.membershipType}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
            {body.selfMarks} pts
          </span>
          {!disabled && (
            <>
              <button onClick={() => onEdit(body)} className="p-1 rounded hover:bg-slate-100">
                <Edit size={12} className="text-slate-400" />
              </button>
              <button onClick={() => onDelete(body.id)} className="p-1 rounded hover:bg-red-50">
                <Trash2 size={12} className="text-red-400" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
        <span>{body.membershipNumber || 'No ID'}</span>
        <span>•</span>
        <span>{body.validFrom ? new Date(body.validFrom).getFullYear() : '—'} - {body.validTo ? new Date(body.validTo).getFullYear() : 'Present'}</span>
        <span className="ml-auto">
          {hasDocument ? (
            <span className="flex items-center gap-1 text-emerald-600"><CheckCircle size={12} /> Doc</span>
          ) : (
            <span className="flex items-center gap-1 text-amber-500"><AlertCircle size={12} /> No doc</span>
          )}
        </span>
      </div>
    </div>
  );
}

// Committee Role Form Modal - Simplified
function CommitteeRoleModal({ isOpen, onClose, onSave, role, isEditing }) {
  const [formData, setFormData] = useState({
    committeeName: '',
    role: '',
    level: '',
    fromDate: '',
    toDate: '',
    description: '',
    selfMarks: '',
    document: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (role) {
        setFormData({ ...role });
      } else {
        setFormData({
          committeeName: '',
          role: '',
          level: '',
          fromDate: '',
          toDate: '',
          description: '',
          selfMarks: '',
          document: null,
        });
      }
      setErrors({});
    }
  }, [isOpen, role]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.committeeName?.trim()) newErrors.committeeName = 'Required';
    if (!formData.role?.trim()) newErrors.role = 'Required';
    if (!formData.level) newErrors.level = 'Required';
    if (!formData.fromDate) newErrors.fromDate = 'Required';
    if (!formData.selfMarks || parseFloat(formData.selfMarks) < 0) newErrors.selfMarks = 'Required';
    if (parseFloat(formData.selfMarks) > PART_C_CAPS.committeeRoles.max) {
      newErrors.selfMarks = `Max ${PART_C_CAPS.committeeRoles.max}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const data = { ...formData, selfMarks: parseFloat(formData.selfMarks) };
      if (!isEditing) data.id = Date.now();
      onSave(data);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Committee Role' : 'Add Committee Role'}
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditing ? 'Save' : 'Add'}</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="Committee Name"
            value={formData.committeeName}
            onChange={(e) => setFormData({ ...formData, committeeName: e.target.value })}
            placeholder="e.g., Board of Studies"
            required
            error={errors.committeeName}
          />
          <Input
            label="Your Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g., Member, Coordinator"
            required
            error={errors.role}
          />
          <Select
            label="Level"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            required
            error={errors.level}
          >
            <option value="">Select Level</option>
            <option value="Department">Department</option>
            <option value="College">College</option>
            <option value="University">University</option>
            <option value="National">National</option>
          </Select>
          <Input
            label="Self Marks"
            type="number"
            min="0"
            max={PART_C_CAPS.committeeRoles.max}
            value={formData.selfMarks}
            onChange={(e) => setFormData({ ...formData, selfMarks: e.target.value })}
            placeholder={`Max: ${PART_C_CAPS.committeeRoles.max}`}
            required
            error={errors.selfMarks}
          />
          <Input
            label="From Date"
            type="date"
            value={formData.fromDate}
            onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
            required
            error={errors.fromDate}
          />
          <Input
            label="To Date (blank if ongoing)"
            type="date"
            value={formData.toDate}
            onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
          />
        </div>

        <Textarea
          label="Description (optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of responsibilities"
          rows={2}
        />

        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 mb-2">
            <Upload size={14} className="text-slate-500" />
            <label className="text-sm font-medium text-slate-700">
              Appointment Letter
            </label>
          </div>
          <FileUpload
            value={formData.document}
            onChange={(doc) => setFormData({ ...formData, document: doc })}
            helperText="Upload committee appointment letter"
            maxSize={5}
          />
        </div>
      </div>
    </Modal>
  );
}

// Professional Body Form Modal - Simplified
function ProfessionalBodyModal({ isOpen, onClose, onSave, body, isEditing }) {
  const [formData, setFormData] = useState({
    bodyName: '',
    membershipType: '',
    membershipNumber: '',
    validFrom: '',
    validTo: '',
    selfMarks: '',
    document: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (body) {
        setFormData({ ...body });
      } else {
        setFormData({
          bodyName: '',
          membershipType: '',
          membershipNumber: '',
          validFrom: '',
          validTo: '',
          selfMarks: '',
          document: null,
        });
      }
      setErrors({});
    }
  }, [isOpen, body]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bodyName?.trim()) newErrors.bodyName = 'Required';
    if (!formData.membershipType?.trim()) newErrors.membershipType = 'Required';
    if (!formData.selfMarks || parseFloat(formData.selfMarks) < 0) newErrors.selfMarks = 'Required';
    if (parseFloat(formData.selfMarks) > PART_C_CAPS.professionalBodies.max) {
      newErrors.selfMarks = `Max ${PART_C_CAPS.professionalBodies.max}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const data = { ...formData, selfMarks: parseFloat(formData.selfMarks) };
      if (!isEditing) data.id = Date.now();
      onSave(data);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Membership' : 'Add Membership'}
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditing ? 'Save' : 'Add'}</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="Professional Body"
            value={formData.bodyName}
            onChange={(e) => setFormData({ ...formData, bodyName: e.target.value })}
            placeholder="e.g., IEEE, ACM, CSI"
            required
            error={errors.bodyName}
          />
          <Select
            label="Membership Type"
            value={formData.membershipType}
            onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
            required
            error={errors.membershipType}
          >
            <option value="">Select Type</option>
            <option value="Student Member">Student Member</option>
            <option value="Member">Member</option>
            <option value="Professional Member">Professional Member</option>
            <option value="Senior Member">Senior Member</option>
            <option value="Fellow">Fellow</option>
            <option value="Life Member">Life Member</option>
          </Select>
          <Input
            label="Membership Number"
            value={formData.membershipNumber}
            onChange={(e) => setFormData({ ...formData, membershipNumber: e.target.value })}
            placeholder="e.g., SM-12345678"
          />
          <Input
            label="Self Marks"
            type="number"
            min="0"
            max={PART_C_CAPS.professionalBodies.max}
            value={formData.selfMarks}
            onChange={(e) => setFormData({ ...formData, selfMarks: e.target.value })}
            placeholder={`Max: ${PART_C_CAPS.professionalBodies.max}`}
            required
            error={errors.selfMarks}
          />
          <Input
            label="Valid From"
            type="date"
            value={formData.validFrom}
            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
          />
          <Input
            label="Valid To"
            type="date"
            value={formData.validTo}
            onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
          />
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 mb-2">
            <Upload size={14} className="text-slate-500" />
            <label className="text-sm font-medium text-slate-700">Membership Certificate</label>
          </div>
          <FileUpload
            value={formData.document}
            onChange={(doc) => setFormData({ ...formData, document: doc })}
            helperText="Upload membership certificate or ID"
            maxSize={5}
          />
        </div>
      </div>
    </Modal>
  );
}

export default function PartCPage() {
  const { user } = useAuth();
  const { getCurrentAppraisal, getFullAppraisalData, savePartCSection, recalculateTotals } = useAppraisal();

  const appraisal = user ? getCurrentAppraisal(user.id) : null;
  const fullData = appraisal ? getFullAppraisalData(appraisal.id) : null;
  const isReadOnly = appraisal?.status !== 'DRAFT';

  // State
  const [keyContribution, setKeyContribution] = useState({
    contribution: '',
    selfMarks: '',
    document: null,
  });
  const [committeeRoles, setCommitteeRoles] = useState([]);
  const [professionalBodies, setProfessionalBodies] = useState([]);
  const [studentFeedback, setStudentFeedback] = useState({
    averageScore: '',
    totalResponses: '',
    semester: '',
    courseName: '',
    selfMarks: '',
    feedbackReport: null,
  });

  // Modal states
  const [showCommitteeModal, setShowCommitteeModal] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState(null);
  const [showBodyModal, setShowBodyModal] = useState(false);
  const [editingBody, setEditingBody] = useState(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load data - only run once when appraisal data is available
  useEffect(() => {
    if (fullData?.partC && !dataLoaded) {
      if (fullData.partC.keyContribution) {
        setKeyContribution(fullData.partC.keyContribution);
      }
      if (fullData.partC.committeeRoles) {
        setCommitteeRoles(fullData.partC.committeeRoles);
      }
      if (fullData.partC.professionalBodies) {
        setProfessionalBodies(fullData.partC.professionalBodies);
      }
      if (fullData.partC.studentFeedback) {
        setStudentFeedback(fullData.partC.studentFeedback);
      }
      setDataLoaded(true);
    }
  }, [fullData, dataLoaded]);

  // Committee handlers
  const handleEditCommittee = (role) => {
    setEditingCommittee(role);
    setShowCommitteeModal(true);
  };

  const handleDeleteCommittee = (id) => {
    if (confirm('Delete this committee role?')) {
      setCommitteeRoles(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSaveCommittee = (role) => {
    if (editingCommittee) {
      setCommitteeRoles(prev => prev.map(r => r.id === editingCommittee.id ? role : r));
    } else {
      setCommitteeRoles(prev => [...prev, role]);
    }
    setEditingCommittee(null);
  };

  const handleCommitteeDocChange = (id, doc) => {
    setCommitteeRoles(prev => prev.map(r => r.id === id ? { ...r, document: doc } : r));
  };

  // Professional body handlers
  const handleEditBody = (body) => {
    setEditingBody(body);
    setShowBodyModal(true);
  };

  const handleDeleteBody = (id) => {
    if (confirm('Delete this membership?')) {
      setProfessionalBodies(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleSaveBody = (body) => {
    if (editingBody) {
      setProfessionalBodies(prev => prev.map(b => b.id === editingBody.id ? body : b));
    } else {
      setProfessionalBodies(prev => [...prev, body]);
    }
    setEditingBody(null);
  };

  const handleBodyDocChange = (id, doc) => {
    setProfessionalBodies(prev => prev.map(b => b.id === id ? { ...b, document: doc } : b));
  };

  // Save handler
  const handleSave = async () => {
    if (!appraisal) return;

    setSaving(true);
    try {
      savePartCSection(appraisal.id, 'keyContributions', keyContribution);
      savePartCSection(appraisal.id, 'committeeRoles', committeeRoles);
      savePartCSection(appraisal.id, 'professionalBodies', professionalBodies);
      savePartCSection(appraisal.id, 'studentFeedback', studentFeedback);
      recalculateTotals(appraisal.id);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  // Calculate scores
  const keyContributionScore = Math.min(parseFloat(keyContribution.selfMarks) || 0, PART_C_CAPS.keyContribution.max);
  const committeeScore = Math.min(
    committeeRoles.reduce((sum, r) => sum + (parseFloat(r.selfMarks) || 0), 0),
    PART_C_CAPS.committeeRoles.max
  );
  const bodyScore = Math.min(
    professionalBodies.reduce((sum, b) => sum + (parseFloat(b.selfMarks) || 0), 0),
    PART_C_CAPS.professionalBodies.max
  );
  const feedbackScore = Math.min(parseFloat(studentFeedback.selfMarks) || 0, PART_C_CAPS.studentFeedback.max);

  const totalScore = keyContributionScore + committeeScore + bodyScore + feedbackScore;
  const cappedTotal = Math.min(totalScore, PART_C_TOTAL_MAX);

  // Document counts
  const committeeDocsCount = committeeRoles.filter(r => r.document).length;
  const bodyDocsCount = professionalBodies.filter(b => b.document).length;
  const totalDocs = (keyContribution.document ? 1 : 0) + committeeDocsCount + bodyDocsCount + (studentFeedback.feedbackReport ? 1 : 0);
  const totalRequired = 1 + committeeRoles.length + professionalBodies.length + 1;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-5">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/appraisal" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-2">
              <ArrowLeft size={16} />
              Back to Overview
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Part C: Administrative Contribution</h1>
            <p className="text-slate-500 text-sm mt-0.5">Maximum 100 marks across all subsections</p>
          </div>

          <div className="flex items-center gap-3">
            {!isReadOnly && (
              <Button onClick={handleSave} loading={saving} size="sm" className="bg-amber-600 hover:bg-amber-700">
                <Save size={16} className="mr-1.5" />
                Save Part C
              </Button>
            )}
          </div>
        </div>

        {isReadOnly && (
          <Alert variant="info">
            This appraisal has been submitted and is now read-only.
          </Alert>
        )}

        {/* Score Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Total Score */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 rounded-xl bg-amber-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-amber-600">{cappedTotal}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">Total Score</span>
                  <span className="text-sm text-slate-400">{cappedTotal}/{PART_C_TOTAL_MAX}</span>
                </div>
                <ProgressBar value={cappedTotal} max={PART_C_TOTAL_MAX} showLabel={false} size="sm" />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-12 bg-slate-200" />

            {/* Score Breakdown */}
            <div className="flex items-center gap-4 text-xs">
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-600">{keyContributionScore}</p>
                <p className="text-slate-500">Key Contrib.</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">{committeeScore}</p>
                <p className="text-slate-500">Committees</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">{bodyScore}</p>
                <p className="text-slate-500">Memberships</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-600">{feedbackScore}</p>
                <p className="text-slate-500">Feedback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Section 1: Key Contributions */}
          <Card className="border border-slate-200">
            <SectionHeader
              title="Key Contributions"
              icon={Award}
              color="emerald"
              score={keyContributionScore}
              maxScore={PART_C_CAPS.keyContribution.max}
            />

            <Textarea
              value={keyContribution.contribution}
              onChange={(e) => setKeyContribution({ ...keyContribution, contribution: e.target.value })}
              placeholder="Describe your major contributions..."
              rows={3}
              disabled={isReadOnly}
            />

            <div className="grid grid-cols-2 gap-3 mt-3">
              <Input
                label="Self Marks"
                type="number"
                min="0"
                max={PART_C_CAPS.keyContribution.max}
                value={keyContribution.selfMarks}
                onChange={(e) => setKeyContribution({ ...keyContribution, selfMarks: e.target.value })}
                placeholder={`Max: ${PART_C_CAPS.keyContribution.max}`}
                disabled={isReadOnly}
              />
              <div className="pt-6">
                <FileUpload
                  value={keyContribution.document}
                  onChange={(doc) => setKeyContribution({ ...keyContribution, document: doc })}
                  disabled={isReadOnly}
                  helperText="Upload evidence"
                  maxSize={5}
                />
              </div>
            </div>
          </Card>

          {/* Section 4: Student Feedback */}
          <Card className="border border-slate-200">
            <SectionHeader
              title="Student Feedback"
              icon={MessageSquare}
              color="amber"
              score={feedbackScore}
              maxScore={PART_C_CAPS.studentFeedback.max}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Avg Score (out of 5)"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={studentFeedback.averageScore}
                onChange={(e) => setStudentFeedback({ ...studentFeedback, averageScore: e.target.value })}
                placeholder="e.g., 4.2"
                disabled={isReadOnly}
              />
              <Input
                label="Total Responses"
                type="number"
                min="0"
                value={studentFeedback.totalResponses}
                onChange={(e) => setStudentFeedback({ ...studentFeedback, totalResponses: e.target.value })}
                placeholder="e.g., 120"
                disabled={isReadOnly}
              />
              <Input
                label="Semester"
                value={studentFeedback.semester}
                onChange={(e) => setStudentFeedback({ ...studentFeedback, semester: e.target.value })}
                placeholder="e.g., Odd 2024-25"
                disabled={isReadOnly}
              />
              <Input
                label="Self Marks"
                type="number"
                min="0"
                max={PART_C_CAPS.studentFeedback.max}
                value={studentFeedback.selfMarks}
                onChange={(e) => setStudentFeedback({ ...studentFeedback, selfMarks: e.target.value })}
                placeholder={`Max: ${PART_C_CAPS.studentFeedback.max}`}
                disabled={isReadOnly}
              />
            </div>

            <div className="mt-3">
              <FileUpload
                value={studentFeedback.feedbackReport}
                onChange={(doc) => setStudentFeedback({ ...studentFeedback, feedbackReport: doc })}
                disabled={isReadOnly}
                helperText="Upload feedback report"
                maxSize={5}
              />
            </div>
          </Card>
        </div>

        {/* Section 2: Committee Roles */}
        <Card className="border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader
              title="Committee Roles"
              icon={Users}
              color="blue"
              score={committeeScore}
              maxScore={PART_C_CAPS.committeeRoles.max}
              count={committeeRoles.length}
              docsCount={committeeDocsCount}
            />
            {!isReadOnly && (
              <Button icon={Plus} size="sm" onClick={() => { setEditingCommittee(null); setShowCommitteeModal(true); }}>
                Add Role
              </Button>
            )}
          </div>

          {committeeRoles.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg">
              <Users size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">No committee roles added</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {committeeRoles.map(role => (
                <CommitteeRoleCard
                  key={role.id}
                  role={role}
                  onEdit={handleEditCommittee}
                  onDelete={handleDeleteCommittee}
                  disabled={isReadOnly}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Section 3: Professional Bodies */}
        <Card className="border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader
              title="Professional Memberships"
              icon={Building2}
              color="purple"
              score={bodyScore}
              maxScore={PART_C_CAPS.professionalBodies.max}
              count={professionalBodies.length}
              docsCount={bodyDocsCount}
            />
            {!isReadOnly && (
              <Button icon={Plus} size="sm" onClick={() => { setEditingBody(null); setShowBodyModal(true); }}>
                Add Membership
              </Button>
            )}
          </div>

          {professionalBodies.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg">
              <Building2 size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">No memberships added</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {professionalBodies.map(body => (
                <ProfessionalBodyCard
                  key={body.id}
                  body={body}
                  onEdit={handleEditBody}
                  onDelete={handleDeleteBody}
                  disabled={isReadOnly}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Modals */}
        <CommitteeRoleModal
          isOpen={showCommitteeModal}
          onClose={() => { setShowCommitteeModal(false); setEditingCommittee(null); }}
          onSave={handleSaveCommittee}
          role={editingCommittee}
          isEditing={!!editingCommittee}
        />

        <ProfessionalBodyModal
          isOpen={showBodyModal}
          onClose={() => { setShowBodyModal(false); setEditingBody(null); }}
          onSave={handleSaveBody}
          body={editingBody}
          isEditing={!!editingBody}
        />

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Part C Saved!"
          message="Your administrative contributions have been saved. Continue to Part D for Values & Ethics."
          buttonText="Continue"
          redirectUrl="/appraisal"
        />
      </div>
    </DashboardLayout>
  );
}
