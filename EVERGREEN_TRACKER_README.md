# Evergreen Content Tracker

Automatically pull, classify, and organize reusable Bitcoin conference content from social media platforms for year-over-year reposting.

## Features

- **Multi-Platform Tracking**: Monitor content from Twitter, Instagram, and LinkedIn
- **Automatic Classification**: AI-powered system to identify evergreen (reusable) vs. time-sensitive content
- **Organized Dashboard**: Browse and search content by platform, account, category, and keyword
- **One-Click Reposting**: Pre-formatted copy ready for immediate reposting
- **Confidence Scoring**: Understand classification reliability with confidence indicators
- **Manual Overrides**: Correct classifications and learn from feedback
- **Scheduled Syncing**: Automatically pull new content on a configurable schedule

## Supported Accounts

- Bitcoin Conference (@bitcoinconf, @BTCConf)
- Bitcoin Amsterdam (@BitcoinAmsterdam)
- Bitcoin Asia (@BitcoinAsia, @BitcoinHK)
- Bitcoin Mina (@BitcoinMina)

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Social media API credentials (Twitter Bearer Token, Instagram credentials, LinkedIn API key)

### Setup

1. **Clone and navigate to project**:
```bash
cd /home/user/Jenna-Bot
```

2. **Create environment file**:
```bash
cp .env.example .env
```

3. **Add your credentials** to `.env`:
```env
TWITTER_BEARER_TOKEN=your_token_here
INSTAGRAM_USERNAME=your_username
INSTAGRAM_PASSWORD=your_password
LINKEDIN_API_KEY=your_key_here
```

4. **Start the application**:
```bash
docker-compose up
```

5. **Access the application**:
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs
- Admin Panel: http://localhost:8000/admin

## Adding Social Media Accounts

1. Go to **Accounts** page in the dashboard
2. Click **Add Account**
3. Select platform (Twitter, Instagram, or LinkedIn)
4. Enter account handle and credentials
5. Click **Verify** to test authentication

The system will automatically start syncing content from the account.

## Understanding the Classification System

### Evergreen Content (✓)
- Educational content ("How to buy Bitcoin", "Security tips")
- Philosophical content ("Why Bitcoin", "Principles of decentralization")
- Historical content ("Early days of Bitcoin", "Bitcoin history")
- Technical deep-dives and tutorials
- Motivational and inspirational posts

### Time-Sensitive Content (⏰)
- Event announcements and countdowns
- Specific date references ("Join us on Feb 15")
- Limited-time promotions
- Conference-specific updates

### Confidence Scores
- **Green (0.8+)**: High confidence - content is correctly classified
- **Yellow (0.6-0.79)**: Medium confidence - review recommended
- **Red (<0.6)**: Low confidence - manual review strongly recommended

## Manual Content Review

To override the automatic classification:

1. Click on a content card
2. Click **Mark as Evergreen** or **Mark as Time-sensitive**
3. The system learns from your corrections

## API Documentation

### List Content
```bash
GET /api/content?is_evergreen=true&limit=20&offset=0
```

### Get Content Details
```bash
GET /api/content/{content_id}
```

### Classify Content
```bash
POST /api/content/{content_id}/classify
```

### List Accounts
```bash
GET /api/accounts
```

### Trigger Manual Sync
```bash
POST /api/admin/trigger-sync
```

### Get System Status
```bash
GET /api/admin/sync-status
```

## Advanced Configuration

### Change Sync Schedule
Edit `docker-compose.yml` and modify `SYNC_INTERVAL_HOURS`:
```yaml
environment:
  - SYNC_INTERVAL_HOURS=6  # Sync every 6 hours
```

### Use PostgreSQL Instead of SQLite
For production deployments, update `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/evergreen
```

### Increase Content Confidence
The classifier uses rule-based detection and can be enhanced with:
1. Manual feedback through the UI
2. Training data from historical classifications
3. Machine learning models (future enhancement)

## Troubleshooting

### Container Won't Start
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Database Errors
```bash
# Reset database
rm -rf data/
docker-compose up
```

### Credentials Not Working
1. Verify API credentials in social media platform dashboards
2. Check API rate limits haven't been exceeded
3. Ensure tokens haven't expired

### Content Not Showing
1. Check sync status: Visit `/api/admin/sync-status`
2. Trigger manual sync: POST `/api/admin/trigger-sync`
3. Verify accounts are active in the dashboard

## Performance Tips

- Limit page size to 20-50 items for faster loading
- Use specific filters to reduce result set
- Archive old content after 2 years
- Run sync during low-traffic hours

## Future Enhancements

- Machine learning classifier training
- Automated scheduling for reposting
- Team collaboration and approval workflows
- Content variation generator
- Mobile app
- Advanced analytics and reporting

## Support

For issues, questions, or feature requests:
1. Check existing issues in the GitHub repository
2. Create a detailed bug report with logs
3. Include your Docker Compose setup

## License

Part of the Jenna-Bot project. See main repository for license details.
