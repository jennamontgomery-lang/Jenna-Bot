import { useState } from 'react'
import SingleTweetAnalyzer from './components/SingleTweetAnalyzer'
import BitcoinConfAnalyzer from './components/BitcoinConfAnalyzer'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState<'single' | 'bitcoinconf'>('single')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            📊 Social Media Data Reporter
          </h1>
          <p className="text-gray-400">Analyze X/Twitter metrics in real-time</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'single'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            📝 Single Tweet Analysis
          </button>
          <button
            onClick={() => setActiveTab('bitcoinconf')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'bitcoinconf'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            🔍 @bitcoinconf Replies
          </button>
        </div>

        {/* Content */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-8">
          {activeTab === 'single' && <SingleTweetAnalyzer />}
          {activeTab === 'bitcoinconf' && <BitcoinConfAnalyzer />}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Make sure you've added your X API credentials to <code className="bg-slate-700 px-2 py-1 rounded">.env.local</code></p>
        </div>
      </div>
    </div>
  )
}

export default App
