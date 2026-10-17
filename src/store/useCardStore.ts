import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CardConfig, TextLine, StrokeLayer, PresetName } from '../types/card';

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultStrokeLayers: StrokeLayer[] = [
  { id: 'layer-1', name: 'Lớp 1 (Ngoài cùng)', color: '#d3202a', width: 48, enabled: true },
  { id: 'layer-2', name: 'Lớp 2 (Đỏ hồng)', color: '#f43f5e', width: 36, enabled: true },
  { id: 'layer-3', name: 'Lớp 3 (Hồng tươi)', color: '#fb7185', width: 25, enabled: true },
  { id: 'layer-4', name: 'Lớp 4 (Hồng phấn)', color: '#fecdd3', width: 15, enabled: true },
  { id: 'layer-5', name: 'Lớp 5 (Trắng sát chữ)', color: '#ffffff', width: 7, enabled: true },
];

const goldStrokeLayers: StrokeLayer[] = [
  { id: 'layer-1', name: 'Lớp 1 (Ngoài cùng)', color: '#9a3412', width: 48, enabled: true },
  { id: 'layer-2', name: 'Lớp 2 (Vàng đồng)', color: '#d97706', width: 36, enabled: true },
  { id: 'layer-3', name: 'Lớp 3 (Vàng chanh)', color: '#fde047', width: 25, enabled: true },
  { id: 'layer-4', name: 'Lớp 4 (Kem sáng)', color: '#fef9c3', width: 15, enabled: true },
  { id: 'layer-5', name: 'Lớp 5 (Trắng sát chữ)', color: '#ffffff', width: 7, enabled: true },
];

const purpleStrokeLayers: StrokeLayer[] = [
  { id: 'layer-1', name: 'Lớp 1 (Ngoài cùng)', color: '#6b21a8', width: 48, enabled: true },
  { id: 'layer-2', name: 'Lớp 2 (Tím hoa cà)', color: '#a855f7', width: 36, enabled: true },
  { id: 'layer-3', name: 'Lớp 3 (Hồng tím)', color: '#e879f9', width: 25, enabled: true },
  { id: 'layer-4', name: 'Lớp 4 (Tím phấn nhạt)', color: '#fae8ff', width: 15, enabled: true },
  { id: 'layer-5', name: 'Lớp 5 (Trắng sát chữ)', color: '#ffffff', width: 7, enabled: true },
];

const mourningStrokeLayers: StrokeLayer[] = [
  { id: 'layer-1', name: 'Lớp 1 (Ngoài cùng)', color: '#0f172a', width: 46, enabled: true },
  { id: 'layer-2', name: 'Lớp 2 (Xám đen)', color: '#334155', width: 34, enabled: true },
  { id: 'layer-3', name: 'Lớp 3 (Xám nhạt)', color: '#94a3b8', width: 22, enabled: true },
  { id: 'layer-4', name: 'Lớp 4 (Trắng bạc)', color: '#e2e8f0', width: 13, enabled: true },
  { id: 'layer-5', name: 'Lớp 5 (Trắng sát chữ)', color: '#ffffff', width: 6, enabled: true },
];

const defaultLine1: TextLine = {
  id: generateId(),
  text: 'Chúc Mừng',
  fontFamily: 'Dancing Script',
  fontSize: 78,
  fontWeight: 'bold',
  fontStyle: 'normal',
  color: '#c81e2b',
  strokeColor: '#ffffff',
  strokeWidth: 2,
  curveType: 'arc',
  curveStrength: 16,
  offsetY: 155,
  letterSpacing: 2,
};

const defaultLine2: TextLine = {
  id: generateId(),
  text: 'Ngày Phụ Nữ Việt Nam 20-10',
  fontFamily: 'Dancing Script',
  fontSize: 54,
  fontWeight: 'bold',
  fontStyle: 'normal',
  color: '#c81e2b',
  strokeColor: '#ffffff',
  strokeWidth: 2,
  curveType: 'flat',
  curveStrength: 0,
  offsetY: 268,
  letterSpacing: 1.5,
};

const defaultConfig: CardConfig = {
  customBgUrl: null,
  scalePercent: 100,
  copiesPerPage: 2,
  showCutLines: true,
  envelopePadding: 36,
  fillInnerGaps: true,
  strokeLayers: defaultStrokeLayers,
  lines: [defaultLine1, defaultLine2],
};

