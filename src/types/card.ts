export interface TextLine {
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  color: string;
  strokeColor: string;
  strokeWidth: number;
  curveType: 'wave' | 'arc' | 'flat';
  curveStrength: number;
  offsetY: number;
  letterSpacing: number;
}

export interface StrokeLayer {
  id: string;
  name: string;
  color: string;
  width: number; // Độ rộng của lớp stroke (px)
  enabled: boolean;
}

export interface CardConfig {
  customBgUrl: string | null;
  scalePercent: number;
  copiesPerPage: 1 | 2 | 3 | 4;
  showCutLines: boolean;

  // Kiểu hiển thị stroke: bám theo từng dòng chữ (per-line) như mẫu
  strokeMode: 'per-line' | 'merged';
  // Thứ tự xếp chồng giữa các dòng: Dòng 1 đè lên Dòng 2 (chuẩn mẫu)
  lineStacking: 'top-on-bottom' | 'bottom-on-top';

  // Hệ thống các lớp viền bế (Multi-layer Strokes)
  strokeLayers: StrokeLayer[];

  lines: TextLine[];
}

export type PresetName = '20-10' | '20-11' | '8-3' | 'khai-truong' | 'sinh-nhat' | 'chia-buon';

export interface Preset {
  name: string;
  strokeLayers: StrokeLayer[];
  lines: TextLine[];
}
