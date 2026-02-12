import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized');
    }
    return Promise.reject(error);
  }
);

export const contentApi = {
  getList: (params?: any) => client.get('/content', { params }),
  getById: (id: string) => client.get(`/content/${id}`),
  classify: (id: string) => client.post(`/content/${id}/classify`),
  override: (id: string, isEvergreen: boolean) =>
    client.post(`/content/${id}/override`, { is_evergreen: isEvergreen }),
};

export const accountsApi = {
  getList: () => client.get('/accounts'),
  create: (data: any) => client.post('/accounts', data),
  getById: (id: string) => client.get(`/accounts/${id}`),
  update: (id: string, data: any) => client.patch(`/accounts/${id}`, data),
  delete: (id: string) => client.delete(`/accounts/${id}`),
  sync: (id: string) => client.post(`/accounts/${id}/sync`),
};

export const adminApi = {
  getSyncStatus: () => client.get('/admin/sync-status'),
  triggerSync: () => client.post('/admin/trigger-sync'),
  getClassificationStats: () => client.get('/admin/classifications/stats'),
  classifyAll: () => client.post('/admin/classify-all'),
  getSystemInfo: () => client.get('/admin/system-info'),
};

export default client;
