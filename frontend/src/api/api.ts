import axios from "axios";

const getBaseUrl = () => {
  const raw = (import.meta.env.VITE_API_URL || 'http://localhost:8080').trim().replace(/\/+$/, '');
  return raw.endsWith('/api') ? raw : `${raw}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Automatically inject JWT token into all requests EXCEPT auth endpoints
api.interceptors.request.use((config) => {
  // Do not attach token to authentication endpoints
  if (config.url && config.url.includes('/auth/')) {
    if (config.headers) {
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Authorization');
        config.headers.delete('authorization');
      } else {
        delete config.headers['Authorization'];
        delete config.headers['authorization'];
      }
    }
    return config;
  }

  const savedUser = sessionStorage.getItem('currentUser');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user && user.token) {
        if (typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `Bearer ${user.token}`);
        } else {
          config.headers['Authorization'] = `Bearer ${user.token}`;
        }
      }
    } catch {
      // Ignore parse error
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Auto-retry once for Render cold-start network timeouts or gateway errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isAuthEndpoint = error.config?.url && error.config.url.includes('/auth/');
    
    // If token is invalid or expired (401) on non-auth requests, clean up stale session
    if (!isAuthEndpoint && error.response && error.response.status === 401) {
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('isAdminLoggedIn');
    }

    const config = error.config;
    if (!config || config._retry) {
      return Promise.reject(error);
    }

    // Do NOT retry for client-side errors (400-499) to present instant feedback
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return Promise.reject(error);
    }

    // Retry on network errors or 502/503/504 gateway errors during Render cold starts
    if (!error.response || [502, 503, 504].includes(error.response?.status)) {
      config._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 2500));
      return api(config);
    }
    return Promise.reject(error);
  }
);

// Background silent ping to wake up cloud server (Render free tier cold start mitigation)
export const prewarmServer = async () => {
  try {
    await api.get('/auth/ping', { timeout: 30000 });
  } catch {
    // Silent fail; main requests will handle errors if any
  }
};

export default api;

