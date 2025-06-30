import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Pagination,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../../../services/category.service";
import type { Category, CategoryInput } from "../../../types/category.type";

const CategoryPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  
  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(7); // Mặc định 7 item mỗi trang
  const [total, setTotal] = useState<number>(0);

  const { data: categoriesData, isLoading, error } = useQuery({
    queryKey: ["categories", currentPage - 1, pageSize],
    queryFn: () => categoryService.getAll(currentPage - 1, pageSize),
    staleTime: 0, // Không cache dữ liệu
    refetchOnWindowFocus: true // Tự động refresh khi focus lại cửa sổ
  });

  React.useEffect(() => {
    if (error) {
      console.error("Error fetching categories:", error);
      message.error("Không thể tải danh sách danh mục!");
    }
  }, [error]);

  // Xử lý dữ liệu phân trang
  console.log('Raw categories data:', categoriesData);
  
  // Lấy danh sách danh mục và thông tin phân trang
  const categoryList = categoriesData?.data || [];
  
  // Cập nhật tổng số item
  React.useEffect(() => {
    if (categoriesData?.totalItems !== undefined) {
      setTotal(categoriesData.totalItems);
    }
  }, [categoriesData]);
  
  console.log('Category list:', categoryList);
  console.log('Total items:', total);

  const createMutation = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      // Xóa cache và tải lại dữ liệu
      queryClient.invalidateQueries({ queryKey: ["categories", currentPage - 1, pageSize] });
      queryClient.refetchQueries({ queryKey: ["categories", currentPage - 1, pageSize] });
      
      setIsModalOpen(false);
      form.resetFields();
      message.success("Tạo danh mục thành công!");
      
      // Thêm timeout để đảm bảo dữ liệu được tải lại
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["categories", currentPage - 1, pageSize] });
      }, 500);
    },
    onError: (error) => {
      console.error('Error creating category:', error);
      message.error("Tạo danh mục thất bại!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryInput }) =>
      categoryService.update(id, data),
    onSuccess: () => {
      // Xóa cache và tải lại dữ liệu
      queryClient.invalidateQueries({ queryKey: ["categories", currentPage - 1, pageSize] });
      queryClient.refetchQueries({ queryKey: ["categories", currentPage - 1, pageSize] });
      
      setIsModalOpen(false);
      setEditingCategory(null);
      form.resetFields();
      message.success("Cập nhật danh mục thành công!");
      
      // Thêm timeout để đảm bảo dữ liệu được tải lại
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["categories", currentPage - 1, pageSize] });
      }, 500);
    },
    onError: (error) => {
      console.error('Error updating category:', error);
      message.error("Cập nhật danh mục thất bại!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => {
      // Xóa cache và tải lại dữ liệu
      queryClient.invalidateQueries({ queryKey: ["categories", currentPage - 1, pageSize] });
      queryClient.refetchQueries({ queryKey: ["categories", currentPage - 1, pageSize] });
      
      message.success("Xóa danh mục thành công!");
      
      // Thêm timeout để đảm bảo dữ liệu được tải lại
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["categories", currentPage - 1, pageSize] });
        
        // Nếu xóa item cuối cùng của trang, quay lại trang trước
        if (categoryList.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }, 500);
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      message.error("Xóa danh mục thất bại!");
    },
  });

  const handleSubmit = (values: CategoryInput) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };
  
  // Hàm xử lý thay đổi trang
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: Category) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
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
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Quản lý danh mục</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Thêm danh mục
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categoryList}
        rowKey="_id"
        loading={isLoading}
        pagination={false} // Tắt phân trang mặc định của Table
      />
      
      {/* Component phân trang riêng */}
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
          showSizeChanger
          showTotal={(total) => `Tổng cộng ${total} danh mục`}
        />  
      </div>

      <Modal
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả danh mục" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingCategory ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCategory(null);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
