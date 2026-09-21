import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BellIcon, ShieldCheckIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline';
import Breadcrumbs from '../components/Breadcrumbs';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      jobAlerts: true,
      weeklyReports: true,
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false,
    },
    account: {
      twoFactorAuth: false,
      sessionTimeout: '30',
    },
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const sections = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: BellIcon,
      settings: [
        { key: 'email', label: 'Email notifications', type: 'toggle' },
        { key: 'push', label: 'Push notifications', type: 'toggle' },
        { key: 'jobAlerts', label: 'Job alerts', type: 'toggle' },
        { key: 'weeklyReports', label: 'Weekly reports', type: 'toggle' },
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: ShieldCheckIcon,
      settings: [
        {
          key: 'profileVisibility',
          label: 'Profile visibility',
          type: 'select',
          options: [
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
            { value: 'connections', label: 'Connections only' },
          ],
        },
        { key: 'dataSharing', label: 'Data sharing with partners', type: 'toggle' },
      ],
    },
    {
      id: 'account',
      title: 'Account Security',
      icon: UserIcon,
      settings: [
        { key: 'twoFactorAuth', label: 'Two-factor authentication', type: 'toggle' },
        {
          key: 'sessionTimeout',
          label: 'Session timeout (minutes)',
          type: 'select',
          options: [
            { value: '15', label: '15 minutes' },
            { value: '30', label: '30 minutes' },
            { value: '60', label: '1 hour' },
            { value: '240', label: '4 hours' },
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg"
        >
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and privacy settings</p>
          </div>

          <div className="divide-y divide-gray-200">
            {sections.map((section) => (
              <div key={section.id} className="p-6">
                <div className="flex items-center mb-4">
                  <section.icon className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  {section.settings.map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        {setting.label}
                      </label>

                      {setting.type === 'toggle' && (
                        <button
                          onClick={() =>
                            handleSettingChange(section.id, setting.key, !settings[section.id][setting.key])
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings[section.id][setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings[section.id][setting.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}

                      {setting.type === 'select' && (
                        <select
                          value={settings[section.id][setting.key]}
                          onChange={(e) =>
                            handleSettingChange(section.id, setting.key, e.target.value)
                          }
                          className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          {setting.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Danger Zone</h3>
                <p className="text-sm text-gray-600">Irreversible actions</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
