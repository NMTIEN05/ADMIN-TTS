import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, DatePicker, Avatar, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authorService } from '../../../services/author.service';
import type { Author, AuthorInput } from '../../../types/author.type';
import ImageUpload from '../../../components/common/ImageUpload';
import dayjs from 'dayjs';

const AuthorPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [detailAuthor, setDetailAuthor] = useState<Author | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  
  // State phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const { data: authors, isLoading } = useQuery({
    queryKey: ['authors', currentPage - 1, pageSize],
    queryFn: () => authorService.getAll(currentPage - 1, pageSize)
  });

  // Debug log
  console.log('Raw authors response:', authors);
  
  // Xử lý response và cập nhật tổng số item
  console.log('Authors response structure:', authors);
  console.log('Authors data path:', authors?.data);
  console.log('Authors data.data path:', authors?.data?.data);
  
  // Kiểm tra cấu trúc dữ liệu
  let authorList = [];
  if (authors?.data?.data) {
    console.log('Using authors.data.data');
    authorList = authors.data.data;
  } else if (authors?.data) {
    console.log('Using authors.data');
    authorList = authors.data;
  }
  
  React.useEffect(() => {
    if (authors?.data?.totalItems !== undefined) {
      setTotal(authors.data.totalItems);
    } else {
      // Fallback to list length if no totalItems
      setTotal(authorList.length);
    }
  }, [authors, authorList]);
  
  // Hàm xử lý thay đổi trang
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };
  
  console.log('Final authorList:', authorList.length);

  const createMutation = useMutation({
    mutationFn: authorService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      setIsModalOpen(false);
      form.resetFields();
      message.success('Tạo tác giả thành công!');
    },
    onError: () => {
      message.error('Tạo tác giả thất bại!');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AuthorInput }) => 
      authorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      setIsModalOpen(false);
      setEditingAuthor(null);
      form.resetFields();
      message.success('Cập nhật tác giả thành công!');
    },
    onError: () => {
      message.error('Cập nhật tác giả thất bại!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: authorService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      message.success('Xóa tác giả thành công!');
    },
    onError: () => {
      message.error('Xóa tác giả thất bại!');
    }
  });

  const handleSubmit = (values: any) => {
    const data: AuthorInput = {
      ...values,
      birth_date: values.birth_date.format('YYYY-MM-DD')
    };
    
    if (editingAuthor) {
      updateMutation.mutate({ id: editingAuthor._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    form.setFieldsValue({
      ...author,
      birth_date: dayjs(author.birth_date)
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleViewDetail = (author: Author) => {
    setDetailAuthor(author);
    setIsDetailModalOpen(true);
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string, record: Author) => (
        <Avatar 
          size={50} 
          src={avatar} 
          icon={<UserOutlined />}
          alt={record.name}
        />
      ),
    },
    {
      title: 'Tên tác giả',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tiểu sử',
      dataIndex: 'bio',
      key: 'bio',
      ellipsis: true,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birth_date',
      key: 'birth_date',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Quốc tịch',
      dataIndex: 'nationality',
      key: 'nationality',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Author) => (
        <Space>
          <Button onClick={() => handleViewDetail(record)}>
            Chi tiết
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tác giả này?"
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
        <h1>Quản lý tác giả</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingAuthor(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Thêm tác giả
        </Button>
      </div>

      <>
        <Table 
          columns={columns} 
          dataSource={authorList} 
          rowKey="_id"
          loading={isLoading}
          pagination={false}
        />
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            showSizeChanger
            showTotal={(total) => `Tổng cộng ${total} tác giả`}
          />
        </div>
      </>

      <Modal
        title={editingAuthor ? 'Sửa tác giả' : 'Thêm tác giả'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingAuthor(null);
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
            name="name"
            label="Tên tác giả"
            rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
          >
            <Input placeholder="Nhập tên tác giả" />
          </Form.Item>

          <Form.Item
            name="bio"
            label="Tiểu sử"
            rules={[{ required: true, message: 'Vui lòng nhập tiểu sử!' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập tiểu sử tác giả" />
          </Form.Item>

          <Form.Item
            name="birth_date"
            label="Ngày sinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="nationality"
            label="Quốc tịch"
            rules={[{ required: true, message: 'Vui lòng nhập quốc tịch!' }]}
          >
            <Input placeholder="Nhập quốc tịch" />
          </Form.Item>

          <Form.Item
            name="avatar"
            label="Avatar"
          >
            <ImageUpload type="authors" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {editingAuthor ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => {
                setIsModalOpen(false);
                setEditingAuthor(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chi tiết tác giả */}
      <Modal
        title="Chi tiết tác giả"
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setDetailAuthor(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsDetailModalOpen(false);
            setDetailAuthor(null);
          }}>
            Đóng
          </Button>
        ]}
        width={500}
      >
        {detailAuthor && (
          <div>
            {detailAuthor.avatar && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Avatar size={100} src={detailAuthor.avatar} icon={<UserOutlined />} />
              </div>
            )}
            <p><strong>Tên:</strong> {detailAuthor.name}</p>
            <p><strong>Quốc tịch:</strong> {detailAuthor.nationality || 'N/A'}</p>
            <p><strong>Ngày sinh:</strong> {detailAuthor.birth_date ? new Date(detailAuthor.birth_date).toLocaleDateString('vi-VN') : 'N/A'}</p>
            <p><strong>Tiểu sử:</strong> {detailAuthor.bio || 'N/A'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuthorPage;