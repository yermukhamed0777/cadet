import { useState, type ChangeEvent } from 'react';
import { Download, Upload } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button, Card, Modal, SectionTitle } from '../components/ui';
import { useAppState } from '../hooks/useAppState';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { createBackup, parseBackup } from '../utils/backup';
import { emit } from '../utils/events';
import type { UserState } from '../types';

/** Local-only backup and restore for demo data that never leaves this device. */
export function DataPage() {
  const { state, replaceState } = useAppState();
  const { session } = useAuth();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<UserState | null>(null);

  const exportBackup = () => {
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([createBackup(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cadet-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    emit('backup_exported');
    toast('Backup downloaded', 'success');
  };

  const pickFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);
    const result = parseBackup(await file.text());
    if (!result.ok) {
      setError(result.error);
      toast('Backup could not be read', 'error');
      return;
    }
    setPending(result.state);
  };

  const confirmImport = () => {
    if (!pending) return;
    replaceState(pending);
    setPending(null);
    emit('backup_imported');
    toast('Backup restored', 'success');
  };

  return (
    <>
      <PageHeader title="Backup & restore" subtitle="Your data stays on this device" back="/profile" />

      <Card>
        <p className="text-[14px] leading-relaxed">
          In Demo mode your profile, checklists and results are stored only in this browser. Signing out does not
          delete them, but clearing browser data or changing devices does. Download a backup and keep it somewhere
          private — it contains your name, date of birth and checklist notes.
        </p>
        <Button className="mt-4" full icon={<Download className="h-4 w-4" />} onClick={exportBackup}>
          Download backup
        </Button>
      </Card>

      <SectionTitle>Restore a backup</SectionTitle>
      <Card>
        <p className="mb-3 text-[14px] leading-relaxed">
          Choose a CADET backup file. Its contents are checked before anything is replaced, and you will be asked to
          confirm. Restoring overwrites the current data for{' '}
          <span className="font-semibold">{session?.user.email ?? 'this account'}</span>.
        </p>
        <label className="flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-navy focus-within:ring-2 focus-within:ring-gold">
          <Upload className="h-4 w-4" aria-hidden />
          Choose backup file (.json)
          <input type="file" accept="application/json,.json" className="sr-only" onChange={pickFile} />
        </label>
        {error && (
          <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
            {error}
          </p>
        )}
      </Card>

      <Modal
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        title="Replace current data?"
        footer={
          <>
            <Button variant="danger" full onClick={confirmImport}>
              Restore backup
            </Button>
            <Button variant="secondary" full onClick={() => setPending(null)} data-autofocus>
              Cancel
            </Button>
          </>
        }
      >
        <p>Your current profile, checklists and results will be replaced by the backup. This cannot be undone.</p>
      </Modal>
    </>
  );
}
