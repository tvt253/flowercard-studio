import React from 'react';
import { useCardStore } from '../store/useCardStore';
import SvgCardCanvas from './SvgCardCanvas';

const A4PreviewArea: React.FC = () => {
  const { config } = useCardStore();

  const copies = Array.from({ length: config.copiesPerPage }, (_, i) => i);

  return (
    <div className="flex flex-col items-center">
      {/* Scale hint */}
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
        <span>📄 Khổ A4 (210 × 297mm)</span>
        <span>•</span>
        <span>
          {config.copiesPerPage === 1
            ? `1 bản đặt dọc (${config.scalePercent}% chiều dài A4)`
            : `${config.copiesPerPage} bản đặt ngang (${config.scalePercent}% chiều rộng A4)`}
        </span>
        {config.showCutLines && (
          <>
            <span>•</span>
            <span className="text-rose-600 font-medium">✂️ Viền cắt 0.5cm</span>
          </>
        )}
      </div>

      {/* Tờ giấy A4 kích thước chuẩn 210mm x 297mm */}
      <div
        id="a4-print-area"
        className="a4-paper bg-white relative overflow-hidden"
        style={{
          width: '210mm',
          height: '297mm',
          boxShadow: '0 4px 28px rgba(0,0,0,0.15)',
        }}
      >
        {config.copiesPerPage === 1 ? (
          // Trường hợp 1 bản: Đặt DỌC theo chiều dài tờ giấy A4 (~80% chiều dài 297mm)
          <div
            className="absolute top-1/2 left-1/2 flex items-center justify-center"
            style={{
              transform: 'translate(-50%, -50%) rotate(90deg)',
              width: `${(297 * config.scalePercent) / 100}mm`,
              maxWidth: '280mm',
            }}
          >
            <SvgCardCanvas config={config} uid="copy-single" />
          </div>
        ) : (
          // Trường hợp 2 bản (hoặc 3, 4 bản): Đặt NGANG từ trên xuống dưới (~95% chiều rộng tờ A4)
          <div
            className="w-full h-full flex flex-col items-center justify-around box-border"
            style={{
              padding: config.copiesPerPage === 2 ? '10mm 4mm' : '6mm 3mm',
            }}
          >
            {copies.map((i) => (
              <div
                key={i}
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: `${config.scalePercent}%`,
                  maxWidth: '100%',
                }}
              >
                <SvgCardCanvas config={config} uid={`copy-${i}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info text */}
      <p className="text-xs text-slate-400 mt-3 text-center max-w-sm">
        💡 Nhấn <strong>"In Trực Tiếp (A4)"</strong> để in qua máy in hoặc <strong>"Xuất PDF"</strong> để lưu file in sắc nét.
      </p>
    </div>
  );
};

export default A4PreviewArea;
