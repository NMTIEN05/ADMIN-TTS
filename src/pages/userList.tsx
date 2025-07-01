import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Tag, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { authService } from '../services/auth/auth.service';
import type { User, UserInput } from '../types/user.type';

const UserList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  });

  // Xử lý lỗi
  React.useEffect(() => {
    if (error) {
      console.error('Error fetching users:', error);
      message.error('Không thể tải danh sách người dùng!');
    }
  }, [error]);

  // Debug log
  console.log('Raw users response:', users);
  
  // Xử lý response có thể có cấu trúc khác
  let userList = [];
  if (Array.isArray(users)) {
    userList = users;
  } else if (users && users.data && Array.isArray(users.data)) {
    userList = users.data;
  } else if (users && users.users && Array.isArray(users.users)) {
    userList = users.users;
  }
  
  console.log('Final userList:', userList, 'Length:', userList.length);

  const createMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      form.resetFields();
      message.success('Tạo người dùng thành công!');
    },
    onError: () => {
      message.error('Tạo người dùng thất bại!');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserInput> }) => 
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      message.success('Cập nhật người dùng thành công!');
    },
    onError: () => {
      message.error('Cập nhật người dùng thất bại!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Xóa người dùng thành công!');
    },
    onError: () => {
      message.error('Xóa người dùng thất bại!');
    }
  });

  const handleSubmit = (values: any) => {
    if (editingUser) {
      const { password, ...updateData } = values;
      updateMutation.mutate({ id: editingUser._id, data: updateData });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || 'N/A',
    },
    {
      title: 'Vai trò',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin: boolean) => (
        <Tag color={isAdmin ? 'red' : 'blue'}>
          {isAdmin ? 'ADMIN' : 'USER'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Quản lý người dùng ({userList.length} người dùng)</h1>
      </div>

      <Table 
        columns={columns} 
        dataSource={userList} 
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="fullname"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" disabled={!!editingUser} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          <Form.Item
            name="phone"
            label="Số điện thoại"
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="isAdmin"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Select.Option value={false}>User</Select.Option>
              <Select.Option value={true}>Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {editingUser ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => {
                setIsModalOpen(false);
                setEditingUser(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;