import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CardConfig, TextLine, PresetName } from '../types/card';

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultLine1: TextLine = {
  id: generateId(),
  text: 'Chúc Mừng',
  fontFamily: 'Great Vibes',
  fontSize: 64,
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: '#c41e3a',
  strokeColor: '#ffffff',
  strokeWidth: 3,
  curveType: 'wave',
  curveStrength: 45,
  offsetY: 165,
  letterSpacing: 2,
};

const defaultLine2: TextLine = {
  id: generateId(),
  text: 'Ngày Nhà Giáo Việt Nam 20/11',
  fontFamily: 'Dancing Script',
  fontSize: 52,
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: '#c41e3a',
  strokeColor: '#ffffff',
  strokeWidth: 2,
  curveType: 'wave',
  curveStrength: 45,
  offsetY: 245,
  letterSpacing: 1,
};

const defaultConfig: CardConfig = {
  templateId: 'ribbon-red',
  customBgUrl: null,
  scalePercent: 100,
  copiesPerPage: 2,
  showCutLines: true,
  lines: [defaultLine1, defaultLine2],
};

const PRESETS: Record<PresetName, { templateId: CardConfig['templateId']; lines: Omit<TextLine, 'id'>[] }> = {
  '20-10': {
    templateId: 'ribbon-red',
    lines: [
      { text: 'Chúc Mừng', fontFamily: 'Great Vibes', fontSize: 64, fontWeight: 'normal', fontStyle: 'normal', color: '#c41e3a', strokeColor: '#ffffff', strokeWidth: 3, curveType: 'wave', curveStrength: 45, offsetY: 165, letterSpacing: 2 },
      { text: 'Ngày Phụ Nữ Việt Nam 20/10', fontFamily: 'Dancing Script', fontSize: 48, fontWeight: 'normal', fontStyle: 'normal', color: '#c41e3a', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'wave', curveStrength: 45, offsetY: 245, letterSpacing: 1 },
    ],
  },
  '20-11': {
    templateId: 'ribbon-red',
    lines: [
      { text: 'Chúc Mừng', fontFamily: 'Great Vibes', fontSize: 64, fontWeight: 'normal', fontStyle: 'normal', color: '#c41e3a', strokeColor: '#ffffff', strokeWidth: 3, curveType: 'wave', curveStrength: 45, offsetY: 165, letterSpacing: 2 },
      { text: 'Ngày Nhà Giáo Việt Nam 20/11', fontFamily: 'Dancing Script', fontSize: 48, fontWeight: 'normal', fontStyle: 'normal', color: '#c41e3a', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'wave', curveStrength: 45, offsetY: 245, letterSpacing: 1 },
    ],
  },
  '8-3': {
    templateId: 'fan-pink',
    lines: [
      { text: 'Chúc Mừng', fontFamily: 'Great Vibes', fontSize: 64, fontWeight: 'normal', fontStyle: 'normal', color: '#be185d', strokeColor: '#ffffff', strokeWidth: 3, curveType: 'arc', curveStrength: 40, offsetY: 160, letterSpacing: 2 },
      { text: 'Ngày Quốc Tế Phụ Nữ 8/3', fontFamily: 'Dancing Script', fontSize: 48, fontWeight: 'normal', fontStyle: 'normal', color: '#be185d', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'arc', curveStrength: 30, offsetY: 240, letterSpacing: 1 },
    ],
  },
  'khai-truong': {
    templateId: 'ribbon-gold',
    lines: [
      { text: 'Chúc Mừng', fontFamily: 'Playfair Display', fontSize: 60, fontWeight: 'bold', fontStyle: 'normal', color: '#92400e', strokeColor: '#fef3c7', strokeWidth: 3, curveType: 'wave', curveStrength: 40, offsetY: 165, letterSpacing: 2 },
      { text: 'Khai Trương Thịnh Vượng', fontFamily: 'Playfair Display', fontSize: 48, fontWeight: 'normal', fontStyle: 'normal', color: '#92400e', strokeColor: '#fef3c7', strokeWidth: 2, curveType: 'wave', curveStrength: 40, offsetY: 245, letterSpacing: 1 },
    ],
  },
  'sinh-nhat': {
    templateId: 'cloud-mint',
    lines: [
      { text: 'Happy Birthday', fontFamily: 'Pacifico', fontSize: 58, fontWeight: 'normal', fontStyle: 'normal', color: '#065f46', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'arc', curveStrength: 35, offsetY: 160, letterSpacing: 2 },
      { text: 'Chúc Mừng Sinh Nhật', fontFamily: 'Dancing Script', fontSize: 52, fontWeight: 'normal', fontStyle: 'normal', color: '#065f46', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'arc', curveStrength: 25, offsetY: 240, letterSpacing: 1 },
    ],
  },
  'chia-buon': {
    templateId: 'oval-mourning',
    lines: [
      { text: 'Thành Kính Phân Ưu', fontFamily: 'Cormorant Garamond', fontSize: 56, fontWeight: 'bold', fontStyle: 'italic', color: '#1e293b', strokeColor: '#f8fafc', strokeWidth: 2, curveType: 'arc', curveStrength: 25, offsetY: 165, letterSpacing: 2 },
      { text: 'Vô Cùng Thương Tiếc', fontFamily: 'Cormorant Garamond', fontSize: 46, fontWeight: 'normal', fontStyle: 'italic', color: '#334155', strokeColor: '#f8fafc', strokeWidth: 1, curveType: 'flat', curveStrength: 0, offsetY: 245, letterSpacing: 1 },
    ],
  },
};

