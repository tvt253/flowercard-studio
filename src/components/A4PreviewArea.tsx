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
  PanelLeftClose,
  PanelLeftOpen,
  Printer,
  FileDown,
} from 'lucide-react';
import { clsx } from 'clsx';
import { handlePrint, handleExportPDF } from '../utils/exportUtils';
import { FONT_OPTIONS } from '../constants/fonts';
import { calculateCardMetrics } from '../utils/cardScaleUtils';

interface DirectFloatingToolbarProps {
  line: TextLine;
  globalFontFamily: string;
  topPercent: number;
  onUpdateLine: (id: string, updates: Partial<TextLine>) => void;
  onToggleTextCase: (id: string) => void;
  onClose: () => void;
}

const DirectFloatingToolbar: React.FC<DirectFloatingToolbarProps> = ({
  line,
  globalFontFamily,
  topPercent,
  onUpdateLine,
  onToggleTextCase,
  onClose,
}) => {
  const [textValue, setTextValue] = useState(line.text);
  const [hasChanges, setHasChanges] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Đồng bộ khi dòng chọn hoặc text gốc thay đổi
  useEffect(() => {
    setTextValue(line.text);
    setHasChanges(false);
  }, [line.id, line.text]);

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

  const handleDone = () => {
    commitText(textValue);
    onClose();
  };

  return (
    <div
      className="absolute z-30 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-rose-300 rounded-xl p-2 shadow-2xl flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 ring-4 ring-rose-500/10 print:hidden animate-in fade-in zoom-in-95 duration-150 max-w-[96vw]"
      style={{
        top: `${topPercent}%`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Ô nhập trực tiếp nội dung chữ: gõ phím siêu nhẹ, không lag */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={textValue}
          autoFocus
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="px-3 py-1.5 text-sm font-bold text-slate-800 bg-rose-50/70 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 w-[280px] sm:w-[380px] md:w-[450px] max-w-[75vw] pr-20"
          placeholder="Nhập nội dung chữ..."
        />
        {hasChanges && (
          <button
            onClick={() => commitText(textValue)}
            title="Áp dụng ngay (hoặc bấm Enter)"
            className="absolute right-1 px-2 py-0.5 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded transition-colors shadow-xs"
          >
            Áp dụng ↵
          </button>
        )}
      </div>

      {/* Nút chuyển đổi kiểu chữ Aa: Viết hoa đầu từ -> IN HOA TOÀN BỘ -> Chữ thường */}
      <button
        onClick={() => onToggleTextCase(line.id)}
        className={clsx(
          'px-2 py-1 text-xs font-bold rounded-md border transition-all flex items-center gap-1 shadow-sm',
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
        className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-rose-400 max-w-[130px]"
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

      {/* Nút cỡ chữ */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-md px-1.5 py-0.5 text-xs text-slate-700">
        <button
          onClick={() =>
            onUpdateLine(line.id, {
              fontSize: Math.max(20, line.fontSize - 4),
            })
          }
          className="hover:text-rose-600 font-bold px-1"
          title="Giảm cỡ chữ"
        >
          -
        </button>
        <span className="font-bold w-9 text-center text-[11px]">
          {line.fontSize}px
        </span>
        <button
          onClick={() =>
            onUpdateLine(line.id, {
              fontSize: Math.min(120, line.fontSize + 4),
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
            onUpdateLine(line.id, {
              offsetY: Math.max(60, line.offsetY - 10),
            })
          }
          className="p-1 hover:text-rose-600 rounded text-slate-600 hover:bg-white"
          title="Di chuyển lên trên"
        >
          <ArrowUp size={12} />
        </button>
        <button
          onClick={() =>
            onUpdateLine(line.id, {
              offsetY: Math.min(360, line.offsetY + 10),
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
            onUpdateLine(line.id, {
              fontWeight: line.fontWeight === 'bold' ? 'normal' : 'bold',
            })
          }
          className={clsx(
            'p-1 text-xs rounded transition-colors',
            line.fontWeight === 'bold'
              ? 'bg-rose-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            'p-1 text-xs rounded transition-colors',
            line.fontStyle === 'italic'
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
        onClick={handleDone}
        className="flex items-center gap-1 px-2.5 py-1 text-xs bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-md shadow-sm transition-colors"
      >
        <Check size={12} /> Xong
      </button>
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
  isSidebarOpen = true,
  onToggleSidebar,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const { config, updateLine, toggleLineTextCase } = useCardStore();
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  const copies = Array.from({ length: config.copiesPerPage }, (_, i) => i);
  const isLandscape = config.copiesPerPage === 1;

  // Dòng đang được chọn để chỉnh sửa
  const selectedLine = config.lines.find((l) => l.id === selectedLineId);

  // Tính toán vị trí nổi của popup editor theo tỷ lệ scale thực tế của dòng chữ
  const { centerY, cloudScale, ovalTextScale } = calculateCardMetrics(config);
  const isOval = config.styleType === 'oval-red' || config.styleType === 'oval-black';
  const activeScale = isOval ? ovalTextScale : cloudScale;
  const visualLineY = selectedLine
    ? centerY + (selectedLine.offsetY - centerY) * activeScale
    : 210;
  const popupTopPercent = Math.max(5, Math.min(80, (visualLineY / 420) * 100 - 22));

  return (
    <div className="print-wrapper flex flex-col items-center select-none w-full max-w-none px-1 sm:px-2 py-2">
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
            width: 100% !important;
            height: 100% !important;
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
            onClick={() => handlePrint(isLandscape)}
            className="flex items-center gap-1 px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-semibold transition-colors shadow-sm"
          >
            <Printer size={13} /> In A4
          </button>

          {/* Nút Xuất PDF */}
          <button
            onClick={() => handleExportPDF(isLandscape)}
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

      {/* THANH ĐIỀU KHIỂN CHÍNH (MASTER ACTION BAR) */}
      {!isFullscreen && (
        <div className="w-full max-w-[800px] mb-2.5 flex flex-wrap items-center justify-between gap-2 p-2 bg-white/95 backdrop-blur border border-slate-200 rounded-xl shadow-sm print:hidden">
          <div className="flex items-center gap-2">
            {/* Nút Ẩn / Hiện Cài Đặt */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm',
                  isSidebarOpen
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
                )}
                title={isSidebarOpen ? 'Ẩn bảng cài đặt để xem thiệp to và rõ hơn' : 'Mở bảng cài đặt'}
              >
                {isSidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
                <span>{isSidebarOpen ? 'Ẩn Cài Đặt' : 'Hiện Cài Đặt'}</span>
              </button>
            )}

            {/* Nút Xem Toàn Màn Hình (Preview Full) */}
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm shadow-indigo-100"
                title="Xem thiệp ở chế độ toàn màn hình không có thanh công cụ"
              >
                <Maximize2 size={15} />
                <span>Preview Full</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Nút In A4 nhanh */}
            <button
              onClick={() => handlePrint(isLandscape)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm shadow-rose-100"
              title="In trực tiếp ra máy in khổ A4"
            >
              <Printer size={14} />
              <span>In A4</span>
            </button>

            {/* Nút Xuất PDF nhanh */}
            <button
              onClick={() => handleExportPDF(isLandscape)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              title="Xuất file PDF chuẩn 1 trang A4"
            >
              <FileDown size={14} />
              <span>Xuất PDF</span>
            </button>
          </div>
        </div>
      )}

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
          width: isLandscape ? 'min(297mm, 100%)' : 'min(210mm, 100%)',
          aspectRatio: isLandscape ? '297 / 210' : '210 / 297',
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
                  topPercent={popupTopPercent}
                  onUpdateLine={updateLine}
                  onToggleTextCase={toggleLineTextCase}
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
                    topPercent={popupTopPercent}
                    onUpdateLine={updateLine}
                    onToggleTextCase={toggleLineTextCase}
                    onClose={() => setSelectedLineId(null)}
                  />
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
