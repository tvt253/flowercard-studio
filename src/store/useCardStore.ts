import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CardConfig, TextLine, StrokeLayer, PresetName, StyleType } from '../types/card';

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
  textCase: 'uppercase' | 'capitalize' | 'normal' = 'capitalize'
): string {
  if (textCase === 'normal') return text;
  if (textCase === 'uppercase') return text.toUpperCase();
  // Mặc định: Viết hoa chữ cái đầu (Title Case giống mẫu thiệp)
  return text
    .toLowerCase()
    .split(' ')
    .map((w) => (w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ');
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
// Cập nhật thông số mặc định theo yêu cầu: ngoài cùng 130, sát chữ 30
const initialOuterWidth = 130;
const initialInnerWidth = 30;

const defaultStrokeLayers = generateAutoStrokeLayers(
  initialLayerCount,
  initialOuterColor,
  initialInnerColor,
  initialOuterWidth,
  initialInnerWidth
);

// Mẫu chữ mặc định: Charm (Thư pháp), kích thước chữ 70px
const defaultLine1: TextLine = {
  id: generateId(),
  text: 'Chúc Mừng',
  fontSize: 70,
  offsetY: 155,
  fontWeight: 'bold',
  fontStyle: 'normal',
  letterSpacing: 2,
  textCase: 'capitalize',
};

const defaultLine2: TextLine = {
  id: generateId(),
  text: 'Ngày Phụ Nữ Việt Nam 20-10',
  fontSize: 70,
  offsetY: 260,
  fontWeight: 'bold',
  fontStyle: 'normal',
  letterSpacing: 1.5,
  textCase: 'capitalize',
};

const defaultConfig: CardConfig = {
  scalePercent: 100, // Kích thước thiệp so với giấy (cho phép chỉnh lên đến 120%)
  copiesPerPage: 2, // Mặc định 2 bản (A4 đứng)
  showCutLines: false,

  styleType: 'cloud',

  // Cài đặt chung đồng nhất: Charm là font thư pháp giống file mẫu nhất
  globalFontFamily: 'Charm',
  globalCurveStrength: 18,
  globalStrokeColor: '#ffffff',
  globalStrokeWidth: 2.5,

  // Cài đặt viền tự động: viền ngoài 130px, viền sát chữ 30px
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
    globalFontFamily: 'Charm',
    lines: [
      { text: 'Chúc Mừng', fontSize: 70, offsetY: 155, fontWeight: 'bold' },
      { text: 'Ngày Phụ Nữ Việt Nam 20-10', fontSize: 70, offsetY: 260, fontWeight: 'bold' },
    ],
  },
  '20-11': {
    outerColor: '#c81e2b',
    innerColor: '#ffffff',
    globalFontFamily: 'Charm',
    lines: [
      { text: 'Chúc Mừng', fontSize: 70, offsetY: 155, fontWeight: 'bold' },
      { text: 'Ngày Nhà Giáo Việt Nam 20/11', fontSize: 70, offsetY: 260, fontWeight: 'bold' },
    ],
  },
  '8-3': {
    outerColor: '#c81e2b',
    innerColor: '#ffffff',
    globalFontFamily: 'Charm',
    lines: [
      { text: 'Chúc Mừng', fontSize: 70, offsetY: 155, fontWeight: 'bold' },
      { text: 'Ngày Quốc Tế Phụ Nữ 8-3', fontSize: 70, offsetY: 260, fontWeight: 'bold' },
    ],
  },
  'khai-truong': {
    outerColor: '#b45309',
    innerColor: '#ffffff',
    globalFontFamily: 'Playfair Display',
    lines: [
      { text: 'Chúc Mừng', fontSize: 70, offsetY: 155, fontWeight: 'bold' },
      { text: 'Khai Trương Hồng Phát', fontSize: 70, offsetY: 260, fontWeight: 'bold' },
    ],
  },
  'sinh-nhat': {
    outerColor: '#7e22ce',
    innerColor: '#ffffff',
    globalFontFamily: 'Charm',
    lines: [
      { text: 'Happy Birthday', fontSize: 70, offsetY: 155, fontWeight: 'bold' },
      { text: 'Chúc Mừng Sinh Nhật', fontSize: 70, offsetY: 260, fontWeight: 'bold' },
    ],
  },
  'chia-buon': {
    outerColor: '#09090b',
    innerColor: '#ffffff',
    globalFontFamily: 'Cormorant Garamond',
    lines: [
      { text: 'Thành Kính Phân Ưu', fontSize: 70, offsetY: 155, fontWeight: 'bold' },
      { text: 'Vô Cùng Thương Tiếc', fontSize: 70, offsetY: 260, fontWeight: 'normal' },
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
  setStyleType: (style: StyleType) => void;
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
                text: 'Dòng Chữ Mới',
                fontSize: 70,
                offsetY: 315,
                fontWeight: 'bold',
                fontStyle: 'normal',
                letterSpacing: 1.5,
                textCase: 'capitalize',
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
              const currentMode = l.textCase || 'capitalize';
              // Thứ tự chuyển: Viết hoa đầu từ (giống mẫu) -> In hoa toàn bộ -> Thường
              const nextMode: 'uppercase' | 'capitalize' | 'normal' =
                currentMode === 'capitalize'
                  ? 'uppercase'
                  : currentMode === 'uppercase'
                  ? 'normal'
                  : 'capitalize';
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

      setStyleType: (style: StyleType) =>
        set((state) => {
          if (style === 'oval-red') {
            return {
              config: {
                ...state.config,
                styleType: 'oval-red',
                outerStrokeColor: '#dc2626',
                globalFontFamily: 'Playfair Display',
                globalCurveStrength: 0,
                lines: [
                  {
                    id: generateId(),
                    text: 'GIA ĐÌNH A BÌNH',
                    fontSize: 70,
                    offsetY: 165,
                    fontWeight: 'bold',
                    fontStyle: 'normal',
                    letterSpacing: 2,
                    textCase: 'uppercase',
                  },
                  {
                    id: generateId(),
                    text: 'CHÚC MỪNG KHAI TRƯƠNG',
                    fontSize: 70,
                    offsetY: 265,
                    fontWeight: 'bold',
                    fontStyle: 'normal',
                    letterSpacing: 1.5,
                    textCase: 'uppercase',
                  },
                ],
              },
            };
          } else if (style === 'oval-black') {
            return {
              config: {
                ...state.config,
                styleType: 'oval-black',
                outerStrokeColor: '#09090b',
                globalFontFamily: 'Playfair Display',
                globalCurveStrength: 0,
                lines: [
                  {
                    id: generateId(),
                    text: 'ANH CHỊ EM CON CẬU',
                    fontSize: 70,
                    offsetY: 165,
                    fontWeight: 'bold',
                    fontStyle: 'normal',
                    letterSpacing: 2,
                    textCase: 'uppercase',
                  },
                  {
                    id: generateId(),
                    text: 'VÔ CÙNG THƯƠNG TIẾC',
                    fontSize: 70,
                    offsetY: 265,
                    fontWeight: 'bold',
                    fontStyle: 'normal',
                    letterSpacing: 1.5,
                    textCase: 'uppercase',
                  },
                ],
              },
            };
          } else {
            // Style đám mây (cloud)
            const newLayers = generateAutoStrokeLayers(
              state.config.strokeLayerCount,
              '#c81e2b',
              '#ffffff',
              130,
              30
            );
            return {
              config: {
                ...state.config,
                styleType: 'cloud',
                outerStrokeColor: '#c81e2b',
                globalFontFamily: 'Charm',
                globalCurveStrength: 18,
                strokeLayers: newLayers,
                lines: [
                  {
                    id: generateId(),
                    text: 'Chúc Mừng',
                    fontSize: 70,
                    offsetY: 155,
                    fontWeight: 'bold',
                    fontStyle: 'normal',
                    letterSpacing: 2,
                    textCase: 'capitalize',
                  },
                  {
                    id: generateId(),
                    text: 'Ngày Phụ Nữ Việt Nam 20-10',
                    fontSize: 70,
                    offsetY: 260,
                    fontWeight: 'bold',
                    fontStyle: 'normal',
                    letterSpacing: 1.5,
                    textCase: 'capitalize',
                  },
                ],
              },
            };
          }
        }),

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
                text: l.text,
                fontSize: l.fontSize,
                offsetY: l.offsetY,
                fontWeight: l.fontWeight,
                fontStyle: 'normal' as const,
                letterSpacing: 1.5,
                textCase: 'capitalize' as const,
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
      name: 'flower-card-studio-storage-v12',
      version: 12,
    }
  )
);
