'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useAppraisal } from '@/lib/context/AppraisalContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Alert from '@/components/ui/Alert';
import Modal, { SuccessModal } from '@/components/ui/Modal';
import ProgressBar from '@/components/ui/ProgressBar';
import FileUpload from '@/components/ui/FileUpload';
import {
  Save,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  CheckCircle,
  BookOpen,
  FileText,
  Lightbulb,
  Users,
  Presentation,
  Award,
  Video,
  GraduationCap,
  Beaker,
  Building,
  Globe,
  Pencil,
  Eye,
  AlertCircle,
  Upload,
  Paperclip,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { PART_B_CAPS, PART_B_TOTAL_MAX, calculatePartB } from '@/lib/calculations';

// Category groupings for better organization
const sectionCategories = {
  publications: {
    title: 'Publications',
    keys: ['researchJournals', 'booksChapters', 'editedBooks'],
  },
  research: {
    title: 'Research & Projects',
    keys: ['researchProjects', 'consultancy', 'patents', 'guidance'],
  },
  development: {
    title: 'Professional Development',
    keys: ['developmentPrograms', 'seminars', 'moocs'],
  },
  recognition: {
    title: 'Recognition & Content',
    keys: ['awards', 'econtent'],
  },
};

// Subsection configurations with document requirements
const subsections = {
  researchJournals: {
    title: 'Research Publications in Journals',
    shortTitle: 'Research Publications',
    description: 'Publications in peer-reviewed journals with impact factor',
    icon: FileText,
    color: 'blue',
    documentRequired: true,
    documentLabel: 'Publication Proof (First page of paper/Acceptance Letter)',
    documentHelp: 'Upload PDF of the published paper or acceptance letter from journal',
    fields: [
      { key: 'title', label: 'Paper Title', placeholder: 'Title of the research paper', fullWidth: true, type: 'textarea', required: true },
      { key: 'journalName', label: 'Journal Name', placeholder: 'Name of the journal', required: true },
      { key: 'issn', label: 'ISSN', placeholder: 'e.g., 1234-5678', required: true },
      { key: 'impactFactor', label: 'Impact Factor', placeholder: 'e.g., 3.5' },
      { key: 'authors', label: 'Authors', placeholder: 'Main author(s)', required: true },
      { key: 'coAuthors', label: 'Co-Authors', placeholder: 'Co-author names' },
      { key: 'publicationYear', label: 'Year', type: 'number', placeholder: 'e.g., 2025', required: true },
      { key: 'doi', label: 'DOI', placeholder: 'e.g., 10.1234/journal.2025' },
      { key: 'volumeIssue', label: 'Volume/Issue', placeholder: 'e.g., Vol. 10, Issue 2' },
      { key: 'pageNumbers', label: 'Page Numbers', placeholder: 'e.g., 123-145' },
    ],
    displayFields: ['title', 'journalName', 'issn'],
  },
  booksChapters: {
    title: 'Books / Book Chapters',
    shortTitle: 'Books / Chapters',
    description: 'Authored books or book chapters with ISBN',
    icon: BookOpen,
    color: 'emerald',
    documentRequired: true,
    documentLabel: 'Book/Chapter Proof (Cover page with ISBN)',
    documentHelp: 'Upload PDF of book cover showing ISBN or publisher acknowledgment',
    fields: [
      { key: 'title', label: 'Book/Chapter Title', placeholder: 'Title', fullWidth: true, required: true },
      { key: 'publisher', label: 'Publisher', placeholder: 'e.g., Springer, Elsevier', required: true },
      { key: 'isbn', label: 'ISBN', placeholder: 'e.g., 978-3-030-12345-6', required: true },
      {
        key: 'bookType', label: 'Type', type: 'select', required: true, options: [
          { value: 'Authored Book', label: 'Authored Book' },
          { value: 'Book Chapter', label: 'Book Chapter' },
          { value: 'Edited Book', label: 'Edited Book' },
        ]
      },
      { key: 'authors', label: 'Authors', placeholder: 'Author names', required: true },
      { key: 'year', label: 'Year', type: 'number', placeholder: 'e.g., 2025', required: true },
      { key: 'chapterNumber', label: 'Chapter No. (if chapter)', placeholder: 'e.g., Chapter 5' },
      { key: 'pages', label: 'Pages', placeholder: 'e.g., 45-78' },
    ],
    displayFields: ['title', 'publisher', 'bookType'],
  },
  editedBooks: {
    title: 'Edited Books',
    shortTitle: 'Edited Books',
    description: 'Books where you served as editor',
    icon: Pencil,
    color: 'purple',
    documentRequired: true,
    documentLabel: 'Editor Acknowledgment/Book Cover',
    documentHelp: 'Upload PDF showing you as editor with ISBN',
    fields: [
      { key: 'chapterTitle', label: 'Chapter Title', placeholder: 'Chapter title', fullWidth: true, required: true },
      { key: 'bookTitle', label: 'Book Title', placeholder: 'Book title', required: true },
      { key: 'publisher', label: 'Publisher', placeholder: 'Publisher name', required: true },
      { key: 'isbn', label: 'ISBN', placeholder: 'ISBN number', required: true },
      { key: 'year', label: 'Year', type: 'number', placeholder: 'e.g., 2025', required: true },
    ],
    displayFields: ['chapterTitle', 'bookTitle', 'publisher'],
  },
  researchProjects: {
    title: 'Research Projects',
    shortTitle: 'Research Projects',
    description: 'Sponsored research projects and grants',
    icon: Beaker,
    color: 'amber',
    documentRequired: true,
    documentLabel: 'Project Sanction Letter/Grant Document',
    documentHelp: 'Upload sanction letter or grant approval document from funding agency',
    fields: [
      { key: 'projectTitle', label: 'Project Title', placeholder: 'Title of the project', fullWidth: true, type: 'textarea', required: true },
      { key: 'sponsoredBy', label: 'Sponsored By', placeholder: 'e.g., DST-SERB, AICTE', required: true },
      { key: 'projectNumber', label: 'Project/Grant Number', placeholder: 'e.g., DST/2025/001' },
      { key: 'teamDetails', label: 'Team Details', placeholder: 'PI and team members', required: true },
      { key: 'startDate', label: 'Start Date', type: 'date', required: true },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'amount', label: 'Grant Amount (₹)', type: 'number', placeholder: 'Amount in rupees', required: true },
      {
        key: 'status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Ongoing', label: 'Ongoing' },
          { value: 'Completed', label: 'Completed' },
        ]
      },
    ],
    displayFields: ['projectTitle', 'sponsoredBy', 'status'],
  },
  consultancy: {
    title: 'Consultancy',
    shortTitle: 'Consultancy',
    description: 'Consultancy projects with industries/organizations',
    icon: Building,
    color: 'slate',
    documentRequired: true,
    documentLabel: 'Consultancy Agreement/MoU',
    documentHelp: 'Upload consultancy agreement, MoU, or payment receipt',
    fields: [
      { key: 'organization', label: 'Organization', placeholder: 'Client organization', required: true },
      { key: 'natureOfWork', label: 'Nature of Work', placeholder: 'Description of work', type: 'textarea', fullWidth: true, required: true },
      { key: 'duration', label: 'Duration', placeholder: 'e.g., 6 months', required: true },
      { key: 'amount', label: 'Amount (₹)', type: 'number', required: true },
      { key: 'year', label: 'Year', type: 'number', placeholder: 'e.g., 2025', required: true },
    ],
    displayFields: ['organization', 'natureOfWork', 'amount'],
  },
  developmentPrograms: {
    title: 'Faculty Development Programs',
    shortTitle: 'FDPs',
    description: 'FDPs attended or organized',
    icon: Users,
    color: 'indigo',
    documentRequired: true,
    documentLabel: 'FDP Certificate',
    documentHelp: 'Upload completion/participation certificate from the FDP',
    fields: [
      { key: 'programName', label: 'Program Name', placeholder: 'Name of the FDP', fullWidth: true, required: true },
      { key: 'organizer', label: 'Organizer', placeholder: 'Organizing institution', required: true },
      { key: 'duration', label: 'Duration', placeholder: 'e.g., 5 days', required: true },
      {
        key: 'role', label: 'Role', type: 'select', required: true, options: [
          { value: 'Participant', label: 'Participant' },
          { value: 'Resource Person', label: 'Resource Person' },
          { value: 'Coordinator', label: 'Coordinator' },
        ]
      },
      { key: 'date', label: 'Date', type: 'date', required: true },
    ],
    displayFields: ['programName', 'organizer', 'role'],
  },
  seminars: {
    title: 'Seminars / Conferences',
    shortTitle: 'Seminars / Conf.',
    description: 'Paper presentations and participation in conferences',
    icon: Presentation,
    color: 'rose',
    documentRequired: true,
    documentLabel: 'Conference Certificate/Proceedings',
    documentHelp: 'Upload presentation certificate or conference proceedings',
    fields: [
      { key: 'title', label: 'Paper/Event Title', placeholder: 'Title of paper or event', fullWidth: true, type: 'textarea', required: true },
      { key: 'eventName', label: 'Conference/Seminar Name', placeholder: 'Name of the event', required: true },
      {
        key: 'level', label: 'Level', type: 'select', required: true, options: [
          { value: 'International', label: 'International' },
          { value: 'National', label: 'National' },
          { value: 'State', label: 'State' },
          { value: 'Regional', label: 'Regional' },
        ]
      },
      {
        key: 'role', label: 'Role', type: 'select', required: true, options: [
          { value: 'Paper Presenter', label: 'Paper Presenter' },
          { value: 'Resource Person', label: 'Resource Person' },
          { value: 'Session Chair', label: 'Session Chair' },
          { value: 'Organizer', label: 'Organizer' },
          { value: 'Participant', label: 'Participant' },
        ]
      },
      { key: 'eventDate', label: 'Date', type: 'date', required: true },
      { key: 'location', label: 'Location', placeholder: 'City, Country', required: true },
    ],
    displayFields: ['title', 'eventName', 'level'],
  },
  patents: {
    title: 'Patents',
    shortTitle: 'Patents',
    description: 'Filed, published, or granted patents',
    icon: Lightbulb,
    color: 'yellow',
    documentRequired: true,
    documentLabel: 'Patent Filing/Grant Certificate',
    documentHelp: 'Upload patent filing receipt or grant certificate from patent office',
    fields: [
      { key: 'title', label: 'Patent Title', placeholder: 'Title of the patent', fullWidth: true, type: 'textarea', required: true },
      { key: 'patentNumber', label: 'Patent/Application Number', placeholder: 'e.g., 202121012345', required: true },
      {
        key: 'status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Filed', label: 'Filed' },
          { value: 'Published', label: 'Published' },
          { value: 'Granted', label: 'Granted' },
        ]
      },
      { key: 'filingDate', label: 'Filing Date', type: 'date', required: true },
      { key: 'inventors', label: 'Inventors', placeholder: 'Names of inventors', required: true },
      { key: 'patentOffice', label: 'Patent Office', placeholder: 'e.g., Indian Patent Office' },
    ],
    displayFields: ['title', 'patentNumber', 'status'],
  },
  awards: {
    title: 'Awards & Recognition',
    shortTitle: 'Awards',
    description: 'Academic awards and recognitions received',
    icon: Award,
    color: 'orange',
    documentRequired: true,
    documentLabel: 'Award Certificate',
    documentHelp: 'Upload certificate or official award letter',
    fields: [
      { key: 'awardName', label: 'Award Name', placeholder: 'Name of the award', fullWidth: true, required: true },
      {
        key: 'level', label: 'Level', type: 'select', required: true, options: [
          { value: 'International', label: 'International' },
          { value: 'National', label: 'National' },
          { value: 'State', label: 'State' },
          { value: 'Institution', label: 'Institution' },
        ]
      },
      { key: 'awardYear', label: 'Year', type: 'number', placeholder: 'e.g., 2025', required: true },
      { key: 'awardedBy', label: 'Awarded By', placeholder: 'Awarding organization', required: true },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description of the award' },
    ],
    displayFields: ['awardName', 'awardedBy', 'level'],
  },
  econtent: {
    title: 'E-Content Development',
    shortTitle: 'E-Content',
    description: 'Online courses, video lectures, and digital content',
    icon: Video,
    color: 'cyan',
    documentRequired: true,
    documentLabel: 'E-Content Proof (Screenshot/Certificate)',
    documentHelp: 'Upload screenshot of published content or platform acknowledgment',
    fields: [
      { key: 'title', label: 'Content Title', placeholder: 'Title of the content', fullWidth: true, required: true },
      {
        key: 'contentType', label: 'Content Type', type: 'select', required: true, options: [
          { value: 'Video Lecture', label: 'Video Lecture' },
          { value: 'E-Book', label: 'E-Book' },
          { value: 'MOOC Module', label: 'MOOC Module' },
          { value: 'Online Course', label: 'Online Course' },
        ]
      },
      { key: 'platform', label: 'Platform', placeholder: 'e.g., YouTube, NPTEL, Coursera', required: true },
      { key: 'contentLink', label: 'Link/URL', placeholder: 'URL to the content', required: true },
      { key: 'description', label: 'Description', placeholder: 'Brief description', type: 'textarea' },
    ],
    displayFields: ['title', 'contentType', 'platform'],
  },
  moocs: {
    title: 'MOOCs Completed',
    shortTitle: 'MOOCs',
    description: 'Massive Open Online Courses completed',
    icon: Globe,
    color: 'teal',
    documentRequired: true,
    documentLabel: 'MOOC Completion Certificate',
    documentHelp: 'Upload course completion certificate from the platform',
    fields: [
      { key: 'courseName', label: 'Course Name', placeholder: 'Name of the course', fullWidth: true, required: true },
      { key: 'platform', label: 'Platform', placeholder: 'e.g., Coursera, edX, NPTEL', required: true },
      { key: 'duration', label: 'Duration', placeholder: 'e.g., 8 weeks', required: true },
      { key: 'completionDate', label: 'Completion Date', type: 'date', required: true },
      { key: 'certificateId', label: 'Certificate ID', placeholder: 'Certificate verification ID' },
      {
        key: 'certificateAvailable', label: 'Certificate Obtained', type: 'select', required: true, options: [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' },
        ]
      },
    ],
    displayFields: ['courseName', 'platform', 'duration'],
  },
  guidance: {
    title: 'Research Guidance',
    shortTitle: 'Research Guidance',
    description: 'Ph.D., M.Tech, and M.Phil guidance',
    icon: GraduationCap,
    color: 'violet',
    documentRequired: true,
    documentLabel: 'Research Guide Allotment Letter',
    documentHelp: 'Upload university guide allotment letter or completion certificate',
    fields: [
      { key: 'studentName', label: 'Student Name', placeholder: 'Name of the student', required: true },
      {
        key: 'level', label: 'Level', type: 'select', required: true, options: [
          { value: 'Ph.D.', label: 'Ph.D.' },
          { value: 'M.Tech', label: 'M.Tech' },
          { value: 'M.Phil', label: 'M.Phil' },
          { value: 'M.E.', label: 'M.E.' },
        ]
      },
      { key: 'topic', label: 'Research Topic', placeholder: 'Title of the thesis', fullWidth: true, type: 'textarea', required: true },
      { key: 'university', label: 'University', placeholder: 'Affiliated university', required: true },
      { key: 'registrationNumber', label: 'Registration Number', placeholder: 'Student registration number' },
      { key: 'year', label: 'Year', type: 'number', placeholder: 'e.g., 2025', required: true },
      {
        key: 'status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Ongoing', label: 'Ongoing' },
          { value: 'Completed', label: 'Completed' },
        ]
      },
    ],
    displayFields: ['studentName', 'level', 'topic'],
  },
};

