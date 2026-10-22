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
  scalePercent: 90, // Kích thước mặc định 90% chiều rộng khổ giấy và căn giữa
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
    ovalBgColor?: string;
    ovalBorderColor?: string;
    ovalTextColor?: string;
    lines: {
      text: string;
      fontSize: number;
      offsetY: number;
      fontWeight: 'normal' | 'bold';
      textCase?: 'uppercase' | 'capitalize' | 'normal';
      fontFamily?: string;
    }[];
  }
> = {
  // === NHÓM ĐÁM MÂY (CLOUD) ===
  '20-10': {
    outerColor: '#c81e2b',
    innerColor: '#ffffff',
    globalFontFamily: 'Charm',
    lines: [
      { text: 'Chúc Mừng', fontSize: 72, offsetY: 155, fontWeight: 'bold', textCase: 'capitalize' },
      { text: 'Ngày Phụ Nữ Việt Nam 20-10', fontSize: 70, offsetY: 260, fontWeight: 'bold', textCase: 'capitalize' },
    ],
  },
  '20-11': {
    outerColor: '#c81e2b',
    innerColor: '#ffffff',
    globalFontFamily: 'Charm',
    lines: [
      { text: 'Chúc Mừng', fontSize: 72, offsetY: 155, fontWeight: 'bold', textCase: 'capitalize' },
      { text: 'Ngày Nhà Giáo Việt Nam 20/11', fontSize: 66, offsetY: 260, fontWeight: 'bold', textCase: 'capitalize' },
    ],
  },
  '8-3': {
    outerColor: '#c81e2b',
    innerColor: '#ffffff',
    globalFontFamily: 'Charm',
    lines: [
      { text: 'Chúc Mừng', fontSize: 74, offsetY: 155, fontWeight: 'bold', textCase: 'capitalize' },
      { text: 'Ngày Quốc Tế Phụ Nữ 8-3', fontSize: 78, offsetY: 260, fontWeight: 'bold', textCase: 'capitalize' },
    ],
  },
  'khai-truong': {
    outerColor: '#c81e2b', // Khai trương dùng màu đỏ như các mẫu khác
    innerColor: '#ffffff',
    globalFontFamily: 'Charm',
    lines: [
      { text: 'Chúc Mừng', fontSize: 76, offsetY: 155, fontWeight: 'bold', textCase: 'capitalize' },
      { text: 'Khai Trương Hồng Phát', fontSize: 82, offsetY: 260, fontWeight: 'bold', textCase: 'capitalize' },
    ],
  },
  'sinh-nhat': {
    outerColor: '#db2777', // Chuyển sang dùng màu hồng
    innerColor: '#ffffff',
    globalFontFamily: 'Charm',
    lines: [
      { text: 'Happy Birthday', fontSize: 78, offsetY: 155, fontWeight: 'bold', textCase: 'capitalize' },
      { text: 'Chúc Mừng Sinh Nhật', fontSize: 84, offsetY: 260, fontWeight: 'bold', textCase: 'capitalize' },
    ],
  },
  'mung-cuoi': {
    outerColor: '#c81e2b',
    innerColor: '#ffffff',
    globalFontFamily: 'Charm',
    lines: [
      { text: 'Chúc Mừng', fontSize: 78, offsetY: 155, fontWeight: 'bold', textCase: 'capitalize' },
      { text: 'Trăm Năm Hạnh Phúc', fontSize: 86, offsetY: 260, fontWeight: 'bold', textCase: 'capitalize' },
    ],
  },

  // === NHÓM OVAL ĐỎ (KHAI TRƯƠNG / CHÚC MỪNG) ===
  'oval-khai-truong': {
    outerColor: '#dc2626',
    innerColor: '#ffffff',
    ovalBgColor: '#dc2626',
    ovalBorderColor: '#dc2626',
    ovalTextColor: '#ffffff',
    globalFontFamily: 'Oswald',
    lines: [
      { text: 'CHÚC MỪNG', fontSize: 82, offsetY: 150, fontWeight: 'bold', textCase: 'uppercase' },
      { text: 'KHAI TRƯƠNG HỒNG PHÁT', fontSize: 88, offsetY: 260, fontWeight: 'bold', textCase: 'uppercase' },
    ],
  },
  'oval-khanh-thanh': {
    outerColor: '#dc2626',
    innerColor: '#ffffff',
    ovalBgColor: '#dc2626',
    ovalBorderColor: '#dc2626',
    ovalTextColor: '#ffffff',
    globalFontFamily: 'Oswald',
    lines: [
      { text: 'CHÚC MỪNG', fontSize: 84, offsetY: 150, fontWeight: 'bold', textCase: 'uppercase' },
      { text: 'LỄ KHÁNH THÀNH', fontSize: 94, offsetY: 260, fontWeight: 'bold', textCase: 'uppercase' },
    ],
  },
  'oval-tan-gia': {
    outerColor: '#dc2626',
    innerColor: '#ffffff',
    ovalBgColor: '#dc2626',
    ovalBorderColor: '#dc2626',
    ovalTextColor: '#ffffff',
    globalFontFamily: 'Marcellus',
    lines: [
      { text: 'CHÚC MỪNG', fontSize: 82, offsetY: 150, fontWeight: 'bold', textCase: 'uppercase' },
      { text: 'TÂN GIA PHÁT TÀI', fontSize: 92, offsetY: 260, fontWeight: 'bold', textCase: 'uppercase' },
    ],
  },
  'oval-20-10': {
    outerColor: '#dc2626',
    innerColor: '#ffffff',
    ovalBgColor: '#dc2626',
    ovalBorderColor: '#dc2626',
    ovalTextColor: '#ffffff',
    globalFontFamily: 'Oswald',
    lines: [
      { text: 'CHÚC MỪNG', fontSize: 76, offsetY: 150, fontWeight: 'bold', textCase: 'uppercase' },
      { text: 'NGÀY PHỤ NỮ VIỆT NAM 20-10', fontSize: 76, offsetY: 260, fontWeight: 'bold', textCase: 'uppercase' },
    ],
  },
  'oval-20-11': {
    outerColor: '#dc2626',
    innerColor: '#ffffff',
    ovalBgColor: '#dc2626',
    ovalBorderColor: '#dc2626',
    ovalTextColor: '#ffffff',
    globalFontFamily: 'Oswald',
    lines: [
      { text: 'CHÚC MỪNG', fontSize: 76, offsetY: 150, fontWeight: 'bold', textCase: 'uppercase' },
      { text: 'NGÀY NHÀ GIÁO VIỆT NAM 20-11', fontSize: 70, offsetY: 260, fontWeight: 'bold', textCase: 'uppercase' },
    ],
  },
  'oval-8-3': {
    outerColor: '#dc2626',
    innerColor: '#ffffff',
    ovalBgColor: '#dc2626',
    ovalBorderColor: '#dc2626',
    ovalTextColor: '#ffffff',
    globalFontFamily: 'Oswald',
    lines: [
      { text: 'CHÚC MỪNG', fontSize: 76, offsetY: 150, fontWeight: 'bold', textCase: 'uppercase' },
      { text: 'NGÀY QUỐC TẾ PHỤ NỮ 8-3', fontSize: 78, offsetY: 260, fontWeight: 'bold', textCase: 'uppercase' },
    ],
  },

  // === NHÓM OVAL TANG LỄ & TÂM LINH (OVAL ĐEN / TƯỞNG NIỆM) ===
  'chia-buon': {
    outerColor: '#09090b',
    innerColor: '#ffffff',
    ovalBgColor: '#09090b',
    ovalBorderColor: '#09090b',
    ovalTextColor: '#ffffff',
    globalFontFamily: 'Oswald',
    lines: [
      { text: 'THÀNH KÍNH PHÂN ƯU', fontSize: 84, offsetY: 150, fontWeight: 'bold', textCase: 'uppercase' },
      { text: 'VÔ CÙNG THƯƠNG TIẾC', fontSize: 84, offsetY: 260, fontWeight: 'bold', textCase: 'uppercase' },
    ],
  },
  'kinh-dang': {
    // Mẫu Kính dâng: nền đỏ chữ vàng đậm
    outerColor: '#b91c1c',
    innerColor: '#ffffff',
    ovalBgColor: '#b91c1c',
    ovalBorderColor: '#b91c1c',
    ovalTextColor: '#fbbf24',
    globalFontFamily: 'Oswald',
    lines: [
      { text: 'KÍNH DÂNG', fontSize: 90, offsetY: 150, fontWeight: 'bold', textCase: 'uppercase' },
      { text: 'ĐỨC PHẬT TỪ BI', fontSize: 96, offsetY: 260, fontWeight: 'bold', textCase: 'uppercase' },
    ],
  },
  'kinh-vieng': {
    // Mẫu Kính viếng: nền trắng chữ đen
    outerColor: '#09090b',
    innerColor: '#ffffff',
    ovalBgColor: '#ffffff',
    ovalBorderColor: '#09090b',
    ovalTextColor: '#09090b',
    globalFontFamily: 'Oswald',
    lines: [
      { text: 'KÍNH VIẾNG', fontSize: 92, offsetY: 150, fontWeight: 'bold', textCase: 'uppercase' },
      { text: 'VÔ CÙNG THƯƠNG TIẾC', fontSize: 86, offsetY: 260, fontWeight: 'bold', textCase: 'uppercase' },
    ],
  },
  'cong-giao': {
    outerColor: '#581c87',
    innerColor: '#ffffff',
    ovalBgColor: '#581c87',
    ovalBorderColor: '#581c87',
    ovalTextColor: '#ffffff',
    globalFontFamily: 'Cormorant Garamond',
    lines: [
      { text: 'THÀNH KÍNH PHÂN ƯU', fontSize: 82, offsetY: 145, fontWeight: 'bold', textCase: 'uppercase' },
      { text: 'NGUYỆN XIN CHÚA ĐÓN NHẬN LINH HỒN', fontSize: 58, offsetY: 265, fontWeight: 'bold', textCase: 'uppercase' },
    ],
  },
  'ngan-thu': {
    outerColor: '#09090b',
    innerColor: '#ffffff',
    ovalBgColor: '#09090b',
    ovalBorderColor: '#09090b',
    ovalTextColor: '#ffffff',
    globalFontFamily: 'Alegreya SC',
    lines: [
      { text: 'KÍNH VIẾNG HƯƠNG HỒN', fontSize: 82, offsetY: 150, fontWeight: 'bold', textCase: 'uppercase' },
      { text: 'NGÀN THU YÊN NGHỈ', fontSize: 86, offsetY: 260, fontWeight: 'bold', textCase: 'uppercase' },
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
  setCopiesPerPage: (copies: 1 | 2 | 3) => void;
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
        set((state) => {
          if (state.config.lines.length === 1 && Math.abs(state.config.lines[0].offsetY - 210) < 25) {
            // Khi đang có 1 dòng nằm chính giữa (210), chuyển dòng 1 lên trên (155) và thêm dòng 2 ở dưới (260) chuẩn 2 dòng
            return {
              config: {
                ...state.config,
                lines: [
                  { ...state.config.lines[0], offsetY: 155 },
                  {
                    id: generateId(),
                    text: 'Dòng Chữ Mới',
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
          return {
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
          };
        }),

      removeLine: (id: string) =>
        set((state) => {
          const remainingLines = state.config.lines.filter((l) => l.id !== id);
          // Nếu xóa chỉ còn đúng 1 dòng duy nhất và dòng đó đang lệch trên (< 180), tự động căn giữa thiệp (210)
          const updatedLines =
            remainingLines.length === 1 && remainingLines[0].offsetY < 180
              ? [{ ...remainingLines[0], offsetY: 210 }]
              : remainingLines;
          return {
            config: {
              ...state.config,
              lines: updatedLines,
            },
          };
        }),

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
                ovalBgColor: '#dc2626',
                ovalBorderColor: '#dc2626',
                ovalTextColor: '#ffffff',
                globalFontFamily: 'Oswald',
                globalCurveStrength: 0,
                lines: [
                  {
                    id: generateId(),
                    text: 'CHÚC MỪNG',
                    fontSize: 70,
                    offsetY: 155,
                    fontWeight: 'bold',
                    fontStyle: 'normal',
                    letterSpacing: 2,
                    textCase: 'uppercase',
                  },
                  {
                    id: generateId(),
                    text: 'KHAI TRƯƠNG HỒNG PHÁT',
                    fontSize: 70,
                    offsetY: 260,
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
                ovalBgColor: '#09090b',
                ovalBorderColor: '#09090b',
                ovalTextColor: '#ffffff',
                globalFontFamily: 'Oswald',
                globalCurveStrength: 0,
                lines: [
                  {
                    id: generateId(),
                    text: 'THÀNH KÍNH PHÂN ƯU',
                    fontSize: 70,
                    offsetY: 155,
                    fontWeight: 'bold',
                    fontStyle: 'normal',
                    letterSpacing: 2,
                    textCase: 'uppercase',
                  },
                  {
                    id: generateId(),
                    text: 'VÔ CÙNG THƯƠNG TIẾC',
                    fontSize: 70,
                    offsetY: 260,
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
            const outerWidth = state.config.outerStrokeWidth || 130;
            const innerWidth = state.config.innerStrokeWidth || 30;
            const layerCount = state.config.strokeLayerCount || 5;
            const newLayers = generateAutoStrokeLayers(
              layerCount,
              '#c81e2b',
              '#ffffff',
              outerWidth,
              innerWidth
            );
            return {
              config: {
                ...state.config,
                styleType: 'cloud',
                outerStrokeColor: '#c81e2b',
                innerStrokeColor: '#ffffff',
                outerStrokeWidth: outerWidth,
                innerStrokeWidth: innerWidth,
                strokeLayerCount: layerCount,
                ovalBgColor: undefined,
                ovalBorderColor: undefined,
                ovalTextColor: undefined,
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

      setCopiesPerPage: (copies: 1 | 2 | 3) =>
        set((state) => {
          let updatedLines = state.config.lines;
          // Khi chuyển sang 3 bản (dành cho thiệp 1 dòng), nếu chỉ có 1 dòng thì đảm bảo nằm giữa thiệp (210)
          if (copies === 3 && updatedLines.length === 1 && updatedLines[0].offsetY < 180) {
            updatedLines = [{ ...updatedLines[0], offsetY: 210 }];
          }
          return {
            config: {
              ...state.config,
              copiesPerPage: copies,
              scalePercent: 90, // Kích thước mặc định là 90% chiều rộng khổ giấy và căn giữa
              lines: updatedLines,
            },
          };
        }),

      updateGlobalTypography: (updates) =>
        set((state) => ({
          config: {
            ...state.config,
            ...updates,
          },
        })),

      updateStrokeSettings: (updates) =>
        set((state) => {
          const newCount = updates.strokeLayerCount ?? state.config.strokeLayerCount ?? 5;
          let newOuterWidth = updates.outerStrokeWidth ?? state.config.outerStrokeWidth ?? 130;
          let newInnerWidth = updates.innerStrokeWidth ?? state.config.innerStrokeWidth ?? 30;
          const newOuterColor = updates.outerStrokeColor ?? state.config.outerStrokeColor ?? '#c81e2b';
          const newInnerColor = updates.innerStrokeColor ?? state.config.innerStrokeColor ?? '#ffffff';

          newOuterWidth = Math.max(20, Math.min(150, newOuterWidth));
          newInnerWidth = Math.max(2, Math.min(newOuterWidth - 5, newInnerWidth));

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
              outerStrokeWidth: newOuterWidth,
              innerStrokeWidth: newInnerWidth,
              strokeLayerCount: newCount,
              outerStrokeColor: newOuterColor,
              innerStrokeColor: newInnerColor,
              strokeLayers: newLayers,
            },
          };
        }),

      setQuickColorGroup: (color: string) =>
        set((state) => {
          const outerWidth = state.config.outerStrokeWidth || 130;
          const innerWidth = state.config.innerStrokeWidth || 30;
          const layerCount = state.config.strokeLayerCount || 5;
          const innerColor = state.config.innerStrokeColor || '#ffffff';

          const newLayers = generateAutoStrokeLayers(
            layerCount,
            color,
            innerColor,
            outerWidth,
            innerWidth
          );

          return {
            config: {
              ...state.config,
              outerStrokeColor: color,
              ovalBgColor: state.config.styleType !== 'cloud' ? color : state.config.ovalBgColor,
              ovalBorderColor: state.config.styleType !== 'cloud' ? color : state.config.ovalBorderColor,
              strokeLayers: newLayers,
            },
          };
        }),

      applyPreset: (presetName: PresetName) =>
        set((state) => {
          const preset = PRESETS[presetName];
          if (!preset) return state;

          const outerWidth = state.config.outerStrokeWidth || 130;
          const innerWidth = state.config.innerStrokeWidth || 30;
          const layerCount = state.config.strokeLayerCount || 5;

          const newLayers = generateAutoStrokeLayers(
            layerCount,
            preset.outerColor,
            preset.innerColor,
            outerWidth,
            innerWidth
          );

          return {
            config: {
              ...state.config,
              outerStrokeColor: preset.outerColor,
              innerStrokeColor: preset.innerColor,
              outerStrokeWidth: outerWidth,
              innerStrokeWidth: innerWidth,
              strokeLayerCount: layerCount,
              globalFontFamily: preset.globalFontFamily,
              ovalBgColor: preset.ovalBgColor,
              ovalBorderColor: preset.ovalBorderColor,
              ovalTextColor: preset.ovalTextColor,
              strokeLayers: newLayers,
              lines: preset.lines.map((l) => ({
                id: generateId(),
                text: l.text,
                fontSize: l.fontSize,
                offsetY: l.offsetY,
                fontWeight: l.fontWeight,
                fontStyle: 'normal' as const,
                letterSpacing: 1.5,
                textCase: l.textCase || ('capitalize' as const),
                fontFamily: l.fontFamily,
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
      name: 'flower-card-studio-storage-v14',
      version: 14,
    }
  )
);
