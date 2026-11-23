import { useState, type FormEvent } from 'react';
import { Trash2, Info } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button, Card, Modal, ProgressBar, SectionTitle, SourceLink, Tabs } from '../components/ui';
import { InlineSource } from '../components/FactRow';
import { fitnessNormSets, fitness2026Note } from '../data/fitness';
import { useAppState } from '../hooks/useAppState';
import { useToast } from '../hooks/useToast';
import type { FitnessExercise, FitnessGrade, FitnessResult, Gender } from '../types';
import { formatValue, gradeLabels, gradeResult, parseInput, progressToExcellent } from '../utils/fitness';
import { formatDate } from '../utils/format';

const gradeCls: Record<FitnessGrade, string> = {
  excellent: 'bg-emerald-600 text-white',
  good: 'bg-emerald-100 text-emerald-900',
  satisfactory: 'bg-amber-100 text-amber-900',
  below: 'bg-red-100 text-red-800',
};

export function GradePill({ grade }: { grade: FitnessGrade }) {
  return <span className={`rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${gradeCls[grade]}`}>{gradeLabels[grade]}</span>;
}

const placeholder = (ex: FitnessExercise) => (ex.unit === 'min_sec' ? 'напр. 3:45' : ex.unit === 'sec' ? 'напр. 14,2' : 'напр. 12');
const unitLabel = (ex: FitnessExercise) => (ex.unit === 'min_sec' ? 'мин:сек' : ex.unit === 'sec' ? 'сек' : 'раз');