// Color classes helper
const getColorClasses = (color) => {
  const colors = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700', ring: 'ring-blue-500' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', ring: 'ring-emerald-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700', ring: 'ring-purple-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700', ring: 'ring-amber-500' },
    slate: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-600', badge: 'bg-slate-200 text-slate-700', ring: 'ring-slate-500' },
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700', ring: 'ring-indigo-500' },
    rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', badge: 'bg-rose-100 text-rose-700', ring: 'ring-rose-500' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700', ring: 'ring-yellow-500' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700', ring: 'ring-orange-500' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600', badge: 'bg-cyan-100 text-cyan-700', ring: 'ring-cyan-500' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600', badge: 'bg-teal-100 text-teal-700', ring: 'ring-teal-500' },
    violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600', badge: 'bg-violet-100 text-violet-700', ring: 'ring-violet-500' },
  };
  return colors[color] || colors.blue;
};

// Entry Card Component - Simplified
function EntryCard({ item, config, onEdit, onDelete, onView, disabled }) {
  const colorClasses = getColorClasses(config.color);
  const Icon = config.icon;
  const primaryField = config.displayFields[0];
  const primaryValue = item[primaryField] || 'Untitled Entry';

  return (
    <div className={`group rounded-xl border ${colorClasses.border} bg-white p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start gap-3">
        <div className={`shrink-0 rounded-lg p-2 ${colorClasses.badge}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 text-sm leading-snug line-clamp-2">
            {primaryValue}
          </h4>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {config.displayFields.slice(1).map(field => {
              const value = item[field];
              if (!value) return null;
              return (
                <span
                  key={field}
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-slate-100 text-slate-600"
                >
                  {value.toString().length > 20 ? value.toString().substring(0, 20) + '...' : value}
                </span>
              );
            })}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <span className={`text-lg font-bold ${colorClasses.text}`}>{item.selfMarks || 0}</span>
          <span className="text-xs text-slate-400 ml-0.5">pts</span>
        </div>
      </div>

      {/* Document status + Actions */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        {item.document ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600">
            <CheckCircle size={12} />
            <span className="truncate max-w-32">{item.document.name}</span>
          </span>
        ) : config.documentRequired ? (
          <span className="flex items-center gap-1.5 text-xs text-amber-500">
            <AlertCircle size={12} />
            No document
          </span>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(item)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="View Details"
          >
            <Eye size={14} />
          </button>
          {!disabled && (
            <>
              <button
                onClick={() => onEdit(item)}
                className="p-1.5 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// View Details Modal - Compact
function ViewDetailsModal({ isOpen, onClose, item, config }) {
  if (!item || !config) return null;

  const colorClasses = getColorClasses(config.color);
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Entry Details" size="lg">
      <div className="space-y-4">
        {/* Header */}
        <div className={`flex items-center gap-3 p-4 rounded-xl ${colorClasses.bg} border ${colorClasses.border}`}>
          <div className={`rounded-lg p-2.5 ${colorClasses.badge}`}>
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500">{config.title}</p>
            <p className={`text-2xl font-bold ${colorClasses.text}`}>{item.selfMarks || 0} <span className="text-sm font-normal text-slate-400">points</span></p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config.fields.map(field => {
            const value = item[field.key];
            if (!value && value !== 0) return null;

            return (
              <div key={field.key} className={field.fullWidth ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  {field.label}
                </label>
                <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-900">
                  {value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Document Section */}
        {item.document && (
          <div className="border-t pt-4">
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Uploaded Document
            </label>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <Paperclip size={16} className="text-emerald-600" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-900 truncate">{item.document.name}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(item.document.url, '_blank')}
              >
                View
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Add/Edit Form Modal - Cleaner Layout
function EntryFormModal({ isOpen, onClose, onSave, item, config, isEditing, sectionKey }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({ ...item });
      } else {
        const initial = {};
        config.fields.forEach(f => { initial[f.key] = ''; });
        initial.selfMarks = '';
        initial.document = null;
        setFormData(initial);
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, item, config]);

  const validateField = (key, value, field) => {
    if (field?.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }
    if (key === 'selfMarks') {
      const maxMarks = PART_B_CAPS[sectionKey]?.max || 15;
      if (value && (parseFloat(value) < 0 || parseFloat(value) > maxMarks)) {
        return `Marks must be between 0 and ${maxMarks}`;
      }
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    config.fields.forEach(field => {
      const error = validateField(field.key, formData[field.key], field);
      if (error) newErrors[field.key] = error;
    });
    if (!formData.selfMarks || formData.selfMarks === '') {
      newErrors.selfMarks = 'Self Marks is required';
    }
    if (config.documentRequired && !formData.document) {
      newErrors.document = 'Document is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (key) => {
    setTouched(prev => ({ ...prev, [key]: true }));
    const field = config.fields.find(f => f.key === key);
    const error = validateField(key, formData[key], field);
    setErrors(prev => ({ ...prev, [key]: error }));
  };

  const handleSubmit = () => {
    const allTouched = {};
    config.fields.forEach(f => { allTouched[f.key] = true; });
    allTouched.selfMarks = true;
    allTouched.document = true;
    setTouched(allTouched);

    if (validateForm()) {
      const data = { ...formData };
      if (!isEditing) {
        data.id = Date.now();
      }
      onSave(data);
      onClose();
    }
  };

  const colorClasses = getColorClasses(config.color);
  const Icon = config.icon;
  const maxMarks = PART_B_CAPS[sectionKey]?.max || 15;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Entry` : `Add New Entry`}
      size="xl"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} icon={isEditing ? Save : Plus}>
            {isEditing ? 'Save Changes' : 'Add Entry'}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Section Header - Compact */}
        <div className={`flex items-center gap-3 p-3 rounded-lg ${colorClasses.bg} border ${colorClasses.border}`}>
          <div className={`rounded-lg p-2 ${colorClasses.badge}`}>
            <Icon size={18} />
          </div>
          <div>
            <p className="font-medium text-slate-900 text-sm">{config.title}</p>
            <p className="text-xs text-slate-500">{config.description}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.fields.map(field => (
            <div key={field.key} className={field.fullWidth ? 'md:col-span-2' : ''}>
              {field.type === 'textarea' ? (
                <Textarea
                  label={field.label}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  onBlur={() => handleBlur(field.key)}
                  placeholder={field.placeholder}
                  rows={2}
                  required={field.required}
                  error={touched[field.key] && errors[field.key]}
                />
              ) : field.type === 'select' ? (
                <Select
                  label={field.label}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  onBlur={() => handleBlur(field.key)}
                  required={field.required}
                  error={touched[field.key] && errors[field.key]}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              ) : (
                <Input
                  label={field.label}
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  onBlur={() => handleBlur(field.key)}
                  placeholder={field.placeholder}
                  required={field.required}
                  error={touched[field.key] && errors[field.key]}
                />
              )}
            </div>
          ))}
        </div>

        {/* Document Upload + Self Marks Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Document Upload */}
          <div className={`md:col-span-2 p-4 rounded-lg border ${touched.document && errors.document ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Upload size={16} className="text-slate-500" />
              <label className="text-sm font-medium text-slate-700">
                {config.documentLabel}
                {config.documentRequired && <span className="ml-1 text-red-500">*</span>}
              </label>
            </div>
            <FileUpload
              value={formData.document}
              onChange={(doc) => {
                setFormData({ ...formData, document: doc });
                setTouched(prev => ({ ...prev, document: true }));
                if (doc) setErrors(prev => ({ ...prev, document: null }));
              }}
              required={config.documentRequired}
              error={touched.document && errors.document}
              helperText={config.documentHelp}
              maxSize={10}
            />
          </div>

          {/* Self Marks */}
          <div className={`p-4 rounded-lg ${colorClasses.bg} border ${colorClasses.border}`}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Self Marks <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              step="0.5"
              min="0"
              max={maxMarks}
              value={formData.selfMarks || ''}
              onChange={(e) => setFormData({ ...formData, selfMarks: e.target.value })}
              onBlur={() => handleBlur('selfMarks')}
              placeholder={`0 - ${maxMarks}`}
              error={touched.selfMarks && errors.selfMarks}
            />
            <p className="text-xs text-slate-500 mt-1.5">Max: {maxMarks} pts</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Main Subsection Component - Simplified
function Subsection({ sectionKey, config, data, onChange, disabled, maxMarks }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const colorClasses = getColorClasses(config.color);
  const Icon = config.icon;

  const currentTotal = data.reduce((sum, item) => sum + (parseFloat(item.selfMarks) || 0), 0);
  const cappedTotal = Math.min(currentTotal, maxMarks);
  const entriesWithDocs = data.filter(item => item.document).length;

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleView = (item) => {
    setViewingItem(item);
    setShowViewModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      onChange(data.filter(item => item.id !== id));
    }
  };

  const handleSave = (newItem) => {
    if (editingItem) {
      onChange(data.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      onChange([...data, newItem]);
    }
    setEditingItem(null);
  };

  return (
    <div className="space-y-4">
      {/* Section Header - Compact */}
      <div className={`rounded-xl border ${colorClasses.border} ${colorClasses.bg} p-4`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`shrink-0 rounded-lg p-2.5 ${colorClasses.badge}`}>
              <Icon size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{config.title}</h3>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span>{data.length} entries</span>
                {data.length > 0 && (
                  <>
                    <span>•</span>
                    <span className={entriesWithDocs === data.length ? 'text-emerald-600' : 'text-amber-500'}>
                      {entriesWithDocs}/{data.length} docs
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Score Display */}
            <div className="text-right">
              <div className="flex items-baseline gap-0.5">
                <span className={`text-2xl font-bold ${colorClasses.text}`}>{cappedTotal}</span>
                <span className="text-sm text-slate-400">/{maxMarks}</span>
              </div>
              {currentTotal > maxMarks && (
                <p className="text-xs text-amber-500">Capped</p>
              )}
            </div>

            {/* Add Button */}
            {!disabled && (
              <Button
                icon={Plus}
                onClick={() => { setEditingItem(null); setShowAddModal(true); }}
                size="sm"
              >
                Add
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <ProgressBar value={cappedTotal} max={maxMarks} showLabel={false} size="sm" />
        </div>
      </div>

      {/* Entries Grid */}
      {data.length === 0 ? (
        <div className={`rounded-xl border-2 border-dashed ${colorClasses.border} p-8 text-center`}>
          <Icon size={32} className={`${colorClasses.text} opacity-40 mx-auto mb-3`} />
          <p className="text-slate-600 font-medium mb-1">No entries yet</p>
          <p className="text-sm text-slate-400 mb-4">Add your {config.title.toLowerCase()}</p>
          {!disabled && (
            <Button
              variant="secondary"
              icon={Plus}
              size="sm"
              onClick={() => { setEditingItem(null); setShowAddModal(true); }}
            >
              Add First Entry
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {data.map(item => (
            <EntryCard
              key={item.id}
              item={item}
              config={config}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              disabled={disabled}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <EntryFormModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingItem(null); }}
        onSave={handleSave}
        item={editingItem}
        config={config}
        isEditing={!!editingItem}
        sectionKey={sectionKey}
      />

      <ViewDetailsModal
        isOpen={showViewModal}
        onClose={() => { setShowViewModal(false); setViewingItem(null); }}
        item={viewingItem}
        config={config}
      />
    </div>
  );
}

// Main Page Component
export default function PartBPage() {
  const { user } = useAuth();
  const { getCurrentAppraisal, getFullAppraisalData, savePartBSection, recalculateTotals } = useAppraisal();

  const appraisal = user ? getCurrentAppraisal(user.id) : null;
  const fullData = appraisal ? getFullAppraisalData(appraisal.id) : null;
  const isReadOnly = appraisal?.status !== 'DRAFT';

  const [activeSection, setActiveSection] = useState('researchJournals');
  const [activeCategory, setActiveCategory] = useState('publications');
  const [partBData, setPartBData] = useState({
    researchJournals: [],
    booksChapters: [],
    editedBooks: [],
    researchProjects: [],
    consultancy: [],
    developmentPrograms: [],
    seminars: [],
    patents: [],
    awards: [],
    econtent: [],
    moocs: [],
    guidance: [],
  });

  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (fullData?.partB && !dataLoaded) {
      setPartBData(prev => ({ ...prev, ...fullData.partB }));
      setDataLoaded(true);
    }
  }, [fullData, dataLoaded]);

  const handleSectionChange = (section, data) => {
    setPartBData(prev => ({ ...prev, [section]: data }));
  };

  const handleSave = async () => {
    if (!appraisal) return;
    setSaving(true);
    try {
      Object.entries(partBData).forEach(([section, records]) => {
        savePartBSection(appraisal.id, section, records);
      });
      recalculateTotals(appraisal.id);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const calculation = calculatePartB(partBData);

  const getSectionScore = (key) => {
    const data = partBData[key] || [];
    const total = data.reduce((sum, item) => sum + (parseFloat(item.selfMarks) || 0), 0);
    const max = PART_B_CAPS[key]?.max || 15;
    return Math.min(total, max);
  };

  const getSectionCount = (key) => (partBData[key] || []).length;

  // Calculate category totals
  const getCategoryScore = (categoryKeys) => {
    return categoryKeys.reduce((sum, key) => sum + getSectionScore(key), 0);
  };

  const getCategoryMax = (categoryKeys) => {
    return categoryKeys.reduce((sum, key) => sum + (PART_B_CAPS[key]?.max || 15), 0);
  };

  // Document compliance
  const totalEntries = Object.values(partBData).reduce((sum, arr) => sum + arr.length, 0);
  const totalWithDocs = Object.values(partBData).reduce((sum, arr) => sum + arr.filter(item => item.document).length, 0);
  const docCompliance = totalEntries > 0 ? Math.round((totalWithDocs / totalEntries) * 100) : 100;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-5">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/appraisal" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-2">
              <ArrowLeft size={16} />
              Back to Overview
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Part B: Research & Academic</h1>
            <p className="text-slate-500 text-sm mt-0.5">Maximum 120 marks across all subsections</p>
          </div>

          <div className="flex items-center gap-3">
            {!isReadOnly && (
              <Button onClick={handleSave} loading={saving} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Save size={16} className="mr-1.5" />
                Save Part B
              </Button>
            )}
          </div>
        </div>

        {isReadOnly && (
          <Alert variant="info">
            This appraisal has been submitted and is now read-only.
          </Alert>
        )}

        {/* Score Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Total Score */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-600">{calculation.total}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">Total Score</span>
                  <span className="text-sm text-slate-400">{calculation.total}/{PART_B_TOTAL_MAX}</span>
                </div>
                <ProgressBar value={calculation.total} max={PART_B_TOTAL_MAX} showLabel={false} size="sm" />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-12 bg-slate-200" />

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-xl font-bold text-slate-900">{totalEntries}</p>
                <p className="text-slate-500">Entries</p>
              </div>
              <div className="text-center">
                <p className={`text-xl font-bold ${docCompliance === 100 ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {docCompliance}%
                </p>
                <p className="text-slate-500">Docs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {Object.entries(sectionCategories).map(([catKey, cat]) => {
              const isActive = activeCategory === catKey;
              const catScore = getCategoryScore(cat.keys);
              const catMax = getCategoryMax(cat.keys);
              const catCount = cat.keys.reduce((sum, k) => sum + getSectionCount(k), 0);

              return (
                <button
                  key={catKey}
                  onClick={() => {
                    setActiveCategory(catKey);
                    setActiveSection(cat.keys[0]);
                  }}
                  className={`shrink-0 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${isActive
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <span>{cat.title}</span>
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {catScore}/{catMax}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Section Pills within Category */}
          <div className="p-3 bg-slate-50 border-b border-slate-200">
            <div className="flex flex-wrap gap-2">
              {sectionCategories[activeCategory].keys.map(key => {
                const config = subsections[key];
                const isActive = activeSection === key;
                const score = getSectionScore(key);
                const max = PART_B_CAPS[key]?.max || 15;
                const count = getSectionCount(key);
                const colorClasses = getColorClasses(config.color);
                const Icon = config.icon;

                return (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${isActive
                        ? `${colorClasses.bg} ${colorClasses.border} border-2 shadow-sm`
                        : 'bg-white border border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <Icon size={16} className={isActive ? colorClasses.text : 'text-slate-400'} />
                    <span className={isActive ? 'font-medium text-slate-900' : 'text-slate-600'}>
                      {config.shortTitle}
                    </span>
                    {count > 0 && (
                      <span className={`px-1.5 py-0.5 rounded text-xs ${isActive ? colorClasses.badge : 'bg-slate-100 text-slate-500'
                        }`}>
                        {count}
                      </span>
                    )}
                    <ChevronRight size={14} className={isActive ? colorClasses.text : 'text-slate-300'} />
                    <span className={`text-xs ${isActive ? colorClasses.text : 'text-slate-400'}`}>
                      {score}/{max}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Section Content */}
          <div className="p-4">
            <Subsection
              sectionKey={activeSection}
              config={subsections[activeSection]}
              data={partBData[activeSection] || []}
              onChange={(data) => handleSectionChange(activeSection, data)}
              disabled={isReadOnly}
              maxMarks={PART_B_CAPS[activeSection]?.max || 15}
            />
          </div>
        </div>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Part B Saved!"
          message="Your research and academic contributions have been saved. Continue to Part C for Administrative Contributions."
          buttonText="Continue"
          redirectUrl="/appraisal"
        />
      </div>
    </DashboardLayout>
  );
}
