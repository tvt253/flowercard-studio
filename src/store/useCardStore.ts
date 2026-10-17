import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CardConfig, TextLine, StrokeLayer, PresetName } from '../types/card';

const generateId = () => Math.random().toString(36).substring(2, 9);

// 5 lớp stroke xếp tầng bám sát từng dòng chữ theo mẫu PDF thực tế
const defaultStrokeLayers: StrokeLayer[] = [
  { id: 'layer-1', name: 'Lớp 1 (Đỏ thắm ngoài cùng)', color: '#c81e2b', width: 56, enabled: true },
  { id: 'layer-2', name: 'Lớp 2 (Đỏ tươi)', color: '#e11d48', width: 44, enabled: true },
  { id: 'layer-3', name: 'Lớp 3 (Hồng tươi)', color: '#fb7185', width: 32, enabled: true },
  { id: 'layer-4', name: 'Lớp 4 (Hồng phấn nhạt)', color: '#fecdd3', width: 22, enabled: true },
  { id: 'layer-5', name: 'Lớp 5 (Trắng sát chân chữ)', color: '#ffffff', width: 12, enabled: true },
];

const goldStrokeLayers: StrokeLayer[] = [
  { id: 'layer-1', name: 'Lớp 1 (Nâu đồng ngoài cùng)', color: '#78350f', width: 56, enabled: true },
  { id: 'layer-2', name: 'Lớp 2 (Vàng hổ phách)', color: '#b45309', width: 44, enabled: true },
  { id: 'layer-3', name: 'Lớp 3 (Vàng hoàng kim)', color: '#f59e0b', width: 32, enabled: true },
  { id: 'layer-4', name: 'Lớp 4 (Vàng chanh sáng)', color: '#fef08a', width: 22, enabled: true },
  { id: 'layer-5', name: 'Lớp 5 (Trắng sát chân chữ)', color: '#ffffff', width: 12, enabled: true },
];

const purpleStrokeLayers: StrokeLayer[] = [
  { id: 'layer-1', name: 'Lớp 1 (Tím đậm ngoài cùng)', color: '#581c87', width: 56, enabled: true },
  { id: 'layer-2', name: 'Lớp 2 (Tím hoa cà)', color: '#86198f', width: 44, enabled: true },
  { id: 'layer-3', name: 'Lớp 3 (Hồng tím)', color: '#d946ef', width: 32, enabled: true },
  { id: 'layer-4', name: 'Lớp 4 (Tím phấn nhạt)', color: '#f5d0fe', width: 22, enabled: true },
  { id: 'layer-5', name: 'Lớp 5 (Trắng sát chân chữ)', color: '#ffffff', width: 12, enabled: true },
];

const mourningStrokeLayers: StrokeLayer[] = [
  { id: 'layer-1', name: 'Lớp 1 (Đen tuyền ngoài cùng)', color: '#09090b', width: 54, enabled: true },
  { id: 'layer-2', name: 'Lớp 2 (Xám than)', color: '#27272a', width: 42, enabled: true },
  { id: 'layer-3', name: 'Lớp 3 (Xám bạc)', color: '#71717a', width: 30, enabled: true },
  { id: 'layer-4', name: 'Lớp 4 (Xám khói sáng)', color: '#e4e4e7', width: 20, enabled: true },
  { id: 'layer-5', name: 'Lớp 5 (Trắng sát chân chữ)', color: '#ffffff', width: 10, enabled: true },
];

const defaultLine1: TextLine = {
  id: generateId(),
  text: 'Chúc Mừng',
  fontFamily: 'Dancing Script',
  fontSize: 84,
  fontWeight: 'bold',
  fontStyle: 'normal',
  color: '#c81e2b',
  strokeColor: '#ffffff',
  strokeWidth: 2.5,
  curveType: 'arc',
  curveStrength: 14,
  offsetY: 146,
  letterSpacing: 2,
};

const defaultLine2: TextLine = {
  id: generateId(),
  text: 'Ngày Phụ Nữ Việt Nam 20-10',
  fontFamily: 'Dancing Script',
  fontSize: 56,
  fontWeight: 'bold',
  fontStyle: 'normal',
  color: '#c81e2b',
  strokeColor: '#ffffff',
  strokeWidth: 2,
  curveType: 'flat',
  curveStrength: 0,
  offsetY: 252,
  letterSpacing: 1.5,
};

const defaultConfig: CardConfig = {
  customBgUrl: null,
  scalePercent: 100,
  copiesPerPage: 2,
  showCutLines: true,
  strokeMode: 'per-line',
  lineStacking: 'top-on-bottom',
  strokeLayers: defaultStrokeLayers,
  lines: [defaultLine1, defaultLine2],
};

