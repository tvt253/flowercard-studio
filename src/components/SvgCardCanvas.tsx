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
  // Lọc và sắp xếp các lớp stroke từ ngoài cùng (width lớn nhất) vào trong (width nhỏ nhất)
  const activeLayers: StrokeLayer[] = [...config.strokeLayers]
    .filter((layer) => layer.enabled && layer.width > 0)
    .sort((a, b) => b.width - a.width);

  // Mặc định: Dòng dưới vẽ trước, Dòng trên ("Chúc Mừng") vẽ sau đè lên trên chuẩn mẫu
  const linesToRender = [...config.lines].reverse();

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

      {/* 2. CHẾ ĐỘ STROKE BÁM TỪNG DÒNG CHỮ (Chuẩn 100% mẫu thực tế) */}
      {linesToRender.map((line) => {
        const fontFamily = line.fontFamily || config.globalFontFamily;
        const textColor = line.color || config.globalTextColor;
        const textStrokeColor = line.strokeColor || config.globalStrokeColor;
        const textStrokeWidth =
          line.strokeWidth !== undefined ? line.strokeWidth : config.globalStrokeWidth;

        return (
          <g key={`line-cluster-${line.id}`}>
            {/* Các lớp viền stroke xếp tầng bám sát từng nét chữ của dòng này */}
            {activeLayers.map((layer) => (
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
            ))}

            {/* Mặt chữ chính (Foreground Text) sắc nét */}
            <text
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
          </g>
        );
      })}
    </svg>
  );
};

export default SvgCardCanvas;
