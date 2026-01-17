'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Alert from '@/components/ui/Alert';
import Modal, { SuccessModal } from '@/components/ui/Modal';
import FileUpload, { FileAttachment } from '@/components/ui/FileUpload';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  Save,
  ArrowLeft,
  CheckCircle,
  Award,
  Users,
  Building2,
  Star,
  Plus,
  Trash2,
  Edit,
  AlertCircle,
  Upload,
  Paperclip,
  Eye,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { PART_C_CAPS, PART_C_TOTAL_MAX, calculatePartC } from '@/lib/calculations';

// Sample data for prototype
const sampleKeyContributions = {
  contribution: 'Led the development of new curriculum for AI/ML specialization track. Organized 3 national-level technical symposiums. Established industry partnership with 2 leading tech companies for student internships and placements.',
  selfMarks: 20,
  document: null,
};

const sampleCommitteeRoles = [
  {
    id: 1,
    committeeName: 'Board of Studies',
    role: 'Member',
    level: 'Department',
    fromDate: '2024-04-01',
    toDate: '2025-03-31',
    description: 'Contributing to curriculum development and syllabus revision',
    selfMarks: 8,
    document: null,
  },
  {
    id: 2,
    committeeName: 'Examination Committee',
    role: 'Coordinator',
    level: 'College',
    fromDate: '2024-06-01',
    toDate: '',
    description: 'Managing examination schedules and paper evaluation process',
    selfMarks: 6,
    document: null,
  },
];

const sampleProfessionalBodies = [
  {
    id: 1,
    bodyName: 'IEEE',
    membershipType: 'Senior Member',
    membershipNumber: 'SM-12345678',
    validFrom: '2020-01-01',
    validTo: '2026-12-31',
    selfMarks: 10,
    document: null,
  },
  {
    id: 2,
    bodyName: 'ACM',
    membershipType: 'Professional Member',
    membershipNumber: 'ACM-9876543',
    validFrom: '2022-01-01',
    validTo: '2025-12-31',
    selfMarks: 8,
    document: null,
  },
];

const sampleStudentFeedback = {
  averageScore: '4.2',
  totalResponses: '120',
  semester: 'Odd Semester 2024-25',
  courseName: 'Machine Learning',
  selfMarks: 20,
  feedbackReport: null,
};

// Section Card Component
function SectionCard({ title, description, icon: Icon, color, children, score, maxScore, docCount, totalCount }) {
  const colorClasses = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  };
  const classes = colorClasses[color] || colorClasses.emerald;

  return (
    <Card className={`border-2 ${classes.border}`}>
      <div className={`flex items-start justify-between p-4 -mx-6 -mt-6 mb-4 rounded-t-xl ${classes.bg}`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${classes.badge}`}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold ${classes.text}`}>{score}</span>
            <span className="text-lg text-slate-400">/ {maxScore}</span>
          </div>
          {totalCount > 0 && (
            <p className={`text-xs mt-1 ${docCount === totalCount ? 'text-emerald-600' : 'text-amber-600'}`}>
              <Paperclip size={12} className="inline mr-1" />
              {docCount}/{totalCount} docs
            </p>
          )}
        </div>
      </div>
      {children}
    </Card>
  );
}

