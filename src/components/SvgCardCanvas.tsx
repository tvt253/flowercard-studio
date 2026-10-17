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

const SvgCardCanvas: React.FC<SvgCardCanvasProps> = ({ config, uid }) => {
  // Lọc và sắp xếp các lớp stroke từ ngoài cùng (width lớn nhất) vào trong (width nhỏ nhất)
  const activeLayers: StrokeLayer[] = [...config.strokeLayers]
    .filter((layer) => layer.enabled && layer.width > 0)
    .sort((a, b) => b.width - a.width);

  // Sắp xếp thứ tự các dòng chữ theo cấu hình lineStacking
  // Mặc định 'top-on-bottom': dòng 2 vẽ trước, dòng 1 ("Chúc Mừng") vẽ sau để đè lên trên như mẫu
  const linesToRender =
    config.lineStacking === 'top-on-bottom'
      ? [...config.lines].reverse() // Dòng dưới vẽ trước, dòng trên vẽ sau (đè lên)
      : [...config.lines];

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

      {/* 2. CHẾ ĐỘ STROKE BÁM THEO TỪNG DÒNG CHỮ (Chuẩn 100% mẫu thực tế) */}
      {config.strokeMode === 'per-line' ? (
        // Render từng dòng chữ độc lập với đầy đủ các lớp viền riêng của dòng đó
        linesToRender.map((line) => (
          <g key={`line-cluster-${line.id}`}>
            {/* Các lớp viền stroke xếp tầng bám sát từng nét chữ của dòng này */}
            {activeLayers.map((layer) => (
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

            {/* Mặt chữ chính của dòng này (nét chữ đỏ thắm viền trắng mỏng sắc nét) */}
            <text
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
          </g>
        ))
      ) : (
        // Chế độ hòa nhập stroke (merged): tất cả dòng vẽ cùng lớp stroke rồi mới vẽ mặt chữ
        <>
          {activeLayers.map((layer) => (
            <g key={`merged-layer-${layer.id}`}>
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
          ))}

          {/* Mặt chữ chính cho tất cả các dòng */}
          {config.lines.map((line) => (
            <text
              key={`merged-fg-${line.id}`}
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
        </>
      )}
    </svg>
  );
};

export default SvgCardCanvas;
