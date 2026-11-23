import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { Button, Field } from '../components/ui';
import { DemoBanner } from '../components/DemoBanner';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { authService } from '../services/authService';
import { isDemoMode, isGoogleConfigured } from '../services/config';
import { validateEmail, validatePassword } from '../utils/validation';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2.1v2.8A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.6-2.8z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.1 7.1l3.6 2.8C6.6 7.3 9.1 5.4 12 5.4z" />
    </svg>
  );
}

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const isRegister = mode === 'register';
  const googleReady = isGoogleConfigured();

  const emailErr = touched ? validateEmail(email) : null;
  const passErr = touched ? validatePassword(password, isRegister) : null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setFormError(null);
    if (validateEmail(email) || validatePassword(password, isRegister)) return;
    setBusy(true);
    try {
      if (isRegister) {
        await register(email, password);
        toast('Аккаунт создан');
        navigate('/profile/setup', { replace: true });
      } else {
        await login(email, password);
        navigate('/', { replace: true });
      }
    } catch (err) {
      setFormError((err as Error).message || 'Не удалось выполнить запрос');
    } finally {
      setBusy(false);
    }
  };

  const google = () => {
    try {
      authService.startGoogleLogin();
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold text-ink">{isRegister ? 'Регистрация' : 'Вход'}</h2>
      <p className="mt-1 text-sm text-muted">
        {isRegister ? 'Создайте аккаунт абитуриента вузов МВД РК.' : 'Войдите, чтобы продолжить подготовку.'}
      </p>

      <div className="mt-5">
        <Button variant="secondary" full onClick={google} disabled={!googleReady} icon={<GoogleIcon />} aria-describedby="google-note">
          Продолжить с Google
        </Button>
        {!googleReady && (
          <p id="google-note" className="mt-2 text-[12.5px] leading-snug text-muted">
            Вход через Google не подключён: для него нужен backend и Google Client ID (см. README). Кнопка станет активной после настройки.
          </p>
        )}
      </div>

      <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted">
        <span className="h-px flex-1 bg-line" />
        или
        <span className="h-px flex-1 bg-line" />
      </div>

      {isDemoMode() && <DemoBanner className="mb-4" />}

      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Field
          id="email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailErr}
        />
        <div className="relative">
          <Field
            id="password"
            label="Пароль"
            type={show ? 'text' : 'password'}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passErr}
            hint={isRegister ? 'Минимум 8 символов, буквы и цифры' : undefined}
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-1 top-[30px] grid h-11 w-11 place-items-center text-muted hover:text-navy"
            aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {formError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
            {formError}
          </p>
        )}
        <Button type="submit" full loading={busy}>
          {isRegister ? 'Создать аккаунт' : 'Войти'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {isRegister ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
        <Link to={isRegister ? '/login' : '/register'} className="inline-block py-2 font-semibold text-navy underline-offset-2 hover:underline">
          {isRegister ? 'Войти' : 'Зарегистрироваться'}
        </Link>
      </p>
    </AuthLayout>
  );
}
