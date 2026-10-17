import React from 'react';
import { useCardStore } from '../store/useCardStore';
import { TextLine, PresetName, StyleType } from '../types/card';
import {
  Plus,
  Trash2,
  Bold,
  Italic,
  RotateCcw,
  Printer,
  FileDown,
  Layers,
  Sparkles,
  Type,
  Cloud,
} from 'lucide-react';
import { clsx } from 'clsx';

const FONT_OPTIONS = [
  { label: 'Dancing Script', value: 'Dancing Script' },
  { label: 'Great Vibes', value: 'Great Vibes' },
  { label: 'Alex Brush', value: 'Alex Brush' },
  { label: 'Pacifico', value: 'Pacifico' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond' },
  { label: 'Montserrat', value: 'Montserrat' },
];

const STYLE_OPTIONS: { label: string; value: StyleType }[] = [
  { label: 'Kiểu Đám Mây', value: 'cloud' },
];

const PRESET_OPTIONS: { label: string; value: PresetName }[] = [
  { label: '20/10 - Phụ Nữ VN', value: '20-10' },
  { label: '20/11 - Nhà Giáo VN', value: '20-11' },
  { label: '8/3 - Quốc Tế PN', value: '8-3' },
  { label: 'Khai Trương', value: 'khai-truong' },
  { label: 'Sinh Nhật', value: 'sinh-nhat' },
  { label: 'Chia Buồn', value: 'chia-buon' },
];

const COLOR_GROUPS = [
  { name: 'Đỏ', color: '#c81e2b', bgClass: 'bg-red-600' },
  { name: 'Xanh lá', color: '#15803d', bgClass: 'bg-green-700' },
  { name: 'Xanh biển', color: '#1d4ed8', bgClass: 'bg-blue-700' },
  { name: 'Tím', color: '#7e22ce', bgClass: 'bg-purple-700' },
  { name: 'Hồng', color: '#db2777', bgClass: 'bg-pink-600' },
];

const LAYER_COUNT_OPTIONS: (4 | 5 | 6)[] = [4, 5, 6];

const ControlSidebar: React.FC = () => {
  const {
    config,
    addLine,
    removeLine,
    updateLine,
    updateConfig,
    updateGlobalTypography,
    updateStrokeSettings,
    setQuickColorGroup,
    setCopiesPerPage,
    applyPreset,
    resetDefault,
  } = useCardStore();

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('a4-print-area');
    if (!element) return;

    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: 0,
      filename: 'flowercard.pdf',
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
          FlowerCard Studio
        </h1>
        <p className="text-xs text-rose-100 mt-0.5">Thiết kế thiệp và băng rôn hoa</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* MỤC 1: CHỌN KIỂU THIỆP & DỊP LỄ */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Cloud size={14} className="text-rose-600" />
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              1. Kiểu Thiệp & Dịp Lễ
            </h2>
          </div>

          <div className="space-y-3">
            {/* Chọn Kiểu Thiệp */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Kiểu thiệp</label>
              <select
                value={config.styleType}
                onChange={(e) => updateConfig({ styleType: e.target.value as StyleType })}
                className="w-full px-2.5 py-1.5 text-xs font-medium border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-400 bg-white"
              >
                {STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn nhanh dịp lễ */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Chọn nhanh dịp lễ
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => applyPreset(p.value)}
                    className="px-2 py-1.5 text-xs bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-300 rounded transition-colors text-slate-600 text-left font-medium"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MỤC 2: NỘI DUNG CHỮ & ĐIỀU CHỈNH CHUNG */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Type size={14} className="text-rose-600" />
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                2. Nội Dung & Cài Đặt Chung
              </h2>
            </div>
            <button
              onClick={addLine}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors shadow-sm"
            >
              <Plus size={11} /> Thêm dòng
            </button>
          </div>

          {/* Cài đặt chung đồng nhất */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2.5 mb-3 shadow-sm">
            <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={11} /> Cài đặt chung
            </div>

            {/* Kích thước toàn bộ thiệp so với giấy - chuyển lên điều chỉnh chung */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Kích thước thiệp so với giấy:</span>
                <span className="text-rose-600 font-bold">{config.scalePercent}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={110}
                value={config.scalePercent}
                onChange={(e) => updateGlobalTypography({ scalePercent: parseInt(e.target.value) })}
              />
            </div>

            {/* Font chữ chung */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Font chữ</label>
              <select
                value={config.globalFontFamily}
                onChange={(e) => updateGlobalTypography({ globalFontFamily: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-400"
                style={{ fontFamily: config.globalFontFamily }}
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Độ cong tăng lên đến 80 */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Độ cong:</span>
                <span className="text-rose-600 font-bold">{config.globalCurveStrength}</span>
              </div>
              <input
                type="range"
                min={0}
                max={80}
                value={config.globalCurveStrength}
                onChange={(e) =>
                  updateGlobalTypography({ globalCurveStrength: parseInt(e.target.value) })
                }
              />
            </div>

            {/* Màu mặt chữ chung */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-600">Màu mặt chữ:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.globalTextColor}
                  onChange={(e) => updateGlobalTypography({ globalTextColor: e.target.value })}
                  className="w-7 h-6 rounded cursor-pointer border border-slate-300"
                />
                <span className="text-xs font-mono text-slate-500">{config.globalTextColor}</span>
              </div>
            </div>
          </div>

          {/* Danh sách nhập nội dung từng dòng */}
          <div className="space-y-2">
            {config.lines.map((line: TextLine, index: number) => (
              <div
                key={line.id}
                className="p-2.5 border border-slate-200 rounded-lg bg-white space-y-2 shadow-sm"
              >
                {/* Dòng input text */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500 w-5 text-center flex-shrink-0">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={line.text}
                    onChange={(e) => updateLine(line.id, { text: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-xs font-semibold border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-400"
                    placeholder={`Nhập dòng ${index + 1}...`}
                  />
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() =>
                        updateLine(line.id, {
                          fontWeight: line.fontWeight === 'bold' ? 'normal' : 'bold',
                        })
                      }
                      className={clsx(
                        'px-1.5 py-1 text-xs border rounded font-bold transition-colors',
                        line.fontWeight === 'bold'
                          ? 'bg-rose-500 border-rose-500 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                      title="Bold"
                    >
                      <Bold size={11} />
                    </button>
                    <button
                      onClick={() =>
                        updateLine(line.id, {
                          fontStyle: line.fontStyle === 'italic' ? 'normal' : 'italic',
                        })
                      }
                      className={clsx(
                        'px-1.5 py-1 text-xs border rounded italic transition-colors',
                        line.fontStyle === 'italic'
                          ? 'bg-rose-500 border-rose-500 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                      title="Italic"
                    >
                      <Italic size={11} />
                    </button>
                    {config.lines.length > 1 && (
                      <button
                        onClick={() => removeLine(line.id)}
                        className="p-1 text-slate-300 hover:text-red-500 rounded transition-colors"
                        title="Xóa dòng này"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Tinh chỉnh riêng: Cỡ chữ & Vị trí dọc */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-50 text-[11px]">
                  <div>
                    <div className="flex justify-between text-slate-500 mb-0.5">
                      <span>Cỡ chữ:</span>
                      <span className="font-bold text-rose-600">{line.fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={24}
                      max={110}
                      value={line.fontSize}
                      onChange={(e) => updateLine(line.id, { fontSize: parseInt(e.target.value) })}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 mb-0.5">
                      <span>Vị trí Y:</span>
                      <span className="font-bold text-rose-600">{line.offsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min={60}
                      max={360}
                      value={line.offsetY}
                      onChange={(e) => updateLine(line.id, { offsetY: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MỤC 3: HỆ THỐNG LỚP VIỀN STROKE (3 OPTION 4, 5, 6 & CHỌN NHANH NHÓM MÀU) */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Layers size={14} className="text-rose-600" />
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              3. Lớp Viền Stroke
            </h2>
          </div>

          <div className="space-y-3">
            {/* Chọn nhanh nhóm màu cho stroke */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Chọn nhanh nhóm màu
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {COLOR_GROUPS.map((g) => (
                  <button
                    key={g.color}
                    onClick={() => setQuickColorGroup(g.color)}
                    className={clsx(
                      'py-1.5 px-1 rounded-md text-[11px] font-semibold text-white flex flex-col items-center gap-1 transition-transform hover:scale-105 shadow-sm',
                      g.bgClass,
                      config.outerStrokeColor === g.color && 'ring-2 ring-offset-1 ring-slate-900'
                    )}
                  >
                    <span>{g.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn số lượng lớp viền: 3 option 4, 5, 6 */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Số lớp viền: <span className="font-bold text-rose-600">{config.strokeLayerCount} lớp</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {LAYER_COUNT_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => updateStrokeSettings({ strokeLayerCount: n })}
                    className={clsx(
                      'py-1.5 text-xs border rounded-md font-bold text-center transition-colors',
                      config.strokeLayerCount === n
                        ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    {n} lớp
                  </button>
                ))}
              </div>
            </div>

            {/* Màu lớp ngoài cùng & lớp trong cùng */}
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Màu ngoài cùng:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={config.outerStrokeColor}
                    onChange={(e) => updateStrokeSettings({ outerStrokeColor: e.target.value })}
                    className="w-7 h-6 rounded cursor-pointer border border-slate-300"
                  />
                  <span className="text-xs font-mono text-slate-600">{config.outerStrokeColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Màu sát chữ:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={config.innerStrokeColor}
                    onChange={(e) => updateStrokeSettings({ innerStrokeColor: e.target.value })}
                    className="w-7 h-6 rounded cursor-pointer border border-slate-300"
                  />
                  <span className="text-xs font-mono text-slate-600">{config.innerStrokeColor}</span>
                </div>
              </div>
            </div>

            {/* Dải màu chuyển tiếp */}
            <div>
              <div className="flex h-3 rounded overflow-hidden border border-slate-200 shadow-inner">
                {config.strokeLayers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex-1"
                    style={{ backgroundColor: layer.color }}
                    title={`${layer.name}: ${layer.color}`}
                  />
                ))}
              </div>
            </div>

            {/* Kích thước độ dày viền ngoài cùng và sát chữ */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                  <span>Độ dày viền ngoài cùng:</span>
                  <span className="font-bold text-rose-600">{config.outerStrokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={90}
                  value={config.outerStrokeWidth}
                  onChange={(e) => updateStrokeSettings({ outerStrokeWidth: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                  <span>Độ dày viền sát chữ:</span>
                  <span className="font-bold text-rose-600">{config.innerStrokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={24}
                  value={config.innerStrokeWidth}
                  onChange={(e) => updateStrokeSettings({ innerStrokeWidth: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MỤC 4: SỐ BẢN IN TRÊN TỜ A4 & ĐƯỜNG CẮT (CHỈ 1 VÀ 2 BẢN) */}
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3">
            4. Dàn Trang A4 & Đường Cắt
          </h2>

          <div className="space-y-3">
            {/* Bộ chọn số bản in: chỉ 1 và 2 bản */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Số bản in trên 1 tờ A4
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCopiesPerPage(1)}
                  className={clsx(
                    'py-2 px-3 text-xs border rounded-lg font-bold transition-colors text-center',
                    config.copiesPerPage === 1
                      ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  )}
                >
                  1 bản dọc
                </button>

                <button
                  onClick={() => setCopiesPerPage(2)}
                  className={clsx(
                    'py-2 px-3 text-xs border rounded-lg font-bold transition-colors text-center',
                    config.copiesPerPage === 2
                      ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  )}
                >
                  2 bản ngang
                </button>
              </div>
            </div>

            {/* Checkbox đường viền cắt nền trắng viền đứt nét */}
            <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={config.showCutLines}
                onChange={(e) => updateConfig({ showCutLines: e.target.checked })}
                className="w-4 h-4 accent-rose-500"
              />
              <span className="text-xs font-semibold text-slate-700">
                Hiển thị đường viền cắt đứt nét 0.5cm
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 flex-shrink-0 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded transition-colors shadow-sm"
          >
            <Printer size={13} /> In Trực Tiếp
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
          <RotateCcw size={11} /> Đặt lại mặc định
        </button>
      </div>
    </aside>
  );
};

export default ControlSidebar;
