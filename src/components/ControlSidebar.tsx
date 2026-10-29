import React from 'react';
import { useCardStore } from '../store/useCardStore';
import { PresetName, StyleType } from '../types/card';
import {
  Printer,
  FileDown,
  Layers,
  Sparkles,
  Type,
  Cloud,
  PanelLeftClose,
} from 'lucide-react';
import { clsx } from 'clsx';
import { handlePrint, handleExportPDF } from '../utils/exportUtils';
import { FONT_OPTIONS } from '../constants/fonts';

const STYLE_OPTIONS: { label: string; value: StyleType }[] = [
  { label: '🌸 Kiểu Khung Hoa Trái Tim (Mẫu Mới)', value: 'floral-heart' },
  { label: '☁️ Kiểu Đám Mây Viền Tầng (Đa Sắc)', value: 'cloud' },
  { label: '🔴 Kiểu Đám Mây Nền Đặc (Chữ Nổi)', value: 'cloud-solid' },
  { label: '⭕ Kiểu Oval Đỏ (Khai Trương / Chúc Mừng)', value: 'oval-red' },
  { label: '⚫ Kiểu Oval Đen (Chia Buồn / Tang Lễ)', value: 'oval-black' },
];

interface PresetItem {
  label: string;
  value: PresetName;
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
  { label: '🕊️ Chia Buồn', value: 'chia-buon' },
  { label: '🏵️ Kính Dâng', value: 'kinh-dang' },
  { label: '🕯️ Kính Viếng', value: 'kinh-vieng' },
  { label: '✝️ Phân Ưu Công Giáo', value: 'cong-giao' },
  { label: '🌿 Ngàn Thu Yên Nghỉ', value: 'ngan-thu' },
];

// Gam màu chọn nhanh cho Khung Hoa (tương ứng với các góc xoay màu hài hòa)
const FLORAL_FRAME_COLORS = [
  { name: 'Hồng phấn (Mẫu gốc)', color: '#ec4899' },
  { name: 'Đỏ ruby', color: '#dc2626' },
  { name: 'Cam đào', color: '#ea580c' },
  { name: 'Vàng kim', color: '#ca8a04' },
  { name: 'Xanh ngọc', color: '#16a34a' },
  { name: 'Xanh biếc', color: '#2563eb' },
  { name: 'Tím huế', color: '#9333ea' },
];

// Màu chữ sang trọng, nổi bật và sắc nét trên nền Khung Hoa
const FLORAL_TEXT_COLORS = [
  { name: 'Đỏ mận', color: '#be185d' },
  { name: 'Hồng sen', color: '#db2777' },
  { name: 'Tím đậm', color: '#7e22ce' },
  { name: 'Nâu socola', color: '#78350f' },
  { name: 'Đen than', color: '#0f172a' },
  { name: 'Đỏ ruby', color: '#b91c1c' },
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
}

