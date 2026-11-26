import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui';

export function NotFoundPage() {
  return (
    <div id="main-content" tabIndex={-1} className="mx-auto max-w-md p-6 pt-16">
      <EmptyState
        title="Page not found"
        text="Check the address or return home."
        action={
          <Link to="/" className="inline-flex min-h-[44px] items-center rounded-xl bg-navy px-5 font-semibold text-white">
            Go home
          </Link>
        }
      />
    </div>
  );
}
