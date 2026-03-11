"""
Social Media Data Reporter Plugin for Jenna

Analyzes social media posts from X (Twitter) and displays key metrics:
- CTR (Click-Through Rate)
- ER (Engagement Rate)
- Likes, Views, Comments, Reposts

Usage:
  report <X_URL>        - Analyze an X post link
  Example: report https://x.com/username/status/1234567890
"""

import re
import json
from pathlib import Path
from datetime import datetime

# Config for API credentials (users can add their own)
CONFIG_DIR = Path.home() / ".jenna"
SOCIAL_CONFIG = CONFIG_DIR / "social_media_config.json"


def load_config():
    """Load social media API configuration."""
    if SOCIAL_CONFIG.exists():
        try:
            with open(SOCIAL_CONFIG, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return {}
    return {}


def save_config(config):
    """Save social media API configuration."""
    CONFIG_DIR.mkdir(exist_ok=True)
    with open(SOCIAL_CONFIG, "w") as f:
        json.dump(config, f, indent=2)


def parse_x_url(url):
    """Parse X (Twitter) URL and extract post ID and username."""
    # Match various X URL formats
    patterns = [
        r'x\.com/(\w+)/status/(\d+)',  # x.com/username/status/id
        r'twitter\.com/(\w+)/status/(\d+)',  # twitter.com/username/status/id
        r'x\.com/(\w+)/statuses/(\d+)',  # x.com/username/statuses/id
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return {
                "username": match.group(1),
                "post_id": match.group(2),
                "valid": True
            }

    return {"valid": False, "error": "Invalid X URL format"}


def fetch_post_data(post_id, username, config):
    """
    Fetch post data from X API.
    Requires Twitter API v2 bearer token configured.
    """
    # Check if API credentials are configured
    if "twitter_bearer_token" not in config:
        return None

    try:
        import urllib.request
        import urllib.error

        bearer_token = config["twitter_bearer_token"]

        # X API v2 endpoint for tweet details
        url = f"https://api.twitter.com/2/tweets/{post_id}"
        params = "?tweet.fields=public_metrics,created_at&expansions=author_id"
        full_url = url + params

        headers = {
            "Authorization": f"Bearer {bearer_token}",
            "User-Agent": "JennaBot/1.0"
        }

        request = urllib.request.Request(full_url, headers=headers)

        with urllib.request.urlopen(request, timeout=5) as response:
            data = json.loads(response.read().decode())
            return data

    except Exception as e:
        print(f"Error fetching from API: {e}")
        return None


def calculate_metrics(data):
    """Calculate engagement metrics from tweet data."""
    if not data or "data" not in data:
        return None

    tweet = data["data"]
    metrics = tweet.get("public_metrics", {})

    views = metrics.get("impression_count", 0)
    likes = metrics.get("like_count", 0)
    retweets = metrics.get("retweet_count", 0)
    comments = metrics.get("reply_count", 0)
    quotes = metrics.get("quote_count", 0)

    # Calculate engagement rate (sum of all engagements / views * 100)
    total_engagements = likes + retweets + comments + quotes
    engagement_rate = (total_engagements / views * 100) if views > 0 else 0

    # Calculate click-through rate (would need additional data)
    # For now, we can estimate based on available metrics
    ctr = 0  # Would need to track actual clicks via UTM parameters

    return {
        "views": views,
        "likes": likes,
        "reposts": retweets + quotes,  # Retweets + Quote tweets
        "comments": comments,
        "engagement_rate": round(engagement_rate, 2),
        "ctr": ctr,
        "total_engagements": total_engagements
    }


def display_metrics(username, post_id, metrics):
    """Display formatted metrics report."""
    print("\n" + "=" * 55)
    print(f"📊 Social Media Data Report - @{username}")
    print("=" * 55)

    if metrics is None:
        print("⚠️  Could not fetch data. API may require authentication.")
        print("   To use real-time data, set up X API credentials:")
        print("   report config --bearer-token YOUR_TOKEN")
        print("=" * 55 + "\n")
        return

    # Display metrics in a nice format
    print(f"\n📈 POST METRICS")
    print("-" * 55)
    print(f"  Views:               {metrics['views']:>10,}")
    print(f"  Likes:               {metrics['likes']:>10,}")
    print(f"  Reposts:             {metrics['reposts']:>10,}")
    print(f"  Comments:            {metrics['comments']:>10,}")
    print(f"  Total Engagements:   {metrics['total_engagements']:>10,}")

    print(f"\n📊 ENGAGEMENT METRICS")
    print("-" * 55)
    print(f"  Engagement Rate:     {metrics['engagement_rate']:>10.2f}%")
    print(f"  Click-Through Rate:  {metrics['ctr']:>10.2f}%")

    # Display engagement quality
    engagement_quality = get_engagement_quality(metrics['engagement_rate'])
    print(f"\n✨ Quality: {engagement_quality}")

    # Breakdown of engagement types
    if metrics['total_engagements'] > 0:
        print(f"\n💬 ENGAGEMENT BREAKDOWN")
        print("-" * 55)
        likes_pct = (metrics['likes'] / metrics['total_engagements'] * 100)
        reposts_pct = (metrics['reposts'] / metrics['total_engagements'] * 100)
        comments_pct = (metrics['comments'] / metrics['total_engagements'] * 100)

        print(f"  Likes:       {likes_pct:>6.1f}% │ {'█' * int(likes_pct/5)}")
        print(f"  Reposts:     {reposts_pct:>6.1f}% │ {'█' * int(reposts_pct/5)}")
        print(f"  Comments:    {comments_pct:>6.1f}% │ {'█' * int(comments_pct/5)}")

    print("\n" + "=" * 55 + "\n")


def get_engagement_quality(engagement_rate):
    """Determine engagement quality based on rate."""
    if engagement_rate >= 10:
        return "🔥 Exceptional (10%+)"
    elif engagement_rate >= 5:
        return "⭐ Excellent (5-10%)"
    elif engagement_rate >= 2:
        return "👍 Good (2-5%)"
    elif engagement_rate >= 0.5:
        return "📈 Average (0.5-2%)"
    else:
        return "📉 Low (<0.5%)"


def display_demo_data(username, post_id):
    """Display demo data when API is not configured."""
    import random

    # Generate realistic demo data
    views = random.randint(10000, 500000)
    likes = int(views * random.uniform(0.01, 0.05))
    reposts = int(views * random.uniform(0.005, 0.03))
    comments = int(views * random.uniform(0.002, 0.02))
    total_engagements = likes + reposts + comments
    engagement_rate = (total_engagements / views * 100) if views > 0 else 0

    metrics = {
        "views": views,
        "likes": likes,
        "reposts": reposts,
        "comments": comments,
        "engagement_rate": round(engagement_rate, 2),
        "ctr": 0,
        "total_engagements": total_engagements
    }

    return metrics


def cmd_social_report(args):
    """Generate a social media data report."""
    if not args:
        print("Usage: report <X_URL>")
        print("Example: report https://x.com/username/status/1234567890")
        return

    url = args.split()[0]
    config = load_config()

    # Parse the URL
    parsed = parse_x_url(url)

    if not parsed["valid"]:
        print(f"❌ {parsed['error']}")
        print("Valid X URL formats:")
        print("  - https://x.com/username/status/post_id")
        print("  - https://twitter.com/username/status/post_id")
        return

    username = parsed["username"]
    post_id = parsed["post_id"]

    print(f"🔍 Analyzing post from @{username}...")

    # Try to fetch real data
    data = fetch_post_data(post_id, username, config)
    metrics = calculate_metrics(data) if data else None

    # If no API data, show demo data
    if metrics is None:
        metrics = display_demo_data(username, post_id)
        print("📌 Showing sample data (requires API key for live data)")

    display_metrics(username, post_id, metrics)


def cmd_social_config(args):
    """Configure social media API credentials."""
    if not args:
        config = load_config()
        print("\n📋 Social Media Configuration")
        print("-" * 40)
        if config:
            print("API Credentials configured:")
            for key in config.keys():
                if "token" in key.lower():
                    print(f"  ✓ {key} (configured)")
        else:
            print("No credentials configured yet.")
        print("\nTo add credentials, use:")
        print("  report config --bearer-token YOUR_TOKEN")
        print()
        return

    # Parse configuration options
    if "--bearer-token" in args:
        token = args.split("--bearer-token")[1].strip()
        config = load_config()
        config["twitter_bearer_token"] = token
        save_config(config)
        print("✅ Twitter API bearer token saved!")
    else:
        print("Unknown configuration option.")
        print("Usage: report config --bearer-token YOUR_TOKEN")


def cmd_social_help(args):
    """Show help for social media reporter."""
    help_text = """
📊 Social Media Data Reporter Help
====================================

COMMANDS:
  report <X_URL>           - Analyze an X post and show metrics
  report config            - View API configuration
  report config --bearer-token TOKEN  - Add X API credentials

METRICS DISPLAYED:
  • Views                  - Total impressions
  • Likes                  - Number of likes
  • Reposts                - Retweets + Quote tweets
  • Comments               - Number of replies
  • Engagement Rate (ER)   - % of viewers who engaged
  • Click-Through Rate (CTR) - Link click rate

EXAMPLE:
  report https://x.com/username/status/1234567890

NOTES:
  • Without API credentials, demo data is shown
  • Real metrics require X API v2 bearer token
  • Get free API access: https://developer.twitter.com

====================================
"""
    print(help_text)


def register():
    """Register social media reporter commands with Jenna."""
    return {
        "report": cmd_social_report,
        "smd": cmd_social_report,  # Short alias
    }
