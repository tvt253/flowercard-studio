import React from 'react';
import ControlSidebar from './components/ControlSidebar';
import A4PreviewArea from './components/A4PreviewArea';

const App: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100" id="app-root">
      <div className="print:hidden flex-shrink-0">
        <ControlSidebar />
      </div>
      <main className="flex-1 overflow-auto flex items-start justify-center p-6">
        <A4PreviewArea />
      </main>
    </div>
  );
};

export default App;
