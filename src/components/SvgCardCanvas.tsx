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
    return `M 80,${y + c * 0.55} C 350,${y - c * 1.85} 650,${y + c * 1.85} 920,${y - c * 0.55}`;
  } else if (line.curveType === 'arc') {
    return `M 80,${y + c * 0.5} Q 500,${y - c * 1.7} 920,${y + c * 0.5}`;
  } else {
    return `M 80,${y} L 920,${y}`;
  }
}

function RibbonRedTemplate() {
  return (
    <g>
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="ribbonRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="100%" stopColor="#fecdd3" />
        </linearGradient>
        <linearGradient id="ribbonRedBorder" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
      </defs>

      {/* Main ribbon background - S-curved wave shape */}
      <path
        d="M 0,60 C 150,20 350,100 500,60 C 650,20 850,100 1000,60 L 1000,360 C 850,400 650,320 500,360 C 350,400 150,320 0,360 Z"
        fill="url(#ribbonRedGrad)"
        stroke="url(#ribbonRedBorder)"
        strokeWidth="4"
      />

      {/* Inner decorative wavy line - top */}
      <path
        d="M 30,85 C 180,55 320,115 500,85 C 680,55 820,115 970,85"
        fill="none"
        stroke="#f43f5e"
        strokeWidth="1.5"
        strokeDasharray="6,4"
        opacity="0.6"
      />

      {/* Inner decorative wavy line - bottom */}
      <path
        d="M 30,335 C 180,365 320,305 500,335 C 680,365 820,305 970,335"
        fill="none"
        stroke="#f43f5e"
        strokeWidth="1.5"
        strokeDasharray="6,4"
        opacity="0.6"
      />

      {/* Left ribbon tail fold */}
      <path
        d="M 0,60 L -30,10 L 0,30 Z"
        fill="#be123c"
        opacity="0.8"
      />
      <path
        d="M 0,360 L -30,410 L 0,390 Z"
        fill="#be123c"
        opacity="0.8"
      />

      {/* Right ribbon tail fold */}
      <path
        d="M 1000,60 L 1030,10 L 1000,30 Z"
        fill="#be123c"
        opacity="0.8"
      />
      <path
        d="M 1000,360 L 1030,410 L 1000,390 Z"
        fill="#be123c"
        opacity="0.8"
      />

      {/* Three rose flowers in the center bottom */}
      {/* Center rose */}
      <g transform="translate(490, 338)">
        {/* Leaves */}
        <ellipse cx="-22" cy="-5" rx="14" ry="7" fill="#16a34a" transform="rotate(-30, -22, -5)" />
        <ellipse cx="22" cy="-5" rx="14" ry="7" fill="#16a34a" transform="rotate(30, 22, -5)" />
        <ellipse cx="0" cy="-8" rx="10" ry="5" fill="#15803d" transform="rotate(0, 0, -8)" />
        {/* Rose petals */}
        <circle cx="0" cy="-20" r="12" fill="#f43f5e" opacity="0.85" />
        <circle cx="10" cy="-14" r="11" fill="#e11d48" opacity="0.9" />
        <circle cx="-10" cy="-14" r="11" fill="#e11d48" opacity="0.9" />
        <circle cx="12" cy="-24" r="10" fill="#f43f5e" opacity="0.85" />
        <circle cx="-12" cy="-24" r="10" fill="#f43f5e" opacity="0.85" />
        <circle cx="0" cy="-30" r="10" fill="#fb7185" opacity="0.9" />
        {/* Center */}
        <circle cx="0" cy="-20" r="5" fill="#9f1239" />
      </g>

      {/* Left rose */}
      <g transform="translate(420, 348)">
        <ellipse cx="-18" cy="-4" rx="12" ry="6" fill="#16a34a" transform="rotate(-35, -18, -4)" />
        <ellipse cx="18" cy="-4" rx="12" ry="6" fill="#16a34a" transform="rotate(35, 18, -4)" />
        <circle cx="0" cy="-16" r="10" fill="#f43f5e" opacity="0.85" />
        <circle cx="8" cy="-11" r="9" fill="#e11d48" opacity="0.9" />
        <circle cx="-8" cy="-11" r="9" fill="#e11d48" opacity="0.9" />
        <circle cx="0" cy="-24" r="9" fill="#fb7185" opacity="0.9" />
        <circle cx="0" cy="-16" r="4" fill="#9f1239" />
      </g>

      {/* Right rose */}
      <g transform="translate(560, 348)">
        <ellipse cx="-18" cy="-4" rx="12" ry="6" fill="#16a34a" transform="rotate(-35, -18, -4)" />
        <ellipse cx="18" cy="-4" rx="12" ry="6" fill="#16a34a" transform="rotate(35, 18, -4)" />
        <circle cx="0" cy="-16" r="10" fill="#f43f5e" opacity="0.85" />
        <circle cx="8" cy="-11" r="9" fill="#e11d48" opacity="0.9" />
        <circle cx="-8" cy="-11" r="9" fill="#e11d48" opacity="0.9" />
        <circle cx="0" cy="-24" r="9" fill="#fb7185" opacity="0.9" />
        <circle cx="0" cy="-16" r="4" fill="#9f1239" />
      </g>

      {/* Decorative dots pattern */}
      <circle cx="80" cy="210" r="3" fill="#fda4af" opacity="0.6" />
      <circle cx="100" cy="210" r="3" fill="#fda4af" opacity="0.6" />
      <circle cx="900" cy="210" r="3" fill="#fda4af" opacity="0.6" />
      <circle cx="920" cy="210" r="3" fill="#fda4af" opacity="0.6" />
    </g>
  );
}

