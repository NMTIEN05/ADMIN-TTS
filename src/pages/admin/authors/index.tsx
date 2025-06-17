import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAuthors, deleteAuthor } from '@/services/author.service';
import type { Author } from '@/types/author.type';
import AuthorForm from '@/components/admin/AuthorForm';

const AuthorsPage = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | undefined>(undefined);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const data = await getAuthors();
      setAuthors(data);
    } catch (error) {
      message.error('Không thể tải danh sách tác giả');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteAuthor(id);
      message.success('Xóa tác giả thành công');
      fetchAuthors();
    } catch (error) {
      message.error('Không thể xóa tác giả');
    }
  };

  const handleModalSuccess = () => {
    setModalVisible(false);
    fetchAuthors();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 220,
    },
    {
      title: 'Tên tác giả',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quốc tịch',
      dataIndex: 'nationality',
      key: 'nationality',
      render: (text: string) => text || 'Chưa cập nhật',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birth_date',
      key: 'birth_date',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : 'Chưa cập nhật',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Author) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setSelectedAuthor(record);
              setModalVisible(true);
            }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tác giả này?"
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
      <h2>Quản lý Tác giả</h2>
      
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setSelectedAuthor(undefined);
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Thêm tác giả
      </Button>
      
      <Table
        columns={columns}
        dataSource={authors}
        rowKey="_id"
        loading={loading}
      />
      
      <Modal
        title={selectedAuthor ? "Chỉnh sửa tác giả" : "Thêm tác giả mới"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <AuthorForm
          author={selectedAuthor}
          onSuccess={handleModalSuccess}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default AuthorsPage;