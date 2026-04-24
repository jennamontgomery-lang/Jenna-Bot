import type { MarketingPhase, TweetTemplate } from '../types';

const CONFERENCE_DATE = '2026-08-27';

export const MARKETING_PHASES: MarketingPhase[] = [
  {
    id: 'awareness',
    name: 'Awareness',
    startDate: '2026-04-24',
    endDate: '2026-05-31',
    dailyTweetTarget: [2, 3],
    pillarMix: { education: 40, 'hk-adoption': 20, industry: 20, community: 20 },
    postingTimes: ['09:00 HKT', '18:00 HKT'],
    description: 'Build audience & establish Bitcoin Asia 2026 as the must-attend event',
    color: 'blue',
    tweetTemplates: [
      {
        id: 'aw-1',
        pillarId: 'education',
        category: 'education',
        hashtags: ['#Bitcoin', '#BitcoinEducation', '#BitcoinHK'],
        content: "Bitcoin isn't just digital money — it's a monetary system with a fixed supply of 21 million coins that no government can inflate. For Hong Kong, that matters more than ever.",
      },
      {
        id: 'aw-2',
        pillarId: 'education',
        category: 'education',
        hashtags: ['#Bitcoin', '#BitcoinEducation', '#BitcoinAsia2026'],
        content: "Self-custody means your Bitcoin is truly yours. No bank can freeze it. No exchange can gate your access. Here's how it works in plain language 🔑",
      },
      {
        id: 'aw-3',
        pillarId: 'hk-adoption',
        category: 'education',
        hashtags: ['#BitcoinHK', '#HongKong', '#BitcoinAsia2026'],
        content: "Hong Kong is cementing itself as Asia's Bitcoin hub in 2026. Regulated spot ETFs, licensed exchanges, and now — the region's biggest Bitcoin conference. The momentum is real.",
      },
      {
        id: 'aw-4',
        pillarId: 'hk-adoption',
        category: 'education',
        hashtags: ['#BitcoinHK', '#HKCrypto'],
        content: "What does Bitcoin adoption actually look like on the ground in HK? From OTC desks in Mong Kok to institutional custody solutions — the ecosystem is maturing fast.",
      },
      {
        id: 'aw-5',
        pillarId: 'industry',
        category: 'education',
        hashtags: ['#Bitcoin', '#MacroBitcoin', '#BitcoinAsia'],
        content: "Corporate Bitcoin treasuries are no longer a US phenomenon. Asian companies are taking note. Here's the macro case for BTC as a reserve asset in 2026.",
      },
      {
        id: 'aw-6',
        pillarId: 'industry',
        category: 'education',
        hashtags: ['#Bitcoin', '#BitcoinMarket', '#BTC'],
        content: "Bitcoin vs. gold for Asian investors: the store-of-value shift is accelerating. On-chain data tells the story — and it's pointing in one direction.",
      },
      {
        id: 'aw-7',
        pillarId: 'community',
        category: 'community',
        hashtags: ['#Bitcoiners', '#BitcoinCommunity', '#BitcoinAsia2026'],
        content: "What brought you to Bitcoin? We're building a community of Bitcoiners across Asia. Tell us your story — where are you from and when did you first hold sats? 🧡",
      },
      {
        id: 'aw-8',
        pillarId: 'education',
        category: 'education',
        hashtags: ['#LightningNetwork', '#Bitcoin', '#BitcoinAsia2026'],
        content: "The Lightning Network makes Bitcoin payments instant and cheap — sub-cent fees, settled in seconds. For Asia's unbanked populations, this is transformative.",
      },
    ],
  },
  {
    id: 'excitement',
    name: 'Excitement',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    dailyTweetTarget: [3, 4],
    pillarMix: { conference: 40, industry: 25, 'hk-adoption': 20, community: 15 },
    postingTimes: ['09:00 HKT', '12:00 HKT', '18:00 HKT'],
    description: 'Reveal speakers & agenda — build anticipation and drive ticket interest',
    color: 'purple',
    tweetTemplates: [
      {
        id: 'ex-1',
        pillarId: 'conference',
        category: 'speaker-reveal',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK', '#Bitcoin'],
        content: "🎤 SPEAKER ANNOUNCEMENT — one of the most important voices in Bitcoin takes the stage at Bitcoin Asia 2026. August 27-28, Hong Kong Convention Centre. Tickets → link in bio.",
      },
      {
        id: 'ex-2',
        pillarId: 'conference',
        category: 'speaker-reveal',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK'],
        content: "The Bitcoin Asia 2026 agenda is shaping up. Day 1: Macro & Monetary Policy. Day 2: Technology & Adoption. 200+ speakers. 15,000+ attendees. Hong Kong, August 27-28. Are you in?",
      },
      {
        id: 'ex-3',
        pillarId: 'conference',
        category: 'speaker-reveal',
        hashtags: ['#BitcoinAsia2026', '#BitcoinHK'],
        content: "Why Hong Kong for the largest Bitcoin conference in Asia? Regulatory clarity, world-class infrastructure, and the beating heart of Asian finance. See you August 27-28 🏙️",
      },
      {
        id: 'ex-4',
        pillarId: 'conference',
        category: 'speaker-reveal',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK'],
        content: "Partnership announcement: a leading Bitcoin infrastructure company joins Bitcoin Asia 2026 as a headline sponsor. Building the future of Bitcoin in Asia — together.",
      },
      {
        id: 'ex-5',
        pillarId: 'industry',
        category: 'education',
        hashtags: ['#Bitcoin', '#BitcoinMarket', '#BitcoinAsia2026'],
        content: "Institutional Bitcoin adoption in Asia is moving faster than most people realize. Here's what the data shows heading into the second half of 2026.",
      },
      {
        id: 'ex-6',
        pillarId: 'community',
        category: 'community',
        hashtags: ['#BitcoinAsia2026', '#Bitcoiners'],
        content: "Meet the builders attending Bitcoin Asia 2026. From Singapore to Seoul, Tokyo to Taipei — the Asian Bitcoin community is coming to Hong Kong this August. 🌏",
      },
      {
        id: 'ex-7',
        pillarId: 'conference',
        category: 'speaker-reveal',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK'],
        content: "What topics do you want covered at Bitcoin Asia 2026? Reply below — the best suggestions go to our programming team. Speaker submissions still open.",
      },
      {
        id: 'ex-8',
        pillarId: 'hk-adoption',
        category: 'education',
        hashtags: ['#BitcoinHK', '#HKCrypto', '#BitcoinAsia2026'],
        content: "Hong Kong's Bitcoin regulatory framework in 2026: licensed VASPs, spot ETF approval, and what comes next. The policy landscape is shifting in Bitcoin's favour.",
      },
    ],
  },
  {
    id: 'urgency',
    name: 'Urgency',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    dailyTweetTarget: [4, 5],
    pillarMix: { conference: 50, community: 20, industry: 20, education: 10 },
    postingTimes: ['09:00 HKT', '12:00 HKT', '17:00 HKT', '21:00 HKT'],
    description: 'Drive ticket conversions — create FOMO and deadline-driven urgency',
    color: 'amber',
    tweetTemplates: [
      {
        id: 'ur-1',
        pillarId: 'conference',
        category: 'urgency',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK', '#Bitcoin'],
        content: "⏳ Tickets are going fast for Bitcoin Asia 2026. Last year sold out 3 weeks before the event. Don't miss Asia's biggest Bitcoin conference. August 27-28, Hong Kong.",
      },
      {
        id: 'ur-2',
        pillarId: 'conference',
        category: 'urgency',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK'],
        content: "Early bird pricing ends July 15. After that, standard rates apply. Bitcoin Asia 2026 — August 27-28, Hong Kong Convention Centre. 15,000+ Bitcoiners. 200+ speakers.",
      },
      {
        id: 'ur-3',
        pillarId: 'community',
        category: 'community',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK', '#Bitcoin'],
        content: "Who's already confirmed for Bitcoin Asia 2026? Drop a 🙋 below. We're tracking the countries represented — last count: 48. See you in Hong Kong this August.",
      },
      {
        id: 'ur-4',
        pillarId: 'community',
        category: 'community',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK'],
        content: "Your complete pre-conference checklist ✅ Book flights ✅ Reserve hotel near HKCC ✅ Set up your Lightning wallet ✅ Follow @bitcoinconfHK ✅ Get your ticket",
      },
      {
        id: 'ur-5',
        pillarId: 'conference',
        category: 'urgency',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK'],
        content: "FINAL speaker announcement wave. The full Bitcoin Asia 2026 lineup is now live. This is the room where Bitcoin's future in Asia gets discussed. August 27-28, Hong Kong.",
      },
      {
        id: 'ur-6',
        pillarId: 'industry',
        category: 'education',
        hashtags: ['#Bitcoin', '#MacroBitcoin', '#BitcoinAsia2026'],
        content: "Bitcoin's market structure heading into August: what HODLers need to know before Bitcoin Asia 2026. On-chain signals, macro setup, and what speakers are watching.",
      },
      {
        id: 'ur-7',
        pillarId: 'conference',
        category: 'urgency',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK'],
        content: "Can't make it to Hong Kong in person? Bitcoin Asia 2026 live stream passes are available. Watch all sessions and panels from anywhere in the world → link in bio.",
      },
    ],
  },
  {
    id: 'hype',
    name: 'Hype',
    startDate: '2026-08-01',
    endDate: '2026-08-26',
    dailyTweetTarget: [5, 6],
    pillarMix: { conference: 60, community: 20, 'hk-adoption': 10, innovation: 10 },
    postingTimes: ['08:00 HKT', '10:00 HKT', '13:00 HKT', '17:00 HKT', '21:00 HKT'],
    description: 'Maximum pre-event energy — countdown, logistics, final push',
    color: 'orange',
    tweetTemplates: [
      {
        id: 'hy-1',
        pillarId: 'conference',
        category: 'countdown',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK', '#Bitcoin'],
        content: "🔥 The countdown is on. Bitcoin Asia 2026 — the largest Bitcoin conference in Asia. Hong Kong Convention Centre. August 27-28. Are. You. Ready.",
      },
      {
        id: 'hy-2',
        pillarId: 'conference',
        category: 'countdown',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK'],
        content: "Logistics guide for Bitcoin Asia 2026 attendees 🏨 Hotels near HKCC 🚇 MTR from airport 📱 Download the conference app ⚡ Charge your Lightning wallet — see you there.",
      },
      {
        id: 'hy-3',
        pillarId: 'conference',
        category: 'countdown',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK'],
        content: "The Bitcoin Asia 2026 schedule drops tomorrow. Here's a sneak peek at what Day 1 looks like — 6 stages, 80+ sessions, running 9am to 7pm HKT. Don't miss it.",
      },
      {
        id: 'hy-4',
        pillarId: 'community',
        category: 'community',
        hashtags: ['#BitcoinAsia2026', '#Bitcoiners', '#BitcoinHK'],
        content: "Tag someone who needs to be at Bitcoin Asia 2026. The Bitcoin community across Asia is converging on Hong Kong August 27-28. 🧡",
      },
      {
        id: 'hy-5',
        pillarId: 'conference',
        category: 'urgency',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK', '#Bitcoin'],
        content: "Last 500 tickets for Bitcoin Asia 2026. No extensions. No extra batches. When they're gone, they're gone. August 27-28, Hong Kong Convention Centre → link in bio.",
      },
      {
        id: 'hy-6',
        pillarId: 'innovation',
        category: 'education',
        hashtags: ['#BitcoinAsia2026', '#BitcoinDev', '#LightningNetwork'],
        content: "What's coming in Bitcoin tech in the next 12 months? The builders presenting at Bitcoin Asia 2026 are about to show you. Lightning, Nostr, Fedimint — live demos on stage.",
      },
      {
        id: 'hy-7',
        pillarId: 'hk-adoption',
        category: 'education',
        hashtags: ['#BitcoinHK', '#BitcoinAsia2026'],
        content: "Hong Kong is ready for Bitcoin Asia 2026. The city that bridges East and West — where Bitcoin's Asian chapter is being written. See you there. 🏙️",
      },
      {
        id: 'hy-8',
        pillarId: 'conference',
        category: 'countdown',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK', '#Bitcoin'],
        content: "T-minus 7 days. Bitcoin Asia 2026 is almost here. Hong Kong Convention Centre. August 27-28. 15,000 Bitcoiners. 200 speakers. History being made.",
      },
    ],
  },
  {
    id: 'live',
    name: 'Live Coverage',
    startDate: '2026-08-27',
    endDate: '2026-08-28',
    dailyTweetTarget: [10, 15],
    pillarMix: { conference: 80, community: 20 },
    postingTimes: ['09:00 HKT', '10:30 HKT', '12:00 HKT', '13:30 HKT', '15:00 HKT', '16:30 HKT', '18:00 HKT', '20:00 HKT'],
    description: 'Real-time coverage — quotes, moments, announcements from the floor',
    color: 'green',
    tweetTemplates: [
      {
        id: 'lv-1',
        pillarId: 'conference',
        category: 'live',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK', '#Bitcoin'],
        content: "🔴 LIVE from Bitcoin Asia 2026 — Day 1 has begun. Hong Kong Convention Centre is packed. 15,000+ Bitcoiners in the room. Let's go. 🧡",
      },
      {
        id: 'lv-2',
        pillarId: 'conference',
        category: 'live',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK', '#Bitcoin'],
        content: "Key quote from the main stage at Bitcoin Asia 2026: [fill in speaker quote here] — This is why we're here. #BitcoinConfHK",
      },
      {
        id: 'lv-3',
        pillarId: 'conference',
        category: 'live',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK'],
        content: "Just announced from the Bitcoin Asia 2026 main stage: [fill in announcement] — This is huge for Bitcoin in Asia.",
      },
      {
        id: 'lv-4',
        pillarId: 'community',
        category: 'live',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK', '#Bitcoin'],
        content: "The energy at Bitcoin Asia 2026 is electric. Bitcoiners from 48+ countries in one room. This is what a movement looks like. 🌏",
      },
      {
        id: 'lv-5',
        pillarId: 'conference',
        category: 'live',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK'],
        content: "Day 1 of Bitcoin Asia 2026 wrapping up. Incredible sessions, world-class speakers, and the energy is just getting started. Day 2 kicks off 9am HKT tomorrow.",
      },
      {
        id: 'lv-6',
        pillarId: 'conference',
        category: 'live',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK', '#Bitcoin'],
        content: "That's a wrap on Bitcoin Asia 2026. Two days. 15,000+ attendees. 200+ speakers. Countless ideas exchanged. Bitcoin in Asia will never be the same. Thank you Hong Kong. 🧡",
      },
    ],
  },
  {
    id: 'post-event',
    name: 'Post-Event',
    startDate: '2026-08-29',
    endDate: '2026-12-31',
    dailyTweetTarget: [2, 3],
    pillarMix: { conference: 50, community: 30, education: 20 },
    postingTimes: ['10:00 HKT', '18:00 HKT'],
    description: 'Sustain momentum — recaps, highlights, and building toward next year',
    color: 'gray',
    tweetTemplates: [
      {
        id: 'pe-1',
        pillarId: 'conference',
        category: 'recap',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK', '#Bitcoin'],
        content: "The numbers are in from Bitcoin Asia 2026: 15,000+ attendees. 200+ speakers. 48 countries represented. The largest Bitcoin conference ever held in Asia. Thank you. 🧡",
      },
      {
        id: 'pe-2',
        pillarId: 'community',
        category: 'recap',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK', '#Bitcoin'],
        content: "What was your favourite moment from Bitcoin Asia 2026? Drop it below — we're compiling the community highlights for the official recap.",
      },
      {
        id: 'pe-3',
        pillarId: 'conference',
        category: 'recap',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK'],
        content: "Full session recordings from Bitcoin Asia 2026 are being uploaded now. Subscribe to our channel so you don't miss a single talk from Hong Kong.",
      },
      {
        id: 'pe-4',
        pillarId: 'community',
        category: 'recap',
        hashtags: ['#BitcoinAsia2026', '#BitcoinConfHK'],
        content: "To every Bitcoiner who flew into Hong Kong for Bitcoin Asia 2026 — thank you for making this the event it was. See you next year. 🧡",
      },
      {
        id: 'pe-5',
        pillarId: 'education',
        category: 'recap',
        hashtags: ['#Bitcoin', '#BitcoinEducation', '#BitcoinAsia2026'],
        content: "Missed Bitcoin Asia 2026? Start here: the 5 most-shared ideas from this year's conference, summarised in a thread. #Bitcoin",
      },
    ],
  },
];

