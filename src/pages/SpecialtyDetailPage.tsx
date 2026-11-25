import { useState, type ReactNode } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button, Card, Modal, NoData, SourceLink } from '../components/ui';
import { academyService } from '../services/academyService';
import { useAppState } from '../hooks/useAppState';
import { useToast } from '../hooks/useToast';

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-line py-3.5 last:border-0">
      <h3 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">{title}</h3>
      <div className="mt-1 text-[15px] leading-relaxed text-ink [overflow-wrap:anywhere]">{children}</div>
    </section>
  );
}

export function SpecialtyDetailPage() {
  const { id } = useParams();
  const s = academyService.specialty(id);
  const navigate = useNavigate();
  const toast = useToast();
  const { state, selectSpecialty } = useAppState();
  const [confirm, setConfirm] = useState(false);
  if (!s) return <Navigate to="/academies" replace />;
  const academy = academyService.get(s.academyId)!;
  const isSelected = state.selectedSpecialty === s.id;

  const later = () => {
    toast('You can select a program later', 'info');
    navigate(state.selectedAcademy ? '/home' : `/academies/${academy.id}/specialties`);
  };

  return (
    <>
      <PageHeader title="Program" subtitle={academy.shortTitle} back={`/academies/${academy.id}/specialties`} />

      <div className="mb-4">
        {s.code && <span className="mb-2 inline-block rounded-md bg-navy px-2 py-0.5 font-mono text-[12px] font-semibold tracking-wide text-gold">{s.code}</span>}
        <h2 className="text-[22px] font-semibold leading-tight text-ink [overflow-wrap:anywhere] [text-wrap:balance]">{s.title}</h2>
        <Link to={`/academies/${academy.id}`} className="mt-1 inline-flex min-h-[32px] items-center gap-1 text-sm font-medium text-navy-600">
          {academy.title} <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {s.discrepancy && (
        <div className="mb-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13.5px] leading-snug text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            <b>Sources disagree.</b> {s.discrepancy}
          </p>
        </div>
      )}

      <Card>
        <Block title="About the program">{s.summary ?? <NoData text="No description found in verified sources" />}</Block>
        <Block title="What you study">
          {s.studyAreas.length ? (
            <ul className="list-disc space-y-0.5 pl-5">
              {s.studyAreas.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          ) : (
            <NoData />
          )}
        </Block>
        <Block title="Degree level">{s.level}</Block>
        <Block title="Duration">{s.duration ?? <NoData />}</Block>
        <Block title="Qualification">{s.qualification ?? <NoData />}</Block>
        <Block title="Career paths">
          {s.careers.length ? (
            <ul className="list-disc space-y-0.5 pl-5">
              {s.careers.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          ) : (
            <NoData />
          )}
        </Block>
        <Block title="Eligibility & steps">
          <Link to="/requirements" className="inline-flex min-h-[36px] items-center gap-1 font-semibold text-navy">
            Medical exam, documents, fitness test <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </Block>
        <Block title="Applicable year">{s.applicableYear ?? <NoData text="No year listed in the source" />}</Block>
      </Card>

      <div className="mt-4">
        <SourceLink refData={s} />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {isSelected ? (
          <p className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gold/15 font-semibold text-navy">
            <CheckCircle2 className="h-5 w-5 text-gold-dark" aria-hidden /> This program is selected
          </p>
        ) : (
          <Button variant="gold" full onClick={() => setConfirm(true)}>
            Select this program
          </Button>
        )}
        <Button variant="secondary" full onClick={later}>
          {isSelected ? 'Go home' : 'Choose later'}
        </Button>
      </div>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Confirm selection"
        footer={
          <>
            <Button
              data-autofocus
              full
              onClick={() => {
                selectSpecialty(s.id);
                setConfirm(false);
                toast('Program saved to your profile');
                navigate('/home');
              }}
            >
              Confirm
            </Button>
            <Button variant="secondary" full onClick={() => setConfirm(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">You are selecting:</p>
        <p className="mt-0.5 font-semibold">{s.title}</p>
        <p className="mt-3 text-sm text-muted">Academy:</p>
        <p className="mt-0.5 font-semibold">{academy.title}</p>
        {state.selectedAcademy && state.selectedAcademy !== academy.id && (
          <p className="mt-3 rounded-lg bg-amber-50 p-2.5 text-sm text-amber-900">Your selected academy will change to this one.</p>
        )}
        <p className="mt-3 text-[13px] text-muted">You can change your selection at any time in your profile.</p>
      </Modal>
    </>
  );
}
