import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Select, InputNumber, Switch, DatePicker, Image, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '../../../services/book.service';
import { categoryService } from '../../../services/category.service';
import { authorService } from '../../../services/author.service';
import { productVariantService, type ProductVariant, type ProductVariantInput } from '../../../services/productVariant.service';
import type { BookWithDetails, BookInput } from '../../../types/book.type';
import ImageUpload from '../../../components/common/ImageUpload';
import dayjs from 'dayjs';

const ProductPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookWithDetails | null>(null);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookWithDetails | null>(null);
  const [detailBook, setDetailBook] = useState<BookWithDetails | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('paperback');
  const [form] = Form.useForm();
  const [variantForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('active');
  const queryClient = useQueryClient();

  const { data: books, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: bookService.getAll
  });

  const { data: deletedBooks, isLoading: isLoadingDeleted } = useQuery({
    queryKey: ['deleted-books'],
    queryFn: bookService.getDeleted,
    enabled: activeTab === 'deleted',
    refetchOnWindowFocus: false
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll
  });

  const { data: authors } = useQuery({
    queryKey: ['authors'],
    queryFn: authorService.getAll
  });

  // Xử lý response
  const bookList = Array.isArray(books?.data?.data) ? books.data.data : Array.isArray(books?.data) ? books.data : [];
  const categoryList = Array.isArray(categories?.data?.data) ? categories.data.data : Array.isArray(categories?.data) ? categories.data : [];
  const authorList = Array.isArray(authors?.data?.data) ? authors.data.data : Array.isArray(authors?.data) ? authors.data : [];

  // Query cho variants
  const { data: variants, refetch: refetchVariants } = useQuery({
    queryKey: ['variants', selectedBook?._id],
    queryFn: () => selectedBook ? productVariantService.getByBookId(selectedBook._id) : Promise.resolve([]),
    enabled: !!selectedBook
  });

  const variantList = variants?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: bookService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsModalOpen(false);
      form.resetFields();
      message.success('Tạo sách thành công!');
    },
    onError: () => {
      message.error('Tạo sách thất bại!');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BookInput }) => 
      bookService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsModalOpen(false);
      setEditingBook(null);
      form.resetFields();
      message.success('Cập nhật sách thành công!');
    },
    onError: () => {
      message.error('Cập nhật sách thất bại!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: bookService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['deleted-books'] });
      message.success('Xóa sách thành công!');
    },
    onError: () => {
      message.error('Xóa sách thất bại!');
    }
  });

  const restoreMutation = useMutation({
    mutationFn: bookService.restore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['deleted-books'] });
      message.success('Khôi phục sách thành công!');
    },
    onError: () => {
      message.error('Khôi phục sách thất bại!');
    }
  });

  const forceDeleteMutation = useMutation({
    mutationFn: bookService.forceDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deleted-books'] });
      message.success('Xóa vĩnh viễn sách thành công!');
    },
    onError: () => {
      message.error('Xóa vĩnh viễn sách thất bại!');
    }
  });

  const createVariantMutation = useMutation({
    mutationFn: (data: ProductVariantInput) => 
      selectedBook ? productVariantService.create(selectedBook._id, data) : Promise.reject('No book selected'),
    onSuccess: () => {
      refetchVariants();
      setIsAddVariantModalOpen(false);
      setEditingVariant(null);
      variantForm.resetFields();
      message.success('Thêm biến thể thành công!');
    },
    onError: () => {
      message.error('Thêm biến thể thất bại!');
    }
  });

  const updateVariantMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductVariantInput }) => 
      productVariantService.update(id, data),
    onSuccess: () => {
      refetchVariants();
      setIsAddVariantModalOpen(false);
      setEditingVariant(null);
      variantForm.resetFields();
      message.success('Cập nhật biến thể thành công!');
    },
    onError: () => {
      message.error('Cập nhật biến thể thất bại!');
    }
  });

  const deleteVariantMutation = useMutation({
    mutationFn: productVariantService.delete,
    onSuccess: () => {
      refetchVariants();
      message.success('Xóa biến thể thành công!');
    },
    onError: () => {
      message.error('Xóa biến thể thất bại!');
    }
  });

  // Handlers
  const handleSubmit = (values: any) => {
    const data: BookInput = {
      ...values,
      category_id: String(values.category_id),
      author_id: String(values.author_id),
      price: Number(values.price),
      stock_quantity: String(values.stock_quantity),
      publish_year: values.publish_year ? values.publish_year.format('YYYY') : new Date().getFullYear().toString(),
      is_available: values.is_available ?? true
    };
    
    if (editingBook) {
      updateMutation.mutate({ id: editingBook._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSubmitVariant = (values: any) => {
    const data: ProductVariantInput = {
      ...values,
      price: Number(values.price),
      stock_quantity: Number(values.stock_quantity)
    };
    
    if (editingVariant) {
      updateVariantMutation.mutate({ id: editingVariant._id, data });
    } else {
      createVariantMutation.mutate(data);
    }
  };

  const handleEdit = (book: BookWithDetails) => {
    setEditingBook(book);
    form.setFieldsValue({
      ...book,
      category_id: book.category_id?._id || book.category_id,
      author_id: book.author_id?._id || book.author_id,
      publish_year: book.publish_year ? dayjs(book.publish_year) : dayjs()
    });
    setIsModalOpen(true);
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setSelectedFormat(variant.format);
    variantForm.setFieldsValue(variant);
    setIsAddVariantModalOpen(true);
  };

  const handleViewVariants = (book: BookWithDetails) => {
    setSelectedBook(book);
    setIsVariantModalOpen(true);
  };

  const handleViewDetail = (book: BookWithDetails) => {
    setDetailBook(book);
    setIsDetailModalOpen(true);
  };

  const handleRestore = (id: string) => {
    restoreMutation.mutate(id);
  };

  const columns = [
    {
      title: 'Ảnh bìa',
      dataIndex: 'cover_image',
      key: 'cover_image',
      width: 80,
      render: (cover_image: string, record: BookWithDetails) => (
        <Image
          width={50}
          height={70}
          src={cover_image}
          alt={record.title}
          style={{ objectFit: 'cover' }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
        />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (title: string, record: BookWithDetails) => (
        <Button 
          type="link" 
          onClick={() => handleViewVariants(record)}
          style={{ padding: 0, textAlign: 'left' }}
        >
          {title}
        </Button>
      ),
    },
    {
      title: 'Danh mục',
      key: 'category',
      render: (_: any, record: BookWithDetails) => record.category_id?.name || 'N/A',
    },
    {
      title: 'Tác giả',
      key: 'author',
      render: (_: any, record: BookWithDetails) => record.author_id?.name || 'N/A',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_available',
      key: 'is_available',
      render: (available: boolean) => (
        <span style={{ color: available ? 'green' : 'red' }}>
          {available ? 'Có sẵn' : 'Hết hàng'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: BookWithDetails) => (
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
            title="Bạn có chắc chắn muốn xóa sách này?"
            description="Sách sẽ bị xóa mềm và có thể khôi phục sau."
            onConfirm={() => deleteMutation.mutate(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa mềm
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Quản lý sản phẩm</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingBook(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Thêm sách
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'active',
            label: 'Sản phẩm hoạt động',
            children: (
              <Table 
                columns={columns} 
                dataSource={bookList} 
                rowKey="_id"
                loading={isLoading}
                scroll={{ x: 1000 }}
              />
            )
          },
          {
            key: 'deleted',
            label: 'Sản phẩm đã xóa',
            children: (
              <Table
                columns={[
                  ...columns.slice(0, -1),
                  {
                    title: "Ngày xóa",
                    dataIndex: "deleted_at",
                    key: "deleted_at",
                    render: (date: string) => date ? new Date(date).toLocaleDateString("vi-VN") : '-',
                  },
                  {
                    title: "Thao tác",
                    key: "actions",
                    render: (_: any, record: BookWithDetails) => (
                      <Space>
                        <Button
                          type="primary"
                          onClick={() => restoreMutation.mutate(record._id)}
                        >
                          Khôi phục
                        </Button>
                        <Popconfirm
                          title="Bạn có chắc chắn muốn xóa vĩnh viễn sách này?"
                          description="Sách sẽ bị xóa hoàn toàn và không thể khôi phục."
                          onConfirm={() => forceDeleteMutation.mutate(record._id)}
                          okText="Có"
                          cancelText="Không"
                        >
                          <Button type="primary" danger>
                            Xóa hẳn
                          </Button>
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
                dataSource={Array.isArray(deletedBooks?.data?.data) ? deletedBooks.data.data : Array.isArray(deletedBooks?.data) ? deletedBooks.data : []}
                rowKey="_id"
                loading={isLoadingDeleted}
                scroll={{ x: 1000 }}
              />
            )
          }
        ]}
      />

      {/* Modal thêm/sửa sách */}
      <Modal
        title={editingBook ? 'Sửa sách' : 'Thêm sách'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingBook(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
            <Input placeholder="Nhập tiêu đề sách" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="category_id" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]} style={{ flex: 1 }}>
              <Select placeholder="Chọn danh mục">
                {categoryList.map(cat => (
                  <Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="author_id" label="Tác giả" rules={[{ required: true, message: 'Vui lòng chọn tác giả!' }]} style={{ flex: 1 }}>
              <Select placeholder="Chọn tác giả">
                {authorList.map(author => (
                  <Select.Option key={author._id} value={author._id}>{author.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="publisher" label="Nhà xuất bản" rules={[{ required: true, message: 'Vui lòng nhập nhà xuất bản!' }]} style={{ flex: 1 }}>
              <Input placeholder="Nhập nhà xuất bản" />
            </Form.Item>

            <Form.Item name="publish_year" label="Năm xuất bản" rules={[{ required: true, message: 'Vui lòng chọn năm xuất bản!' }]} style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} placeholder="Chọn năm xuất bản" picker="year" />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
            <Input.TextArea rows={4} placeholder="Nhập mô tả sách" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]} style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} placeholder="Nhập giá" min={0} />
            </Form.Item>

            <Form.Item name="stock_quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]} style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng" min={0} />
            </Form.Item>
          </div>

          <Form.Item name="cover_image" label="Ảnh bìa">
            <ImageUpload type="books" />
          </Form.Item>

          <Form.Item name="is_available" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Có sẵn" unCheckedChildren="Hết hàng" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {editingBook ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => {
                setIsModalOpen(false);
                setEditingBook(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal quản lý biến thể */}
      <Modal
        title={`Biến thể của: ${selectedBook?.title}`}
        open={isVariantModalOpen}
        onCancel={() => {
          setIsVariantModalOpen(false);
          setSelectedBook(null);
        }}
        footer={null}
        width={800}
      >
        <div>
          <Button 
            type="primary" 
            style={{ marginBottom: 16 }}
            onClick={() => {
              setEditingVariant(null);
              variantForm.resetFields();
              setIsAddVariantModalOpen(true);
            }}
          >
            Thêm biến thể
          </Button>
          
          <Table
            dataSource={variantList}
            rowKey="_id"
            pagination={false}
            columns={[
              {
                title: 'Format',
                dataIndex: 'format',
                render: (format: string) => {
                  const formatMap = {
                    hardcover: 'Bìa cứng',
                    paperback: 'Bìa mềm',
                    pdf: 'PDF'
                  };
                  return formatMap[format as keyof typeof formatMap] || format;
                }
              },
              {
                title: 'Giá',
                dataIndex: 'price',
                render: (price: number) => `${price.toLocaleString()} VNĐ`
              },
              {
                title: 'Số lượng',
                dataIndex: 'stock_quantity'
              },
              {
                title: 'Thông tin',
                render: (_: any, record: ProductVariant) => {
                  if (record.format === 'pdf') {
                    return `${record.file_size}MB - ${record.file_format}`;
                  }
                  return `${record.pages} trang - ${record.weight}g`;
                }
              },
              {
                title: 'Thao tác',
                render: (_: any, record: ProductVariant) => (
                  <Space>
                    <Button size="small" onClick={() => handleEditVariant(record)}>
                      Sửa
                    </Button>
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa biến thể này?"
                      onConfirm={() => deleteVariantMutation.mutate(record._id)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button type="primary" danger size="small">
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Space>
                )
              }
            ]}
          />
        </div>
      </Modal>

      {/* Modal thêm/sửa biến thể */}
      <Modal
        title={editingVariant ? "Sửa biến thể" : "Thêm biến thể"}
        open={isAddVariantModalOpen}
        onCancel={() => {
          setIsAddVariantModalOpen(false);
          setEditingVariant(null);
          variantForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={variantForm} layout="vertical" onFinish={handleSubmitVariant}>
          <Form.Item name="format" label="Format" rules={[{ required: true, message: 'Vui lòng chọn format!' }]}>
            <Select placeholder="Chọn format" onChange={(value) => setSelectedFormat(value)}>
              <Select.Option value="hardcover">Bìa cứng</Select.Option>
              <Select.Option value="paperback">Bìa mềm</Select.Option>
              <Select.Option value="pdf">PDF</Select.Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]} style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} placeholder="Nhập giá" min={0} />
            </Form.Item>

            <Form.Item name="stock_quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]} style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng" min={0} />
            </Form.Item>
          </div>

          {/* Thông tin riêng cho format vật lý */}
          {(selectedFormat === 'hardcover' || selectedFormat === 'paperback') && (
            <>
              <div style={{ display: 'flex', gap: 16 }}>
                <Form.Item name="pages" label="Số trang" rules={[{ required: true, message: 'Vui lòng nhập số trang!' }]} style={{ flex: 1 }}>
                  <InputNumber style={{ width: '100%' }} placeholder="Nhập số trang" min={1} />
                </Form.Item>

                <Form.Item name="weight" label="Trọng lượng (gram)" rules={[{ required: true, message: 'Vui lòng nhập trọng lượng!' }]} style={{ flex: 1 }}>
                  <InputNumber style={{ width: '100%' }} placeholder="Nhập trọng lượng" min={0} />
                </Form.Item>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>Kích thước (cm)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Form.Item name={['dimensions', 'length']} rules={[{ required: true, message: 'Chiều dài!' }]} style={{ flex: 1, marginBottom: 0 }}>
                    <InputNumber placeholder="Dài" min={0} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name={['dimensions', 'width']} rules={[{ required: true, message: 'Chiều rộng!' }]} style={{ flex: 1, marginBottom: 0 }}>
                    <InputNumber placeholder="Rộng" min={0} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name={['dimensions', 'height']} rules={[{ required: true, message: 'Chiều cao!' }]} style={{ flex: 1, marginBottom: 0 }}>
                    <InputNumber placeholder="Cao" min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </div>
              </div>
            </>
          )}

          {/* Thông tin riêng cho PDF */}
          {selectedFormat === 'pdf' && (
            <div style={{ display: 'flex', gap: 16 }}>
              <Form.Item name="file_size" label="Kích thước file (MB)" rules={[{ required: true, message: 'Vui lòng nhập kích thước file!' }]} style={{ flex: 1 }}>
                <InputNumber style={{ width: '100%' }} placeholder="Nhập kích thước file" min={0} step={0.1} />
              </Form.Item>

              <Form.Item name="file_format" label="Định dạng file" rules={[{ required: true, message: 'Vui lòng chọn định dạng file!' }]} style={{ flex: 1 }}>
                <Select placeholder="Chọn định dạng">
                  <Select.Option value="PDF">PDF</Select.Option>
                  <Select.Option value="EPUB">EPUB</Select.Option>
                  <Select.Option value="MOBI">MOBI</Select.Option>
                </Select>
              </Form.Item>
            </div>
          )}

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={createVariantMutation.isPending || updateVariantMutation.isPending}
              >
                {editingVariant ? 'Cập nhật' : 'Thêm biến thể'}
              </Button>
              <Button onClick={() => {
                setIsAddVariantModalOpen(false);
                setEditingVariant(null);
                variantForm.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chi tiết sản phẩm */}
      <Modal
        title="Chi tiết sản phẩm"
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setDetailBook(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsDetailModalOpen(false);
            setDetailBook(null);
          }}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {detailBook && (
          <div>
            <p><strong>Tiêu đề:</strong> {detailBook.title}</p>
            <p><strong>Danh mục:</strong> {detailBook.category_id?.name || 'N/A'}</p>
            <p><strong>Tác giả:</strong> {detailBook.author_id?.name || 'N/A'}</p>
            <p><strong>Nhà xuất bản:</strong> {detailBook.publisher}</p>
            <p><strong>Năm xuất bản:</strong> {detailBook.publish_year}</p>
            <p><strong>Mô tả:</strong> {detailBook.description}</p>
            <p><strong>Giá:</strong> {detailBook.price?.toLocaleString()} VNĐ</p>
            <p><strong>Số lượng:</strong> {detailBook.stock_quantity}</p>
            <p><strong>Trạng thái:</strong> {detailBook.is_available ? 'Có sẵn' : 'Hết hàng'}</p>
            {detailBook.cover_image && (
              <div>
                <strong>Ảnh bìa:</strong>
                <br />
                <img src={detailBook.cover_image} alt={detailBook.title} style={{ maxWidth: '200px', marginTop: 8 }} />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductPage;