import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { API_BASE_URL, AUTH_BASE_URL } from "../constants";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  isAuthApi?: boolean;
}

// API instance for general API calls
export const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth instance for authentication API calls
export const authInstance = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for API instance
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for Auth instance
authInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('Auth Error:', error);
    return Promise.reject(error);
  }
);

// Request interceptor for API instance
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Request interceptor for Auth instance
authInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Default export for backward compatibility
const axiosInstance = apiInstance;
export default axiosInstance;
