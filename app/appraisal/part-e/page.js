'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Alert from '@/components/ui/Alert';
import ProgressBar from '@/components/ui/ProgressBar';
import { SuccessModal } from '@/components/ui/Modal';
import { MultiFileUpload } from '@/components/ui/FileUpload';
import {
  Save,
  ArrowLeft,
  CheckCircle,
  FileText,
  Target,
  Lightbulb,
  CheckSquare,
  AlertCircle,
  Paperclip,
  Upload,
} from 'lucide-react';
import Link from 'next/link';

const guidelines = [
  {
    icon: CheckSquare,
    title: 'Be Specific',
    description: 'Provide concrete examples and measurable achievements',
  },
  {
    icon: Target,
    title: 'Align with Goals',
    description: 'Connect your activities to departmental and institutional objectives',
  },
  {
    icon: Lightbulb,
    title: 'Highlight Impact',
    description: 'Emphasize the positive outcomes of your contributions',
  },
];

const promptQuestions = [
  'What were your most significant achievements this appraisal period?',
  'How did you contribute to student success and learning outcomes?',
  'What challenges did you face and how did you overcome them?',
  'How did you develop professionally during this period?',
  'What feedback did you receive and how did you act on it?',
];

const goalCategories = [
  'Teaching & Learning',
  'Research & Publications',
  'Professional Development',
  'Administrative Contributions',
  'Student Mentorship',
];

