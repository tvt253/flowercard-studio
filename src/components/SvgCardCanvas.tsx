import React from 'react';
import { CardConfig, TextLine, StrokeLayer } from '../types/card';
import { applyTextCase } from '../store/useCardStore';

interface SvgCardCanvasProps {
  config: CardConfig;
  uid: string;
  onSelectLine?: (lineId: string) => void;
  selectedLineId?: string | null;
}

// Đường cong dẫn hướng (khi curveStrength = 0 thì thẳng ngang)
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
  const isOval = config.styleType === 'oval-red' || config.styleType === 'oval-black';

  // Nền và viền Oval: hỗ trợ màu tùy chỉnh như Kính dâng (nền đỏ chữ vàng), Kính viếng (nền trắng chữ đen)
  const defaultOvalBg =
    config.styleType === 'oval-black'
      ? '#09090b'
      : config.outerStrokeColor || '#dc2626';
  const ovalBgColor = config.ovalBgColor || defaultOvalBg;
  const ovalBorderColor =
    config.ovalBorderColor || (ovalBgColor === '#ffffff' ? '#09090b' : ovalBgColor);

  // Sắp xếp các lớp stroke từ ngoài cùng (width lớn nhất) vào trong (width nhỏ nhất)
  const activeLayers: StrokeLayer[] = [...config.strokeLayers]
    .filter((layer) => layer.enabled && layer.width > 0)
    .sort((a, b) => b.width - a.width);

  const maxLayerWidth = activeLayers[0]?.width || 130;

  // Màu mặt chữ: kiểu Oval ưu tiên ovalTextColor, kiểu Đám mây chữ trùng màu viền ngoài cùng
  const primaryTextColor = isOval
    ? config.ovalTextColor || '#ffffff'
    : config.outerStrokeColor;

  return (
    <svg
      viewBox="0 0 1000 420"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
    >
      <defs>
        {/* Bóng mờ nhẹ cho khung thiệp */}
        <filter id={`card-shadow-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.08" />
        </filter>

        {/* Các đường path dẫn hướng cho từng dòng chữ */}
        {config.lines.map((line) => (
          <path
            key={`path-${uid}-${line.id}`}
            id={`path-${uid}-${line.id}`}
            d={calculatePathD(line, config)}
            fill="none"
          />
        ))}
      </defs>

      {/* 1. NỀN THIỆP: KIỂU OVAL (ĐỎ / ĐEN / TRẮNG / TÍM) HOẶC CÁC LỚP VIỀN STROKE ĐÁM MÂY */}
      {isOval ? (
        <g id={`oval-bg-${uid}`} filter={`url(#card-shadow-${uid})`}>
          {/* Vòng viền ngoài cùng: nét viền đơn 6px màu oval */}
          <ellipse
            cx="500"
            cy="210"
            rx="484"
            ry="198"
            fill="none"
            stroke={ovalBorderColor}
            strokeWidth="6"
          />
          {/* Thân khối Oval đặc màu bên trong (cách viền ngoài khoảng trắng 12px) */}
          <ellipse
            cx="500"
            cy="210"
            rx="466"
            ry="182"
            fill={ovalBgColor}
            stroke={ovalBgColor === '#ffffff' ? ovalBorderColor : 'none'}
            strokeWidth={ovalBgColor === '#ffffff' ? 2 : 0}
          />
        </g>
      ) : (
        /* KIỂU ĐÁM MÂY: Các lớp viền stroke xếp tầng hòa quyện */
        activeLayers.map((layer) => (
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
        ))
      )}

      {/* 2. MẶT CHỮ CHÍNH */}
      {config.lines.map((line) => {
        const fontFamily = line.fontFamily || config.globalFontFamily;
        const textStrokeColor = isOval ? 'none' : (line.strokeColor || config.globalStrokeColor);
        const textStrokeWidth = isOval
          ? 0
          : line.strokeWidth !== undefined
          ? line.strokeWidth
          : config.globalStrokeWidth;
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
                stroke={isOval ? '#38bdf8' : '#38bdf8'}
                strokeWidth={textStrokeWidth + 12}
                strokeDasharray="6,4"
                strokeLinejoin="round"
                opacity={0.9}
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

            {/* Chữ hiển thị chính: màu trắng trên nền Oval, hoặc màu stroke ngoài trên Đám Mây */}
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
