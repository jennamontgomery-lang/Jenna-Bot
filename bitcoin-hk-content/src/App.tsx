import { useState, useCallback } from 'react';
import { LayoutDashboard, Library, PenSquare, Bird } from 'lucide-react';
import type { Post, TweetTemplate } from './types';
import { PILLARS } from './data/pillars';
import { getPosts } from './data/store';
import Dashboard from './pages/Dashboard';
import TwitterDashboard from './pages/TwitterDashboard';
import LibraryPage from './pages/Library';
import PillarView from './pages/PillarView';
import PostBuilder from './components/PostBuilder';

type Tab = 'twitter' | 'dashboard' | 'builder' | 'library';
type View = { type: 'pillar'; pillarId: string } | null;

interface Prefill {
  content: string;
  pillarId: string;
  hashtags: string[];
}

function usePosts() {
  const [posts, setPosts] = useState<Post[]>(() => getPosts());
  const refresh = useCallback(() => setPosts(getPosts()), []);
  return { posts, refresh };
}

export default function App() {
  const [tab, setTab] = useState<Tab>('twitter');
  const [view, setView] = useState<View>(null);
  const [builderPillarId, setBuilderPillarId] = useState<string | undefined>();
  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const { posts, refresh } = usePosts();

  function openPillar(pillarId: string) {
    setView({ type: 'pillar', pillarId });
    setTab('dashboard');
  }

  function openBuilderForPillar(pillarId: string) {
    setBuilderPillarId(pillarId);
    setPrefill(null);
    setTab('builder');
    setView(null);
  }

  function handleUseTweet(template: TweetTemplate) {
    setPrefill({ content: template.content, pillarId: template.pillarId, hashtags: template.hashtags });
    setBuilderPillarId(template.pillarId);
    setTab('builder');
    setView(null);
  }

  const NAV = [
    { id: 'twitter' as Tab, label: 'Twitter', icon: Bird },
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'builder' as Tab, label: 'Post Builder', icon: PenSquare },
    { id: 'library' as Tab, label: 'Library', icon: Library },
  ];

  function renderContent() {
    if (tab === 'twitter') {
      return (
        <TwitterDashboard
          posts={posts}
          onUseTweet={handleUseTweet}
          onChanged={refresh}
        />
      );
    }

    if (tab === 'dashboard') {
      if (view?.type === 'pillar') {
        const pillar = PILLARS.find(p => p.id === view.pillarId)!;
        return (
          <PillarView
            pillar={pillar}
            posts={posts}
            onBack={() => setView(null)}
            onCreatePost={() => openBuilderForPillar(view.pillarId)}
            onChanged={refresh}
          />
        );
      }
      return <Dashboard posts={posts} onPillarClick={openPillar} />;
    }

    if (tab === 'builder') {
      return (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Post Builder</h2>
            <p className="text-sm text-gray-500">Create platform-ready content for each content pillar.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <PostBuilder
              defaultPillarId={builderPillarId}
              prefillContent={prefill?.content}
              prefillPillarId={prefill?.pillarId}
              prefillHashtags={prefill?.hashtags}
              onSaved={() => { refresh(); setPrefill(null); }}
            />
          </div>
        </div>
      );
    }

    return <LibraryPage posts={posts} onChanged={refresh} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-orange-500">₿</span>
            <span className="font-bold text-gray-900 text-sm">Bitcoin Asia</span>
            <span className="text-gray-300 text-sm">|</span>
            <span className="text-gray-500 text-xs">Content Hub</span>
          </div>
          <nav className="flex gap-1">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setTab(id); setView(null); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  tab === id
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
}