export default function PartEPage() {
  const { user } = useAuth();
  const { getCurrentAppraisal, getFullAppraisalData, savePartE, recalculateTotals } = useAppraisal();

  const appraisal = user ? getCurrentAppraisal(user.id) : null;
  const fullData = appraisal ? getFullAppraisalData(appraisal.id) : null;
  const isReadOnly = appraisal?.status !== 'DRAFT';

  const [selfSummary, setSelfSummary] = useState(fullData?.partE?.selfSummary || '');
  const [goals, setGoals] = useState(fullData?.partE?.goals || '');
  const [strengths, setStrengths] = useState(fullData?.partE?.strengths || '');
  const [areasForImprovement, setAreasForImprovement] = useState(fullData?.partE?.areasForImprovement || '');
  const [trainingNeeds, setTrainingNeeds] = useState(fullData?.partE?.trainingNeeds || '');
  const [supportingDocuments, setSupportingDocuments] = useState(fullData?.partE?.supportingDocuments || []);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Sample data for prototype
  const loadSampleData = () => {
    setSelfSummary('During this appraisal period, I have made significant contributions in teaching, research, and administrative duties. I successfully developed and delivered new course content for Machine Learning and Deep Learning courses, achieving an average student feedback score of 4.2/5. My research efforts resulted in 2 journal publications and 1 conference paper. I also contributed to curriculum development as a member of the Board of Studies.');
    setGoals('1. Publish 3 research papers in high-impact journals\n2. Complete online certification in Advanced AI/ML\n3. Develop industry partnerships for student internships\n4. Mentor at least 5 students for research projects\n5. Organize a national-level technical symposium');
    setStrengths('Strong technical knowledge in AI/ML domain. Good communication and presentation skills. Ability to mentor students effectively. Proactive approach to adopting new teaching methodologies. Collaborative attitude with colleagues.');
    setAreasForImprovement('Need to improve time management for balancing teaching and research. Should focus more on industry-academia collaboration. Can improve documentation practices.');
    setTrainingNeeds('Advanced Machine Learning workshops, Research methodology training, Leadership and management skills development, Grant writing workshop');
  };

  // Load data - only run once when appraisal data is available
  useEffect(() => {
    if (fullData?.partE && !dataLoaded) {
      setSelfSummary(fullData.partE.selfSummary || '');
      setGoals(fullData.partE.goals || '');
      setStrengths(fullData.partE.strengths || '');
      setAreasForImprovement(fullData.partE.areasForImprovement || '');
      setTrainingNeeds(fullData.partE.trainingNeeds || '');
      setSupportingDocuments(fullData.partE.supportingDocuments || []);
      setDataLoaded(true);
    }
  }, [fullData, dataLoaded]);

  const handleSave = async () => {
    if (!appraisal) return;

    setSaving(true);
    try {
      savePartE(appraisal.id, {
        selfSummary,
        goals,
        strengths,
        areasForImprovement,
        trainingNeeds,
        supportingDocuments,
      });
      recalculateTotals(appraisal.id);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  // Calculate completion
  const sections = [
    { name: 'Self Summary', complete: selfSummary.length >= 100 },
    { name: 'Goals', complete: goals.length >= 50 },
    { name: 'Strengths', complete: strengths.length >= 50 },
    { name: 'Areas for Improvement', complete: areasForImprovement.length >= 30 },
    { name: 'Training Needs', complete: trainingNeeds.length >= 20 },
  ];
  const completedSections = sections.filter(s => s.complete).length;
  const completionPercentage = Math.round((completedSections / sections.length) * 100);

  return (
    <DashboardLayout>
      <Header
        title="Part E - Self Assessment"
        subtitle="Reflective summary of your performance and future goals"
      />

      <div className="p-6 space-y-6">
        {/* Back Link & Save */}
        <div className="flex items-center justify-between">
          <Link href="/appraisal" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft size={16} />
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
            This appraisal has been submitted and is read-only.
          </Alert>
        )}

        {/* Progress Card */}
        <Card className="bg-linear-to-r from-teal-50 to-cyan-50 border-teal-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Completion Progress</h3>
              <p className="text-sm text-slate-600">
                {completedSections} of {sections.length} sections completed
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-teal-600">
                {completionPercentage}%
              </p>
            </div>
          </div>
          <ProgressBar
            value={completionPercentage}
            max={100}
            showLabel={false}
            color="teal"
          />
          <div className="grid grid-cols-5 gap-2 mt-4">
            {sections.map((section, i) => (
              <div
                key={i}
                className={`text-center p-2 rounded-lg ${section.complete ? 'bg-teal-100 text-teal-700' : 'bg-white text-slate-500'
                  }`}
              >
                <CheckCircle
                  size={16}
                  className={`mx-auto mb-1 ${section.complete ? 'text-teal-600' : 'text-slate-300'}`}
                />
                <p className="text-xs font-medium">{section.name}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guidelines.map((guide, i) => (
            <Card key={i} className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <guide.icon size={20} className="text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">{guide.title}</h4>
                <p className="text-sm text-slate-500">{guide.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Self Summary */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <Card.Title>Self Summary</Card.Title>
                <p className="text-sm text-slate-500 mt-0.5">
                  Comprehensive summary of your performance during this appraisal period
                </p>
              </div>
            </div>
            <span className={`text-sm font-medium ${selfSummary.length >= 100 ? 'text-emerald-600' : 'text-slate-400'}`}>
              {selfSummary.length} / 100+ characters
            </span>
          </Card.Header>

          <div className="mb-4 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm font-medium text-slate-700 mb-2">Consider addressing:</p>
            <ul className="space-y-1">
              {promptQuestions.map((q, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>

          <Textarea
            value={selfSummary}
            onChange={(e) => setSelfSummary(e.target.value)}
            disabled={isReadOnly}
            rows={8}
            placeholder="Write a comprehensive summary of your achievements, contributions, and experiences during this appraisal period..."
          />
        </Card>

        {/* Goals */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target size={20} className="text-purple-600" />
              </div>
              <div>
                <Card.Title>Goals for Next Period</Card.Title>
                <p className="text-sm text-slate-500 mt-0.5">
                  Set SMART goals for the upcoming appraisal period
                </p>
              </div>
            </div>
            <span className={`text-sm font-medium ${goals.length >= 50 ? 'text-emerald-600' : 'text-slate-400'}`}>
              {goals.length} / 50+ characters
            </span>
          </Card.Header>

          <div className="mb-4 flex flex-wrap gap-2">
            {goalCategories.map((cat, i) => (
              <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                {cat}
              </span>
            ))}
          </div>

          <Textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            disabled={isReadOnly}
            rows={6}
            placeholder="List your goals for the next appraisal period. Use SMART criteria: Specific, Measurable, Achievable, Relevant, Time-bound..."
          />
        </Card>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-600" />
                <Card.Title>Strengths</Card.Title>
              </div>
              <span className={`text-sm ${strengths.length >= 50 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {strengths.length}/50+
              </span>
            </Card.Header>
            <Textarea
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              disabled={isReadOnly}
              rows={5}
              placeholder="List your key strengths and competencies..."
            />
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-600" />
                <Card.Title>Areas for Improvement</Card.Title>
              </div>
              <span className={`text-sm ${areasForImprovement.length >= 30 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {areasForImprovement.length}/30+
              </span>
            </Card.Header>
            <Textarea
              value={areasForImprovement}
              onChange={(e) => setAreasForImprovement(e.target.value)}
              disabled={isReadOnly}
              rows={5}
              placeholder="Identify areas where you can improve..."
            />
          </Card>
        </div>

        {/* Training Needs */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Lightbulb size={20} className="text-orange-600" />
              </div>
              <div>
                <Card.Title>Training & Development Needs</Card.Title>
                <p className="text-sm text-slate-500 mt-0.5">
                  Identify training programs, certifications, or skill development needed
                </p>
              </div>
            </div>
            <span className={`text-sm font-medium ${trainingNeeds.length >= 20 ? 'text-emerald-600' : 'text-slate-400'}`}>
              {trainingNeeds.length} / 20+ characters
            </span>
          </Card.Header>

          <Textarea
            value={trainingNeeds}
            onChange={(e) => setTrainingNeeds(e.target.value)}
            disabled={isReadOnly}
            rows={4}
            placeholder="List any training programs, workshops, certifications, or skill development initiatives you need..."
          />
        </Card>

        {/* Supporting Documents (Optional) */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Paperclip size={20} className="text-slate-600" />
              </div>
              <div>
                <Card.Title>Supporting Documents (Optional)</Card.Title>
                <p className="text-sm text-slate-500 mt-0.5">
                  Upload any additional documents that support your self-assessment
                </p>
              </div>
            </div>
            {supportingDocuments.length > 0 && (
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <Upload size={14} />
                {supportingDocuments.length} file(s) uploaded
              </span>
            )}
          </Card.Header>

          <div className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50">
            <MultiFileUpload
              value={supportingDocuments}
              onChange={setSupportingDocuments}
              disabled={isReadOnly}
              maxFiles={5}
              maxSize={10}
              helperText="Upload any relevant documents such as appreciation letters, performance reports, or achievement certificates (max 5 files, 10MB each)"
            />
          </div>
        </Card>

        {/* Completion Warning */}
        {completionPercentage < 100 && !isReadOnly && (
          <Alert variant="warning" icon={AlertCircle}>
            Please complete all sections before submitting your appraisal.
            Minimum character counts are indicated for each section.
          </Alert>
        )}

        {completionPercentage === 100 && !isReadOnly && (
          <Alert variant="success" icon={CheckCircle}>
            Great job! All sections of Part E are complete. Don&apos;t forget to save your changes.
          </Alert>
        )}

        {/* Bottom Navigation */}
        {!isReadOnly && (
          <div className="flex items-center justify-center p-4 bg-white rounded-xl shadow-lg border sticky bottom-4">
            <Button onClick={handleSave} loading={saving} className="bg-emerald-600 hover:bg-emerald-700 px-8">
              <Save size={16} className="mr-2" />
              Save Part E
            </Button>
          </div>
        )}

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Part E Saved Successfully!"
          message="Your self-assessment has been saved. All parts are now complete! You can review and submit your appraisal from the overview page."
          buttonText="Continue"
          redirectUrl="/appraisal"
        />
      </div>
    </DashboardLayout>
  );
}
