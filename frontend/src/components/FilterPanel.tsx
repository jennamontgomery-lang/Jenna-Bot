import React, { useEffect } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { useContentStore, Account } from '../store/contentStore';

interface FilterPanelProps {
  accounts: Account[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ accounts }) => {
  const { filters, setFilters, resetFilters } = useContentStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ platform: e.target.value || undefined });
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ accountId: e.target.value || undefined });
  };

  const handleEvergreendChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters({
      isEvergreen:
        value === 'all' ? undefined : value === 'evergreen' ? true : false,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ sortBy: e.target.value as any });
  };

  const platforms = Array.from(
    new Set(accounts.map((a) => a.platform))
  ).sort();

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter size={20} />
          Filters
        </h2>
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search content..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Platform */}
        <select
          value={filters.platform || ''}
          onChange={handlePlatformChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">All Platforms</option>
          {platforms.map((platform) => (
            <option key={platform} value={platform}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </option>
          ))}
        </select>

        {/* Account */}
        <select
          value={filters.accountId || ''}
          onChange={handleAccountChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">All Accounts</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              @{account.handle}
            </option>
          ))}
        </select>

        {/* Evergreen Status */}
        <select
          value={
            filters.isEvergreen === undefined
              ? 'all'
              : filters.isEvergreen
              ? 'evergreen'
              : 'time-sensitive'
          }
          onChange={handleEvergreendChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Content</option>
          <option value="evergreen">✓ Evergreen</option>
          <option value="time-sensitive">⏰ Time-sensitive</option>
        </select>

        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={handleSortChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="date">Sort by Date</option>
          <option value="engagement">Sort by Engagement</option>
          <option value="classification_score">Sort by Confidence</option>
        </select>
      </div>
    </div>
  );
};
