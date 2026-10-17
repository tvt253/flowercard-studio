import React from 'react';
import { CardConfig, TextLine, StrokeLayer } from '../types/card';

interface SvgCardCanvasProps {
  config: CardConfig;
  uid: string;
}

// Cố định đường cong Vòm Cung chuẩn nét thiệp hoa (độ cong từ 0 đến 80)
function calculatePathD(line: TextLine, config: CardConfig): string {
  const y = line.offsetY;
  const c = line.curveStrength !== undefined ? line.curveStrength : config.globalCurveStrength;

  if (c === 0) {
    return `M 60,${y} L 940,${y}`;
  }
  return `M 60,${y + c * 0.5} Q 500,${y - c * 1.7} 940,${y + c * 0.5}`;
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

      {/* 1. ĐƯỜNG VIỀN CẮT: NỀN TRẮNG BÊN TRONG + ĐƯỜNG ĐỨT NÉT Ở NGOÀI RÌA */}
      {config.showCutLines && (
        <g>
          {/* Lớp nền màu trắng phủ kín bên trong đường viền cắt */}
          {config.lines.map((line) => {
            const fontFamily = line.fontFamily || config.globalFontFamily;
            return (
              <text
                key={`cutline-bg-${line.id}`}
                fontFamily={fontFamily}
                fontSize={line.fontSize}
                fontWeight={line.fontWeight}
                fontStyle={line.fontStyle}
                fill="#ffffff"
                stroke="#ffffff"
                strokeWidth={cutLineWidth}
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

          {/* Đường viền đứt nét ở mép cắt */}
          {config.lines.map((line) => {
            const fontFamily = line.fontFamily || config.globalFontFamily;
            return (
              <text
                key={`cutline-border-${line.id}`}
                fontFamily={fontFamily}
                fontSize={line.fontSize}
                fontWeight={line.fontWeight}
                fontStyle={line.fontStyle}
                fill="none"
                stroke="#94a3b8"
                strokeWidth={cutLineWidth}
                strokeDasharray="8,6"
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
      )}

      {/* 2. CÁC LỚP VIỀN STROKE XẾP TẦNG HÒA QUYỆN THEO TỪNG TẦNG MÀU CHUNG */}
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

      {/* 3. MẶT CHỮ CHÍNH CỦA CÁC DÒNG */}
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
