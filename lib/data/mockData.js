// Mock Data Store for Teacher Appraisal ERP
// This file contains all the mock data that would normally come from a database
// Data is structured to match the TECHNICAL_DOCS.md specifications

import { v4 as uuidv4 } from 'uuid';

// ============================================
// USERS & AUTHENTICATION
// ============================================
export const users = [
    {
        id: 1,
        employeeNo: 'EMP001',
        name: 'Dr. Akash Vishwakarma',
        email: 'akash.v@sies.edu.in',
        password: 'teacher123',
        role: 'TEACHER',
        department: 'Computer Science',
        designation: 'Associate Professor',
        mobile: '9876543210',
        avatar: null,
    },
    {
        id: 2,
        employeeNo: 'EMP002',
        name: 'Dr. Anita Sharma',
        email: 'anita.s@sies.edu.in',
        password: 'teacher123',
        role: 'TEACHER',
        department: 'Computer Science',
        designation: 'Assistant Professor',
        mobile: '9876543211',
        avatar: null,
    },
    {
        id: 3,
        employeeNo: 'EMP003',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.k@sies.edu.in',
        password: 'teacher123',
        role: 'TEACHER',
        department: 'Electronics',
        designation: 'Professor',
        mobile: '9876543212',
        avatar: null,
    },
    {
        id: 4,
        employeeNo: 'HOD001',
        name: 'Dr. Priya Menon',
        email: 'priya.m@sies.edu.in',
        password: 'hod123',
        role: 'HOD',
        department: 'Computer Science',
        designation: 'Head of Department',
        mobile: '9876543220',
        avatar: null,
    },
    {
        id: 5,
        employeeNo: 'HOD002',
        name: 'Dr. Suresh Patil',
        email: 'suresh.p@sies.edu.in',
        password: 'hod123',
        role: 'HOD',
        department: 'Electronics',
        designation: 'Head of Department',
        mobile: '9876543221',
        avatar: null,
    },
    {
        id: 6,
        employeeNo: 'IQAC001',
        name: 'Dr. Meera Joshi',
        email: 'meera.j@sies.edu.in',
        password: 'iqac123',
        role: 'IQAC',
        department: 'Quality Assurance',
        designation: 'IQAC Coordinator',
        mobile: '9876543230',
        avatar: null,
    },
    {
        id: 7,
        employeeNo: 'PRIN001',
        name: 'Dr. Vijay Deshmukh',
        email: 'vijay.d@sies.edu.in',
        password: 'principal123',
        role: 'PRINCIPAL',
        department: 'Administration',
        designation: 'Principal',
        mobile: '9876543240',
        avatar: null,
    },
    {
        id: 8,
        employeeNo: 'ADM001',
        name: 'Mr. Admin User',
        email: 'admin@sies.edu.in',
        password: 'admin123',
        role: 'ADMIN',
        department: 'Administration',
        designation: 'System Administrator',
        mobile: '9876543250',
        avatar: null,
    },
];

// ============================================
// APPRAISAL CYCLES
// ============================================
export const appraisalCycles = [
    {
        id: 1,
        academicYear: '2024-2025',
        startDate: '2024-04-01',
        endDate: '2025-03-31',
        isOpen: false,
        createdAt: '2024-03-15',
    },
    {
        id: 2,
        academicYear: '2025-2026',
        startDate: '2025-04-01',
        endDate: '2026-03-31',
        isOpen: true,
        createdAt: '2025-03-15',
    },
];

