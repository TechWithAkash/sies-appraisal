'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  File,
  FileText,
  Image,
  X,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Paperclip,
} from 'lucide-react';

const fileTypeIcons = {
  'application/pdf': FileText,
  'image/jpeg': Image,
  'image/png': Image,
  'image/jpg': Image,
  'application/msword': FileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
  'default': File,
};

const acceptedTypes = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileIcon(fileType) {
  return fileTypeIcons[fileType] || fileTypeIcons['default'];
}

// Single file upload component
export default function FileUpload({
  label,
  value,
  onChange,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  maxSize = 5, // MB
  required = false,
  disabled = false,
  error,
  helperText,
  showPreview = true,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileSelect = (file) => {
    if (!file) return;

    // Check file type
    const allowedTypes = accept.split(',').map(t => t.trim().replace('.', ''));
    const fileExt = file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.some(t => t === fileExt || acceptedTypes[t] === file.type)) {
      setUploadError(`Invalid file type. Allowed: ${allowedTypes.join(', ').toUpperCase()}`);
      return;
    }

    // Check file size
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError(`File too large. Maximum size: ${maxSize}MB`);
      return;
    }

    setUploadError('');

    // Convert file to base64 for localStorage persistence
    const reader = new FileReader();
    reader.onloadend = () => {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        // Store as base64 for localStorage persistence
        base64: reader.result,
        // Also create blob URL for immediate preview
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      };
      onChange(fileData);
    };
    reader.onerror = () => {
      setUploadError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const FileIcon = value ? getFileIcon(value.type) : Upload;
  const displayError = error || uploadError;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {!value ? (
        // Upload Area
        <div
          className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all ${dragOver
              ? 'border-emerald-500 bg-emerald-50'
              : displayError
                ? 'border-red-300 bg-red-50'
                : 'border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/50'
            } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          onDragOver={(e) => { e.preventDefault(); !disabled && setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => !disabled && handleDrop(e)}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            disabled={disabled}
            className="hidden"
          />

          <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${dragOver ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'
            }`}>
            <Upload size={24} />
          </div>

          <p className="text-sm font-medium text-slate-700">
            {dragOver ? 'Drop file here' : 'Click to upload or drag and drop'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            PDF, JPG, PNG, DOC up to {maxSize}MB
          </p>
        </div>
      ) : (
        // File Preview
        <div className={`rounded-xl border-2 ${displayError ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'} p-4`}>
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${displayError ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
              <FileIcon size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">{value.name}</p>
              <p className="text-sm text-slate-500">
                {formatFileSize(value.size)} • Uploaded {new Date(value.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {showPreview && (value.url || value.base64) && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); window.open(value.base64 || value.url, '_blank'); }}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  title="Preview"
                >
                  <Eye size={18} />
                </button>
              )}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-100 hover:text-red-600"
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
          {!displayError && (
            <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle size={16} />
              <span>Document uploaded successfully</span>
            </div>
          )}
        </div>
      )}

      {displayError && (
        <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
          <AlertCircle size={14} />
          {displayError}
        </p>
      )}

      {helperText && !displayError && (
        <p className="mt-2 text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
}

// Multiple file upload component
export function MultiFileUpload({
  label,
  value = [],
  onChange,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  maxSize = 5,
  maxFiles = 5,
  required = false,
  disabled = false,
  error,
  helperText,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;

    const allowedTypes = accept.split(',').map(t => t.trim().replace('.', ''));
    const maxBytes = maxSize * 1024 * 1024;
    const filesToProcess = [];

    for (const file of Array.from(files)) {
      if (value.length + filesToProcess.length >= maxFiles) {
        setUploadError(`Maximum ${maxFiles} files allowed`);
        break;
      }

      const fileExt = file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.some(t => t === fileExt || acceptedTypes[t] === file.type)) {
        setUploadError(`Invalid file type: ${file.name}`);
        continue;
      }

      if (file.size > maxBytes) {
        setUploadError(`File too large: ${file.name} (max ${maxSize}MB)`);
        continue;
      }

      filesToProcess.push(file);
    }

    if (filesToProcess.length > 0) {
      setUploadError('');
      // Convert all files to base64
      Promise.all(filesToProcess.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: Date.now() + Math.random(),
              name: file.name,
              size: file.size,
              type: file.type,
              base64: reader.result,
              url: URL.createObjectURL(file),
              uploadedAt: new Date().toISOString(),
            });
          };
          reader.onerror = () => {
            resolve(null);
          };
          reader.readAsDataURL(file);
        });
      })).then(newFiles => {
        const validFiles = newFiles.filter(f => f !== null);
        if (validFiles.length > 0) {
          onChange([...value, ...validFiles]);
        }
      });
    }
  };

  const handleRemove = (fileId) => {
    onChange(value.filter(f => f.id !== fileId));
  };

  const displayError = error || uploadError;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* Upload Area */}
      {value.length < maxFiles && !disabled && (
        <div
          className={`relative rounded-xl border-2 border-dashed p-4 text-center transition-all ${dragOver
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-slate-300 bg-slate-50 hover:border-emerald-400'
            }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <div className="flex items-center justify-center gap-3">
            <Paperclip size={20} className="text-slate-400" />
            <span className="text-sm text-slate-600">
              Add files ({value.length}/{maxFiles})
            </span>
          </div>
        </div>
      )}

      {/* File List */}
      {value.length > 0 && (
        <div className="mt-3 space-y-2">
          {value.map((file) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <FileIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                </div>
                <div className="flex items-center gap-1">
                  {(file.url || file.base64) && (
                    <button
                      type="button"
                      onClick={() => window.open(file.base64 || file.url, '_blank')}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleRemove(file.id)}
                      className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {displayError && (
        <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
          <AlertCircle size={14} />
          {displayError}
        </p>
      )}

      {helperText && !displayError && (
        <p className="mt-2 text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
}

// Compact file attachment display for cards
export function FileAttachment({ file, onRemove, disabled }) {
  if (!file) return null;

  const FileIcon = getFileIcon(file.type);
  const previewUrl = file.base64 || file.url;

  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm">
      <FileIcon size={16} className="text-slate-500" />
      <span className="truncate max-w-36 text-slate-700">{file.name}</span>
      {previewUrl && (
        <button
          type="button"
          onClick={() => window.open(previewUrl, '_blank')}
          className="text-blue-600 hover:text-blue-700"
        >
          <Eye size={14} />
        </button>
      )}
      {!disabled && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-slate-400 hover:text-red-500"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
