/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Space,
  Tag,
  Popconfirm,
  message
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { flashSaleService } from "../../../services/flash_sale.service";
import dayjs from "dayjs";
import FlashSaleItemsModal from "./FlashSaleItemsModal";

const FlashSalePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlashSale, setEditingFlashSale] = useState<any>(null);
  const [selectedFlashSaleId, setSelectedFlashSaleId] = useState<string | null>(null); // 👉 quản lý modal sản phẩm
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: flashSales, isLoading } = useQuery({
    queryKey: ["flash-sales"],
    queryFn: flashSaleService.getAll
  });

  const createMutation = useMutation({
    mutationFn: flashSaleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      setIsModalOpen(false);
      form.resetFields();
      message.success("Tạo flash sale thành công!");
    },
    onError: () => message.error("Tạo flash sale thất bại!")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      flashSaleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      setIsModalOpen(false);
      setEditingFlashSale(null);
      form.resetFields();
      message.success("Cập nhật flash sale thành công!");
    },
    onError: () => message.error("Cập nhật flash sale thất bại!")
  });

  const deleteMutation = useMutation({
    mutationFn: flashSaleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      message.success("Xóa flash sale thành công!");
    },
    onError: () => message.error("Xóa flash sale thất bại!")
  });

  const handleSubmit = (values: any) => {
    const data = {
      ...values,
      startDate: values.startDate.format("YYYY-MM-DD"),
      endDate: values.endDate.format("YYYY-MM-DD")
    };
    if (editingFlashSale) {
      updateMutation.mutate({ id: editingFlashSale._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (flashSale: any) => {
    setEditingFlashSale(flashSale);
    form.setFieldsValue({
      ...flashSale,
      startDate: dayjs(flashSale.startDate),
      endDate: dayjs(flashSale.endDate)
    });
    setIsModalOpen(true);
  };

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Bắt đầu",
      dataIndex: "startDate",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN")
    },
    {
      title: "Kết thúc",
      dataIndex: "endDate",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN")
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: any) => {
        const now = new Date();
        const start = new Date(record.startDate);
        const end = new Date(record.endDate);
        const active = now >= start && now <= end;
        return (
          <Tag color={active ? "green" : "red"}>
            {active ? "Đang diễn ra" : "Kết thúc"}
          </Tag>
        );
      }
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>

          <Button
            onClick={() => setSelectedFlashSaleId(record._id)}
          >
            Sản phẩm
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
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <h1>Quản lý Flash Sale</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingFlashSale(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Thêm flash sale
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={flashSales || []}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingFlashSale ? "Sửa Flash Sale" : "Thêm Flash Sale"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingFlashSale(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên Flash Sale"
            rules={[{ required: true, message: "Nhập tên flash sale" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingFlashSale ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingFlashSale(null);
                  form.resetFields();
                }}
              >
                Huỷ
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {selectedFlashSaleId && (
        <FlashSaleItemsModal
          open={!!selectedFlashSaleId}
          flashSaleId={selectedFlashSaleId}
          onCancel={() => setSelectedFlashSaleId(null)}
        />
      )}
    </div>
  );
};

export default FlashSalePage;
