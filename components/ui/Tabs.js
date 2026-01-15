'use client';

import { useState } from 'react';

export default function Tabs({ tabs, defaultTab, onChange }) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    const currentTab = tabs.find((t) => t.id === activeTab);

    return (
        <div>
            {/* Tab Navigation */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`
                whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors
                ${activeTab === tab.id
                                    ? 'border-emerald-500 text-emerald-600'
                                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                                }
              `}
                        >
                            <div className="flex items-center gap-2">
                                {tab.icon && <tab.icon size={18} />}
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs ${activeTab === tab.id
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">{currentTab?.content}</div>
        </div>
    );
}

// Vertical Tabs
export function VerticalTabs({ tabs, defaultTab, onChange }) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    const currentTab = tabs.find((t) => t.id === activeTab);

    return (
        <div className="flex gap-6">
            {/* Tab Navigation */}
            <nav className="w-48 shrink-0 space-y-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`
              flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors
              ${activeTab === tab.id
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }
            `}
                    >
                        {tab.icon && <tab.icon size={18} />}
                        <span className="flex-1">{tab.label}</span>
                        {tab.count !== undefined && (
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs ${activeTab === tab.id
                                        ? 'bg-emerald-200 text-emerald-800'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Tab Content */}
            <div className="flex-1">{currentTab?.content}</div>
        </div>
    );
}
