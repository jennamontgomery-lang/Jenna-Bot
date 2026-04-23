import { useMemo } from 'react';
import { BarChart3, FileText, Send, Clock } from 'lucide-react';
import type { Post } from '../types';
import { PILLARS, CONFERENCE } from '../data/pillars';
import PillarCard from '../components/PillarCard';

interface Props {
  posts: Post[];
  onPillarClick: (pillarId: string) => void;
}

export default function Dashboard({ posts, onPillarClick }: Props) {
  const stats = useMemo(() => ({
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    drafts: posts.filter(p => p.status === 'draft').length,
  }), [posts]);

  const postsByPillar = useMemo(() => {
    const map: Record<string, number> = {};
    posts.forEach(p => { map[p.pillarId] = (map[p.pillarId] || 0) + 1; });
    return map;
  }, [posts]);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">₿</span>
          <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">{CONFERENCE.dates} · {CONFERENCE.city}</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">{CONFERENCE.name}</h1>
        <p className="text-orange-100 text-sm mb-2">{CONFERENCE.tagline} · {CONFERENCE.scale}</p>
        <p className="text-orange-200 text-xs">{CONFERENCE.venue} · {CONFERENCE.handle} · {CONFERENCE.hashtag}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: stats.total, icon: FileText, color: 'text-gray-700' },
          { label: 'Published', value: stats.published, icon: Send, color: 'text-green-600' },
          { label: 'Scheduled', value: stats.scheduled, icon: Clock, color: 'text-blue-600' },
          { label: 'Drafts', value: stats.drafts, icon: BarChart3, color: 'text-orange-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <stat.icon size={18} className={`${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pillars grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Content Pillars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map(pillar => (
            <PillarCard
              key={pillar.id}
              pillar={pillar}
              postCount={postsByPillar[pillar.id] || 0}
              onClick={() => onPillarClick(pillar.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
