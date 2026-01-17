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
import FileUpload from '@/components/ui/FileUpload';
import {
  Save,
  ArrowLeft,
  ArrowRight,
  User,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Edit,
  AlertCircle,
  FileText,
  Check,
  Upload,
} from 'lucide-react';
import Link from 'next/link';

// Examination options - Comprehensive list
const EXAM_OPTIONS = [
  { 
    group: 'Doctorate', 
    options: ['Ph.D.', 'D.Litt.', 'D.Sc.', 'D.Phil.', 'Ed.D.', 'D.Eng.'] 
  },
  { 
    group: 'Post Graduate - Engineering', 
    options: ['M.Tech', 'M.E.', 'M.S. (Engineering)'] 
  },
  { 
    group: 'Post Graduate - Management', 
    options: ['MBA', 'PGDM', 'MMS', 'M.Com.', 'MFM', 'MMM'] 
  },
  { 
    group: 'Post Graduate - Science & Arts', 
    options: ['M.Sc.', 'M.A.', 'MCA', 'M.Phil.', 'M.Ed.', 'M.Lib.Sc.'] 
  },
  { 
    group: 'Graduate - Engineering', 
    options: ['B.Tech', 'B.E.', 'B.Arch.'] 
  },
  { 
    group: 'Graduate - Management & Commerce', 
    options: ['BBA', 'BMS', 'B.Com.', 'BCA', 'BBM'] 
  },
  { 
    group: 'Graduate - Science & Arts', 
    options: ['B.Sc.', 'B.A.', 'B.Ed.', 'B.Lib.Sc.', 'BFA'] 
  },
  { 
    group: 'Diploma & Certificate', 
    options: ['Diploma (Engg.)', 'Diploma (Others)', 'PG Diploma', 'Certificate Course'] 
  },
  { 
    group: 'Professional Certifications', 
    options: ['NET/SET', 'GATE', 'UGC-CSIR NET', 'SLET', 'Other Professional Cert.'] 
  },
  { 
    group: 'School Education', 
    options: ['HSC / 12th', 'SSC / 10th'] 
  },
];

// Department options - Comprehensive list
const DEPARTMENT_OPTIONS = [
  { 
    group: 'Engineering', 
    options: [
      'Computer Engineering',
      'Computer Science & Engineering',
      'Information Technology',
      'Electronics & Telecommunication',
      'Electronics Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
      'Instrumentation Engineering',
      'Biomedical Engineering',
      'Automobile Engineering',
      'Production Engineering',
      'Textile Engineering',
    ] 
  },
  { 
    group: 'Science', 
    options: [
      'Physics',
      'Chemistry',
      'Mathematics',
      'Statistics',
      'Biotechnology',
      'Microbiology',
      'Biochemistry',
      'Environmental Science',
      'Life Sciences',
    ] 
  },
  { 
    group: 'Management & Commerce', 
    options: [
      'Management Studies',
      'Commerce',
      'Business Administration',
      'Finance',
      'Marketing',
      'Human Resources',
      'Operations Management',
    ] 
  },
  { 
    group: 'Humanities & Social Sciences', 
    options: [
      'Humanities',
      'English',
      'Economics',
      'Psychology',
      'Sociology',
      'Political Science',
      'History',
      'Geography',
      'Philosophy',
    ] 
  },
  { 
    group: 'Others', 
    options: [
      'Library Science',
      'Physical Education',
      'Education',
      'Law',
      'Architecture',
      'Pharmacy',
      'Other',
    ] 
  },
];

