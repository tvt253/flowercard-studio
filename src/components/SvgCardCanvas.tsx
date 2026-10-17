import React from 'react';
import { CardConfig, TextLine } from '../types/card';

interface SvgCardCanvasProps {
  config: CardConfig;
  uid: string;
}

function calculatePathD(line: TextLine): string {
  const y = line.offsetY;
  const c = line.curveStrength;

  if (line.curveType === 'wave') {
    return `M 70,${y + c * 0.55} C 350,${y - c * 1.85} 650,${y + c * 1.85} 930,${y - c * 0.55}`;
  } else if (line.curveType === 'arc') {
    return `M 70,${y + c * 0.5} Q 500,${y - c * 1.7} 930,${y + c * 0.5}`;
  } else {
    return `M 70,${y} L 930,${y}`;
  }
}

// Icon Heart Component in SVG
const HeartIcon: React.FC<{ x: number; y: number; size: number; rotate?: number; fill?: string; stroke?: string }> = ({
  x,
  y,
  size,
  rotate = 0,
  fill = '#dc2626',
  stroke = '#ffffff',
}) => {
  const scale = size / 24;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
      <path
        d="M 12,21.35 l -1.45,-1.32 C 5.4,15.36 2,12.28 2,8.5 C 2,5.42 4.42,3 7.5,3 c 1.74,0 3.41,0.81 4.5,2.09 C 13.09,3.81 14.76,3 16.5,3 C 19.58,3 22,5.42 22,8.5 c 0,3.78 -3.4,6.86 -8.55,11.54 L 12,21.35 z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </g>
  );
};

