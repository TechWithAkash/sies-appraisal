'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
    appraisals as initialAppraisals,
    partABasicDetails as initialPartABasic,
    partAQualifications as initialPartAQualifications,
    partAExperience as initialPartAExperience,
    partBResearchJournals,
    partBBooksChapters,
    partBResearchProjects,
    partBSeminars,
    partBPatents,
    partBAwards,
    partBMoocs,
    partBGuidance,
    partCKeyContributions,
    partCCommitteeRoles,
    partCProfessionalBodies,
    partCStudentFeedback,
    partDValues as initialPartDValues,
    partESelfAssessment,
    auditLogs as initialAuditLogs,
    users,
    appraisalCycles,
} from '@/lib/data/mockData';
import { calculateAppraisal } from '@/lib/calculations';

const AppraisalContext = createContext(null);

// LocalStorage keys
const STORAGE_KEYS = {
    APPRAISALS: 'teacher_erp_appraisals',
    PART_A_BASIC: 'teacher_erp_part_a_basic',
    PART_A_QUALIFICATIONS: 'teacher_erp_part_a_qualifications',
    PART_A_EXPERIENCE: 'teacher_erp_part_a_experience',
    PART_B_DATA: 'teacher_erp_part_b_data',
    PART_C_DATA: 'teacher_erp_part_c_data',
    PART_D_DATA: 'teacher_erp_part_d_data',
    PART_E_DATA: 'teacher_erp_part_e_data',
    AUDIT_LOGS: 'teacher_erp_audit_logs',
};

// Helper to safely parse JSON from localStorage
const getStoredData = (key, fallback) => {
    if (typeof window === 'undefined') return fallback;
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
        console.error(`Error reading ${key} from localStorage:`, e);
        return fallback;
    }
};

