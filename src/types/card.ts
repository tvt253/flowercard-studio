export interface TextLine {
  id: string;
  text: string;
  fontSize: number;
  offsetY: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  letterSpacing: number;
  textCase?: 'uppercase' | 'capitalize' | 'normal';

  fontFamily?: string;
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  curveStrength?: number;
}

export interface StrokeLayer {
  id: string;
  name: string;
  color: string;
  width: number;
  enabled: boolean;
}

export type StyleType = 'cloud' | 'cloud-solid' | 'oval-red' | 'oval-black';

export interface CardConfig {
  scalePercent: number; // Kích thước thiệp so với giấy (mặc định 95%)
  copiesPerPage: 1 | 2 | 3; // 1: Xoay ngang A4; 2: A4 đứng 2 bản; 3: A4 đứng 3 bản (thiệp 1 dòng)
  showCutLines?: boolean;

  styleType: StyleType;

  // Nền & Chữ kiểu Oval tùy biến (ví dụ: Kính dâng nền đỏ chữ vàng, Kính viếng nền trắng chữ đen)
  ovalBgColor?: string;
  ovalBorderColor?: string;
  ovalTextColor?: string;

  // Nền & Chữ kiểu Đám Mây Nền Đặc (Solid Cloud - Chữ Nổi)
  cloudTextColor?: string;
  cloudBgColor?: string;

  // Cài đặt chung
  globalFontFamily: string;
  globalCurveStrength: number; // Độ cong từ 0 đến 80
  globalStrokeColor: string;
  globalStrokeWidth: number;

  // Cài đặt viền Stroke tự động (mặt chữ luôn ăn theo outerStrokeColor)
  strokeLayerCount: 4 | 5 | 6; // 3 tùy chọn: 4, 5, 6 lớp
  outerStrokeWidth: number; // Tối đa lên đến 150px (mặc định 130px)
  innerStrokeWidth: number; // Tối đa lên đến 50px (mặc định 30px)
  outerStrokeColor: string;
  innerStrokeColor: string;

  strokeLayers: StrokeLayer[];

  lines: TextLine[];
}

export type PresetName =
  // Nhóm đám mây (Cloud - 6 mẫu)
  | '20-10'
  | '20-11'
  | '8-3'
  | 'khai-truong'
  | 'sinh-nhat'
  | 'mung-cuoi'
  // Nhóm Oval đỏ (Khai trương / Chúc mừng - 6 mẫu)
  | 'oval-khai-truong'
  | 'oval-khanh-thanh'
  | 'oval-tan-gia'
  | 'oval-20-10'
  | 'oval-20-11'
  | 'oval-8-3'
  // Nhóm Oval tang lễ / tâm linh (5 mẫu)
  | 'chia-buon'
  | 'kinh-dang'
  | 'kinh-vieng'
  | 'cong-giao'
  | 'ngan-thu';

export interface Preset {
  name: string;
  outerColor: string;
  innerColor: string;
  globalFontFamily: string;
  ovalBgColor?: string;
  ovalBorderColor?: string;
  ovalTextColor?: string;
  lines: Omit<TextLine, 'id'>[];
}
