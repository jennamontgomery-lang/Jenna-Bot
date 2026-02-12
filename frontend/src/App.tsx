import React, { useEffect, useState } from 'react';
import { useContentStore } from './store/contentStore';
import { Navigation } from './components/Navigation';
import { FilterPanel } from './components/FilterPanel';
import { ContentGrid } from './components/ContentGrid';
import './index.css';

type PageType = 'dashboard' | 'settings' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [copyNotification, setCopyNotification] = useState('');

  const { accounts, fetchAccounts } = useContentStore();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyNotification('Copied to clipboard!');
    setTimeout(() => setCopyNotification(''), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      {currentPage === 'dashboard' && (
        <>
          <FilterPanel accounts={accounts} />
          <ContentGrid onCopy={handleCopy} />
        </>
      )}

      {currentPage === 'settings' && (
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-6">Account Management</h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-600">
              Account settings coming soon. Configure social media accounts and
              credentials here.
            </p>
          </div>
        </div>
      )}

      {currentPage === 'admin' && (
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              <p className="text-green-600 font-medium">✓ Running</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Sync</h3>
              <button className="px-4 py-2 bg-bitcoin-orange text-white rounded-lg hover:bg-orange-600">
                Trigger Sync Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Notification */}
      {copyNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {copyNotification}
        </div>
      )}
    </div>
  );
}

export default App;