// Helper to safely save to localStorage
const saveToStorage = (key, data) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Error saving ${key} to localStorage:`, e);
    }
};

// Initial Part B data structure
const getInitialPartBData = () => ({
    researchJournals: partBResearchJournals,
    booksChapters: partBBooksChapters,
    editedBooks: [],
    editorBooks: [],
    translations: [],
    researchProjects: partBResearchProjects,
    consultancy: [],
    developmentPrograms: [],
    seminars: partBSeminars,
    patents: partBPatents,
    awards: partBAwards,
    econtent: [],
    moocs: partBMoocs,
    guidance: partBGuidance,
});

// Initial Part C data structure
const getInitialPartCData = () => ({
    keyContributions: partCKeyContributions,
    committeeRoles: partCCommitteeRoles,
    professionalBodies: partCProfessionalBodies,
    studentFeedback: partCStudentFeedback,
});

export function AppraisalProvider({ children }) {
    const isInitialized = useRef(false);

    // State for all data
    const [appraisals, setAppraisals] = useState(initialAppraisals);
    const [partABasic, setPartABasic] = useState(initialPartABasic);
    const [partAQualifications, setPartAQualifications] = useState(initialPartAQualifications);
    const [partAExperience, setPartAExperience] = useState(initialPartAExperience);
    const [partBData, setPartBData] = useState(getInitialPartBData());
    const [partCData, setPartCData] = useState(getInitialPartCData());
    const [partDData, setPartDData] = useState(initialPartDValues);
    const [partEData, setPartEData] = useState(partESelfAssessment);
    const [auditLogs, setAuditLogs] = useState(initialAuditLogs);

    // Load data from localStorage on mount
    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        const storedAppraisals = getStoredData(STORAGE_KEYS.APPRAISALS, null);
        const storedPartABasic = getStoredData(STORAGE_KEYS.PART_A_BASIC, null);
        const storedPartAQualifications = getStoredData(STORAGE_KEYS.PART_A_QUALIFICATIONS, null);
        const storedPartAExperience = getStoredData(STORAGE_KEYS.PART_A_EXPERIENCE, null);
        const storedPartBData = getStoredData(STORAGE_KEYS.PART_B_DATA, null);
        const storedPartCData = getStoredData(STORAGE_KEYS.PART_C_DATA, null);
        const storedPartDData = getStoredData(STORAGE_KEYS.PART_D_DATA, null);
        const storedPartEData = getStoredData(STORAGE_KEYS.PART_E_DATA, null);
        const storedAuditLogs = getStoredData(STORAGE_KEYS.AUDIT_LOGS, null);

        if (storedAppraisals) setAppraisals(storedAppraisals);
        if (storedPartABasic) setPartABasic(storedPartABasic);
        if (storedPartAQualifications) setPartAQualifications(storedPartAQualifications);
        if (storedPartAExperience) setPartAExperience(storedPartAExperience);
        if (storedPartBData) setPartBData(storedPartBData);
        if (storedPartCData) setPartCData(storedPartCData);
        if (storedPartDData) setPartDData(storedPartDData);
        if (storedPartEData) setPartEData(storedPartEData);
        if (storedAuditLogs) setAuditLogs(storedAuditLogs);
    }, []);

    // Persist to localStorage whenever data changes
    useEffect(() => {
        if (!isInitialized.current) return;
        saveToStorage(STORAGE_KEYS.APPRAISALS, appraisals);
    }, [appraisals]);

    useEffect(() => {
        if (!isInitialized.current) return;
        saveToStorage(STORAGE_KEYS.PART_A_BASIC, partABasic);
    }, [partABasic]);

    useEffect(() => {
        if (!isInitialized.current) return;
        saveToStorage(STORAGE_KEYS.PART_A_QUALIFICATIONS, partAQualifications);
    }, [partAQualifications]);

    useEffect(() => {
        if (!isInitialized.current) return;
        saveToStorage(STORAGE_KEYS.PART_A_EXPERIENCE, partAExperience);
    }, [partAExperience]);

    useEffect(() => {
        if (!isInitialized.current) return;
        saveToStorage(STORAGE_KEYS.PART_B_DATA, partBData);
    }, [partBData]);

    useEffect(() => {
        if (!isInitialized.current) return;
        saveToStorage(STORAGE_KEYS.PART_C_DATA, partCData);
    }, [partCData]);

    useEffect(() => {
        if (!isInitialized.current) return;
        saveToStorage(STORAGE_KEYS.PART_D_DATA, partDData);
    }, [partDData]);

    useEffect(() => {
        if (!isInitialized.current) return;
        saveToStorage(STORAGE_KEYS.PART_E_DATA, partEData);
    }, [partEData]);

    useEffect(() => {
        if (!isInitialized.current) return;
        saveToStorage(STORAGE_KEYS.AUDIT_LOGS, auditLogs);
    }, [auditLogs]);

    // Get appraisal by ID
    const getAppraisal = useCallback((id) => {
        const numId = typeof id === 'string' ? parseInt(id, 10) : id;
        return appraisals.find(a => a.id === numId || a.id === id);
    }, [appraisals]);

    // Get appraisals for a teacher
    const getTeacherAppraisals = useCallback((teacherId) => {
        return appraisals.filter(a => a.teacherId === teacherId);
    }, [appraisals]);

    // Get current cycle appraisal for teacher
    const getCurrentAppraisal = useCallback((teacherId) => {
        const currentCycle = appraisalCycles.find(c => c.isOpen);
        if (!currentCycle) return null;
        return appraisals.find(a => a.teacherId === teacherId && a.cycleId === currentCycle.id);
    }, [appraisals]);

    // Get full appraisal data
    const getFullAppraisalData = useCallback((appraisalId) => {
        const numId = typeof appraisalId === 'string' ? parseInt(appraisalId, 10) : appraisalId;
        const appraisal = appraisals.find(a => a.id === numId || a.id === appraisalId);
        if (!appraisal) return null;

        const teacher = users.find(u => u.id === appraisal.teacherId);
        const cycle = appraisalCycles.find(c => c.id === appraisal.cycleId);

        return {
            ...appraisal,
            teacher,
            cycle,
            partA: {
                basic: partABasic.find(p => p.appraisalId === appraisal.id),
                qualifications: partAQualifications.filter(p => p.appraisalId === appraisal.id),
                experience: partAExperience.find(p => p.appraisalId === appraisal.id),
            },
            partB: {
                researchJournals: partBData.researchJournals.filter(p => p.appraisalId === appraisal.id),
                booksChapters: partBData.booksChapters.filter(p => p.appraisalId === appraisal.id),
                editedBooks: partBData.editedBooks.filter(p => p.appraisalId === appraisal.id),
                editorBooks: partBData.editorBooks.filter(p => p.appraisalId === appraisal.id),
                translations: partBData.translations.filter(p => p.appraisalId === appraisal.id),
                researchProjects: partBData.researchProjects.filter(p => p.appraisalId === appraisal.id),
                consultancy: partBData.consultancy.filter(p => p.appraisalId === appraisal.id),
                developmentPrograms: partBData.developmentPrograms.filter(p => p.appraisalId === appraisal.id),
                seminars: partBData.seminars.filter(p => p.appraisalId === appraisal.id),
                patents: partBData.patents.filter(p => p.appraisalId === appraisal.id),
                awards: partBData.awards.filter(p => p.appraisalId === appraisal.id),
                econtent: partBData.econtent.filter(p => p.appraisalId === appraisal.id),
                moocs: partBData.moocs.filter(p => p.appraisalId === appraisal.id),
                guidance: partBData.guidance.filter(p => p.appraisalId === appraisal.id),
            },
            partC: {
                keyContribution: partCData.keyContributions.find(p => p.appraisalId === appraisal.id),
                committeeRoles: partCData.committeeRoles.filter(p => p.appraisalId === appraisal.id),
                professionalBodies: partCData.professionalBodies.filter(p => p.appraisalId === appraisal.id),
                studentFeedback: partCData.studentFeedback.find(p => p.appraisalId === appraisal.id),
            },
            partD: partDData.find(p => p.appraisalId === appraisal.id),
            partE: partEData.find(p => p.appraisalId === appraisal.id),
        };
    }, [appraisals, partABasic, partAQualifications, partAExperience, partBData, partCData, partDData, partEData]);

    // Add audit log
    const addAuditLog = useCallback((appraisalId, action, newData, oldData = null) => {
        const newLog = {
            id: Date.now(),
            appraisalId,
            action,
            performedBy: null,
            performedAt: new Date().toISOString(),
            oldData,
            newData,
        };
        setAuditLogs(prev => [...prev, newLog]);
    }, []);

    // Save Part A Basic
    const savePartABasic = useCallback((appraisalId, data) => {
        setPartABasic(prev => {
            const existing = prev.find(p => p.appraisalId === appraisalId);
            if (existing) {
                return prev.map(p => p.appraisalId === appraisalId ? { ...p, ...data } : p);
            }
            return [...prev, { appraisalId, ...data }];
        });
        addAuditLog(appraisalId, 'PART_A_BASIC_UPDATED', data);
    }, [addAuditLog]);

    // Save Part A Qualifications
    const savePartAQualifications = useCallback((appraisalId, qualifications) => {
        setPartAQualifications(prev => {
            const filtered = prev.filter(p => p.appraisalId !== appraisalId);
            return [...filtered, ...qualifications.map((q, idx) => ({ ...q, appraisalId, id: q.id || Date.now() + idx }))];
        });
        addAuditLog(appraisalId, 'PART_A_QUALIFICATIONS_UPDATED', qualifications);
    }, [addAuditLog]);

    // Save Part A Experience
    const savePartAExperience = useCallback((appraisalId, data) => {
        setPartAExperience(prev => {
            const existing = prev.find(p => p.appraisalId === appraisalId);
            if (existing) {
                return prev.map(p => p.appraisalId === appraisalId ? { ...p, ...data } : p);
            }
            return [...prev, { appraisalId, ...data }];
        });
        addAuditLog(appraisalId, 'PART_A_EXPERIENCE_UPDATED', data);
    }, [addAuditLog]);

    // Save Part B subsection
    const savePartBSection = useCallback((appraisalId, section, records) => {
        setPartBData(prev => {
            const filtered = (prev[section] || []).filter(p => p.appraisalId !== appraisalId);
            return {
                ...prev,
                [section]: [...filtered, ...records.map((r, idx) => ({ ...r, appraisalId, id: r.id || Date.now() + idx }))],
            };
        });
        addAuditLog(appraisalId, `PART_B_${section.toUpperCase()}_UPDATED`, records);
    }, [addAuditLog]);

    // Save Part C section
    const savePartCSection = useCallback((appraisalId, section, data) => {
        setPartCData(prev => {
            if (section === 'keyContributions' || section === 'studentFeedback') {
                const filtered = (prev[section] || []).filter(p => p.appraisalId !== appraisalId);
                return {
                    ...prev,
                    [section]: [...filtered, { ...data, appraisalId }],
                };
            } else {
                const filtered = (prev[section] || []).filter(p => p.appraisalId !== appraisalId);
                return {
                    ...prev,
                    [section]: [...filtered, ...data.map((r, idx) => ({ ...r, appraisalId, id: r.id || Date.now() + idx }))],
                };
            }
        });
        addAuditLog(appraisalId, `PART_C_${section.toUpperCase()}_UPDATED`, data);
    }, [addAuditLog]);

    // Save Part D
    const savePartD = useCallback((appraisalId, values) => {
        setPartDData(prev => {
            const existing = prev.find(p => p.appraisalId === appraisalId);
            if (existing) {
                return prev.map(p => p.appraisalId === appraisalId ? { ...p, ...values } : p);
            }
            return [...prev, { appraisalId, ...values }];
        });
        addAuditLog(appraisalId, 'PART_D_UPDATED', values);
    }, [addAuditLog]);

    // Save Part E
    const savePartE = useCallback((appraisalId, data) => {
        setPartEData(prev => {
            const existing = prev.find(p => p.appraisalId === appraisalId);
            if (existing) {
                return prev.map(p => p.appraisalId === appraisalId ? { ...p, ...data } : p);
            }
            return [...prev, { appraisalId, ...data }];
        });
        addAuditLog(appraisalId, 'PART_E_UPDATED', data);
    }, [addAuditLog]);

    // Recalculate totals
    const recalculateTotals = useCallback((appraisalId) => {
        const numId = typeof appraisalId === 'string' ? parseInt(appraisalId, 10) : appraisalId;
        const appraisal = appraisals.find(a => a.id === numId);
        if (!appraisal) return null;

        const teacher = users.find(u => u.id === appraisal.teacherId);
        const cycle = appraisalCycles.find(c => c.id === appraisal.cycleId);

        const fullData = {
            ...appraisal,
            teacher,
            cycle,
            partA: {
                basic: partABasic.find(p => p.appraisalId === numId),
                qualifications: partAQualifications.filter(p => p.appraisalId === numId),
                experience: partAExperience.find(p => p.appraisalId === numId),
            },
            partB: {
                researchJournals: partBData.researchJournals.filter(p => p.appraisalId === numId),
                booksChapters: partBData.booksChapters.filter(p => p.appraisalId === numId),
                editedBooks: partBData.editedBooks.filter(p => p.appraisalId === numId),
                editorBooks: partBData.editorBooks.filter(p => p.appraisalId === numId),
                translations: partBData.translations.filter(p => p.appraisalId === numId),
                researchProjects: partBData.researchProjects.filter(p => p.appraisalId === numId),
                consultancy: partBData.consultancy.filter(p => p.appraisalId === numId),
                developmentPrograms: partBData.developmentPrograms.filter(p => p.appraisalId === numId),
                seminars: partBData.seminars.filter(p => p.appraisalId === numId),
                patents: partBData.patents.filter(p => p.appraisalId === numId),
                awards: partBData.awards.filter(p => p.appraisalId === numId),
                econtent: partBData.econtent.filter(p => p.appraisalId === numId),
                moocs: partBData.moocs.filter(p => p.appraisalId === numId),
                guidance: partBData.guidance.filter(p => p.appraisalId === numId),
            },
            partC: {
                keyContribution: partCData.keyContributions.find(p => p.appraisalId === numId),
                committeeRoles: partCData.committeeRoles.filter(p => p.appraisalId === numId),
                professionalBodies: partCData.professionalBodies.filter(p => p.appraisalId === numId),
                studentFeedback: partCData.studentFeedback.find(p => p.appraisalId === numId),
            },
            partD: partDData.find(p => p.appraisalId === numId),
            partE: partEData.find(p => p.appraisalId === numId),
        };

        const calculation = calculateAppraisal(fullData);

        setAppraisals(prev => prev.map(a => {
            if (a.id === numId) {
                return {
                    ...a,
                    totalPartB: calculation.partB.total,
                    totalPartC: calculation.partC.total,
                    totalPartD: calculation.partD.total,
                    grandTotal: calculation.grandTotal,
                    calculation,
                    updatedAt: new Date().toISOString().split('T')[0],
                };
            }
            return a;
        }));

        return calculation;
    }, [appraisals, partABasic, partAQualifications, partAExperience, partBData, partCData, partDData, partEData]);

    // Submit appraisal
    const submitAppraisal = useCallback((appraisalId) => {
        recalculateTotals(appraisalId);

        setAppraisals(prev => prev.map(a => {
            if (a.id === appraisalId) {
                return {
                    ...a,
                    status: 'SUBMITTED',
                    submittedAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0],
                };
            }
            return a;
        }));

        addAuditLog(appraisalId, 'SUBMITTED', { submittedAt: new Date().toISOString() });
    }, [recalculateTotals, addAuditLog]);

    // HOD Review
    const hodReview = useCallback((appraisalId, reviewData) => {
        const numId = typeof appraisalId === 'string' ? parseInt(appraisalId, 10) : appraisalId;

        setAppraisals(prev => prev.map(a => {
            if (a.id === numId) {
                // Handle rejection (send back to teacher)
                if (reviewData.rejectToTeacher || reviewData.decision === 'REJECTED') {
                    return {
                        ...a,
                        status: 'DRAFT', // Send back to draft for revision
                        hodReview: {
                            scores: reviewData.scores || {},
                            comments: reviewData.comments || '',
                            decision: 'REJECTED',
                            reviewedAt: reviewData.reviewedAt || new Date().toISOString(),
                        },
                        rejectionReason: reviewData.comments || '',
                        rejectedBy: 'HOD',
                        rejectedAt: new Date().toISOString().split('T')[0],
                        updatedAt: new Date().toISOString().split('T')[0],
                    };
                }

                // Calculate reviewed score from scores
                const partBTotal = Object.values(reviewData.scores?.partB || {}).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
                const partCTotal = Object.values(reviewData.scores?.partC || {}).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
                const partDTotal = Object.values(reviewData.scores?.partD || {}).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
                const reviewedScore = Math.round((partBTotal + partCTotal + partDTotal) * 100) / 100;

                return {
                    ...a,
                    status: 'HOD_REVIEWED',
                    hodReview: {
                        scores: reviewData.scores || {},
                        comments: reviewData.comments || '',
                        decision: 'APPROVED',
                        reviewedAt: reviewData.reviewedAt || new Date().toISOString(),
                        reviewedScore,
                    },
                    hodRemarks: reviewData.comments || '',
                    hodApprovedAt: new Date().toISOString().split('T')[0],
                    hodReviewedScore: reviewedScore,
                    updatedAt: new Date().toISOString().split('T')[0],
                };
            }
            return a;
        }));
        addAuditLog(numId, reviewData.rejectToTeacher ? 'HOD_REJECTED' : 'HOD_REVIEWED', reviewData);
    }, [addAuditLog]);

    // IQAC Review
    const iqacReview = useCallback((appraisalId, reviewData) => {
        const numId = typeof appraisalId === 'string' ? parseInt(appraisalId, 10) : appraisalId;

        setAppraisals(prev => prev.map(a => {
            if (a.id === numId) {
                // Calculate reviewed score from scores
                const partBTotal = Object.values(reviewData.scores?.partB || {}).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
                const partCTotal = Object.values(reviewData.scores?.partC || {}).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
                const partDTotal = Object.values(reviewData.scores?.partD || {}).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
                const reviewedScore = Math.round((partBTotal + partCTotal + partDTotal) * 100) / 100;

                return {
                    ...a,
                    status: 'IQAC_REVIEWED',
                    iqacReview: {
                        scores: reviewData.scores || {},
                        comments: reviewData.comments || '',
                        decision: 'APPROVED',
                        reviewedAt: reviewData.reviewedAt || new Date().toISOString(),
                        reviewedScore,
                    },
                    iqacRemarks: reviewData.comments || '',
                    iqacApprovedAt: new Date().toISOString().split('T')[0],
                    iqacReviewedScore: reviewedScore,
                    updatedAt: new Date().toISOString().split('T')[0],
                };
            }
            return a;
        }));
        addAuditLog(numId, 'IQAC_REVIEWED', reviewData);
    }, [addAuditLog]);

    // Principal Review
    const principalReview = useCallback((appraisalId, reviewData) => {
        const numId = typeof appraisalId === 'string' ? parseInt(appraisalId, 10) : appraisalId;

        setAppraisals(prev => prev.map(a => {
            if (a.id === numId) {
                // Calculate final score from scores
                const partBTotal = Object.values(reviewData.scores?.partB || {}).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
                const partCTotal = Object.values(reviewData.scores?.partC || {}).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
                const partDTotal = Object.values(reviewData.scores?.partD || {}).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
                const finalScore = Math.round((partBTotal + partCTotal + partDTotal) * 100) / 100;

                return {
                    ...a,
                    status: 'PRINCIPAL_REVIEWED',
                    principalReview: {
                        scores: reviewData.scores || {},
                        comments: reviewData.comments || '',
                        decision: 'APPROVED',
                        reviewedAt: reviewData.reviewedAt || new Date().toISOString(),
                    },
                    principalRemarks: reviewData.comments || '',
                    principalApprovedAt: new Date().toISOString().split('T')[0],
                    finalScore,
                    lockedAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0],
                };
            }
            return a;
        }));
        addAuditLog(numId, 'PRINCIPAL_APPROVED', reviewData);
    }, [addAuditLog]);

    // Create new appraisal
    const createAppraisal = useCallback((teacherId, cycleId) => {
        const existingAppraisal = appraisals.find(a => a.teacherId === teacherId && a.cycleId === cycleId);
        if (existingAppraisal) return existingAppraisal;

        const newId = Math.max(0, ...appraisals.map(a => a.id)) + 1;
        const newAppraisal = {
            id: newId,
            cycleId,
            teacherId,
            status: 'DRAFT',
            totalPartB: 0,
            totalPartC: 0,
            totalPartD: 0,
            grandTotal: 0,
            calculation: null,
            pdfPath: null,
            submittedAt: null,
            lockedAt: null,
            hodRemarks: null,
            hodApprovedAt: null,
            iqacRemarks: null,
            iqacApprovedAt: null,
            principalRemarks: null,
            principalApprovedAt: null,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
        };

        setAppraisals(prev => [...prev, newAppraisal]);
        addAuditLog(newId, 'CREATED', { teacherId, cycleId });

        return newAppraisal;
    }, [appraisals, addAuditLog]);

    // Get appraisals by status
    const getAppraisalsByStatus = useCallback((status) => {
        return appraisals.filter(a => a.status === status).map(a => {
            const teacher = users.find(u => u.id === a.teacherId);
            const cycle = appraisalCycles.find(c => c.id === a.cycleId);
            return { ...a, teacher, cycle };
        });
    }, [appraisals]);

    // Get appraisals by department
    const getAppraisalsByDepartment = useCallback((department) => {
        const deptTeachers = users.filter(u => u.department === department && u.role === 'TEACHER');
        const teacherIds = deptTeachers.map(t => t.id);
        return appraisals.filter(a => teacherIds.includes(a.teacherId)).map(a => {
            const teacher = users.find(u => u.id === a.teacherId);
            const cycle = appraisalCycles.find(c => c.id === a.cycleId);
            return { ...a, teacher, cycle };
        });
    }, [appraisals]);

    // Get all appraisals with details
    const getAllAppraisalsWithDetails = useCallback(() => {
        return appraisals.map(a => {
            const teacher = users.find(u => u.id === a.teacherId);
            const cycle = appraisalCycles.find(c => c.id === a.cycleId);
            return { ...a, teacher, cycle };
        });
    }, [appraisals]);

    // Get all appraisals
    const getAllAppraisals = useCallback(() => {
        return appraisals.map(a => {
            const teacher = users.find(u => u.id === a.teacherId);
            const cycle = appraisalCycles.find(c => c.id === a.cycleId);
            return {
                ...a,
                teacher,
                cycle,
                department: teacher?.department,
                teacherName: teacher?.name,
                teacherEmail: teacher?.email,
            };
        });
    }, [appraisals]);

    // Clear all stored data
    const clearAllData = useCallback(() => {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        setAppraisals(initialAppraisals);
        setPartABasic(initialPartABasic);
        setPartAQualifications(initialPartAQualifications);
        setPartAExperience(initialPartAExperience);
        setPartBData(getInitialPartBData());
        setPartCData(getInitialPartCData());
        setPartDData(initialPartDValues);
        setPartEData(partESelfAssessment);
        setAuditLogs(initialAuditLogs);
    }, []);

    return (
        <AppraisalContext.Provider value={{
            appraisals,
            appraisalCycles,
            getAppraisal,
            getTeacherAppraisals,
            getCurrentAppraisal,
            getFullAppraisalData,
            savePartABasic,
            savePartAQualifications,
            savePartAExperience,
            savePartBSection,
            savePartCSection,
            savePartD,
            savePartE,
            recalculateTotals,
            submitAppraisal,
            hodReview,
            iqacReview,
            principalReview,
            createAppraisal,
            getAppraisalsByStatus,
            getAppraisalsByDepartment,
            getAllAppraisals,
            getAllAppraisalsWithDetails,
            auditLogs,
            clearAllData,
        }}>
            {children}
        </AppraisalContext.Provider>
    );
}

export function useAppraisal() {
    const context = useContext(AppraisalContext);
    if (!context) {
        throw new Error('useAppraisal must be used within an AppraisalProvider');
    }
    return context;
}