const PRESETS: Record<PresetName, { strokeLayers: StrokeLayer[]; lines: Omit<TextLine, 'id'>[] }> = {
  '20-10': {
    strokeLayers: defaultStrokeLayers,
    lines: [
      { text: 'Chúc Mừng', fontFamily: 'Dancing Script', fontSize: 84, fontWeight: 'bold', fontStyle: 'normal', color: '#c81e2b', strokeColor: '#ffffff', strokeWidth: 2.5, curveType: 'arc', curveStrength: 14, offsetY: 146, letterSpacing: 2 },
      { text: 'Ngày Phụ Nữ Việt Nam 20-10', fontFamily: 'Dancing Script', fontSize: 56, fontWeight: 'bold', fontStyle: 'normal', color: '#c81e2b', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'flat', curveStrength: 0, offsetY: 252, letterSpacing: 1.5 },
    ],
  },
  '20-11': {
    strokeLayers: defaultStrokeLayers,
    lines: [
      { text: 'Chúc Mừng', fontFamily: 'Dancing Script', fontSize: 84, fontWeight: 'bold', fontStyle: 'normal', color: '#c81e2b', strokeColor: '#ffffff', strokeWidth: 2.5, curveType: 'arc', curveStrength: 14, offsetY: 146, letterSpacing: 2 },
      { text: 'Ngày Nhà Giáo Việt Nam 20/11', fontFamily: 'Dancing Script', fontSize: 54, fontWeight: 'bold', fontStyle: 'normal', color: '#c81e2b', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'flat', curveStrength: 0, offsetY: 252, letterSpacing: 1.2 },
    ],
  },
  '8-3': {
    strokeLayers: defaultStrokeLayers,
    lines: [
      { text: 'Chúc Mừng', fontFamily: 'Dancing Script', fontSize: 84, fontWeight: 'bold', fontStyle: 'normal', color: '#c81e2b', strokeColor: '#ffffff', strokeWidth: 2.5, curveType: 'arc', curveStrength: 14, offsetY: 146, letterSpacing: 2 },
      { text: 'Ngày Quốc Tế Phụ Nữ 8-3', fontFamily: 'Dancing Script', fontSize: 56, fontWeight: 'bold', fontStyle: 'normal', color: '#c81e2b', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'flat', curveStrength: 0, offsetY: 252, letterSpacing: 1.5 },
    ],
  },
  'khai-truong': {
    strokeLayers: goldStrokeLayers,
    lines: [
      { text: 'Chúc Mừng', fontFamily: 'Playfair Display', fontSize: 76, fontWeight: 'bold', fontStyle: 'normal', color: '#78350f', strokeColor: '#ffffff', strokeWidth: 2.5, curveType: 'arc', curveStrength: 14, offsetY: 146, letterSpacing: 2 },
      { text: 'Khai Trương Hồng Phát', fontFamily: 'Playfair Display', fontSize: 56, fontWeight: 'bold', fontStyle: 'normal', color: '#78350f', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'flat', curveStrength: 0, offsetY: 252, letterSpacing: 1.5 },
    ],
  },
  'sinh-nhat': {
    strokeLayers: purpleStrokeLayers,
    lines: [
      { text: 'Happy Birthday', fontFamily: 'Pacifico', fontSize: 72, fontWeight: 'normal', fontStyle: 'normal', color: '#581c87', strokeColor: '#ffffff', strokeWidth: 2.5, curveType: 'arc', curveStrength: 12, offsetY: 146, letterSpacing: 2 },
      { text: 'Chúc Mừng Sinh Nhật', fontFamily: 'Dancing Script', fontSize: 56, fontWeight: 'bold', fontStyle: 'normal', color: '#581c87', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'flat', curveStrength: 0, offsetY: 252, letterSpacing: 1.5 },
    ],
  },
  'chia-buon': {
    strokeLayers: mourningStrokeLayers,
    lines: [
      { text: 'Thành Kính Phân Ưu', fontFamily: 'Cormorant Garamond', fontSize: 62, fontWeight: 'bold', fontStyle: 'italic', color: '#09090b', strokeColor: '#ffffff', strokeWidth: 2, curveType: 'arc', curveStrength: 16, offsetY: 155, letterSpacing: 2 },
      { text: 'Vô Cùng Thương Tiếc', fontFamily: 'Cormorant Garamond', fontSize: 50, fontWeight: 'normal', fontStyle: 'italic', color: '#27272a', strokeColor: '#ffffff', strokeWidth: 1.5, curveType: 'flat', curveStrength: 0, offsetY: 250, letterSpacing: 1.5 },
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
          const lastWidth = count > 0 ? state.config.strokeLayers[count - 1].width : 12;
          const newWidth = Math.max(lastWidth - 8, 4);
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
      name: 'flower-card-studio-storage-v5',
      version: 5,
    }
  )
);
