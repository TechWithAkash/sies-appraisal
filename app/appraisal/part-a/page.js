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
  ArrowRight,
  CheckCircle,
  User,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Edit,
  AlertCircle,
  FileText,
  Paperclip,
  Check,
} from 'lucide-react';
import Link from 'next/link';

// Sample data for prototype
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
    percentage: '82',
    grade: '',
    subject: 'Computer Engineering',
    document: null,
  },
  {
    id: 3,
    examination: 'B.E.',
    boardUniversity: 'Mumbai University',
    yearOfPassing: '2012',
    percentage: '76',
    grade: '',
    subject: 'Information Technology',
    document: null,
  },
];

const sampleBasicDetails = {
  employeeNo: 'EMP2024001',
  fullName: 'Dr. Rajesh Kumar Sharma',
  designation: 'Associate Professor',
  department: 'Computer Science',
  dateOfJoining: '2015-07-01',
  dateOfBirth: '1985-03-15',
  currentBand: 'Band 4',
  lastBandChangeDate: '2022-04-01',
  lastPromotionDate: '2020-07-01',
  academicLevelCas: 'Level 12',
  promotionEligibilityDate: '2025-07-01',
  location: 'Mumbai',
  mobile: '9876543210',
  email: 'rajesh.sharma@sies.edu.in',
  address: '123, Green Avenue, Andheri East, Mumbai - 400069',
  profilePhoto: null,
};

const sampleExperience = {
  teachingExpUg: '10',
  teachingExpPg: '6',
  industryExperience: '2',
  nonTeachingExperience: '0',
  siesExperience: '9',
  specialization: 'Machine Learning, Artificial Intelligence, Data Science, Deep Learning',
  experienceProof: null,
};

// Steps configuration
const STEPS = [
  { id: 0, title: 'Basic Details', icon: User, description: 'Personal and professional information' },
  { id: 1, title: 'Qualifications', icon: GraduationCap, description: 'Academic qualifications with certificates' },
  { id: 2, title: 'Experience', icon: Briefcase, description: 'Teaching and industry experience' },
];

