import { Trash2, Copy, CheckCheck, Calendar } from 'lucide-react';
import { useState } from 'react';
import type { Post } from '../types';
import { PILLARS, PLATFORM_LABELS } from '../data/pillars';
import { deletePost, updatePost } from '../data/store';

interface Props {
  post: Post;
  onChanged: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  scheduled: 'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
};

export default function PostCard({ post, onChanged }: Props) {
  const [copied, setCopied] = useState(false);
  const pillar = PILLARS.find(p => p.id === post.pillarId);

  async function copy() {
    await navigator.clipboard.writeText(post.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function remove() {
    deletePost(post.id);
    onChanged();
  }

  function cycleStatus() {
    const next: Record<string, Post['status']> = {
      draft: 'scheduled',
      scheduled: 'published',
      published: 'draft',
    };
    updatePost({ ...post, status: next[post.status] });
    onChanged();
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{pillar?.icon}</span>
          <span className="text-xs font-semibold text-gray-500">{pillar?.name}</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-500">{PLATFORM_LABELS[post.platform]}</span>
        </div>
        <button
          onClick={cycleStatus}
          className={`text-xs px-2 py-0.5 rounded-full font-semibold cursor-pointer ${STATUS_STYLES[post.status]}`}
        >
          {post.status}
        </button>
      </div>

      <p className="text-sm text-gray-800 leading-relaxed mb-3 line-clamp-3">{post.content}</p>

      {post.scheduledDate && (
        <div className="flex items-center gap-1 text-xs text-blue-600 mb-2">
          <Calendar size={11} />
          {new Date(post.scheduledDate).toLocaleString()}
        </div>
      )}

      {post.mediaNote && (
        <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mb-2">
          Media: {post.mediaNote}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-1">
          <button onClick={copy} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            {copied ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          <button onClick={remove} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
