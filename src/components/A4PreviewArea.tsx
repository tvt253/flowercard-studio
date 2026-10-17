import React from 'react';
import { useCardStore } from '../store/useCardStore';
import SvgCardCanvas from './SvgCardCanvas';

const A4PreviewArea: React.FC = () => {
  const { config } = useCardStore();

  const copies = Array.from({ length: config.copiesPerPage }, (_, i) => i);

  return (
    <div className="flex flex-col items-center">
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
          // 1 bản: Đặt dọc vừa với chiều dài tờ giấy A4 (297mm)
          <div
            className="absolute top-1/2 left-1/2 flex items-center justify-center"
            style={{
              transform: 'translate(-50%, -50%) rotate(90deg)',
              width: `${(297 * config.scalePercent) / 100}mm`,
            }}
          >
            <SvgCardCanvas config={config} uid="copy-single" />
          </div>
        ) : (
          // 2 bản: Đặt ngang vừa với chiều rộng tờ giấy A4 (210mm)
          <div className="w-full h-full flex flex-col items-center justify-around box-border p-0">
            {copies.map((i) => (
              <div
                key={i}
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: `${config.scalePercent}%`,
                }}
              >
                <SvgCardCanvas config={config} uid={`copy-${i}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        Nhấn <strong>In Trực Tiếp</strong> để in hoặc <strong>Xuất PDF</strong> để tải file in.
      </p>
    </div>
  );
};

export default A4PreviewArea;
