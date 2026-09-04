import {Outlet} from 'react-router-dom';

import Navbar from './Navbar';

const AppLayout = () => (
  <div className="flex min-h-dvh flex-col">
    <Navbar />
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <Outlet />
    </main>
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-slate-500">
        Dibangun dengan React, Redux Toolkit, dan Tailwind CSS.
      </div>
    </footer>
  </div>
);

export default AppLayout;
