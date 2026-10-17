import React, { useRef } from 'react';
import { useCardStore } from '../store/useCardStore';
import { TextLine, PresetName } from '../types/card';
import {
  Plus,
  Trash2,
  Bold,
  Italic,
  RotateCcw,
  Upload,
  Printer,
  FileDown,
  Layers,
  Shapes,
} from 'lucide-react';
import { clsx } from 'clsx';

const FONT_OPTIONS = [
  { label: 'Dancing Script (Đẹp chuẩn mẫu)', value: 'Dancing Script' },
  { label: 'Great Vibes (Thư pháp bay)', value: 'Great Vibes' },
  { label: 'Alex Brush (Mềm mại)', value: 'Alex Brush' },
  { label: 'Pacifico (Trẻ trung)', value: 'Pacifico' },
  { label: 'Playfair Display (Sang trọng)', value: 'Playfair Display' },
  { label: 'Cormorant Garamond (Trang nghiêm)', value: 'Cormorant Garamond' },
  { label: 'Montserrat (Hiện đại)', value: 'Montserrat' },
];

const PRESET_OPTIONS: { label: string; value: PresetName }[] = [
  { label: '🌹 20/10 - Phụ Nữ VN', value: '20-10' },
  { label: '📚 20/11 - Nhà Giáo VN', value: '20-11' },
  { label: '💐 8/3 - Quốc Tế PN', value: '8-3' },
  { label: '🎊 Khai Trương (Vàng Kim)', value: 'khai-truong' },
  { label: '🎂 Sinh Nhật (Tím Pastel)', value: 'sinh-nhat' },
  { label: '🕊️ Chia Buồn (Trang Nghiêm)', value: 'chia-buon' },
];

const CURVE_TYPE_OPTIONS = [
  { label: 'Vòm Cung Tự Nhiên', value: 'arc' },
  { label: 'Thẳng Ngang', value: 'flat' },
  { label: 'Lượn Sóng Nhẹ', value: 'wave' },
];

interface LineEditorProps {
  line: TextLine;
  index: number;
  onUpdate: (id: string, updates: Partial<TextLine>) => void;
  onRemove: (id: string) => void;
}

