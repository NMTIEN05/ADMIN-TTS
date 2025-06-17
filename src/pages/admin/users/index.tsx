import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Popconfirm, message, Tag, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUsers, deleteUser } from '@/services/user.service';
import type { User } from '@/types/user.type';
import UserForm from '@/components/admin/UserForm';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
      if (data.length === 0) {
        setError('Không có dữ liệu người dùng hoặc bạn không có quyền truy cập');
      }
    } catch (error) {
      message.error('Không thể tải danh sách người dùng');
      setUsers([]);
      setError('API quản lý người dùng có lỗi hoặc bạn không có quyền truy cập');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error) {
      message.error('Không thể xóa người dùng: API chưa được triển khai đầy đủ');
    }
  };

  const handleModalSuccess = () => {
    setModalVisible(false);
    fetchUsers();
  };

  const columns = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Đang hoạt động' : 'Vô hiệu'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedUser(record);
              setModalVisible(true);
            }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Người dùng</h2>
      
      {error && (
        <Alert
          message="Thông báo"
          description={error}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setSelectedUser(undefined);
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Thêm người dùng
      </Button>
      
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
      />
      
      <Modal
        title={selectedUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <UserForm
          user={selectedUser}
          onSuccess={handleModalSuccess}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default UsersPage;