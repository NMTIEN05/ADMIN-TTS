# ADMIN-TTS - Admin Panel for Book Store

## Tổng quan
Admin panel được xây dựng với React + TypeScript + Ant Design để quản lý hệ thống bán sách online.

## Công nghệ sử dụng
- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: Ant Design 5
- **State Management**: Zustand, React Query
- **HTTP Client**: Axios
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS

## Tính năng chính

### 1. Dashboard
- Thống kê tổng quan: người dùng, sản phẩm, đơn hàng, doanh thu
- Danh sách đơn hàng gần đây
- Các chỉ số quan trọng

### 2. Quản lý người dùng
- Xem danh sách người dùng
- Thêm/sửa/xóa người dùng
- Phân quyền (User/Admin)
- Quản lý trạng thái tài khoản

### 3. Quản lý danh mục
- CRUD operations cho categories
- Validation form
- Tìm kiếm và phân trang

### 4. Quản lý tác giả
- Thêm/sửa/xóa tác giả
- Thông tin: tên, tiểu sử, ngày sinh, quốc tịch
- Date picker cho ngày sinh

### 5. Quản lý sản phẩm (Sách)
- CRUD operations cho books
- Liên kết với category và author
- Quản lý giá, số lượng, trạng thái
- Upload ảnh bìa
- Rich form với validation

### 6. Quản lý mã giảm giá
- Tạo/sửa/xóa coupon
- Loại giảm giá: phần trăm hoặc cố định
- Thiết lập thời gian hiệu lực
- Giới hạn sử dụng
- Toggle trạng thái active/inactive

### 7. Quản lý đơn hàng
- Xem danh sách đơn hàng
- Chi tiết đơn hàng với thông tin khách hàng
- Cập nhật trạng thái đơn hàng
- Hủy đơn hàng
- Theo dõi thanh toán

## Cấu trúc thư mục

```
src/
├── components/          # Shared components
│   ├── common/         # Layout components
│   └── layouts/        # Page layouts
├── constants/          # App constants & API endpoints
├── pages/             # Page components
│   ├── admin/         # Admin pages
│   └── userList.tsx   # User management
├── services/          # API services
├── stores/            # Zustand stores
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── routes/            # Route configurations
```

## API Endpoints

### Authentication
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `GET /auth/users` - Lấy danh sách users

### Categories
- `GET /api/categories` - Lấy danh sách
- `POST /api/categories/add` - Thêm mới
- `PUT /api/categories/edit/:id` - Cập nhật
- `DELETE /api/categories/:id` - Xóa

### Authors
- `GET /api/authors` - Lấy danh sách
- `POST /api/authors/add` - Thêm mới
- `PUT /api/authors/edit/:id` - Cập nhật
- `DELETE /api/authors/:id` - Xóa

### Books
- `GET /api/books` - Lấy danh sách
- `POST /api/books/add` - Thêm mới
- `PUT /api/books/edit/:id` - Cập nhật
- `DELETE /api/books/:id` - Xóa

### Coupons
- `GET /api/coupons` - Lấy danh sách
- `POST /api/coupons/add` - Thêm mới
- `PUT /api/coupons/edit/:id` - Cập nhật
- `DELETE /api/coupons/:id` - Xóa
- `PATCH /api/coupons/toggle/:id` - Toggle status

### Orders
- `GET /api/orders` - Lấy danh sách
- `PATCH /api/orders/status/:id` - Cập nhật trạng thái
- `PATCH /api/orders/cancel/:id` - Hủy đơn hàng
- `DELETE /api/orders/:id` - Xóa

## Cài đặt và chạy

1. **Cài đặt dependencies**
```bash
npm install
# hoặc
yarn install
```

2. **Chạy development server**
```bash
npm run dev
# hoặc
yarn dev
```

3. **Build production**
```bash
npm run build
# hoặc
yarn build
```

## Cấu hình

### Environment Variables
Cập nhật các URL API trong `src/constants/index.ts`:
```typescript
export const API_BASE_URL = 'http://localhost:8888/api';
export const AUTH_BASE_URL = 'http://localhost:8888/auth';
```

### Backend Requirements
Đảm bảo BE-TTSCODEFARM đang chạy trên port 8888 với các endpoints đã được implement.

## Tính năng nổi bật

### 1. React Query Integration
- Automatic caching và refetching
- Optimistic updates
- Error handling
- Loading states

### 2. Form Validation
- Real-time validation với Ant Design Form
- Custom validation rules
- Error messages tiếng Việt

### 3. Responsive Design
- Mobile-friendly interface
- Collapsible sidebar
- Scrollable tables

### 4. Type Safety
- Full TypeScript support
- Strict type checking
- Interface definitions cho tất cả data models

### 5. User Experience
- Loading indicators
- Success/error notifications
- Confirmation dialogs
- Intuitive navigation

## Troubleshooting

### Common Issues

1. **CORS Error**
   - Đảm bảo backend có cấu hình CORS cho frontend URL

2. **API Connection**
   - Kiểm tra backend đang chạy trên đúng port
   - Verify API endpoints trong constants

3. **Build Errors**
   - Chạy `npm run lint` để check lỗi ESLint
   - Đảm bảo tất cả dependencies được cài đặt

## Liên hệ
Nếu có vấn đề gì, hãy kiểm tra console browser và network tab để debug.