import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useContentStore } from '../store/contentStore';
import { ContentCard } from './ContentCard';

interface ContentGridProps {
  onCopy: (text: string) => void;
}

export const ContentGrid: React.FC<ContentGridProps> = ({ onCopy }) => {
  const {
    content,
    total,
    hasMore,
    loading,
    error,
    filters,
    fetchContent,
    setFilters,
    overrideClassification,
  } = useContentStore();

  useEffect(() => {
    fetchContent();
  }, [filters, fetchContent]);

  const handlePreviousPage = () => {
    setFilters({ offset: Math.max(0, filters.offset - filters.limit) });
  };

  const handleNextPage = () => {
    if (hasMore) {
      setFilters({ offset: filters.offset + filters.limit });
    }
  };

  const currentPage = Math.floor(filters.offset / filters.limit) + 1;
  const totalPages = Math.ceil(total / filters.limit);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Evergreen Content
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {total} items found
              {filters.search && ` for "${filters.search}"`}
            </p>
          </div>
          <button
            onClick={() => fetchContent()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-bitcoin-orange text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 my-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <div>
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading && content.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bitcoin-orange"></div>
              <p className="mt-4 text-gray-600">Loading content...</p>
            </div>
          </div>
        ) : content.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg font-semibold">No content found</p>
              <p className="text-sm mt-2">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <div>
            {content.map((item) => (
              <ContentCard
                key={item.id}
                content={item}
                onCopy={onCopy}
                onOverride={overrideClassification}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousPage}
              disabled={filters.offset === 0 || loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({total} items)
            </div>

            <button
              onClick={handleNextPage}
              disabled={!hasMore || loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
