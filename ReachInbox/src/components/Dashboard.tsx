import React, { useState } from 'react';
import { Sidebar } from './Layout/Sidebar';
import { Header } from './Layout/Header';
import { Onebox } from './Onebox';
import { Analytics } from './Analytics';

export const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('inbox');

  const renderContent = () => {
    switch (activeView) {
      case 'inbox':
        return <Onebox />;
      case 'analytics':
        return <Analytics />;
      case 'sent':
        return (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Sent Emails</h3>
              <p className="text-sm">This feature is coming soon</p>
            </div>
          </div>
        );
      case 'starred':
        return (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Starred Emails</h3>
              <p className="text-sm">This feature is coming soon</p>
            </div>
          </div>
        );
      case 'archive':
        return (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Archived Emails</h3>
              <p className="text-sm">This feature is coming soon</p>
            </div>
          </div>
        );
      case 'trash':
        return (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Trash</h3>
              <p className="text-sm">This feature is coming soon</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Settings</h3>
              <p className="text-sm">This feature is coming soon</p>
            </div>
          </div>
        );
      default:
        return <Onebox />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {renderContent()}
      </div>
    </div>
  );
};