interface CardStore {
  config: CardConfig;
  addLine: () => void;
  removeLine: (id: string) => void;
  updateLine: (id: string, updates: Partial<TextLine>) => void;
  updateConfig: (updates: Partial<Omit<CardConfig, 'lines'>>) => void;
  applyPreset: (presetName: PresetName) => void;
  resetDefault: () => void;
}

export const useCardStore = create<CardStore>()(
  persist(
    (set) => ({
      config: defaultConfig,

      addLine: () =>
        set((state) => ({
          config: {
            ...state.config,
            lines: [
              ...state.config.lines,
              {
                id: generateId(),
                text: 'Dòng chữ mới',
                fontFamily: 'Dancing Script',
                fontSize: 48,
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#c41e3a',
                strokeColor: '#ffffff',
                strokeWidth: 2,
                curveType: 'wave',
                curveStrength: 40,
                offsetY: 200,
                letterSpacing: 1,
              } as TextLine,
            ],
          },
        })),

      removeLine: (id: string) =>
        set((state) => ({
          config: {
            ...state.config,
            lines: state.config.lines.filter((l) => l.id !== id),
          },
        })),

      updateLine: (id: string, updates: Partial<TextLine>) =>
        set((state) => ({
          config: {
            ...state.config,
            lines: state.config.lines.map((l) =>
              l.id === id ? { ...l, ...updates } : l
            ),
          },
        })),

      updateConfig: (updates: Partial<Omit<CardConfig, 'lines'>>) =>
        set((state) => ({
          config: { ...state.config, ...updates },
        })),

      applyPreset: (presetName: PresetName) =>
        set((state) => {
          const preset = PRESETS[presetName];
          if (!preset) return state;
          return {
            config: {
              ...state.config,
              templateId: preset.templateId,
              customBgUrl: null,
              lines: preset.lines.map((l) => ({ ...l, id: generateId() })),
            },
          };
        }),

      resetDefault: () =>
        set(() => ({
          config: {
            ...defaultConfig,
            lines: [
              { ...defaultLine1, id: generateId() },
              { ...defaultLine2, id: generateId() },
            ],
          },
        })),
    }),
    {
      name: 'flower-card-studio-storage',
      version: 1,
    }
  )
);