// Cycles with full structure for admin management
export const cycles = [
    {
        id: 'cycle-1',
        name: 'Annual Appraisal 2024-25',
        academicYear: '2024-2025',
        startDate: '2024-04-01',
        endDate: '2025-03-31',
        status: 'COMPLETED',
        createdAt: '2024-03-15T10:00:00Z',
    },
    {
        id: 'cycle-2',
        name: 'Annual Appraisal 2025-26',
        academicYear: '2025-2026',
        startDate: '2025-04-01',
        endDate: '2026-03-31',
        status: 'ACTIVE',
        createdAt: '2025-03-15T10:00:00Z',
    },
    {
        id: 'cycle-3',
        name: 'Annual Appraisal 2026-27',
        academicYear: '2026-2027',
        startDate: '2026-04-01',
        endDate: '2027-03-31',
        status: 'UPCOMING',
        createdAt: '2026-01-10T10:00:00Z',
    },
];

// ============================================
// DEPARTMENTS
// ============================================
export const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Information Technology',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Humanities',
];

// ============================================
// APPRAISALS (Master Records)
// ============================================
export const appraisals = [
    {
        id: 1,
        cycleId: 2,
        teacherId: 1,
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
        createdAt: '2025-04-05',
        updatedAt: '2025-04-05',
    },
    {
        id: 2,
        cycleId: 2,
        teacherId: 2,
        status: 'SUBMITTED',
        totalPartB: 85.5,
        totalPartC: 72.0,
        totalPartD: 25.0,
        grandTotal: 182.5,
        calculation: { partB: 85.5, partC: 72.0, partD: 25.0 },
        pdfPath: null,
        submittedAt: '2025-05-10',
        lockedAt: null,
        hodRemarks: null,
        hodApprovedAt: null,
        iqacRemarks: null,
        iqacApprovedAt: null,
        principalRemarks: null,
        principalApprovedAt: null,
        createdAt: '2025-04-08',
        updatedAt: '2025-05-10',
    },
    {
        id: 3,
        cycleId: 2,
        teacherId: 3,
        status: 'HOD_REVIEWED',
        totalPartB: 95.0,
        totalPartC: 80.0,
        totalPartD: 28.0,
        grandTotal: 203.0,
        calculation: { partB: 95.0, partC: 80.0, partD: 28.0 },
        pdfPath: null,
        submittedAt: '2025-05-05',
        lockedAt: null,
        hodRemarks: 'Excellent research contributions. Recommended for promotion.',
        hodApprovedAt: '2025-05-08',
        iqacRemarks: null,
        iqacApprovedAt: null,
        principalRemarks: null,
        principalApprovedAt: null,
        createdAt: '2025-04-02',
        updatedAt: '2025-05-08',
    },
];

// ============================================
// PART A - BASIC DETAILS
// ============================================
export const partABasicDetails = [
    {
        appraisalId: 1,
        employeeNo: 'EMP001',
        fullName: 'Dr. Akash Vishwakarma',
        designation: 'Associate Professor',
        department: 'Computer Science',
        dateOfJoining: '2015-07-15',
        dateOfBirth: '1985-03-20',
        currentBand: 'Band 4',
        lastBandChangeDate: '2022-04-01',
        lastPromotionDate: '2020-07-01',
        academicLevelCas: 'Level 12',
        promotionEligibilityDate: '2025-07-01',
        location: 'Mumbai',
        mobile: '9876543210',
        email: 'akash.v@sies.edu.in',
        address: '123, Green Park Society, Andheri East, Mumbai - 400069',
    },
    {
        appraisalId: 2,
        employeeNo: 'EMP002',
        fullName: 'Dr. Anita Sharma',
        designation: 'Assistant Professor',
        department: 'Computer Science',
        dateOfJoining: '2018-08-01',
        dateOfBirth: '1990-06-15',
        currentBand: 'Band 3',
        lastBandChangeDate: '2023-04-01',
        lastPromotionDate: null,
        academicLevelCas: 'Level 10',
        promotionEligibilityDate: '2026-08-01',
        location: 'Mumbai',
        mobile: '9876543211',
        email: 'anita.s@sies.edu.in',
        address: '45, Blue Heights, Powai, Mumbai - 400076',
    },
    {
        appraisalId: 3,
        employeeNo: 'EMP003',
        fullName: 'Dr. Rajesh Kumar',
        designation: 'Professor',
        department: 'Electronics',
        dateOfJoining: '2010-01-10',
        dateOfBirth: '1975-11-25',
        currentBand: 'Band 5',
        lastBandChangeDate: '2021-04-01',
        lastPromotionDate: '2019-01-01',
        academicLevelCas: 'Level 14',
        promotionEligibilityDate: '2024-01-10',
        location: 'Mumbai',
        mobile: '9876543212',
        email: 'rajesh.k@sies.edu.in',
        address: '78, Silver Oaks, Thane West, Mumbai - 400601',
    },
];

