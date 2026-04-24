import { useMemo } from 'react';
import { Calendar, Clock, TrendingUp, Copy, Zap, CheckCircle2, Bird } from 'lucide-react';
import type { Post, TweetTemplate } from '../types';
import { PILLARS } from '../data/pillars';
import {
  MARKETING_PHASES,
  getPhaseForDate,
  getTodayTemplates,
  getWeekDates,
  getDailyTarget,
  daysToConference,
} from '../data/marketingPlan';

interface Props {
  posts: Post[];
  onUseTweet: (template: TweetTemplate) => void;
  onChanged: () => void;
}

const PHASE_COLORS: Record<string, { bg: string; text: string; bar: string; badge: string }> = {
  blue:   { bg: 'from-blue-600 to-blue-500',   text: 'text-blue-600',   bar: 'bg-blue-400',   badge: 'bg-blue-100 text-blue-700' },
  purple: { bg: 'from-purple-600 to-purple-500', text: 'text-purple-600', bar: 'bg-purple-400', badge: 'bg-purple-100 text-purple-700' },
  amber:  { bg: 'from-amber-500 to-amber-400',  text: 'text-amber-600',  bar: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700' },
  orange: { bg: 'from-orange-600 to-orange-500', text: 'text-orange-600', bar: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700' },
  green:  { bg: 'from-green-600 to-green-500',  text: 'text-green-600',  bar: 'bg-green-400',  badge: 'bg-green-100 text-green-700' },
  gray:   { bg: 'from-gray-600 to-gray-500',    text: 'text-gray-600',   bar: 'bg-gray-400',   badge: 'bg-gray-100 text-gray-700' },
};

function charCount(content: string, hashtags: string[]): number {
  if (!hashtags.length) return content.length;
  return content.length + 2 + hashtags.join(' ').length;
}

function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + '…' : str;
}

function getPillar(id: string) {
  return PILLARS.find(p => p.id === id) ?? PILLARS[0];
}

export default function TwitterDashboard({ posts, onUseTweet }: Props) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const phase = useMemo(() => getPhaseForDate(today), [today]);
  const colors = PHASE_COLORS[phase.color] ?? PHASE_COLORS.gray;
  const phaseIndex = MARKETING_PHASES.findIndex(p => p.id === phase.id);

  const phaseProgress = useMemo(() => {
    const start = new Date(phase.startDate).getTime();
    const end = new Date(phase.endDate).getTime();
    const now = new Date(today).getTime();
    if (end <= start) return 100;
    return Math.min(100, Math.round(((now - start) / (end - start)) * 100));
  }, [phase, today]);

  const daysLeft = useMemo(() => daysToConference(today), [today]);
  const todayTemplates = useMemo(() => getTodayTemplates(today, 5), [today]);
  const weekDates = useMemo(() => getWeekDates(today), [today]);

  const twitterPosts = useMemo(() => posts.filter(p => p.platform === 'twitter'), [posts]);

  const queuedPosts = useMemo(() => {
    return [...twitterPosts]
      .filter(p => p.status === 'draft' || p.status === 'scheduled')
      .sort((a, b) => {
        if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
        if (b.status === 'scheduled' && a.status !== 'scheduled') return 1;
        return (a.scheduledDate || a.createdAt).localeCompare(b.scheduledDate || b.createdAt);
      })
      .slice(0, 5);
  }, [twitterPosts]);

  const currentMonth = today.slice(0, 7);
  const monthlyTwitterPosts = useMemo(
    () => twitterPosts.filter(p => p.createdAt.slice(0, 7) === currentMonth),
    [twitterPosts, currentMonth]
  );

  const pillarBalance = useMemo(() => {
    const total = Math.max(monthlyTwitterPosts.length, 1);
    return Object.entries(phase.pillarMix).map(([pillarId, pct]) => {
      const recommended = Math.round((pct / 100) * total);
      const actual = monthlyTwitterPosts.filter(p => p.pillarId === pillarId).length;
      return { pillarId, recommended, actual, pct };
    });
  }, [monthlyTwitterPosts, phase.pillarMix]);

  function postsOnDate(date: string) {
    return twitterPosts.filter(p => {
      const d = p.status === 'scheduled' && p.scheduledDate
        ? p.scheduledDate.slice(0, 10)
        : p.createdAt.slice(0, 10);
      return d === date;
    });
  }

  async function copyPost(content: string) {
    await navigator.clipboard.writeText(content);
  }

  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">

      {/* Phase Header */}
      <div className={`bg-gradient-to-r ${colors.bg} rounded-2xl p-6 text-white`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bird size={16} className="opacity-80" />
              <span className="text-sm font-semibold opacity-80">@bitcoinconfHK</span>
              <span className="text-white/40">·</span>
              <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                Phase {phaseIndex + 1} of {MARKETING_PHASES.length}
              </span>
            </div>
            <h1 className="text-2xl font-black">{phase.name}</h1>
            <p className="text-sm text-white/80 mt-0.5 max-w-md">{phase.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-4xl font-black tabular-nums">{daysLeft}</p>
            <p className="text-sm text-white/70">days to Bitcoin Asia 2026</p>
            <p className="text-xs text-white/50 mt-0.5">Aug 27-28 · Hong Kong</p>
          </div>
        </div>

        {/* Phase progress */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>{phase.startDate}</span>
            <span>{phaseProgress}% through phase</span>
            <span>{phase.endDate}</span>
          </div>
          <div className="bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all"
              style={{ width: `${phaseProgress}%` }}
            />
          </div>
        </div>

        {/* Posting times */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs text-white/60 flex items-center gap-1">
            <Clock size={11} /> Post at:
          </span>
          {phase.postingTimes.map(t => (
            <span key={t} className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">{t}</span>
          ))}
        </div>

        {/* Daily target */}
        <div className="mt-3 flex items-center gap-2">
          <Zap size={13} className="opacity-70" />
          <span className="text-sm font-semibold">
            Target: {phase.dailyTweetTarget[0]}–{phase.dailyTweetTarget[1]} tweets today
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Today's tweets + Queue */}
        <div className="lg:col-span-2 space-y-6">

          {/* Today's Recommended Tweets */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Zap size={15} className={colors.text} />
                Today's Tweets
              </h2>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
                {getDailyTarget(today)} recommended
              </span>
            </div>

            {todayTemplates.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">No templates for this phase yet.</p>
            ) : (
              <div className="space-y-3">
                {todayTemplates.map(t => {
                  const pillar = getPillar(t.pillarId);
                  const chars = charCount(t.content, t.hashtags);
                  const remaining = 280 - chars;
                  const charColor = remaining < 0 ? 'text-red-500' : remaining < 50 ? 'text-amber-500' : 'text-gray-400';
                  return (
                    <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${pillar.color}18`, color: pillar.color }}
                        >
                          {pillar.icon} {pillar.name}
                        </span>
                        <span className={`text-xs font-mono font-semibold ${charColor}`}>
                          {chars} / 280
                        </span>
                      </div>

                      <p className="text-sm text-gray-800 leading-relaxed">{t.content}</p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {t.hashtags.map(tag => (
                          <span key={tag} className="text-xs text-blue-500 font-medium">{tag}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400 capitalize">{t.category.replace('-', ' ')}</span>
                        <button
                          onClick={() => onUseTweet(t)}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                        >
                          <CheckCircle2 size={12} />
                          Use This
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Post Queue */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp size={15} className={colors.text} />
              Post Queue
            </h2>

            {queuedPosts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-400">
                No drafts or scheduled posts yet — click "Use This" above to get started.
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                {queuedPosts.map(post => {
                  const pillar = getPillar(post.pillarId);
                  return (
                    <div key={post.id} className="flex items-center gap-3 px-4 py-3">
                      <span
                        className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          post.status === 'scheduled'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {post.status}
                      </span>
                      <span className="text-base" title={pillar.name}>{pillar.icon}</span>
                      <p className="flex-1 text-sm text-gray-700 min-w-0 truncate">
                        {truncate(post.content, 60)}
                      </p>
                      {post.scheduledDate && (
                        <span className="text-xs text-gray-400 shrink-0">
                          {post.scheduledDate.slice(0, 10)}
                        </span>
                      )}
                      <button
                        onClick={() => copyPost(post.content)}
                        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right column: Calendar + Pillar Balance */}
        <div className="space-y-6">

          {/* Weekly Calendar */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar size={15} className={colors.text} />
              This Week
            </h2>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 gap-1 min-w-[280px]">
                {weekDates.map((date, i) => {
                  const isToday = date === today;
                  const dayPosts = postsOnDate(date);
                  const target = getDailyTarget(date);
                  const dayPhase = getPhaseForDate(date);
                  const topPillars = Object.entries(dayPhase.pillarMix)
                    .filter(([, pct]) => pct >= 15)
                    .map(([id]) => getPillar(id));

                  return (
                    <div
                      key={date}
                      className={`rounded-xl p-2 border text-center ${
                        isToday
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-gray-100 bg-white'
                      }`}
                    >
                      <p className="text-xs font-semibold text-gray-400">{DAY_LABELS[i]}</p>
                      <p className={`text-lg font-black leading-tight ${isToday ? 'text-orange-600' : 'text-gray-900'}`}>
                        {date.slice(8)}
                      </p>
                      <p className="text-xs text-gray-400">{target}t</p>
                      <div className="flex justify-center gap-0.5 mt-1 flex-wrap">
                        {topPillars.slice(0, 3).map(p => (
                          <span key={p.id} className="text-xs leading-none" title={p.name}>{p.icon}</span>
                        ))}
                      </div>
                      {dayPosts.length > 0 && (
                        <span className="inline-block mt-1 text-xs font-semibold bg-orange-500 text-white rounded-full w-4 h-4 leading-4">
                          {dayPosts.length}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Pillar Balance */}
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp size={15} className={colors.text} />
              Pillar Mix This Month
            </h2>
            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
              {pillarBalance.map(({ pillarId, recommended, actual, pct }) => {
                const pillar = getPillar(pillarId);
                const barPct = recommended > 0 ? Math.min(100, Math.round((actual / recommended) * 100)) : 0;
                const overIndexed = actual > recommended && recommended > 0;
                return (
                  <div key={pillarId}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">
                        {pillar.icon} {pillar.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {actual} / {recommended} ({pct}%)
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-1.5">
                      <div
                        className="rounded-full h-1.5 transition-all"
                        style={{
                          width: `${barPct}%`,
                          backgroundColor: overIndexed ? '#F59E0B' : pillar.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {monthlyTwitterPosts.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">
                  No Twitter posts this month yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
