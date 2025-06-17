import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '@/services/auth/auth.service';
import { useNavigate } from 'react-router-dom';
import type { LoginInput } from '@/types/auth.type';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginInput) => {
    setLoading(true);
    try {
      const response = await login(values);
      
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem('userInfo', JSON.stringify(response));
      
      message.success('Đăng nhập thành công!');
      
      // Chuyển hướng dựa vào quyền
      if (response.isAdmin) {
        navigate('/dashboard');
      } else {
        message.warning('Tài khoản của bạn không có quyền truy cập trang quản trị');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Email" />
      </Form.Item>
      
      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu!' },
          { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" loading={loading} block>
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;