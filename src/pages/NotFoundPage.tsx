import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md p-6 pt-16">
      <EmptyState
        title="Страница не найдена"
        text="Проверьте адрес или вернитесь на главную."
        action={
          <Link to="/" className="inline-flex min-h-[44px] items-center rounded-xl bg-navy px-5 font-semibold text-white">
            На главную
          </Link>
        }
      />
    </div>
  );
}