const ControlSidebar: React.FC<ControlSidebarProps> = ({
  onToggleSidebar,
}) => {
  const {
    config,
    updateConfig,
    setStyleType,
    updateGlobalTypography,
    updateStrokeSettings,
    setQuickColorGroup,
    setCloudTextColor,
    setCloudBgColor,
    setFrameThemeColor,
    setFrameTextColor,
    setCopiesPerPage,
    applyPreset,
  } = useCardStore();

  const isFloral = config.styleType === 'floral-heart';
  const isOval = config.styleType === 'oval-red' || config.styleType === 'oval-black';
  const isCloudSolid = config.styleType === 'cloud-solid';

  const currentPresets: PresetItem[] =
    config.styleType === 'oval-black'
      ? OVAL_BLACK_PRESETS
      : config.styleType === 'oval-red'
      ? OVAL_RED_PRESETS
      : CLOUD_PRESETS;

  return (
    <aside className="w-[285px] h-screen bg-white border-r border-slate-200 flex flex-col overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-3 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white flex-shrink-0 flex items-center justify-between">
        <h1 className="text-base font-bold tracking-wide flex items-center gap-1.5">
          FlowerCard Studio
        </h1>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            title="Ẩn bảng cài đặt (Thu gọn)"
            className="p-1 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <PanelLeftClose size={17} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* MỤC 1: CHỌN KIỂU THIỆP & DỊP LỄ */}
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 mb-2">
            <Cloud size={14} className="text-rose-600" />
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              1. Kiểu Thiệp & Dịp Lễ
            </h2>
          </div>

          <div className="space-y-2.5">
            {/* Chọn Kiểu Thiệp (Đám mây / Oval Đỏ / Oval Đen) */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Kiểu thiệp</label>
              <select
                value={config.styleType}
                onChange={(e) => setStyleType(e.target.value as StyleType)}
                className="w-full px-2 py-1.5 text-xs font-semibold border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-400 bg-white"
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
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Chọn nhanh mẫu:
              </label>
              <div className="grid grid-cols-2 gap-1">
                {currentPresets.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => applyPreset(p.value)}
                    className="flex items-center justify-start p-1.5 text-[11px] bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-300 rounded-md transition-colors text-slate-700 text-left font-semibold group shadow-2xs"
                  >
                    <span className="truncate w-full">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MỤC 2: CÀI ĐẶT CHUNG */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Type size={14} className="text-rose-600" />
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                2. Cài Đặt Chung
              </h2>
            </div>
          </div>

          {/* Cài đặt chung đồng nhất */}
          <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-2 mb-2.5 shadow-sm">
            <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={11} /> Cài đặt chung
            </div>

            {/* Kích thước thiệp so với giấy */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Kích thước thiệp:</span>
                <span className="text-rose-600 font-bold">{config.scalePercent ?? 95}% chiều rộng</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={config.scalePercent ?? 95}
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

            {/* Độ cong */}
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
        </div>

        {/* MỤC 3: MÀU SẮC & LỚP VIỀN STROKE */}
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 mb-2">
            <Layers size={14} className="text-rose-600" />
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              {isFloral
                ? '3. Màu Sắc Khung Hoa & Chữ'
                : isOval
                ? '3. Màu Sắc Thiệp Oval'
                : '3. Lớp Viền Stroke'}
            </h2>
          </div>

          <div className="space-y-2.5">
            {isFloral ? (
              /* TÙY CHỈNH MÀU SẮC DÀNH CHO KIỂU KHUNG HOA TRÁI TIM */
              <div className="space-y-3">
                {/* 1. Chọn màu Khung Hoa */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Màu khung hoa mẫu:
                  </label>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {FLORAL_FRAME_COLORS.map((f) => {
                      const isSelected =
                        (config.frameThemeColor || '#ec4899').toLowerCase() === f.color.toLowerCase();
                      return (
                        <button
                          key={f.color}
                          onClick={() => setFrameThemeColor(f.color)}
                          title={f.name}
                          className={clsx(
                            'w-7 h-7 rounded-full transition-all shadow-sm border border-slate-300 flex items-center justify-center flex-shrink-0',
                            isSelected
                              ? 'ring-2 ring-offset-2 ring-rose-500 scale-110'
                              : 'hover:scale-105 opacity-90 hover:opacity-100'
                          )}
                          style={{ backgroundColor: f.color }}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Color picker tùy chỉnh màu khung hoa */}
                  <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[11px] font-semibold text-slate-600">Tự chọn màu khung:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={config.frameThemeColor || '#ec4899'}
                        onChange={(e) => setFrameThemeColor(e.target.value)}
                        className="w-7 h-6 rounded cursor-pointer border border-slate-300"
                      />
                      <span className="text-xs font-mono text-slate-600">
                        {config.frameThemeColor || '#ec4899'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Chọn màu Chữ thiệp */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Màu chữ thiệp:
                  </label>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {FLORAL_TEXT_COLORS.map((t) => {
                      const isSelected =
                        (config.frameTextColor || '#be185d').toLowerCase() === t.color.toLowerCase();
                      return (
                        <button
                          key={t.color}
                          onClick={() => setFrameTextColor(t.color)}
                          title={t.name}
                          className={clsx(
                            'w-7 h-7 rounded-full transition-all shadow-sm border border-slate-300 flex items-center justify-center flex-shrink-0',
                            isSelected
                              ? 'ring-2 ring-offset-2 ring-rose-500 scale-110'
                              : 'hover:scale-105 opacity-90 hover:opacity-100'
                          )}
                          style={{ backgroundColor: t.color }}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Color picker tùy chỉnh màu chữ */}
                  <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[11px] font-semibold text-slate-600">Tự chọn màu chữ:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={config.frameTextColor || '#be185d'}
                        onChange={(e) => setFrameTextColor(e.target.value)}
                        className="w-7 h-6 rounded cursor-pointer border border-slate-300"
                      />
                      <span className="text-xs font-mono text-slate-600">
                        {config.frameTextColor || '#be185d'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
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
              /* Tùy chỉnh màu sắc chi tiết cho Oval */
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Màu nền Oval:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={config.ovalBgColor || config.outerStrokeColor}
                      onChange={(e) =>
                        updateConfig({
                          ovalBgColor: e.target.value,
                          ovalBorderColor: e.target.value,
                        })
                      }
                      className="w-7 h-6 rounded cursor-pointer border border-slate-300"
                    />
                    <span className="text-xs font-mono text-slate-600">
                      {config.ovalBgColor || config.outerStrokeColor}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Màu chữ Oval:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={config.ovalTextColor || '#ffffff'}
                      onChange={(e) => updateConfig({ ovalTextColor: e.target.value })}
                      className="w-7 h-6 rounded cursor-pointer border border-slate-300"
                    />
                    <span className="text-xs font-mono text-slate-600">
                      {config.ovalTextColor || '#ffffff'}
                    </span>
                  </div>
                </div>
              </div>
            ) : isCloudSolid ? (
              /* TÙY CHỈNH MÀU SẮC DÀNH CHO KIỂU ĐÁM MÂY NỀN ĐẶC (SOLID CLOUD) */
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Màu nền mây:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={config.cloudBgColor || config.outerStrokeColor || '#c81e2b'}
                        onChange={(e) => setCloudBgColor(e.target.value)}
                        className="w-7 h-6 rounded cursor-pointer border border-slate-300"
                      />
                      <span className="text-xs font-mono text-slate-600 truncate">
                        {config.cloudBgColor || config.outerStrokeColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Màu chữ nổi:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={config.cloudTextColor || '#ffffff'}
                        onChange={(e) => setCloudTextColor(e.target.value)}
                        className="w-7 h-6 rounded cursor-pointer border border-slate-300"
                      />
                      <span className="text-xs font-mono text-slate-600 truncate">
                        {config.cloudTextColor || '#ffffff'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chọn nhanh màu chữ nổi */}
                <div>
                  <div className="text-[11px] font-medium text-slate-500 mb-1">
                    Chọn nhanh màu chữ nổi:
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[
                      { name: 'Trắng', color: '#ffffff' },
                      { name: 'Vàng kim', color: '#fef08a' },
                      { name: 'Đen', color: '#09090b' },
                    ].map((c) => (
                      <button
                        key={c.color}
                        onClick={() => setCloudTextColor(c.color)}
                        className={clsx(
                          'flex-1 py-1 text-[11px] font-bold rounded border transition-colors flex items-center justify-center gap-1 shadow-2xs',
                          (config.cloudTextColor || '#ffffff') === c.color
                            ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: c.color }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Độ dày khối mây đặc */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                    <span>Độ dày khối mây:</span>
                    <span className="font-bold text-rose-600">{config.outerStrokeWidth ?? 130}px</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={150}
                    value={config.outerStrokeWidth ?? 130}
                    onChange={(e) => updateStrokeSettings({ outerStrokeWidth: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            ) : (
              /* CÁC ĐIỀU CHỈNH VIỀN DÀNH CHO KIỂU ĐÁM MÂY */
              <>
                {/* Chọn số lượng lớp viền: 3 option 4, 5, 6 */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Số lớp viền: <span className="font-bold text-rose-600">{config.strokeLayerCount ?? 5} lớp</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {LAYER_COUNT_OPTIONS.map((n) => (
                      <button
                        key={n}
                        onClick={() => updateStrokeSettings({ strokeLayerCount: n })}
                        className={clsx(
                          'py-1.5 text-xs border rounded-md font-bold text-center transition-colors',
                          (config.strokeLayerCount ?? 5) === n
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
                        value={config.outerStrokeColor ?? '#c81e2b'}
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
                        value={config.innerStrokeColor ?? '#ffffff'}
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
                      <span className="font-bold text-rose-600">{config.outerStrokeWidth ?? 130}px</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={150}
                      value={config.outerStrokeWidth ?? 130}
                      onChange={(e) => updateStrokeSettings({ outerStrokeWidth: parseInt(e.target.value) })}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                      <span>Độ dày viền sát chữ:</span>
                      <span className="font-bold text-rose-600">{config.innerStrokeWidth ?? 30}px</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={50}
                      value={config.innerStrokeWidth ?? 30}
                      onChange={(e) => updateStrokeSettings({ innerStrokeWidth: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </>
            )}
            </>
            )}
          </div>
        </div>

        {/* MỤC 4: SỐ BẢN IN TRÊN TỜ A4 */}
        <div className="p-3 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
            4. Dàn Trang A4
          </h2>

          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Số bản in / tờ A4
              </label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setCopiesPerPage(1)}
                  className={clsx(
                    'py-1.5 text-xs border rounded-lg font-bold transition-colors text-center',
                    config.copiesPerPage === 1
                      ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  )}
                >
                  1 bản (Ngang)
                </button>

                <button
                  onClick={() => setCopiesPerPage(2)}
                  className={clsx(
                    'py-1.5 text-xs border rounded-lg font-bold transition-colors text-center',
                    config.copiesPerPage === 2
                      ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  )}
                >
                  2 bản (Dọc)
                </button>

                <button
                  onClick={() => setCopiesPerPage(3)}
                  className={clsx(
                    'py-1.5 text-xs border rounded-lg font-bold transition-colors text-center',
                    config.copiesPerPage === 3
                      ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  )}
                >
                  3 bản (Dọc)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-2.5 border-t border-slate-200 bg-slate-50 flex-shrink-0">
        <div className="flex gap-1.5">
          <button
            onClick={() => handlePrint(config.copiesPerPage === 1)}
            className="flex-1 flex items-center justify-center gap-1 px-2.5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Printer size={13} /> In Trực Tiếp
          </button>
          <button
            onClick={() => handleExportPDF(config.copiesPerPage === 1)}
            className="flex-1 flex items-center justify-center gap-1 px-2.5 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <FileDown size={13} /> Xuất PDF
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ControlSidebar;
