import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { BottomNav } from '../components/BottomNav';
import { useAppState } from '../hooks/useAppState';

export function AppLayout() {
  const { pathname } = useLocation();
  const { saveError } = useAppState();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="min-h-screen bg-page">
      <main key={pathname} className="mx-auto max-w-2xl animate-fadeUp px-4 pb-[calc(96px+env(safe-area-inset-bottom,0px))]">
        {saveError && (
          <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            Changes not saved: {saveError}
          </div>
        )}
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
