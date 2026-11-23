import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { ProfileForm } from './ProfileSetupPage';
import { useAppState } from '../hooks/useAppState';
import { useToast } from '../hooks/useToast';

export function ProfileEditPage() {
  const { state } = useAppState();
  const navigate = useNavigate();
  const toast = useToast();
  return (
    <>
      <PageHeader title="Редактировать профиль" back="/profile" />
      <ProfileForm
        initial={state.profile}
        submitLabel="Сохранить"
        onSaved={() => {
          toast('Профиль обновлён');
          navigate('/profile');
        }}
      />
    </>
  );
}
