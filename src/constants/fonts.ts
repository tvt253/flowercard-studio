export interface FontItem {
  label: string;
  value: string;
  category: 'uppercase' | 'calligraphy' | 'classic';
}

export const FONT_OPTIONS: FontItem[] = [
  // --- NHÓM FONT CHỮ IN HOA CHUYÊN DỤNG (HỖ TRỢ 100% TIẾNG VIỆT) ---
  { label: 'Oswald (In hoa đậm - Chuẩn băng rôn & ruy băng)', value: 'Oswald', category: 'uppercase' },
  { label: 'Anton (In hoa siêu dày / Rất nổi bật)', value: 'Anton', category: 'uppercase' },
  { label: 'Marcellus (In hoa La Mã / Cực kỳ sang trọng)', value: 'Marcellus', category: 'uppercase' },
  { label: 'Prata (In hoa có chân quý phái / Nét thanh đậm)', value: 'Prata', category: 'uppercase' },
  { label: 'Alegreya SC (In hoa Small-Caps / Chuẩn mực trang nhã)', value: 'Alegreya SC', category: 'uppercase' },
  { label: 'Yeseva One (In hoa nét cong nghệ thuật)', value: 'Yeseva One', category: 'uppercase' },
  { label: 'Philosopher (In hoa cách điệu hiện đại)', value: 'Philosopher', category: 'uppercase' },
  { label: 'Be Vietnam Pro (In hoa hiện đại chuẩn quốc gia)', value: 'Be Vietnam Pro', category: 'uppercase' },

  // --- NHÓM FONT THƯ PHÁP & NGHỆ THUẬT (MẪU GỐC) ---
  { label: 'Charm (Thư pháp nét chuẩn mẫu gốc)', value: 'Charm', category: 'calligraphy' },
  { label: 'Charmonman (Thư pháp uốn lượn quý phái)', value: 'Charmonman', category: 'calligraphy' },
  { label: 'Dancing Script (Chữ viết tay nghệ thuật)', value: 'Dancing Script', category: 'calligraphy' },
  { label: 'Pattaya (Chữ cọ nét dày sang trọng)', value: 'Pattaya', category: 'calligraphy' },
  { label: 'Playwrite VN (Chữ thảo nét thanh nét đậm)', value: 'Playwrite VN', category: 'calligraphy' },
  { label: 'Sriracha (Chữ viết tự nhiên mềm mại)', value: 'Sriracha', category: 'calligraphy' },
  { label: 'Pacifico (Chữ uốn cổ điển)', value: 'Pacifico', category: 'calligraphy' },

  // --- NHÓM FONT CỔ ĐIỂN & HIỆN ĐẠI ---
  { label: 'Playfair Display (Chữ có chân sang trọng)', value: 'Playfair Display', category: 'classic' },
  { label: 'Cormorant Garamond (Chữ cổ điển trang trọng)', value: 'Cormorant Garamond', category: 'classic' },
  { label: 'Montserrat (Chữ không chân hiện đại)', value: 'Montserrat', category: 'classic' },
];

