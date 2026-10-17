import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CardConfig, TextLine, StrokeLayer, PresetName } from '../types/card';

const generateId = () => Math.random().toString(36).substring(2, 9);

function interpolateColor(color1: string, color2: string, factor: number): string {
  const clean1 = color1.startsWith('#') ? color1.slice(1) : color1;
  const clean2 = color2.startsWith('#') ? color2.slice(1) : color2;

  const c1 = parseInt(clean1.length === 3 ? clean1.split('').map((x) => x + x).join('') : clean1, 16);
  const c2 = parseInt(clean2.length === 3 ? clean2.split('').map((x) => x + x).join('') : clean2, 16);

  const r1 = (c1 >> 16) & 255;
  const g1 = (c1 >> 8) & 255;
  const b1 = c1 & 255;

  const r2 = (c2 >> 16) & 255;
  const g2 = (c2 >> 8) & 255;
  const b2 = c2 & 255;

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function applyTextCase(
  text: string,
  textCase: 'uppercase' | 'capitalize' | 'normal' = 'uppercase'
): string {
  if (textCase === 'normal') return text;
  if (textCase === 'capitalize') {
    return text
      .toLowerCase()
      .split(' ')
      .map((w) => (w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
      .join(' ');
  }
  // Mặc định: In hoa toàn bộ (CAPSLOCK)
  return text.toUpperCase();
}

export function generateAutoStrokeLayers(
  count: number,
  outerColor: string,
  innerColor: string,
  maxWidth: number,
  minWidth: number
): StrokeLayer[] {
  if (count <= 1) {
    return [
      { id: 'layer-1', name: 'Lớp viền ngoài', color: outerColor, width: maxWidth, enabled: true },
    ];
  }

  const layers: StrokeLayer[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const color = interpolateColor(outerColor, innerColor, t);
    const width = Math.round(maxWidth - t * (maxWidth - minWidth));
    layers.push({
      id: `layer-${i + 1}`,
      name: i === 0 ? 'Lớp ngoài cùng' : i === count - 1 ? 'Lớp sát chân chữ' : `Lớp viền ${i + 1}`,
      color,
      width,
      enabled: true,
    });
  }
  return layers;
}

const initialOuterColor = '#c81e2b';
const initialInnerColor = '#ffffff';
const initialLayerCount: 4 | 5 | 6 = 5;
const initialOuterWidth = 56;
const initialInnerWidth = 12;

const defaultStrokeLayers = generateAutoStrokeLayers(
  initialLayerCount,
  initialOuterColor,
  initialInnerColor,
  initialOuterWidth,
  initialInnerWidth
);

const defaultLine1: TextLine = {
  id: generateId(),
  text: 'CHÚC MỪNG',
  fontSize: 84,
  offsetY: 146,
  fontWeight: 'bold',
  fontStyle: 'normal',
  letterSpacing: 2,
  textCase: 'uppercase',
};

const defaultLine2: TextLine = {
  id: generateId(),
  text: 'NGÀY PHỤ NỮ VIỆT NAM 20-10',
  fontSize: 56,
  offsetY: 250,
  fontWeight: 'bold',
  fontStyle: 'normal',
  letterSpacing: 1.5,
  textCase: 'uppercase',
};

const defaultConfig: CardConfig = {
  scalePercent: 100, // Kích thước thiệp so với giấy (cho phép chỉnh lên đến 120%)
  copiesPerPage: 2, // Mặc định 2 bản (A4 đứng)
  showCutLines: false,

  styleType: 'cloud',

  // Cài đặt chung đồng nhất
  globalFontFamily: 'Dancing Script',
  globalCurveStrength: 18,
  globalStrokeColor: '#ffffff',
  globalStrokeWidth: 2.5,

  // Cài đặt viền tự động (màu mặt chữ luôn lấy giống outerStrokeColor)
  strokeLayerCount: initialLayerCount,
  outerStrokeWidth: initialOuterWidth,
  innerStrokeWidth: initialInnerWidth,
  outerStrokeColor: initialOuterColor,
  innerStrokeColor: initialInnerColor,

  strokeLayers: defaultStrokeLayers,
  lines: [defaultLine1, defaultLine2],
};

const PRESETS: Record<
  PresetName,
  {
    outerColor: string;
    innerColor: string;
    globalFontFamily: string;
    lines: { text: string; fontSize: number; offsetY: number; fontWeight: 'normal' | 'bold' }[];
  }
> = {
  '20-10': {
    outerColor: '#c81e2b',
    innerColor: '#ffffff',
    globalFontFamily: 'Dancing Script',
    lines: [
      { text: 'CHÚC MỪNG', fontSize: 84, offsetY: 146, fontWeight: 'bold' },
      { text: 'NGÀY PHỤ NỮ VIỆT NAM 20-10', fontSize: 56, offsetY: 250, fontWeight: 'bold' },
    ],
  },
  '20-11': {
    outerColor: '#c81e2b',
    innerColor: '#ffffff',
    globalFontFamily: 'Dancing Script',
    lines: [
      { text: 'CHÚC MỪNG', fontSize: 84, offsetY: 146, fontWeight: 'bold' },
      { text: 'NGÀY NHÀ GIÁO VIỆT NAM 20/11', fontSize: 54, offsetY: 250, fontWeight: 'bold' },
    ],
  },
  '8-3': {
    outerColor: '#c81e2b',
    innerColor: '#ffffff',
    globalFontFamily: 'Dancing Script',
    lines: [
      { text: 'CHÚC MỪNG', fontSize: 84, offsetY: 146, fontWeight: 'bold' },
      { text: 'NGÀY QUỐC TẾ PHỤ NỮ 8-3', fontSize: 56, offsetY: 250, fontWeight: 'bold' },
    ],
  },
  'khai-truong': {
    outerColor: '#b45309',
    innerColor: '#ffffff',
    globalFontFamily: 'Playfair Display',
    lines: [
      { text: 'CHÚC MỪNG', fontSize: 76, offsetY: 146, fontWeight: 'bold' },
      { text: 'KHAI TRƯƠNG HỒNG PHÁT', fontSize: 56, offsetY: 250, fontWeight: 'bold' },
    ],
  },
  'sinh-nhat': {
    outerColor: '#7e22ce',
    innerColor: '#ffffff',
    globalFontFamily: 'Dancing Script',
    lines: [
      { text: 'HAPPY BIRTHDAY', fontSize: 72, offsetY: 146, fontWeight: 'bold' },
      { text: 'CHÚC MỪNG SINH NHẬT', fontSize: 56, offsetY: 250, fontWeight: 'bold' },
    ],
  },
  'chia-buon': {
    outerColor: '#09090b',
    innerColor: '#ffffff',
    globalFontFamily: 'Cormorant Garamond',
    lines: [
      { text: 'THÀNH KÍNH PHÂN ƯU', fontSize: 62, offsetY: 155, fontWeight: 'bold' },
      { text: 'VÔ CÙNG THƯƠNG TIẾC', fontSize: 50, offsetY: 250, fontWeight: 'normal' },
    ],
  },
};

interface CardStore {
  config: CardConfig;
  addLine: () => void;
  removeLine: (id: string) => void;
  updateLine: (id: string, updates: Partial<TextLine>) => void;
  toggleLineTextCase: (id: string) => void;
  updateConfig: (updates: Partial<Omit<CardConfig, 'lines' | 'strokeLayers'>>) => void;
  setCopiesPerPage: (copies: 1 | 2) => void;
  updateGlobalTypography: (updates: {
    globalFontFamily?: string;
    globalCurveStrength?: number;
    globalStrokeColor?: string;
    globalStrokeWidth?: number;
    scalePercent?: number;
  }) => void;
  updateStrokeSettings: (updates: {
    strokeLayerCount?: 4 | 5 | 6;
    outerStrokeWidth?: number;
    innerStrokeWidth?: number;
    outerStrokeColor?: string;
    innerStrokeColor?: string;
  }) => void;
  setQuickColorGroup: (color: string) => void;
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
                text: 'DÒNG CHỮ MỚI',
                fontSize: 50,
                offsetY: 315,
                fontWeight: 'bold',
                fontStyle: 'normal',
                letterSpacing: 1,
                textCase: 'uppercase',
              },
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

      toggleLineTextCase: (id: string) =>
        set((state) => ({
          config: {
            ...state.config,
            lines: state.config.lines.map((l) => {
              if (l.id !== id) return l;
              const currentMode = l.textCase || 'uppercase';
              const nextMode: 'uppercase' | 'capitalize' | 'normal' =
                currentMode === 'uppercase'
                  ? 'capitalize'
                  : currentMode === 'capitalize'
                  ? 'normal'
                  : 'uppercase';
              return {
                ...l,
                textCase: nextMode,
                text: applyTextCase(l.text, nextMode),
              };
            }),
          },
        })),

      updateConfig: (updates: Partial<Omit<CardConfig, 'lines' | 'strokeLayers'>>) =>
        set((state) => ({
          config: { ...state.config, ...updates },
        })),

      setCopiesPerPage: (copies: 1 | 2) =>
        set((state) => ({
          config: {
            ...state.config,
            copiesPerPage: copies,
            scalePercent: 100,
          },
        })),

      updateGlobalTypography: (updates) =>
        set((state) => ({
          config: {
            ...state.config,
            ...updates,
          },
        })),

      updateStrokeSettings: (updates) =>
        set((state) => {
          const newCount = updates.strokeLayerCount ?? state.config.strokeLayerCount;
          const newOuterWidth = updates.outerStrokeWidth ?? state.config.outerStrokeWidth;
          const newInnerWidth = updates.innerStrokeWidth ?? state.config.innerStrokeWidth;
          const newOuterColor = updates.outerStrokeColor ?? state.config.outerStrokeColor;
          const newInnerColor = updates.innerStrokeColor ?? state.config.innerStrokeColor;

          const newLayers = generateAutoStrokeLayers(
            newCount,
            newOuterColor,
            newInnerColor,
            newOuterWidth,
            newInnerWidth
          );

          return {
            config: {
              ...state.config,
              ...updates,
              strokeLayers: newLayers,
            },
          };
        }),

      setQuickColorGroup: (color: string) =>
        set((state) => {
          const newLayers = generateAutoStrokeLayers(
            state.config.strokeLayerCount,
            color,
            state.config.innerStrokeColor,
            state.config.outerStrokeWidth,
            state.config.innerStrokeWidth
          );

          return {
            config: {
              ...state.config,
              outerStrokeColor: color,
              strokeLayers: newLayers,
            },
          };
        }),

      applyPreset: (presetName: PresetName) =>
        set((state) => {
          const preset = PRESETS[presetName];
          if (!preset) return state;

          const newLayers = generateAutoStrokeLayers(
            state.config.strokeLayerCount,
            preset.outerColor,
            preset.innerColor,
            state.config.outerStrokeWidth,
            state.config.innerStrokeWidth
          );

          return {
            config: {
              ...state.config,
              outerStrokeColor: preset.outerColor,
              innerStrokeColor: preset.innerColor,
              globalFontFamily: preset.globalFontFamily,
              strokeLayers: newLayers,
              lines: preset.lines.map((l) => ({
                id: generateId(),
                text: l.text.toUpperCase(),
                fontSize: l.fontSize,
                offsetY: l.offsetY,
                fontWeight: l.fontWeight,
                fontStyle: 'normal' as const,
                letterSpacing: 1.5,
                textCase: 'uppercase' as const,
              })),
            },
          };
        }),

      resetDefault: () =>
        set(() => {
          const newLayers = generateAutoStrokeLayers(
            initialLayerCount,
            initialOuterColor,
            initialInnerColor,
            initialOuterWidth,
            initialInnerWidth
          );
          return {
            config: {
              ...defaultConfig,
              strokeLayers: newLayers,
              lines: [
                { ...defaultLine1, id: generateId() },
                { ...defaultLine2, id: generateId() },
              ],
            },
          };
        }),
    }),
    {
      name: 'flower-card-studio-storage-v10',
      version: 10,
    }
  )
);
