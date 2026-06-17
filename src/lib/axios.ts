import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/auth';
import { mockDb } from './mockDb';

const isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const api = axios.create({
  baseURL: isLocalDev ? '/api/v1' : 'https://p2p-r5l6.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom adapter to handle fake/guest/demo mode entirely offline
const defaultAdapter = axios.defaults.adapter;
api.defaults.adapter = async (config) => {
  const token = useAuthStore.getState().accessToken;
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  const isDemoLogin = url.includes('/auth/login') && config.data && (() => {
    try {
      const payload = JSON.parse(config.data);
      return payload.login === 'demo' || payload.login === 'admin';
    } catch {
      return false;
    }
  })();

  if (token === 'mock-demo-token-bypass' || isDemoLogin) {
    let data: any = null;

    try {
      if (url.includes('/auth/login')) {
        data = {
          status: 'ok',
          access_token: 'mock-demo-token-bypass',
          refresh_token: 'mock-demo-refresh-bypass',
          onboarding_done: true
        };
      } else if (url.includes('/auth/me')) {
        data = mockDb.getMockUser();
      } else if (url.includes('/profile/skills')) {
        data = mockDb.getMockSkills();
      } else if (url.includes('/profile/')) {
        if (method === 'patch') {
          data = mockDb.updateMockUser(JSON.parse(config.data || '{}'));
        } else if (url.endsWith('/profile/')) {
          data = {
            user: mockDb.getMockUser(),
            stats: mockDb.getMockProfileStats()
          };
        } else {
          // Public profile
          const parts = url.split('/');
          const username = parts[parts.length - 1] || 'student';
          const mockUser = mockDb.getMockUser();
          data = {
            ...mockUser,
            school21_login: username,
            first_name: username.charAt(0).toUpperCase() + username.slice(1)
          };
        }
      } else if (url.includes('/dashboard')) {
        data = mockDb.getMockDashboard();
      } else if (url.includes('/slots/my/teachable-projects')) {
        data = { projects: mockDb.getMockTeachableProjects() };
      } else if (url.includes('/slots/my/in-progress-projects')) {
        data = { projects: mockDb.getMockInProgressProjects() };
      } else if (url.includes('/slots/search')) {
        const project = config.params?.project || '';
        data = mockDb.searchMockSlots(project);
      } else if (url.includes('/slots') && method === 'post') {
        data = mockDb.createMockSlot(JSON.parse(config.data || '{}'));
      } else if (url.includes('/slots') && method === 'get') {
        const status = config.params?.status;
        const date = config.params?.date;
        data = mockDb.getMockSlots(status, date);
      } else if (url.includes('/slots/') && url.endsWith('/book')) {
        const parts = url.split('/');
        const bookIdx = parts.indexOf('book');
        const id = parts[bookIdx - 1];
        const body = JSON.parse(config.data || '{}');
        data = mockDb.bookMockSlot(id, body.reviewee_project);
      } else if (url.includes('/slots/') && url.endsWith('/start')) {
        const parts = url.split('/');
        const startIdx = parts.indexOf('start');
        const id = parts[startIdx - 1];
        data = mockDb.startMockSlot(id);
      } else if (url.includes('/slots/') && url.endsWith('/finish')) {
        const parts = url.split('/');
        const finishIdx = parts.indexOf('finish');
        const id = parts[finishIdx - 1];
        data = mockDb.finishMockSlot(id);
      } else if (url.includes('/slots/') && url.endsWith('/absent')) {
        const parts = url.split('/');
        const absentIdx = parts.indexOf('absent');
        const id = parts[absentIdx - 1];
        data = mockDb.absentMockSlot(id);
      } else if (url.includes('/slots/') && method === 'delete') {
        const parts = url.split('/');
        const id = parts[parts.length - 1];
        data = mockDb.cancelMockSlot(id);
      } else if (url.includes('/slots/')) {
        const parts = url.split('/');
        const id = parts[parts.length - 1];
        data = mockDb.getMockSlotById(id);
      } else if (url.includes('/leaderboard/most-xp')) {
        data = mockDb.getMockMostXP();
      } else if (url.includes('/leaderboard/most-taught')) {
        data = mockDb.getMockMostTaught();
      } else if (url.includes('/leaderboard/most-learned')) {
        data = mockDb.getMockMostLearned();
      } else if (url.includes('/notifications') && url.endsWith('/read')) {
        const parts = url.split('/');
        const readIdx = parts.indexOf('read');
        const id = parts[readIdx - 1];
        mockDb.markMockNotificationAsRead(id);
        data = { success: true };
      } else if (url.includes('/notifications/read-all')) {
        mockDb.markMockAllNotificationsAsRead();
        data = { success: true };
      } else if (url.includes('/notifications')) {
        data = mockDb.getMockNotifications();
      } else if (url.includes('/reviews/my')) {
        data = mockDb.getMockMyReviews();
      } else if (url.includes('/reviews/user/')) {
        const parts = url.split('/');
        const userId = parts[parts.length - 1];
        data = mockDb.getMockUserReviews(userId);
      } else if (url.includes('/reviews') && method === 'post') {
        data = mockDb.createMockReview(JSON.parse(config.data || '{}'));
      } else if (url.includes('/settings/language')) {
        data = mockDb.updateMockLanguage(JSON.parse(config.data || '{}').language);
      } else if (url.includes('/settings/theme')) {
        data = mockDb.updateMockTheme(JSON.parse(config.data || '{}').theme);
      } else if (url.includes('/settings')) {
        data = mockDb.getMockSettings();
      } else {
        data = {};
      }
    } catch (e: any) {
      return Promise.reject({
        response: {
          status: 400,
          data: { detail: e.message || 'Xatolik yuz berdi' }
        }
      });
    }

    return Promise.resolve<AxiosResponse>({
      data,
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config: config as any,
    });
  }

  if (defaultAdapter && typeof defaultAdapter === 'function') {
    return (defaultAdapter as any)(config);
  }
  const fallbackAdapter = axios.defaults.adapter as any;
  if (fallbackAdapter && typeof fallbackAdapter === 'function') {
    return fallbackAdapter(config);
  }
  return Promise.reject(new Error('No axios adapter found'));
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to attach bearer token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for refresh-on-401 (single-flight)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Check if error is 401 and target is not login or refresh itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken || refreshToken === 'mock-demo-refresh-bypass') {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post('/api/v1/auth/refresh', {
          refresh_token: refreshToken,
        });

        const newAccessToken = data.access_token;
        const newRefreshToken = data.refresh_token;
        const onboardingDone = data.onboarding_done;

        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken, onboardingDone);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
export default api;