// Icon Star Component in SVG
const StarIcon: React.FC<{ x: number; y: number; size: number; fill?: string; stroke?: string }> = ({
  x,
  y,
  size,
  fill = '#f59e0b',
  stroke = '#ffffff',
}) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d={`M 0,${-size} L ${size * 0.28},${-size * 0.28} L ${size},0 L ${size * 0.28},${size * 0.28} L 0,${size} L ${-size * 0.28},${size * 0.28} L ${-size},0 L ${-size * 0.28},${-size * 0.28} Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.2"
      />
    </g>
  );
};

// 1. Die-cut Sticker Red Heart Template (Chính xác theo mẫu ảnh người dùng gửi)
function DiecutRedHeartTemplate() {
  return (
    <g>
      <defs>
        <linearGradient id="diecutRedTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="pinkGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="50%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>

      {/* Outer Layer: Bold Red Silhouette Cloud Contour */}
      <path
        d="M 220,160 
           C 210,95 270,55 350,55 
           C 380,40 430,30 500,30 
           C 570,30 620,40 650,55 
           C 730,55 790,95 780,160 
           C 840,165 910,185 960,225 
           C 995,255 995,305 960,335 
           C 910,375 830,385 750,375 
           C 700,385 620,390 500,390 
           C 380,390 300,385 250,375 
           C 170,385 90,375 40,335 
           C 5,305 5,255 40,225 
           C 90,185 160,165 220,160 Z"
        fill="#dc2626"
      />

      {/* Middle Layer: Fresh Pink Bubble Silhouette */}
      <path
        d="M 230,162 
           C 222,105 275,70 350,70 
           C 380,55 430,46 500,46 
           C 570,46 620,55 650,70 
           C 725,70 778,105 770,162 
           C 830,167 898,187 945,225 
           C 978,252 978,298 945,325 
           C 898,363 822,371 748,362 
           C 698,371 618,375 500,375 
           C 382,375 302,371 252,362 
           C 178,371 102,363 55,325 
           C 22,298 22,252 55,225 
           C 102,187 170,167 230,162 Z"
        fill="url(#pinkGlowGrad)"
      />

      {/* Inner Layer: Pure White Halo Base */}
      <path
        d="M 242,165 
           C 236,118 282,86 350,86 
           C 380,72 430,64 500,64 
           C 570,64 620,72 650,86 
           C 718,86 764,118 758,165 
           C 816,170 882,190 928,225 
           C 958,250 958,290 928,315 
           C 882,350 812,356 745,348 
           C 695,356 615,360 500,360 
           C 385,360 305,356 255,348 
           C 188,356 118,350 72,315 
           C 42,290 42,250 72,225 
           C 118,190 184,170 242,165 Z"
        fill="#ffffff"
      />
    </g>
  );
}

// 2. Die-cut Sticker Gold Luxury Template
function DiecutGoldLuxuryTemplate() {
  return (
    <g>
      <defs>
        <linearGradient id="goldGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>

      {/* Outer Layer: Bold Bronze/Amber Silhouette */}
      <path
        d="M 220,160 
           C 210,95 270,55 350,55 
           C 380,40 430,30 500,30 
           C 570,30 620,40 650,55 
           C 730,55 790,95 780,160 
           C 840,165 910,185 960,225 
           C 995,255 995,305 960,335 
           C 910,375 830,385 750,375 
           C 700,385 620,390 500,390 
           C 380,390 300,385 250,375 
           C 170,385 90,375 40,335 
           C 5,305 5,255 40,225 
           C 90,185 160,165 220,160 Z"
        fill="#b45309"
      />

      {/* Middle Layer: Golden Yellow Glow */}
      <path
        d="M 230,162 
           C 222,105 275,70 350,70 
           C 380,55 430,46 500,46 
           C 570,46 620,55 650,70 
           C 725,70 778,105 770,162 
           C 830,167 898,187 945,225 
           C 978,252 978,298 945,325 
           C 898,363 822,371 748,362 
           C 698,371 618,375 500,375 
           C 382,375 302,371 252,362 
           C 178,371 102,363 55,325 
           C 22,298 22,252 55,225 
           C 102,187 170,167 230,162 Z"
        fill="url(#goldGlowGrad)"
      />

      {/* Inner Layer: Pure White Halo Base */}
      <path
        d="M 242,165 
           C 236,118 282,86 350,86 
           C 380,72 430,64 500,64 
           C 570,64 620,72 650,86 
           C 718,86 764,118 758,165 
           C 816,170 882,190 928,225 
           C 958,250 958,290 928,315 
           C 882,350 812,356 745,348 
           C 695,356 615,360 500,360 
           C 385,360 305,356 255,348 
           C 188,356 118,350 72,315 
           C 42,290 42,250 72,225 
           C 118,190 184,170 242,165 Z"
        fill="#ffffff"
      />
    </g>
  );
}

// 3. Die-cut Sticker Blue Fresh Template
function DiecutBlueFreshTemplate() {
  return (
    <g>
      <defs>
        <linearGradient id="blueGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="50%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>

      <path
        d="M 220,160 
           C 210,95 270,55 350,55 
           C 380,40 430,30 500,30 
           C 570,30 620,40 650,55 
           C 730,55 790,95 780,160 
           C 840,165 910,185 960,225 
           C 995,255 995,305 960,335 
           C 910,375 830,385 750,375 
           C 700,385 620,390 500,390 
           C 380,390 300,385 250,375 
           C 170,385 90,375 40,335 
           C 5,305 5,255 40,225 
           C 90,185 160,165 220,160 Z"
        fill="#1d4ed8"
      />
      <path
        d="M 230,162 
           C 222,105 275,70 350,70 
           C 380,55 430,46 500,46 
           C 570,46 620,55 650,70 
           C 725,70 778,105 770,162 
           C 830,167 898,187 945,225 
           C 978,252 978,298 945,325 
           C 898,363 822,371 748,362 
           C 698,371 618,375 500,375 
           C 382,375 302,371 252,362 
           C 178,371 102,363 55,325 
           C 22,298 22,252 55,225 
           C 102,187 170,167 230,162 Z"
        fill="url(#blueGlowGrad)"
      />
      <path
        d="M 242,165 
           C 236,118 282,86 350,86 
           C 380,72 430,64 500,64 
           C 570,64 620,72 650,86 
           C 718,86 764,118 758,165 
           C 816,170 882,190 928,225 
           C 958,250 958,290 928,315 
           C 882,350 812,356 745,348 
           C 695,356 615,360 500,360 
           C 385,360 305,356 255,348 
           C 188,356 118,350 72,315 
           C 42,290 42,250 72,225 
           C 118,190 184,170 242,165 Z"
        fill="#ffffff"
      />
    </g>
  );
}

// 4. Die-cut Sticker Purple Sweet Template
function DiecutPurpleSweetTemplate() {
  return (
    <g>
      <defs>
        <linearGradient id="purpleGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5d0fe" />
          <stop offset="50%" stopColor="#e879f9" />
          <stop offset="100%" stopColor="#c026d3" />
        </linearGradient>
      </defs>

      <path
        d="M 220,160 
           C 210,95 270,55 350,55 
           C 380,40 430,30 500,30 
           C 570,30 620,40 650,55 
           C 730,55 790,95 780,160 
           C 840,165 910,185 960,225 
           C 995,255 995,305 960,335 
           C 910,375 830,385 750,375 
           C 700,385 620,390 500,390 
           C 380,390 300,385 250,375 
           C 170,385 90,375 40,335 
           C 5,305 5,255 40,225 
           C 90,185 160,165 220,160 Z"
        fill="#7e22ce"
      />
      <path
        d="M 230,162 
           C 222,105 275,70 350,70 
           C 380,55 430,46 500,46 
           C 570,46 620,55 650,70 
           C 725,70 778,105 770,162 
           C 830,167 898,187 945,225 
           C 978,252 978,298 945,325 
           C 898,363 822,371 748,362 
           C 698,371 618,375 500,375 
           C 382,375 302,371 252,362 
           C 178,371 102,363 55,325 
           C 22,298 22,252 55,225 
           C 102,187 170,167 230,162 Z"
        fill="url(#purpleGlowGrad)"
      />
      <path
        d="M 242,165 
           C 236,118 282,86 350,86 
           C 380,72 430,64 500,64 
           C 570,64 620,72 650,86 
           C 718,86 764,118 758,165 
           C 816,170 882,190 928,225 
           C 958,250 958,290 928,315 
           C 882,350 812,356 745,348 
           C 695,356 615,360 500,360 
           C 385,360 305,356 255,348 
           C 188,356 118,350 72,315 
           C 42,290 42,250 72,225 
           C 118,190 184,170 242,165 Z"
        fill="#ffffff"
      />
    </g>
  );
}

// 5. Oval Mourning Template (Tang lễ / Kính viếng)
function OvalMourningTemplate() {
  return (
    <g>
      <defs>
        <linearGradient id="mourningGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
      </defs>

      <ellipse cx="500" cy="210" rx="460" ry="195" fill="url(#mourningGrad)" stroke="#1e293b" strokeWidth="5" />
      <ellipse cx="500" cy="210" rx="445" ry="180" fill="none" stroke="#475569" strokeWidth="2" />
      <ellipse cx="500" cy="210" rx="430" ry="165" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="10,6" />

      {/* Lotus / Chrysanthemum flower ornament */}
      <g transform="translate(500, 360)">
        <circle cx="0" cy="0" r="12" fill="#cbd5e1" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse
            key={i}
            cx={Math.cos((angle * Math.PI) / 180) * 20}
            cy={Math.sin((angle * Math.PI) / 180) * 20}
            rx="10"
            ry="6"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="0.8"
            transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 20}, ${Math.sin((angle * Math.PI) / 180) * 20})`}
          />
        ))}
        <circle cx="0" cy="0" r="7" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
      </g>

      <g transform="translate(380, 368)">
        <circle cx="0" cy="0" r="9" fill="#cbd5e1" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <ellipse
            key={i}
            cx={Math.cos((angle * Math.PI) / 180) * 15}
            cy={Math.sin((angle * Math.PI) / 180) * 15}
            rx="8"
            ry="5"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="0.8"
            transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 15}, ${Math.sin((angle * Math.PI) / 180) * 15})`}
          />
        ))}
      </g>

      <g transform="translate(620, 368)">
        <circle cx="0" cy="0" r="9" fill="#cbd5e1" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <ellipse
            key={i}
            cx={Math.cos((angle * Math.PI) / 180) * 15}
            cy={Math.sin((angle * Math.PI) / 180) * 15}
            rx="8"
            ry="5"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="0.8"
            transform={`rotate(${angle}, ${Math.cos((angle * Math.PI) / 180) * 15}, ${Math.sin((angle * Math.PI) / 180) * 15})`}
          />
        ))}
      </g>

      <text x="500" y="50" fontSize="16" fill="#334155" opacity="0.8" textAnchor="middle">✦ ✦ ✦</text>

      <rect x="75" y="170" width="8" height="40" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <path d="M 79,170 C 79,160 83,155 79,148 C 75,155 79,160 79,170" fill="#fbbf24" />
      <rect x="917" y="170" width="8" height="40" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <path d="M 921,170 C 921,160 925,155 921,148 C 917,155 921,160 921,170" fill="#fbbf24" />
    </g>
  );
}

const SvgCardCanvas: React.FC<SvgCardCanvasProps> = ({ config, uid }) => {
  const isDiecut = config.templateId.startsWith('diecut');

  const renderTemplate = () => {
    if (config.templateId === 'custom-upload' && config.customBgUrl) {
      return (
        <image
          href={config.customBgUrl}
          width="1000"
          height="420"
          preserveAspectRatio="xMidYMid meet"
        />
      );
    }
    switch (config.templateId) {
      case 'diecut-red-heart':
        return <DiecutRedHeartTemplate />;
      case 'diecut-gold-luxury':
        return <DiecutGoldLuxuryTemplate />;
      case 'diecut-blue-fresh':
        return <DiecutBlueFreshTemplate />;
      case 'diecut-purple-sweet':
        return <DiecutPurpleSweetTemplate />;
      case 'oval-mourning':
        return <OvalMourningTemplate />;
      default:
        return <DiecutRedHeartTemplate />;
    }
  };

  // Determine stroke colors based on template
  const getOutlineColors = () => {
    switch (config.templateId) {
      case 'diecut-red-heart':
        return { outer: '#dc2626', middle: '#fda4af', inner: '#ffffff' };
      case 'diecut-gold-luxury':
        return { outer: '#b45309', middle: '#fde047', inner: '#ffffff' };
      case 'diecut-blue-fresh':
        return { outer: '#1d4ed8', middle: '#93c5fd', inner: '#ffffff' };
      case 'diecut-purple-sweet':
        return { outer: '#7e22ce', middle: '#f0abfc', inner: '#ffffff' };
      default:
        return { outer: '#dc2626', middle: '#fda4af', inner: '#ffffff' };
    }
  };

  const outlines = getOutlineColors();

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

      {/* 1. Background silhouette template */}
      {renderTemplate()}

      {/* 2. For Die-cut templates, render multi-layered stroke passes for compound sticker effect */}
      {isDiecut && (
        <>
          {/* Pass A: Outer bold stroke contour */}
          {config.lines.map((line) => (
            <text
              key={`outer-stroke-${line.id}`}
              fontFamily={line.fontFamily}
              fontSize={line.fontSize}
              fontWeight={line.fontWeight}
              fontStyle={line.fontStyle}
              fill="none"
              stroke={outlines.outer}
              strokeWidth={Math.max(line.fontSize * 0.45, 26)}
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

          {/* Pass B: Middle soft glow stroke contour */}
          {config.lines.map((line) => (
            <text
              key={`middle-stroke-${line.id}`}
              fontFamily={line.fontFamily}
              fontSize={line.fontSize}
              fontWeight={line.fontWeight}
              fontStyle={line.fontStyle}
              fill="none"
              stroke={outlines.middle}
              strokeWidth={Math.max(line.fontSize * 0.28, 16)}
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

          {/* Pass C: Inner white halo stroke */}
          {config.lines.map((line) => (
            <text
              key={`inner-stroke-${line.id}`}
              fontFamily={line.fontFamily}
              fontSize={line.fontSize}
              fontWeight={line.fontWeight}
              fontStyle={line.fontStyle}
              fill="none"
              stroke={outlines.inner}
              strokeWidth={Math.max(line.fontSize * 0.14, 8)}
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
        </>
      )}

      {/* 3. Foreground Text Layer (Sharp vector face) */}
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

      {/* 4. Decorative Hearts / Stars on accents (Giống hệt mẫu thực tế) */}
      {config.decorationType === 'hearts' && isDiecut && (
        <g>
          {/* Hearts on top line (Chúc Mừng) */}
          <HeartIcon x={310} y={105} size={24} rotate={-15} fill={outlines.outer} />
          <HeartIcon x={520} y={88} size={26} rotate={10} fill={outlines.outer} />
          <HeartIcon x={690} y={130} size={22} rotate={20} fill={outlines.outer} />

          {/* Hearts on bottom line (Ngày Phụ Nữ Việt Nam 20-10) */}
          <HeartIcon x={115} y={235} size={22} rotate={-10} fill={outlines.outer} />
          <HeartIcon x={270} y={225} size={25} rotate={15} fill={outlines.outer} />
          <HeartIcon x={420} y={228} size={23} rotate={-8} fill={outlines.outer} />
          <HeartIcon x={540} y={230} size={22} rotate={12} fill={outlines.outer} />
          <HeartIcon x={675} y={232} size={24} rotate={-15} fill={outlines.outer} />
        </g>
      )}

      {config.decorationType === 'stars' && isDiecut && (
        <g>
          <StarIcon x={310} y={105} size={14} fill={outlines.outer} />
          <StarIcon x={520} y={85} size={16} fill={outlines.outer} />
          <StarIcon x={690} y={130} size={12} fill={outlines.outer} />
          <StarIcon x={115} y={235} size={13} fill={outlines.outer} />
          <StarIcon x={270} y={225} size={15} fill={outlines.outer} />
          <StarIcon x={420} y={228} size={14} fill={outlines.outer} />
          <StarIcon x={675} y={232} size={14} fill={outlines.outer} />
        </g>
      )}
    </svg>
  );
};

export default SvgCardCanvas;