// ============================================
// PART A - QUALIFICATIONS
// ============================================
export const partAQualifications = [
    {
        id: 1,
        appraisalId: 1,
        examination: 'Ph.D.',
        boardUniversity: 'University of Mumbai',
        yearOfPassing: 2014,
        percentage: null,
        grade: 'Distinction',
        subject: 'Computer Science - Machine Learning',
    },
    {
        id: 2,
        appraisalId: 1,
        examination: 'M.Tech',
        boardUniversity: 'IIT Bombay',
        yearOfPassing: 2010,
        percentage: 82.5,
        grade: 'First Class with Distinction',
        subject: 'Computer Science',
    },
    {
        id: 3,
        appraisalId: 1,
        examination: 'B.E.',
        boardUniversity: 'University of Pune',
        yearOfPassing: 2007,
        percentage: 78.2,
        grade: 'First Class',
        subject: 'Computer Engineering',
    },
    {
        id: 4,
        appraisalId: 2,
        examination: 'Ph.D.',
        boardUniversity: 'SNDT University',
        yearOfPassing: 2020,
        percentage: null,
        grade: 'Distinction',
        subject: 'Data Science',
    },
    {
        id: 5,
        appraisalId: 2,
        examination: 'M.E.',
        boardUniversity: 'University of Mumbai',
        yearOfPassing: 2015,
        percentage: 79.8,
        grade: 'First Class',
        subject: 'Computer Engineering',
    },
    {
        id: 6,
        appraisalId: 3,
        examination: 'Ph.D.',
        boardUniversity: 'IIT Delhi',
        yearOfPassing: 2008,
        percentage: null,
        grade: 'Distinction',
        subject: 'VLSI Design',
    },
    {
        id: 7,
        appraisalId: 3,
        examination: 'M.Tech',
        boardUniversity: 'IIT Bombay',
        yearOfPassing: 2002,
        percentage: 85.0,
        grade: 'First Class with Distinction',
        subject: 'Electronics Engineering',
    },
];

// ============================================
// PART A - EXPERIENCE
// ============================================
export const partAExperience = [
    {
        appraisalId: 1,
        teachingExpUg: 8.5,
        teachingExpPg: 5.0,
        industryExperience: 2.0,
        nonTeachingExperience: 0,
        siesExperience: 9.5,
        specialization: 'Machine Learning, Artificial Intelligence, Data Mining, Deep Learning',
    },
    {
        appraisalId: 2,
        teachingExpUg: 5.0,
        teachingExpPg: 2.0,
        industryExperience: 1.5,
        nonTeachingExperience: 0,
        siesExperience: 6.5,
        specialization: 'Data Science, Big Data Analytics, Cloud Computing',
    },
    {
        appraisalId: 3,
        teachingExpUg: 12.0,
        teachingExpPg: 10.0,
        industryExperience: 3.0,
        nonTeachingExperience: 1.0,
        siesExperience: 14.0,
        specialization: 'VLSI Design, Embedded Systems, IoT, Signal Processing',
    },
];