function RibbonGoldTemplate() {
  return (
    <g>
      <defs>
        <linearGradient id="ribbonGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fefce8" />
          <stop offset="50%" stopColor="#fef9c3" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <linearGradient id="ribbonGoldBorder" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="goldRoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Main ribbon */}
      <path
        d="M 0,60 C 150,20 350,100 500,60 C 650,20 850,100 1000,60 L 1000,360 C 850,400 650,320 500,360 C 350,400 150,320 0,360 Z"
        fill="url(#ribbonGoldGrad)"
        stroke="url(#ribbonGoldBorder)"
        strokeWidth="4"
      />

      {/* Inner stitching pattern - top */}
      <path
        d="M 30,85 C 180,55 320,115 500,85 C 680,55 820,115 970,85"
        fill="none"
        stroke="#d97706"
        strokeWidth="1.5"
        strokeDasharray="8,5"
        opacity="0.7"
      />

      {/* Inner stitching pattern - bottom */}
      <path
        d="M 30,335 C 180,365 320,305 500,335 C 680,365 820,305 970,335"
        fill="none"
        stroke="#d97706"
        strokeWidth="1.5"
        strokeDasharray="8,5"
        opacity="0.7"
      />

      {/* Gold star decorations */}
      <text x="50" y="220" fontSize="20" fill="#d97706" opacity="0.8" textAnchor="middle">✦</text>
      <text x="950" y="220" fontSize="20" fill="#d97706" opacity="0.8" textAnchor="middle">✦</text>
      <text x="500" y="80" fontSize="14" fill="#d97706" opacity="0.6" textAnchor="middle">✦ ✦ ✦</text>
      <text x="500" y="358" fontSize="14" fill="#d97706" opacity="0.6" textAnchor="middle">✦ ✦ ✦</text>

      {/* Golden rose flowers */}
      <g transform="translate(490, 338)">
        <ellipse cx="-22" cy="-5" rx="14" ry="7" fill="#166534" transform="rotate(-30, -22, -5)" />
        <ellipse cx="22" cy="-5" rx="14" ry="7" fill="#166534" transform="rotate(30, 22, -5)" />
        <circle cx="0" cy="-20" r="12" fill="#fbbf24" opacity="0.85" />
        <circle cx="10" cy="-14" r="11" fill="#f59e0b" opacity="0.9" />
        <circle cx="-10" cy="-14" r="11" fill="#f59e0b" opacity="0.9" />
        <circle cx="12" cy="-24" r="10" fill="#fcd34d" opacity="0.85" />
        <circle cx="-12" cy="-24" r="10" fill="#fcd34d" opacity="0.85" />
        <circle cx="0" cy="-30" r="10" fill="#fde68a" opacity="0.9" />
        <circle cx="0" cy="-20" r="5" fill="#92400e" />
      </g>

      <g transform="translate(420, 348)">
        <ellipse cx="-18" cy="-4" rx="12" ry="6" fill="#166534" transform="rotate(-35, -18, -4)" />
        <ellipse cx="18" cy="-4" rx="12" ry="6" fill="#166534" transform="rotate(35, 18, -4)" />
        <circle cx="0" cy="-16" r="10" fill="#fbbf24" opacity="0.85" />
        <circle cx="8" cy="-11" r="9" fill="#f59e0b" opacity="0.9" />
        <circle cx="-8" cy="-11" r="9" fill="#f59e0b" opacity="0.9" />
        <circle cx="0" cy="-24" r="9" fill="#fde68a" opacity="0.9" />
        <circle cx="0" cy="-16" r="4" fill="#92400e" />
      </g>

      <g transform="translate(560, 348)">
        <ellipse cx="-18" cy="-4" rx="12" ry="6" fill="#166534" transform="rotate(-35, -18, -4)" />
        <ellipse cx="18" cy="-4" rx="12" ry="6" fill="#166534" transform="rotate(35, 18, -4)" />
        <circle cx="0" cy="-16" r="10" fill="#fbbf24" opacity="0.85" />
        <circle cx="8" cy="-11" r="9" fill="#f59e0b" opacity="0.9" />
        <circle cx="-8" cy="-11" r="9" fill="#f59e0b" opacity="0.9" />
        <circle cx="0" cy="-24" r="9" fill="#fde68a" opacity="0.9" />
        <circle cx="0" cy="-16" r="4" fill="#92400e" />
      </g>

      {/* Left & Right folds */}
      <path d="M 0,60 L -28,8 L 0,28 Z" fill="#b45309" opacity="0.85" />
      <path d="M 0,360 L -28,412 L 0,392 Z" fill="#b45309" opacity="0.85" />
      <path d="M 1000,60 L 1028,8 L 1000,28 Z" fill="#b45309" opacity="0.85" />
      <path d="M 1000,360 L 1028,412 L 1000,392 Z" fill="#b45309" opacity="0.85" />
    </g>
  );
}

