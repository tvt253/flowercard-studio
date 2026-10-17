import React from 'react';
import { CardConfig, TextLine, StrokeLayer } from '../types/card';

interface SvgCardCanvasProps {
  config: CardConfig;
  uid: string;
}

function calculatePathD(line: TextLine): string {
  const y = line.offsetY;
  const c = line.curveStrength;

  if (line.curveType === 'wave') {
    return `M 60,${y + c * 0.55} C 340,${y - c * 1.85} 660,${y + c * 1.85} 940,${y - c * 0.55}`;
  } else if (line.curveType === 'arc') {
    return `M 60,${y + c * 0.5} Q 500,${y - c * 1.7} 940,${y + c * 0.5}`;
  } else {
    return `M 60,${y} L 940,${y}`;
  }
}

// Ước tính chiều rộng dòng chữ để tính toán bounding box chính xác
function estimateLineWidth(line: TextLine): number {
  const charCount = Math.max(line.text.length, 1);
  const letterSpacing = line.letterSpacing || 0;
  // Hệ số chiều rộng trung bình của font script/display tiếng Việt
  const charWidthFactor = line.fontFamily.includes('Great Vibes') ? 0.48 : 0.54;
  const rawWidth = charCount * (line.fontSize * charWidthFactor + letterSpacing);
  return Math.min(Math.max(rawWidth, 180), 880);
}

// Tạo Dáng Tổng Thể (Overall Envelope Silhouette) bám theo cụm chữ và lớp viền
function generateEnvelopePath(lines: TextLine[], pad: number): string {
  if (lines.length === 0) return '';

  if (lines.length === 1) {
    const line = lines[0];
    const w = estimateLineWidth(line);
    const left = Math.max(500 - w / 2 - pad, 30);
    const right = Math.min(500 + w / 2 + pad, 970);
    const top = Math.max(line.offsetY - line.fontSize * 0.8 - pad, 20);
    const bottom = Math.min(line.offsetY + line.fontSize * 0.4 + pad, 400);
    const r = Math.min((bottom - top) / 2, 60);

    return `M ${left + r},${top} 
            L ${right - r},${top} 
            Q ${right},${top} ${right},${top + r} 
            L ${right},${bottom - r} 
            Q ${right},${bottom} ${right - r},${bottom} 
            L ${left + r},${bottom} 
            Q ${left},${bottom} ${left},${bottom - r} 
            L ${left},${top + r} 
            Q ${left},${top} ${left + r},${top} Z`;
  }

  // Trường hợp 2 dòng hoặc nhiều hơn (Chuẩn mẫu tiệm hoa: Tầng 1 nhô cao, Tầng 2 trải rộng)
  const line1 = lines[0];
  const line2 = lines[1];

  const w1 = estimateLineWidth(line1);
  const w2 = estimateLineWidth(line2);

  const left1 = Math.max(500 - w1 / 2 - pad, 40);
  const right1 = Math.min(500 + w1 / 2 + pad, 960);
  const top1 = Math.max(line1.offsetY - line1.fontSize * 0.82 - pad, 20);
  const bottom1 = line1.offsetY + line1.fontSize * 0.35 + pad * 0.4;

  const left2 = Math.max(500 - w2 / 2 - pad, 30);
  const right2 = Math.min(500 + w2 / 2 + pad, 970);
  const top2 = line2.offsetY - line2.fontSize * 0.82 - pad * 0.4;
  const bottom2 = Math.min(line2.offsetY + line2.fontSize * 0.4 + pad, 400);

  // Điểm nối chuyển tiếp mềm mại giữa 2 tầng (Shoulder transition)
  const midY = (bottom1 + top2) / 2;

  return `M ${left1 + 40},${top1}
          C ${left1 + 80},${top1 - 5} 500,${top1 - 10} ${right1 - 40},${top1}
          C ${right1},${top1} ${right1 + 15},${top1 + 25} ${right1 + 15},${bottom1 - 10}
          C ${right1 + 15},${midY} ${right2 + 10},${midY - 10} ${right2 + 10},${top2 + 20}
          C ${right2 + 15},${top2 + 40} ${right2 + 25},${bottom2 - 30} ${right2},${bottom2}
          C ${right2 - 40},${bottom2 + 8} 500,${bottom2 + 12} ${left2 + 40},${bottom2}
          C ${left2 - 25},${bottom2 - 30} ${left2 - 15},${top2 + 40} ${left2 - 10},${top2 + 20}
          C ${left2 - 10},${midY - 10} ${left1 - 15},${midY} ${left1 - 15},${bottom1 - 10}
          C ${left1 - 15},${top1 + 25} ${left1},${top1} ${left1 + 40},${top1} Z`;
}

