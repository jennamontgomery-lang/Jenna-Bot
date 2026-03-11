# Social Media Data Reporter

A real-time X/Twitter metrics analyzer that provides detailed engagement data for your posts.

## Features

### 📝 Single Tweet Analysis
- Paste any X/Twitter post link
- Get instant metrics:
  - Views
  - Likes
  - Reposts
  - Comments/Replies
  - Engagement Rate

### 🔍 @bitcoinconf Replies Analysis
- Search all replies to @bitcoinconf posts within a date range
- View metrics for each reply
- Direct links to each post
- Filter by custom date ranges

## Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- X/Twitter API credentials (Bearer Token)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your X API credentials:
```bash
cp .env.local.example .env.local
```

3. Edit `.env.local` and add your X API credentials:
```
VITE_X_BEARER_TOKEN=your_bearer_token_here
```

### Running the App

Development mode:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

Build for production:
```bash
npm run build
```

## Getting X API Credentials

1. Go to [Twitter Developer Portal](https://developer.twitter.com)
2. Create a new app (or use existing)
3. Navigate to "Keys and Tokens"
4. Generate a Bearer Token with these permissions:
   - `tweet.read`
   - `users.read`

## How to Use

### Single Tweet Analysis
1. Click the "📝 Single Tweet Analysis" tab
2. Paste a tweet URL (e.g., `https://x.com/user/status/123456`)
3. Click "Analyze"
4. View the metrics and engagement data

### @bitcoinconf Replies Analysis
1. Click the "🔍 @bitcoinconf Replies" tab
2. Select a start date and end date
3. Click "Search Replies"
4. Browse all replies with their metrics

## Metrics Explained

- **Views**: Total impressions of the tweet
- **Likes**: Number of likes received
- **Reposts**: Number of retweets/reposts
- **Comments**: Number of replies to the tweet
- **Engagement Rate**: Percentage of viewers who engaged (liked, retweeted, or replied)
- **CTR**: Click-Through Rate - requires X Analytics data (not available via public API)

## Architecture

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **API**: X/Twitter API v2

## Files Structure

```
src/
├── components/
│   ├── SingleTweetAnalyzer.tsx    # Single tweet analysis component
│   └── BitcoinConfAnalyzer.tsx    # @bitcoinconf replies analyzer
├── utils/
│   └── twitterApi.ts              # X API integration
├── App.tsx                         # Main app component
├── index.css                       # Tailwind styles
└── main.tsx                        # App entry point
```

## Security Note

- Never commit `.env.local` to version control
- Keep your API credentials private
- The app only reads public tweet data