function FanPinkTemplate() {
  return (
    <g>
      <defs>
        <linearGradient id="fanPinkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fdf2f8" />
          <stop offset="100%" stopColor="#fce7f3" />
        </linearGradient>
      </defs>

      {/* Fan-shaped semicircle - main body */}
      <path
        d="M 50,420 Q 50,30 500,20 Q 950,30 950,420 Z"
        fill="url(#fanPinkGrad)"
        stroke="#ec4899"
        strokeWidth="3.5"
      />

      {/* Fan ribs */}
      <line x1="500" y1="420" x2="170" y2="45" stroke="#fbcfe8" strokeWidth="1.5" opacity="0.7" />
      <line x1="500" y1="420" x2="290" y2="28" stroke="#fbcfe8" strokeWidth="1.5" opacity="0.7" />
      <line x1="500" y1="420" x2="500" y2="22" stroke="#fbcfe8" strokeWidth="1.5" opacity="0.7" />
      <line x1="500" y1="420" x2="710" y2="28" stroke="#fbcfe8" strokeWidth="1.5" opacity="0.7" />
      <line x1="500" y1="420" x2="830" y2="45" stroke="#fbcfe8" strokeWidth="1.5" opacity="0.7" />

      {/* Wavy border decoration */}
      <path
        d="M 55,415 Q 70,380 90,400 Q 110,420 130,390 Q 150,360 170,385 Q 190,410 210,378 Q 230,346 260,370 Q 290,394 330,360 Q 370,326 420,352 Q 470,378 500,355 Q 530,332 580,358 Q 630,384 670,352 Q 710,320 750,346 Q 790,372 820,345 Q 850,318 870,342 Q 890,366 920,340 Q 940,320 960,345 Q 975,365 945,415"
        fill="none"
        stroke="#ec4899"
        strokeWidth="2"
        opacity="0.5"
      />

      {/* Small flowers - left corner */}
      <g transform="translate(130, 350)">
        <circle cx="0" cy="0" r="8" fill="#f9a8d4" />
        <circle cx="12" cy="-6" r="7" fill="#ec4899" opacity="0.8" />
        <circle cx="-12" cy="-6" r="7" fill="#ec4899" opacity="0.8" />
        <circle cx="0" cy="-14" r="7" fill="#f472b6" />
        <circle cx="0" cy="0" r="3" fill="#be185d" />
        <ellipse cx="-18" cy="8" rx="10" ry="5" fill="#16a34a" transform="rotate(-20, -18, 8)" />
        <ellipse cx="18" cy="8" rx="10" ry="5" fill="#16a34a" transform="rotate(20, 18, 8)" />
      </g>

      {/* Small flowers - right corner */}
      <g transform="translate(870, 350)">
        <circle cx="0" cy="0" r="8" fill="#f9a8d4" />
        <circle cx="12" cy="-6" r="7" fill="#ec4899" opacity="0.8" />
        <circle cx="-12" cy="-6" r="7" fill="#ec4899" opacity="0.8" />
        <circle cx="0" cy="-14" r="7" fill="#f472b6" />
        <circle cx="0" cy="0" r="3" fill="#be185d" />
        <ellipse cx="-18" cy="8" rx="10" ry="5" fill="#16a34a" transform="rotate(-20, -18, 8)" />
        <ellipse cx="18" cy="8" rx="10" ry="5" fill="#16a34a" transform="rotate(20, 18, 8)" />
      </g>

      {/* Center dot decoration */}
      <circle cx="500" cy="420" r="12" fill="#ec4899" />
      <circle cx="500" cy="420" r="7" fill="#be185d" />

      {/* Decorative dots along arc */}
      <circle cx="200" cy="110" r="4" fill="#f9a8d4" opacity="0.8" />
      <circle cx="350" cy="50" r="4" fill="#f9a8d4" opacity="0.8" />
      <circle cx="500" cy="35" r="4" fill="#f9a8d4" opacity="0.8" />
      <circle cx="650" cy="50" r="4" fill="#f9a8d4" opacity="0.8" />
      <circle cx="800" cy="110" r="4" fill="#f9a8d4" opacity="0.8" />
    </g>
  );
}

