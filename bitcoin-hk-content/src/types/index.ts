export type Platform = 'twitter' | 'linkedin' | 'instagram' | 'telegram';

export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface ContentPillar {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  hashtags: string[];
  contentIdeas: string[];
  targetAudience: string;
}

export interface Post {
  id: string;
  pillarId: string;
  platform: Platform;
  content: string;
  hashtags: string[];
  status: PostStatus;
  scheduledDate?: string;
  createdAt: string;
  mediaNote?: string;
}

export interface CalendarEntry {
  date: string;
  postId: string;
}
