import React, { useState } from 'react';
import ControlSidebar from './components/ControlSidebar';
import A4PreviewArea from './components/A4PreviewArea';
import { PanelLeftOpen } from 'lucide-react';
import { clsx } from 'clsx';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 relative" id="app-root">
      {/* SIDEBAR CONTAINER */}
      <div
        className={clsx(
          'print:hidden flex-shrink-0 transition-all duration-300 ease-in-out relative z-20 overflow-hidden',
          isSidebarOpen ? 'w-[285px]' : 'w-0'
        )}
      >
        <div className="w-[285px] h-full">
          <ControlSidebar
            onToggleSidebar={toggleSidebar}
          />
        </div>
      </div>

      {/* FLOATING BUTTON WHEN SIDEBAR IS HIDDEN - Chỉ giữ lại icon gọn gàng */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-2.5 left-2.5 z-30 p-2 bg-white/95 hover:bg-white text-slate-700 hover:text-rose-600 border border-slate-200 rounded-lg shadow-md transition-all backdrop-blur print:hidden"
          title="Mở lại bảng cài đặt"
        >
          <PanelLeftOpen size={17} className="text-rose-600" />
        </button>
      )}

      {/* MAIN PREVIEW AREA - Đặt p-0 để thanh công cụ trên cùng nằm sát lề trên, sticky khi cuộn */}
      <main className="flex-1 bg-slate-100 p-0 overflow-y-auto overflow-x-auto flex flex-col items-center relative">
        <A4PreviewArea
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
      </main>
    </div>
  );
};

export default App;
