# 🌸 FlowerCard Studio

**FlowerCard Studio** là ứng dụng thiết kế, uốn cong chữ nghệ thuật, tạo viền đám mây / oval, dàn trang A4 và in thiệp/băng rôn gắn giỏ hoa chuyên nghiệp dành riêng cho các shop hoa tại Việt Nam.

Ứng dụng được xây dựng theo kiến trúc hiện đại: **React 18 + TypeScript + Vite + TailwindCSS + Zustand**, kết xuất đồ họa vector SVG sắc nét không vỡ hạt khi in ấn, và được đóng gói sẵn để deploy **100% MIỄN PHÍ** lên Cloud (**Render.com**, **Vercel**, **Docker**).

---

## ✨ Tính Năng Nổi Bật

1. **Tạo Hình Thiệp Đa Dạng**:
   - ☁️ **Kiểu Đám Mây**: Các lớp viền loang bám theo từng nét chữ nghệ thuật (hệ thống 4, 5, 6 lớp viền tự động tính toán từ 130px xuống 30px).
   - 🔴 **Kiểu Oval Đỏ (Khai Trương / Chúc Mừng)**: Khối Oval viền kép cách điệu với nền đỏ đặc và chữ trắng nổi bật.
   - ⚫ **Kiểu Oval Đen (Chia Buồn / Tang Lễ)**: Khung Oval viền kép trang nghiêm, chữ trắng thanh lịch.

2. **Font Chữ Chuẩn Mẫu & Tiếng Việt 100%**:
   - Mặc định sử dụng font **Charm (Thư pháp chuẩn mẫu)** với nét bút lông sắc sảo.
   - Tuyển chọn 10 font thư pháp, viết tay và có chân hỗ trợ trọn vẹn dấu tiếng Việt (*Charm, Charmonman, Dancing Script, Pattaya, Playwrite VN, Sriracha, Pacifico, Playfair Display, Cormorant Garamond, Montserrat*).
   - Nút chuyển đổi kiểu chữ **Aa** linh hoạt: Viết hoa đầu từ (*Aa*), IN HOA (*AA* - CAPSLOCK), Chữ thường (*aa*).

3. **Chỉnh Sửa Trực Tiếp Trên Bản Xem Trước (Direct Canvas Editing)**:
   - Nhấp chuột trực tiếp vào dòng chữ trên thiệp để sửa nội dung, tăng giảm cỡ chữ (`-` `70px` `+`), chỉnh vị trí dọc (Lên/Xuống), đổi kiểu chữ (*Aa*), in đậm/nghiêng.
   - Thay đổi cập nhật tức thì theo thời gian thực (real-time).

4. **Dàn Trang A4 & Chế Bản In Ấn Chuyên Nghiệp**:
   - **1 bản / tờ A4**: Tự động xoay ngang giấy (**Landscape: 297mm × 210mm**), thiệp nằm ngang thuận mắt, chiếm 100% - 120% bề ngang.
   - **2 bản / tờ A4**: Giấy đứng (**Portrait: 210mm × 297mm**) xếp 2 thiệp trên dưới.
   - **In Trực Tiếp (A4)** bằng trình duyệt và **Xuất file PDF** sắc nét đúng chuẩn 1 trang duy nhất (đã khử hoàn toàn trang trắng thừa).

---

## 🚀 Hướng Dẫn Deploy Lên Dịch Vụ Miễn Phí

### Cách 1: Deploy Lên Render.com (Khuyên dùng - 100% Miễn Phí, Không Ngủ Đông)

Render cung cấp dịch vụ **Static Site** hoàn toàn miễn phí, có CDN toàn cầu, chứng chỉ SSL tự động và **KHÔNG BỊ SLEEP** (mở là chạy ngay lập tức, không phải chờ đợi).

#### Bước 1: Đẩy mã nguồn lên GitHub
Mở Terminal/PowerShell tại thư mục dự án và chạy:
```bash
# Kiểm tra nhánh và commit mới nhất
git add .
git commit -m "feat: ready for cloud deployment"

# Đặt tên nhánh chính là main
git branch -M main

# Thêm link repository GitHub của bạn (nếu chưa thêm)
git remote add origin https://github.com/<tên-tài-khoản-github>/flowercard-studio.git

# Đẩy mã nguồn lên GitHub
git push -u origin main
```

#### Bước 2: Kết nối với Render.com
1. Truy cập [https://dashboard.render.com/](https://dashboard.render.com/) (đăng nhập bằng tài khoản GitHub).
2. Nhấn nút **New +** ở góc trên bên phải ➔ Chọn **Static Site**.
3. Chọn repository `flowercard-studio` của bạn vừa tạo trên GitHub.
4. Điền các thông số:
   - **Name**: `flowercard-studio` (hoặc tên tùy thích)
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Nhấn **Create Static Site**.

Render sẽ tự động build và cấp cho bạn một đường link miễn phí dạng `https://flowercard-studio.onrender.com`. Từ nay, mỗi khi bạn đẩy code mới lên GitHub, Render sẽ **tự động deploy bản mới trong 1-2 phút**!

---

### Cách 2: Deploy Lên Vercel (1-Click, Cực Nhanh)

Dự án đã có sẵn file `vercel.json`:
1. Truy cập [https://vercel.com/](https://vercel.com/) và đăng nhập bằng GitHub.
2. Nhấn **Add New...** ➔ Chọn **Project**.
3. Chọn repository `flowercard-studio` từ danh sách GitHub của bạn.
4. Vercel sẽ tự nhận diện Vite:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Nhấn **Deploy**. Chỉ mất khoảng 30 giây là ứng dụng đã online vĩnh viễn!

---

### Cách 3: Chạy Bằng Docker Container (Render Web Service hoặc Local)

Dự án đã trang bị sẵn `Dockerfile` đa tầng (multi-stage build) và `nginx.conf` với bảo mật và nén gzip tối ưu:

```bash
# Build Docker image
docker build -t flowercard-studio .

# Chạy container tại cổng 7860
docker run -d -p 7860:7860 --name flower-card flowercard-studio
```
Truy cập tại: `http://localhost:7860`

---

## 💻 Chạy Thử Nghiệm Trên Máy Cục Bộ (Local)

```bash
# Cài đặt thư viện (nếu mới clone về)
npm install

# Chạy server phát triển
npm run dev
```
Trình duyệt sẽ mở tại: `http://localhost:5173`
