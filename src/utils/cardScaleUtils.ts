import { CardConfig, StrokeLayer } from '../types/card';
import { applyTextCase } from '../store/useCardStore';

let canvas2dContext: CanvasRenderingContext2D | null = null;
const textWidthCache = new Map<string, number>();

/**
 * Đo chiều rộng thực tế của chuỗi ký tự theo font chữ và cỡ chữ
 */
export function measureTextWidth(
  text: string,
  fontFamily: string,
  fontSize: number,
  fontWeight: string = 'normal',
  letterSpacing: number = 0
): number {
  if (!text) return 0;

  const cacheKey = `${text}_${fontFamily}_${fontSize}_${fontWeight}_${letterSpacing}`;
  const cached = textWidthCache.get(cacheKey);
  if (cached !== undefined) return cached;

  let calculatedWidth = 0;

  // 1. Thử dùng Canvas 2D để đo chính xác theo font engine của trình duyệt
  if (typeof document !== 'undefined') {
    try {
      if (!canvas2dContext) {
        const canvas = document.createElement('canvas');
        canvas2dContext = canvas.getContext('2d');
      }
      if (canvas2dContext) {
        canvas2dContext.font = `${fontWeight || 'normal'} ${fontSize}px "${fontFamily}", sans-serif`;
        const metrics = canvas2dContext.measureText(text);
        if (metrics && metrics.width > 0) {
          calculatedWidth = metrics.width + Math.max(0, text.length - 1) * letterSpacing;
        }
      }
    } catch {
      // Bỏ qua nếu có lỗi DOM canvas
    }
  }

  // 2. Thuật toán dự phòng (Heuristic estimation) phân tích từng ký tự nếu canvas không có
  if (calculatedWidth === 0) {
    let widthRatioSum = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === ' ' || ch === '\t') {
        widthRatioSum += 0.28;
      } else if (/[mwWM_@%&]/.test(ch)) {
        widthRatioSum += 0.85;
      } else if (/[ijltI1!|:;.,'"`]/.test(ch)) {
        widthRatioSum += 0.28;
      } else if (/[A-Z]/.test(ch)) {
        widthRatioSum += 0.72;
      } else if (/[0-9]/.test(ch)) {
        widthRatioSum += 0.58;
      } else {
        widthRatioSum += 0.52;
      }
    }

    const isCondensed = ['Oswald', 'Alegreya SC', 'Playfair Display'].some((f) =>
      fontFamily.includes(f)
    );
    const isCursive = ['Charm', 'Dancing Script', 'Great Vibes', 'Alex Brush'].some((f) =>
      fontFamily.includes(f)
    );
    const fontMultiplier = isCondensed ? 0.88 : isCursive ? 0.95 : 1.0;
    calculatedWidth = widthRatioSum * fontSize * fontMultiplier + Math.max(0, text.length - 1) * letterSpacing;
  }

  // Lưu cache để tăng tốc các lần render tiếp theo (tối đa 500 mục)
  if (textWidthCache.size > 500) {
    const firstKey = textWidthCache.keys().next().value;
    if (firstKey) textWidthCache.delete(firstKey);
  }
  textWidthCache.set(cacheKey, calculatedWidth);

  return calculatedWidth;
}

/**
 * Tự động tính toán cỡ chữ vừa khít với chiều ngang khung thiệp (~780px trên viewBox 1000)
 */
export function calculateAutoFitFontSize(
  text: string,
  fontFamily: string,
  currentFontSize: number,
  fontWeight: string = 'bold',
  letterSpacing: number = 0,
  targetWidth: number = 780
): number {
  if (!text || !text.trim()) return currentFontSize;
  const measured = measureTextWidth(text, fontFamily, currentFontSize, fontWeight, letterSpacing);
  if (measured <= 0) return currentFontSize;
  const ratio = targetWidth / measured;
  const idealSize = Math.round(currentFontSize * ratio);
  return Math.max(26, Math.min(105, idealSize));
}

export interface CardMetrics {
  isSingleLine: boolean;
  maxLineWidth: number;
  contentHeight: number;
  centerY: number;
  cloudScale: number;
  ovalTextScale: number;
}

/**
 * Tính toán tỷ lệ auto-scale để nội dung thiệp (text + strokes)
 * luôn lấp đầy ~95% chiều rộng khổ giấy và căn giữa hoàn hảo
 */
