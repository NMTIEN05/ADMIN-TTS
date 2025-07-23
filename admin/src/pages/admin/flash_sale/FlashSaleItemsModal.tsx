/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Modal,
  Table,
  Button,
  Form,
  Select,
  InputNumber,
  Space,
  Popconfirm,
  message
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { flashSaleItemService } from "../../../services/flash_sale.service";
import { bookService } from "../../../services/book.service";

interface FlashSaleItemsModalProps {
  open: boolean;
  flashSaleId: string;
  onCancel: () => void;
}

const FlashSaleItemsModal: React.FC<FlashSaleItemsModalProps> = ({
  open,
  flashSaleId,
  onCancel
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["flash-sale-items", flashSaleId],
    queryFn: () => flashSaleItemService.getAll({ flashSaleId }),
    enabled: !!flashSaleId
  });

  const { data: booksData } = useQuery({
    queryKey: ["books"],
    queryFn: bookService.getAll
  });

  const books = booksData?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: flashSaleItemService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sale-items", flashSaleId] });
      setIsAddModalOpen(false);
      form.resetFields();
      message.success("Thêm sản phẩm thành công!");
    },
    onError: () => message.error("Thêm sản phẩm thất bại!")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      flashSaleItemService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sale-items", flashSaleId] });
      setIsAddModalOpen(false);
      setEditingItem(null);
      form.resetFields();
      message.success("Cập nhật sản phẩm thành công!");
    },
    onError: () => message.error("Cập nhật sản phẩm thất bại!")
  });

  const deleteMutation = useMutation({
    mutationFn: flashSaleItemService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sale-items", flashSaleId] });
      message.success("Xóa sản phẩm thành công!");
    },
    onError: () => message.error("Xóa sản phẩm thất bại!")
  });

  const handleSubmit = (values: any) => {
    const data = { ...values, flashSaleId };
    if (editingItem) {
      updateMutation.mutate({ id: editingItem._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue({
      productId: item.productId._id,
      discountPercent: item.discountPercent
    });
    setIsAddModalOpen(true);
  };

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <img
            src={record.productId?.cover_image}
            alt={record.productId?.title}
            className="w-12 h-12 object-cover rounded"
          />
          <span>{record.productId?.title}</span>
        </div>
      )
    },
    {
      title: "Giá gốc",
      key: "originalPrice",
      render: (_: any, record: any) => (
        <span>{record.productId?.price?.toLocaleString('vi-VN')}₫</span>
      )
    },
    {
      title: "Giảm giá (%)",
      dataIndex: "discountPercent",
      render: (percent: number) => <span className="text-red-500 font-bold">{percent}%</span>
    },
    {
      title: "Giá sau giảm",
      key: "salePrice",
      render: (_: any, record: any) => {
        const salePrice = record.productId?.price * (1 - record.discountPercent / 100);
        return <span className="text-green-600 font-bold">{salePrice?.toLocaleString('vi-VN')}₫</span>;
      }
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xoá?"
            onConfirm={() => deleteMutation.mutate(record._id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Modal
        title="Quản lý sản phẩm Flash Sale"
        open={open}
        onCancel={onCancel}
        footer={null}
        width={1000}
      >
        <div className="mb-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingItem(null);
              form.resetFields();
              setIsAddModalOpen(true);
            }}
          >
            Thêm sản phẩm
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={items || []}
          rowKey="_id"
          loading={isLoading}
          scroll={{ x: 800 }}
        />
      </Modal>

      <Modal
        title={editingItem ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="productId"
            label="Sản phẩm"
            rules={[{ required: true, message: "Chọn sản phẩm" }]}
          >
            <Select
              placeholder="Chọn sản phẩm"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={Array.isArray(books) ? books.map((book: any) => ({
                value: book._id,
                label: book.title
              })) : []}
            />
          </Form.Item>
          <Form.Item
            name="discountPercent"
            label="Phần trăm giảm giá"
            rules={[{ required: true, message: "Nhập phần trăm giảm giá" }]}
          >
            <InputNumber
              min={1}
              max={99}
              formatter={(value) => `${value}%`}
              parser={(value) => value!.replace('%', '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                  form.resetFields();
                }}
              >
                Huỷ
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FlashSaleItemsModal;
