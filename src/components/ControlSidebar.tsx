import React from 'react';
import { useCardStore } from '../store/useCardStore';
import { PresetName, StyleType } from '../types/card';
import {
  Plus,
  Trash2,
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
  { label: '☁️ Kiểu Đám Mây (Chữ Viền Stroke)', value: 'cloud' },
  { label: '🔴 Kiểu Oval Đỏ (Khai Trương / Chúc Mừng)', value: 'oval-red' },
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
    addLine,
    removeLine,
    updateConfig,
    setStyleType,
    updateGlobalTypography,
    updateStrokeSettings,
    setQuickColorGroup,
    setCopiesPerPage,
    applyPreset,
  } = useCardStore();

  const isOval = config.styleType === 'oval-red' || config.styleType === 'oval-black';

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

          {/* Quản lý số lượng dòng chữ & hướng dẫn sửa trực tiếp */}
          <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Số dòng chữ: <strong className="text-rose-600">{config.lines.length} dòng</strong>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={addLine}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-rose-500 hover:bg-rose-600 text-white rounded transition-colors shadow-xs font-semibold"
                >
                  <Plus size={11} /> Thêm dòng
                </button>
                {config.lines.length > 1 && (
                  <button
                    onClick={() => removeLine(config.lines[config.lines.length - 1].id)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded border border-slate-200 transition-colors"
                    title="Xóa dòng cuối"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
              💡 <strong>Chỉnh sửa trực tiếp:</strong> Nhấp vào chữ trên thiệp để sửa nội dung, cỡ chữ và vị trí.
            </p>
          </div>
        </div>

        {/* MỤC 3: MÀU SẮC & LỚP VIỀN STROKE */}
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 mb-2">
            <Layers size={14} className="text-rose-600" />
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              {isOval ? '3. Màu Sắc Thiệp Oval' : '3. Lớp Viền Stroke'}
            </h2>
          </div>

          <div className="space-y-2.5">
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
