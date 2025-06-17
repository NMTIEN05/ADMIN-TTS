import { Form, Input, Button, DatePicker, InputNumber, Switch, Select, message } from 'antd';
import { useState } from 'react';
import { createCoupon, updateCoupon } from '@/services/coupon.service';
import type { Coupon, CouponInput } from '@/types/coupon.type';
import dayjs from 'dayjs';

interface CouponFormProps {
  coupon?: Coupon;
  onSuccess: () => void;
  onCancel: () => void;
}

const CouponForm = ({ coupon, onSuccess, onCancel }: CouponFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditing = !!coupon;

  // Nếu đang chỉnh sửa, điền dữ liệu vào form
  Form.useWatch(() => {
    if (coupon) {
      // Map lại tên trường để khớp với form
      form.setFieldsValue({
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_purchase: coupon.min_purchase,
        start_date: coupon.start_date ? dayjs(coupon.start_date) : undefined,
        end_date: coupon.end_date ? dayjs(coupon.end_date) : undefined,
        is_active: coupon.is_active,
      });
    }
  }, [coupon]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const couponData: CouponInput = {
        code: values.code,
        discount_type: values.discount_type,
        discount_value: values.discount_value,
        min_purchase: values.min_purchase,
        start_date: values.start_date.format('YYYY-MM-DD'),
        end_date: values.end_date.format('YYYY-MM-DD'),
        is_active: values.is_active,
      };

      if (isEditing && coupon) {
        await updateCoupon(coupon._id, couponData);
        message.success('Cập nhật mã giảm giá thành công!');
      } else {
        await createCoupon(couponData);
        message.success('Thêm mã giảm giá thành công!');
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
      initialValues={{
        discount_type: 'percentage',
        is_active: true,
      }}
    >
      <Form.Item
        name="code"
        label="Mã giảm giá"
        rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá' }]}
      >
        <Input placeholder="Nhập mã giảm giá" />
      </Form.Item>

      <Form.Item
        name="discount_type"
        label="Loại giảm giá"
        rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá' }]}
      >
        <Select>
          <Select.Option value="percentage">Phần trăm (%)</Select.Option>
          <Select.Option value="fixed">Số tiền cố định</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="discount_value"
        label="Giá trị giảm"
        rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="min_purchase"
        label="Giá trị đơn hàng tối thiểu"
        rules={[{ required: true, message: 'Vui lòng nhập giá trị đơn hàng tối thiểu' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="start_date"
        label="Ngày bắt đầu"
        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="end_date"
        label="Ngày kết thúc"
        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>



      <Form.Item
        name="is_active"
        label="Kích hoạt"
        valuePropName="checked"
      >
        <Switch />
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

export default CouponForm;