const LineEditor: React.FC<LineEditorProps> = ({ line, index, onUpdate, onRemove }) => {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Line header */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-xs font-semibold text-slate-700">
          Dòng {index + 1}: <span className="font-normal text-slate-500">"{line.text}"</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(line.id);
            }}
            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Xóa dòng này"
          >
            <Trash2 size={13} />
          </button>
          <span className="text-slate-400 text-xs">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="p-3 space-y-3">
          {/* Text input */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Nội dung chữ</label>
            <input
              type="text"
              value={line.text}
              onChange={(e) => onUpdate(line.id, { text: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
              placeholder="Nhập nội dung..."
            />
          </div>

          {/* Font & Style row */}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Font chữ</label>
              <select
                value={line.fontFamily}
                onChange={(e) => onUpdate(line.id, { fontFamily: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-400"
                style={{ fontFamily: line.fontFamily }}
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onUpdate(line.id, { fontWeight: line.fontWeight === 'bold' ? 'normal' : 'bold' })}
                className={clsx(
                  'px-2 py-1.5 text-xs border rounded font-bold transition-colors',
                  line.fontWeight === 'bold'
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                )}
                title="Bold"
              >
                <Bold size={13} />
              </button>
              <button
                onClick={() => onUpdate(line.id, { fontStyle: line.fontStyle === 'italic' ? 'normal' : 'italic' })}
                className={clsx(
                  'px-2 py-1.5 text-xs border rounded italic transition-colors',
                  line.fontStyle === 'italic'
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                )}
                title="Italic"
              >
                <Italic size={13} />
              </button>
            </div>
          </div>

          {/* Color row */}
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Màu mặt chữ</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={line.color}
                  onChange={(e) => onUpdate(line.id, { color: e.target.value })}
                  className="w-8 h-7 rounded cursor-pointer border border-slate-200"
                />
                <span className="text-xs text-slate-500 font-mono">{line.color}</span>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Viền mỏng nét ({line.strokeWidth}px)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={line.strokeColor}
                  onChange={(e) => onUpdate(line.id, { strokeColor: e.target.value })}
                  className="w-8 h-7 rounded cursor-pointer border border-slate-200"
                />
                <input
                  type="range"
                  min={0}
                  max={6}
                  step={0.5}
                  value={line.strokeWidth}
                  onChange={(e) => onUpdate(line.id, { strokeWidth: parseFloat(e.target.value) })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Font size slider */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
              <span>Cỡ chữ:</span>
              <span className="text-rose-500 font-bold">{line.fontSize}px</span>
            </div>
            <input
              type="range"
              min={24}
              max={110}
              value={line.fontSize}
              onChange={(e) => onUpdate(line.id, { fontSize: parseInt(e.target.value) })}
            />
          </div>

          {/* Letter spacing */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
              <span>Khoảng cách chữ:</span>
              <span className="text-rose-500 font-bold">{line.letterSpacing}px</span>
            </div>
            <input
              type="range"
              min={-2}
              max={15}
              step={0.5}
              value={line.letterSpacing}
              onChange={(e) => onUpdate(line.id, { letterSpacing: parseFloat(e.target.value) })}
            />
          </div>

          {/* Curve type */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Kiểu uốn chữ</label>
            <div className="flex gap-1">
              {CURVE_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdate(line.id, { curveType: opt.value as TextLine['curveType'] })}
                  className={clsx(
                    'flex-1 px-1 py-1 text-xs border rounded transition-colors',
                    line.curveType === opt.value
                      ? 'bg-rose-500 border-rose-500 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Curve strength */}
          {line.curveType !== 'flat' && (
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Độ cong:</span>
                <span className="text-rose-500 font-bold">{line.curveStrength}</span>
              </div>
              <input
                type="range"
                min={-60}
                max={60}
                value={line.curveStrength}
                onChange={(e) => onUpdate(line.id, { curveStrength: parseInt(e.target.value) })}
              />
            </div>
          )}

          {/* Offset Y */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
              <span>Vị trí dòng (Offset Y):</span>
              <span className="text-rose-500 font-bold">{line.offsetY}px</span>
            </div>
            <input
              type="range"
              min={60}
              max={360}
              value={line.offsetY}
              onChange={(e) => onUpdate(line.id, { offsetY: parseInt(e.target.value) })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ControlSidebar: React.FC = () => {
  const {
    config,
    addLine,
    removeLine,
    updateLine,
    updateConfig,
    addStrokeLayer,
    removeStrokeLayer,
    updateStrokeLayer,
    applyPreset,
    resetDefault,
  } = useCardStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateConfig({ customBgUrl: url });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('a4-print-area');
    if (!element) return;

    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: 0,
      filename: 'flowercard-sticker.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <aside className="w-[340px] h-screen bg-white border-r border-slate-200 flex flex-col overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white flex-shrink-0">
        <h1 className="text-base font-bold tracking-wide flex items-center gap-1.5">
          🌸 FlowerCard Studio
        </h1>
        <p className="text-xs text-rose-200 mt-0.5">Bế viền chữ xếp tầng & in thiệp giỏ hoa</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Section 1: Presets Dịp Lễ */}
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2.5">
            📋 Mẫu Dịp Lễ & Màu Sắc Chuẩn
          </h2>

          <div className="grid grid-cols-2 gap-1.5">
            {PRESET_OPTIONS.map((p) => (
              <button
                key={p.value}
                onClick={() => applyPreset(p.value)}
                className="px-2 py-1.5 text-xs bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-300 rounded transition-colors text-slate-600 text-left"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Tải ảnh phôi riêng */}
          <div className="mt-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs border border-dashed border-slate-300 rounded hover:border-rose-400 hover:text-rose-500 text-slate-500 transition-colors"
            >
              <Upload size={12} /> Tải ảnh phôi riêng (.png, .jpg)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Section 2: Dáng Tổng Thể Thiệp (Envelope Shape) */}
        <div className="p-4 border-b border-slate-100 bg-rose-50/40">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Shapes size={14} className="text-rose-600" />
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              Dáng Tổng Thể Thiệp
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Độ phồng bao ngoài:</span>
                <span className="text-rose-600 font-bold">{config.envelopePadding}px</span>
              </div>
              <input
                type="range"
                min={10}
                max={70}
                value={config.envelopePadding}
                onChange={(e) => updateConfig({ envelopePadding: parseInt(e.target.value) })}
              />
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tự động bám theo lớp viền ngoài cùng tạo dáng liền khối đầy đặn.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.fillInnerGaps}
                onChange={(e) => updateConfig({ fillInnerGaps: e.target.checked })}
                className="w-4 h-4 accent-rose-500"
              />
              <span className="text-xs text-slate-600 font-medium">
                Lấp đầy khoảng hở giữa các dòng chữ
              </span>
            </label>
          </div>
        </div>

        {/* Section 3: Hệ Thống Các Lớp Viền Stroke (Xếp Tầng) */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Layers size={14} className="text-rose-600" />
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                Lớp Viền Stroke ({config.strokeLayers.length} lớp)
              </h2>
            </div>
            <button
              onClick={addStrokeLayer}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors shadow-sm"
              title="Thêm một lớp viền mới"
            >
              <Plus size={12} /> Thêm lớp viền
            </button>
          </div>

          <div className="space-y-2">
            {config.strokeLayers.map((layer, index) => (
              <div
                key={layer.id}
                className="p-2 border border-slate-200 rounded-lg bg-slate-50/70 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={layer.enabled}
                      onChange={(e) => updateStrokeLayer(layer.id, { enabled: e.target.checked })}
                      className="w-3.5 h-3.5 accent-rose-500"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      {layer.name || `Lớp ${index + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Color picker */}
                    <input
                      type="color"
                      value={layer.color}
                      onChange={(e) => updateStrokeLayer(layer.id, { color: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border border-slate-300"
                      title="Chọn màu lớp viền này"
                    />
                    {/* Delete button */}
                    {config.strokeLayers.length > 1 && (
                      <button
                        onClick={() => removeStrokeLayer(layer.id)}
                        className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors"
                        title="Xóa lớp viền này"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Width slider */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Độ rộng viền:</span>
                    <span className="font-bold text-rose-600">{layer.width}px</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={70}
                    value={layer.width}
                    onChange={(e) => updateStrokeLayer(layer.id, { width: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: A4 Layout */}
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3">
            📄 Kích Thước & Dàn Trang A4
          </h2>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Kích thước thiệp:</span>
                <span className="text-rose-500 font-bold">{config.scalePercent}%</span>
              </div>
              <input
                type="range"
                min={30}
                max={100}
                value={config.scalePercent}
                onChange={(e) => updateConfig({ scalePercent: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Số bản in / tờ A4</label>
              <div className="grid grid-cols-4 gap-1">
                {([1, 2, 3, 4] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => updateConfig({ copiesPerPage: n })}
                    className={clsx(
                      'py-1.5 text-xs border rounded font-medium transition-colors',
                      config.copiesPerPage === n
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {n} {n === 2 ? '✓' : ''}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">✓ = Chuẩn mẫu thực tế (2 bản / 1 tờ A4)</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.showCutLines}
                onChange={(e) => updateConfig({ showCutLines: e.target.checked })}
                className="w-4 h-4 accent-rose-500"
              />
              <span className="text-xs text-slate-600">Đường kẻ nét đứt hướng dẫn cắt ✂️</span>
            </label>
          </div>
        </div>

        {/* Section 5: Line Editors */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              ✍️ Chỉnh Sửa Dòng Chữ
            </h2>
            <button
              onClick={addLine}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
            >
              <Plus size={12} /> Thêm dòng
            </button>
          </div>

          <div className="space-y-2">
            {config.lines.map((line, index) => (
              <LineEditor
                key={line.id}
                line={line}
                index={index}
                onUpdate={updateLine}
                onRemove={removeLine}
              />
            ))}

            {config.lines.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded">
                Chưa có dòng chữ nào. Nhấn "Thêm dòng" để bắt đầu.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 flex-shrink-0 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded transition-colors shadow-sm"
          >
            <Printer size={13} /> In Trực Tiếp (A4)
          </button>
          <button
            onClick={handleExportPDF}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded transition-colors shadow-sm"
          >
            <FileDown size={13} /> Xuất PDF
          </button>
        </div>
        <button
          onClick={resetDefault}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-rose-500 border border-slate-200 hover:border-rose-300 rounded transition-colors bg-white"
        >
          <RotateCcw size={11} /> Đặt lại mẫu gốc (20/10)
        </button>
      </div>
    </aside>
  );
};

export default ControlSidebar;
