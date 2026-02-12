import { create } from 'zustand';
import { contentApi, accountsApi, adminApi } from '../api/client';

export interface ContentItem {
  id: string;
  account: {
    id: string;
    handle: string;
    account_name: string;
    platform: string;
    profile_url?: string;
  };
  content_type: string;
  text_content?: string;
  media_urls: string[];
  hashtags: string[];
  engagement: Record<string, number>;
  is_evergreen?: boolean;
  classification_score?: number;
  classification_reason?: string;
  classification?: {
    confidence_score: number;
    categories: string[];
    reason: string;
    time_sensitive_indicators: string[];
    evergreen_indicators: string[];
  };
  repost_ready_copy?: string;
  posted_at: string;
  original_url?: string;
  created_at: string;
}

export interface Account {
  id: string;
  platform: string;
  handle: string;
  account_name: string;
  profile_url?: string;
  is_active: boolean;
  last_synced?: string;
}

export interface FilterState {
  accountId?: string;
  platform?: string;
  isEvergreen?: boolean;
  category?: string;
  search?: string;
  limit: number;
  offset: number;
  sortBy: 'date' | 'engagement' | 'classification_score';
}

interface ContentStore {
  content: ContentItem[];
  total: number;
  hasMore: boolean;
  loading: boolean;
  error?: string;

  accounts: Account[];
  accountsLoading: boolean;

  filters: FilterState;

  // Actions
  fetchContent: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  classifyContent: (id: string) => Promise<void>;
  overrideClassification: (id: string, isEvergreen: boolean) => Promise<void>;
}

const defaultFilters: FilterState = {
  limit: 20,
  offset: 0,
  sortBy: 'date',
};

export const useContentStore = create<ContentStore>((set, get) => ({
  content: [],
  total: 0,
  hasMore: false,
  loading: false,
  accounts: [],
  accountsLoading: false,
  filters: defaultFilters,

  fetchContent: async () => {
    set({ loading: true, error: undefined });
    try {
      const filters = get().filters;
      const params = {
        account_id: filters.accountId,
        platform: filters.platform,
        is_evergreen: filters.isEvergreen,
        category: filters.category,
        search: filters.search,
        limit: filters.limit,
        offset: filters.offset,
        sort_by: filters.sortBy,
      };

      const response = await contentApi.getList(params);
      const data = response.data;

      set({
        content: data.items,
        total: data.total,
        hasMore: data.has_more,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch content',
        loading: false,
      });
    }
  },

  fetchAccounts: async () => {
    set({ accountsLoading: true });
    try {
      const response = await accountsApi.getList();
      set({ accounts: response.data, accountsLoading: false });
    } catch (error: any) {
      set({ accountsLoading: false });
    }
  },

  setFilters: (newFilters: Partial<FilterState>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters, offset: 0 },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  classifyContent: async (id: string) => {
    try {
      await contentApi.classify(id);
      // Refresh content
      get().fetchContent();
    } catch (error: any) {
      set({ error: error.message || 'Classification failed' });
    }
  },

  overrideClassification: async (id: string, isEvergreen: boolean) => {
    try {
      await contentApi.override(id, isEvergreen);
      // Refresh content
      get().fetchContent();
    } catch (error: any) {
      set({ error: error.message || 'Override failed' });
    }
  },
}));
