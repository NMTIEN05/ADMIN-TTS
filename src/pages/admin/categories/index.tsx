import { useEffect, useState } from "react";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category.service";
import type { Category, CategoryInput } from "@/types/category.type";
import {
  Table,
  Button,
  Modal,
  Form,
  Space,
  Popconfirm,
  message,
  Input,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();

  // 🟢 Fetch danh mục từ backend
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      console.log("📦 Danh sách danh mục:", data);
      setCategories(data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh mục:", err);
      message.error("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🟢 Thêm hoặc sửa danh mục
  const handleSubmit = async () => {
    try {
      const values: CategoryInput = await form.validateFields();
      console.log("📤 Gửi đến backend:", values);

      if (editing) {
        await updateCategory(editing.id.toString(), values);
        message.success("✅ Cập nhật thành công");
      } else {
        await addCategory(values);
        message.success("✅ Thêm danh mục thành công");
      }

      setModalOpen(false);
      form.resetFields();
      fetchCategories();
    } catch (err: any) {
      console.error("❌ Lỗi gửi:", err);
      // Hiển thị lỗi backend trả về nếu có
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) {
        message.error(msg.join("\n"));
      } else if (msg) {
        message.error(msg);
      } else {
        message.error("Lỗi xử lý biểu mẫu");
      }
    }
  };

  // 🗑️ Xoá danh mục
  const handleDelete = async (id: string | number) => {
    try {
      await deleteCategory(id.toString());
      message.success("🗑️ Đã xoá danh mục");
      fetchCategories();
    } catch (err) {
      console.error("❌ Lỗi xoá danh mục:", err);
      message.error("Không thể xoá danh mục");
    }
  };

  return (
    <div>
      <h2>📁 Quản lý Danh mục</h2>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditing(null);
          form.resetFields();
          setModalOpen(true);
        }}
        style={{ marginBottom: 16 }}
      >
        ➕ Thêm danh mục
      </Button>

      <Table
        rowKey={(record) => record.id?.toString?.() || ""}
        dataSource={categories}
        loading={loading}
        columns={[
          { title: "ID", dataIndex: "id", width: 80 },
          { title: "Tên danh mục", dataIndex: "name" },
          { title: "Mô tả", dataIndex: "description" },
          {
            title: "Hành động",
            render: (_, record) => (
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditing(record);
                    form.setFieldsValue({
                      name: record.name,
                      description: record.description,
                    });
                    setModalOpen(true);
                  }}
                />
                <Popconfirm
                  title="Xác nhận xoá?"
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editing ? "✏️ Sửa danh mục" : "➕ Thêm danh mục"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText={editing ? "Cập nhật" : "Thêm"}
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục" },
              { min: 3, message: "Tên phải ít nhất 3 ký tự" },
            ]}
          >
            <Input placeholder="VD: Sách, Truyện, Tạp chí..." />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả" },
              { min: 10, message: "Mô tả phải ít nhất 10 ký tự" },
            ]}
          >
            <Input.TextArea rows={3} placeholder="VD: Danh mục cho sách học sinh..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage; 