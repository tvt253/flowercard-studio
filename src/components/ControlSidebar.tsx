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
  PanelLeftClose,
  Maximize2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { handlePrint, handleExportPDF } from '../utils/exportUtils';
import { FONT_OPTIONS } from '../constants/fonts';

const STYLE_OPTIONS: { label: string; value: StyleType }[] = [
  { label: '☁️ Kiểu Đám Mây (Chữ Viền Stroke)', value: 'cloud' },
  { label: '🔴 Kiểu Oval Đỏ (Khai Trương / Chúc Mừng)', value: 'oval-red' },
  { label: '⚫ Kiểu Oval Đen (Chia Buồn / Tang Lễ)', value: 'oval-black' },
];

interface PresetItem {
  label: string;
  value: PresetName;
  tag?: string;
  tagColor?: string;
}

// 1. Mẫu chọn nhanh cho KIỂU ĐÁM MÂY (bỏ chia buồn, khai trương màu đỏ, sinh nhật màu hồng)
const CLOUD_PRESETS: PresetItem[] = [
  { label: '🌹 20/10 - Phụ Nữ VN', value: '20-10' },
  { label: '📚 20/11 - Nhà Giáo VN', value: '20-11' },
  { label: '💐 8/3 - Quốc Tế PN', value: '8-3' },
  { label: '🎊 Khai Trương', value: 'khai-truong' },
  { label: '🎂 Sinh Nhật', value: 'sinh-nhat' },
  { label: '💍 Mừng Hạnh Phúc', value: 'mung-cuoi' },
];

// 2. Mẫu chọn nhanh cho KIỂU OVAL ĐỎ (bỏ chia buồn, các mẫu còn lại dùng màu đỏ)
const OVAL_RED_PRESETS: PresetItem[] = [
  { label: '🎊 Khai Trương Hồng Phát', value: 'oval-khai-truong' },
  { label: '🏢 Lễ Khánh Thành', value: 'oval-khanh-thanh' },
  { label: '🥂 Tân Gia Phát Tài', value: 'oval-tan-gia' },
  { label: '🌹 20/10 - Phụ Nữ VN', value: 'oval-20-10' },
  { label: '📚 20/11 - Nhà Giáo VN', value: 'oval-20-11' },
  { label: '💐 8/3 - Quốc Tế PN', value: 'oval-8-3' },
];

// 3. Mẫu chọn nhanh cho KIỂU OVAL ĐEN / TÂM LINH (chỉ giữ chia buồn, thêm Kính dâng, Kính viếng, Công giáo)
const OVAL_BLACK_PRESETS: PresetItem[] = [
  { label: '🕊️ Chia Buồn', value: 'chia-buon', tag: 'Nền đen - chữ trắng', tagColor: 'bg-zinc-800 text-white' },
  { label: '🏵️ Kính Dâng', value: 'kinh-dang', tag: 'Nền đỏ - chữ vàng đậm', tagColor: 'bg-red-700 text-amber-300' },
  { label: '🕯️ Kính Viếng', value: 'kinh-vieng', tag: 'Nền trắng - chữ đen', tagColor: 'bg-white text-zinc-900 border border-zinc-300' },
  { label: '✝️ Phân Ưu Công Giáo', value: 'cong-giao', tag: 'Nền tím - chữ trắng', tagColor: 'bg-purple-800 text-white' },
  { label: '🌿 Ngàn Thu Yên Nghỉ', value: 'ngan-thu', tag: 'Nền đen - chữ trắng', tagColor: 'bg-zinc-800 text-white' },
];

// Nhóm màu chọn nhanh: Đỏ, Hồng, Tím, Xanh biển, Xanh lá, Cam/Nâu, Đen
const COLOR_GROUPS = [
  { name: 'Đỏ', color: '#c81e2b' },
  { name: 'Hồng', color: '#db2777' },
  { name: 'Tím', color: '#7e22ce' },
  { name: 'Xanh nước biển', color: '#1d4ed8' },
  { name: 'Xanh lá cây', color: '#15803d' },
  { name: 'Cam đất', color: '#b45309' },
  { name: 'Đen chia buồn', color: '#09090b' },
];

const LAYER_COUNT_OPTIONS: (4 | 5 | 6)[] = [4, 5, 6];

interface ControlSidebarProps {
  onToggleSidebar?: () => void;
  onToggleFullscreen?: () => void;
}

