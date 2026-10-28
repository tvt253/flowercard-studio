import React, { useState, useRef, useEffect } from 'react';
import { useCardStore } from '../store/useCardStore';
import { TextLine } from '../types/card';
import SvgCardCanvas from './SvgCardCanvas';
import {
  Bold,
  Italic,
  Check,
  Edit3,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Minimize2,


  Printer,
  FileDown,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';
import { handlePrint, handleExportPDF, updatePrintHeadStyle } from '../utils/exportUtils';
import { FONT_OPTIONS } from '../constants/fonts';
import { calculateCardMetrics, calculateAutoFitFontSize } from '../utils/cardScaleUtils';

interface DirectFloatingToolbarProps {
  line: TextLine;
  globalFontFamily: string;
  positionMode: 'top' | 'bottom';
  onUpdateLine: (id: string, updates: Partial<TextLine>) => void;
  onToggleTextCase: (id: string) => void;
  onAddLine?: () => void;
  onRemoveLine?: (id: string) => void;
  canRemove?: boolean;
  onClose: () => void;
}

const DirectFloatingToolbar: React.FC<DirectFloatingToolbarProps> = ({
  line,
  globalFontFamily,
  positionMode,
  onUpdateLine,
  onToggleTextCase,
  onAddLine,
  onRemoveLine,
  canRemove = true,
  onClose,
}) => {
  const [textValue, setTextValue] = useState(line.text);
  const [hasChanges, setHasChanges] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cỡ chữ: cho phép nhập trực tiếp số hoặc bấm +/-
  const [fontSizeInput, setFontSizeInput] = useState<string>(String(line.fontSize));

  // Đồng bộ khi dòng chọn hoặc text gốc thay đổi
  useEffect(() => {
    setTextValue(line.text);
    setHasChanges(false);
  }, [line.id, line.text]);

  // Đồng bộ cỡ chữ khi line.fontSize thay đổi từ ngoài (ví dụ bấm nút Fit hoặc đổi mẫu)
  useEffect(() => {
    setFontSizeInput(String(line.fontSize));
  }, [line.fontSize]);

  const commitText = (newText: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (newText !== line.text) {
      onUpdateLine(line.id, { text: newText });
    }
    setHasChanges(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setTextValue(nextVal);
    setHasChanges(nextVal !== line.text);

    // Tự động cập nhật mượt sau 350ms ngừng gõ
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      commitText(nextVal);
    }, 350);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitText(textValue);
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleBlur = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    commitText(textValue);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setFontSizeInput(valStr);
    const num = parseInt(valStr, 10);
    if (!isNaN(num) && num >= 16 && num <= 150) {
      onUpdateLine(line.id, { fontSize: num });
    }
  };

  const handleFontSizeBlur = () => {
    const num = parseInt(fontSizeInput, 10);
    if (isNaN(num) || num < 16) {
      setFontSizeInput('16');
      onUpdateLine(line.id, { fontSize: 16 });
    } else if (num > 150) {
      setFontSizeInput('150');
      onUpdateLine(line.id, { fontSize: 150 });
    } else {
      setFontSizeInput(String(num));
      onUpdateLine(line.id, { fontSize: num });
    }
  };

  const handleDone = () => {
    commitText(textValue);
    onClose();
  };

  return (
    <div
      className="absolute z-30 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-rose-300 rounded-xl p-2 shadow-2xl flex flex-col gap-1.5 ring-4 ring-rose-500/10 print:hidden animate-in fade-in zoom-in-95 duration-150 w-[95%] sm:w-auto max-w-[500px]"
      style={positionMode === 'top' ? { top: '-84px' } : { bottom: '-84px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* DÒNG 1: Ô NHẬP TEXT + ICON THÊM DÒNG + ICON XÓA (ICON ONLY, RÚT GỌN KÍCH THƯỚC) */}
      <div className="flex items-center gap-1.5 w-full">
        {/* Ô nhập trực tiếp nội dung chữ */}
        <div className="relative flex-1 flex items-center min-w-0">
          <input
            type="text"
            value={textValue}
            autoFocus
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full px-2.5 py-1 text-sm font-bold text-slate-800 bg-rose-50/70 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 pr-16 h-7"
            placeholder="Nhập nội dung chữ..."
          />
          {hasChanges && (
            <button
              onClick={() => commitText(textValue)}
              title="Áp dụng ngay (hoặc bấm Enter)"
              className="absolute right-1 px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 hover:bg-rose-600 text-white rounded transition-colors shadow-2xs"
            >
              Lưu ↵
            </button>
          )}
        </div>

        {/* Icon Thêm dòng (icon only, không dùng chữ) */}
        {onAddLine && (
          <button
            onClick={onAddLine}
            className="w-7 h-7 flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white rounded-md shadow-2xs transition-colors flex-shrink-0"
            title="Thêm dòng chữ mới"
          >
            <Plus size={15} />
          </button>
        )}

        {/* Icon Xóa dòng (icon only, không dùng chữ) */}
        {onRemoveLine && canRemove && (
          <button
            onClick={() => {
              if (window.confirm(`Bạn có chắc muốn xóa dòng "${line.text}" không?`)) {
                onRemoveLine(line.id);
              }
            }}
            className="w-7 h-7 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md shadow-2xs transition-colors flex-shrink-0"
            title="Xóa dòng chữ này"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* DÒNG 2: CÁC NÚT ĐIỀU CHỈNH & NÚT XONG */}
      <div className="flex items-center gap-1.5 w-full pt-1.5 border-t border-slate-100 justify-start overflow-x-auto">
        {/* Nút chuyển đổi kiểu chữ Aa: Viết hoa đầu từ -> IN HOA TOÀN BỘ -> Chữ thường */}
        <button
          onClick={() => onToggleTextCase(line.id)}
          className={clsx(
            'w-7 h-7 text-xs font-bold rounded-md border transition-all flex items-center justify-center shadow-xs flex-shrink-0',
            (!line.textCase || line.textCase === 'capitalize')
              ? 'bg-rose-500 text-white border-rose-600'
              : line.textCase === 'uppercase'
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
          )}
          title={
            (!line.textCase || line.textCase === 'capitalize')
              ? 'Đang bật: Viết Hoa Đầu Từ - Bấm để chuyển'
              : line.textCase === 'uppercase'
              ? 'Đang bật: IN HOA TOÀN BỘ (CAPSLOCK) - Bấm để chuyển'
              : 'Đang bật: Chữ thường - Bấm để chuyển'
          }
        >
          <span>
            {(!line.textCase || line.textCase === 'capitalize')
              ? 'Aa'
              : line.textCase === 'uppercase'
              ? 'AA'
              : 'aa'}
          </span>
        </button>

        {/* Chọn font trực tiếp cho dòng */}
        <select
          value={line.fontFamily || ''}
          onChange={(e) => onUpdateLine(line.id, { fontFamily: e.target.value || undefined })}
          className="h-7 px-1.5 py-0 text-xs border border-slate-200 rounded-md bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-rose-400 max-w-[105px] flex-shrink-0"
          style={{ fontFamily: line.fontFamily || globalFontFamily }}
          title="Chọn font chữ cho dòng này"
        >
          <option value="">(Font chung)</option>
          <optgroup label="🔤 Font IN HOA">
            {FONT_OPTIONS.filter((f) => f.category === 'uppercase').map((f) => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                {f.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="✍️ Thư Pháp & Nghệ Thuật">
            {FONT_OPTIONS.filter((f) => f.category === 'calligraphy').map((f) => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                {f.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="🏛️ Cổ Điển & Hiện Đại">
            {FONT_OPTIONS.filter((f) => f.category === 'classic').map((f) => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                {f.label}
              </option>
            ))}
          </optgroup>
        </select>

        {/* Cụm cỡ chữ: Nút [-] + Nhập trực tiếp số + Nút [+] */}
        <div className="flex items-center bg-slate-100 rounded-md p-0.5 text-xs text-slate-700 flex-shrink-0 border border-slate-200 h-7">
          <button
            type="button"
            onClick={() =>
              onUpdateLine(line.id, {
                fontSize: Math.max(16, line.fontSize - 2),
              })
            }
            className="w-4 h-full flex items-center justify-center hover:text-rose-600 font-bold text-slate-600 hover:bg-white rounded transition-colors"
            title="Giảm 2px"
          >
            -
          </button>
          <div className="flex items-center px-0.5">
            <input
              type="number"
              min={16}
              max={150}
              value={fontSizeInput}
              onChange={handleFontSizeChange}
              onBlur={handleFontSizeBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              className="w-8 h-5 text-center font-bold text-[11px] bg-white text-slate-800 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              title="Nhập trực tiếp cỡ chữ (16 - 150px)"
            />
            <span className="text-[10px] text-slate-400 font-medium px-0.5 select-none">px</span>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateLine(line.id, {
                fontSize: Math.min(150, line.fontSize + 2),
              })
            }
            className="w-4 h-full flex items-center justify-center hover:text-rose-600 font-bold text-slate-600 hover:bg-white rounded transition-colors"
            title="Tăng 2px"
          >
            +
          </button>
        </div>

        {/* Nút Tự Động Fit Cỡ Chữ */}
        <button
          onClick={() => {
            const autoSize = calculateAutoFitFontSize(
              textValue,
              line.fontFamily || globalFontFamily,
              line.fontSize,
              line.fontWeight,
              line.letterSpacing,
              780
            );
            onUpdateLine(line.id, { fontSize: autoSize });
          }}
          className="h-7 flex items-center gap-1 px-1.5 py-0 text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-md shadow-2xs transition-colors flex-shrink-0"
          title="Tự động tính cỡ chữ vừa khít chiều ngang khung thiệp"
        >
          <Sparkles size={11} className="text-amber-600" />
          <span>Fit</span>
        </button>

        {/* Nút di chuyển vị trí dọc Offset Y */}
        <div className="h-7 flex items-center gap-0.5 bg-slate-100 rounded-md p-0.5 flex-shrink-0 border border-slate-200">
          <button
            onClick={() =>
              onUpdateLine(line.id, {
                offsetY: Math.max(60, line.offsetY - 10),
              })
            }
            className="w-4 h-full flex items-center justify-center hover:text-rose-600 rounded text-slate-600 hover:bg-white"
            title="Di chuyển lên trên"
          >
            <ArrowUp size={11} />
          </button>
          <button
            onClick={() =>
              onUpdateLine(line.id, {
                offsetY: Math.min(360, line.offsetY + 10),
              })
            }
            className="w-4 h-full flex items-center justify-center hover:text-rose-600 rounded text-slate-600 hover:bg-white"
            title="Di chuyển xuống dưới"
          >
            <ArrowDown size={11} />
          </button>
        </div>

        {/* Nút In đậm & Nghiêng */}
        <div className="h-7 flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={() =>
              onUpdateLine(line.id, {
                fontWeight: line.fontWeight === 'bold' ? 'normal' : 'bold',
              })
            }
            className={clsx(
              'w-5 h-7 text-xs rounded transition-colors flex items-center justify-center',
              line.fontWeight === 'bold'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            )}
            title="In đậm"
          >
            <Bold size={11} />
          </button>
          <button
            onClick={() =>
              onUpdateLine(line.id, {
                fontStyle: line.fontStyle === 'italic' ? 'normal' : 'italic',
              })
            }
            className={clsx(
              'w-5 h-7 text-xs rounded transition-colors flex items-center justify-center',
              line.fontStyle === 'italic'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            )}
            title="Nghiêng"
          >
            <Italic size={11} />
          </button>
        </div>

        {/* Nút Xong (đưa xuống cuối Dòng 2) */}
        <button
          onClick={handleDone}
          className="h-7 ml-auto flex items-center gap-1 px-2.5 py-0 text-xs bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-md shadow-xs transition-colors flex-shrink-0"
          title="Hoàn tất chỉnh sửa"
        >
          <Check size={12} />
          <span>Xong</span>
        </button>
      </div>
    </div>
  );
};

interface A4PreviewAreaProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const A4PreviewArea: React.FC<A4PreviewAreaProps> = ({
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const { config, updateLine, toggleLineTextCase, addLine, removeLine } = useCardStore();
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  const copies = Array.from({ length: config.copiesPerPage }, (_, i) => i);
  const isLandscape = config.copiesPerPage === 1;

  // Dong bo style in an va PDF trong document.head theo huong giay
  useEffect(() => {
    updatePrintHeadStyle(isLandscape);
  }, [isLandscape]);

  // Dòng đang được chọn để chỉnh sửa
  const selectedLine = config.lines.find((l) => l.id === selectedLineId);

  // Tính toán vị trí nổi của popup editor theo tỷ lệ scale thực tế của dòng chữ
  const { centerY, cloudScale, ovalTextScale } = calculateCardMetrics(config);
  const isOval = config.styleType === 'oval-red' || config.styleType === 'oval-black';
  const activeScale = isOval ? ovalTextScale : cloudScale;
  const visualLineY = selectedLine
    ? centerY + (selectedLine.offsetY - centerY) * activeScale
    : 210;
  // positionMode: dòng nửa trên (<=210) đặt toolbar ở trên (top: -54px), dòng nửa dưới (>210) đặt ở dưới (bottom: -54px)
  const positionMode: 'top' | 'bottom' = visualLineY <= 210 ? 'top' : 'bottom';

  const handleAddLine = () => {
    addLine();
    setTimeout(() => {
      const lines = useCardStore.getState().config.lines;
      if (lines.length > 0) {
        setSelectedLineId(lines[lines.length - 1].id);
      }
    }, 50);
  };

  const handleRemoveLine = (id: string) => {
    removeLine(id);
    setSelectedLineId(null);
  };

  // Đóng bảng chọn và highlight trước khi in hoặc xuất PDF
  const onPrint = () => {
    setSelectedLineId(null);
    setTimeout(() => {
      handlePrint(isLandscape);
    }, 50);
  };

  const onExportPDF = () => {
    setSelectedLineId(null);
    setTimeout(() => {
      handleExportPDF(isLandscape);
    }, 50);
  };

  return (
    <div
      className={clsx(
        "print-wrapper flex flex-col items-center select-none w-full max-w-none p-0",
        isFullscreen && "h-full justify-center"
      )}
    >
      {/* Dynamic Print Styles for A4 Landscape (1 copy) vs Portrait (2 copies) */}
      <style>{`
        @media print {
          @page {
            size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'};
            margin: 3.5mm !important;
          }
          *, [filter], .card-shadow-filter {
            filter: none !important;
            -webkit-filter: none !important;
            aspect-ratio: unset !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
          html, body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          #app-root, main, .print-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .a4-paper {
            width: ${isLandscape ? '290mm' : '203mm'} !important;
            height: ${isLandscape ? '203mm' : '290mm'} !important;
            max-width: ${isLandscape ? '290mm' : '203mm'} !important;
            max-height: ${isLandscape ? '203mm' : '290mm'} !important;
            aspect-ratio: unset !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 auto !important;
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

      {/* FLOATING BAR IN FULLSCREEN MODE */}
      {isFullscreen && (
        <div className="fixed top-4 z-50 flex items-center gap-2.5 px-4 py-2 bg-slate-900/95 text-white backdrop-blur-md rounded-full shadow-2xl border border-slate-700/60 print:hidden">
          <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mr-1">
            🌸 Preview Full
          </span>

          <span className="text-xs text-slate-400 hidden sm:inline">
            {isLandscape
              ? 'A4 Ngang (1 bản)'
              : config.copiesPerPage === 3
              ? 'A4 Đứng (3 bản - 1 dòng)'
              : 'A4 Đứng (2 bản)'}
          </span>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Nút In Trực Tiếp */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1 px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-semibold transition-colors shadow-sm"
          >
            <Printer size={13} /> In A4
          </button>

          {/* Nút Xuất PDF */}
          <button
            onClick={onExportPDF}
            className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-full text-xs font-semibold transition-colors shadow-sm"
          >
            <FileDown size={13} /> Xuất PDF
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Nút Thoát Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            className="flex items-center gap-1 px-3 py-1 bg-red-600/90 hover:bg-red-600 text-white rounded-full text-xs font-bold transition-colors shadow-sm"
            title="Thoát toàn màn hình (phím ESC)"
          >
            <Minimize2 size={13} /> Thoát (ESC)
          </button>
        </div>
      )}

      {/* THANH ĐIỀU KHIỂN CHÍNH (MASTER ACTION BAR) - SÁT LỀ TRÊN, STICKY KHI CUỘN */}
      {!isFullscreen && (
        <div className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-3 py-2 flex flex-wrap items-center justify-between gap-2.5 print:hidden">
          {/* BÊN TRÁI: DÒNG CHỮ HƯỚNG DẪN / TRẠNG THÁI & CHỌN NHANH DÒNG */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 min-w-0">
              <Edit3 size={14} className="text-rose-500 flex-shrink-0" />
              {selectedLine ? (
                <span className="truncate">
                  Đang sửa:{' '}
                  <strong className="text-rose-600 font-bold">
                    {selectedLine.text.length > 25
                      ? selectedLine.text.slice(0, 25) + '...'
                      : selectedLine.text}
                  </strong>
                </span>
              ) : (
                <span className="text-slate-500 font-medium truncate">
                  Nhấp chuột trực tiếp vào dòng chữ trên thiệp để sửa nhanh nội dung
                </span>
              )}
            </div>

            {/* Nút chọn nhanh dòng chữ & Thêm dòng */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {config.lines.map((line, idx) => (
                <button
                  key={line.id}
                  onClick={() => setSelectedLineId(selectedLineId === line.id ? null : line.id)}
                  className={clsx(
                    'px-2 py-0.5 rounded text-[11px] font-bold transition-colors',
                    selectedLineId === line.id
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  )}
                >
                  Dòng {idx + 1}
                </button>
              ))}

              {/* Nút Thêm dòng trên thanh công cụ sau Dòng 1, Dòng 2 */}
              <button
                onClick={handleAddLine}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors shadow-2xs"
                title="Thêm dòng chữ mới vào thiệp"
              >
                <Plus size={11} />
                <span>Thêm dòng</span>
              </button>

              {selectedLineId && (
                <button
                  onClick={() => setSelectedLineId(null)}
                  className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded text-xs leading-none"
                  title="Đóng thanh chỉnh sửa"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* BÊN PHẢI: CÁC NÚT CHỨC NĂNG (XEM ĐẦY ĐỦ MÀU ẤM CẠNH IN A4, XUẤT PDF) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Nút Xem đầy đủ (màu ấm hổ phách/amber cạnh nút In A4) */}
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-all shadow-sm shadow-amber-100"
                title="Xem thiệp ở chế độ toàn màn hình"
              >
                <Maximize2 size={14} />
                <span>Xem đầy đủ</span>
              </button>
            )}

            {/* Nút In A4 nhanh */}
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm shadow-rose-100"
              title="In trực tiếp ra máy in khổ A4"
            >
              <Printer size={14} />
              <span>In A4</span>
            </button>

            {/* Nút Xuất PDF nhanh */}
            <button
              onClick={onExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              title="Xuất file PDF chuẩn 1 trang A4"
            >
              <FileDown size={14} />
              <span>Xuất PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* VÙNG CHỨA TỜ GIẤY A4 */}
      <div className={clsx(
        "w-full flex flex-col items-center px-2 sm:px-3",
        isFullscreen ? "h-full justify-center py-0" : "py-3"
      )}>
        <div
        id="a4-print-area"
        className="a4-paper bg-white relative transition-all duration-300 mx-auto overflow-hidden"
        style={{
          width: '100%',
          maxWidth: isFullscreen
            ? isLandscape
              ? 'min(calc(100vw - 2rem), calc((100vh - 5rem) * 297 / 210))'
              : 'min(calc(100vw - 2rem), calc((100vh - 5rem) * 210 / 297))'
            : isLandscape
            ? '100%'
            : 'min(210mm, 100%)',
          maxHeight: isFullscreen ? 'calc(100vh - 5rem)' : undefined,
          height: 'auto',
          aspectRatio: isLandscape ? '297 / 210' : '210 / 297',
          boxShadow: isFullscreen
            ? '0 12px 40px rgba(0,0,0,0.5)'
            : '0 8px 30px rgba(0,0,0,0.12)',
        }}
        onClick={(e) => {
          // Bấm ra vùng giấy trắng thì đóng editor nổi
          if ((e.target as HTMLElement).id === 'a4-print-area') {
            setSelectedLineId(null);
          }
        }}
      >
        {isLandscape ? (
          // 1 BẢN TRÊN GIẤY A4 XOAY NGANG (297mm x 210mm) - Chữ nằm ngang tự nhiên, mặc định 95% căn giữa
          <div className="w-full h-full flex items-center justify-center p-1.5 relative">
            <div
              className="relative flex items-center justify-center transition-all duration-200 mx-auto"
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
                <DirectFloatingToolbar
                  line={selectedLine}
                  globalFontFamily={config.globalFontFamily}
                  positionMode={positionMode}
                  onUpdateLine={updateLine}
                  onToggleTextCase={toggleLineTextCase}
                  onAddLine={handleAddLine}
                  onRemoveLine={handleRemoveLine}
                  canRemove={config.lines.length > 1}
                  onClose={() => setSelectedLineId(null)}
                />
              )}
            </div>
          </div>
        ) : (
          // 2 HOẶC 3 BẢN TRÊN GIẤY A4 ĐỨNG (210mm x 297mm) - Xếp tầng trên dưới, mặc định 95% căn giữa
          <div
            className={clsx(
              "w-full h-full flex flex-col items-center relative",
              config.copiesPerPage === 3
                ? "justify-evenly py-1 px-1"
                : "justify-around py-1.5 px-1"
            )}
          >
            {copies.map((i) => (
              <div
                key={i}
                className="relative flex items-center justify-center transition-all duration-200 mx-auto"
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
                  <DirectFloatingToolbar
                    line={selectedLine}
                    globalFontFamily={config.globalFontFamily}
                    positionMode={positionMode}
                    onUpdateLine={updateLine}
                    onToggleTextCase={toggleLineTextCase}
                    onAddLine={handleAddLine}
                    onRemoveLine={handleRemoveLine}
                    canRemove={config.lines.length > 1}
                    onClose={() => setSelectedLineId(null)}
                  />
                )}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>




  </div>
  );
};

export default A4PreviewArea;
