import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Automatically inject JWT token into all requests if available
api.interceptors.request.use((config) => {
  const savedUser = sessionStorage.getItem('currentUser');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
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
    const config = error.config;
    if (!config || config._retry) {
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