const SvgCardCanvas: React.FC<SvgCardCanvasProps> = ({ config, uid }) => {
  // Lọc và sắp xếp các lớp stroke từ ngoài vào trong (width lớn nhất nằm dưới cùng)
  const activeLayers: StrokeLayer[] = [...config.strokeLayers]
    .filter((layer) => layer.enabled && layer.width > 0)
    .sort((a, b) => b.width - a.width);

  return (
    <svg
      viewBox="0 0 1000 420"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        {config.lines.map((line) => (
          <path
            key={`path-${uid}-${line.id}`}
            id={`path-${uid}-${line.id}`}
            d={calculatePathD(line)}
            fill="none"
          />
        ))}
      </defs>

      {/* 1. Nếu có ảnh nền phôi riêng do người dùng upload */}
      {config.customBgUrl && (
        <image
          href={config.customBgUrl}
          width="1000"
          height="420"
          preserveAspectRatio="xMidYMid meet"
        />
      )}

      {/* 2. DÁNG TỔNG THỂ & HỆ THỐNG CÁC LỚP STROKE XẾP TẦNG (Tự động bám theo stroke ngoài cùng) */}
      {activeLayers.map((layer) => {
        // Tính độ nở của dáng tổng thể cho lớp này
        // Lớp ngoài cùng (index 0) có padding lớn nhất, các lớp sau thu hẹp dần tạo thành các dải viền xếp tầng
        const maxLayerWidth = activeLayers[0]?.width || 48;
        const widthRatio = layer.width / maxLayerWidth;
        const currentPad = Math.max(
          config.envelopePadding * widthRatio + layer.width * 0.45,
          layer.width * 0.5
        );

        const envelopeD = generateEnvelopePath(config.lines, currentPad);

        return (
          <g key={`layer-group-${layer.id}`}>
            {/* A. Dáng tổng thể liền khối (Envelope Silhouette) không bị thủng lỗ và tạo form thiệp chuẩn */}
            {config.fillInnerGaps && envelopeD && (
              <path
                d={envelopeD}
                fill={layer.color}
                stroke={layer.color}
                strokeWidth={layer.width * 0.6}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {/* B. Stroke ôm theo từng nét chữ cái kết hợp hòa vào dáng tổng thể */}
            {config.lines.map((line) => (
              <text
                key={`stroke-${layer.id}-${line.id}`}
                fontFamily={line.fontFamily}
                fontSize={line.fontSize}
                fontWeight={line.fontWeight}
                fontStyle={line.fontStyle}
                fill="none"
                stroke={layer.color}
                strokeWidth={layer.width}
                strokeLinejoin="round"
                strokeLinecap="round"
                letterSpacing={line.letterSpacing}
              >
                <textPath
                  href={`#path-${uid}-${line.id}`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {line.text}
                </textPath>
              </text>
            ))}
          </g>
        );
      })}

      {/* 3. MẶT CHỮ CHÍNH (Foreground Text) - Nét chữ nổi bật sắc sảo */}
      {config.lines.map((line) => (
        <text
          key={`fg-${line.id}`}
          fontFamily={line.fontFamily}
          fontSize={line.fontSize}
          fontWeight={line.fontWeight}
          fontStyle={line.fontStyle}
          fill={line.color}
          stroke={line.strokeWidth > 0 ? line.strokeColor : 'none'}
          strokeWidth={line.strokeWidth}
          strokeLinejoin="round"
          paintOrder="stroke fill"
          letterSpacing={line.letterSpacing}
        >
          <textPath
            href={`#path-${uid}-${line.id}`}
            startOffset="50%"
            textAnchor="middle"
          >
            {line.text}
          </textPath>
        </text>
      ))}
    </svg>
  );
};

export default SvgCardCanvas;
