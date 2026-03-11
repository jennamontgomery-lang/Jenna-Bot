# Social Media Data Reporter

A powerful plugin for Jenna that analyzes X (Twitter) posts and provides detailed engagement metrics and data insights.

## Features

The Social Media Data Reporter provides comprehensive metrics for X posts:

- **📊 Engagement Metrics**
  - Views (Impressions)
  - Likes
  - Reposts (Retweets + Quote Tweets)
  - Comments (Replies)
  - Total Engagements

- **📈 Calculated Metrics**
  - Engagement Rate (ER) - Percentage of viewers who engaged
  - Click-Through Rate (CTR) - Link click percentage
  - Engagement Quality Rating

- **💬 Engagement Breakdown**
  - Visual breakdown of engagement types
  - Percentage distribution of interactions
  - Performance quality assessment

## Quick Start

### Basic Usage (Demo Mode)

Simply provide an X link to get sample data analysis:

```bash
Jenna> report https://x.com/username/status/1234567890
```

This will display:
- 📈 Post metrics (Views, Likes, Reposts, Comments)
- 📊 Engagement metrics (ER, CTR)
- ✨ Quality rating
- 💬 Engagement breakdown with visual bars

### Example Output

```
📊 Social Media Data Report - @username
==================================================

📈 POST METRICS
  Views:               121,710
  Likes:                 1,268
  Reposts:               1,209
  Comments:                715
  Total Engagements:     3,192

📊 ENGAGEMENT METRICS
  Engagement Rate:        2.62%
  Click-Through Rate:     0.00%

✨ Quality: 👍 Good (2-5%)

💬 ENGAGEMENT BREAKDOWN
  Likes:         39.7% │ ███████
  Reposts:       37.9% │ ███████
  Comments:      22.4% │ ████
```

## Real API Data (Optional)

To get **real, live metrics** instead of demo data, you'll need an X API token:

### Getting an X API Token

1. Visit [X Developer Portal](https://developer.twitter.com)
2. Create a new application
3. Generate or retrieve your **Bearer Token** from the API keys section
4. Copy the Bearer Token

### Configuring Your API Credentials

Store your API credentials in Jenna:

```bash
Jenna> report config --bearer-token YOUR_BEARER_TOKEN_HERE
```

View your configuration:

```bash
Jenna> report config
```

### Using Real API Data

Once configured, the reporter will automatically fetch live data:

```bash
Jenna> report https://x.com/username/status/1234567890
```

The plugin will now display actual metrics from X's API instead of generated demo data.

## Commands Reference

### Analyze a Post

```bash
report <X_URL>
```

**Examples:**
- `report https://x.com/elonmusk/status/1234567890`
- `report https://twitter.com/nasa/status/9876543210`
- `report x.com/username/status/1234567890` (without https://)

**Supported URL formats:**
- `https://x.com/username/status/post_id`
- `https://twitter.com/username/status/post_id`

### View/Configure API

```bash
report config
report config --bearer-token YOUR_TOKEN
```

### Short Alias

```bash
smd <X_URL>  # Short for "social media data"
```

## Metrics Explained

### Engagement Rate (ER)
Percentage of post views that resulted in an engagement (like, repost, comment, or quote).

**Formula:** (Total Engagements ÷ Views) × 100

**Quality Tiers:**
- 🔥 **Exceptional:** 10%+
- ⭐ **Excellent:** 5-10%
- 👍 **Good:** 2-5%
- 📈 **Average:** 0.5-2%
- 📉 **Low:** <0.5%

### Click-Through Rate (CTR)
Percentage of viewers who clicked on links in the post.

*Note: Requires URL tracking and additional data sources*

### Engagement Breakdown
Visual representation showing what percentage of total engagements are:
- **Likes** - Simple appreciation reactions
- **Reposts** - Shared with followers (valuable for reach)
- **Comments** - Replies and conversations (highest engagement quality)

## Data Storage

The plugin stores configuration in:
- `~/.jenna/social_media_config.json` - API credentials and settings

## API Rate Limits

With a free X API v2 account:
- 300 requests per 15 minutes
- Real-time data access with slight delays
- Access to public tweets only

## Troubleshooting

### "Invalid X URL format"
Make sure the URL contains:
- A valid username (after `x.com/` or `twitter.com/`)
- A status ID (numeric value after `/status/`)

### "Could not fetch data"
Without an API token configured, the plugin shows demo data. To see real metrics:
1. Get an X API token from [developer.twitter.com](https://developer.twitter.com)
2. Run `report config --bearer-token YOUR_TOKEN`

### API Authentication Failed
- Verify your bearer token is correct
- Check that your token hasn't expired
- Ensure your app has read permissions enabled

## Tips & Tricks

- **Track Performance:** Analyze posts over time to see what resonates with your audience
- **Compare Posts:** Analyze multiple posts to identify patterns
- **Monitor Engagement:** Check how different content types perform
- **Optimize Strategy:** Use ER and engagement breakdown to guide content strategy

## File Structure

```
plugins/
└── social_media_reporter.py    # The plugin code
```

## Example Workflow

```bash
Jenna> report https://x.com/nasa/status/1704123456
🔍 Analyzing post from @nasa...

=======================================================
📊 Social Media Data Report - @nasa
=======================================================

📈 POST METRICS
  Views:                  456,789
  Likes:                   12,345
  Reposts:                  5,678
  Comments:                 3,456
  Total Engagements:       21,479

📊 ENGAGEMENT METRICS
  Engagement Rate:         4.70%
  Click-Through Rate:      0.00%

✨ Quality: 👍 Good (2-5%)

💬 ENGAGEMENT BREAKDOWN
  Likes:         57.4% │ ███████████
  Reposts:       26.4% │ █████
  Comments:      16.2% │ ███
```

## Future Enhancements

Potential improvements for the social media reporter:
- Multi-platform support (Instagram, TikTok, LinkedIn)
- Historical data tracking
- Trend analysis and predictions
- Influencer comparison
- Automated content recommendations
- Scheduling reports
- Export to CSV/PDF

## Support

For issues or feature requests:
- Check the plugin code: `plugins/social_media_reporter.py`
- Review the main Jenna bot documentation: `README.md`
- X API documentation: [developer.twitter.com](https://developer.twitter.com)

---

**Happy analyzing! 📊**
