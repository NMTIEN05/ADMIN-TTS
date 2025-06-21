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
  Select,
  InputNumber,
  Switch,
  DatePicker,
  Tag,
  Tabs,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponService } from "../../../services/coupon.service";
import type { Coupon, CouponInput } from "../../../types/coupon.type";
import dayjs from "dayjs";

const CouponPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('active');

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: couponService.getAll,
  });

  const { data: deletedCoupons, isLoading: isLoadingDeleted } = useQuery({
    queryKey: ["deleted-coupons"],
    queryFn: couponService.getDeleted,
  });

  // Debug log
  console.log("Raw coupons response:", coupons);

  let couponList = [];
  if (Array.isArray(coupons)) {
    couponList = coupons;
  } else if (coupons && coupons.data && Array.isArray(coupons.data)) {
    couponList = coupons.data;
  } else if (coupons && coupons.coupons && Array.isArray(coupons.coupons)) {
    couponList = coupons.coupons;
  }

  console.log("Final couponList:", couponList.length);

  const createMutation = useMutation({
    mutationFn: couponService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setIsModalOpen(false);
      form.resetFields();
      message.success("Tạo mã giảm giá thành công!");
    },
    onError: () => {
      message.error("Tạo mã giảm giá thất bại!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CouponInput }) =>
      couponService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setIsModalOpen(false);
      setEditingCoupon(null);
      form.resetFields();
      message.success("Cập nhật mã giảm giá thành công!");
    },
    onError: () => {
      message.error("Cập nhật mã giảm giá thất bại!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: couponService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-coupons"] });
      message.success("Xóa mã giảm giá thành công!");
    },
    onError: () => {
      message.error("Xóa mã giảm giá thất bại!");
    },
  });

  const restoreMutation = useMutation({
    mutationFn: couponService.restore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-coupons"] });
      message.success("Khôi phục mã giảm giá thành công!");
    },
    onError: () => {
      message.error("Khôi phục mã giảm giá thất bại!");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: couponService.toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      message.success("Cập nhật trạng thái thành công!");
    },
    onError: () => {
      message.error("Cập nhật trạng thái thất bại!");
    },
  });

  const handleSubmit = (values: any) => {
    const data: CouponInput = {
      ...values,
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
      is_active: values.is_active ?? true,
    };

    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    form.setFieldsValue({
      ...coupon,
      start_date: dayjs(coupon.start_date),
      end_date: dayjs(coupon.end_date),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleRestore = (id: string) => {
    restoreMutation.mutate(id);
  };

  const handleToggleStatus = (id: string) => {
    toggleMutation.mutate(id);
  };

  const columns = [
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Giảm giá",
      dataIndex: "discount_percent",
      key: "discount_percent",
      render: (value: number) => `${value}%`,
    },

    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render: (available: string) => (
        <span>
          {available ? (
            <Tag color="green">Kích hoạt</Tag>
          ) : (
            <Tag color="red">Tạm dừng</Tag>
          )}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: Coupon) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mã giảm giá này?"
            description="Mã giảm giá sẽ bị xóa mềm và có thể khôi phục sau."
            onConfirm={() => handleDelete(record._id)}
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
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Quản lý mã giảm giá</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCoupon(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Thêm mã giảm giá
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'active',
            label: 'Mã giảm giá hoạt động',
            children: (
              <Table
                columns={columns}
                dataSource={couponList}
                rowKey="_id"
                loading={isLoading}
                scroll={{ x: 1200 }}
              />
            )
          },
          {
            key: 'deleted',
            label: 'Mã giảm giá đã xóa',
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
                    render: (_: any, record: Coupon) => (
                      <Button
                        type="primary"
                        onClick={() => handleRestore(record._id)}
                      >
                        Khôi phục
                      </Button>
                    ),
                  },
                ]}
                dataSource={deletedCoupons || []}
                rowKey="_id"
                loading={isLoadingDeleted}
                scroll={{ x: 1200 }}
              />
            )
          }
        ]}
      />

      <Modal
        title={editingCoupon ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCoupon(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="code"
            label="Mã giảm giá"
            rules={[{ required: true, message: "Vui lòng nhập mã giảm giá!" }]}
          >
            <Input placeholder="Nhập mã giảm giá (VD: SALE20)" />
          </Form.Item>

          <Form.Item
            name="discount_percent"
            label="Phần trăm giảm giá (%)"
            rules={[
              { required: true, message: "Vui lòng nhập phần trăm giảm giá!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập phần trăm (1-100)"
              min={1}
              max={100}
              addonAfter="%"
            />
          </Form.Item>

          <Form.Item
            name="min_purchase"
            label="Giá trị đơn hàng tối thiểu (VNĐ)"
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập giá trị tối thiểu (để trống = 0)"
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item
              name="start_date"
              label="Ngày bắt đầu"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
              ]}
              style={{ flex: 1 }}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Chọn ngày bắt đầu"
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              name="end_date"
              label="Ngày kết thúc"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ]}
              style={{ flex: 1 }}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Chọn ngày kết thúc"
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </div>



          <Form.Item
            name="is_active"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch checkedChildren="Kích hoạt" unCheckedChildren="Tạm dừng" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingCoupon ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCoupon(null);
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

export default CouponPage;
