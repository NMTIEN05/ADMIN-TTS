import React, { useState } from 'react';
import { Upload, Button, message, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  type?: 'books' | 'authors';
  maxSize?: number; // MB
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  type = 'books',
  maxSize = 5
}) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const uploadProps: UploadProps = {
    name: 'image',
    action: `http://localhost:8888/api/upload/single`,
    data: { type },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ có thể upload file ảnh!');
        return false;
      }
      
      const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
      if (!isLtMaxSize) {
        message.error(`Ảnh phải nhỏ hơn ${maxSize}MB!`);
        return false;
      }
      
      return true;
    },
    onChange: (info) => {
      setFileList(info.fileList);
      
      if (info.file.status === 'uploading') {
        setLoading(true);
      }
      
      if (info.file.status === 'done') {
        setLoading(false);
        const response = info.file.response;
        if (response && response.imageUrl) {
          const fullUrl = `http://localhost:8888${response.imageUrl}`;
          onChange?.(fullUrl);
          message.success('Upload ảnh thành công!');
        }
      }
      
      if (info.file.status === 'error') {
        setLoading(false);
        message.error('Upload ảnh thất bại!');
      }
    },
    showUploadList: false,
    maxCount: 1,
  };

  const handleRemove = () => {
    onChange?.('');
    setFileList([]);
  };

  return (
    <div>
      {value ? (
        <div style={{ marginBottom: 16 }}>
          <Image
            src={value}
            alt="Preview"
            style={{ maxWidth: 200, maxHeight: 200, objectFit: 'cover' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
          <div style={{ marginTop: 8 }}>
            <Button 
              type="primary" 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
              onClick={handleRemove}
            >
              Xóa ảnh
            </Button>
          </div>
        </div>
      ) : null}
      
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} loading={loading}>
          {value ? 'Thay đổi ảnh' : 'Upload ảnh'}
        </Button>
      </Upload>
      
      <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
        Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, WebP) và kích thước tối đa {maxSize}MB
      </div>
    </div>
  );
};

export default ImageUpload;