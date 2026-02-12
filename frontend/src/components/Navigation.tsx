import React from 'react';
import { Layout, Settings, BarChart3 } from 'lucide-react';

interface NavigationProps {
  currentPage: 'dashboard' | 'settings' | 'admin';
  onPageChange: (page: 'dashboard' | 'settings' | 'admin') => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onPageChange,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout },
    { id: 'settings', label: 'Accounts', icon: Settings },
    { id: 'admin', label: 'Admin', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-bitcoin-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">₿</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Evergreen Content Tracker
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'bg-bitcoin-light text-bitcoin-orange'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
