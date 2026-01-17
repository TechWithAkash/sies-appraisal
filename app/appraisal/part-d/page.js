'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import ProgressBar from '@/components/ui/ProgressBar';
import { SuccessModal } from '@/components/ui/Modal';
import {
    Save,
    ArrowLeft,
    CheckCircle,
    Shield,
    Clock,
    Users,
    Heart,
    Star,
    Award,
} from 'lucide-react';
import Link from 'next/link';
import { PART_D_VALUES, PART_D_TOTAL_MAX, calculatePartD } from '@/lib/calculations';

const valueIcons = {
    attendance: Clock,
    responsibility: Shield,
    honesty: Heart,
    teamwork: Users,
    inclusiveness: Star,
    conduct: Award,
};

const valueDescriptions = {
    attendance: 'Regular attendance and punctuality in all academic and administrative duties',
    responsibility: 'Taking ownership of assigned tasks and delivering quality outcomes',
    honesty: 'Maintaining academic and professional integrity in all activities',
    teamwork: 'Collaborating effectively with colleagues, students, and stakeholders',
    inclusiveness: 'Promoting diversity and creating an inclusive learning environment',
    conduct: 'Adhering to professional ethics and institutional code of conduct',
};

function ValueRating({ id, label, value, maxValue, onChange, disabled }) {
    const Icon = valueIcons[id] || Shield;
    const description = valueDescriptions[id] || '';

    const ratings = [
        { value: 1, label: 'Needs Work', color: 'bg-red-500' },
        { value: 2, label: 'Fair', color: 'bg-orange-500' },
        { value: 3, label: 'Good', color: 'bg-amber-500' },
        { value: 4, label: 'Very Good', color: 'bg-blue-500' },
        { value: maxValue, label: 'Excellent', color: 'bg-emerald-500' },
    ];

    return (
        <div className={`p-5 rounded-xl border-2 transition-all ${value === maxValue ? 'border-emerald-300 bg-emerald-50' : value > 0 ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${value > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Icon size={24} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-900 text-lg">{label}</h4>
                        <span className="text-xl font-bold text-emerald-600">
                            {value}<span className="text-sm font-normal text-slate-400">/{maxValue}</span>
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{description}</p>

                    <div className="flex flex-wrap gap-2">
                        {ratings.map((rating) => (
                            <button
                                key={rating.value}
                                onClick={() => !disabled && onChange(rating.value)}
                                disabled={disabled}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${value === rating.value
                                        ? `${rating.color} text-white shadow-md`
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                            >
                                {rating.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PartDPage() {
    const { user } = useAuth();
    const { getCurrentAppraisal, getFullAppraisalData, savePartD, recalculateTotals } = useAppraisal();

    const appraisal = user ? getCurrentAppraisal(user.id) : null;
    const fullData = appraisal ? getFullAppraisalData(appraisal.id) : null;
    const isReadOnly = appraisal?.status !== 'DRAFT';

    const [values, setValues] = useState({
        attendance: fullData?.partD?.attendance || 0,
        responsibility: fullData?.partD?.responsibility || 0,
        honesty: fullData?.partD?.honesty || 0,
        teamwork: fullData?.partD?.teamwork || 0,
        inclusiveness: fullData?.partD?.inclusiveness || 0,
        conduct: fullData?.partD?.conduct || 0,
    });

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if (fullData?.partD && !dataLoaded) {
            setValues({
                attendance: fullData.partD.attendance || 0,
                responsibility: fullData.partD.responsibility || 0,
                honesty: fullData.partD.honesty || 0,
                teamwork: fullData.partD.teamwork || 0,
                inclusiveness: fullData.partD.inclusiveness || 0,
                conduct: fullData.partD.conduct || 0,
            });
            setDataLoaded(true);
        }
    }, [fullData, dataLoaded]);

    const handleValueChange = (key, value) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!appraisal) return;

        setSaving(true);
        try {
            savePartD(appraisal.id, values);
            recalculateTotals(appraisal.id);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setSaving(false);
        }
    };

    // Calculate totals
    const calculation = calculatePartD(values);

    // Value labels for display
    const valueLabels = {
        attendance: 'Attendance & Punctuality',
        responsibility: 'Responsibility & Accountability',
        honesty: 'Honesty & Integrity',
        teamwork: 'Teamwork & Collaboration',
        inclusiveness: 'Inclusiveness & Diversity',
        conduct: 'Professional Conduct',
    };

    return (
        <DashboardLayout>
            <Header
                title="Part D - Values"
                subtitle="Self-assessment of professional values (Max 30 marks)"
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

                {/* Score Summary Card */}
                <Card className="bg-linear-to-r from-purple-50 to-pink-50 border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Your Total Score</h3>
                            <p className="text-sm text-slate-600">Rate yourself on each value below</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-bold text-purple-600">
                                {calculation.total}<span className="text-lg font-normal text-slate-400">/{PART_D_TOTAL_MAX}</span>
                            </p>
                        </div>
                    </div>
                    <ProgressBar
                        value={calculation.total}
                        max={PART_D_TOTAL_MAX}
                        showLabel={false}
                        className="mt-4"
                        color="purple"
                    />
                </Card>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Instructions:</strong> Click on the rating that best describes your performance for each value.
                        Be honest in your assessment - this will be reviewed by your HOD.
                    </p>
                </div>

                {/* Value Rating Cards */}
                <div className="space-y-4">
                    {Object.entries(PART_D_VALUES).map(([key, max]) => (
                        <ValueRating
                            key={key}
                            id={key}
                            label={valueLabels[key]}
                            value={values[key]}
                            maxValue={max}
                            onChange={(val) => handleValueChange(key, val)}
                            disabled={isReadOnly}
                        />
                    ))}
                </div>

                {/* Save Button */}
                {!isReadOnly && (
                    <div className="flex items-center justify-center p-4 bg-white rounded-xl shadow-lg border sticky bottom-4">
                        <Button onClick={handleSave} loading={saving} icon={Save} className="bg-emerald-600 hover:bg-emerald-700 px-8">
                            Save Part D
                        </Button>
                    </div>
                )}

                {/* Success Modal */}
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    title="Part D Saved Successfully!"
                    message="Your values and ethics assessment has been saved. You can now proceed to Part E for Self Assessment."
                    buttonText="Continue"
                    redirectUrl="/appraisal"
                />
            </div>
        </DashboardLayout>
    );
}
