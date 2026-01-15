'use client';

import { createContext, useContext, useState, useCallback } from 'react';
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

export function AppraisalProvider({ children }) {
    // State for all data
    const [appraisals, setAppraisals] = useState(initialAppraisals);
    const [partABasic, setPartABasic] = useState(initialPartABasic);
    const [partAQualifications, setPartAQualifications] = useState(initialPartAQualifications);
    const [partAExperience, setPartAExperience] = useState(initialPartAExperience);
    const [partBData, setPartBData] = useState({
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
    const [partCData, setPartCData] = useState({
        keyContributions: partCKeyContributions,
        committeeRoles: partCCommitteeRoles,
        professionalBodies: partCProfessionalBodies,
        studentFeedback: partCStudentFeedback,
    });
    const [partDData, setPartDData] = useState(initialPartDValues);
    const [partEData, setPartEData] = useState(partESelfAssessment);
    const [auditLogs, setAuditLogs] = useState(initialAuditLogs);

    // Get appraisal by ID (handles both string and number IDs)
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
    }, []);

    // Save Part A Qualifications
    const savePartAQualifications = useCallback((appraisalId, qualifications) => {
        setPartAQualifications(prev => {
            const filtered = prev.filter(p => p.appraisalId !== appraisalId);
            return [...filtered, ...qualifications.map((q, idx) => ({ ...q, appraisalId, id: q.id || Date.now() + idx }))];
        });
        addAuditLog(appraisalId, 'PART_A_QUALIFICATIONS_UPDATED', qualifications);
    }, []);

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
    }, []);

    // Save Part B subsection
    const savePartBSection = useCallback((appraisalId, section, records) => {
        setPartBData(prev => {
            const filtered = prev[section].filter(p => p.appraisalId !== appraisalId);
            return {
                ...prev,
                [section]: [...filtered, ...records.map((r, idx) => ({ ...r, appraisalId, id: r.id || Date.now() + idx }))],
            };
        });
        recalculateTotals(appraisalId);
        addAuditLog(appraisalId, `PART_B_${section.toUpperCase()}_UPDATED`, records);
    }, []);

    // Save Part C section
    const savePartCSection = useCallback((appraisalId, section, data) => {
        setPartCData(prev => {
            if (section === 'keyContributions' || section === 'studentFeedback') {
                // Single record sections
                const filtered = prev[section].filter(p => p.appraisalId !== appraisalId);
                return {
                    ...prev,
                    [section]: [...filtered, { ...data, appraisalId }],
                };
            } else {
                // Multiple records sections
                const filtered = prev[section].filter(p => p.appraisalId !== appraisalId);
                return {
                    ...prev,
                    [section]: [...filtered, ...data.map((r, idx) => ({ ...r, appraisalId, id: r.id || Date.now() + idx }))],
                };
            }
        });
        recalculateTotals(appraisalId);
        addAuditLog(appraisalId, `PART_C_${section.toUpperCase()}_UPDATED`, data);
    }, []);

    // Save Part D
    const savePartD = useCallback((appraisalId, values) => {
        setPartDData(prev => {
            const existing = prev.find(p => p.appraisalId === appraisalId);
            if (existing) {
                return prev.map(p => p.appraisalId === appraisalId ? { ...p, ...values } : p);
            }
            return [...prev, { appraisalId, ...values }];
        });
        recalculateTotals(appraisalId);
        addAuditLog(appraisalId, 'PART_D_UPDATED', values);
    }, []);

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
    }, []);

    // Recalculate totals
    const recalculateTotals = useCallback((appraisalId) => {
        const fullData = getFullAppraisalData(appraisalId);
        if (!fullData) return;

        const calculation = calculateAppraisal(fullData);

        setAppraisals(prev => prev.map(a => {
            if (a.id === appraisalId) {
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
    }, [getFullAppraisalData]);

    // Submit appraisal
    const submitAppraisal = useCallback((appraisalId) => {
        const calculation = recalculateTotals(appraisalId);

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

        addAuditLog(appraisalId, 'SUBMITTED', { calculation });
    }, [recalculateTotals]);

    // HOD Review
    const hodReview = useCallback((appraisalId, remarks, userId) => {
        setAppraisals(prev => prev.map(a => {
            if (a.id === appraisalId) {
                return {
                    ...a,
                    status: 'HOD_REVIEWED',
                    hodRemarks: remarks,
                    hodApprovedAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0],
                };
            }
            return a;
        }));
        addAuditLog(appraisalId, 'HOD_REVIEWED', { remarks, reviewedBy: userId });
    }, []);

    // IQAC Review
    const iqacReview = useCallback((appraisalId, remarks, userId) => {
        setAppraisals(prev => prev.map(a => {
            if (a.id === appraisalId) {
                return {
                    ...a,
                    status: 'IQAC_REVIEWED',
                    iqacRemarks: remarks,
                    iqacApprovedAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0],
                };
            }
            return a;
        }));
        addAuditLog(appraisalId, 'IQAC_REVIEWED', { remarks, reviewedBy: userId });
    }, []);

    // Principal Review
    const principalReview = useCallback((appraisalId, remarks, userId) => {
        setAppraisals(prev => prev.map(a => {
            if (a.id === appraisalId) {
                return {
                    ...a,
                    status: 'APPROVED',
                    principalRemarks: remarks,
                    principalApprovedAt: new Date().toISOString().split('T')[0],
                    lockedAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0],
                };
            }
            return a;
        }));
        addAuditLog(appraisalId, 'PRINCIPAL_APPROVED', { remarks, reviewedBy: userId });
    }, []);

    // Create new appraisal
    const createAppraisal = useCallback((teacherId, cycleId) => {
        const newId = Math.max(...appraisals.map(a => a.id)) + 1;
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
    }, [appraisals]);

    // Add audit log
    const addAuditLog = useCallback((appraisalId, action, newData, oldData = null) => {
        const newLog = {
            id: Date.now(),
            appraisalId,
            action,
            performedBy: null, // Should be set by caller
            performedAt: new Date().toISOString(),
            oldData,
            newData,
        };
        setAuditLogs(prev => [...prev, newLog]);
    }, []);

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

    // Get all appraisals (simple, with department info)
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
