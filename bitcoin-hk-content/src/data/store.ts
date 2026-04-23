import type { Post } from '../types';

const POSTS_KEY = 'btc_hk_posts';

export function getPosts(): Post[] {
  try {
    return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function savePosts(posts: Post[]): void {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function addPost(post: Post): void {
  const posts = getPosts();
  savePosts([...posts, post]);
}

export function updatePost(updated: Post): void {
  const posts = getPosts();
  savePosts(posts.map(p => p.id === updated.id ? updated : p));
}

export function deletePost(id: string): void {
  savePosts(getPosts().filter(p => p.id !== id));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
