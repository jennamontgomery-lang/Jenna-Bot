# Evergreen Content Tracker - Setup Guide

## What is the Evergreen Content Tracker?

A powerful automation tool that scans Bitcoin conference social media accounts and automatically identifies and catalogs evergreen (year-over-year reusable) content. The system uses intelligent classification to separate reusable educational, philosophical, and technical content from time-sensitive announcements and promotional posts.

### Key Benefits

✅ Save hours manually searching for reusable content
✅ Automatically categorize content by type and source
✅ Get pre-formatted copy ready to repost
✅ Track engagement metrics across platforms
✅ Manual override to improve AI classifications over time
✅ Scheduled automatic syncing from all platforms

## Prerequisites

Before starting, you'll need:

1. **Docker & Docker Compose** - [Install here](https://docs.docker.com/compose/install/)
2. **Social Media API Credentials**:
   - **Twitter**: Bearer Token from [Twitter Developer Portal](https://developer.twitter.com/)
   - **Instagram**: Username and password (or use [Instagrapi](https://github.com/subzeroid/instagrapi))
   - **LinkedIn**: API credentials from [LinkedIn Developer](https://www.linkedin.com/developers/)

## Quick Start (5 minutes)

### Step 1: Prepare Credentials

Create a `.env` file in the project root with your social media API credentials:

```bash
cat > /home/user/Jenna-Bot/.env << 'EOF'
# Database (default uses SQLite, fine for most use cases)
DATABASE_URL=sqlite:///./data/evergreen.db

# Twitter API v2
TWITTER_BEARER_TOKEN=your_bearer_token_here
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here

# Instagram
INSTAGRAM_USERNAME=your_instagram_username
INSTAGRAM_PASSWORD=your_instagram_password

# LinkedIn
LINKEDIN_API_KEY=your_linkedin_key_here

# App Settings
SYNC_INTERVAL_HOURS=6
EOF
```

### Step 2: Start the Application

```bash
cd /home/user/Jenna-Bot
docker-compose up -d
```

### Step 3: Access the Dashboard

- **Frontend Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Admin Panel**: http://localhost:8000/admin

### Step 4: Add Social Media Accounts

1. Go to the **Accounts** tab
2. Click **Add Account**
3. Select platform (Twitter, Instagram, or LinkedIn)
4. Enter the account handle (e.g., `@BitcoinAmsterdam`)
5. Enter your API credentials
6. Click **Verify**

The system will immediately start syncing content from the account.

## Understanding the Dashboard

### Dashboard Tab
- **Filter Panel**: Search and filter content by account, platform, category, or type
- **Content Grid**: View all evergreen content with:
  - Engagement metrics (likes, shares, comments)
  - Classification confidence score
  - Ready-to-repost copy
  - Media thumbnails
- **One-Click Copy**: Copy formatted text to clipboard for immediate reposting

### Filters Available
- **Search**: Full-text search across all content
- **Platform**: Filter by Twitter, Instagram, or LinkedIn
- **Account**: Filter by specific social media account
- **Content Type**: Show evergreen or time-sensitive content
- **Sort**: By date, engagement, or classification confidence

### Classification Indicators

Content cards show:
- **✓ Evergreen** (Green) - Reusable content for any time
- **⏰ Time-sensitive** (Orange) - Event or date-specific content
- **Confidence Score** (Color-coded):
  - 🟢 Green (80%+) - High confidence
  - 🟡 Yellow (60-79%) - Medium confidence
  - 🔴 Red (<60%) - Low confidence, review recommended

### Manual Corrections

If the AI classifier makes a mistake:
1. Click the content card
2. Click **"Mark as Evergreen"** or **"Mark as Time-sensitive"**
3. The system learns from your feedback

## Content Categories (Auto-Detected)

The system automatically tags content into categories:

- **Bitcoin Basics**: Beginner-friendly explanations
- **Security**: Security tips and best practices
- **Trading**: Price, market, and investment content
- **Technology**: Blockchain, mining, development
- **Adoption**: Real-world use cases and applications
- **Philosophy**: Vision, principles, decentralization
- **Education**: How-tos, guides, tutorials
- **News**: Updates and announcements

## Advanced Configuration

### Change Sync Frequency

Edit `docker-compose.yml`:
```yaml
environment:
  - SYNC_INTERVAL_HOURS=4  # Sync every 4 hours instead of 6
```

Then restart:
```bash
docker-compose restart backend
```

### Use PostgreSQL for Production

For large deployments, use PostgreSQL instead of SQLite:

1. Add PostgreSQL to `docker-compose.yml`:
```yaml
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secure_password_here
      POSTGRES_DB: evergreen
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

2. Update `.env`:
```env
DATABASE_URL=postgresql://postgres:secure_password_here@postgres:5432/evergreen
```

### Trigger Manual Sync

Force an immediate sync of all accounts:

```bash
curl -X POST http://localhost:8000/api/admin/trigger-sync
```

### Get System Status

Check sync status and statistics:

```bash
curl http://localhost:8000/api/admin/sync-status
```

## API Reference

### List Evergreen Content
```bash
curl "http://localhost:8000/api/content?is_evergreen=true&limit=50"
```

### Get Single Content
```bash
curl "http://localhost:8000/api/content/{content_id}"
```

### Override Classification
```bash
curl -X POST "http://localhost:8000/api/content/{content_id}/override?is_evergreen=true"
```

### List Accounts
```bash
curl "http://localhost:8000/api/accounts"
```

### Get Classification Stats
```bash
curl "http://localhost:8000/api/admin/classifications/stats"
```

## Troubleshooting

### Containers Won't Start

Check logs:
```bash
docker-compose logs backend
docker-compose logs frontend
```

### API Credentials Not Working

1. Verify credentials in your social media platform's developer dashboard
2. Ensure API tokens haven't expired
3. Check rate limits haven't been exceeded
4. Confirm credentials are correctly formatted in `.env`

### No Content Showing

1. Check sync status: `curl http://localhost:8000/api/admin/sync-status`
2. Verify accounts are active in the dashboard
3. Check that API credentials are correct
4. Trigger manual sync: `curl -X POST http://localhost:8000/api/admin/trigger-sync`

### Database Issues

Reset the database:
```bash
rm -rf data/
docker-compose restart backend
```

### Memory Issues

Limit Docker memory usage:
```bash
docker-compose down
docker-compose up -d --memory 2g
```

## Performance Tips

- Filter to specific accounts or platforms to reduce data loading
- Use search for precise content discovery
- Set sync interval to 6+ hours to reduce API rate limiting
- Keep database backups for data safety

## Stopping the Application

```bash
docker-compose down
```

To preserve data:
```bash
docker-compose stop
```

To completely remove everything:
```bash
docker-compose down -v
```

## Monitoring & Maintenance

### Check Storage Usage
```bash
du -sh /home/user/Jenna-Bot/data/
```

### View Recent Logs
```bash
docker-compose logs -f backend
```

### Update to Latest Version
```bash
git pull origin claude/evergreen-content-tracker-bqOln
docker-compose restart
```

## Next Steps

1. **Add First Account**: Start syncing your first Bitcoin conference account
2. **Train Classifier**: Review classified content and make corrections for accuracy
3. **Export Content**: Use the copy button to save repost-ready content
4. **Schedule Reposts**: Use the repost-ready copy across your owned channels
5. **Feedback Loop**: Continue marking corrections to improve accuracy

## Support & Documentation

- **Full Documentation**: See `EVERGREEN_TRACKER_README.md`
- **API Reference**: Visit http://localhost:8000/docs
- **Status**: Visit http://localhost:8000/admin for system health

## FAQ

**Q: Will this sync historical content?**
A: Yes, the system pulls up to 100 recent posts on first sync, then 100 new posts on subsequent syncs.

**Q: How often does it sync?**
A: Every 6 hours by default (configurable). You can also trigger manual syncs anytime.

**Q: Is my data secure?**
A: All data is stored locally. Credentials are encrypted at rest. API keys are never exposed in logs.

**Q: Can I use this with other conferences?**
A: Yes! Add any Twitter, Instagram, or LinkedIn account as a data source.

**Q: What if I want to repost evergreen content tomorrow?**
A: Use the **"Copy"** button to get formatted copy ready to paste into any platform.

---

**Ready to get started?** Follow the Quick Start steps above to have your Evergreen Content Tracker running in minutes!
