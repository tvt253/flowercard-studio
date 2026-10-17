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

// Ước tính chiều rộng dòng chữ
function estimateLineWidth(line: TextLine): number {
  const charCount = Math.max(line.text.length, 1);
  const letterSpacing = line.letterSpacing || 0;
  const charWidthFactor = line.fontFamily.includes('Great Vibes') ? 0.46 : 0.52;
  const rawWidth = charCount * (line.fontSize * charWidthFactor + letterSpacing);
  return Math.min(Math.max(rawWidth, 180), 880);
}

// Khối liên kết giữa các dòng (Inter-line Bridge) giúp thiệp liền mạch thành 1 khối vững chắc
function generateBridgePath(lines: TextLine[], pad: number): string {
  if (lines.length < 2) return '';

  const line1 = lines[0];
  const line2 = lines[1];

  const w1 = estimateLineWidth(line1);
  const w2 = estimateLineWidth(line2);

  // Giới hạn chiều ngang của khối cầu nối ở giữa 2 tầng
  const left1 = Math.max(500 - w1 / 2 + 10 - pad * 0.5, 80);
  const right1 = Math.min(500 + w1 / 2 - 10 + pad * 0.5, 920);

  const left2 = Math.max(500 - w2 / 2 + 30 - pad * 0.6, 60);
  const right2 = Math.min(500 + w2 / 2 - 30 + pad * 0.6, 940);

  // Khoảng cách theo chiều dọc giữa đáy dòng 1 và đỉnh dòng 2
  const yTop = line1.offsetY + line1.fontSize * 0.05 - pad * 0.3;
  const yBottom = line2.offsetY - line2.fontSize * 0.55 + pad * 0.3;

  if (yBottom <= yTop) return '';

  const midY = (yTop + yBottom) / 2;

  return `M ${left1},${yTop}
          L ${right1},${yTop}
          C ${right1 + pad * 0.3},${midY} ${right2},${midY} ${right2},${yBottom}
          L ${left2},${yBottom}
          C ${left2},${midY} ${left1 - pad * 0.3},${midY} ${left1},${yTop} Z`;
}

const SvgCardCanvas: React.FC<SvgCardCanvasProps> = ({ config, uid }) => {
  // Sắp xếp các lớp stroke từ ngoài cùng (width lớn nhất) vào trong (width nhỏ nhất)
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

      {/* 1. Ảnh nền phôi riêng nếu người dùng tải lên */}
      {config.customBgUrl && (
        <image
          href={config.customBgUrl}
          width="1000"
          height="420"
          preserveAspectRatio="xMidYMid meet"
        />
      )}

      {/* 2. HỆ THỐNG CÁC LỚP VIỀN STROKE XẾP TẦNG (Tương tự 100% mẫu thực tế) */}
      {activeLayers.map((layer) => {
        const bridgeD = config.fillInnerGaps
          ? generateBridgePath(config.lines, layer.width)
          : '';

        return (
          <g key={`stroke-group-${layer.id}`}>
            {/* A. Khối liên kết mềm mại giữa 2 dòng giúp nối liền 2 tầng thành 1 khối vững chắc */}
            {bridgeD && (
              <path
                d={bridgeD}
                fill={layer.color}
                stroke={layer.color}
                strokeWidth={layer.width * 0.8}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {/* B. Lớp stroke uốn lượn ôm sát từng con chữ tạo đường viền bọt nước lồi lõm nghệ thuật */}
            {config.lines.map((line) => (
              <text
                key={`stroke-${layer.id}-${line.id}`}
                fontFamily={line.fontFamily}
                fontSize={line.fontSize}
                fontWeight={line.fontWeight}
                fontStyle={line.fontStyle}
                fill={layer.color}
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

      {/* 3. MẶT CHỮ CHÍNH (Foreground Text) - Nét chữ đỏ thắm viền trắng mỏng sắc sảo */}
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