// ============================================
// PART B - RESEARCH JOURNALS (B1)
// ============================================
export const partBResearchJournals = [
    {
        id: 1,
        appraisalId: 1,
        title: 'Deep Learning Approaches for Sentiment Analysis in Social Media',
        journalName: 'International Journal of Machine Learning and Cybernetics',
        issn: '1868-8071',
        impactFactor: '3.844',
        authors: 'Dr. Akash Vishwakarma',
        coAuthors: 'Dr. Priya Menon, Dr. Rahul Jain',
        selfMarks: 8,
    },
    {
        id: 2,
        appraisalId: 1,
        title: 'Hybrid Neural Network Model for Stock Price Prediction',
        journalName: 'Expert Systems with Applications',
        issn: '0957-4174',
        impactFactor: '5.452',
        authors: 'Dr. Akash Vishwakarma',
        coAuthors: 'Dr. Anita Sharma',
        selfMarks: 10,
    },
    {
        id: 3,
        appraisalId: 2,
        title: 'Cloud-based Big Data Analytics Framework',
        journalName: 'Journal of Cloud Computing',
        issn: '2192-113X',
        impactFactor: '2.918',
        authors: 'Dr. Anita Sharma',
        coAuthors: 'Dr. Akash Vishwakarma',
        selfMarks: 7,
    },
    {
        id: 4,
        appraisalId: 3,
        title: 'Low Power VLSI Design Techniques for IoT Applications',
        journalName: 'IEEE Transactions on VLSI Systems',
        issn: '1063-8210',
        impactFactor: '2.458',
        authors: 'Dr. Rajesh Kumar',
        coAuthors: 'Dr. Suresh Patil',
        selfMarks: 12,
    },
];

// ============================================
// PART B - BOOKS/CHAPTERS (B2)
// ============================================
export const partBBooksChapters = [
    {
        id: 1,
        appraisalId: 1,
        publisher: 'Springer Nature',
        isbn: '978-3-030-12345-6',
        bookType: 'Book Chapter',
        title: 'Advanced Machine Learning Techniques',
        authors: 'Dr. Akash Vishwakarma',
        selfMarks: 5,
    },
    {
        id: 2,
        appraisalId: 3,
        publisher: 'Elsevier',
        isbn: '978-0-12-345678-9',
        bookType: 'Authored Book',
        title: 'VLSI Design: Principles and Applications',
        authors: 'Dr. Rajesh Kumar',
        selfMarks: 10,
    },
];

// ============================================
// PART B - RESEARCH PROJECTS (B6)
// ============================================
export const partBResearchProjects = [
    {
        id: 1,
        appraisalId: 1,
        sponsoredBy: 'DST-SERB',
        projectTitle: 'AI-based Healthcare Monitoring System',
        teamDetails: 'Dr. Akash Vishwakarma (PI), 2 Research Scholars',
        startDate: '2023-04-01',
        endDate: '2026-03-31',
        amount: 2500000,
        selfMarks: 10,
    },
    {
        id: 2,
        appraisalId: 3,
        sponsoredBy: 'AICTE',
        projectTitle: 'Smart Grid Monitoring using IoT',
        teamDetails: 'Dr. Rajesh Kumar (PI), Dr. Suresh Patil (Co-PI)',
        startDate: '2022-01-01',
        endDate: '2024-12-31',
        amount: 1500000,
        selfMarks: 8,
    },
];

// ============================================
// PART B - SEMINARS/CONFERENCES (B9)
// ============================================
export const partBSeminars = [
    {
        id: 1,
        appraisalId: 1,
        title: 'International Conference on Machine Learning (ICML 2024)',
        level: 'International',
        role: 'Paper Presenter',
        eventDate: '2024-07-15',
        selfMarks: 5,
    },
    {
        id: 2,
        appraisalId: 1,
        title: 'National Workshop on AI Applications',
        level: 'National',
        role: 'Resource Person',
        eventDate: '2024-09-20',
        selfMarks: 4,
    },
    {
        id: 3,
        appraisalId: 2,
        title: 'IEEE Conference on Big Data',
        level: 'International',
        role: 'Paper Presenter',
        eventDate: '2024-12-05',
        selfMarks: 5,
    },
    {
        id: 4,
        appraisalId: 3,
        title: 'International Conference on VLSI Design',
        level: 'International',
        role: 'Session Chair',
        eventDate: '2024-01-10',
        selfMarks: 6,
    },
];