export function getPhaseForDate(date: string): MarketingPhase {
  return (
    MARKETING_PHASES.find(p => date >= p.startDate && date <= p.endDate) ??
    MARKETING_PHASES[MARKETING_PHASES.length - 1]
  );
}

export function daysToConference(date: string): number {
  const now = new Date(date).getTime();
  const conf = new Date(CONFERENCE_DATE).getTime();
  return Math.max(0, Math.ceil((conf - now) / 86400000));
}

export function getDailyTarget(date: string): number {
  const phase = getPhaseForDate(date);
  return Math.round((phase.dailyTweetTarget[0] + phase.dailyTweetTarget[1]) / 2);
}

export function getWeekDates(anchorDate: string): string[] {
  const anchor = new Date(anchorDate + 'T00:00:00Z');
  const dow = anchor.getUTCDay();
  const mondayOffset = (dow + 6) % 7;
  const monday = new Date(anchor.getTime() - mondayOffset * 86400000);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday.getTime() + i * 86400000);
    return d.toISOString().slice(0, 10);
  });
}

export function getTodayTemplates(date: string, count: number): TweetTemplate[] {
  const phase = getPhaseForDate(date);
  if (!phase.tweetTemplates.length) return [];

  // Day-of-year seed for deterministic daily rotation
  const dayOfYear = Math.floor(
    (new Date(date).getTime() - new Date(date.slice(0, 4) + '-01-01').getTime()) / 86400000
  );

  // Build a weighted ordered list respecting pillarMix
  const pillarIds = Object.entries(phase.pillarMix)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => id);

  const ordered: TweetTemplate[] = [];
  const seen = new Set<string>();

  // First pass: pick one template per pillar in priority order
  for (const pillarId of pillarIds) {
    const candidates = phase.tweetTemplates.filter(t => t.pillarId === pillarId);
    if (candidates.length) {
      const idx = (dayOfYear + ordered.length) % candidates.length;
      const pick = candidates[idx];
      if (!seen.has(pick.id)) {
        ordered.push(pick);
        seen.add(pick.id);
      }
    }
  }

  // Second pass: fill remaining slots with remaining templates
  for (const t of phase.tweetTemplates) {
    if (ordered.length >= count) break;
    if (!seen.has(t.id)) {
      ordered.push(t);
      seen.add(t.id);
    }
  }

  return ordered.slice(0, count);
}
