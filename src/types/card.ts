export interface TextLine {
  id: string;
  text: string;
  fontSize: number;
  offsetY: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  letterSpacing: number;
  textCase?: 'uppercase' | 'capitalize' | 'normal'; // Mặc định là caplock (uppercase)

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

export type StyleType = 'cloud';

export interface CardConfig {
  scalePercent: number; // Kích thước thiệp so với giấy (lên đến 120%)
  copiesPerPage: 1 | 2; // 1: Xoay ngang giấy A4; 2: Giấy đứng A4 2 bản
  showCutLines?: boolean;

  styleType: StyleType;

  // Cài đặt chung
  globalFontFamily: string;
  globalCurveStrength: number; // Độ cong từ 0 đến 80
  globalStrokeColor: string;
  globalStrokeWidth: number;

  // Cài đặt viền Stroke tự động (mặt chữ luôn ăn theo outerStrokeColor)
  strokeLayerCount: 4 | 5 | 6; // 3 tùy chọn: 4, 5, 6 lớp
  outerStrokeWidth: number; // Tối đa lên đến 150px
  innerStrokeWidth: number; // Tối đa lên đến 50px
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
