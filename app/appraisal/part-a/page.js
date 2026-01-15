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
import Modal from '@/components/ui/Modal';
import FileUpload, { MultiFileUpload, FileAttachment } from '@/components/ui/FileUpload';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  Save,
  ArrowLeft,
  CheckCircle,
  User,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Edit,
  AlertCircle,
  Upload,
  FileText,
  Paperclip,
} from 'lucide-react';
import Link from 'next/link';

// Sample data helper for prototype
const sampleQualifications = [
  {
    id: 1,
    examination: 'Ph.D.',
    boardUniversity: 'University of Mumbai',
    yearOfPassing: '2020',
    percentage: '',
    grade: 'Distinction',
    subject: 'Computer Science',
    document: null,
  },
  {
    id: 2,
    examination: 'M.Tech',
    boardUniversity: 'IIT Bombay',
    yearOfPassing: '2015',
    percentage: '82.5',
    grade: 'First Class with Distinction',
    subject: 'Computer Science',
    document: null,
  },
  {
    id: 3,
    examination: 'B.E.',
    boardUniversity: 'University of Pune',
    yearOfPassing: '2012',
    percentage: '76.8',
    grade: 'First Class',
    subject: 'Computer Engineering',
    document: null,
  },
];

const sampleBasicDetails = {
  employeeNo: 'EMP001',
  fullName: 'Dr. Sample Teacher',
  designation: 'Assistant Professor',
  department: 'Computer Science',
  dateOfJoining: '2018-07-15',
  dateOfBirth: '1990-05-20',
  currentBand: 'Band 3',
  lastBandChangeDate: '2022-04-01',
  lastPromotionDate: '2021-07-01',
  academicLevelCas: 'Level 10',
  promotionEligibilityDate: '2026-07-01',
  location: 'Mumbai',
  mobile: '9876543210',
  email: 'sample.teacher@sies.edu.in',
  address: '123, Sample Address, Mumbai - 400001',
};

const sampleExperience = {
  teachingExpUg: '5',
  teachingExpPg: '3',
  industryExperience: '2',
  nonTeachingExperience: '0',
  siesExperience: '6',
  specialization: 'Machine Learning, Artificial Intelligence, Data Science',
};

