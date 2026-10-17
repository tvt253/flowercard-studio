import React, { useState, useEffect } from 'react';
import ControlSidebar from './components/ControlSidebar';
import A4PreviewArea from './components/A4PreviewArea';
import { PanelLeftOpen } from 'lucide-react';
import { clsx } from 'clsx';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 relative" id="app-root">
      {/* SIDEBAR CONTAINER */}
      <div
        className={clsx(
          'print:hidden flex-shrink-0 transition-all duration-300 ease-in-out relative z-20 overflow-hidden',
          isSidebarOpen ? 'w-[340px]' : 'w-0'
        )}
      >
        <div className="w-[340px] h-full">
          <ControlSidebar
            onToggleSidebar={toggleSidebar}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>
      </div>

      {/* FLOATING BUTTON WHEN SIDEBAR IS HIDDEN */}
      {!isSidebarOpen && !isFullscreen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-3 z-30 flex items-center gap-1.5 px-3 py-2 bg-white/95 hover:bg-white text-slate-700 hover:text-rose-600 border border-slate-200 rounded-lg shadow-md transition-all text-xs font-semibold backdrop-blur print:hidden"
          title="Mở lại bảng cài đặt"
        >
          <PanelLeftOpen size={16} className="text-rose-600" />
          <span>Hiện Cài Đặt</span>
        </button>
      )}

      {/* MAIN PREVIEW AREA */}
      <main
        className={clsx(
          'overflow-auto flex flex-col items-center transition-colors duration-300',
          isFullscreen
            ? 'fixed inset-0 z-50 bg-slate-950 p-4 pt-16 overflow-y-auto'
            : 'flex-1 bg-slate-100 p-4 md:p-6'
        )}
      >
        <A4PreviewArea
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </main>
    </div>
  );
};

export default App;