// ============================================
// PART B - PATENTS (B10)
// ============================================
export const partBPatents = [
    {
        id: 1,
        appraisalId: 1,
        title: 'AI-based Disease Prediction System',
        patentNumber: '202121012345',
        status: 'Published',
        filingDate: '2021-03-15',
        selfMarks: 5,
    },
    {
        id: 2,
        appraisalId: 3,
        title: 'Low Power IoT Communication Protocol',
        patentNumber: '202021056789',
        status: 'Granted',
        filingDate: '2020-06-20',
        selfMarks: 10,
    },
];

// ============================================
// PART B - AWARDS (B11)
// ============================================
export const partBAwards = [
    {
        id: 1,
        appraisalId: 1,
        awardName: 'Best Research Paper Award',
        level: 'International',
        awardYear: 2024,
        selfMarks: 5,
    },
    {
        id: 2,
        appraisalId: 3,
        awardName: 'Outstanding Faculty Award',
        level: 'State',
        awardYear: 2024,
        selfMarks: 4,
    },
];

// ============================================
// PART B - MOOCS (B13)
// ============================================
export const partBMoocs = [
    {
        id: 1,
        appraisalId: 1,
        courseName: 'Deep Learning Specialization',
        platform: 'Coursera',
        duration: '4 months',
        certificateAvailable: true,
        selfMarks: 3,
    },
    {
        id: 2,
        appraisalId: 2,
        courseName: 'AWS Cloud Practitioner',
        platform: 'AWS',
        duration: '2 months',
        certificateAvailable: true,
        selfMarks: 3,
    },
];

// ============================================
// PART B - GUIDANCE (B14)
// ============================================
export const partBGuidance = [
    {
        id: 1,
        appraisalId: 1,
        studentName: 'Mr. Rahul Sharma',
        level: 'Ph.D.',
        topic: 'Deep Learning for Medical Image Analysis',
        year: 2024,
        status: 'Ongoing',
        selfMarks: 8,
    },
    {
        id: 2,
        appraisalId: 1,
        studentName: 'Ms. Priya Patel',
        level: 'M.Tech',
        topic: 'Natural Language Processing for Sentiment Analysis',
        year: 2024,
        status: 'Completed',
        selfMarks: 4,
    },
    {
        id: 3,
        appraisalId: 3,
        studentName: 'Mr. Amit Joshi',
        level: 'Ph.D.',
        topic: 'Low Power VLSI Design for Wearable Devices',
        year: 2023,
        status: 'Completed',
        selfMarks: 10,
    },
];

// ============================================
// PART C - KEY CONTRIBUTIONS
// ============================================
export const partCKeyContributions = [
    {
        appraisalId: 1,
        description: 'Established AI Research Lab in the department with state-of-the-art GPU servers. Organized 3 national level workshops on Machine Learning. Mentored 5 students for Smart India Hackathon reaching finals.',
        selfMarks: 20,
    },
    {
        appraisalId: 2,
        description: 'Developed online examination portal for the college. Conducted faculty development programs on Cloud Computing. Coordinated industry internship program.',
        selfMarks: 18,
    },
    {
        appraisalId: 3,
        description: 'Established MoU with 3 industries for collaborative research. Led accreditation team for NBA. Organized international conference on VLSI Design.',
        selfMarks: 22,
    },
];

