// Calculation Engine for Teacher Appraisal
// Implements exact Excel calculation logic with caps and validations

// ============================================
// PART B SUBSECTION CAPS
// ============================================
export const PART_B_CAPS = {
    researchJournals: { max: 15, label: 'Research Publications in Journals' },
    booksChapters: { max: 15, label: 'Books/Book Chapters' },
    editedBooks: { max: 10, label: 'Edited Books' },
    editorBooks: { max: 10, label: 'Editor of Books' },
    translations: { max: 5, label: 'Translations' },
    researchProjects: { max: 15, label: 'Research Projects' },
    consultancy: { max: 10, label: 'Consultancy' },
    developmentPrograms: { max: 10, label: 'Faculty Development Programs' },
    seminars: { max: 10, label: 'Seminars/Conferences' },
    patents: { max: 10, label: 'Patents' },
    awards: { max: 5, label: 'Awards' },
    econtent: { max: 5, label: 'E-Content Development' },
    moocs: { max: 5, label: 'MOOCs' },
    guidance: { max: 15, label: 'Research Guidance' },
};

export const PART_B_TOTAL_MAX = 120;

// ============================================
// PART C SUBSECTION CAPS
// ============================================
export const PART_C_CAPS = {
    keyContribution: { max: 25, label: 'Key Contributions' },
    committeeRoles: { max: 25, label: 'Committee Roles' },
    professionalBodies: { max: 25, label: 'Professional Bodies' },
    studentFeedback: { max: 25, label: 'Student Feedback' },
};

export const PART_C_TOTAL_MAX = 100;

// ============================================
// PART D VALUES
// ============================================
export const PART_D_VALUES = {
    attendance: 5,
    responsibility: 5,
    honesty: 5,
    teamwork: 5,
    inclusiveness: 5,
    conduct: 5,
};

export const PART_D_VALUES_LABELS = {
    attendance: 'Attendance & Punctuality',
    responsibility: 'Responsibility & Commitment',
    honesty: 'Honesty & Integrity',
    teamwork: 'Teamwork & Collaboration',
    inclusiveness: 'Inclusiveness & Respect',
    conduct: 'Professional Conduct',
};

export const PART_D_TOTAL_MAX = 30;

// ============================================
// GRAND TOTAL
// ============================================
export const GRAND_TOTAL_MAX = 250;

// ============================================
// CALCULATION FUNCTIONS
// ============================================

/**
 * Sum marks from an array of records, applying subsection cap
 */
export function sumWithCap(records, cap) {
    if (!records || records.length === 0) return 0;
    const rawSum = records.reduce((sum, r) => sum + (parseFloat(r.selfMarks) || 0), 0);
    return Math.min(rawSum, cap);
}

/**
 * Calculate Part B total (Research & Academic Contributions)
 */
export function calculatePartB(data) {
    const subtotals = {};

    subtotals.researchJournals = sumWithCap(data.researchJournals || [], PART_B_CAPS.researchJournals.max);
    subtotals.booksChapters = sumWithCap(data.booksChapters || [], PART_B_CAPS.booksChapters.max);
    subtotals.editedBooks = sumWithCap(data.editedBooks || [], PART_B_CAPS.editedBooks.max);
    subtotals.editorBooks = sumWithCap(data.editorBooks || [], PART_B_CAPS.editorBooks.max);
    subtotals.translations = sumWithCap(data.translations || [], PART_B_CAPS.translations.max);
    subtotals.researchProjects = sumWithCap(data.researchProjects || [], PART_B_CAPS.researchProjects.max);
    subtotals.consultancy = sumWithCap(data.consultancy || [], PART_B_CAPS.consultancy.max);
    subtotals.developmentPrograms = sumWithCap(data.developmentPrograms || [], PART_B_CAPS.developmentPrograms.max);
    subtotals.seminars = sumWithCap(data.seminars || [], PART_B_CAPS.seminars.max);
    subtotals.patents = sumWithCap(data.patents || [], PART_B_CAPS.patents.max);
    subtotals.awards = sumWithCap(data.awards || [], PART_B_CAPS.awards.max);
    subtotals.econtent = sumWithCap(data.econtent || [], PART_B_CAPS.econtent.max);
    subtotals.moocs = sumWithCap(data.moocs || [], PART_B_CAPS.moocs.max);
    subtotals.guidance = sumWithCap(data.guidance || [], PART_B_CAPS.guidance.max);

    const rawTotal = Object.values(subtotals).reduce((sum, val) => sum + val, 0);
    const total = Math.min(rawTotal, PART_B_TOTAL_MAX);

    return {
        subtotals,
        rawTotal: Math.round(rawTotal * 100) / 100,
        total: Math.round(total * 100) / 100,
        max: PART_B_TOTAL_MAX,
    };
}