function CloudMintTemplate() {
  return (
    <g>
      <defs>
        <linearGradient id="cloudMintGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f0fdf4" />
          <stop offset="100%" stopColor="#d1fae5" />
        </linearGradient>
      </defs>

      {/* Cloud/oval wavy shape */}
      <path
        d="M 80,210 
           C 80,80 180,30 280,40 
           C 330,20 380,10 420,15 
           C 450,5 480,0 500,0 
           C 520,0 550,5 580,15 
           C 620,10 670,20 720,40 
           C 820,30 920,80 920,210 
           C 920,340 820,400 720,390 
           C 670,410 620,420 580,415 
           C 550,425 520,430 500,430 
           C 480,430 450,425 420,415 
           C 380,420 330,410 280,390 
           C 180,400 80,340 80,210 Z"
        fill="url(#cloudMintGrad)"
        stroke="#059669"
        strokeWidth="3"
      />

      {/* Inner wavy border */}
      <path
        d="M 105,210 
           C 105,95 198,50 293,60 
           C 340,42 388,33 425,38 
           C 455,28 482,23 500,23 
           C 518,23 545,28 575,38 
           C 612,33 660,42 707,60 
           C 802,50 895,95 895,210 
           C 895,325 802,370 707,360 
           C 660,378 612,387 575,382 
           C 545,392 518,397 500,397 
           C 482,397 455,392 425,382 
           C 388,387 340,378 293,360 
           C 198,370 105,325 105,210 Z"
        fill="none"
        stroke="#34d399"
        strokeWidth="1.5"
        strokeDasharray="8,5"
        opacity="0.7"
      />

      {/* Decorative mint stars */}
      <text x="160" y="200" fontSize="18" fill="#059669" opacity="0.7" textAnchor="middle">❋</text>
      <text x="840" y="200" fontSize="18" fill="#059669" opacity="0.7" textAnchor="middle">❋</text>
      <text x="500" y="60" fontSize="14" fill="#10b981" opacity="0.6" textAnchor="middle">✿ ✿ ✿</text>
      <text x="500" y="390" fontSize="14" fill="#10b981" opacity="0.6" textAnchor="middle">✿ ✿ ✿</text>

      {/* Small leaf decorations */}
      <ellipse cx="150" cy="350" rx="18" ry="8" fill="#16a34a" transform="rotate(-30, 150, 350)" opacity="0.8" />
      <ellipse cx="185" cy="365" rx="15" ry="7" fill="#15803d" transform="rotate(-15, 185, 365)" opacity="0.8" />
      <ellipse cx="850" cy="350" rx="18" ry="8" fill="#16a34a" transform="rotate(30, 850, 350)" opacity="0.8" />
      <ellipse cx="815" cy="365" rx="15" ry="7" fill="#15803d" transform="rotate(15, 815, 365)" opacity="0.8" />
    </g>
  );
}

