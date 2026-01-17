'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import {
    User,
    BookOpen,
    Award,
    Heart,
    Target,
    ArrowLeft,
    FileText,
    Download,
    Eye,
    GraduationCap,
    Briefcase,
    Calendar,
    Mail,
    Phone,
    MapPin,
    Building,
    CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { formatFileSize, getFileIcon } from '@/components/ui/FileUpload';

// Section component for consistent styling
function Section({ title, icon: Icon, children }) {
    return (
        <Card className="mb-6">
            <Card.Header>
                <Card.Title className="flex items-center gap-2">
                    <Icon size={20} className="text-emerald-600" />
                    {title}
                </Card.Title>
            </Card.Header>
            {children}
        </Card>
    );
}

// Field display component
function Field({ label, value, className = "" }) {
    return (
        <div className={className}>
            <p className="text-xs text-slate-500 mb-0.5">{label}</p>
            <p className="text-sm font-medium text-slate-900">{value || '-'}</p>
        </div>
    );
}

// Document display component
function DocumentDisplay({ file, label }) {
    if (!file) return null;
    const FileIcon = getFileIcon(file.type);
    const previewUrl = file.base64 || file.url;

    return (
        <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
            <FileIcon size={16} className="text-emerald-600" />
            <span className="text-sm text-slate-700 truncate flex-1">{file.name}</span>
            <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
            {previewUrl && (
                <button
                    onClick={() => window.open(previewUrl, '_blank')}
                    className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                    title="View Document"
                >
                    <Eye size={14} />
                </button>
            )}
        </div>
    );
}