/**
 * Calculate Part C total (Academic/Administrative Contribution)
 */
export function calculatePartC(data) {
    const subtotals = {};

    // Key Contribution is a single record
    const keyContribMarks = parseFloat(data.keyContribution?.selfMarks) || 0;
    subtotals.keyContribution = Math.min(keyContribMarks, PART_C_CAPS.keyContribution.max);

    // Committee Roles - sum of all entries
    subtotals.committeeRoles = sumWithCap(data.committeeRoles || [], PART_C_CAPS.committeeRoles.max);

    // Professional Bodies - sum of all entries
    subtotals.professionalBodies = sumWithCap(data.professionalBodies || [], PART_C_CAPS.professionalBodies.max);

    // Student Feedback - converted marks (avg_rating / 5 * 25)
    if (data.studentFeedback?.averageRating) {
        const avgRating = parseFloat(data.studentFeedback.averageRating) || 0;
        const convertedMarks = (avgRating / 5) * 25;
        subtotals.studentFeedback = Math.min(Math.round(convertedMarks * 100) / 100, PART_C_CAPS.studentFeedback.max);
    } else {
        subtotals.studentFeedback = 0;
    }

    const rawTotal = Object.values(subtotals).reduce((sum, val) => sum + val, 0);
    const total = Math.min(rawTotal, PART_C_TOTAL_MAX);

    return {
        subtotals,
        rawTotal: Math.round(rawTotal * 100) / 100,
        total: Math.round(total * 100) / 100,
        max: PART_C_TOTAL_MAX,
    };
}

/**
 * Calculate Part D total (Values)
 */
export function calculatePartD(values) {
    if (!values) {
        return { subtotals: {}, rawTotal: 0, total: 0, max: PART_D_TOTAL_MAX };
    }

    const subtotals = {};

    Object.entries(PART_D_VALUES).forEach(([key, max]) => {
        const val = parseFloat(values[key]) || 0;
        subtotals[key] = Math.min(val, max);
    });

    const rawTotal = Object.values(subtotals).reduce((sum, val) => sum + val, 0);
    const total = Math.min(rawTotal, PART_D_TOTAL_MAX);

    return {
        subtotals,
        rawTotal: Math.round(rawTotal * 100) / 100,
        total: Math.round(total * 100) / 100,
        max: PART_D_TOTAL_MAX,
    };
}

/**
 * Calculate complete appraisal totals
 */
export function calculateAppraisal(appraisalData) {
    const partB = calculatePartB(appraisalData.partB || {});
    const partC = calculatePartC(appraisalData.partC || {});
    const partD = calculatePartD(appraisalData.partD || {});

    const grandTotal = Math.min(
        partB.total + partC.total + partD.total,
        GRAND_TOTAL_MAX
    );

    return {
        partB,
        partC,
        partD,
        grandTotal: Math.round(grandTotal * 100) / 100,
        grandTotalMax: GRAND_TOTAL_MAX,
        percentage: Math.round((grandTotal / GRAND_TOTAL_MAX) * 100 * 100) / 100,
        calculatedAt: new Date().toISOString(),
    };
}

/**
 * Validate marks input
 */
export function validateMarks(value, max) {
    const num = parseFloat(value);
    if (isNaN(num)) return { valid: false, error: 'Invalid number' };
    if (num < 0) return { valid: false, error: 'Marks cannot be negative' };
    if (num > max) return { valid: false, error: `Marks cannot exceed ${max}` };
    return { valid: true, value: num };
}

/**
 * Get grade based on percentage
 */
export function getGrade(percentage) {
    if (percentage >= 90) return { grade: 'A+', label: 'Outstanding' };
    if (percentage >= 80) return { grade: 'A', label: 'Excellent' };
    if (percentage >= 70) return { grade: 'B+', label: 'Very Good' };
    if (percentage >= 60) return { grade: 'B', label: 'Good' };
    if (percentage >= 50) return { grade: 'C', label: 'Satisfactory' };
    if (percentage >= 40) return { grade: 'D', label: 'Needs Improvement' };
    return { grade: 'F', label: 'Unsatisfactory' };
}
