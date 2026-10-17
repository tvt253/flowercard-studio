import React from 'react';
import { CardConfig, TextLine, StrokeLayer } from '../types/card';

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
  // Độ dày đường viền cắt: chừa lề trắng 0.5cm (khoảng 24px mỗi bên = +48px tổng stroke)
  const cutMargin = 48;
  const whiteCushionWidth = maxLayerWidth + cutMargin;

  // Màu mặt chữ luôn lấy đồng nhất theo màu stroke ngoài cùng
  const primaryTextColor = config.outerStrokeColor;

  return (
    <svg
      viewBox="0 0 1000 420"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
    >
      <defs>
        {/* Bóng mờ mềm cho lớp viền cắt màu trắng để phân biệt rõ ràng trên giấy A4 */}
        <filter id={`cut-shadow-${uid}`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#000000" floodOpacity="0.12" />
        </filter>

        {/* Mask tạo đường viền cắt đứt nét 1.5px mỏng bám theo đúng mép ngoài lề trắng */}
        <mask id={`cut-mask-${uid}`}>
          {/* Nền hiển thị toàn bộ */}
          <rect x="-200" y="-200" width="1400" height="820" fill="#ffffff" />
          {/* Vùng bên trong bị che đi bằng màu đen, chỉ chừa 1.5px ở mép ngoài cùng */}
          {config.lines.map((line) => {
            const fontFamily = line.fontFamily || config.globalFontFamily;
            return (
              <text
                key={`mask-cut-${line.id}`}
                fontFamily={fontFamily}
                fontSize={line.fontSize}
                fontWeight={line.fontWeight}
                fontStyle={line.fontStyle}
                fill="#000000"
                stroke="#000000"
                strokeWidth={whiteCushionWidth}
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
        </mask>

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

      {/* 1. ĐƯỜNG VIỀN CẮT: NỀN TRẮNG CHÙA LỀ 0.5CM + ĐƯỜNG ĐỨT NÉT Ở MÉP NGOÀI */}
      {config.showCutLines && (
        <g id={`cutline-group-${uid}`}>
          {/* Lớp đệm nền màu trắng phủ trọn hình dáng thiệp với chừa lề 0.5cm */}
          <g filter={`url(#cut-shadow-${uid})`}>
            {config.lines.map((line) => {
              const fontFamily = line.fontFamily || config.globalFontFamily;
              return (
                <text
                  key={`cut-white-${line.id}`}
                  fontFamily={fontFamily}
                  fontSize={line.fontSize}
                  fontWeight={line.fontWeight}
                  fontStyle={line.fontStyle}
                  fill="#ffffff"
                  stroke="#ffffff"
                  strokeWidth={whiteCushionWidth}
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

          {/* Đường viền đứt nét mỏng 1.5px nằm đúng trên mép cắt (dùng mask để không bị đen bên trong) */}
          <g mask={`url(#cut-mask-${uid})`}>
            {config.lines.map((line) => {
              const fontFamily = line.fontFamily || config.globalFontFamily;
              return (
                <text
                  key={`cut-dash-${line.id}`}
                  fontFamily={fontFamily}
                  fontSize={line.fontSize}
                  fontWeight={line.fontWeight}
                  fontStyle={line.fontStyle}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth={whiteCushionWidth + 3}
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
          </g>

          {/* Ký hiệu cây kéo chỉ dẫn cắt */}
          <text x="65" y="75" fontSize="16" fill="#64748b" textAnchor="middle" fontWeight="bold">
            ✂
          </text>
        </g>
      )}

      {/* 2. CÁC LỚP VIỀN STROKE XẾP TẦNG HÒA QUYỆN (CẢ 2 DÒNG CÙNG VẼ CHUNG MỖI LỚP) */}
      {activeLayers.map((layer) => (
        <g key={`stroke-layer-${layer.id}`}>
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

      {/* 3. MẶT CHỮ CHÍNH - MÀU LUÔN ĂN THEO MÀU STROKE NGOÀI CÙNG (primaryTextColor) */}
      {config.lines.map((line) => {
        const fontFamily = line.fontFamily || config.globalFontFamily;
        const textStrokeColor = line.strokeColor || config.globalStrokeColor;
        const textStrokeWidth =
          line.strokeWidth !== undefined ? line.strokeWidth : config.globalStrokeWidth;
        const isSelected = selectedLineId === line.id;

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
                {line.text}
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
                  {line.text}
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
