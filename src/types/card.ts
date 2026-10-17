export interface TextLine {
  id: string;
  text: string;
  fontSize: number;
  offsetY: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  letterSpacing: number;

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
  scalePercent: number; // Tỷ lệ to nhỏ toàn bộ thiệp so với giấy (40% - 110%)
  copiesPerPage: 1 | 2 | 3 | 4; // 1: Dọc 80% chiều dài A4; 2: Ngang 95% chiều rộng A4
  showCutLines: boolean; // Đường viền cắt bế cách stroke 0.5cm

  // Chọn kiểu dáng thiệp
  styleType: StyleType;

  // Cài đặt chữ chung (Global Typography)
  globalFontFamily: string;
  globalCurveType: 'wave' | 'arc' | 'flat';
  globalCurveStrength: number;
  globalTextColor: string;
  globalStrokeColor: string;
  globalStrokeWidth: number;

  // Cài đặt viền Stroke tự động
  strokeLayerCount: number;
  outerStrokeWidth: number;
  innerStrokeWidth: number;
  outerStrokeColor: string;
  innerStrokeColor: string;

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
