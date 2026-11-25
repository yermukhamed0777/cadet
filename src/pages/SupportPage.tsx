import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Accordion, Button, Card, Field, SectionTitle, TextArea } from '../components/ui';
import { InlineSource } from '../components/FactRow';
import { faq } from '../data/faq';
import { academyService } from '../services/academyService';
import { supportService } from '../services/profileService';
import { isDemoMode } from '../services/config';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { formatDate } from '../utils/format';

export function SupportPage() {
  const { session } = useAuth();
  const toast = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [sent, setSent] = useState(() => (session ? supportService.list(session.user.id) : []));

  const errS = touched && subject.trim().length < 3 ? 'At least 3 characters' : null;
  const errM = touched && message.trim().length < 10 ? 'At least 10 characters' : null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (subject.trim().length < 3 || message.trim().length < 10 || !session) return;
    setBusy(true);
    try {
      const m = await supportService.send(session.user.id, subject.trim(), message.trim());
      setStatus(m.delivery === 'local_demo' ? 'In Demo mode, your message is saved locally.' : 'Message sent.');
      toast(m.delivery === 'local_demo' ? 'Saved locally (Demo mode)' : 'Sent');
      setSubject('');
      setMessage('');
      setTouched(false);
      setSent(supportService.list(session.user.id));
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Support" back />
      <SectionTitle>FAQ</SectionTitle>
      <div className="flex flex-col gap-2">
        {faq.map((f) => (
          <Accordion key={f.id} header={<span className="font-medium text-ink">{f.question}</span>}>
            <p className="text-[14px] leading-relaxed text-ink/85">{f.answer}</p>
            {f.link && (
              <Link to={f.link.to} className="mt-2 inline-flex min-h-[40px] items-center gap-1 text-sm font-semibold text-navy">
                {f.link.label} <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
          </Accordion>
        ))}
      </div>

      <SectionTitle>Official contacts</SectionTitle>
      <div className="flex flex-col gap-2">
        {academyService.list().map((a) => (
          <Accordion key={a.id} header={<span className="font-medium text-ink">{a.shortTitle}</span>}>
            <ul className="flex flex-col gap-3">
              {a.contacts.map((c) => (
                <li key={c.label + c.value}>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">{c.label}</p>
                  <p className="select-all font-semibold tabular-nums text-navy [overflow-wrap:anywhere]">{c.value}</p>
                  <InlineSource refData={c.ref} />
                </li>
              ))}
            </ul>
          </Accordion>
        ))}
      </div>

      <SectionTitle>Ask a question</SectionTitle>
      <Card>
        {isDemoMode() && <p className="mb-3 rounded-lg bg-amber-50 p-2.5 text-[13px] text-amber-900">No backend is connected: messages are saved only on this device and are not sent to anyone.</p>}
        <form onSubmit={submit} noValidate className="flex flex-col gap-3">
          <Field id="subject" label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} error={errS} maxLength={120} />
          <TextArea id="message" label="Message" value={message} onChange={(e) => setMessage(e.target.value)} error={errM} maxLength={2000} />
          <Button type="submit" full loading={busy}>
            Send
          </Button>
          {status && (
            <p role="status" className="rounded-lg bg-emerald-50 p-2.5 text-sm font-medium text-emerald-900">
              {status}
            </p>
          )}
        </form>
      </Card>
      {sent.length > 0 && (
        <>
          <SectionTitle>Your messages</SectionTitle>
          <ul className="flex flex-col gap-2">
            {sent.map((m) => (
              <li key={m.id} className="rounded-xl border border-line bg-white p-3 text-sm">
                <p className="font-semibold">{m.subject}</p>
                <p className="mt-0.5 line-clamp-2 text-ink/80">{m.message}</p>
                <p className="mt-1 text-[12px] text-muted">
                  {formatDate(m.createdAt)} · {m.delivery === 'local_demo' ? 'saved locally (Demo mode)' : 'sent'}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