// Qualification Card Component
function QualificationCard({ qualification, index, onEdit, onDelete, onDocumentChange, disabled }) {
  const hasDocument = !!qualification.document;

  return (
    <div className={`p-4 rounded-xl border-2 transition-all ${hasDocument ? 'border-emerald-200 bg-emerald-50/30' : 'border-amber-200 bg-amber-50/30'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${hasDocument ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
            {index + 1}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">{qualification.examination}</h4>
            <p className="text-sm text-slate-500">{qualification.boardUniversity} • {qualification.yearOfPassing}</p>
          </div>
        </div>
        {!disabled && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(qualification)}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(qualification.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
        <div>
          <span className="text-slate-400 text-xs">Subject</span>
          <p className="font-medium text-slate-700">{qualification.subject || '-'}</p>
        </div>
        <div>
          <span className="text-slate-400 text-xs">Percentage/Grade</span>
          <p className="font-medium text-slate-700">{qualification.percentage || qualification.grade || '-'}</p>
        </div>
        <div>
          <span className="text-slate-400 text-xs">Year</span>
          <p className="font-medium text-slate-700">{qualification.yearOfPassing}</p>
        </div>
        <div>
          <span className="text-slate-400 text-xs">Document</span>
          <p className={`font-medium ${hasDocument ? 'text-emerald-600' : 'text-amber-600'}`}>
            {hasDocument ? '✓ Uploaded' : 'Required'}
          </p>
        </div>
      </div>

      {/* Document Upload Section */}
      <div className={`p-3 rounded-lg ${hasDocument ? 'bg-emerald-100' : 'bg-amber-100'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Paperclip size={14} className={hasDocument ? 'text-emerald-600' : 'text-amber-600'} />
          <span className={`text-xs font-semibold ${hasDocument ? 'text-emerald-700' : 'text-amber-700'}`}>
            Certificate/Marksheet {!hasDocument && '(Required)'}
          </span>
        </div>
        {hasDocument ? (
          <FileAttachment
            file={qualification.document}
            onRemove={() => onDocumentChange(qualification.id, null)}
            disabled={disabled}
          />
        ) : (
          <FileUpload
            onChange={(doc) => onDocumentChange(qualification.id, doc)}
            disabled={disabled}
            helperText="Upload certificate or marksheet (PDF/JPG/PNG)"
            compact
          />
        )}
      </div>
    </div>
  );
}

// Examination options for dropdown
const EXAMINATION_OPTIONS = [
  { value: '', label: 'Select Examination', category: '' },
  // Doctoral
  { value: 'Ph.D.', label: 'Ph.D. (Doctor of Philosophy)', category: 'Doctoral' },
  { value: 'D.Litt.', label: 'D.Litt. (Doctor of Literature)', category: 'Doctoral' },
  { value: 'D.Sc.', label: 'D.Sc. (Doctor of Science)', category: 'Doctoral' },
  // Post Graduate
  { value: 'M.Tech', label: 'M.Tech (Master of Technology)', category: 'Post Graduate' },
  { value: 'M.E.', label: 'M.E. (Master of Engineering)', category: 'Post Graduate' },
  { value: 'MBA', label: 'MBA (Master of Business Administration)', category: 'Post Graduate' },
  { value: 'MCA', label: 'MCA (Master of Computer Applications)', category: 'Post Graduate' },
  { value: 'M.Sc.', label: 'M.Sc. (Master of Science)', category: 'Post Graduate' },
  { value: 'M.A.', label: 'M.A. (Master of Arts)', category: 'Post Graduate' },
  { value: 'M.Com.', label: 'M.Com. (Master of Commerce)', category: 'Post Graduate' },
  { value: 'M.Ed.', label: 'M.Ed. (Master of Education)', category: 'Post Graduate' },
  { value: 'M.Phil.', label: 'M.Phil. (Master of Philosophy)', category: 'Post Graduate' },
  { value: 'LLM', label: 'LLM (Master of Laws)', category: 'Post Graduate' },
  // Graduate
  { value: 'B.Tech', label: 'B.Tech (Bachelor of Technology)', category: 'Graduate' },
  { value: 'B.E.', label: 'B.E. (Bachelor of Engineering)', category: 'Graduate' },
  { value: 'BCA', label: 'BCA (Bachelor of Computer Applications)', category: 'Graduate' },
  { value: 'B.Sc.', label: 'B.Sc. (Bachelor of Science)', category: 'Graduate' },
  { value: 'B.A.', label: 'B.A. (Bachelor of Arts)', category: 'Graduate' },
  { value: 'B.Com.', label: 'B.Com. (Bachelor of Commerce)', category: 'Graduate' },
  { value: 'BBA', label: 'BBA (Bachelor of Business Administration)', category: 'Graduate' },
  { value: 'B.Ed.', label: 'B.Ed. (Bachelor of Education)', category: 'Graduate' },
  { value: 'LLB', label: 'LLB (Bachelor of Laws)', category: 'Graduate' },
  // Diploma
  { value: 'Diploma', label: 'Diploma', category: 'Diploma' },
  { value: 'PG Diploma', label: 'Post Graduate Diploma', category: 'Diploma' },
  // Competitive Exams
  { value: 'NET', label: 'NET (National Eligibility Test)', category: 'Competitive Exams' },
  { value: 'SET', label: 'SET (State Eligibility Test)', category: 'Competitive Exams' },
  { value: 'SLET', label: 'SLET (State Level Eligibility Test)', category: 'Competitive Exams' },
  { value: 'GATE', label: 'GATE (Graduate Aptitude Test)', category: 'Competitive Exams' },
  { value: 'UGC-CSIR', label: 'UGC-CSIR NET', category: 'Competitive Exams' },
  // School
  { value: 'HSC', label: 'HSC / 12th Standard', category: 'School' },
  { value: 'SSC', label: 'SSC / 10th Standard', category: 'School' },
  // Other
  { value: 'Other', label: 'Other', category: 'Other' },
];

// Qualification Form Modal
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

  useEffect(() => {
    if (qualification) {
      setFormData({
        examination: qualification.examination || '',
        boardUniversity: qualification.boardUniversity || '',
        yearOfPassing: qualification.yearOfPassing || '',
        percentage: qualification.percentage || '',
        grade: qualification.grade || '',
        subject: qualification.subject || '',
        document: qualification.document || null,
      });
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
  }, [qualification, isOpen]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      id: qualification?.id || Date.now(),
    });
    onClose();
  };

  // Group options by category
  const groupedOptions = EXAMINATION_OPTIONS.reduce((acc, opt) => {
    if (!opt.category) return acc;
    if (!acc[opt.category]) acc[opt.category] = [];
    acc[opt.category].push(opt);
    return acc;
  }, {});

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Qualification' : 'Add Qualification'} size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Examination <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.examination}
            onChange={(e) => setFormData({ ...formData, examination: e.target.value })}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            required
          >
            <option value="">Select Examination</option>
            {Object.entries(groupedOptions).map(([category, options]) => (
              <optgroup key={category} label={`── ${category} ──`}>
                {options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <Input
          label="Subject/Specialization"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="e.g., Computer Science"
          required
        />
        <Input
          label="Board/University"
          value={formData.boardUniversity}
          onChange={(e) => setFormData({ ...formData, boardUniversity: e.target.value })}
          placeholder="e.g., Mumbai University"
          required
        />
        <Input
          label="Year of Passing"
          type="number"
          value={formData.yearOfPassing}
          onChange={(e) => setFormData({ ...formData, yearOfPassing: e.target.value })}
          placeholder="e.g., 2020"
          required
          min="1970"
          max={new Date().getFullYear()}
        />
        <Input
          label="Percentage (if applicable)"
          type="number"
          value={formData.percentage}
          onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
          placeholder="e.g., 75"
          min="0"
          max="100"
        />
        <Input
          label="Grade (if applicable)"
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          placeholder="e.g., Distinction, A+, First Class"
        />

        {/* Document Upload Section */}
        <div className="md:col-span-2 mt-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-emerald-600" />
              <span className="font-medium text-slate-700">Upload Marksheet / Certificate</span>
              <span className="text-red-500">*</span>
            </div>
            <FileUpload
              value={formData.document}
              onChange={(doc) => setFormData({ ...formData, document: doc })}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={5}
              helperText="Upload your marksheet or degree certificate (PDF, JPG, PNG - Max 5MB)"
              required
            />
            {!formData.document && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <AlertCircle size={12} />
                Document upload is required for verification
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!formData.examination || !formData.boardUniversity || !formData.yearOfPassing || !formData.subject}
        >
          {isEditing ? 'Update' : 'Add'} Qualification
        </Button>
      </div>
    </Modal>
  );
}

// Step Indicator Component
function StepIndicator({ steps, currentStep, completionStatus }) {
  return (
    <div className="flex items-center justify-center gap-0 bg-white rounded-xl p-4 shadow-sm border">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === index;
        const isCompleted = completionStatus[index];
        const isPast = currentStep > index;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110'
                    : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
              >
                {isCompleted && !isActive ? <Check size={20} /> : <Icon size={20} />}
              </div>
              <span
                className={`text-xs font-medium mt-2 ${isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                  }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-20 h-1 mx-2 rounded transition-colors ${isPast || isCompleted ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function PartAPage() {
  const { user } = useAuth();
  const { getCurrentAppraisal, getFullAppraisalData, savePartABasic, savePartAQualifications, savePartAExperience } = useAppraisal();

  const appraisal = user ? getCurrentAppraisal(user.id) : null;
  const fullData = appraisal ? getFullAppraisalData(appraisal.id) : null;
  const isReadOnly = appraisal?.status !== 'DRAFT';

  // Step state
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
  const [errors, setErrors] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load data on mount - only run once when appraisal ID is available
  useEffect(() => {
    if (fullData && !dataLoaded) {
      if (fullData.partA?.basic) {
        setBasicDetails(prev => ({ ...prev, ...fullData.partA.basic }));
      }
      if (fullData.partA?.qualifications?.length > 0) {
        setQualifications(fullData.partA.qualifications);
      }
      if (fullData.partA?.experience) {
        setExperience(prev => ({ ...prev, ...fullData.partA.experience }));
      }
      setDataLoaded(true);
    }
  }, [fullData, dataLoaded]);

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

  // Step validation
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!basicDetails.fullName?.trim()) newErrors.fullName = 'Full name is required';
      if (!basicDetails.employeeNo?.trim()) newErrors.employeeNo = 'Employee number is required';
      if (!basicDetails.department?.trim()) newErrors.department = 'Department is required';
      if (!basicDetails.designation?.trim()) newErrors.designation = 'Designation is required';
      if (!basicDetails.email?.trim()) newErrors.email = 'Email is required';
      if (!basicDetails.mobile?.trim()) newErrors.mobile = 'Mobile number is required';
    } else if (step === 1) {
      if (qualifications.length === 0) {
        newErrors.qualifications = 'At least one qualification is required';
      } else {
        const missingDocs = qualifications.filter(q => !q.document).length;
        if (missingDocs > 0) {
          newErrors.qualifications = `${missingDocs} qualification(s) missing certificate upload`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save current step
  const saveCurrentStep = async () => {
    if (!appraisal) return true;

    try {
      if (currentStep === 0) {
        savePartABasic(appraisal.id, basicDetails);
      } else if (currentStep === 1) {
        savePartAQualifications(appraisal.id, qualifications);
      } else if (currentStep === 2) {
        savePartAExperience(appraisal.id, experience);
      }
      return true;
    } catch (error) {
      console.error('Failed to save:', error);
      return false;
    }
  };

  // Handle next step
  const handleNext = async () => {
    if (validateStep(currentStep)) {
      await saveCurrentStep();
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle final save
  const handleFinalSave = async () => {
    if (!validateStep(currentStep)) return;

    setSaving(true);
    try {
      savePartABasic(appraisal.id, basicDetails);
      savePartAQualifications(appraisal.id, qualifications);
      savePartAExperience(appraisal.id, experience);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  // Calculate completion for step indicator
  const basicComplete = basicDetails.fullName && basicDetails.employeeNo && basicDetails.department && basicDetails.designation && basicDetails.email && basicDetails.mobile;
  const qualificationsComplete = qualifications.length > 0 && qualifications.every(q => q.document);
  const experienceComplete = experience.specialization?.length > 0;

  const completionStatus = [basicComplete, qualificationsComplete, experienceComplete];
  const completedSections = completionStatus.filter(Boolean).length;
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

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} completionStatus={completionStatus} />

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
        </Card>

        {/* Step 0: Basic Details */}
        {currentStep === 0 && (
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

            {/* Profile Photo Upload */}
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
        )}

        {/* Step 1: Qualifications */}
        {currentStep === 1 && (
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
        )}

        {/* Step 2: Experience */}
        {currentStep === 2 && (
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

            {/* Experience Proof Upload */}
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
        )}

        {/* Bottom Navigation */}
        {!isReadOnly && (
          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border sticky bottom-4">
            <div>
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious} icon={ArrowLeft}>
                  Previous
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              Step {currentStep + 1} of {STEPS.length}
            </div>
            <div>
              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                  Save & Next
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Button onClick={handleFinalSave} loading={saving} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save size={16} className="mr-2" />
                  Save Part A
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Qualification Modal */}
        <QualificationFormModal
          isOpen={showQualificationModal}
          onClose={() => { setShowQualificationModal(false); setEditingQualification(null); }}
          onSave={handleQualificationSave}
          qualification={editingQualification}
          isEditing={!!editingQualification}
        />

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Part A Saved Successfully!"
          message="Your general information has been saved. You can now proceed to Part B for Research & Publications."
          buttonText="Continue"
          redirectUrl="/appraisal"
        />
      </div>
    </DashboardLayout>
  );
}
