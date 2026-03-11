import { useState } from 'react'
import { fetchBitcoinConfReplies } from '../utils/twitterApi'

interface ReplyMetrics {
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

export default function BitcoinConfAnalyzer() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [replies, setReplies] = useState<ReplyMetrics[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setReplies([])

    if (!startDate || !endDate) {
      setError('Please select both start and end dates')
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before end date')
      return
    }

    setLoading(true)
    try {
      const data = await fetchBitcoinConfReplies(startDate, endDate)
      setReplies(data)
      if (data.length === 0) {
        setError('No replies found in this date range')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch replies')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">@bitcoinconf Replies Analysis</h2>

      {/* Date Range Form */}
      <form onSubmit={handleAnalyze} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Searching...' : 'Search Replies'}
            </button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900 text-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Results Summary */}
      {replies.length > 0 && (
        <div className="mb-6 p-4 bg-green-900 bg-opacity-30 border border-green-600 rounded-lg">
          <p className="text-green-200">
            Found <strong>{replies.length}</strong> replies from @bitcoinconf between {new Date(startDate).toLocaleDateString()} and {new Date(endDate).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Replies List */}
      <div className="space-y-4">
        {replies.map((reply) => (
          <div key={reply.id} className="bg-slate-700 rounded-lg p-6 hover:bg-slate-650 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm">@{reply.authorUsername}</p>
                <p className="text-gray-500 text-xs">
                  {new Date(reply.createdAt || '').toLocaleDateString()} {new Date(reply.createdAt || '').toLocaleTimeString()}
                </p>
              </div>
              <a
                href={reply.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                View Post →
              </a>
            </div>

            {/* Tweet Text */}
            <p className="text-white mb-4 line-clamp-3">{reply.text}</p>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              <div>
                <p className="text-gray-400">Views</p>
                <p className="text-white font-semibold">{reply.views.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Likes ❤️</p>
                <p className="text-white font-semibold">{reply.likes.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Reposts 🔄</p>
                <p className="text-white font-semibold">{reply.reposts.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Comments 💬</p>
                <p className="text-white font-semibold">{reply.replies.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Engagement</p>
                <p className="text-white font-semibold">{reply.engagementRate}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && replies.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Select a date range to search @bitcoinconf replies</p>
        </div>
      )}
    </div>
  )
}