// Committee Role Card
function CommitteeRoleCard({ role, onEdit, onDelete, onDocumentChange, disabled }) {
  const hasDocument = !!role.document;

  return (
    <div className={`p-4 rounded-xl border-2 ${hasDocument ? 'border-emerald-200 bg-emerald-50/30' : 'border-amber-200 bg-amber-50/30'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-900">{role.committeeName}</h4>
          <p className="text-sm text-slate-500">{role.role} • {role.level} Level</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {role.selfMarks} pts
          </span>
          {!disabled && (
            <div className="flex items-center gap-1">
              <button onClick={() => onEdit(role)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <Edit size={14} className="text-slate-500" />
              </button>
              <button onClick={() => onDelete(role.id)} className="p-1.5 rounded-lg hover:bg-red-100">
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-slate-500">From:</span>{' '}
          <span className="font-medium">{role.fromDate ? new Date(role.fromDate).toLocaleDateString() : '—'}</span>
        </div>
        <div>
          <span className="text-slate-500">To:</span>{' '}
          <span className="font-medium">{role.toDate ? new Date(role.toDate).toLocaleDateString() : 'Present'}</span>
        </div>
      </div>

      {role.description && (
        <p className="text-sm text-slate-600 mb-3">{role.description}</p>
      )}

      {/* Document Section */}
      <div className={`p-3 rounded-lg border ${hasDocument ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Paperclip size={14} className={hasDocument ? 'text-emerald-600' : 'text-amber-600'} />
          <span className="text-xs font-medium text-slate-700">
            Appointment/Nomination Letter <span className="text-red-500">*</span>
          </span>
        </div>

        {role.document ? (
          <FileAttachment
            file={role.document}
            onRemove={!disabled ? () => onDocumentChange(role.id, null) : undefined}
            disabled={disabled}
          />
        ) : (
          <FileUpload
            value={null}
            onChange={(doc) => onDocumentChange(role.id, doc)}
            required
            disabled={disabled}
            helperText="Upload committee appointment letter"
            maxSize={5}
          />
        )}
      </div>
    </div>
  );
}

// Professional Body Card
function ProfessionalBodyCard({ body, onEdit, onDelete, onDocumentChange, disabled }) {
  const hasDocument = !!body.document;

  return (
    <div className={`p-4 rounded-xl border-2 ${hasDocument ? 'border-emerald-200 bg-emerald-50/30' : 'border-amber-200 bg-amber-50/30'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-900">{body.bodyName}</h4>
          <p className="text-sm text-slate-500">{body.membershipType}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {body.selfMarks} pts
          </span>
          {!disabled && (
            <div className="flex items-center gap-1">
              <button onClick={() => onEdit(body)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <Edit size={14} className="text-slate-500" />
              </button>
              <button onClick={() => onDelete(body.id)} className="p-1.5 rounded-lg hover:bg-red-100">
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-slate-500">Member ID:</span>{' '}
          <span className="font-medium">{body.membershipNumber || '—'}</span>
        </div>
        <div>
          <span className="text-slate-500">Valid:</span>{' '}
          <span className="font-medium">
            {body.validFrom ? new Date(body.validFrom).getFullYear() : '—'} - {body.validTo ? new Date(body.validTo).getFullYear() : 'Present'}
          </span>
        </div>
      </div>

      {/* Document Section */}
      <div className={`p-3 rounded-lg border ${hasDocument ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Paperclip size={14} className={hasDocument ? 'text-emerald-600' : 'text-amber-600'} />
          <span className="text-xs font-medium text-slate-700">
            Membership Certificate <span className="text-red-500">*</span>
          </span>
        </div>

        {body.document ? (
          <FileAttachment
            file={body.document}
            onRemove={!disabled ? () => onDocumentChange(body.id, null) : undefined}
            disabled={disabled}
          />
        ) : (
          <FileUpload
            value={null}
            onChange={(doc) => onDocumentChange(body.id, doc)}
            required
            disabled={disabled}
            helperText="Upload membership certificate"
            maxSize={5}
          />
        )}
      </div>
    </div>
  );
}

// Committee Role Form Modal
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
  const [touched, setTouched] = useState({});

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
      setTouched({});
    }
  }, [isOpen, role]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.committeeName?.trim()) newErrors.committeeName = 'Committee name is required';
    if (!formData.role?.trim()) newErrors.role = 'Role is required';
    if (!formData.level) newErrors.level = 'Level is required';
    if (!formData.fromDate) newErrors.fromDate = 'Start date is required';
    if (!formData.selfMarks || parseFloat(formData.selfMarks) < 0) newErrors.selfMarks = 'Valid marks required';
    if (parseFloat(formData.selfMarks) > PART_C_CAPS.committeeRoles.max) {
      newErrors.selfMarks = `Maximum ${PART_C_CAPS.committeeRoles.max} marks allowed`;
    }
    if (!formData.document) newErrors.document = 'Please upload appointment/nomination letter as proof';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setTouched({ committeeName: true, role: true, level: true, fromDate: true, selfMarks: true, document: true });
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
          <Button onClick={handleSubmit} icon={isEditing ? Save : Plus}>
            {isEditing ? 'Update' : 'Add Role'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Alert variant="info" icon={AlertCircle}>
          Upload committee appointment or nomination letter as proof. Maximum marks: {PART_C_CAPS.committeeRoles.max}
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Committee Name"
            value={formData.committeeName}
            onChange={(e) => setFormData({ ...formData, committeeName: e.target.value })}
            placeholder="e.g., Board of Studies"
            required
            error={touched.committeeName && errors.committeeName}
          />
          <Input
            label="Your Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g., Member, Coordinator"
            required
            error={touched.role && errors.role}
          />
          <Select
            label="Level"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            required
            error={touched.level && errors.level}
          >
            <option value="">Select Level</option>
            <option value="Department">Department</option>
            <option value="College">College</option>
            <option value="University">University</option>
            <option value="National">National</option>
            <option value="International">International</option>
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
            error={touched.selfMarks && errors.selfMarks}
          />
          <Input
            label="From Date"
            type="date"
            value={formData.fromDate}
            onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
            required
            error={touched.fromDate && errors.fromDate}
          />
          <Input
            label="To Date (leave blank if ongoing)"
            type="date"
            value={formData.toDate}
            onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
          />
        </div>

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of your responsibilities"
          rows={2}
        />

        <div className={`p-4 rounded-xl border-2 ${touched.document && errors.document ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Upload size={18} className="text-slate-600" />
            <label className="text-sm font-semibold text-slate-700">
              Appointment/Nomination Letter <span className="text-red-500">*</span>
            </label>
          </div>
          <FileUpload
            value={formData.document}
            onChange={(doc) => {
              setFormData({ ...formData, document: doc });
              setTouched(prev => ({ ...prev, document: true }));
              if (doc) setErrors(prev => ({ ...prev, document: null }));
            }}
            required
            error={touched.document && errors.document}
            helperText="Upload committee appointment or nomination letter"
            maxSize={5}
          />
        </div>
      </div>
    </Modal>
  );
}

// Professional Body Form Modal
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
  const [touched, setTouched] = useState({});

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
      setTouched({});
    }
  }, [isOpen, body]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bodyName?.trim()) newErrors.bodyName = 'Professional body name is required';
    if (!formData.membershipType?.trim()) newErrors.membershipType = 'Membership type is required';
    if (!formData.selfMarks || parseFloat(formData.selfMarks) < 0) newErrors.selfMarks = 'Valid marks required';
    if (parseFloat(formData.selfMarks) > PART_C_CAPS.professionalBodies.max) {
      newErrors.selfMarks = `Maximum ${PART_C_CAPS.professionalBodies.max} marks allowed`;
    }
    if (!formData.document) newErrors.document = 'Please upload membership certificate as proof';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setTouched({ bodyName: true, membershipType: true, selfMarks: true, document: true });
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
      title={isEditing ? 'Edit Professional Body Membership' : 'Add Professional Body Membership'}
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} icon={isEditing ? Save : Plus}>
            {isEditing ? 'Update' : 'Add Membership'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Alert variant="info" icon={AlertCircle}>
          Upload membership certificate as proof. Maximum marks: {PART_C_CAPS.professionalBodies.max}
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Professional Body Name"
            value={formData.bodyName}
            onChange={(e) => setFormData({ ...formData, bodyName: e.target.value })}
            placeholder="e.g., IEEE, ACM, CSI"
            required
            error={touched.bodyName && errors.bodyName}
          />
          <Select
            label="Membership Type"
            value={formData.membershipType}
            onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
            required
            error={touched.membershipType && errors.membershipType}
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
            error={touched.selfMarks && errors.selfMarks}
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

        <div className={`p-4 rounded-xl border-2 ${touched.document && errors.document ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Upload size={18} className="text-slate-600" />
            <label className="text-sm font-semibold text-slate-700">
              Membership Certificate <span className="text-red-500">*</span>
            </label>
          </div>
          <FileUpload
            value={formData.document}
            onChange={(doc) => {
              setFormData({ ...formData, document: doc });
              setTouched(prev => ({ ...prev, document: true }));
              if (doc) setErrors(prev => ({ ...prev, document: null }));
            }}
            required
            error={touched.document && errors.document}
            helperText="Upload membership certificate or ID card"
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

  // Load sample data
  const loadSampleData = () => {
    setKeyContribution(sampleKeyContributions);
    setCommitteeRoles(sampleCommitteeRoles);
    setProfessionalBodies(sampleProfessionalBodies);
    setStudentFeedback(sampleStudentFeedback);
  };

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
      <Header
        title="Part C - Academic/Administrative Contribution"
        subtitle="Maximum 100 marks across all subsections"
      />

      <div className="p-6 space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/appraisal" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
            <ArrowLeft size={18} />
            Back to Appraisal Overview
          </Link>
          {!isReadOnly && (
            <Button variant="outline" onClick={loadSampleData} size="sm">
              Load Sample Data
            </Button>
          )}
        </div>

        {isReadOnly && (
          <Alert variant="info">
            This appraisal has been submitted and is now read-only.
          </Alert>
        )}

        {/* Total Score Card */}
        <Card className="bg-linear-to-r from-amber-50 to-orange-50 border-amber-200 border-2">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900">Part C Total Score</h3>
              <p className="text-slate-600 mt-1">
                Academic and administrative contributions
              </p>
              <div className="mt-4">
                <ProgressBar value={cappedTotal} max={PART_C_TOTAL_MAX} showLabel={false} />
              </div>
            </div>
            <div className="shrink-0 text-center md:text-right">
              <div className="flex items-baseline justify-center md:justify-end gap-2">
                <span className="text-5xl font-bold text-amber-600">{cappedTotal}</span>
                <span className="text-2xl text-slate-400">/ {PART_C_TOTAL_MAX}</span>
              </div>
              <div className="flex items-center justify-center md:justify-end gap-2 mt-2 text-sm">
                <Paperclip size={14} className={totalDocs === totalRequired ? 'text-emerald-500' : 'text-amber-500'} />
                <span className={totalDocs === totalRequired ? 'text-emerald-600' : 'text-amber-600'}>
                  {totalDocs}/{totalRequired} documents uploaded
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 1: Key Contributions */}
        <SectionCard
          title="Key Contributions"
          description="Major academic/administrative contributions during the appraisal period"
          icon={Award}
          color="emerald"
          score={keyContributionScore}
          maxScore={PART_C_CAPS.keyContribution.max}
          docCount={keyContribution.document ? 1 : 0}
          totalCount={1}
        >
          <div className="space-y-4">
            <Textarea
              label="Describe your key contributions"
              value={keyContribution.contribution}
              onChange={(e) => setKeyContribution({ ...keyContribution, contribution: e.target.value })}
              placeholder="Describe your major academic or administrative contributions during this appraisal period..."
              rows={4}
              disabled={isReadOnly}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Self Marks"
                type="number"
                min="0"
                max={PART_C_CAPS.keyContribution.max}
                value={keyContribution.selfMarks}
                onChange={(e) => setKeyContribution({ ...keyContribution, selfMarks: e.target.value })}
                placeholder={`Max: ${PART_C_CAPS.keyContribution.max}`}
                disabled={isReadOnly}
                required
              />
            </div>

            {/* Document Upload */}
            <div className={`p-4 rounded-xl border-2 ${keyContribution.document ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Upload size={18} className="text-slate-600" />
                <label className="text-sm font-semibold text-slate-700">
                  Supporting Document <span className="text-red-500">*</span>
                </label>
              </div>
              <FileUpload
                value={keyContribution.document}
                onChange={(doc) => setKeyContribution({ ...keyContribution, document: doc })}
                required
                disabled={isReadOnly}
                helperText="Upload evidence of your key contributions (certificates, appreciation letters, etc.)"
                maxSize={5}
              />
            </div>
          </div>
        </SectionCard>

        {/* Section 2: Committee Roles */}
        <SectionCard
          title="Committee Roles"
          description="Academic and administrative committee memberships"
          icon={Users}
          color="blue"
          score={committeeScore}
          maxScore={PART_C_CAPS.committeeRoles.max}
          docCount={committeeDocsCount}
          totalCount={committeeRoles.length}
        >
          <div className="space-y-4">
            {!isReadOnly && (
              <div className="flex justify-end">
                <Button icon={Plus} onClick={() => { setEditingCommittee(null); setShowCommitteeModal(true); }}>
                  Add Committee Role
                </Button>
              </div>
            )}

            {committeeRoles.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                <Users size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 mb-2">No committee roles added</p>
                <p className="text-sm text-amber-600">
                  <AlertCircle size={14} className="inline mr-1" />
                  Document upload required for each role
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {committeeRoles.map(role => (
                  <CommitteeRoleCard
                    key={role.id}
                    role={role}
                    onEdit={handleEditCommittee}
                    onDelete={handleDeleteCommittee}
                    onDocumentChange={handleCommitteeDocChange}
                    disabled={isReadOnly}
                  />
                ))}
              </div>
            )}
          </div>
        </SectionCard>

        {/* Section 3: Professional Bodies */}
        <SectionCard
          title="Professional Body Memberships"
          description="Memberships in professional organizations"
          icon={Building2}
          color="purple"
          score={bodyScore}
          maxScore={PART_C_CAPS.professionalBodies.max}
          docCount={bodyDocsCount}
          totalCount={professionalBodies.length}
        >
          <div className="space-y-4">
            {!isReadOnly && (
              <div className="flex justify-end">
                <Button icon={Plus} onClick={() => { setEditingBody(null); setShowBodyModal(true); }}>
                  Add Membership
                </Button>
              </div>
            )}

            {professionalBodies.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 mb-2">No professional body memberships added</p>
                <p className="text-sm text-amber-600">
                  <AlertCircle size={14} className="inline mr-1" />
                  Membership certificate required for each entry
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {professionalBodies.map(body => (
                  <ProfessionalBodyCard
                    key={body.id}
                    body={body}
                    onEdit={handleEditBody}
                    onDelete={handleDeleteBody}
                    onDocumentChange={handleBodyDocChange}
                    disabled={isReadOnly}
                  />
                ))}
              </div>
            )}
          </div>
        </SectionCard>

        {/* Section 4: Student Feedback */}
        <SectionCard
          title="Student Feedback"
          description="Student feedback scores for the appraisal period"
          icon={MessageSquare}
          color="amber"
          score={feedbackScore}
          maxScore={PART_C_CAPS.studentFeedback.max}
          docCount={studentFeedback.feedbackReport ? 1 : 0}
          totalCount={1}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Average Score (out of 5)"
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
                placeholder="e.g., Odd Semester 2024-25"
                disabled={isReadOnly}
              />
              <Input
                label="Course Name"
                value={studentFeedback.courseName}
                onChange={(e) => setStudentFeedback({ ...studentFeedback, courseName: e.target.value })}
                placeholder="e.g., Machine Learning"
                disabled={isReadOnly}
              />
            </div>

            <Input
              label="Self Marks"
              type="number"
              min="0"
              max={PART_C_CAPS.studentFeedback.max}
              value={studentFeedback.selfMarks}
              onChange={(e) => setStudentFeedback({ ...studentFeedback, selfMarks: e.target.value })}
              placeholder={`Max: ${PART_C_CAPS.studentFeedback.max}`}
              disabled={isReadOnly}
              className="max-w-xs"
              required
            />

            {/* Feedback Report Upload */}
            <div className={`p-4 rounded-xl border-2 ${studentFeedback.feedbackReport ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Upload size={18} className="text-slate-600" />
                <label className="text-sm font-semibold text-slate-700">
                  Feedback Report <span className="text-red-500">*</span>
                </label>
              </div>
              <FileUpload
                value={studentFeedback.feedbackReport}
                onChange={(doc) => setStudentFeedback({ ...studentFeedback, feedbackReport: doc })}
                required
                disabled={isReadOnly}
                helperText="Upload official student feedback report from the institution"
                maxSize={5}
              />
            </div>
          </div>
        </SectionCard>

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

        {/* Bottom Navigation */}
        {!isReadOnly && (
          <div className="flex items-center justify-center p-4 bg-white rounded-xl shadow-lg border sticky bottom-4">
            <Button onClick={handleSave} loading={saving} className="bg-emerald-600 hover:bg-emerald-700 px-8">
              <Save size={16} className="mr-2" />
              Save Part C
            </Button>
          </div>
        )}

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Part C Saved Successfully!"
          message="Your academic and administrative contributions have been saved. You can now proceed to Part D for Values & Ethics."
          buttonText="Continue"
          redirectUrl="/appraisal"
        />
      </div>
    </DashboardLayout>
  );
}
