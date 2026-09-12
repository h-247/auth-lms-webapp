# Auth + LMS Web Application

Ứng dụng quản lý đào tạo dành cho trung tâm quy mô nhỏ, tập trung vào xác thực,
quản lý người dùng và LMS.

## Thành phần

| Thư mục | Trách nhiệm |
|---|---|
| `frontend/` | Next.js UI và API proxy |
| `auth-and-management-service/` | Đăng nhập, người dùng, vai trò và tổ chức |
| `lms-service/` | Khóa học, nội dung, ghi danh, bài kiểm tra và tiến độ |
| `docker-compose.auth-lms.yml` | Môi trường chạy local độc lập |

Các service AI, Chat, Virtual Lab, Personalization, Recommender, Data Warehouse
và Analytics đã được loại khỏi repository và runtime này.

## Chạy local

```powershell
Copy-Item .env.auth-lms.example .env.auth-lms.local
docker compose --env-file .env.auth-lms.local -f docker-compose.auth-lms.yml up -d --build
```

Mở `http://localhost:3000/login`. Chi tiết cấu hình và tài khoản demo nằm trong
[`docs/AUTH_LMS_LOCAL.md`](docs/AUTH_LMS_LOCAL.md).

## Dừng hệ thống

```powershell
docker compose --env-file .env.auth-lms.local -f docker-compose.auth-lms.yml down
```

Repository tiếp tục giữ giấy phép MIT và lịch sử Git của dự án nguồn.
