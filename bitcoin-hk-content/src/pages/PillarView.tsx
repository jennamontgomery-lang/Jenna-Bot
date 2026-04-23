import { ArrowLeft, Lightbulb } from 'lucide-react';
import type { ContentPillar, Post } from '../types';
import { PLATFORM_LABELS } from '../data/pillars';
import PostCard from '../components/PostCard';

interface Props {
  pillar: ContentPillar;
  posts: Post[];
  onBack: () => void;
  onCreatePost: () => void;
  onChanged: () => void;
}

export default function PillarView({ pillar, posts, onBack, onCreatePost, onChanged }: Props) {
  const pillarPosts = posts.filter(p => p.pillarId === pillar.id);
  const byPlatform: Record<string, Post[]> = {};
  pillarPosts.forEach(p => { (byPlatform[p.platform] = byPlatform[p.platform] || []).push(p); });

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: `linear-gradient(135deg, ${pillar.color}, ${pillar.color}cc)` }}
      >
        <span className="text-4xl block mb-2">{pillar.icon}</span>
        <h2 className="text-2xl font-bold mb-1">{pillar.name}</h2>
        <p className="text-white/80 text-sm mb-4">{pillar.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {pillar.hashtags.map(tag => (
            <span key={tag} className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">{tag}</span>
          ))}
        </div>
        <p className="text-xs text-white/70 font-semibold uppercase tracking-wide">Target: {pillar.targetAudience}</p>
      </div>

      {/* Content ideas */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={16} className="text-amber-500" />
          <h3 className="font-bold text-gray-900">Content Ideas</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {pillar.contentIdeas.map(idea => (
            <div key={idea} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
              <span className="text-orange-400 mt-0.5 flex-shrink-0">→</span>
              {idea}
            </div>
          ))}
        </div>
      </div>

      {/* Platform breakdown */}
      {pillarPosts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['twitter', 'linkedin', 'instagram', 'telegram'] as const).map(platform => (
            <div key={platform} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl font-bold text-gray-900">{byPlatform[platform]?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-1">{PLATFORM_LABELS[platform]}</p>
            </div>
          ))}
        </div>
      )}

      {/* Posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">{pillarPosts.length} Posts</h3>
          <button
            onClick={onCreatePost}
            className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            + New Post
          </button>
        </div>

        {pillarPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">✍️</p>
            <p>No posts for this pillar yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pillarPosts.map(post => (
              <PostCard key={post.id} post={post} onChanged={onChanged} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
