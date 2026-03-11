import { useState } from 'react'
import { fetchTweetMetrics } from '../utils/twitterApi'

interface TweetMetrics {
  id: string;
  text: string;
  views: number;
  likes: number;
  reposts: number;
  replies: number;
  engagementRate: number;
  link?: string;
  authorUsername?: string;
  createdAt?: string;
}

export default function SingleTweetAnalyzer() {
  const [tweetUrl, setTweetUrl] = useState('')
  const [metrics, setMetrics] = useState<TweetMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMetrics(null)

    if (!tweetUrl.trim()) {
      setError('Please enter a tweet URL')
      return
    }

    setLoading(true)
    try {
      const data = await fetchTweetMetrics(tweetUrl)
      setMetrics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Analyze a Single Tweet</h2>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste X/Twitter post link (e.g., https://x.com/user/status/123456)"
            value={tweetUrl}
            onChange={(e) => setTweetUrl(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900 text-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Metrics Display */}
      {metrics && (
        <div className="space-y-6">
          {/* Tweet Info */}
          <div className="bg-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Tweet Details</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Author:</strong> @{metrics.authorUsername}</p>
              <p><strong>Posted:</strong> {new Date(metrics.createdAt || '').toLocaleDateString()}</p>
              <p className="pt-2"><strong>Content:</strong></p>
              <p className="text-gray-400 line-clamp-3">{metrics.text}</p>
              <a
                href={metrics.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-400 hover:text-blue-300"
              >
                View on X →
              </a>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard label="Views" value={metrics.views.toLocaleString()} />
            <MetricCard label="Likes ❤️" value={metrics.likes.toLocaleString()} />
            <MetricCard label="Reposts 🔄" value={metrics.reposts.toLocaleString()} />
            <MetricCard label="Comments 💬" value={metrics.replies.toLocaleString()} />
            <MetricCard label="Engagement Rate" value={`${metrics.engagementRate}%`} />
            <MetricCard label="Total Engagement" value={(metrics.likes + metrics.reposts + metrics.replies).toLocaleString()} />
          </div>

          {/* CTR Note */}
          <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-4 text-yellow-200 text-sm">
            <p><strong>Note:</strong> CTR (Click-Through Rate) requires additional tracking data from X Analytics. The metrics above show engagement metrics available through the public API.</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!metrics && !loading && !error && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Paste a tweet URL above to get started</p>
        </div>
      )}
    </div>
  )
}

interface MetricCardProps {
  label: string;
  value: string;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="bg-slate-700 rounded-lg p-4 text-center">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