export default function ViewAppraisalPage() {
    const { user } = useAuth();
    const { getCurrentAppraisal, getFullAppraisalData } = useAppraisal();

    const appraisal = user ? getCurrentAppraisal(user.id) : null;
    const fullData = appraisal ? getFullAppraisalData(appraisal.id) : null;

    if (!fullData) {
        return (
            <DashboardLayout>
                <div className="flex h-full items-center justify-center">
                    <Card className="max-w-md text-center p-8">
                        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-900 mb-2">No Appraisal Found</h2>
                        <p className="text-slate-600 mb-4">You haven't started your appraisal yet.</p>
                        <Link href="/appraisal">
                            <Button>Go to Appraisal</Button>
                        </Link>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    const { partA, partB, partC, partD, partE } = fullData;

    return (
        <DashboardLayout>
            <Header
                title="View Submitted Appraisal"
                subtitle={`Academic Year ${fullData.cycle?.academicYear || ''}`}
            />

            <div className="p-6">
                {/* Back Button and Status */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/appraisal">
                        <Button variant="outline" icon={ArrowLeft}>
                            Back to Appraisal
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <StatusBadge status={appraisal?.status || 'DRAFT'} />
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Grand Total</p>
                            <p className="text-2xl font-bold text-emerald-600">{appraisal?.grandTotal || 0}/250</p>
                        </div>
                    </div>
                </div>

                {/* Part A - General Information */}
                <Section title="Part A - General Information" icon={User}>
                    {/* Basic Details */}
                    <div className="mb-6">
                        <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                            <User size={16} /> Basic Details
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                            <Field label="Employee No" value={partA?.basic?.employeeNo} />
                            <Field label="Full Name" value={partA?.basic?.fullName} />
                            <Field label="Designation" value={partA?.basic?.designation} />
                            <Field label="Department" value={partA?.basic?.department} />
                            <Field label="Date of Joining" value={partA?.basic?.dateOfJoining} />
                            <Field label="Date of Birth" value={partA?.basic?.dateOfBirth} />
                            <Field label="Current Band" value={partA?.basic?.currentBand} />
                            <Field label="Academic Level (CAS)" value={partA?.basic?.academicLevelCas} />
                            <Field label="Email" value={partA?.basic?.email} />
                            <Field label="Mobile" value={partA?.basic?.mobile} />
                            <Field label="Location" value={partA?.basic?.location} className="col-span-2" />
                        </div>
                        {partA?.basic?.profilePhoto && (
                            <div className="mt-3">
                                <p className="text-xs text-slate-500 mb-1">Profile Photo</p>
                                <DocumentDisplay file={partA.basic.profilePhoto} />
                            </div>
                        )}
                    </div>

                    {/* Qualifications */}
                    <div className="mb-6">
                        <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                            <GraduationCap size={16} /> Qualifications
                        </h4>
                        {partA?.qualifications?.length > 0 ? (
                            <div className="space-y-3">
                                {partA.qualifications.map((qual, idx) => (
                                    <div key={qual.id || idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                                            <Field label="Examination" value={qual.examination} />
                                            <Field label="Board/University" value={qual.boardUniversity} />
                                            <Field label="Year of Passing" value={qual.yearOfPassing} />
                                            <Field label="Percentage/Grade" value={qual.percentage || qual.grade} />
                                            <Field label="Subject" value={qual.subject} className="col-span-2" />
                                        </div>
                                        {qual.document && <DocumentDisplay file={qual.document} />}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm italic">No qualifications added</p>
                        )}
                    </div>

                    {/* Experience */}
                    <div>
                        <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                            <Briefcase size={16} /> Experience
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                            <Field label="Teaching Exp (UG)" value={partA?.experience?.teachingExpUg ? `${partA.experience.teachingExpUg} years` : null} />
                            <Field label="Teaching Exp (PG)" value={partA?.experience?.teachingExpPg ? `${partA.experience.teachingExpPg} years` : null} />
                            <Field label="Industry Experience" value={partA?.experience?.industryExperience ? `${partA.experience.industryExperience} years` : null} />
                            <Field label="SIES Experience" value={partA?.experience?.siesExperience ? `${partA.experience.siesExperience} years` : null} />
                            <Field label="Specialization" value={partA?.experience?.specialization} className="col-span-2" />
                        </div>
                        {partA?.experience?.experienceProof && (
                            <div className="mt-3">
                                <DocumentDisplay file={partA.experience.experienceProof} />
                            </div>
                        )}
                    </div>
                </Section>

                {/* Part B - Research & Academic Contributions */}
                <Section title={`Part B - Research & Academic Contributions (Score: ${appraisal?.totalPartB || 0}/120)`} icon={BookOpen}>
                    {[
                        { key: 'researchJournals', label: 'Research Journals', titleField: 'title' },
                        { key: 'booksChapters', label: 'Books & Chapters', titleField: 'title' },
                        { key: 'editedBooks', label: 'Edited Books', titleField: 'title' },
                        { key: 'researchProjects', label: 'Research Projects', titleField: 'projectTitle' },
                        { key: 'consultancy', label: 'Consultancy', titleField: 'organization' },
                        { key: 'developmentPrograms', label: 'FDPs/Workshops', titleField: 'programName' },
                        { key: 'seminars', label: 'Seminars/Conferences', titleField: 'title' },
                        { key: 'patents', label: 'Patents', titleField: 'title' },
                        { key: 'awards', label: 'Awards', titleField: 'awardName' },
                        { key: 'econtent', label: 'E-Content', titleField: 'title' },
                        { key: 'moocs', label: 'MOOCs', titleField: 'courseName' },
                        { key: 'guidance', label: 'Research Guidance', titleField: 'studentName' },
                    ].map(({ key, label, titleField }) => {
                        const items = partB?.[key] || [];
                        if (items.length === 0) return null;
                        return (
                            <div key={key} className="mb-4">
                                <h4 className="font-medium text-slate-700 mb-2">{label} ({items.length})</h4>
                                <div className="space-y-2">
                                    {items.map((item, idx) => (
                                        <div key={item.id || idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900">{item[titleField] || item.title || 'Untitled'}</p>
                                                {item.year && <p className="text-sm text-slate-500">Year: {item.year}</p>}
                                                {item.selfMarks && <p className="text-sm text-emerald-600">Self Marks: {item.selfMarks}</p>}
                                            </div>
                                            {item.document && <DocumentDisplay file={item.document} />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    {Object.values(partB || {}).every(arr => !arr || arr.length === 0) && (
                        <p className="text-slate-500 text-sm italic">No research contributions added</p>
                    )}
                </Section>

                {/* Part C - Academic/Administrative Contribution */}
                <Section title={`Part C - Academic/Administrative Contribution (Score: ${appraisal?.totalPartC || 0}/100)`} icon={Award}>
                    {/* Key Contribution */}
                    {partC?.keyContribution && (
                        <div className="mb-4">
                            <h4 className="font-medium text-slate-700 mb-2">Key Contribution</h4>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-slate-700">{partC.keyContribution.contribution}</p>
                                {partC.keyContribution.selfMarks && (
                                    <p className="text-sm text-emerald-600 mt-2">Self Marks: {partC.keyContribution.selfMarks}</p>
                                )}
                                {partC.keyContribution.document && (
                                    <div className="mt-2">
                                        <DocumentDisplay file={partC.keyContribution.document} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Committee Roles */}
                    {partC?.committeeRoles?.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-medium text-slate-700 mb-2">Committee Roles ({partC.committeeRoles.length})</h4>
                            <div className="space-y-2">
                                {partC.committeeRoles.map((role, idx) => (
                                    <div key={role.id || idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <p className="font-medium text-slate-900">{role.committeeName}</p>
                                        <p className="text-sm text-slate-600">{role.role} • {role.level}</p>
                                        {role.document && <DocumentDisplay file={role.document} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Professional Bodies */}
                    {partC?.professionalBodies?.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-medium text-slate-700 mb-2">Professional Bodies ({partC.professionalBodies.length})</h4>
                            <div className="space-y-2">
                                {partC.professionalBodies.map((body, idx) => (
                                    <div key={body.id || idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <p className="font-medium text-slate-900">{body.bodyName}</p>
                                        <p className="text-sm text-slate-600">{body.membershipType} • ID: {body.memberId}</p>
                                        {body.document && <DocumentDisplay file={body.document} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Student Feedback */}
                    {partC?.studentFeedback && (
                        <div className="mb-4">
                            <h4 className="font-medium text-slate-700 mb-2">Student Feedback</h4>
                            <div className="p-4 bg-slate-50 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Field label="Average Score" value={partC.studentFeedback.averageScore} />
                                <Field label="Total Responses" value={partC.studentFeedback.totalResponses} />
                                <Field label="Semester" value={partC.studentFeedback.semester} />
                                <Field label="Course" value={partC.studentFeedback.courseName} />
                            </div>
                            {partC.studentFeedback.feedbackReport && (
                                <div className="mt-2">
                                    <DocumentDisplay file={partC.studentFeedback.feedbackReport} />
                                </div>
                            )}
                        </div>
                    )}
                </Section>

                {/* Part D - Values */}
                <Section title={`Part D - Values (Score: ${appraisal?.totalPartD || 0}/30)`} icon={Heart}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { key: 'attendance', label: 'Attendance & Punctuality' },
                            { key: 'responsibility', label: 'Responsibility & Accountability' },
                            { key: 'honesty', label: 'Honesty & Integrity' },
                            { key: 'teamwork', label: 'Teamwork & Collaboration' },
                            { key: 'inclusiveness', label: 'Inclusiveness & Diversity' },
                            { key: 'conduct', label: 'Professional Conduct' },
                        ].map(({ key, label }) => (
                            <div key={key} className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-600 mb-1">{label}</p>
                                <p className="text-2xl font-bold text-emerald-600">{partD?.[key] || 0}<span className="text-sm font-normal text-slate-400">/5</span></p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Part E - Self Assessment */}
                <Section title="Part E - Self Assessment" icon={Target}>
                    <div className="space-y-4">
                        {[
                            { key: 'selfSummary', label: 'Self Summary' },
                            { key: 'goals', label: 'Goals for Next Period' },
                            { key: 'strengths', label: 'Strengths' },
                            { key: 'areasForImprovement', label: 'Areas for Improvement' },
                            { key: 'trainingNeeds', label: 'Training Needs' },
                        ].map(({ key, label }) => (
                            <div key={key} className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>
                                <p className="text-slate-600 whitespace-pre-wrap">{partE?.[key] || <span className="italic text-slate-400">Not provided</span>}</p>
                            </div>
                        ))}
                    </div>

                    {/* Supporting Documents */}
                    {partE?.supportingDocuments?.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-medium text-slate-700 mb-2">Supporting Documents</h4>
                            <div className="space-y-2">
                                {partE.supportingDocuments.map((doc, idx) => (
                                    <DocumentDisplay key={doc.id || idx} file={doc} />
                                ))}
                            </div>
                        </div>
                    )}
                </Section>

                {/* Review Remarks & Scores */}
                {(appraisal?.hodReview || appraisal?.iqacReview || appraisal?.principalReview ||
                    appraisal?.hodRemarks || appraisal?.iqacRemarks || appraisal?.principalRemarks) && (
                        <Section title="Review Feedback" icon={CheckCircle}>
                            <div className="space-y-4">
                                {/* Score Comparison */}
                                {(appraisal?.hodReviewedScore || appraisal?.iqacReviewedScore || appraisal?.finalScore) && (
                                    <div className="p-4 bg-slate-50 rounded-lg mb-4">
                                        <h4 className="font-medium text-slate-700 mb-3">Score Comparison</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                                                <p className="text-xs text-slate-500 mb-1">Self Assessment</p>
                                                <p className="text-2xl font-bold text-blue-600">{appraisal?.grandTotal || 0}</p>
                                            </div>
                                            {appraisal?.hodReviewedScore !== undefined && (
                                                <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                                                    <p className="text-xs text-blue-600 mb-1">HOD Reviewed</p>
                                                    <p className="text-2xl font-bold text-blue-700">{appraisal.hodReviewedScore}</p>
                                                </div>
                                            )}
                                            {appraisal?.iqacReviewedScore !== undefined && (
                                                <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                                                    <p className="text-xs text-purple-600 mb-1">IQAC Reviewed</p>
                                                    <p className="text-2xl font-bold text-purple-700">{appraisal.iqacReviewedScore}</p>
                                                </div>
                                            )}
                                            {appraisal?.finalScore !== undefined && (
                                                <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-300">
                                                    <p className="text-xs text-emerald-600 mb-1">Final Score</p>
                                                    <p className="text-2xl font-bold text-emerald-700">{appraisal.finalScore}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* HOD Review */}
                                {(appraisal?.hodRemarks || appraisal?.hodReview) && (
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium text-blue-700">HOD Review</p>
                                            {appraisal?.hodReview?.decision && (
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${appraisal.hodReview.decision === 'APPROVED'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {appraisal.hodReview.decision}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-700">{appraisal.hodRemarks || appraisal.hodReview?.comments || 'No comments provided'}</p>
                                        <p className="text-xs text-slate-500 mt-2">Reviewed on: {appraisal.hodApprovedAt || appraisal.hodReview?.reviewedAt?.split('T')[0]}</p>
                                    </div>
                                )}

                                {/* IQAC Review */}
                                {(appraisal?.iqacRemarks || appraisal?.iqacReview) && (
                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium text-purple-700">IQAC Review</p>
                                            {appraisal?.iqacReview?.decision && (
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700">
                                                    {appraisal.iqacReview.decision}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-700">{appraisal.iqacRemarks || appraisal.iqacReview?.comments || 'No comments provided'}</p>
                                        <p className="text-xs text-slate-500 mt-2">Reviewed on: {appraisal.iqacApprovedAt || appraisal.iqacReview?.reviewedAt?.split('T')[0]}</p>
                                    </div>
                                )}

                                {/* Principal Review */}
                                {(appraisal?.principalRemarks || appraisal?.principalReview) && (
                                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium text-emerald-700">Principal Approval</p>
                                            {appraisal?.principalReview?.decision && (
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700">
                                                    {appraisal.principalReview.decision}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-700">{appraisal.principalRemarks || appraisal.principalReview?.comments || 'No comments provided'}</p>
                                        <p className="text-xs text-slate-500 mt-2">Approved on: {appraisal.principalApprovedAt || appraisal.principalReview?.reviewedAt?.split('T')[0]}</p>
                                    </div>
                                )}
                            </div>
                        </Section>
                    )}
            </div>
        </DashboardLayout>
    );
}
