import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppStateProvider } from './context/AppStateContext';
import { ToastProvider } from './context/ToastContext';
import { GuestOnly, RequireAuth, RequireProfile, RootRedirect } from './components/Guards';
import { AppLayout } from './layouts/AppLayout';
import { AuthPage } from './pages/AuthPage';
import { OAuthCallbackPage } from './pages/OAuthCallbackPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { OnboardingAcademiesPage } from './pages/OnboardingAcademiesPage';
import { HomePage } from './pages/HomePage';
import { AcademiesPage } from './pages/AcademiesPage';
import { AcademyDetailPage } from './pages/AcademyDetailPage';
import { SpecialtyDetailPage } from './pages/SpecialtyDetailPage';
import { RequirementsPage } from './pages/RequirementsPage';
import { VvkPage } from './pages/VvkPage';
import { VvkMapPage } from './pages/VvkMapPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { FitnessPage } from './pages/FitnessPage';
import { MyPathPage } from './pages/MyPathPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { NewsPage } from './pages/NewsPage';
import { SupportPage } from './pages/SupportPage';
import { ComparePage } from './pages/ComparePage';
import { ProfilePage } from './pages/ProfilePage';
import { ProfileEditPage } from './pages/ProfileEditPage';
import { NotificationSettingsPage } from './pages/NotificationSettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

const Router = __ROUTER_MODE__ === 'hash' ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppStateProvider>
          <Router>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route element={<GuestOnly />}>
                <Route path="/login" element={<AuthPage mode="login" />} />
                <Route path="/register" element={<AuthPage mode="register" />} />
              </Route>
              <Route path="/auth/callback" element={<OAuthCallbackPage />} />

              <Route element={<RequireAuth />}>
                <Route path="/profile/setup" element={<ProfileSetupPage />} />
                <Route element={<RequireProfile />}>
                  <Route path="/onboarding/academies" element={<OnboardingAcademiesPage />} />
                  <Route element={<AppLayout />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/academies" element={<AcademiesPage />} />
                    <Route path="/academies/:id" element={<AcademyDetailPage />} />
                    <Route path="/academies/:id/specialties" element={<AcademyDetailPage />} />
                    <Route path="/specialties/:id" element={<SpecialtyDetailPage />} />
                    <Route path="/requirements" element={<RequirementsPage />} />
                    <Route path="/vvk" element={<VvkPage />} />
                    <Route path="/vvk/map" element={<VvkMapPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/fitness" element={<FitnessPage />} />
                    <Route path="/my-path" element={<MyPathPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/edit" element={<ProfileEditPage />} />
                    <Route path="/profile/notifications" element={<NotificationSettingsPage />} />
                  </Route>
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AppStateProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
