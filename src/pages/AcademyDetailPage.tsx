import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { ExternalLink, Stethoscope, FileText, Dumbbell, ChevronRight, Info, Phone, Mail, Globe, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { FactRow, InlineSource } from '../components/FactRow';
import { SpecialtyCard } from '../components/SpecialtyCard';
import { Button, Card, Modal, ProgressBar, SectionTitle, Tabs, EmptyState } from '../components/ui';
import { academyService } from '../services/academyService';
import { useAppState, usePath } from '../hooks/useAppState';
import { useToast } from '../hooks/useToast';
import type { Academy } from '../types';

type Tab = 'about' | 'specialties' | 'requirements' | 'path';

export function AcademyDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const academy = academyService.get(id);
  const { state, selectAcademy, markRequirementsViewed } = useAppState();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);

  const routeTab: Tab = location.pathname.endsWith('/specialties') ? 'specialties' : ((params.get('tab') as Tab) || 'about');
  const [tab, setTab] = useState<Tab>(routeTab);
  useEffect(() => setTab(routeTab), [routeTab]);
  useEffect(() => {
    if (tab === 'requirements') markRequirementsViewed();
  }, [tab, markRequirementsViewed]);

  if (!academy) return <Navigate to="/academies" replace />;
  const isSelected = state.selectedAcademy === academy.id;

  const changeTab = (t: Tab) => {
    setTab(t);
    if (t === 'specialties') navigate(`/academies/${academy.id}/specialties`, { replace: true });
    else if (location.pathname.endsWith('/specialties')) navigate(`/academies/${academy.id}${t === 'about' ? '' : `?tab=${t}`}`, { replace: true });
    else setParams(t === 'about' ? {} : { tab: t }, { replace: true });
  };

  return (
    <>
      <PageHeader title={academy.shortTitle} subtitle={academy.city} back="/academies" />

      <section className="mb-4">
        <h2 className="text-[20px] font-semibold leading-snug text-ink [overflow-wrap:anywhere] [text-wrap:balance]">{academy.title}</h2>
        {academy.nameNote && <p className="mt-1.5 text-[12.5px] leading-snug text-muted">{academy.nameNote}</p>}
        <InlineSource refData={academy.nameRef} />
        <div className="mt-3">
          {isSelected ? (
            <p className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1.5 text-[13px] font-semibold text-navy">
              <CheckCircle2 className="h-4 w-4 text-gold-dark" aria-hidden /> Вы выбрали эту академию
            </p>
          ) : (
            <Button variant="gold" full onClick={() => setConfirm(true)}>
              Выбрать эту академию
            </Button>
          )}
        </div>
      </section>

      <div className="sticky z-20 -mx-4 mb-4 bg-page/95 px-4 py-2 backdrop-blur" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 62px)' }}>
        <Tabs<Tab>
          label="Разделы академии"
          value={tab}
          onChange={changeTab}
          tabs={[
            { id: 'about', label: 'Об академии' },
            { id: 'specialties', label: 'Специальности' },
            { id: 'requirements', label: 'Требования' },
            { id: 'path', label: 'Мой путь' },
          ]}
        />
      </div>

      {tab === 'about' && <AboutTab academy={academy} />}
      {tab === 'specialties' && <SpecialtiesTab academy={academy} />}
      {tab === 'requirements' && <RequirementsTab />}
      {tab === 'path' && <PathTab academy={academy} />}

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Выбрать академию?"
        footer={
          <>
            <Button
              data-autofocus
              full
              onClick={() => {
                selectAcademy(academy.id);
                setConfirm(false);
                toast('Академия выбрана');
                changeTab('specialties');
              }}
            >
              Подтвердить
            </Button>
            <Button variant="secondary" full onClick={() => setConfirm(false)}>
              Отмена
            </Button>
          </>
        }
      >
        <p className="text-muted">Вы выбираете:</p>
        <p className="mt-1 font-semibold">{academy.title}</p>
        {state.selectedSpecialty && academyService.specialty(state.selectedSpecialty)?.academyId !== academy.id && (
          <p className="mt-3 rounded-lg bg-amber-50 p-2.5 text-sm text-amber-900">Ранее выбранная специальность относится к другой академии и будет сброшена.</p>
        )}
      </Modal>
    </>
  );
}

