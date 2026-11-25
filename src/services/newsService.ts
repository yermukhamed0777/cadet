import { news } from '../data/news';
import type { NewsItem } from '../types';
import { api } from './apiClient';
import { isDemoMode } from './config';

/** Updates: in demo, verified items from data/news.ts; in production, GET /news (CMS). */
export const newsService = {
  async list(): Promise<NewsItem[]> {
    const items = isDemoMode() ? news : await api<NewsItem[]>('/news');
    return [...items].sort((a, b) => b.date.localeCompare(a.date));
  },
};
