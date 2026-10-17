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

  // Dáng tổng thể của thiệp (Envelope Shape)
  envelopePadding: number; // Độ phồng của dáng tổng thể (10 - 70px, mặc định 35)
  fillInnerGaps: boolean; // Lấp đầy khoảng trống giữa các dòng tạo dáng liền khối

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
