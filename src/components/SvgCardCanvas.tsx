import React from 'react';
import { CardConfig, TextLine, StrokeLayer } from '../types/card';
import { applyTextCase } from '../store/useCardStore';

interface SvgCardCanvasProps {
  config: CardConfig;
  uid: string;
  onSelectLine?: (lineId: string) => void;
  selectedLineId?: string | null;
}

// Đường cong Vòm Cung chuẩn nét thiệp hoa (độ cong từ 0 đến 80)
function calculatePathD(line: TextLine, config: CardConfig): string {
  const y = line.offsetY;
  const c = line.curveStrength !== undefined ? line.curveStrength : config.globalCurveStrength;

  if (c === 0) {
    return `M 60,${y} L 940,${y}`;
  }
  return `M 60,${y + c * 0.5} Q 500,${y - c * 1.7} 940,${y + c * 0.5}`;
}

const SvgCardCanvas: React.FC<SvgCardCanvasProps> = ({
  config,
  uid,
  onSelectLine,
  selectedLineId,
}) => {
  // Sắp xếp các lớp stroke từ ngoài cùng (width lớn nhất) vào trong (width nhỏ nhất)
  const activeLayers: StrokeLayer[] = [...config.strokeLayers]
    .filter((layer) => layer.enabled && layer.width > 0)
    .sort((a, b) => b.width - a.width);

  const maxLayerWidth = activeLayers[0]?.width || 56;

  // Màu mặt chữ luôn lấy đồng nhất theo màu stroke ngoài cùng
  const primaryTextColor = config.outerStrokeColor;

  return (
    <svg
      viewBox="0 0 1000 420"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
    >
      <defs>
        {/* Các đường path dẫn hướng uốn cong cho từng dòng chữ */}
        {config.lines.map((line) => (
          <path
            key={`path-${uid}-${line.id}`}
            id={`path-${uid}-${line.id}`}
            d={calculatePathD(line, config)}
            fill="none"
          />
        ))}
      </defs>

      {/* 1. CÁC LỚP VIỀN STROKE XẾP TẦNG HÒA QUYỆN (CẢ 2 DÒNG CÙNG VẼ CHUNG MỖI LỚP) */}
      {activeLayers.map((layer) => (
        <g key={`stroke-layer-${layer.id}`}>
          {config.lines.map((line) => {
            const fontFamily = line.fontFamily || config.globalFontFamily;
            const displayText = applyTextCase(line.text, line.textCase);
            return (
              <text
                key={`stroke-${layer.id}-${line.id}`}
                fontFamily={fontFamily}
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
                  {displayText}
                </textPath>
              </text>
            );
          })}
        </g>
      ))}

      {/* 2. MẶT CHỮ CHÍNH - MÀU LUÔN ĂN THEO MÀU STROKE NGOÀI CÙNG (primaryTextColor) */}
      {config.lines.map((line) => {
        const fontFamily = line.fontFamily || config.globalFontFamily;
        const textStrokeColor = line.strokeColor || config.globalStrokeColor;
        const textStrokeWidth =
          line.strokeWidth !== undefined ? line.strokeWidth : config.globalStrokeWidth;
        const isSelected = selectedLineId === line.id;
        const displayText = applyTextCase(line.text, line.textCase);

        return (
          <g
            key={`fg-group-${line.id}`}
            onClick={() => onSelectLine && onSelectLine(line.id)}
            style={{ cursor: onSelectLine ? 'pointer' : 'default' }}
          >
            {/* Vùng cảm ứng click rộng bao quanh dòng chữ để dễ bấm chọn trên Preview */}
            <text
              fontFamily={fontFamily}
              fontSize={line.fontSize}
              fontWeight={line.fontWeight}
              fontStyle={line.fontStyle}
              fill="none"
              stroke="transparent"
              strokeWidth={maxLayerWidth + 20}
              strokeLinejoin="round"
              strokeLinecap="round"
              letterSpacing={line.letterSpacing}
            >
              <textPath
                href={`#path-${uid}-${line.id}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {displayText}
              </textPath>
            </text>

            {/* Hiệu ứng viền phát sáng khi chọn dòng trên preview */}
            {isSelected && (
              <text
                fontFamily={fontFamily}
                fontSize={line.fontSize}
                fontWeight={line.fontWeight}
                fontStyle={line.fontStyle}
                fill="none"
                stroke="#38bdf8"
                strokeWidth={textStrokeWidth + 12}
                strokeDasharray="6,4"
                strokeLinejoin="round"
                opacity={0.85}
                letterSpacing={line.letterSpacing}
              >
                <textPath
                  href={`#path-${uid}-${line.id}`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {displayText}
                </textPath>
              </text>
            )}

            {/* Chữ hiển thị chính với viền sáng mỏng và màu ruột trùng stroke ngoài cùng */}
            <text
              fontFamily={fontFamily}
              fontSize={line.fontSize}
              fontWeight={line.fontWeight}
              fontStyle={line.fontStyle}
              fill={primaryTextColor}
              stroke={textStrokeWidth > 0 ? textStrokeColor : 'none'}
              strokeWidth={textStrokeWidth}
              strokeLinejoin="round"
              paintOrder="stroke fill"
              letterSpacing={line.letterSpacing}
            >
              <textPath
                href={`#path-${uid}-${line.id}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {displayText}
              </textPath>
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default SvgCardCanvas;
