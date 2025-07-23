import { useEffect } from 'react'
import { useCountStore } from './stores/common.store';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import ErrorBoundary from './components/common/ErrorBoundary';
import AuthHandler from './components/common/AuthHandler';
import './App.css'
import './styles/admin.css'
import axios from 'axios';

function App() {
  const { count: countFromStore } = useCountStore();


  useEffect(() => {
    axios
      .get("http://localhost:8888/api/ping")  // Kiểm tra URL có chính xác không
      .then(response => {
        console.log(response.data.message);  // In ra thông báo từ backend
      })
      .catch(error => {
        console.error("Lỗi khi gọi API:", error);  // Hiển thị lỗi khi gọi API
      });
  }, []);

  return (
    <ErrorBoundary>
      <AuthHandler />
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