// ============================================
// PART C - COMMITTEE ROLES
// ============================================
export const partCCommitteeRoles = [
    {
        id: 1,
        appraisalId: 1,
        committeeName: 'Examination Committee',
        period: '2023-2025',
        postHeld: 'Member',
        selfMarks: 5,
    },
    {
        id: 2,
        appraisalId: 1,
        committeeName: 'Research & Development Cell',
        period: '2022-2025',
        postHeld: 'Coordinator',
        selfMarks: 8,
    },
    {
        id: 3,
        appraisalId: 2,
        committeeName: 'IT Infrastructure Committee',
        period: '2023-2025',
        postHeld: 'Member',
        selfMarks: 5,
    },
    {
        id: 4,
        appraisalId: 3,
        committeeName: 'Academic Council',
        period: '2020-2025',
        postHeld: 'Member',
        selfMarks: 6,
    },
    {
        id: 5,
        appraisalId: 3,
        committeeName: 'NBA Accreditation Committee',
        period: '2023-2024',
        postHeld: 'Coordinator',
        selfMarks: 10,
    },
];

// ============================================
// PART C - PROFESSIONAL BODIES
// ============================================
export const partCProfessionalBodies = [
    {
        id: 1,
        appraisalId: 1,
        bodyName: 'IEEE',
        membershipType: 'Senior Member',
        postHeld: 'Member',
        selfMarks: 4,
    },
    {
        id: 2,
        appraisalId: 1,
        bodyName: 'ACM',
        membershipType: 'Professional Member',
        postHeld: 'Member',
        selfMarks: 3,
    },
    {
        id: 3,
        appraisalId: 3,
        bodyName: 'IEEE',
        membershipType: 'Senior Member',
        postHeld: 'Executive Committee Member',
        selfMarks: 6,
    },
];

// ============================================
// PART C - STUDENT FEEDBACK
// ============================================
export const partCStudentFeedback = [
    {
        appraisalId: 1,
        averageRating: 4.5,
        convertedMarks: 22.5,
        feedbackFile: null,
    },
    {
        appraisalId: 2,
        averageRating: 4.2,
        convertedMarks: 21.0,
        feedbackFile: null,
    },
    {
        appraisalId: 3,
        averageRating: 4.8,
        convertedMarks: 24.0,
        feedbackFile: null,
    },
];

// ============================================
// PART D - VALUES
// ============================================
export const partDValues = [
    {
        appraisalId: 1,
        attendance: 5,
        responsibility: 4,
        honesty: 5,
        teamwork: 4,
        inclusiveness: 4,
        conduct: 5,
    },
    {
        appraisalId: 2,
        attendance: 4,
        responsibility: 4,
        honesty: 5,
        teamwork: 4,
        inclusiveness: 4,
        conduct: 4,
    },
    {
        appraisalId: 3,
        attendance: 5,
        responsibility: 5,
        honesty: 5,
        teamwork: 4,
        inclusiveness: 5,
        conduct: 4,
    },
];

// ============================================
// PART E - SELF ASSESSMENT
// ============================================
export const partESelfAssessment = [
    {
        appraisalId: 1,
        selfSummary: 'During this academic year, I have focused on advancing my research in Machine Learning and AI applications in healthcare. I have successfully published 2 research papers in high-impact journals and filed a patent. I have also contributed significantly to the department by establishing an AI Research Lab and mentoring students for various hackathons.',
        goals: '1. Complete ongoing PhD guidance and publish 2 more research papers\n2. Secure a major research grant from DST\n3. Develop industry collaboration for applied AI research\n4. Conduct FDP on Advanced Machine Learning\n5. Submit patent for AI-based healthcare system',
    },
    {
        appraisalId: 2,
        selfSummary: 'This year I have contributed to the academic and administrative growth of the college. I developed an online examination portal that is now being used across all departments. I also completed AWS certification and organized faculty development programs.',
        goals: '1. Complete Ph.D. research work\n2. Publish 2 research papers in SCI indexed journals\n3. Develop more automation tools for the college\n4. Conduct workshops on Cloud Computing\n5. Industry collaboration for student placements',
    },
    {
        appraisalId: 3,
        selfSummary: 'As a senior faculty member, I have focused on building institutional partnerships and ensuring academic excellence. I led the NBA accreditation process and established 3 new MoUs with industries. My PhD scholar successfully defended his thesis this year.',
        goals: '1. Complete ongoing research project\n2. Guide 2 more PhD scholars\n3. Publish a textbook on Advanced VLSI Design\n4. Organize international conference\n5. Establish Center of Excellence in IoT',
    },
];

