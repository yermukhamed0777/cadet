import { Link } from 'react-router-dom';
import { AlertTriangle, MapPinned } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Accordion, Card, CheckMark, ProgressBar, SourceLink, StatusBadge } from '../components/ui';
import { InlineSource } from '../components/FactRow';
import { VVK_VERSION_TITLE, vvk2026Note } from '../data/vvk';
import { useAppState } from '../hooks/useAppState';
import { vvkItemsFor, vvkStats } from '../utils/progress';

export function VvkPage() {
  const { state, toggleVvk } = useAppState();
  const items = vvkItemsFor(state.profile?.gender);
  const { done, total } = vvkStats(state);

  return (
    <>
      <PageHeader title="ВВК" subtitle="Военно-врачебная комиссия" back />

      <Card className="mb-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-semibold text-ink">Подготовка к ВВК</h2>
          <span className="text-sm font-semibold text-navy tabular-nums">
            {done} / {total} выполнено
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar value={total ? done / total : 0} label="Прогресс ВВК" size="lg" />
        </div>
      </Card>

      <div className="mb-3 flex gap-2 rounded-xl border border-slate-200 bg-slate-100 p-3 text-[13px] leading-snug text-slate-800">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>
          <b>{VVK_VERSION_TITLE}.</b> Актуальный официальный список на 2026 год не найден — это не требования 2026 года. Не является медицинской рекомендацией.
          {state.profile?.gender === 'male' && ' Пункты только для кандидатов женского пола скрыты.'}
        </p>
      </div>

      <Card className="mb-4">
        <p className="text-[14px] leading-snug text-ink">{vvk2026Note.text}</p>
        <InlineSource refData={vvk2026Note} />
      </Card>

      <ul className="flex flex-col gap-2">
        {items.map((item) => {
          const checked = Boolean(state.vvkProgress[item.id]);
          return (
            <li key={item.id}>
              <Accordion
                leading={
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={`Отметить: ${item.title}`}
                    onClick={() => toggleVvk(item.id)}
                    className="grid h-11 w-11 place-items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                  >
                    <CheckMark checked={checked} />
                  </button>
                }
                header={
                  <div className="flex items-center gap-3">
                    <span className="min-w-0">
                      <span className={`block font-medium leading-snug ${checked ? 'text-muted line-through decoration-gold/60' : 'text-ink'}`}>{item.title}</span>
                      <span className="block text-[12.5px] text-muted">{item.description}</span>
                    </span>
                  </div>
                }
              >
                {item.details && <p className="mb-2 text-[14px] text-ink/85">{item.details}</p>}
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <StatusBadge status={item.status} year={item.applicableYear} />
                </div>
                <SourceLink refData={item} compact />
              </Accordion>
            </li>
          );
        })}
      </ul>

      <Link to="/vvk/map" className="mt-4 flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-line bg-white font-semibold text-navy">
        <MapPinned className="h-5 w-5 text-gold-dark" aria-hidden /> ВВК на карте
      </Link>
    </>
  );
}
