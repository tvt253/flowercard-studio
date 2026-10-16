# 🌸 FlowerCard Studio

**FlowerCard Studio** là ứng dụng thiết kế, uốn cong chữ nghệ thuật, dàn trang A4 và in thiệp/băng rôn gắn giỏ hoa chuyên nghiệp dành riêng cho các shop hoa tại Việt Nam.

Ứng dụng được xây dựng theo kiến trúc hiện đại: **React 18 + TypeScript + Vite + TailwindCSS + Zustand**, kết xuất đồ họa vector SVG sắc nét không vỡ hạt khi in ấn, và được đóng gói bằng **Docker (Multi-stage build với Nginx)** để sẵn sàng deploy miễn phí lên Cloud (Render.com, Hugging Face Spaces).

---

## ✨ Tính Năng Nổi Bật

1. **Uốn Cong Chữ Nghệ Thuật (Curved Text SVG)**:
   - Uốn lượn hình chữ S (`wave`) theo dải ruy-băng mẫu hoa thực tế.
   - Uốn cong vòm cung (`arc`) hoặc nằm thẳng (`flat`).
   - Tùy chỉnh độ cong (-100 đến +100) và vị trí dòng chữ (Offset Y).

2. **5 Bộ Phôi Thiệp Vector Chuẩn Thẩm Mỹ Cao**:
   - 🎀 **Ruy-băng Đỏ (Mẫu gốc)**: Băng rôn đỏ hồng uốn lượn, điểm xuyết cụm hoa hồng đỏ và lá xanh.
   - ✨ **Ruy-băng Vàng Kim**: Gradient ánh vàng kim sang trọng cho Khai Trương, Kỷ Niệm.
   - 🌸 **Quạt Hồng Pastel**: Hình quạt bán nguyệt điệu đà cho dịp 8/3, 20/10.
   - 🍃 **Đám Mây Bạc Hà**: Thiết kế bo sóng hiện đại, trẻ trung cho Sinh Nhật.
   - 🕯️ **Khung Oval Chia Buồn**: Khung viền kép trang nghiêm với họa tiết hoa cúc / sen tối giản.
   - 📷 **Tải ảnh phôi riêng**: Hỗ trợ tải file `.png, .jpg` phôi sẵn của shop hoa.

3. **Dàn Trang A4 & Chế Bản In Ấn Chuyên Nghiệp**:
   - Dàn 1, 2 (chuẩn mẫu gốc), 3, hoặc 4 bản thiệp trên 1 tờ A4.
   - Tùy chỉnh tỉ lệ co giãn kích thước (% so với khổ A4).
   - Đường kẻ đứt hướng dẫn cắt kéo (`✂️`).
   - **In Trực Tiếp (A4)** bằng `window.print()` chuẩn `@page { size: A4 portrait; margin: 0; }`.
   - **Xuất file PDF** chất lượng cao 300DPI (`scale: 3`) bằng `html2pdf.js`.

4. **Bảng Phông Chữ Tiếng Việt Phong Phú**:
   - Tích hợp sẵn: *Great Vibes*, *Dancing Script*, *Alex Brush*, *Pacifico*, *Playfair Display*, *Cormorant Garamond*, *Montserrat*.
   - Hỗ trợ viền chữ tương phản (Stroke) giúp chữ luôn nổi bật trên mọi nền hoa rực rỡ.

---

## 🚀 Hướng Dẫn Chạy Demo Trên Local

### Yêu cầu tiên quyết:
- Đã cài đặt **Node.js 18+** (hoặc Node 20)
- (Tùy chọn) Đã cài đặt **Docker Desktop** nếu muốn test container

### Cách 1: Chạy Vite Development Server (Nhanh nhất)
```bash
# Di chuyển vào thư mục dự án
cd "d:/project/thacht/flower card"

# Chạy server phát triển
npm run dev
```
Trình duyệt sẽ mở tại: `http://localhost:5173`

---

### Cách 2: Kiểm Tra Bản Build Production Trên Local
```bash
# Biên dịch TypeScript và đóng gói Vite
npm run build

# Chạy bản build thử nghiệm
npm run preview
```
Trình duyệt sẽ mở tại: `http://localhost:4173`

---

### Cách 3: Chạy Bằng Docker Container Trên Local
```bash
# Build Docker image (sử dụng multi-stage build)
docker build -t flowercard-studio .

# Chạy container ở cổng 7860
docker run -d -p 7860:7860 --name flower-app flowercard-studio
```
Mở trình duyệt truy cập: `http://localhost:7860`

---

## ☁️ Hướng Dẫn Kết Nối GitHub & Deploy Tự Động Lên Render.com

Dự án đã được trang bị sẵn file cấu hình `render.yaml`, `Dockerfile` và `nginx.conf` lắng nghe tại cổng `7860`.

### Bước 1: Khởi Tạo Git & Đẩy Lên GitHub
```bash
# Khởi tạo repo git
git init
git add .
git commit -m "feat: initial commit FlowerCard Studio full codebase"

# Đặt nhánh chính là main
git branch -M main

# Thêm remote repo GitHub của bạn (thay URL bằng repo của bạn)
git remote add origin https://github.com/<your-username>/flowercard-studio.git

# Push mã nguồn lên GitHub
git push -u origin main
```

### Bước 2: Tạo Dịch Vụ Trên Render.com
1. Đăng nhập vào [Render.com](https://dashboard.render.com/).
2. Nhấn nút **New +** ở góc phải trên -> chọn **Web Service**.
3. Chọn tùy chọn **Build and deploy from a Git repository** và kết nối với repository `flowercard-studio` của bạn trên GitHub.
4. Cấu hình các thông số:
   - **Name**: `flowercard-studio`
   - **Region**: `Singapore (Southeast Asia)` (để truy cập nhanh nhất từ Việt Nam)
   - **Branch**: `main`
   - **Runtime**: Chọn **Docker**
   - **Instance Type**: Chọn **Free**
5. Trong mục **Advanced**:
   - Thêm Environment Variable: `PORT` = `7860`
   - Health Check Path: `/health`
6. Nhấn **Create Web Service**.

### Bước 3: Tự Động Triển Khai (Auto-Deploy)
Từ thời điểm này, mỗi khi bạn commit và `git push` lên nhánh `main`, Render sẽ tự động kéo code mới nhất, build Docker image và phát hành phiên bản mới chỉ trong vòng 2-3 phút hoàn toàn tự động!

*(Ứng dụng cũng có thể triển khai lên **Hugging Face Spaces** dạng Docker Space với cấu hình cổng 7860 mặc định).*
