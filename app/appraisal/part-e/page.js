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
        subtitle="Reflect on your achievements and set future goals"
      />

      <div className="p-6 space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link href="/appraisal" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors">
            <ArrowLeft size={18} />
            Back to Overview
          </Link>
        </div>

        {isReadOnly && (
          <Alert variant="info">
            This appraisal has been submitted and is read-only.
          </Alert>
        )}

        {/* Progress Summary */}
        <div className="bg-linear-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Section Completion</h3>
              <p className="text-sm text-slate-600">{completedSections} of {sections.length} sections completed</p>
            </div>
            <div className="flex gap-2">
              {sections.map((section, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${section.complete ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  title={section.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Self Summary */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText size={22} className="text-blue-600" />
              </div>
              <div>
                <Card.Title>Self Summary</Card.Title>
                <p className="text-sm text-slate-500">Summarize your key achievements and contributions</p>
              </div>
            </div>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${selfSummary.length >= 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {selfSummary.length >= 100 ? '✓ Complete' : `${selfSummary.length}/100 chars`}
            </span>
          </Card.Header>

          <Textarea
            value={selfSummary}
            onChange={(e) => setSelfSummary(e.target.value)}
            disabled={isReadOnly}
            rows={6}
            placeholder="Write about your key achievements, contributions, challenges overcome, and learning experiences during this appraisal period..."
          />
        </Card>

        {/* Goals */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Target size={22} className="text-purple-600" />
              </div>
              <div>
                <Card.Title>Goals for Next Period</Card.Title>
                <p className="text-sm text-slate-500">Set clear, achievable goals</p>
              </div>
            </div>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${goals.length >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {goals.length >= 50 ? '✓ Complete' : `${goals.length}/50 chars`}
            </span>
          </Card.Header>

          <Textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            disabled={isReadOnly}
            rows={5}
            placeholder="List your goals for the upcoming period. Consider goals for teaching, research, publications, professional development, etc..."
          />
        </Card>

        {/* Two Column: Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-600" />
                <Card.Title>Your Strengths</Card.Title>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${strengths.length >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {strengths.length >= 50 ? '✓' : `${strengths.length}/50`}
              </span>
            </Card.Header>
            <Textarea
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              disabled={isReadOnly}
              rows={4}
              placeholder="List your key strengths and competencies..."
            />
          </Card>

          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-600" />
                <Card.Title>Areas to Improve</Card.Title>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${areasForImprovement.length >= 30 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {areasForImprovement.length >= 30 ? '✓' : `${areasForImprovement.length}/30`}
              </span>
            </Card.Header>
            <Textarea
              value={areasForImprovement}
              onChange={(e) => setAreasForImprovement(e.target.value)}
              disabled={isReadOnly}
              rows={4}
              placeholder="Identify areas where you can improve..."
            />
          </Card>
        </div>

        {/* Training Needs */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Lightbulb size={22} className="text-orange-600" />
              </div>
              <div>
                <Card.Title>Training Needs</Card.Title>
                <p className="text-sm text-slate-500">What training or development do you need?</p>
              </div>
            </div>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${trainingNeeds.length >= 20 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {trainingNeeds.length >= 20 ? '✓ Complete' : `${trainingNeeds.length}/20 chars`}
            </span>
          </Card.Header>

          <Textarea
            value={trainingNeeds}
            onChange={(e) => setTrainingNeeds(e.target.value)}
            disabled={isReadOnly}
            rows={3}
            placeholder="List any training programs, workshops, or skill development you need..."
          />
        </Card>

        {/* Supporting Documents */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-100 rounded-xl">
                <Paperclip size={22} className="text-slate-600" />
              </div>
              <div>
                <Card.Title>Supporting Documents</Card.Title>
                <p className="text-sm text-slate-500">Optional - Upload any relevant documents</p>
              </div>
            </div>
            {supportingDocuments.length > 0 && (
              <span className="text-sm text-emerald-600 font-medium">
                {supportingDocuments.length} file(s)
              </span>
            )}
          </Card.Header>

          <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
            <MultiFileUpload
              value={supportingDocuments}
              onChange={setSupportingDocuments}
              disabled={isReadOnly}
              maxFiles={5}
              maxSize={10}
              helperText="Upload appreciation letters, certificates, or other supporting documents (max 5 files)"
            />
          </div>
        </Card>

        {/* Save Button */}
        {!isReadOnly && (
          <div className="flex items-center justify-center p-4 bg-white rounded-xl shadow-lg border sticky bottom-4">
            <Button onClick={handleSave} loading={saving} icon={Save} className="bg-emerald-600 hover:bg-emerald-700 px-8">
              Save Part E
            </Button>
          </div>
        )}

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Part E Saved!"
          message="Your self-assessment has been saved. You can now review and submit your complete appraisal."
          buttonText="Continue"
          redirectUrl="/appraisal"
        />
      </div>
    </DashboardLayout>
  );
}
