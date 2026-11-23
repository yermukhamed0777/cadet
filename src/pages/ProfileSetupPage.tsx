import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Field } from '../components/ui';
import { useAppState } from '../hooks/useAppState';
import { useToast } from '../hooks/useToast';
import type { Gender, Profile } from '../types';
import { validateBirthDate, validateName } from '../utils/validation';
import { LogoMark } from '../components/ui';

export function ProfileForm({
  initial,
  submitLabel,
  onSaved,
}: {
  initial?: Profile | null;
  submitLabel: string;
  onSaved: () => void;
}) {
  const { saveProfile } = useAppState();
  const [p, setP] = useState<Profile>(
    initial ?? { lastName: '', firstName: '', middleName: '', birthDate: '', city: '', gender: '' as Gender },
  );
  const [touched, setTouched] = useState(false);
  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) => setP({ ...p, [k]: e.target.value });

  const errors = {
    lastName: validateName(p.lastName, 'Фамилия'),
    firstName: validateName(p.firstName, 'Имя'),
    middleName: validateName(p.middleName, 'Отчество', false),
    birthDate: validateBirthDate(p.birthDate),
    city: p.city.trim().length < 2 ? 'Укажите город' : null,
    gender: p.gender ? null : 'Выберите пол',
  };
  const e = touched ? errors : ({} as Partial<typeof errors>);

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    setTouched(true);
    if (Object.values(errors).some(Boolean)) return;
    saveProfile({ ...p, lastName: p.lastName.trim(), firstName: p.firstName.trim(), middleName: p.middleName.trim(), city: p.city.trim() });
    onSaved();
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Field id="lastName" label="Фамилия" autoComplete="family-name" value={p.lastName} onChange={set('lastName')} error={e.lastName} />
      <Field id="firstName" label="Имя" autoComplete="given-name" value={p.firstName} onChange={set('firstName')} error={e.firstName} />
      <Field id="middleName" label="Отчество (при наличии)" autoComplete="additional-name" value={p.middleName} onChange={set('middleName')} error={e.middleName} />
      <Field id="birthDate" label="Дата рождения" type="date" max={today} value={p.birthDate} onChange={set('birthDate')} error={e.birthDate} />
      <Field id="city" label="Город" autoComplete="address-level2" value={p.city} onChange={set('city')} error={e.city} />
      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-ink">Пол</legend>
        <p className="mb-2 text-[13px] text-muted">Нужен, чтобы показывать соответствующие нормативы физической подготовки.</p>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ['male', 'Мужской'],
              ['female', 'Женский'],
            ] as const
          ).map(([v, l]) => (
            <label
              key={v}
              className={`flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${
                p.gender === v ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink'
              }`}
            >
              <input type="radio" name="gender" value={v} checked={p.gender === v} onChange={() => setP({ ...p, gender: v })} className="sr-only" />
              {l}
            </label>
          ))}
        </div>
        {e.gender && <p className="mt-1.5 text-[13px] font-medium text-red-700">{e.gender}</p>}
      </fieldset>
      <Button type="submit" full className="mt-2">
        {submitLabel}
      </Button>
    </form>
  );
}

export function ProfileSetupPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { state } = useAppState();
  return (
    <div className="min-h-screen bg-page px-5 pb-10" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)' }}>
      <div className="mx-auto max-w-md">
        <div className="mb-5 flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gold-dark">Шаг 1 из 2</p>
            <h1 className="text-xl font-semibold text-ink">Профиль абитуриента</h1>
          </div>
        </div>
        <ProfileForm
          initial={state.profile}
          submitLabel="Сохранить и продолжить"
          onSaved={() => {
            toast('Профиль сохранён');
            navigate(state.selectedAcademy ? '/home' : '/onboarding/academies', { replace: true });
          }}
        />
      </div>
    </div>
  );
}
