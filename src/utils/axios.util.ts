import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  isAuthApi?: boolean;
}

// Hàm lấy token từ localStorage
const getToken = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      return parsed.token;
    }
    return null;
  } catch (error) {
    console.error('Lỗi khi lấy token:', error);
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:8888",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Xử lý lỗi 401 Unauthorized
    if (error.response?.status === 401) {
      // Có thể chuyển hướng đến trang đăng nhập
      console.error('Phiên đăng nhập hết hạn');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.set(
        "Authorization",
        `Bearer ${token}`
      );
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };