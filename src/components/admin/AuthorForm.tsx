import { Form, Input, Button, DatePicker, message } from 'antd';
import { useState } from 'react';
import { addAuthor, updateAuthor } from '@/services/author.service';
import type { Author, AuthorInput } from '@/types/author.type';
import dayjs from 'dayjs';

interface AuthorFormProps {
  author?: Author;
  onSuccess: () => void;
  onCancel: () => void;
}

const AuthorForm = ({ author, onSuccess, onCancel }: AuthorFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditing = !!author;

  // Nếu đang chỉnh sửa, điền dữ liệu vào form
  Form.useWatch(() => {
    if (author) {
      form.setFieldsValue({
        ...author,
        birth_date: author.birth_date ? dayjs(author.birth_date) : undefined,
      });
    }
  }, [author]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const authorData: AuthorInput = {
        name: values.name,
        nationality: values.nationality || "Chưa cập nhật",
        birth_date: values.birth_date?.format('YYYY-MM-DD') || new Date().toISOString().split('T')[0],
        bio: values.bio || "Chưa có thông tin chi tiết về tác giả.",
      };

      if (isEditing && author) {
        await updateAuthor(author._id, authorData);
        message.success('Cập nhật tác giả thành công!');
      } else {
        await addAuthor(authorData);
        message.success('Thêm tác giả thành công!');
      }
      
      onSuccess();
      form.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="Tên tác giả"
        rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}
      >
        <Input placeholder="Nhập tên tác giả" />
      </Form.Item>

      <Form.Item
        name="nationality"
        label="Quốc tịch"
        rules={[{ required: true, message: 'Vui lòng nhập quốc tịch' }]}
      >
        <Input placeholder="Nhập quốc tịch" />
      </Form.Item>

      <Form.Item
        name="birth_date"
        label="Ngày sinh"
        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="bio"
        label="Tiểu sử"
        rules={[{ required: true, message: 'Vui lòng nhập tiểu sử', min: 10 }]}
      >
        <Input.TextArea rows={4} placeholder="Nhập tiểu sử (ít nhất 10 ký tự)" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
          {isEditing ? 'Cập nhật' : 'Thêm mới'}
        </Button>
        <Button onClick={onCancel}>Hủy</Button>
      </Form.Item>
    </Form>
  );
};

export default AuthorForm;