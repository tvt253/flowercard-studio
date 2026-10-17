export interface TextLine {
  id: string;
  text: string;
  fontSize: number;
  offsetY: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  letterSpacing: number;

  // Thuộc tính kế thừa hoặc tùy biến
  fontFamily?: string;
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  curveType?: 'wave' | 'arc' | 'flat';
  curveStrength?: number;
}

export interface StrokeLayer {
  id: string;
  name: string;
  color: string;
  width: number; // Độ rộng của lớp stroke (px)
  enabled: boolean;
}

export type StyleType = 'cloud' | 'minimal' | 'modern';

export interface CardConfig {
  customBgUrl: string | null;
  scalePercent: number;
  copiesPerPage: 1 | 2 | 3 | 4;
  showCutLines: boolean;

  // Chọn kiểu dáng thiệp (Mặc định: 'cloud' - Kiểu Đám Mây chuẩn mẫu)
  styleType: StyleType;

  // Cấu hình chữ chung (Global Typography) giúp đồng nhất toàn bộ thiệp
  globalFontFamily: string;
  globalCurveType: 'wave' | 'arc' | 'flat';
  globalCurveStrength: number;
  globalTextColor: string;
  globalStrokeColor: string;
  globalStrokeWidth: number;

  // Cấu hình viền Stroke đơn giản tự động tính toán
  strokeLayerCount: number; // Số lượng lớp viền (1 - 8, mặc định 5)
  outerStrokeWidth: number; // Độ dày lớp ngoài cùng (20 - 90px, mặc định 56px)
  innerStrokeWidth: number; // Độ dày lớp trong cùng sát chữ (4 - 24px, mặc định 12px)
  outerStrokeColor: string; // Màu lớp ngoài cùng (mặc định đỏ thắm #c81e2b)
  innerStrokeColor: string; // Màu lớp trong cùng (mặc định trắng #ffffff)

  // Danh sách các lớp stroke đã tính toán
  strokeLayers: StrokeLayer[];

  lines: TextLine[];
}

export type PresetName = '20-10' | '20-11' | '8-3' | 'khai-truong' | 'sinh-nhat' | 'chia-buon';

export interface Preset {
  name: string;
  outerColor: string;
  innerColor: string;
  globalFontFamily: string;
  lines: Omit<TextLine, 'id'>[];
}
