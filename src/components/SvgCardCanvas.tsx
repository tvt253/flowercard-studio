import React from 'react';
import { CardConfig, TextLine, StrokeLayer } from '../types/card';

interface SvgCardCanvasProps {
  config: CardConfig;
  uid: string;
}

function calculatePathD(line: TextLine, config: CardConfig): string {
  const y = line.offsetY;
  const curveType = line.curveType || config.globalCurveType;
  const c = line.curveStrength !== undefined ? line.curveStrength : config.globalCurveStrength;

  if (curveType === 'wave') {
    return `M 60,${y + c * 0.55} C 340,${y - c * 1.85} 660,${y + c * 1.85} 940,${y - c * 0.55}`;
  } else if (curveType === 'arc') {
    return `M 60,${y + c * 0.5} Q 500,${y - c * 1.7} 940,${y + c * 0.5}`;
  } else {
    return `M 60,${y} L 940,${y}`;
  }
}

const SvgCardCanvas: React.FC<SvgCardCanvasProps> = ({ config, uid }) => {
  // Sắp xếp các lớp stroke từ ngoài cùng (width lớn nhất) vào trong (width nhỏ nhất)
  const activeLayers: StrokeLayer[] = [...config.strokeLayers]
    .filter((layer) => layer.enabled && layer.width > 0)
    .sort((a, b) => b.width - a.width);

  const maxLayerWidth = activeLayers[0]?.width || 56;
  // Độ dày đường viền cắt cách stroke ngoài cùng 0.5cm (khoảng 25px mỗi bên trong tọa độ SVG)
  const cutLineWidth = maxLayerWidth + 50;

  return (
    <svg
      viewBox="0 0 1000 420"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
    >
      <defs>
        {config.lines.map((line) => (
          <path
            key={`path-${uid}-${line.id}`}
            id={`path-${uid}-${line.id}`}
            d={calculatePathD(line, config)}
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

      {/* 2. ĐƯỜNG VIỀN CẮT NÉT ĐỨT CÁCH STROKE ĐÚNG 0.5CM (5mm) */}
      {config.showCutLines && (
        <g opacity={0.75}>
          {config.lines.map((line) => {
            const fontFamily = line.fontFamily || config.globalFontFamily;
            return (
              <text
                key={`cutline-${line.id}`}
                fontFamily={fontFamily}
                fontSize={line.fontSize}
                fontWeight={line.fontWeight}
                fontStyle={line.fontStyle}
                fill="none"
                stroke="#94a3b8"
                strokeWidth={cutLineWidth}
                strokeDasharray="9,6"
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
            );
          })}
          {/* Biểu tượng cây kéo chỉ dẫn cắt */}
          <text x="65" y="85" fontSize="16" fill="#64748b" textAnchor="middle">
            ✂
          </text>
        </g>
      )}

      {/* 3. CÁC LỚP VIỀN STROKE HÒA QUYỆN THEO TỪNG TẦNG MÀU (Giống 100% mẫu thực tế) */}
      {activeLayers.map((layer) => (
        <g key={`stroke-layer-${layer.id}`}>
          {/* Cả 2 dòng cùng vẽ chung một màu ở cùng một tầng lớp stroke, tự động hòa vào nhau ở vùng giao */}
          {config.lines.map((line) => {
            const fontFamily = line.fontFamily || config.globalFontFamily;
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
                  {line.text}
                </textPath>
              </text>
            );
          })}
        </g>
      ))}

      {/* 4. MẶT CHỮ CHÍNH (Foreground Text) CỦA CÁC DÒNG */}
      {config.lines.map((line) => {
        const fontFamily = line.fontFamily || config.globalFontFamily;
        const textColor = line.color || config.globalTextColor;
        const textStrokeColor = line.strokeColor || config.globalStrokeColor;
        const textStrokeWidth =
          line.strokeWidth !== undefined ? line.strokeWidth : config.globalStrokeWidth;

        return (
          <text
            key={`fg-${line.id}`}
            fontFamily={fontFamily}
            fontSize={line.fontSize}
            fontWeight={line.fontWeight}
            fontStyle={line.fontStyle}
            fill={textColor}
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
              {line.text}
            </textPath>
          </text>
        );
      })}
    </svg>
  );
};

export default SvgCardCanvas;
