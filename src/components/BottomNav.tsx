import { NavLink } from 'react-router-dom';
import { Home, Landmark, Route, UserRound } from 'lucide-react';

const items = [
  { to: '/home', label: 'Home', Icon: Home },
  { to: '/academies', label: 'Academies', Icon: Landmark },
  { to: '/my-path', label: 'My Path', Icon: Route },
  { to: '/profile', label: 'Profile', Icon: UserRound },
];

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Main navigation"
    >
      <ul className="mx-auto grid max-w-2xl grid-cols-4">
        {items.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11.5px] font-semibold transition active:scale-95 ${
                  isActive ? 'text-navy' : 'text-muted hover:text-navy'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`grid h-7 w-12 place-items-center rounded-full transition ${isActive ? 'bg-gold/20' : ''}`}>
                    <Icon className="h-[21px] w-[21px]" strokeWidth={isActive ? 2.4 : 2} aria-hidden />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
