import React from 'react';
import { useCardStore } from '../store/useCardStore';
import SvgCardCanvas from './SvgCardCanvas';
import { clsx } from 'clsx';

const A4PreviewArea: React.FC = () => {
  const { config } = useCardStore();

  const copies = Array.from({ length: config.copiesPerPage }, (_, i) => i);

  return (
    <div className="flex flex-col items-center">
      {/* Scale hint */}
      <p className="text-xs text-slate-400 mb-3">
        Xem trước tờ A4 — {config.copiesPerPage} bản / tờ — Kích thước: {config.scalePercent}%
      </p>

      {/* A4 paper */}
      <div
        id="a4-print-area"
        className="a4-paper"
        style={{
          width: '210mm',
          minHeight: '297mm',
          background: 'white',
          position: 'relative',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        }}
      >
        <div
          className="card-wrapper"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '8mm 5mm',
            gap: '6mm',
            height: '100%',
            boxSizing: 'border-box',
          }}
        >
          {copies.map((i) => (
            <div
              key={i}
              className={clsx(
                'card-item flex-shrink-0',
                config.showCutLines && 'cut-line'
              )}
              style={{
                width: `${config.scalePercent}%`,
                maxWidth: '100%',
              }}
            >
              <SvgCardCanvas
                config={config}
                uid={`copy-${i}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Info text */}
      <p className="text-xs text-slate-400 mt-3 text-center max-w-xs">
        💡 Nhấn <strong>"In Trực Tiếp (A4)"</strong> để in qua trình duyệt hoặc <strong>"Xuất PDF"</strong> để tải file về máy.
      </p>
    </div>
  );
};

export default A4PreviewArea;
