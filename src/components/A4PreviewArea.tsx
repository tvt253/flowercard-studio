import React, { useState } from 'react';
import { useCardStore } from '../store/useCardStore';
import SvgCardCanvas from './SvgCardCanvas';
import { Bold, Italic, Check, Edit3, ArrowUp, ArrowDown } from 'lucide-react';
import { clsx } from 'clsx';

const A4PreviewArea: React.FC = () => {
  const { config, updateLine, toggleLineTextCase } = useCardStore();
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  const copies = Array.from({ length: config.copiesPerPage }, (_, i) => i);
  const isLandscape = config.copiesPerPage === 1;

  // Dòng đang được chọn để chỉnh sửa
  const selectedLine = config.lines.find((l) => l.id === selectedLineId);

  return (
    <div className="print-wrapper flex flex-col items-center select-none w-full max-w-5xl py-2">
      {/* Dynamic Print Styles for A4 Landscape (1 copy) vs Portrait (2 copies) */}
      <style>{`
        @media print {
          @page {
            size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'};
            margin: 0 !important;
          }
          html, body {
            width: ${isLandscape ? '297mm' : '210mm'} !important;
            height: ${isLandscape ? '210mm' : '297mm'} !important;
            max-width: ${isLandscape ? '297mm' : '210mm'} !important;
            max-height: ${isLandscape ? '210mm' : '297mm'} !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          #app-root, main, .print-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            width: ${isLandscape ? '297mm' : '210mm'} !important;
            height: ${isLandscape ? '210mm' : '297mm'} !important;
            max-width: ${isLandscape ? '297mm' : '210mm'} !important;
            max-height: ${isLandscape ? '210mm' : '297mm'} !important;
            overflow: hidden !important;
            display: block !important;
          }
          .a4-paper {
            width: ${isLandscape ? '297mm' : '210mm'} !important;
            height: ${isLandscape ? '210mm' : '297mm'} !important;
            max-width: ${isLandscape ? '297mm' : '210mm'} !important;
            max-height: ${isLandscape ? '210mm' : '297mm'} !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-before: avoid !important;
            break-after: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Thanh công cụ thông báo hướng dẫn sửa trực tiếp trên Preview */}
      <div className="mb-3 flex items-center justify-between w-full max-w-[800px] px-3 py-1.5 bg-white/80 backdrop-blur border border-slate-200 rounded-lg shadow-sm text-xs text-slate-600 print:hidden">
        <div className="flex items-center gap-1.5 font-medium">
          <Edit3 size={13} className="text-rose-500 flex-shrink-0" />
          <span>
            {selectedLine ? (
              <span>
                Đang sửa:{' '}
                <strong className="text-rose-600">
                  {selectedLine.text.length > 25
                    ? selectedLine.text.slice(0, 25) + '...'
                    : selectedLine.text}
                </strong>
              </span>
            ) : (
              <span>Nhấp chuột trực tiếp vào dòng chữ trên thiệp để sửa nhanh nội dung</span>
            )}
          </span>
        </div>

        {/* Nút chọn nhanh dòng chữ */}
        <div className="flex items-center gap-1.5">
          {config.lines.map((line, idx) => (
            <button
              key={line.id}
              onClick={() => setSelectedLineId(selectedLineId === line.id ? null : line.id)}
              className={clsx(
                'px-2 py-0.5 rounded text-[11px] font-semibold transition-colors',
                selectedLineId === line.id
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              )}
            >
              Dòng {idx + 1}
            </button>
          ))}
          {selectedLineId && (
            <button
              onClick={() => setSelectedLineId(null)}
              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded"
              title="Đóng thanh chỉnh sửa"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* TỜ GIẤY A4: XOAY NGANG (297x210) KHI 1 BẢN, ĐỨNG (210x297) KHI 2 BẢN */}
      <div
        id="a4-print-area"
        className="a4-paper bg-white relative transition-all duration-300 mx-auto overflow-hidden"
        style={{
          width: isLandscape ? '297mm' : '210mm',
          height: isLandscape ? '210mm' : '297mm',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        }}
        onClick={(e) => {
          // Bấm ra vùng giấy trắng thì đóng editor nổi
          if ((e.target as HTMLElement).id === 'a4-print-area') {
            setSelectedLineId(null);
          }
        }}
      >
        {isLandscape ? (
          // 1 BẢN TRÊN GIẤY A4 XOAY NGANG (297mm x 210mm) - Chữ nằm ngang tự nhiên, scale lên đến 120%
          <div className="w-full h-full flex items-center justify-center p-3 relative">
            <div
              className="relative flex items-center justify-center transition-all duration-200"
              style={{
                width: `${config.scalePercent}%`,
              }}
            >
              <SvgCardCanvas
                config={config}
                uid="landscape-single"
                onSelectLine={(id) => setSelectedLineId(id)}
                selectedLineId={selectedLineId}
              />

              {/* BẢNG CHỈNH SỬA NỔI TRỰC TIẾP TRÊN CANVAS PREVIEW (KHI CHỌN DÒNG) */}
              {selectedLine && (
                <div
                  className="absolute z-30 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-rose-300 rounded-xl p-2 shadow-2xl flex items-center gap-2 ring-4 ring-rose-500/10 print:hidden animate-in fade-in zoom-in-95 duration-150"
                  style={{
                    top: `${Math.max(8, (selectedLine.offsetY / 420) * 100 - 20)}%`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Ô nhập trực tiếp nội dung chữ */}
                  <input
                    type="text"
                    value={selectedLine.text}
                    autoFocus
                    onChange={(e) => {
                      updateLine(selectedLine.id, { text: e.target.value });
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-slate-800 bg-rose-50/60 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 min-w-[220px]"
                    placeholder="Nhập nội dung chữ..."
                  />

                  {/* Nút chuyển đổi kiểu chữ Aa: Viết hoa đầu từ (Mặc định) -> IN HOA TOÀN BỘ -> Chữ thường */}
                  <button
                    onClick={() => toggleLineTextCase(selectedLine.id)}
                    className={clsx(
                      'px-2 py-1 text-xs font-bold rounded-md border transition-all flex items-center gap-1 shadow-sm',
                      (!selectedLine.textCase || selectedLine.textCase === 'capitalize')
                        ? 'bg-rose-500 text-white border-rose-600'
                        : selectedLine.textCase === 'uppercase'
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    )}
                    title={
                      (!selectedLine.textCase || selectedLine.textCase === 'capitalize')
                        ? 'Đang bật: Viết Hoa Đầu Từ (Chuẩn mẫu thiệp) - Bấm để chuyển'
                        : selectedLine.textCase === 'uppercase'
                        ? 'Đang bật: IN HOA TOÀN BỘ (CAPSLOCK) - Bấm để chuyển'
                        : 'Đang bật: Chữ thường - Bấm để chuyển'
                    }
                  >
                    <span>
                      {(!selectedLine.textCase || selectedLine.textCase === 'capitalize')
                        ? 'Aa'
                        : selectedLine.textCase === 'uppercase'
                        ? 'AA'
                        : 'aa'}
                    </span>
                  </button>

                  {/* Nút cỡ chữ */}
                  <div className="flex items-center gap-1 bg-slate-100 rounded-md px-1.5 py-0.5 text-xs text-slate-700">
                    <button
                      onClick={() =>
                        updateLine(selectedLine.id, {
                          fontSize: Math.max(20, selectedLine.fontSize - 4),
                        })
                      }
                      className="hover:text-rose-600 font-bold px-1"
                      title="Giảm cỡ chữ"
                    >
                      -
                    </button>
                    <span className="font-bold w-9 text-center text-[11px]">
                      {selectedLine.fontSize}px
                    </span>
                    <button
                      onClick={() =>
                        updateLine(selectedLine.id, {
                          fontSize: Math.min(120, selectedLine.fontSize + 4),
                        })
                      }
                      className="hover:text-rose-600 font-bold px-1"
                      title="Tăng cỡ chữ"
                    >
                      +
                    </button>
                  </div>

                  {/* Nút di chuyển vị trí dọc Offset Y */}
                  <div className="flex items-center gap-0.5 bg-slate-100 rounded-md p-0.5">
                    <button
                      onClick={() =>
                        updateLine(selectedLine.id, {
                          offsetY: Math.max(60, selectedLine.offsetY - 10),
                        })
                      }
                      className="p-1 hover:text-rose-600 rounded text-slate-600 hover:bg-white"
                      title="Di chuyển lên trên"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={() =>
                        updateLine(selectedLine.id, {
                          offsetY: Math.min(360, selectedLine.offsetY + 10),
                        })
                      }
                      className="p-1 hover:text-rose-600 rounded text-slate-600 hover:bg-white"
                      title="Di chuyển xuống dưới"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  {/* Nút In đậm & Nghiêng */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() =>
                        updateLine(selectedLine.id, {
                          fontWeight: selectedLine.fontWeight === 'bold' ? 'normal' : 'bold',
                        })
                      }
                      className={clsx(
                        'p-1 text-xs rounded transition-colors',
                        selectedLine.fontWeight === 'bold'
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                      title="In đậm"
                    >
                      <Bold size={11} />
                    </button>
                    <button
                      onClick={() =>
                        updateLine(selectedLine.id, {
                          fontStyle: selectedLine.fontStyle === 'italic' ? 'normal' : 'italic',
                        })
                      }
                      className={clsx(
                        'p-1 text-xs rounded transition-colors',
                        selectedLine.fontStyle === 'italic'
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                      title="Nghiêng"
                    >
                      <Italic size={11} />
                    </button>
                  </div>

                  {/* Nút Xong */}
                  <button
                    onClick={() => setSelectedLineId(null)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-md shadow-sm transition-colors"
                  >
                    <Check size={12} /> Xong
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // 2 BẢN TRÊN GIẤY A4 ĐỨNG (210mm x 297mm) - Xếp tầng trên dưới, scale lên đến 120%
          <div className="w-full h-full flex flex-col items-center justify-around p-3 relative">
            {copies.map((i) => (
              <div
                key={i}
                className="relative flex items-center justify-center transition-all duration-200"
                style={{
                  width: `${config.scalePercent}%`,
                }}
              >
                <SvgCardCanvas
                  config={config}
                  uid={`portrait-copy-${i}`}
                  onSelectLine={(id) => setSelectedLineId(id)}
                  selectedLineId={selectedLineId}
                />

                {/* BẢNG CHỈNH SỬA NỔI TRỰC TIẾP TRÊN BẢN IN ĐẦU TIÊN */}
                {i === 0 && selectedLine && (
                  <div
                    className="absolute z-30 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-rose-300 rounded-xl p-2 shadow-2xl flex items-center gap-2 ring-4 ring-rose-500/10 print:hidden animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      top: `${Math.max(5, (selectedLine.offsetY / 420) * 100 - 22)}%`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={selectedLine.text}
                      autoFocus
                      onChange={(e) => {
                        updateLine(selectedLine.id, { text: e.target.value });
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-slate-800 bg-rose-50/60 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 min-w-[200px]"
                      placeholder="Nhập nội dung chữ..."
                    />

                    {/* Nút chuyển đổi kiểu chữ Aa: Viết hoa đầu từ (Mặc định) -> IN HOA TOÀN BỘ -> Chữ thường */}
                    <button
                      onClick={() => toggleLineTextCase(selectedLine.id)}
                      className={clsx(
                        'px-2 py-1 text-xs font-bold rounded-md border transition-all flex items-center gap-1 shadow-sm',
                        (!selectedLine.textCase || selectedLine.textCase === 'capitalize')
                          ? 'bg-rose-500 text-white border-rose-600'
                          : selectedLine.textCase === 'uppercase'
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      )}
                      title={
                        (!selectedLine.textCase || selectedLine.textCase === 'capitalize')
                          ? 'Đang bật: Viết Hoa Đầu Từ (Chuẩn mẫu thiệp) - Bấm để chuyển'
                          : selectedLine.textCase === 'uppercase'
                          ? 'Đang bật: IN HOA TOÀN BỘ (CAPSLOCK) - Bấm để chuyển'
                          : 'Đang bật: Chữ thường - Bấm để chuyển'
                      }
                    >
                      <span>
                        {(!selectedLine.textCase || selectedLine.textCase === 'capitalize')
                          ? 'Aa'
                          : selectedLine.textCase === 'uppercase'
                          ? 'AA'
                          : 'aa'}
                      </span>
                    </button>

                    <div className="flex items-center gap-1 bg-slate-100 rounded-md px-1.5 py-0.5 text-xs text-slate-700">
                      <button
                        onClick={() =>
                          updateLine(selectedLine.id, {
                            fontSize: Math.max(20, selectedLine.fontSize - 4),
                          })
                        }
                        className="hover:text-rose-600 font-bold px-1"
                        title="Giảm cỡ chữ"
                      >
                        -
                      </button>
                      <span className="font-bold w-9 text-center text-[11px]">
                        {selectedLine.fontSize}px
                      </span>
                      <button
                        onClick={() =>
                          updateLine(selectedLine.id, {
                            fontSize: Math.min(120, selectedLine.fontSize + 4),
                          })
                        }
                        className="hover:text-rose-600 font-bold px-1"
                        title="Tăng cỡ chữ"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-0.5 bg-slate-100 rounded-md p-0.5">
                      <button
                        onClick={() =>
                          updateLine(selectedLine.id, {
                            offsetY: Math.max(60, selectedLine.offsetY - 10),
                          })
                        }
                        className="p-1 hover:text-rose-600 rounded text-slate-600 hover:bg-white"
                        title="Di chuyển lên trên"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() =>
                          updateLine(selectedLine.id, {
                            offsetY: Math.min(360, selectedLine.offsetY + 10),
                          })
                        }
                        className="p-1 hover:text-rose-600 rounded text-slate-600 hover:bg-white"
                        title="Di chuyển xuống dưới"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() =>
                          updateLine(selectedLine.id, {
                            fontWeight: selectedLine.fontWeight === 'bold' ? 'normal' : 'bold',
                          })
                        }
                        className={clsx(
                          'p-1 text-xs rounded transition-colors',
                          selectedLine.fontWeight === 'bold'
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        )}
                        title="In đậm"
                      >
                        <Bold size={11} />
                      </button>
                      <button
                        onClick={() =>
                          updateLine(selectedLine.id, {
                            fontStyle: selectedLine.fontStyle === 'italic' ? 'normal' : 'italic',
                          })
                        }
                        className={clsx(
                          'p-1 text-xs rounded transition-colors',
                          selectedLine.fontStyle === 'italic'
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                      title="Nghiêng"
                    >
                      <Italic size={11} />
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedLineId(null)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-md shadow-sm transition-colors"
                  >
                    <Check size={12} /> Xong
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

    <p className="text-xs text-slate-400 mt-3 text-center print:hidden">
      Nhấn <strong>In Trực Tiếp</strong> để in ra máy in hoặc <strong>Xuất PDF</strong> để lưu file in sắc nét.
    </p>
  </div>
  );
};

export default A4PreviewArea;