// ============================================
// ATTACHMENTS
// ============================================
export const attachments = [
    {
        id: 1,
        appraisalId: 1,
        sectionCode: 'B1',
        recordId: 1,
        fileName: 'research_paper_1.pdf',
        filePath: '/uploads/1/research_paper_1.pdf',
        uploadedBy: 1,
        uploadedAt: '2025-04-10',
    },
    {
        id: 2,
        appraisalId: 1,
        sectionCode: 'B6',
        recordId: 1,
        fileName: 'project_sanction_letter.pdf',
        filePath: '/uploads/1/project_sanction_letter.pdf',
        uploadedBy: 1,
        uploadedAt: '2025-04-12',
    },
];

// ============================================
// AUDIT LOGS
// ============================================
export const auditLogs = [
    {
        id: 1,
        appraisalId: 1,
        action: 'CREATED',
        performedBy: 1,
        performedAt: '2025-04-05 10:30:00',
        oldData: null,
        newData: { status: 'DRAFT' },
    },
    {
        id: 2,
        appraisalId: 2,
        action: 'SUBMITTED',
        performedBy: 2,
        performedAt: '2025-05-10 14:45:00',
        oldData: { status: 'DRAFT' },
        newData: { status: 'SUBMITTED' },
    },
    {
        id: 3,
        appraisalId: 3,
        action: 'HOD_REVIEWED',
        performedBy: 5,
        performedAt: '2025-05-08 16:20:00',
        oldData: { status: 'SUBMITTED' },
        newData: { status: 'HOD_REVIEWED', hodRemarks: 'Excellent research contributions.' },
    },
];

// ============================================
// NOTIFICATIONS
// ============================================
export const notifications = [
    {
        id: 1,
        userId: 1,
        title: 'Appraisal Cycle Started',
        message: 'The appraisal cycle for 2025-2026 has started. Please submit your appraisal before the deadline.',
        type: 'info',
        read: false,
        createdAt: '2025-04-01',
    },
    {
        id: 2,
        userId: 4,
        title: 'New Appraisal Submitted',
        message: 'Dr. Anita Sharma has submitted her appraisal for review.',
        type: 'action',
        read: false,
        createdAt: '2025-05-10',
    },
    {
        id: 3,
        userId: 6,
        title: 'HOD Review Completed',
        message: 'Dr. Rajesh Kumar appraisal has been reviewed by HOD and is pending your review.',
        type: 'action',
        read: true,
        createdAt: '2025-05-08',
    },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
export function getUserById(id) {
    return users.find(u => u.id === id);
}

export function getUserByEmail(email) {
    return users.find(u => u.email === email);
}

export function getAppraisalsByTeacherId(teacherId) {
    return appraisals.filter(a => a.teacherId === teacherId);
}

export function getAppraisalById(id) {
    return appraisals.find(a => a.id === id);
}

export function getCurrentCycle() {
    return appraisalCycles.find(c => c.isOpen);
}

export function getAppraisalsByDepartment(department) {
    const deptTeachers = users.filter(u => u.department === department && u.role === 'TEACHER');
    const teacherIds = deptTeachers.map(t => t.id);
    return appraisals.filter(a => teacherIds.includes(a.teacherId));
}

export function getAppraisalsByStatus(status) {
    return appraisals.filter(a => a.status === status);
}

export function getAllAppraisalsWithDetails() {
    return appraisals.map(a => {
        const teacher = getUserById(a.teacherId);
        const cycle = appraisalCycles.find(c => c.id === a.cycleId);
        return {
            ...a,
            teacher,
            cycle,
        };
    });
}