export function calculateCardMetrics(config: CardConfig): CardMetrics {
  const isOval = config.styleType === 'oval-red' || config.styleType === 'oval-black';
  const isSingleLine = config.lines.length === 1;

  // Lớp viền lớn nhất của kiểu đám mây
  const activeLayers: StrokeLayer[] = (config.strokeLayers || [])
    .filter((layer) => layer.enabled && layer.width > 0)
    .sort((a, b) => b.width - a.width);
  const maxLayerWidth = isOval ? 0 : (activeLayers[0]?.width || config.outerStrokeWidth || 130);

  // 1. TÍNH TOÁN CHIỀU RỘNG TỪNG DÒNG (Bao gồm cả viền ngoài cùng của chữ)
  const lineWidths = config.lines.map((line) => {
    const fontFamily = line.fontFamily || config.globalFontFamily || 'Charm';
    const displayText = applyTextCase(line.text, line.textCase);
    const textWidth = measureTextWidth(
      displayText,
      fontFamily,
      line.fontSize,
      line.fontWeight,
      line.letterSpacing || 0
    );
    return textWidth + maxLayerWidth;
  });

  const maxLineWidth = Math.max(80, ...lineWidths);

  // 2. TÍNH TOÁN VÙNG DỌC (CHIỀU CAO VÀ TÂM DỌC)
  // Độ rộng stroke ở trên và dưới bằng 1.2 lần ở 2 bên
  const verticalStrokeWidth = maxLayerWidth * 1.2;
  const lineTops = config.lines.map(
    (l) => l.offsetY - l.fontSize * 0.5 - verticalStrokeWidth * 0.5
  );
  const lineBottoms = config.lines.map(
    (l) => l.offsetY + l.fontSize * 0.5 + verticalStrokeWidth * 0.5
  );
  const minY = Math.min(...lineTops);
  const maxY = Math.max(...lineBottoms);
  const contentHeight = Math.max(40, maxY - minY);

  // Tâm dọc: nếu 1 dòng thì dùng chính offsetY của dòng đó (hoặc 210), nếu nhiều dòng thì lấy trung bình
  const centerY = isSingleLine
    ? (config.lines[0]?.offsetY ?? 210)
    : (minY + maxY) / 2;

  // 3. TỶ LỆ SCALE TỰ ĐỘNG CHO KIỂU ĐÁM MÂY (CLOUD & CLOUD-SOLID)
  // Kích thước khả dụng an toàn của khung SVG viewBox (1000 x 420):
  // - Bề rộng khả dụng an toàn: 910px (để trống 45px lề trái và phải, viền mây đặc không bao giờ chạm mép hay tràn khung)
  // - Chiều cao khả dụng an toàn: 375px (để trống ~22px lề trên và dưới)
  const targetCloudWidth = 910;
  const maxSafeHeight = 375;

  const targetScaleX = targetCloudWidth / maxLineWidth;
  const maxScaleY = maxSafeHeight / contentHeight;

  // Lấy tỷ lệ scale nhỏ hơn giữa 2 chiều để nội dung luôn fit trọn vẹn 100% trong khung khả dụng
  const rawCloudScale = Math.min(targetScaleX, maxScaleY);

  // Với 1 dòng: cho phép scale lên đến 2.2x để thiệp trải rộng vừa vặn
  // Với 2 dòng trở lên: scale tối đa 1.45x để đảm bảo khối thiệp không chạm viền
  const maxAllowedScale = isSingleLine ? 2.2 : 1.45;
  const minAllowedScale = 0.55;

  const cloudScale = Math.min(maxAllowedScale, Math.max(minAllowedScale, rawCloudScale));

  // 4. TỶ LỆ SCALE TỰ ĐỘNG CHO CHỮ TRONG KHUNG OVAL
  // Trong khung Oval (rx=466, ry=182, bề rộng trong 932px), mở rộng vùng chữ lên ngang 820px
  const textWidthsOnly = config.lines.map((line) => {
    const fontFamily = line.fontFamily || config.globalFontFamily || 'Oswald';
    const displayText = applyTextCase(line.text, line.textCase);
    return measureTextWidth(
      displayText,
      fontFamily,
      line.fontSize,
      line.fontWeight,
      line.letterSpacing || 0
    );
  });
  const maxTextOnlyWidth = Math.max(80, ...textWidthsOnly);
  const targetOvalTextWidth = 820;
  const rawOvalTextScale = targetOvalTextWidth / maxTextOnlyWidth;
  const ovalTextScale = Math.min(
    isSingleLine ? 1.75 : 1.45,
    Math.max(0.68, rawOvalTextScale)
  );

  return {
    isSingleLine,
    maxLineWidth,
    contentHeight,
    centerY,
    cloudScale,
    ovalTextScale,
  };
}

