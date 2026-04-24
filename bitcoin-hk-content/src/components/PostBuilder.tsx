import { useState, useEffect } from 'react';
import { Copy, CheckCheck } from 'lucide-react';
import type { Platform, Post } from '../types';
import { PILLARS, PLATFORM_LIMITS, PLATFORM_LABELS } from '../data/pillars';
import { addPost, generateId } from '../data/store';

interface Props {
  defaultPillarId?: string;
  prefillContent?: string;
  prefillPillarId?: string;
  prefillHashtags?: string[];
  onSaved: () => void;
}

const PLATFORMS: Platform[] = ['twitter', 'linkedin', 'instagram', 'telegram'];

export default function PostBuilder({ defaultPillarId, prefillContent, prefillPillarId, prefillHashtags, onSaved }: Props) {
  const [pillarId, setPillarId] = useState(defaultPillarId || PILLARS[0].id);
  const [platform, setPlatform] = useState<Platform>('twitter');
  const [content, setContent] = useState('');
  const [mediaNote, setMediaNote] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (prefillContent) {
      const body = prefillHashtags?.length
        ? `${prefillContent}\n\n${prefillHashtags.join(' ')}`
        : prefillContent;
      setContent(body);
      if (prefillPillarId) setPillarId(prefillPillarId);
      setPlatform('twitter');
    }
  }, [prefillContent, prefillPillarId, prefillHashtags]);

  const pillar = PILLARS.find(p => p.id === pillarId)!;
  const limit = PLATFORM_LIMITS[platform];
  const remaining = limit - content.length;
  const isOverLimit = remaining < 0;

  function insertHashtags() {
    const tags = pillar.hashtags.join(' ');
    setContent(prev => prev ? `${prev}\n\n${tags}` : tags);
  }

  function insertIdea(idea: string) {
    setContent(idea);
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function savePost(status: Post['status']) {
    if (!content.trim()) return;
    addPost({
      id: generateId(),
      pillarId,
      platform,
      content: content.trim(),
      hashtags: pillar.hashtags,
      status,
      scheduledDate: scheduledDate || undefined,
      mediaNote: mediaNote || undefined,
      createdAt: new Date().toISOString(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSaved();
    setContent('');
    setMediaNote('');
    setScheduledDate('');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Controls */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Content Pillar</label>
          <select
            value={pillarId}
            onChange={e => setPillarId(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {PILLARS.map(p => (
              <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Platform</label>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                  platform === p
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
              >
                {PLATFORM_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Content Ideas</label>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {pillar.contentIdeas.map(idea => (
              <button
                key={idea}
                onClick={() => insertIdea(idea)}
                className="w-full text-left text-xs px-3 py-2 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-orange-700 text-gray-600 transition-colors"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Media Note</label>
          <input
            value={mediaNote}
            onChange={e => setMediaNote(e.target.value)}
            placeholder="e.g. Use conference photo, BTC chart..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Schedule Date</label>
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={e => setScheduledDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Right: Editor */}
      <div className="lg:col-span-2 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">Post Content</label>
          <button
            onClick={insertHashtags}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium"
          >
            + Insert hashtags
          </button>
        </div>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={`Write your ${PLATFORM_LABELS[platform]} post here...`}
          className={`flex-1 min-h-48 border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 ${
            isOverLimit ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-orange-400'
          }`}
        />

        <div className="flex items-center justify-between mt-2 mb-4">
          <div className="flex gap-1">
            {pillar.hashtags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: `${pillar.color}18`, color: pillar.color }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span className={`text-sm font-mono font-semibold ${isOverLimit ? 'text-red-500' : remaining < 50 ? 'text-amber-500' : 'text-gray-400'}`}>
            {remaining}
          </span>
        </div>

        {/* Preview */}
        {content && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Preview</p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{content}</p>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <button
            onClick={copyToClipboard}
            disabled={!content.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-gray-300 disabled:opacity-40 transition-all"
          >
            {copied ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={() => savePost('draft')}
            disabled={!content.trim() || isOverLimit}
            className="flex-1 py-2 rounded-lg border border-orange-200 text-orange-600 text-sm font-medium hover:bg-orange-50 disabled:opacity-40 transition-all"
          >
            Save Draft
          </button>
          <button
            onClick={() => savePost(scheduledDate ? 'scheduled' : 'published')}
            disabled={!content.trim() || isOverLimit}
            className="flex-1 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-40 transition-all"
          >
            {saved ? 'Saved!' : scheduledDate ? 'Schedule' : 'Mark Published'}
          </button>
        </div>
      </div>
    </div>
  );
}
