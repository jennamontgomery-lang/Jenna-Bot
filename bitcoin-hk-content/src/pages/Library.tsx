import { useState, useMemo } from 'react';
import type { Post, Platform } from '../types';
import { PILLARS, PLATFORM_LABELS } from '../data/pillars';
import PostCard from '../components/PostCard';

interface Props {
  posts: Post[];
  onChanged: () => void;
}

type StatusFilter = 'all' | Post['status'];

export default function Library({ posts, onChanged }: Props) {
  const [pillarFilter, setPillarFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => posts.filter(p => {
    if (pillarFilter !== 'all' && p.pillarId !== pillarFilter) return false;
    if (platformFilter !== 'all' && p.platform !== platformFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [posts, pillarFilter, platformFilter, statusFilter, search]);

  const platforms: Platform[] = ['twitter', 'linkedin', 'instagram', 'telegram'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Content Library</h2>
        <p className="text-sm text-gray-500">{posts.length} posts saved</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm space-y-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={pillarFilter}
            onChange={e => setPillarFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Pillars</option>
            {PILLARS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
          </select>

          <select
            value={platformFilter}
            onChange={e => setPlatformFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Platforms</option>
            {platforms.map(p => <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as StatusFilter)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Status</option>
            <option value="draft">Drafts</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium">{posts.length === 0 ? 'No posts yet — start building!' : 'No posts match your filters.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(post => (
            <PostCard key={post.id} post={post} onChanged={onChanged} />
          ))}
        </div>
      )}
    </div>
  );
}
