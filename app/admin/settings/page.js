'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  Settings,
  Mail,
  Bell,
  Shield,
  Database,
  Globe,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  // System Settings State
  const [generalSettings, setGeneralSettings] = useState({
    institutionName: 'SIES Graduate School of Technology',
    institutionCode: 'SIES-GST',
    academicYear: '2025-26',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'notifications@siesgst.edu.in',
    smtpPassword: '••••••••••••',
    senderName: 'SIES ERP System',
    senderEmail: 'noreply@siesgst.edu.in',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    reminderDays: '7',
    sendOnSubmission: true,
    sendOnReview: true,
    sendOnApproval: true,
    sendDigest: false,
  });

  const [appraisalSettings, setAppraisalSettings] = useState({
    maxPartB: '75',
    maxPartC: '100',
    maxPartD: '75',
    passingScore: '150',
    allowLateSubmission: false,
    requireAllParts: true,
    autoCalculate: true,
  });

  const handleSave = (section) => {
    // In a real app, this would call an API
    console.log('Saving settings for:', section);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Only allow admin access
  if (user?.role !== 'ADMIN') {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <Card className="max-w-md">
            <div className="text-center">
              <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
              <p className="text-slate-600">Only administrators can access system settings.</p>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header
        title="System Settings"
        subtitle="Configure system preferences and options"
      />

      <div className="p-6 space-y-6">
        {/* Save Notification */}
        {saved && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <CheckCircle size={20} />
            <span>Settings saved successfully!</span>
          </div>
        )}

        {/* General Settings */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Globe size={20} />
              General Settings
            </Card.Title>
          </Card.Header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Institution Name"
              value={generalSettings.institutionName}
              onChange={(e) => setGeneralSettings({ ...generalSettings, institutionName: e.target.value })}
            />
            <Input
              label="Institution Code"
              value={generalSettings.institutionCode}
              onChange={(e) => setGeneralSettings({ ...generalSettings, institutionCode: e.target.value })}
            />
            <Input
              label="Current Academic Year"
              value={generalSettings.academicYear}
              onChange={(e) => setGeneralSettings({ ...generalSettings, academicYear: e.target.value })}
            />
            <Select
              label="Timezone"
              value={generalSettings.timezone}
              onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
            </Select>
            <Select
              label="Date Format"
              value={generalSettings.dateFormat}
              onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </Select>
          </div>
          <div className="mt-4 flex justify-end">
            <Button icon={Save} onClick={() => handleSave('general')}>
              Save General Settings
            </Button>
          </div>
        </Card>

        {/* Email Settings */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Mail size={20} />
              Email Configuration
            </Card.Title>
          </Card.Header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="SMTP Host"
              value={emailSettings.smtpHost}
              onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
            />
            <Input
              label="SMTP Port"
              value={emailSettings.smtpPort}
              onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
            />
            <Input
              label="SMTP Username"
              value={emailSettings.smtpUser}
              onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
            />
            <Input
              label="SMTP Password"
              type="password"
              value={emailSettings.smtpPassword}
              onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
            />
            <Input
              label="Sender Name"
              value={emailSettings.senderName}
              onChange={(e) => setEmailSettings({ ...emailSettings, senderName: e.target.value })}
            />
            <Input
              label="Sender Email"
              type="email"
              value={emailSettings.senderEmail}
              onChange={(e) => setEmailSettings({ ...emailSettings, senderEmail: e.target.value })}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" icon={RefreshCw}>
              Test Connection
            </Button>
            <Button icon={Save} onClick={() => handleSave('email')}>
              Save Email Settings
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Bell size={20} />
              Notification Preferences
            </Card.Title>
          </Card.Header>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    emailNotifications: e.target.checked
                  })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="emailNotifications" className="text-sm font-medium text-slate-700">
                  Enable Email Notifications
                </label>
              </div>
              <Input
                label="Reminder Days Before Deadline"
                type="number"
                value={notificationSettings.reminderDays}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  reminderDays: e.target.value
                })}
              />
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-slate-700 mb-3">Send notifications when:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sendOnSubmission"
                    checked={notificationSettings.sendOnSubmission}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      sendOnSubmission: e.target.checked
                    })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="sendOnSubmission" className="text-sm text-slate-600">
                    Appraisal Submitted
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sendOnReview"
                    checked={notificationSettings.sendOnReview}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      sendOnReview: e.target.checked
                    })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="sendOnReview" className="text-sm text-slate-600">
                    Review Completed
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sendOnApproval"
                    checked={notificationSettings.sendOnApproval}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      sendOnApproval: e.target.checked
                    })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="sendOnApproval" className="text-sm text-slate-600">
                    Final Approval
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sendDigest"
                    checked={notificationSettings.sendDigest}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      sendDigest: e.target.checked
                    })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="sendDigest" className="text-sm text-slate-600">
                    Weekly Digest
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button icon={Save} onClick={() => handleSave('notifications')}>
              Save Notification Settings
            </Button>
          </div>
        </Card>

        {/* Appraisal Settings */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Settings size={20} />
              Appraisal Configuration
            </Card.Title>
          </Card.Header>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Max Score - Part B (Teaching)"
                type="number"
                value={appraisalSettings.maxPartB}
                onChange={(e) => setAppraisalSettings({
                  ...appraisalSettings,
                  maxPartB: e.target.value
                })}
              />
              <Input
                label="Max Score - Part C (Research)"
                type="number"
                value={appraisalSettings.maxPartC}
                onChange={(e) => setAppraisalSettings({
                  ...appraisalSettings,
                  maxPartC: e.target.value
                })}
              />
              <Input
                label="Max Score - Part D (Development)"
                type="number"
                value={appraisalSettings.maxPartD}
                onChange={(e) => setAppraisalSettings({
                  ...appraisalSettings,
                  maxPartD: e.target.value
                })}
              />
            </div>
            <Input
              label="Minimum Passing Score (out of 250)"
              type="number"
              value={appraisalSettings.passingScore}
              onChange={(e) => setAppraisalSettings({
                ...appraisalSettings,
                passingScore: e.target.value
              })}
              className="max-w-xs"
            />
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-slate-700 mb-3">Options:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allowLateSubmission"
                    checked={appraisalSettings.allowLateSubmission}
                    onChange={(e) => setAppraisalSettings({
                      ...appraisalSettings,
                      allowLateSubmission: e.target.checked
                    })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="allowLateSubmission" className="text-sm text-slate-600">
                    Allow Late Submission
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="requireAllParts"
                    checked={appraisalSettings.requireAllParts}
                    onChange={(e) => setAppraisalSettings({
                      ...appraisalSettings,
                      requireAllParts: e.target.checked
                    })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="requireAllParts" className="text-sm text-slate-600">
                    Require All Parts for Submission
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="autoCalculate"
                    checked={appraisalSettings.autoCalculate}
                    onChange={(e) => setAppraisalSettings({
                      ...appraisalSettings,
                      autoCalculate: e.target.checked
                    })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="autoCalculate" className="text-sm text-slate-600">
                    Auto-calculate Scores
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button icon={Save} onClick={() => handleSave('appraisal')}>
              Save Appraisal Settings
            </Button>
          </div>
        </Card>

        {/* Database/System Info */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Database size={20} />
              System Information
            </Card.Title>
          </Card.Header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Version</p>
              <p className="text-lg font-semibold text-slate-900">1.0.0</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Environment</p>
              <p className="text-lg font-semibold text-slate-900">Development</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Database</p>
              <p className="text-lg font-semibold text-slate-900">Mock Data</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Last Backup</p>
              <p className="text-lg font-semibold text-slate-900">N/A</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Prototype Mode</p>
              <p className="text-sm text-amber-700">
                This is a prototype using mock data. Settings changes are stored in memory and will be lost on page refresh.
                In production, these would be persisted to a database.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
