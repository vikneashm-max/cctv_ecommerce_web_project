import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`,
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
    // If token is invalid or expired (401), clean up stale session
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('isAdminLoggedIn');
    }

    const config = error.config;
    if (!config || config._retry) {
      return Promise.reject(error);
    }

    // Do NOT retry for auth endpoints to prevent duplicate delays or masked errors
    if (config.url && config.url.includes('/auth/')) {
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

