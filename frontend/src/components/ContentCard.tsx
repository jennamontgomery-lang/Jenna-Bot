import React from 'react';
import { Copy, ExternalLink, ThumbsUp } from 'lucide-react';
import { ContentItem } from '../store/contentStore';

interface ContentCardProps {
  content: ContentItem;
  onCopy: (text: string) => void;
  onOverride: (id: string, isEvergreen: boolean) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onCopy,
  onOverride,
}) => {
  const platformColors = {
    twitter: 'bg-blue-50 border-blue-200',
    instagram: 'bg-pink-50 border-pink-200',
    linkedin: 'bg-blue-100 border-blue-300',
  };

  const platformColor = platformColors[content.account.platform as keyof typeof platformColors] || 'bg-gray-50';

  const getConfidenceColor = (score?: number) => {
    if (!score) return 'bg-gray-200';
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`border rounded-lg p-4 mb-4 ${platformColor}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-gray-600 uppercase">
              {content.account.platform}
            </span>
            <a
              href={content.account.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              @{content.account.handle}
            </a>
          </div>
          <p className="text-xs text-gray-500">
            {new Date(content.posted_at).toLocaleDateString()}
          </p>
        </div>
        {content.is_evergreen !== undefined && (
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                content.is_evergreen
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              }`}
            >
              {content.is_evergreen ? '✓ Evergreen' : '⏰ Time-sensitive'}
            </span>
            {content.classification_score && (
              <div className="flex items-center gap-1">
                <div
                  className={`w-6 h-6 rounded-full ${getConfidenceColor(
                    content.classification_score
                  )} flex items-center justify-center text-xs font-bold text-white`}
                >
                  {Math.round(content.classification_score * 100)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Text */}
      {content.text_content && (
        <p className="text-sm text-gray-800 mb-3 line-clamp-4">
          {content.text_content}
        </p>
      )}

      {/* Media Previews */}
      {content.media_urls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {content.media_urls.slice(0, 2).map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt="Content media"
              className="h-24 object-cover rounded border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ))}
        </div>
      )}

      {/* Tags and Engagement */}
      <div className="flex gap-4 items-center mb-3 text-xs text-gray-600">
        {content.hashtags.length > 0 && (
          <span className="font-mono">
            {content.hashtags.slice(0, 3).join(' ')}
          </span>
        )}
        {content.engagement.likes && (
          <div className="flex items-center gap-1">
            <ThumbsUp size={14} />
            <span>{content.engagement.likes}</span>
          </div>
        )}
      </div>

      {/* Classification Info */}
      {content.classification && (
        <div className="mb-3 p-2 bg-white bg-opacity-60 rounded text-xs">
          <p className="text-gray-700">{content.classification.reason}</p>
          {content.classification.categories.length > 0 && (
            <p className="text-gray-600 mt-1">
              Categories: {content.classification.categories.join(', ')}
            </p>
          )}
        </div>
      )}

      {/* Repost Copy */}
      {content.repost_ready_copy && (
        <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs font-semibold text-gray-700 mb-1">
            Repost Ready Copy:
          </p>
          <p className="text-sm text-gray-800 line-clamp-3">
            {content.repost_ready_copy}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-2">
          {content.repost_ready_copy && (
            <button
              onClick={() => onCopy(content.repost_ready_copy!)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              <Copy size={14} />
              Copy
            </button>
          )}
          {content.original_url && (
            <a
              href={content.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
            >
              <ExternalLink size={14} />
              View
            </a>
          )}
        </div>

        {content.is_evergreen === false && (
          <button
            onClick={() => onOverride(content.id, true)}
            className="text-xs text-blue-600 hover:underline"
          >
            Mark as Evergreen
          </button>
        )}
        {content.is_evergreen === true && (
          <button
            onClick={() => onOverride(content.id, false)}
            className="text-xs text-orange-600 hover:underline"
          >
            Mark as Time-sensitive
          </button>
        )}
      </div>
    </div>
  );
};
