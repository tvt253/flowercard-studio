import React from 'react';
import { CardConfig, TextLine, StrokeLayer } from '../types/card';
import { applyTextCase } from '../store/useCardStore';
import { calculateCardMetrics } from '../utils/cardScaleUtils';
import floralHeartImg from '../assets/floral-heart.jpg';

interface SvgCardCanvasProps {
  config: CardConfig;
  uid: string;
  onSelectLine?: (lineId: string) => void;
  selectedLineId?: string | null;
}

// Đường cong dẫn hướng (khi curveStrength = 0 thì thẳng ngang, trải đều trên toàn bộ bề rộng khả dụng 910px)
function calculatePathD(line: TextLine, config: CardConfig): string {
  const y = line.offsetY;
  const c = line.curveStrength !== undefined ? line.curveStrength : config.globalCurveStrength;

  if (c === 0) {
    return `M 45,${y} L 955,${y}`;
  }
  return `M 45,${y + c * 0.5} Q 500,${y - c * 1.7} 955,${y + c * 0.5}`;
}

const SvgCardCanvas: React.FC<SvgCardCanvasProps> = ({
  config,
  uid,
  onSelectLine,
  selectedLineId,
}) => {
  const isOval = config.styleType === 'oval-red' || config.styleType === 'oval-black';
  const isCloudSolid = config.styleType === 'cloud-solid';
  const isFloralFrame = config.styleType === 'floral-heart';
  const hueAngle = config.frameHueAngle || 0;

  // Nền và viền Oval: hỗ trợ màu tùy chỉnh như Kính dâng (nền đỏ chữ vàng), Kính viếng (nền trắng chữ đen)
  const defaultOvalBg =
    config.styleType === 'oval-black'
      ? '#09090b'
      : config.outerStrokeColor || '#dc2626';
  const ovalBgColor = config.ovalBgColor || defaultOvalBg;
  const ovalBorderColor =
    config.ovalBorderColor || (ovalBgColor === '#ffffff' ? '#09090b' : ovalBgColor);

  // Màu nền đám mây đặc (Solid Cloud)
  const solidCloudBg = config.cloudBgColor || config.outerStrokeColor || '#c81e2b';

  // Sắp xếp các lớp stroke từ ngoài cùng (width lớn nhất) vào trong (width nhỏ nhất)
  const activeLayers: StrokeLayer[] = [...config.strokeLayers]
    .filter((layer) => layer.enabled && layer.width > 0)
    .sort((a, b) => b.width - a.width);

  const maxLayerWidth = activeLayers[0]?.width || 130;

  // Màu mặt chữ: kiểu Oval ưu tiên ovalTextColor, kiểu Đám mây đặc ưu tiên cloudTextColor (#ffffff), kiểu Khung hoa ưu tiên frameTextColor, kiểu Đám mây viền tầng trùng outerStrokeColor
  const primaryTextColor = isOval
    ? config.ovalTextColor || '#ffffff'
    : isCloudSolid
    ? config.cloudTextColor || '#ffffff'
    : isFloralFrame
    ? config.frameTextColor || '#be185d'
    : config.outerStrokeColor;

  // Tính toán tỷ lệ auto-scale để nội dung thiệp luôn tự động lấp đầy an toàn
  const { centerY, cloudScale, ovalTextScale, floralTextScale } = calculateCardMetrics(config);

  // Render các dòng chữ chính (bao gồm click target, selection highlight, và glyphs)
  const renderTextLines = () =>
    config.lines.map((line) => {
      const fontFamily = line.fontFamily || config.globalFontFamily;
      const textStrokeColor = isOval
        ? 'none'
        : isFloralFrame
        ? (line.strokeColor || '#ffffff')
        : (line.strokeColor || config.globalStrokeColor);
      const textStrokeWidth = isOval
        ? 0
        : isFloralFrame
        ? (line.strokeWidth !== undefined ? line.strokeWidth : 1.5)
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
            strokeWidth={maxLayerWidth * 1.2 + 24}
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
              className="print:hidden selection-highlight"
              fontFamily={fontFamily}
              fontSize={line.fontSize}
              fontWeight={line.fontWeight}
              fontStyle={line.fontStyle}
              fill="none"
              stroke="#38bdf8"
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
    });

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

        {/* Bộ lọc hueRotate để tùy biến đổi màu sắc khung hoa */}
        {isFloralFrame && hueAngle !== 0 && (
          <filter id={`frame-hue-${uid}`}>
            <feColorMatrix type="hueRotate" values={`${hueAngle}`} />
          </filter>
        )}

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

      {/* 1. NỀN VÀ NỘI DUNG: KIỂU OVAL, KHUNG HOA HOẶC KIỂU ĐÁM MÂY */}
      {isOval ? (
        <>
          {/* Khung viền Oval chuẩn tỷ lệ (chiếm 96.8% bề ngang canvas SVG) */}
          <g id={`oval-bg-${uid}`} className="card-shadow-filter" filter={`url(#card-shadow-${uid})`}>
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

          {/* Nội dung chữ bên trong Oval tự động scale vừa vặn và nổi bật */}
          <g
            id={`oval-text-group-${uid}`}
            transform={`translate(500, ${centerY}) scale(${ovalTextScale}) translate(-500, -${centerY})`}
          >
            {renderTextLines()}
          </g>
        </>
      ) : isFloralFrame ? (
        <>
          {/* Khung hoa trái tim làm nền với bộ lọc đổi màu */}
          <g id={`floral-frame-bg-${uid}`} className="card-shadow-filter" filter={`url(#card-shadow-${uid})`}>
            <image
              href={floralHeartImg}
              x="0"
              y="0"
              width="1000"
              height="420"
              preserveAspectRatio="none"
              filter={hueAngle !== 0 ? `url(#frame-hue-${uid})` : undefined}
            />
          </g>

          {/* Nội dung chữ trong lòng khung hoa tự động scale vừa vặn an toàn */}
          <g
            id={`floral-text-group-${uid}`}
            transform={`translate(500, ${centerY}) scale(${floralTextScale}) translate(-500, -${centerY})`}
          >
            {renderTextLines()}
          </g>
        </>
      ) : (
        /* KIỂU ĐÁM MÂY: Các lớp viền stroke xếp tầng + mặt chữ chính tự động scale lên ~880px trong viewBox */
        <g
          id={`cloud-group-${uid}`}
          transform={`translate(500, ${centerY}) scale(${cloudScale}) translate(-500, -${centerY})`}
        >
          {/* Các lớp viền stroke xếp tầng hòa quyện tạo hình đám mây */}
          {/* Tăng độ rộng stroke ở trên và dưới = 1.2 lần ở 2 bên */}
          {activeLayers.map((layer) => {
            const vDelta = layer.width * 0.1; // (1.2 - 1.0) * width / 2 = 0.1 * width
            const vOffsets = [-vDelta, 0, vDelta];

            const strokeColor = isCloudSolid ? solidCloudBg : layer.color;

            return (
              <g key={`stroke-layer-${layer.id}`}>
                {vOffsets.map((dy, oIdx) => (
                  <g
                    key={`stroke-offset-${layer.id}-${oIdx}`}
                    transform={dy !== 0 ? `translate(0, ${dy})` : undefined}
                  >
                    {config.lines.map((line) => {
                      const fontFamily = line.fontFamily || config.globalFontFamily;
                      const displayText = applyTextCase(line.text, line.textCase);
                      return (
                        <text
                          key={`stroke-${layer.id}-${line.id}-${oIdx}`}
                          fontFamily={fontFamily}
                          fontSize={line.fontSize}
                          fontWeight={line.fontWeight}
                          fontStyle={line.fontStyle}
                          fill={strokeColor}
                          stroke={strokeColor}
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
              </g>
            );
          })}

          {/* Mặt chữ chính và vùng tương tác */}
          {renderTextLines()}
        </g>
      )}
    </svg>
  );
};

export default React.memo(SvgCardCanvas);