function OvalMourningTemplate() {
  return (
    <g>
      <defs>
        <linearGradient id="mourningGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
      </defs>

      {/* Outer oval frame */}
      <ellipse cx="500" cy="210" rx="460" ry="195" fill="url(#mourningGrad)" stroke="#1e293b" strokeWidth="5" />
      {/* Middle oval border */}
      <ellipse cx="500" cy="210" rx="445" ry="180" fill="none" stroke="#475569" strokeWidth="2" />
      {/* Inner oval border */}
      <ellipse cx="500" cy="210" rx="430" ry="165" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="10,6" />

      {/* Lotus/chrysanthemum flowers at bottom center */}
      {/* Center flower */}
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

      {/* Left flower */}
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
        <circle cx="0" cy="0" r="5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
      </g>

      {/* Right flower */}
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
        <circle cx="0" cy="0" r="5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
      </g>

      {/* Top small ornament */}
      <text x="500" y="50" fontSize="16" fill="#334155" opacity="0.8" textAnchor="middle">✦ ✦ ✦</text>

      {/* Candle icons at sides */}
      <rect x="75" y="170" width="8" height="40" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <path d="M 79,170 C 79,160 83,155 79,148 C 75,155 79,160 79,170" fill="#fbbf24" />
      <rect x="917" y="170" width="8" height="40" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <path d="M 921,170 C 921,160 925,155 921,148 C 917,155 921,160 921,170" fill="#fbbf24" />
    </g>
  );
}

const SvgCardCanvas: React.FC<SvgCardCanvasProps> = ({ config, uid }) => {
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
      case 'ribbon-red':
        return <RibbonRedTemplate />;
      case 'ribbon-gold':
        return <RibbonGoldTemplate />;
      case 'fan-pink':
        return <FanPinkTemplate />;
      case 'cloud-mint':
        return <CloudMintTemplate />;
      case 'oval-mourning':
        return <OvalMourningTemplate />;
      default:
        return <RibbonRedTemplate />;
    }
  };

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

      {/* Background template */}
      {renderTemplate()}

      {/* Text layers */}
      {config.lines.map((line) => (
        <text
          key={line.id}
          fontFamily={line.fontFamily}
          fontSize={line.fontSize}
          fontWeight={line.fontWeight}
          fontStyle={line.fontStyle}
          fill={line.color}
          stroke={line.strokeWidth > 0 ? line.strokeColor : 'none'}
          strokeWidth={line.strokeWidth}
          strokeLinejoin="round"
          paintOrder="stroke"
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
