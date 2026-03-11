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

interface BitcoinConfReplyMetrics extends TweetMetrics {
  image?: string;
  parentTweetLink?: string;
}

const BEARER_TOKEN = import.meta.env.VITE_X_BEARER_TOKEN;

// Fetch tweet by URL/ID
export async function fetchTweetMetrics(tweetUrl: string): Promise<TweetMetrics> {
  try {
    // Extract tweet ID from URL
    const tweetId = extractTweetId(tweetUrl);
    if (!tweetId) {
      throw new Error('Invalid X/Twitter URL');
    }

    const response = await fetch(
      `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=public_metrics,created_at&expansions=author_id&user.fields=username`,
      {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tweet metrics');
    }

    const data = await response.json();
    const tweet = data.data;
    const author = data.includes?.users?.[0];
    const metrics = tweet.public_metrics;

    const totalEngagement = metrics.like_count + metrics.retweet_count + metrics.reply_count;
    const engagementRate = metrics.impression_count > 0
      ? ((totalEngagement / metrics.impression_count) * 100).toFixed(2)
      : '0';

    return {
      id: tweet.id,
      text: tweet.text,
      views: metrics.impression_count || 0,
      likes: metrics.like_count || 0,
      reposts: metrics.retweet_count || 0,
      replies: metrics.reply_count || 0,
      engagementRate: parseFloat(engagementRate),
      link: tweetUrl,
      authorUsername: author?.username,
      createdAt: tweet.created_at,
    };
  } catch (error) {
    throw new Error(`Error fetching tweet: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Fetch @bitcoinconf replies within date range
export async function fetchBitcoinConfReplies(
  startDate: string,
  endDate: string
): Promise<BitcoinConfReplyMetrics[]> {
  try {
    const query = `conversation_id:1234567890 from:bitcoinconf start_time:${startDate}T00:00:00Z end_time:${endDate}T23:59:59Z`;

    const response = await fetch(
      `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&tweet.fields=public_metrics,created_at,conversation_id&expansions=author_id&user.fields=username&max_results=100`,
      {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch @bitcoinconf replies');
    }

    const data = await response.json();
    if (!data.data) {
      return [];
    }

    return data.data.map((tweet: any, index: number) => {
      const metrics = tweet.public_metrics;
      const totalEngagement = metrics.like_count + metrics.retweet_count + metrics.reply_count;
      const engagementRate = metrics.impression_count > 0
        ? ((totalEngagement / metrics.impression_count) * 100).toFixed(2)
        : '0';

      return {
        id: tweet.id,
        text: tweet.text,
        views: metrics.impression_count || 0,
        likes: metrics.like_count || 0,
        reposts: metrics.retweet_count || 0,
        replies: metrics.reply_count || 0,
        engagementRate: parseFloat(engagementRate),
        link: `https://twitter.com/i/web/status/${tweet.id}`,
        authorUsername: data.includes?.users?.[index]?.username,
        createdAt: tweet.created_at,
      };
    });
  } catch (error) {
    throw new Error(`Error fetching @bitcoinconf replies: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper: Extract tweet ID from URL
function extractTweetId(url: string): string | null {
  const patterns = [
    /twitter\.com\/\w+\/status\/(\d+)/,
    /x\.com\/\w+\/status\/(\d+)/,
    /^(\d+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}
