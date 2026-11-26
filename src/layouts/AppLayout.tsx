import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { BottomNav } from '../components/BottomNav';
import { useAppState } from '../hooks/useAppState';
import { emit } from '../utils/events';

const VIEW_LABELS: Record<string, string> = {
  '/home': 'Home',
  '/academies': 'Academies',
  '/requirements': 'Requirements',
  '/vvk': 'Medical exam',
  '/documents': 'Documents',
  '/fitness': 'Fitness test',
  '/my-path': 'My Path',
  '/notifications': 'Notifications',
  '/news': 'Updates',
  '/support': 'Support',
  '/compare': 'Comparison',
  '/profile': 'Profile',
};

const viewLabel = (path: string) => {
  if (VIEW_LABELS[path]) return VIEW_LABELS[path];
  if (path.startsWith('/academies/')) return 'Academy detail';
  if (path.startsWith('/specialties/')) return 'Program detail';
  return 'Workspace';
};

export function AppLayout() {
  const { pathname } = useLocation();
  const { saveError } = useAppState();
  const label = viewLabel(pathname);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${label} — CADET`;
  }, [pathname, label]);
  useEffect(() => {
    emit('app_opened');
  }, []);
  return (
    <div className="min-h-screen bg-page">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Now viewing {label}
      </div>
      <main
        id="main-content"
        tabIndex={-1}
        key={pathname}
        className="mx-auto max-w-2xl animate-fadeUp px-4 pb-[calc(96px+env(safe-area-inset-bottom,0px))] lg:max-w-4xl"
      >
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
