import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Landmark, GraduationCap, Bell, LogOut, ChevronRight, LifeBuoy, Newspaper, Database } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button, Card, Modal, SectionTitle } from '../components/ui';
import { DemoBanner } from '../components/DemoBanner';
import { useAppState } from '../hooks/useAppState';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { academyService } from '../services/academyService';
import { formatDate } from '../utils/format';

export function ProfilePage() {
  const { state } = useAppState();
  const { session, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState('');
  const [deleteBusy, setDeleteBusy] = useState(false);
  const p = state.profile!;
  const academy = academyService.get(state.selectedAcademy ?? undefined);
  const spec = academyService.specialty(state.selectedSpecialty);

  const rows: [string, string][] = [
    ['Full name', [p.lastName, p.firstName, p.middleName].filter(Boolean).join(' ')],
    ['Date of birth', formatDate(p.birthDate)],
    ['City', p.city],
    ['Gender', p.gender === 'male' ? 'Male' : 'Female'],
    ['Email', session?.user.email ?? '—'],
    ['Academy', academy?.title ?? 'Not selected'],
    ['Program', spec ? `${spec.code ? spec.code + ' · ' : ''}${spec.title}` : 'Not selected'],
  ];

  const actions = [
    { to: '/profile/edit', label: 'Edit profile', Icon: Pencil },
    { to: '/academies', label: 'Change academy', Icon: Landmark },
    { to: academy ? `/academies/${academy.id}/specialties` : '/academies', label: 'Change program', Icon: GraduationCap },
    { to: '/profile/notifications', label: 'Notification settings', Icon: Bell },
    { to: '/profile/data', label: 'Backup & restore', Icon: Database },
    { to: '/news', label: 'News', Icon: Newspaper },
    { to: '/support', label: 'Support', Icon: LifeBuoy },
  ];

  return (
    <>
      <PageHeader title="Profile" />
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-navy font-display text-xl font-semibold text-gold">
          {(p.firstName[0] ?? '') + (p.lastName[0] ?? '')}
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{p.firstName} {p.lastName}</p>
          <p className="truncate text-sm text-muted">{session?.user.email}</p>
        </div>
      </div>
      {session?.isDemo && <DemoBanner className="mb-4" />}
      <Card className="!py-1">
        <dl>
          {rows.map(([k, v]) => (
            <div key={k} className="border-b border-line py-2.5 last:border-0">
              <dt className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">{k}</dt>
              <dd className="mt-0.5 text-[15px] leading-snug [overflow-wrap:anywhere]">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <SectionTitle>Actions</SectionTitle>
      <Card className="!p-0">
        <ul>
          {actions.map(({ to, label, Icon }) => (
            <li key={label} className="border-b border-line last:border-0">
              <Link to={to} className="flex min-h-[54px] items-center gap-3 px-4 font-medium">
                <Icon className="h-5 w-5 text-navy" aria-hidden />
                <span className="flex-1">{label}</span>
                <ChevronRight className="h-5 w-5 text-muted" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
      <Button variant="danger" full className="mt-4" icon={<LogOut className="h-4 w-4" />} onClick={() => setConfirm(true)}>
        Sign out
      </Button>

      {session?.isDemo && (
        <Button
          variant="ghost"
          full
          className="mt-2 text-red-700"
          onClick={() => {
            setDeletePhrase('');
            setConfirmDelete(true);
          }}
        >
          Delete demo account and local data
        </Button>
      )}

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Sign out?"
        footer={
          <>
            <Button
              variant="danger"
              full
              loading={busy}
              onClick={async () => {
                setBusy(true);
                await logout();
                setBusy(false);
                setConfirm(false);
                toast('You have signed out', 'info');
                navigate('/login', { replace: true });
              }}
            >
              Sign out
            </Button>
            <Button variant="secondary" full onClick={() => setConfirm(false)} data-autofocus>
              Cancel
            </Button>
          </>
        }
      >
        <p className="text-muted">{session?.isDemo ? 'Demo account data stays on this device — you can sign in again.' : 'You can sign in again at any time.'}</p>
      </Modal>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete demo account?"
        footer={
          <>
            <Button
              variant="danger"
              full
              loading={deleteBusy}
              disabled={deletePhrase !== 'DELETE'}
              onClick={async () => {
                setDeleteBusy(true);
                try {
                  await deleteAccount();
                  setConfirmDelete(false);
                  toast('Demo account and local data deleted', 'info');
                  navigate('/login', { replace: true });
                } catch (err) {
                  toast((err as Error).message, 'error');
                } finally {
                  setDeleteBusy(false);
                }
              }}
            >
              Delete permanently
            </Button>
            <Button variant="secondary" full onClick={() => setConfirmDelete(false)} data-autofocus>
              Cancel
            </Button>
          </>
        }
      >
        <p>
          This removes your demo account, profile, checklists, results, support messages and notification settings from
          this browser. It cannot be undone. Export a backup first if you want to keep a copy.
        </p>
        <label className="mt-3 block text-sm font-semibold" htmlFor="delete-confirm">
          Type DELETE to confirm
        </label>
        <input
          id="delete-confirm"
          value={deletePhrase}
          onChange={(e) => setDeletePhrase(e.target.value)}
          className="mt-1 min-h-[44px] w-full rounded-lg border border-line px-3"
          autoComplete="off"
        />
      </Modal>
    </>
  );
}