// Simple Step Indicator
function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = index < currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isActive
                ? 'bg-emerald-600 text-white'
                : isComplete
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-400'
              }`}>
              <span className="w-5 h-5 flex items-center justify-center rounded-full text-xs bg-white/20">
                {isComplete ? <Check size={12} /> : index + 1}
              </span>
              <span className="hidden sm:inline">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${isComplete ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Qualification Card
function QualificationCard({ qualification, onEdit, onDelete, onDocUpload, disabled }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
        <GraduationCap size={18} className="text-purple-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium text-slate-800">{qualification.examination}</h4>
            <p className="text-sm text-slate-500">{qualification.subject} • {qualification.boardUniversity}</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded shrink-0">
            {qualification.yearOfPassing}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          {qualification.percentage && (
            <span className="text-xs text-slate-500">{qualification.percentage}%</span>
          )}
          {qualification.grade && (
            <span className="text-xs text-slate-500">{qualification.grade}</span>
          )}
          {qualification.document ? (
            <span className="text-xs text-emerald-600 flex items-center gap-1">
              <Check size={12} /> Certificate uploaded
            </span>
          ) : (
            <button
              onClick={() => onDocUpload(qualification.id)}
              className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1"
              disabled={disabled}
            >
              <Upload size={12} /> Upload certificate
            </button>
          )}
        </div>
      </div>
      {!disabled && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(qualification)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(qualification.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// Add/Edit Qualification Modal
function QualificationModal({ isOpen, onClose, onSave, qualification }) {
  const [form, setForm] = useState({
    examination: '',
    subject: '',
    boardUniversity: '',
    yearOfPassing: '',
    percentage: '',
    grade: '',
    document: null,
  });

  useEffect(() => {
    if (qualification) {
      setForm(qualification);
    } else {
      setForm({
        examination: '',
        subject: '',
        boardUniversity: '',
        yearOfPassing: '',
        percentage: '',
        grade: '',
        document: null,
      });
    }
  }, [qualification, isOpen]);

  const handleSave = () => {
    if (!form.examination || !form.subject || !form.boardUniversity || !form.yearOfPassing) return;

    onSave({
      ...form,
      id: qualification?.id || Date.now(),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={qualification ? 'Edit Qualification' : 'Add Qualification'}>
      <div className="space-y-4">
        <Select
          label="Examination"
          value={form.examination}
          onChange={(e) => setForm({ ...form, examination: e.target.value })}
          required
        >
          <option value="">Select examination</option>
          {EXAM_OPTIONS.map(group => (
            <optgroup key={group.group} label={group.group}>
              {group.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </optgroup>
          ))}
        </Select>

        <Input
          label="Subject / Specialization"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="e.g., Computer Science"
          required
        />

        <Input
          label="Board / University"
          value={form.boardUniversity}
          onChange={(e) => setForm({ ...form, boardUniversity: e.target.value })}
          placeholder="e.g., Mumbai University"
          required
        />

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Year of Passing"
            value={form.yearOfPassing}
            onChange={(e) => setForm({ ...form, yearOfPassing: e.target.value })}
            placeholder="e.g., 2020"
            required
          />
          <Input
            label="Percentage"
            value={form.percentage}
            onChange={(e) => setForm({ ...form, percentage: e.target.value })}
            placeholder="e.g., 75"
          />
          <Input
            label="Grade"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            placeholder="e.g., First Class"
          />
        </div>

        {/* Document Upload */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Certificate / Marksheet
          </label>
          <FileUpload
            value={form.document}
            onChange={(doc) => setForm({ ...form, document: doc })}
            accept=".pdf,.jpg,.jpeg,.png"
            helperText="Upload degree certificate or marksheet (PDF, JPG, PNG - max 5MB)"
            maxSize={5}
          />
          {form.document && (
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <Check size={12} /> Document uploaded
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}

// Document Upload Modal
function DocUploadModal({ isOpen, onClose, onSave, qualificationId }) {
  const [file, setFile] = useState(null);

  const handleSave = () => {
    if (file) {
      onSave(qualificationId, file);
      onClose();
      setFile(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Certificate">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Upload your degree certificate or marksheet for verification.
        </p>
        <FileUpload
          value={file}
          onChange={setFile}
          accept=".pdf,.jpg,.jpeg,.png"
          helperText="PDF, JPG, PNG (max 5MB)"
          maxSize={5}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!file}>Upload</Button>
        </div>
      </div>
    </Modal>
  );
}

// Step definitions
const STEPS = [
  { id: 'basic', title: 'Personal Details', icon: User },
  { id: 'qualifications', title: 'Qualifications', icon: GraduationCap },
  { id: 'experience', title: 'Experience', icon: Briefcase },
];

export default function PartAPage() {
  const { user } = useAuth();
  const { getCurrentAppraisal, getFullAppraisalData, savePartABasic, savePartAQualifications, savePartAExperience } = useAppraisal();

  const appraisal = user ? getCurrentAppraisal(user.id) : null;
  const fullData = appraisal ? getFullAppraisalData(appraisal.id) : null;
  const isReadOnly = appraisal?.status !== 'DRAFT';

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  // Basic Details
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

  // Qualifications
  const [qualifications, setQualifications] = useState([]);
  const [showQualModal, setShowQualModal] = useState(false);
  const [editingQual, setEditingQual] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [uploadingDocFor, setUploadingDocFor] = useState(null);

  // Experience
  const [experience, setExperience] = useState({
    teachingExpUg: '',
    teachingExpPg: '',
    industryExperience: '',
    nonTeachingExperience: '',
    siesExperience: '',
    specialization: '',
    experienceProof: null,
  });

  // Load data from context
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

  // Handlers
  const updateBasic = (field, value) => setBasicDetails(prev => ({ ...prev, [field]: value }));
  const updateExp = (field, value) => setExperience(prev => ({ ...prev, [field]: value }));

  const handleEditQual = (qual) => {
    setEditingQual(qual);
    setShowQualModal(true);
  };

  const handleDeleteQual = (id) => {
    if (confirm('Delete this qualification?')) {
      setQualifications(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleSaveQual = (qual) => {
    if (editingQual) {
      setQualifications(prev => prev.map(q => q.id === editingQual.id ? qual : q));
    } else {
      setQualifications(prev => [...prev, qual]);
    }
    setEditingQual(null);
  };

  const handleDocUpload = (id) => {
    setUploadingDocFor(id);
    setShowDocModal(true);
  };

  const handleDocSave = (qualId, doc) => {
    setQualifications(prev => prev.map(q => q.id === qualId ? { ...q, document: doc } : q));
  };

  // Validation
  const validateStep = (step) => {
    const errs = {};
    if (step === 0) {
      if (!basicDetails.fullName?.trim()) errs.fullName = 'Required';
      if (!basicDetails.employeeNo?.trim()) errs.employeeNo = 'Required';
      if (!basicDetails.department?.trim()) errs.department = 'Required';
      if (!basicDetails.designation?.trim()) errs.designation = 'Required';
      if (!basicDetails.email?.trim()) errs.email = 'Required';
      if (!basicDetails.mobile?.trim()) errs.mobile = 'Required';
    } else if (step === 1) {
      if (qualifications.length === 0) {
        errs.qualifications = 'Add at least one qualification';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save step
  const saveStep = () => {
    if (!appraisal) return;
    if (currentStep === 0) savePartABasic(appraisal.id, basicDetails);
    else if (currentStep === 1) savePartAQualifications(appraisal.id, qualifications);
    else if (currentStep === 2) savePartAExperience(appraisal.id, experience);
  };

  // Navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      saveStep();
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSave = async () => {
    if (!validateStep(currentStep)) return;
    setSaving(true);
    try {
      savePartABasic(appraisal.id, basicDetails);
      savePartAQualifications(appraisal.id, qualifications);
      savePartAExperience(appraisal.id, experience);
      setShowSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <Header title="Part A - General Information" subtitle="Personal details, qualifications & experience" />

      <div className="p-6 max-w-4xl mx-auto">
        {/* Back link */}
        <Link href="/appraisal" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 text-sm mb-6">
          <ArrowLeft size={16} />
          Back to Overview
        </Link>

        {isReadOnly && (
          <Alert variant="info" className="mb-4">
            This appraisal has been submitted and is now read-only.
          </Alert>
        )}

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Step 0: Personal Details */}
        {currentStep === 0 && (
          <div className="bg-white rounded-xl border p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <User size={20} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Personal Details</h3>
                <p className="text-sm text-slate-500">Fill in your basic information</p>
              </div>
            </div>

            {/* Required Fields */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Required Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Employee Number"
                  value={basicDetails.employeeNo}
                  onChange={(e) => updateBasic('employeeNo', e.target.value)}
                  placeholder="EMP001"
                  disabled={isReadOnly}
                  error={errors.employeeNo}
                />
                <Input
                  label="Full Name"
                  value={basicDetails.fullName}
                  onChange={(e) => updateBasic('fullName', e.target.value)}
                  placeholder="Dr. John Doe"
                  disabled={isReadOnly}
                  error={errors.fullName}
                />
                <Select
                  label="Designation"
                  value={basicDetails.designation}
                  onChange={(e) => updateBasic('designation', e.target.value)}
                  disabled={isReadOnly}
                  error={errors.designation}
                >
                  <option value="">Select</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                </Select>
                <Select
                  label="Department"
                  value={basicDetails.department}
                  onChange={(e) => updateBasic('department', e.target.value)}
                  disabled={isReadOnly}
                  error={errors.department}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENT_OPTIONS.map(group => (
                    <optgroup key={group.group} label={group.group}>
                      {group.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </optgroup>
                  ))}
                </Select>
                <Input
                  label="Mobile"
                  value={basicDetails.mobile}
                  onChange={(e) => updateBasic('mobile', e.target.value)}
                  placeholder="9876543210"
                  disabled={isReadOnly}
                  error={errors.mobile}
                />
                <Input
                  label="Email"
                  type="email"
                  value={basicDetails.email}
                  onChange={(e) => updateBasic('email', e.target.value)}
                  placeholder="name@sies.edu.in"
                  disabled={isReadOnly}
                  error={errors.email}
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  value={basicDetails.dateOfBirth}
                  onChange={(e) => updateBasic('dateOfBirth', e.target.value)}
                  disabled={isReadOnly}
                />
                <Input
                  label="Date of Joining"
                  type="date"
                  value={basicDetails.dateOfJoining}
                  onChange={(e) => updateBasic('dateOfJoining', e.target.value)}
                  disabled={isReadOnly}
                />
                <Input
                  label="Location"
                  value={basicDetails.location}
                  onChange={(e) => updateBasic('location', e.target.value)}
                  placeholder="Mumbai"
                  disabled={isReadOnly}
                />
                <Input
                  label="Current Band"
                  value={basicDetails.currentBand}
                  onChange={(e) => updateBasic('currentBand', e.target.value)}
                  placeholder="Band 4"
                  disabled={isReadOnly}
                />
                <Input
                  label="Academic Level (CAS)"
                  value={basicDetails.academicLevelCas}
                  onChange={(e) => updateBasic('academicLevelCas', e.target.value)}
                  placeholder="Level 12"
                  disabled={isReadOnly}
                />
                <Input
                  label="Promotion Eligibility"
                  type="date"
                  value={basicDetails.promotionEligibilityDate}
                  onChange={(e) => updateBasic('promotionEligibilityDate', e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            {/* Address */}
            <Textarea
              label="Address with PIN Code"
              value={basicDetails.address}
              onChange={(e) => updateBasic('address', e.target.value)}
              placeholder="Complete address including PIN code"
              rows={2}
              disabled={isReadOnly}
            />
          </div>
        )}

        {/* Step 1: Qualifications */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <GraduationCap size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Academic Qualifications</h3>
                  <p className="text-sm text-slate-500">Add your degrees and certifications</p>
                </div>
              </div>
              {!isReadOnly && (
                <Button size="sm" onClick={() => { setEditingQual(null); setShowQualModal(true); }}>
                  <Plus size={16} className="mr-1" /> Add
                </Button>
              )}
            </div>

            {errors.qualifications && (
              <Alert variant="error" className="py-2!">
                <AlertCircle size={16} className="mr-2" />
                {errors.qualifications}
              </Alert>
            )}

            {qualifications.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <GraduationCap size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 mb-1">No qualifications added yet</p>
                <p className="text-sm text-slate-400 mb-4">Click "Add" to add your academic qualifications</p>
                {!isReadOnly && (
                  <Button size="sm" variant="outline" onClick={() => setShowQualModal(true)}>
                    <Plus size={16} className="mr-1" /> Add Qualification
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {qualifications.map(qual => (
                  <QualificationCard
                    key={qual.id}
                    qualification={qual}
                    onEdit={handleEditQual}
                    onDelete={handleDeleteQual}
                    onDocUpload={handleDocUpload}
                    disabled={isReadOnly}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Experience */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl border p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Briefcase size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Experience Details</h3>
                <p className="text-sm text-slate-500">Your teaching and industry experience</p>
              </div>
            </div>

            {/* Teaching Experience */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Teaching Experience (Years)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Undergraduate (UG)"
                  type="number"
                  step="0.5"
                  min="0"
                  value={experience.teachingExpUg}
                  onChange={(e) => updateExp('teachingExpUg', e.target.value)}
                  placeholder="0"
                  disabled={isReadOnly}
                />
                <Input
                  label="Postgraduate (PG)"
                  type="number"
                  step="0.5"
                  min="0"
                  value={experience.teachingExpPg}
                  onChange={(e) => updateExp('teachingExpPg', e.target.value)}
                  placeholder="0"
                  disabled={isReadOnly}
                />
                <Input
                  label="Experience at SIES"
                  type="number"
                  step="0.5"
                  min="0"
                  value={experience.siesExperience}
                  onChange={(e) => updateExp('siesExperience', e.target.value)}
                  placeholder="0"
                  disabled={isReadOnly}
                />
              </div>
            </div>

            {/* Other Experience */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Other Experience (Years)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Industry Experience"
                  type="number"
                  step="0.5"
                  min="0"
                  value={experience.industryExperience}
                  onChange={(e) => updateExp('industryExperience', e.target.value)}
                  placeholder="0"
                  disabled={isReadOnly}
                />
                <Input
                  label="Non-Teaching Experience"
                  type="number"
                  step="0.5"
                  min="0"
                  value={experience.nonTeachingExperience}
                  onChange={(e) => updateExp('nonTeachingExperience', e.target.value)}
                  placeholder="0"
                  disabled={isReadOnly}
                />
              </div>
            </div>

            {/* Specialization */}
            <Textarea
              label="Fields of Specialization"
              value={experience.specialization}
              onChange={(e) => updateExp('specialization', e.target.value)}
              placeholder="Machine Learning, Artificial Intelligence, Data Science..."
              rows={2}
              disabled={isReadOnly}
              helperText="Enter your areas of expertise, separated by commas"
            />

            {/* Experience Certificate */}
            <div className="p-4 border rounded-lg bg-slate-50">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Experience Certificate (Optional)</span>
              </div>
              <FileUpload
                value={experience.experienceProof}
                onChange={(doc) => updateExp('experienceProof', doc)}
                disabled={isReadOnly}
                helperText="Upload experience certificate if applicable"
                maxSize={5}
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        {!isReadOnly && (
          <div className="flex items-center justify-between mt-6 p-4 bg-white rounded-xl border">
            <div>
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrev}>
                  <ArrowLeft size={16} className="mr-2" /> Previous
                </Button>
              )}
            </div>
            <span className="text-sm text-slate-400">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <div>
              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleNext}>
                  Continue <ArrowRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Button onClick={handleFinalSave} loading={saving} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save size={16} className="mr-2" /> Save Part A
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <QualificationModal
        isOpen={showQualModal}
        onClose={() => { setShowQualModal(false); setEditingQual(null); }}
        onSave={handleSaveQual}
        qualification={editingQual}
      />

      <DocUploadModal
        isOpen={showDocModal}
        onClose={() => { setShowDocModal(false); setUploadingDocFor(null); }}
        onSave={handleDocSave}
        qualificationId={uploadingDocFor}
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Part A Saved!"
        message="Your general information has been saved successfully."
        buttonText="Continue"
        redirectUrl="/appraisal"
      />
    </DashboardLayout>
  );
}