const PRESETS: Record<PresetName, { strokeLayers: StrokeLayer[]; lines: Omit<TextLine, 'id'>[] }> = {
  '20-10': {
    strokeLayers: defaultStrokeLayers,
    lines: [
      { text: 'Chúc Mừng', fontFamily: 'Dancing Script', fontSize: 78, fontWeight: 'bold', fontStyle: 'normal', color: '#c81e2b', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'arc', curveStrength: 16, offsetY: 155, letterSpacing: 2 },
      { text: 'Ngày Phụ Nữ Việt Nam 20-10', fontFamily: 'Dancing Script', fontSize: 54, fontWeight: 'bold', fontStyle: 'normal', color: '#c81e2b', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'flat', curveStrength: 0, offsetY: 268, letterSpacing: 1.5 },
    ],
  },
  '20-11': {
    strokeLayers: defaultStrokeLayers,
    lines: [
      { text: 'Chúc Mừng', fontFamily: 'Dancing Script', fontSize: 78, fontWeight: 'bold', fontStyle: 'normal', color: '#c81e2b', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'arc', curveStrength: 16, offsetY: 155, letterSpacing: 2 },
      { text: 'Ngày Nhà Giáo Việt Nam 20/11', fontFamily: 'Dancing Script', fontSize: 52, fontWeight: 'bold', fontStyle: 'normal', color: '#c81e2b', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'flat', curveStrength: 0, offsetY: 268, letterSpacing: 1 },
    ],
  },
  '8-3': {
    strokeLayers: defaultStrokeLayers,
    lines: [
      { text: 'Chúc Mừng', fontFamily: 'Dancing Script', fontSize: 78, fontWeight: 'bold', fontStyle: 'normal', color: '#c81e2b', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'arc', curveStrength: 16, offsetY: 155, letterSpacing: 2 },
      { text: 'Ngày Quốc Tế Phụ Nữ 8-3', fontFamily: 'Dancing Script', fontSize: 54, fontWeight: 'bold', fontStyle: 'normal', color: '#c81e2b', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'flat', curveStrength: 0, offsetY: 268, letterSpacing: 1.5 },
    ],
  },
  'khai-truong': {
    strokeLayers: goldStrokeLayers,
    lines: [
      { text: 'Chúc Mừng', fontFamily: 'Playfair Display', fontSize: 72, fontWeight: 'bold', fontStyle: 'normal', color: '#9a3412', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'arc', curveStrength: 15, offsetY: 155, letterSpacing: 2 },
      { text: 'Khai Trương Hồng Phát', fontFamily: 'Playfair Display', fontSize: 54, fontWeight: 'bold', fontStyle: 'normal', color: '#9a3412', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'flat', curveStrength: 0, offsetY: 268, letterSpacing: 1.5 },
    ],
  },
  'sinh-nhat': {
    strokeLayers: purpleStrokeLayers,
    lines: [
      { text: 'Happy Birthday', fontFamily: 'Pacifico', fontSize: 70, fontWeight: 'normal', fontStyle: 'normal', color: '#6b21a8', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'arc', curveStrength: 15, offsetY: 155, letterSpacing: 2 },
      { text: 'Chúc Mừng Sinh Nhật', fontFamily: 'Dancing Script', fontSize: 54, fontWeight: 'bold', fontStyle: 'normal', color: '#6b21a8', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'flat', curveStrength: 0, offsetY: 268, letterSpacing: 1.5 },
    ],
  },
  'chia-buon': {
    strokeLayers: mourningStrokeLayers,
    lines: [
      { text: 'Thành Kính Phân Ưu', fontFamily: 'Cormorant Garamond', fontSize: 60, fontWeight: 'bold', fontStyle: 'italic', color: '#0f172a', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'arc', curveStrength: 20, offsetY: 165, letterSpacing: 2 },
      { text: 'Vô Cùng Thương Tiếc', fontFamily: 'Cormorant Garamond', fontSize: 48, fontWeight: 'normal', fontStyle: 'italic', color: '#334155', strokeColor: '#ffffff', strokeWidth: 1.5, curveType: 'flat', curveStrength: 0, offsetY: 255, letterSpacing: 1.5 },
    ],
  },
};

interface CardStore {
  config: CardConfig;
  addLine: () => void;
  removeLine: (id: string) => void;
  updateLine: (id: string, updates: Partial<TextLine>) => void;
  updateConfig: (updates: Partial<Omit<CardConfig, 'lines' | 'strokeLayers'>>) => void;
  addStrokeLayer: () => void;
  removeStrokeLayer: (id: string) => void;
  updateStrokeLayer: (id: string, updates: Partial<StrokeLayer>) => void;
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
                fontSize: 50,
                fontWeight: 'bold',
                fontStyle: 'normal',
                color: '#c81e2b',
                strokeColor: '#ffffff',
                strokeWidth: 2,
                curveType: 'flat',
                curveStrength: 0,
                offsetY: 310,
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

      updateConfig: (updates: Partial<Omit<CardConfig, 'lines' | 'strokeLayers'>>) =>
        set((state) => ({
          config: { ...state.config, ...updates },
        })),

      addStrokeLayer: () =>
        set((state) => {
          const count = state.config.strokeLayers.length;
          const lastWidth = count > 0 ? state.config.strokeLayers[count - 1].width : 10;
          const newWidth = Math.max(lastWidth - 6, 4);
          const newLayer: StrokeLayer = {
            id: generateId(),
            name: `Lớp ${count + 1}`,
            color: '#ffffff',
            width: newWidth,
            enabled: true,
          };
          return {
            config: {
              ...state.config,
              strokeLayers: [...state.config.strokeLayers, newLayer],
            },
          };
        }),

      removeStrokeLayer: (id: string) =>
        set((state) => ({
          config: {
            ...state.config,
            strokeLayers: state.config.strokeLayers.filter((l) => l.id !== id),
          },
        })),

      updateStrokeLayer: (id: string, updates: Partial<StrokeLayer>) =>
        set((state) => ({
          config: {
            ...state.config,
            strokeLayers: state.config.strokeLayers.map((l) =>
              l.id === id ? { ...l, ...updates } : l
            ),
          },
        })),

      applyPreset: (presetName: PresetName) =>
        set((state) => {
          const preset = PRESETS[presetName];
          if (!preset) return state;
          return {
            config: {
              ...state.config,
              customBgUrl: null,
              strokeLayers: preset.strokeLayers.map((s) => ({ ...s, id: generateId() })),
              lines: preset.lines.map((l) => ({ ...l, id: generateId() })),
            },
          };
        }),

      resetDefault: () =>
        set(() => ({
          config: {
            ...defaultConfig,
            strokeLayers: defaultStrokeLayers.map((s) => ({ ...s, id: generateId() })),
            lines: [
              { ...defaultLine1, id: generateId() },
              { ...defaultLine2, id: generateId() },
            ],
          },
        })),
    }),
    {
      name: 'flower-card-studio-storage-v3',
      version: 3,
    }
  )
);
