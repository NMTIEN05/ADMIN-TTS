import { useState } from 'react';
import { Form, Input, Button, Select, Switch, message } from 'antd';
import type { User } from '@/types/user.type';
import { createUser, updateUser } from '@/services/user.service';

interface UserFormProps {
  user?: User;
  onSuccess: () => void;
  onCancel: () => void;
}

const UserForm = ({ user, onSuccess, onCancel }: UserFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (user?._id) {
        await updateUser(user._id, values);
        message.success('Cập nhật người dùng thành công');
      } else {
        await createUser(values);
        message.success('Thêm người dùng thành công');
      }
      onSuccess();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={user || { is_active: true, role: 'user' }}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="username"
        label="Tên đăng nhập"
        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
      >
        <Input />
      </Form.Item>

      {!user && (
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: !user, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password />
        </Form.Item>
      )}

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Vui lòng nhập email' },
          { type: 'email', message: 'Email không hợp lệ' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="fullname" label="Họ tên">
        <Input />
      </Form.Item>

      <Form.Item name="phone" label="Số điện thoại">
        <Input />
      </Form.Item>

      <Form.Item name="address" label="Địa chỉ">
        <Input />
      </Form.Item>

      <Form.Item name="role" label="Vai trò">
        <Select>
          <Select.Option value="user">Người dùng</Select.Option>
          <Select.Option value="admin">Quản trị viên</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="is_active" label="Trạng thái" valuePropName="checked">
        <Switch checkedChildren="Kích hoạt" unCheckedChildren="Vô hiệu" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
          {user ? 'Cập nhật' : 'Thêm mới'}
        </Button>
        <Button onClick={onCancel}>Hủy</Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;