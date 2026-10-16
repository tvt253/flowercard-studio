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

export interface CardConfig {
  templateId: 'ribbon-red' | 'ribbon-gold' | 'fan-pink' | 'cloud-mint' | 'oval-mourning' | 'custom-upload';
  customBgUrl: string | null;
  scalePercent: number;
  copiesPerPage: 1 | 2 | 3 | 4;
  showCutLines: boolean;
  lines: TextLine[];
}

export type PresetName = '20-10' | '20-11' | '8-3' | 'khai-truong' | 'sinh-nhat' | 'chia-buon';

export interface Preset {
  name: string;
  templateId: CardConfig['templateId'];
  lines: TextLine[];
}
