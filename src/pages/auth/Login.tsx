import { Card, Typography, Row, Col } from 'antd';
import LoginForm from '@/components/auth/LoginForm';

const { Title } = Typography;

const LoginPage = () => {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2}>Đăng nhập</Title>
            <p>Đăng nhập vào hệ thống quản trị</p>
          </div>
          <LoginForm />
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;