function AboutTab({ academy }: { academy: Academy }) {
  const icon = { phone: Phone, email: Mail, web: Globe };
  return (
    <>
      <Card>
        <dl>
          <FactRow label="Город" fact={{ ...academy.address, value: academy.city }} />
          <FactRow label="Адрес" fact={academy.address} />
          <FactRow label="Год основания" fact={academy.founded} />
          <FactRow label="Кратко об истории" fact={academy.history} />
          <FactRow label="Направления подготовки" fact={academy.directions} />
          <FactRow label="Условия обучения" fact={academy.studyConditions} />
          <FactRow label="Общежитие" fact={academy.dormitory} />
          <FactRow label="Питание" fact={academy.meals} />
          <FactRow label="Стипендия" fact={academy.stipend} />
          <FactRow label="Трудоустройство" fact={academy.employment} />
        </dl>
      </Card>

      <SectionTitle>Официальные контакты</SectionTitle>
      <Card className="!p-0">
        <ul>
          {academy.contacts.map((c) => {
            const I = icon[c.kind];
            const href = c.kind === 'phone' ? `tel:${c.value.replace(/[^\d+]/g, '')}` : c.kind === 'email' ? `mailto:${c.value}` : academy.website;
            return (
              <li key={c.label + c.value} className="border-b border-line px-4 py-3 last:border-0">
                <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">{c.label}</p>
                <a
                  href={href}
                  target={c.kind === 'web' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="mt-0.5 inline-flex min-h-[36px] items-center gap-2 font-semibold text-navy [overflow-wrap:anywhere]"
                >
                  <I className="h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
                  <span className="select-all tabular-nums">{c.value}</span>
                </a>
                <InlineSource refData={c.ref} />
              </li>
            );
          })}
        </ul>
      </Card>
      <a
        href={academy.website}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-line bg-white font-semibold text-navy"
      >
        Официальный сайт <ExternalLink className="h-4 w-4" aria-hidden />
      </a>
    </>
  );
}

function SpecialtiesTab({ academy }: { academy: Academy }) {
  const { state } = useAppState();
  const list = academyService.specialties(academy.id);
  if (!list.length) return <EmptyState title="Программы не найдены" text="Подтверждённых образовательных программ нет." />;
  return (
    <div className="flex flex-col gap-3">
      <p className="flex gap-2 rounded-xl bg-white p-3 text-[13px] leading-snug text-muted shadow-card">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" aria-hidden />
        Названия приведены так, как указаны в источнике. Если источники расходятся, это отмечено в карточке программы.
      </p>
      {list.map((s) => (
        <SpecialtyCard key={s.id} s={s} selected={state.selectedSpecialty === s.id} />
      ))}
    </div>
  );
}

export function RequirementsLinks() {
  const { state } = useAppState();
  const items = [
    { to: '/vvk', title: 'ВВК', text: 'Чеклист военно-врачебной комиссии', Icon: Stethoscope, meta: `${Object.values(state.vvkProgress).filter(Boolean).length} отмечено` },
    { to: '/documents', title: 'Документы', text: 'Статус каждого документа', Icon: FileText, meta: `${Object.values(state.documentsProgress).filter((v) => v === 'ready').length} готово` },
    { to: '/fitness', title: 'Физическая подготовка', text: 'Нормативы и ваши результаты', Icon: Dumbbell, meta: `${state.fitnessResults.length} результатов` },
  ];
  return (
    <div className="flex flex-col gap-3">
      {items.map(({ to, title, text, Icon, meta }) => (
        <Link key={to} to={to} className="flex min-h-[72px] items-center gap-3 rounded-xl2 border border-line bg-white p-4 shadow-card transition active:scale-[0.99]">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-navy text-gold">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-ink">{title}</span>
            <span className="block text-[13px] text-muted">{text}</span>
          </span>
          <span className="text-[12px] font-semibold text-muted">{meta}</span>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
        </Link>
      ))}
    </div>
  );
}

function RequirementsTab() {
  return (
    <>
      <RequirementsLinks />
      <Link to="/requirements" className="mt-4 flex min-h-[48px] items-center justify-center gap-1 font-semibold text-navy">
        Этапы и общие требования <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </>
  );
}

function PathTab({ academy }: { academy: Academy }) {
  const { state } = useAppState();
  const { percent, done, total, next } = usePath();
  const spec = academyService.specialty(state.selectedSpecialty);
  const isMine = state.selectedAcademy === academy.id;
  return (
    <Card>
      {!isMine && <p className="mb-3 rounded-lg bg-amber-50 p-2.5 text-sm text-amber-900">Эта академия не выбрана. Путь рассчитывается для выбранной академии.</p>}
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Готовность</p>
      <p className="font-display text-4xl font-semibold text-navy tabular-nums">{percent}%</p>
      <div className="mt-2">
        <ProgressBar value={percent / 100} label="Готовность" />
      </div>
      <p className="mt-2 text-sm text-muted">
        {done} из {total} этапов · Специальность: {spec?.title ?? 'не выбрана'}
      </p>
      {next && <p className="mt-2 text-sm">Следующий шаг: <b>{next.title}</b></p>}
      <Link to="/my-path" className="mt-4 flex min-h-[48px] items-center justify-center rounded-xl bg-navy font-semibold text-white">
        Открыть «Мой путь»
      </Link>
    </Card>
  );
}
