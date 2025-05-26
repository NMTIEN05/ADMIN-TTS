import { useEffect, useState } from "react";
import type { Book, BookInput } from "@/types/book.type";
import { getBooks, addBook, updateBook, deleteBook } from "@/services/book.service";
import { getCategories } from "@/services/category.service";
import { getAuthors } from "@/services/author.service";
import {
  Button, Table, Modal, Form, Input, InputNumber,
  Select, Space, Popconfirm, message, DatePicker, Switch, Image
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Category } from "@/types/category.type";
import type { Author } from "@/types/author.type";

const ProductPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookData, catData, authorData] = await Promise.all([
        getBooks(), getCategories(), getAuthors(),
      ]);
      setBooks(bookData);
      setCategories(catData);
      setAuthors(authorData);
    } catch {
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload: BookInput = {
        ...values,
        price: Number(values.price),
        stock_quantity: Number(values.stock_quantity),
        publish_year: values.publish_year?.toISOString(),
        cover_image: values.cover_image,
      };

      if (editing) {
        await updateBook(editing._id, payload);
        message.success("✅ Đã cập nhật sản phẩm");
      } else {
        await addBook(payload);
        message.success("✅ Đã thêm sản phẩm");
      }

      setOpen(false);
      form.resetFields();
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi khi xử lý biểu mẫu");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteBook(id);
    message.success("🗑️ Đã xoá sản phẩm");
    fetchData();
  };

  return (
    <div>
      <h2>📚 Quản lý Sản phẩm</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditing(null);
          form.resetFields();
          setOpen(true);
        }}
        style={{ marginBottom: 16 }}
      >
        ➕ Thêm sản phẩm
      </Button>

      <Table
        rowKey={(record) => record._id}
        loading={loading}
        dataSource={books}
        columns={[
          { title: "ID", dataIndex: "_id", width: 200 },
          { title: "Tên", dataIndex: "title" },
          { title: "Giá", dataIndex: "price" },
          { title: "Kho", dataIndex: "stock_quantity", width: 80 },
          {
            title: "Danh mục",
            render: (_, record) => {
              const catId = typeof record.category_id === 'object' ? record.category_id._id : record.category_id;
              return categories.find(c => c._id === catId)?.name || "Không rõ";
            }
          },
          {
            title: "Tác giả",
            render: (_, record) => {
              const authorId = typeof record.author_id === 'object' ? record.author_id._id : record.author_id;
              return authors.find(a => a._id === authorId)?.name || "Không rõ";
            }
          },
          {
            title: "Trạng thái",
            dataIndex: "is_available",
            render: available => available ? "✅ Còn bán" : "❌ Ngừng bán",
          },
          {
            title: "Ảnh bìa",
            dataIndex: "cover_image",
            render: (url: string) =>
              url ? <Image src={url} alt="cover" width={50} /> : "Không có",
          },
          {
            title: "Hành động",
            render: (_, record) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={async () => {
                  if (!categories.length || !authors.length) {
                    await fetchData();
                  }

                  const categoryId = typeof record.category_id === 'object' ? record.category_id._id : record.category_id;
                  const authorId = typeof record.author_id === 'object' ? record.author_id._id : record.author_id;

                  setEditing(record);
                  form.setFieldsValue({
                    title: record.title,
                    price: record.price,
                    stock_quantity: record.stock_quantity,
                    category_id: categoryId,
                    author_id: authorId,
                    publisher: record.publisher,
                    publish_year: dayjs(record.publish_year),
                    description: record.description,
                    is_available: record.is_available,
                    cover_image: record.cover_image,
                  });
                  setOpen(true);
                }} />
                <Popconfirm title="Xoá sản phẩm?" onConfirm={() => handleDelete(record._id)}>
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            )
          },
        ]}
      />

      <Modal
        open={open}
        title={editing ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm"}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText={editing ? "Cập nhật" : "Thêm"}
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tên sản phẩm" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="stock_quantity" label="Tồn kho" rules={[{ required: true }]}><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="publisher" label="NXB" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="publish_year" label="Năm phát hành" rules={[{ required: true }]}><DatePicker style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="category_id" label="Danh mục" rules={[{ required: true }]}>
            <Select placeholder="Chọn danh mục">
              {categories.map(c => (
                <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="author_id" label="Tác giả" rules={[{ required: true }]}>
            <Select placeholder="Chọn tác giả">
              {authors.map(a => (
                <Select.Option key={a._id} value={a._id}>{a.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="is_available" label="Còn bán?" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="cover_image"
            label="Link ảnh bìa"
            rules={[{ required: true, message: "Vui lòng nhập URL ảnh bìa" }]}
          >
            <Input placeholder="Nhập URL ảnh" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductPage;