export function FitnessPage() {
  const { state } = useAppState();
  const [setId, setSetId] = useState(fitnessNormSets[0].id);
  const [gender, setGender] = useState<Gender>(state.profile?.gender ?? 'male');
  const normSet = fitnessNormSets.find((s) => s.id === setId)!;
  const exercises = normSet.exercises.filter((e) => e.gender === gender);

  return (
    <>
      <PageHeader title="Физическая подготовка" back />

      <div className="mb-3 flex gap-2 rounded-xl border border-slate-200 bg-slate-100 p-3 text-[13px] leading-snug text-slate-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>Подтверждённых официальных нормативов на 2026 год не найдено. Сравнение с таблицей — это не медицинская оценка и не результат экзамена.</p>
      </div>

      <Tabs
        label="Набор нормативов"
        value={setId}
        onChange={setSetId}
        tabs={fitnessNormSets.map((s) => ({ id: s.id, label: s.id === 'archive-2025' ? 'Архив 2025' : 'Сайт Алматинской акад.' }))}
      />

      <fieldset className="mt-3">
        <legend className="mb-1.5 text-sm font-semibold">Пол</legend>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ['male', 'Мужской'],
              ['female', 'Женский'],
            ] as const
          ).map(([v, l]) => (
            <label
              key={v}
              className={`flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${
                gender === v ? 'border-navy bg-navy text-white' : 'border-line bg-white'
              }`}
            >
              <input type="radio" name="fit-gender" className="sr-only" checked={gender === v} onChange={() => setGender(v)} />
              <span className={`h-3.5 w-3.5 rounded-full border-2 ${gender === v ? 'border-gold bg-gold' : 'border-navy/30'}`} aria-hidden />
              {l}
            </label>
          ))}
        </div>
      </fieldset>

      <SectionTitle>{normSet.title}</SectionTitle>
      <Card className="!p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] tabular-nums">
            <caption className="sr-only">Нормативы: {normSet.title}</caption>
            <thead>
              <tr className="border-b border-line text-[11.5px] uppercase tracking-wide text-muted">
                <th className="px-3 py-2.5 font-semibold">Упражнение</th>
                <th className="px-2 py-2.5 font-semibold">Отл.</th>
                <th className="px-2 py-2.5 font-semibold">Хор.</th>
                <th className="px-2 py-2.5 pr-3 font-semibold">Удовл.</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((e) => (
                <tr key={e.id} className="border-b border-line last:border-0">
                  <th scope="row" className="px-3 py-2.5 font-semibold text-ink">
                    {e.title}
                  </th>
                  <td className="px-2 py-2.5">{formatValue(e, e.excellent)}</td>
                  <td className="px-2 py-2.5">{formatValue(e, e.good)}</td>
                  <td className="px-2 py-2.5 pr-3">{formatValue(e, e.satisfactory)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="mt-2">
        <SourceLink refData={normSet} compact />
      </div>
      <Card className="mt-3">
        <p className="text-[14px] leading-snug">{fitness2026Note.text}</p>
        <InlineSource refData={fitness2026Note} />
      </Card>

      <SectionTitle>Мои результаты</SectionTitle>
      <div className="flex flex-col gap-3">
        {exercises.map((e) => (
          <ExerciseCard key={`${setId}-${e.id}`} ex={e} normSetId={setId} />
        ))}
      </div>
    </>
  );
}

function ExerciseCard({ ex, normSetId }: { ex: FitnessExercise; normSetId: string }) {
  const { state, addFitnessResult, removeFitnessResult } = useAppState();
  const toast = useToast();
  const [raw, setRaw] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<FitnessResult | null>(null);
  const results = state.fitnessResults.filter((r) => r.exerciseId === ex.id).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const best = results.length ? results.reduce((b, r) => ((ex.lowerIsBetter ? r.value < b.value : r.value > b.value) ? r : b)) : null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = parseInput(ex, raw);
    if (v == null) {
      setError(`Неверный формат. Пример: ${placeholder(ex).replace('напр. ', '')} (${unitLabel(ex)}).`);
      return;
    }
    if (!date) {
      setError('Укажите дату');
      return;
    }
    if (date > new Date().toISOString().slice(0, 10)) {
      setError('Дата не может быть в будущем');
      return;
    }
    addFitnessResult({ exerciseId: ex.id, normSetId, value: v, date });
    setRaw('');
    setError(null);
    toast(`Сохранено: ${formatValue(ex, v)} — ${gradeLabels[gradeResult(ex, v)].toLowerCase()}`);
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold">{ex.title}</h3>
        {best && <GradePill grade={gradeResult(ex, best.value)} />}
      </div>
      {best ? (
        <div className="mt-2">
          <p className="text-[13px] text-muted">
            Лучший результат: <b className="text-ink tabular-nums">{formatValue(ex, best.value)}</b> · норматив «отлично»: <span className="tabular-nums">{formatValue(ex, ex.excellent)}</span>
          </p>
          <div className="mt-1.5">
            <ProgressBar value={progressToExcellent(ex, best.value)} label={`Прогресс: ${ex.title}`} size="sm" />
          </div>
        </div>
      ) : (
        <p className="mt-1 text-[13px] text-muted">Результатов пока нет.</p>
      )}

      <form onSubmit={submit} noValidate className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <div className="col-span-2 grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-[12.5px] font-semibold">
            Результат ({unitLabel(ex)})
            <input
              id={`res-${ex.id}`}
              inputMode={ex.unit === 'reps' ? 'numeric' : 'decimal'}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder={placeholder(ex)}
              aria-invalid={Boolean(error)}
              className="min-h-[44px] w-full min-w-0 rounded-lg border border-line px-3 text-[16px] font-normal outline-none focus:border-navy focus:ring-2 focus:ring-gold/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-[12.5px] font-semibold">
            Дата
            <input
              id={`date-${ex.id}`}
              type="date"
              value={date}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="min-h-[44px] w-full min-w-0 rounded-lg border border-line px-2 text-[16px] font-normal outline-none focus:border-navy focus:ring-2 focus:ring-gold/40"
            />
          </label>
        </div>
        {error && <p className="col-span-2 text-[13px] font-medium text-red-700" role="alert">{error}</p>}
        <Button type="submit" size="sm" full className="col-span-2" disabled={!raw.trim()}>
          Сохранить результат
        </Button>
      </form>

      {results.length > 0 && (
        <ul className="mt-3 divide-y divide-line border-t border-line">
          {results.slice(0, 6).map((r) => (
            <li key={r.id} className="flex items-center gap-2 py-2 text-[13.5px]">
              <span className="w-24 shrink-0 text-muted">{formatDate(r.date)}</span>
              <span className="flex-1 font-semibold tabular-nums">{formatValue(ex, r.value)}</span>
              <GradePill grade={gradeResult(ex, r.value)} />
              <button onClick={() => setToDelete(r)} className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-page hover:text-red-700" aria-label="Удалить результат">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Удалить результат?"
        footer={
          <>
            <Button
              variant="danger"
              full
              onClick={() => {
                if (toDelete) removeFitnessResult(toDelete.id);
                setToDelete(null);
                toast('Результат удалён', 'info');
              }}
            >
              Удалить
            </Button>
            <Button variant="secondary" full onClick={() => setToDelete(null)} data-autofocus>
              Отмена
            </Button>
          </>
        }
      >
        {toDelete && (
          <p>
            {ex.title}: <b>{formatValue(ex, toDelete.value)}</b> от {formatDate(toDelete.date)}
          </p>
        )}
      </Modal>
    </Card>
  );
}