function QualificationCard({ qualification, onEdit, onDelete, onDocumentChange, disabled, index }) {
  const hasDocument = !!qualification.document;
  
  return (
    <Card className={`border-2 ${hasDocument ? 'border-emerald-200 bg-emerald-50/30' : 'border-amber-200 bg-amber-50/30'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${hasDocument ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
            <GraduationCap size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">{qualification.examination}</h4>
            <p className="text-sm text-slate-500">{qualification.boardUniversity}</p>
          </div>
        </div>
        {!disabled && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(qualification)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(qualification.id)}
              className="p-2 rounded-lg text-slate-500 hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
        <div>
          <p className="text-slate-500">Year</p>
          <p className="font-medium text-slate-900">{qualification.yearOfPassing}</p>
        </div>
        <div>
          <p className="text-slate-500">Subject</p>
          <p className="font-medium text-slate-900">{qualification.subject || '—'}</p>
        </div>
        <div>
          <p className="text-slate-500">Percentage</p>
          <p className="font-medium text-slate-900">{qualification.percentage || '—'}</p>
        </div>
        <div>
          <p className="text-slate-500">Grade</p>
          <p className="font-medium text-slate-900">{qualification.grade || '—'}</p>
        </div>
      </div>

      {/* Document Upload Section */}
      <div className={`p-3 rounded-lg border ${hasDocument ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Paperclip size={16} className={hasDocument ? 'text-emerald-600' : 'text-amber-600'} />
          <span className="text-sm font-medium text-slate-700">
            Certificate/Marksheet <span className="text-red-500">*</span>
          </span>
        </div>
        
        {qualification.document ? (
          <div className="flex items-center justify-between">
            <FileAttachment 
              file={qualification.document} 
              onRemove={!disabled ? () => onDocumentChange(qualification.id, null) : undefined}
              disabled={disabled}
            />
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle size={14} />
              Uploaded
            </span>
          </div>
        ) : (
          <FileUpload
            value={null}
            onChange={(doc) => onDocumentChange(qualification.id, doc)}
            required
            disabled={disabled}
            helperText="Upload certificate or marksheet (PDF/JPG/PNG)"
            maxSize={5}
          />
        )}
      </div>
    </Card>
  );
}

function QualificationFormModal({ isOpen, onClose, onSave, qualification, isEditing }) {
  const [formData, setFormData] = useState({
    examination: '',
    boardUniversity: '',
    yearOfPassing: '',
    percentage: '',
    grade: '',
    subject: '',
    document: null,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (qualification) {
        setFormData({ ...qualification });
      } else {
        setFormData({
          examination: '',
          boardUniversity: '',
          yearOfPassing: '',
          percentage: '',
          grade: '',
          subject: '',
          document: null,
        });
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, qualification]);

  const validateField = (key, value) => {
    const requiredFields = ['examination', 'boardUniversity', 'yearOfPassing', 'subject'];
    if (requiredFields.includes(key) && (!value || value.toString().trim() === '')) {
      return `This field is required`;
    }
    if (key === 'yearOfPassing' && value) {
      const year = parseInt(value);
      if (year < 1950 || year > new Date().getFullYear()) {
        return 'Please enter a valid year';
      }
    }
    if (key === 'percentage' && value) {
      const pct = parseFloat(value);
      if (pct < 0 || pct > 100) {
        return 'Percentage must be between 0 and 100';
      }
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    ['examination', 'boardUniversity', 'yearOfPassing', 'subject'].forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    // Document is required for qualifications
    if (!formData.document) {
      newErrors.document = 'Please upload certificate/marksheet as proof';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (key) => {
    setTouched(prev => ({ ...prev, [key]: true }));
    const error = validateField(key, formData[key]);
    setErrors(prev => ({ ...prev, [key]: error }));
  };

  const handleSubmit = () => {
    const allTouched = {};
    ['examination', 'boardUniversity', 'yearOfPassing', 'subject', 'document'].forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (validateForm()) {
      const data = { ...formData };
      if (!isEditing) {
        data.id = Date.now();
      }
      onSave(data);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Qualification' : 'Add Qualification'}
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} icon={isEditing ? Save : Plus}>
            {isEditing ? 'Update' : 'Add Qualification'}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <Alert variant="info" icon={AlertCircle}>
          <div>
            <p className="font-medium">Document Required</p>
            <p className="text-sm mt-1">Please upload certificate or marksheet as proof of qualification. Supported formats: PDF, JPG, PNG, DOC, DOCX (max 5MB)</p>
          </div>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Examination/Degree"
            value={formData.examination}
            onChange={(e) => setFormData({ ...formData, examination: e.target.value })}
            onBlur={() => handleBlur('examination')}
            required
            error={touched.examination && errors.examination}
          >
            <option value="">Select Degree</option>
            <option value="Ph.D.">Ph.D.</option>
            <option value="M.Tech">M.Tech</option>
            <option value="M.E.">M.E.</option>
            <option value="M.Sc.">M.Sc.</option>
            <option value="M.C.A.">M.C.A.</option>
            <option value="M.B.A.">M.B.A.</option>
            <option value="B.Tech">B.Tech</option>
            <option value="B.E.">B.E.</option>
            <option value="B.Sc.">B.Sc.</option>
            <option value="B.C.A.">B.C.A.</option>
            <option value="Other">Other</option>
          </Select>

          <Input
            label="Board/University"
            value={formData.boardUniversity}
            onChange={(e) => setFormData({ ...formData, boardUniversity: e.target.value })}
            onBlur={() => handleBlur('boardUniversity')}
            placeholder="e.g., University of Mumbai"
            required
            error={touched.boardUniversity && errors.boardUniversity}
          />

          <Input
            label="Year of Passing"
            type="number"
            value={formData.yearOfPassing}
            onChange={(e) => setFormData({ ...formData, yearOfPassing: e.target.value })}
            onBlur={() => handleBlur('yearOfPassing')}
            placeholder="e.g., 2020"
            required
            error={touched.yearOfPassing && errors.yearOfPassing}
          />

          <Input
            label="Subject/Specialization"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            onBlur={() => handleBlur('subject')}
            placeholder="e.g., Computer Science"
            required
            error={touched.subject && errors.subject}
          />

          <Input
            label="Percentage (if applicable)"
            type="number"
            step="0.1"
            value={formData.percentage}
            onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
            onBlur={() => handleBlur('percentage')}
            placeholder="e.g., 82.5"
            error={touched.percentage && errors.percentage}
          />

          <Select
            label="Grade/Class"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          >
            <option value="">Select Grade</option>
            <option value="Distinction">Distinction</option>
            <option value="First Class with Distinction">First Class with Distinction</option>
            <option value="First Class">First Class</option>
            <option value="Second Class">Second Class</option>
            <option value="Pass">Pass</option>
          </Select>
        </div>

        {/* Document Upload */}
        <div className={`p-4 rounded-xl border-2 ${touched.document && errors.document ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Upload size={18} className="text-slate-600" />
            <label className="text-sm font-semibold text-slate-700">
              Certificate/Marksheet <span className="text-red-500">*</span>
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
            helperText="Upload degree certificate or marksheet as proof"
            maxSize={5}
          />
        </div>
      </div>
    </Modal>
  );
}

export default function PartAPage() {
  const { user } = useAuth();
  const { getCurrentAppraisal, getFullAppraisalData, savePartABasic, savePartAQualifications, savePartAExperience } = useAppraisal();

  const appraisal = user ? getCurrentAppraisal(user.id) : null;
  const fullData = appraisal ? getFullAppraisalData(appraisal.id) : null;
  const isReadOnly = appraisal?.status !== 'DRAFT';

  // Basic Details State
  const [basicDetails, setBasicDetails] = useState({
    employeeNo: '',
    fullName: '',
    designation: '',
    department: '',
    dateOfJoining: '',
    dateOfBirth: '',
    currentBand: '',
    lastBandChangeDate: '',
    lastPromotionDate: '',
    academicLevelCas: '',
    promotionEligibilityDate: '',
    location: '',
    mobile: '',
    email: '',
    address: '',
    profilePhoto: null,
  });

  // Qualifications State
  const [qualifications, setQualifications] = useState([]);
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [editingQualification, setEditingQualification] = useState(null);

  // Experience State
  const [experience, setExperience] = useState({
    teachingExpUg: '',
    teachingExpPg: '',
    industryExperience: '',
    nonTeachingExperience: '',
    siesExperience: '',
    specialization: '',
    experienceProof: null,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  // Load data on mount
  useEffect(() => {
    if (fullData) {
      if (fullData.partA?.basic) {
        setBasicDetails(prev => ({ ...prev, ...fullData.partA.basic }));
      }
      if (fullData.partA?.qualifications?.length > 0) {
        setQualifications(fullData.partA.qualifications);
      }
      if (fullData.partA?.experience) {
        setExperience(prev => ({ ...prev, ...fullData.partA.experience }));
      }
    }
  }, [fullData]);

  // Load sample data for prototype
  const loadSampleData = () => {
    setBasicDetails({ ...sampleBasicDetails, profilePhoto: null });
    setQualifications(sampleQualifications);
    setExperience({ ...sampleExperience, experienceProof: null });
  };

  const handleQualificationEdit = (qual) => {
    setEditingQualification(qual);
    setShowQualificationModal(true);
  };

  const handleQualificationDelete = (id) => {
    if (confirm('Are you sure you want to delete this qualification?')) {
      setQualifications(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleQualificationSave = (qual) => {
    if (editingQualification) {
      setQualifications(prev => prev.map(q => q.id === editingQualification.id ? qual : q));
    } else {
      setQualifications(prev => [...prev, qual]);
    }
    setEditingQualification(null);
  };

  const handleQualificationDocumentChange = (qualId, doc) => {
    setQualifications(prev => prev.map(q => q.id === qualId ? { ...q, document: doc } : q));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic details validation
    if (!basicDetails.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!basicDetails.employeeNo?.trim()) newErrors.employeeNo = 'Employee number is required';
    if (!basicDetails.department?.trim()) newErrors.department = 'Department is required';
    if (!basicDetails.designation?.trim()) newErrors.designation = 'Designation is required';
    if (!basicDetails.email?.trim()) newErrors.email = 'Email is required';
    if (!basicDetails.mobile?.trim()) newErrors.mobile = 'Mobile number is required';
    
    // Qualifications validation
    if (qualifications.length === 0) {
      newErrors.qualifications = 'At least one qualification is required';
    } else {
      const missingDocs = qualifications.filter(q => !q.document).length;
      if (missingDocs > 0) {
        newErrors.qualifications = `${missingDocs} qualification(s) missing certificate upload`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!appraisal) return;

    setSaving(true);
    try {
      savePartABasic(appraisal.id, basicDetails);
      savePartAQualifications(appraisal.id, qualifications);
      savePartAExperience(appraisal.id, experience);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  // Calculate completion
  const basicComplete = basicDetails.fullName && basicDetails.employeeNo && basicDetails.department;
  const qualificationsComplete = qualifications.length > 0 && qualifications.every(q => q.document);
  const experienceComplete = experience.specialization?.length > 0;
  
  const completedSections = [basicComplete, qualificationsComplete, experienceComplete].filter(Boolean).length;
  const completionPercentage = Math.round((completedSections / 3) * 100);

  return (
    <DashboardLayout>
      <Header
        title="Part A - General Information"
        subtitle="Basic details, qualifications, and experience"
      />

      <div className="p-6 space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/appraisal" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
            <ArrowLeft size={18} />
            Back to Appraisal Overview
          </Link>
          <div className="flex items-center gap-3">
            {/* Sample Data Button for Prototype */}
            {!isReadOnly && (
              <Button variant="outline" onClick={loadSampleData} size="sm">
                Load Sample Data
              </Button>
            )}
            {saved && (
              <span className="flex items-center gap-2 text-sm text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full">
                <CheckCircle size={16} />
                Saved!
              </span>
            )}
            {!isReadOnly && (
              <Button icon={Save} onClick={handleSave} loading={saving}>
                Save All Changes
              </Button>
            )}
          </div>
        </div>

        {isReadOnly && (
          <Alert variant="info">
            This appraisal has been submitted and is now read-only.
          </Alert>
        )}

        {/* Completion Progress */}
        <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200 border-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Part A Completion</h3>
              <p className="text-sm text-slate-600">{completedSections} of 3 sections complete</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-blue-600">{completionPercentage}%</p>
            </div>
          </div>
          <ProgressBar value={completionPercentage} max={100} showLabel={false} />
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className={`text-center p-2 rounded-lg ${basicComplete ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-500'}`}>
              <User size={16} className={`mx-auto mb-1 ${basicComplete ? 'text-blue-600' : 'text-slate-300'}`} />
              <p className="text-xs font-medium">Basic Details</p>
            </div>
            <div className={`text-center p-2 rounded-lg ${qualificationsComplete ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-500'}`}>
              <GraduationCap size={16} className={`mx-auto mb-1 ${qualificationsComplete ? 'text-blue-600' : 'text-slate-300'}`} />
              <p className="text-xs font-medium">Qualifications</p>
            </div>
            <div className={`text-center p-2 rounded-lg ${experienceComplete ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-500'}`}>
              <Briefcase size={16} className={`mx-auto mb-1 ${experienceComplete ? 'text-blue-600' : 'text-slate-300'}`} />
              <p className="text-xs font-medium">Experience</p>
            </div>
          </div>
        </Card>

        {/* Section 1: Basic Details */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <Card.Title>Basic Details</Card.Title>
                <p className="text-sm text-slate-500 mt-0.5">Personal and professional information</p>
              </div>
            </div>
          </Card.Header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Employee Number"
              value={basicDetails.employeeNo}
              onChange={(e) => setBasicDetails({ ...basicDetails, employeeNo: e.target.value })}
              placeholder="e.g., EMP001"
              required
              disabled={isReadOnly}
              error={errors.employeeNo}
            />
            <Input
              label="Full Name"
              value={basicDetails.fullName}
              onChange={(e) => setBasicDetails({ ...basicDetails, fullName: e.target.value })}
              placeholder="e.g., Dr. John Doe"
              required
              disabled={isReadOnly}
              error={errors.fullName}
            />
            <Select
              label="Designation"
              value={basicDetails.designation}
              onChange={(e) => setBasicDetails({ ...basicDetails, designation: e.target.value })}
              required
              disabled={isReadOnly}
              error={errors.designation}
            >
              <option value="">Select Designation</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Lecturer">Lecturer</option>
            </Select>
            <Select
              label="Department"
              value={basicDetails.department}
              onChange={(e) => setBasicDetails({ ...basicDetails, department: e.target.value })}
              required
              disabled={isReadOnly}
              error={errors.department}
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Humanities">Humanities</option>
            </Select>
            <Input
              label="Date of Joining"
              type="date"
              value={basicDetails.dateOfJoining}
              onChange={(e) => setBasicDetails({ ...basicDetails, dateOfJoining: e.target.value })}
              disabled={isReadOnly}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={basicDetails.dateOfBirth}
              onChange={(e) => setBasicDetails({ ...basicDetails, dateOfBirth: e.target.value })}
              disabled={isReadOnly}
            />
            <Input
              label="Current Band"
              value={basicDetails.currentBand}
              onChange={(e) => setBasicDetails({ ...basicDetails, currentBand: e.target.value })}
              placeholder="e.g., Band 4"
              disabled={isReadOnly}
            />
            <Input
              label="Last Band Change Date"
              type="date"
              value={basicDetails.lastBandChangeDate}
              onChange={(e) => setBasicDetails({ ...basicDetails, lastBandChangeDate: e.target.value })}
              disabled={isReadOnly}
            />
            <Input
              label="Last Promotion Date"
              type="date"
              value={basicDetails.lastPromotionDate}
              onChange={(e) => setBasicDetails({ ...basicDetails, lastPromotionDate: e.target.value })}
              disabled={isReadOnly}
            />
            <Input
              label="Academic Level (CAS)"
              value={basicDetails.academicLevelCas}
              onChange={(e) => setBasicDetails({ ...basicDetails, academicLevelCas: e.target.value })}
              placeholder="e.g., Level 12"
              disabled={isReadOnly}
            />
            <Input
              label="Promotion Eligibility Date"
              type="date"
              value={basicDetails.promotionEligibilityDate}
              onChange={(e) => setBasicDetails({ ...basicDetails, promotionEligibilityDate: e.target.value })}
              disabled={isReadOnly}
            />
            <Input
              label="Location"
              value={basicDetails.location}
              onChange={(e) => setBasicDetails({ ...basicDetails, location: e.target.value })}
              placeholder="e.g., Mumbai"
              disabled={isReadOnly}
            />
            <Input
              label="Mobile Number"
              value={basicDetails.mobile}
              onChange={(e) => setBasicDetails({ ...basicDetails, mobile: e.target.value })}
              placeholder="e.g., 9876543210"
              required
              disabled={isReadOnly}
              error={errors.mobile}
            />
            <Input
              label="Email ID"
              type="email"
              value={basicDetails.email}
              onChange={(e) => setBasicDetails({ ...basicDetails, email: e.target.value })}
              placeholder="e.g., name@sies.edu.in"
              required
              disabled={isReadOnly}
              error={errors.email}
            />
            <div className="md:col-span-2 lg:col-span-1">
              <Textarea
                label="Address with PIN Code"
                value={basicDetails.address}
                onChange={(e) => setBasicDetails({ ...basicDetails, address: e.target.value })}
                placeholder="Enter complete address"
                rows={2}
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* Profile Photo Upload (Optional) */}
          <div className="mt-6 p-4 border rounded-xl bg-slate-50">
            <div className="flex items-center gap-2 mb-3">
              <User size={18} className="text-slate-600" />
              <label className="text-sm font-semibold text-slate-700">Profile Photo (Optional)</label>
            </div>
            <FileUpload
              value={basicDetails.profilePhoto}
              onChange={(doc) => setBasicDetails({ ...basicDetails, profilePhoto: doc })}
              accept=".jpg,.jpeg,.png"
              disabled={isReadOnly}
              helperText="Upload a professional photo (JPG/PNG, max 2MB)"
              maxSize={2}
            />
          </div>
        </Card>

        {/* Section 2: Qualifications */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GraduationCap size={20} className="text-purple-600" />
              </div>
              <div>
                <Card.Title>Academic Qualifications</Card.Title>
                <p className="text-sm text-slate-500 mt-0.5">Add all your academic qualifications with certificates</p>
              </div>
            </div>
            {!isReadOnly && (
              <Button 
                icon={Plus} 
                onClick={() => { setEditingQualification(null); setShowQualificationModal(true); }}
              >
                Add Qualification
              </Button>
            )}
          </Card.Header>

          {errors.qualifications && (
            <Alert variant="error" icon={AlertCircle} className="mb-4">
              {errors.qualifications}
            </Alert>
          )}

          {qualifications.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              <GraduationCap size={48} className="mx-auto text-slate-300 mb-4" />
              <h4 className="text-lg font-semibold text-slate-700 mb-2">No qualifications added</h4>
              <p className="text-slate-500 mb-4">Add your academic qualifications with supporting documents</p>
              <p className="text-sm text-amber-600 mb-4">
                <AlertCircle size={14} className="inline mr-1" />
                Certificate/Marksheet upload is required for each qualification
              </p>
              {!isReadOnly && (
                <Button 
                  icon={Plus} 
                  onClick={() => { setEditingQualification(null); setShowQualificationModal(true); }}
                >
                  Add Your First Qualification
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {qualifications.map((qual, index) => (
                <QualificationCard
                  key={qual.id}
                  qualification={qual}
                  index={index}
                  onEdit={handleQualificationEdit}
                  onDelete={handleQualificationDelete}
                  onDocumentChange={handleQualificationDocumentChange}
                  disabled={isReadOnly}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Section 3: Experience */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Briefcase size={20} className="text-amber-600" />
              </div>
              <div>
                <Card.Title>Teaching & Industry Experience</Card.Title>
                <p className="text-sm text-slate-500 mt-0.5">Years of experience in various domains</p>
              </div>
            </div>
          </Card.Header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Teaching Experience (UG) - Years"
              type="number"
              step="0.5"
              min="0"
              value={experience.teachingExpUg}
              onChange={(e) => setExperience({ ...experience, teachingExpUg: e.target.value })}
              placeholder="e.g., 5"
              disabled={isReadOnly}
            />
            <Input
              label="Teaching Experience (PG) - Years"
              type="number"
              step="0.5"
              min="0"
              value={experience.teachingExpPg}
              onChange={(e) => setExperience({ ...experience, teachingExpPg: e.target.value })}
              placeholder="e.g., 3"
              disabled={isReadOnly}
            />
            <Input
              label="Industry Experience - Years"
              type="number"
              step="0.5"
              min="0"
              value={experience.industryExperience}
              onChange={(e) => setExperience({ ...experience, industryExperience: e.target.value })}
              placeholder="e.g., 2"
              disabled={isReadOnly}
            />
            <Input
              label="Non-Teaching Experience - Years"
              type="number"
              step="0.5"
              min="0"
              value={experience.nonTeachingExperience}
              onChange={(e) => setExperience({ ...experience, nonTeachingExperience: e.target.value })}
              placeholder="e.g., 0"
              disabled={isReadOnly}
            />
            <Input
              label="SIES Experience - Years"
              type="number"
              step="0.5"
              min="0"
              value={experience.siesExperience}
              onChange={(e) => setExperience({ ...experience, siesExperience: e.target.value })}
              placeholder="e.g., 6"
              disabled={isReadOnly}
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Fields of Specialization"
              value={experience.specialization}
              onChange={(e) => setExperience({ ...experience, specialization: e.target.value })}
              placeholder="e.g., Machine Learning, Artificial Intelligence, Data Science, Deep Learning"
              rows={3}
              disabled={isReadOnly}
              required
            />
          </div>

          {/* Experience Proof Upload (Optional) */}
          <div className="mt-6 p-4 border rounded-xl bg-slate-50">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-slate-600" />
              <label className="text-sm font-semibold text-slate-700">Experience Certificate (Optional)</label>
            </div>
            <FileUpload
              value={experience.experienceProof}
              onChange={(doc) => setExperience({ ...experience, experienceProof: doc })}
              disabled={isReadOnly}
              helperText="Upload experience certificate from previous employer if applicable"
              maxSize={5}
            />
          </div>
        </Card>

        {/* Qualification Modal */}
        <QualificationFormModal
          isOpen={showQualificationModal}
          onClose={() => { setShowQualificationModal(false); setEditingQualification(null); }}
          onSave={handleQualificationSave}
          qualification={editingQualification}
          isEditing={!!editingQualification}
        />
      </div>
    </DashboardLayout>
  );
}