const ControlSidebar: React.FC<ControlSidebarProps> = ({
  onToggleSidebar,
  onToggleFullscreen,
}) => {
  const {
    config,
    addLine,
    removeLine,
    updateLine,
    toggleLineTextCase,
    setStyleType,
    updateGlobalTypography,
    updateStrokeSettings,
    setQuickColorGroup,
    setCopiesPerPage,
    applyPreset,
    resetDefault,
  } = useCardStore();

  const isOval = config.styleType === 'oval-red' || config.styleType === 'oval-black';

  const currentPresets: PresetItem[] =
    config.styleType === 'oval-black'
      ? OVAL_BLACK_PRESETS
      : config.styleType === 'oval-red'
      ? OVAL_RED_PRESETS
      : CLOUD_PRESETS;

  return (
    <aside className="w-[340px] h-screen bg-white border-r border-slate-200 flex flex-col overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold tracking-wide flex items-center gap-1.5">
            FlowerCard Studio
          </h1>
          <p className="text-xs text-rose-100 mt-0.5">Thiết kế thiệp và băng rôn hoa</p>
        </div>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            title="Ẩn bảng cài đặt (Thu gọn)"
            className="p-1.5 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <PanelLeftClose size={18} />
          </button>
        )}
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
            {/* Chọn Kiểu Thiệp (Đám mây / Oval Đỏ / Oval Đen) */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Kiểu thiệp</label>
              <select
                value={config.styleType}
                onChange={(e) => setStyleType(e.target.value as StyleType)}
                className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-400 bg-white"
              >
                {STYLE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn nhanh mẫu theo kiểu thiệp đang chọn */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Chọn nhanh mẫu {config.styleType === 'oval-black' ? 'tang lễ & kính dâng' : 'chúc mừng'}:
                </label>
                <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                  {currentPresets.length} mẫu
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {currentPresets.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => applyPreset(p.value)}
                    className="flex flex-col items-start justify-center p-2 text-xs bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-300 rounded-lg transition-colors text-slate-700 text-left font-medium relative group shadow-2xs"
                  >
                    <span className="truncate w-full font-semibold">{p.label}</span>
                    {p.tag && (
                      <span className={clsx('mt-1 px-1.5 py-0.5 text-[9px] font-bold rounded', p.tagColor || 'bg-slate-200 text-slate-600')}>
                        {p.tag}
                      </span>
                    )}
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

            {/* Kích thước thiệp so với giấy - cho phép chỉnh lên đến 120% */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Kích thước thiệp:</span>
                <span className="text-rose-600 font-bold">{config.scalePercent}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={120}
                value={config.scalePercent}
                onChange={(e) => updateGlobalTypography({ scalePercent: parseInt(e.target.value) })}
              />
            </div>

            {/* Font chữ chung */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Font chữ chung</label>
              <select
                value={config.globalFontFamily}
                onChange={(e) => updateGlobalTypography({ globalFontFamily: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-400 font-medium bg-white"
                style={{ fontFamily: config.globalFontFamily }}
              >
                <optgroup label="🔤 Font Chữ IN HOA (Tiêu Đề / Băng Rôn)">
                  {FONT_OPTIONS.filter((f) => f.category === 'uppercase').map((f) => (
                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="✍️ Font Thư Pháp & Nghệ Thuật (Mẫu Gốc)">
                  {FONT_OPTIONS.filter((f) => f.category === 'calligraphy').map((f) => (
                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🏛️ Font Serif & Sans Hiện Đại">
                  {FONT_OPTIONS.filter((f) => f.category === 'classic').map((f) => (
                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.label}
                    </option>
                  ))}
                </optgroup>
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
                    {/* Nút chuyển kiểu chữ Aa: Viết hoa đầu từ -> In hoa toàn bộ -> Thường */}
                    <button
                      onClick={() => toggleLineTextCase(line.id)}
                      className={clsx(
                        'px-1.5 py-1 text-xs border rounded font-bold transition-all shadow-sm',
                        (!line.textCase || line.textCase === 'capitalize')
                          ? 'bg-rose-500 border-rose-600 text-white'
                          : line.textCase === 'uppercase'
                          ? 'bg-amber-500 border-amber-600 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                      title={
                        (!line.textCase || line.textCase === 'capitalize')
                          ? 'Đang bật: Viết Hoa Đầu Từ (Chuẩn mẫu) - Bấm để chuyển'
                          : line.textCase === 'uppercase'
                          ? 'Đang bật: IN HOA TOÀN BỘ (CAPSLOCK) - Bấm để chuyển'
                          : 'Đang bật: Chữ thường - Bấm để chuyển'
                      }
                    >
                      {(!line.textCase || line.textCase === 'capitalize')
                        ? 'Aa'
                        : line.textCase === 'uppercase'
                        ? 'AA'
                        : 'aa'}
                    </button>
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

                {/* Chọn font riêng cho dòng này (nếu muốn khác font chung) */}
                <div className="flex items-center gap-1.5 pt-0.5 text-[11px]">
                  <span className="text-slate-400 text-[10px] flex-shrink-0">Font:</span>
                  <select
                    value={line.fontFamily || ''}
                    onChange={(e) => updateLine(line.id, { fontFamily: e.target.value || undefined })}
                    className="flex-1 px-1.5 py-1 text-[11px] border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-400 bg-slate-50 font-medium"
                    style={{ fontFamily: line.fontFamily || config.globalFontFamily }}
                  >
                    <option value="">(Theo font chung: {config.globalFontFamily})</option>
                    <optgroup label="🔤 Font Chữ IN HOA">
                      {FONT_OPTIONS.filter((f) => f.category === 'uppercase').map((f) => (
                        <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                          {f.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="✍️ Font Thư Pháp & Nghệ Thuật">
                      {FONT_OPTIONS.filter((f) => f.category === 'calligraphy').map((f) => (
                        <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                          {f.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🏛️ Font Serif & Sans Hiện Đại">
                      {FONT_OPTIONS.filter((f) => f.category === 'classic').map((f) => (
                        <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                          {f.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
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

        {/* MỤC 3: MÀU SẮC & LỚP VIỀN STROKE */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Layers size={14} className="text-rose-600" />
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              {isOval ? '3. Màu Sắc Thiệp Oval' : '3. Lớp Viền Stroke'}
            </h2>
          </div>

          <div className="space-y-3">
            {/* Chọn nhanh nhóm màu */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                {isOval ? 'Chọn màu nền Oval' : 'Chọn nhanh nhóm màu'}
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_GROUPS.map((g) => {
                  const isSelected =
                    config.outerStrokeColor.toLowerCase() === g.color.toLowerCase();
                  return (
                    <button
                      key={g.color}
                      onClick={() => setQuickColorGroup(g.color)}
                      title={g.name}
                      className={clsx(
                        'w-7 h-7 rounded-full transition-all shadow-sm border border-slate-300 flex items-center justify-center flex-shrink-0',
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-rose-500 scale-110'
                          : 'hover:scale-105 opacity-90 hover:opacity-100'
                      )}
                      style={{ backgroundColor: g.color }}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {isOval ? (
              /* THÔNG BÁO DÀNH CHO KIỂU OVAL */
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-1">
                <p className="font-semibold flex items-center gap-1 text-slate-800">
                  ✨ Mẫu Oval đa sắc thái
                </p>
                <p className="text-[11px] text-slate-600">
                  Khung viền kép sang trọng: hỗ trợ nền đỏ chữ vàng (Kính dâng), nền trắng chữ đen (Kính viếng), nền đen chữ trắng (Chia buồn) hoặc nền đỏ (Khai trương).
                </p>
              </div>
            ) : (
              /* CÁC ĐIỀU CHỈNH VIỀN DÀNH CHO KIỂU ĐÁM MÂY */
              <>
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

                {/* Kích thước độ dày viền ngoài cùng (130px) và sát chữ (30px) */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                      <span>Độ dày viền ngoài cùng:</span>
                      <span className="font-bold text-rose-600">{config.outerStrokeWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={150}
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
                      min={2}
                      max={50}
                      value={config.innerStrokeWidth}
                      onChange={(e) => updateStrokeSettings({ innerStrokeWidth: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* MỤC 4: SỐ BẢN IN TRÊN TỜ A4 */}
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3">
            4. Dàn Trang A4
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Số bản in / tờ A4
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
                  1 bản
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
                  2 bản
                </button>
              </div>
            </div>
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
            onClick={() => handleExportPDF(config.copiesPerPage === 1)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded transition-colors shadow-sm"
          >
            <FileDown size={13} /> Xuất PDF
          </button>
        </div>
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded transition-colors shadow-sm"
          >
            <Maximize2 size={13} /> Xem Toàn Màn Hình (Full Preview)
          </button>
        )}
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
