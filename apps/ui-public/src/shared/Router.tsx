import { BrowserRouter, Routes, Route } from 'react-router';
import { GlobalLayout } from './layouts';
import { PasswordManagerLayout } from '@features/password-manager/layouts/index';
import {
  LandingPage,
  FeatureOverviewPage,
  UserProfile,
} from '@shared/components/pages';
import {
  LoginPage,
  RegisterPage,
  RequestPasswordResetPage,
  ResendEmailVerificationPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from '@features/authentication/components/pages';
import { VaultPage } from '@features/password-manager/components/pages';
import { VaultOverviewPage } from '@features/password-manager/components/pages/VaultOverviewPage';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GlobalLayout />}>
          <Route index element={<LandingPage />} />

          <Route path="/authentication/login" element={<LoginPage />} />
          <Route path="/authentication/register" element={<RegisterPage />} />
          <Route
            path="/authentication/verify-email"
            element={<VerifyEmailPage />}
          />
          <Route
            path="/authentication/resend-email-verification"
            element={<ResendEmailVerificationPage />}
          />
          <Route
            path="/authentication/reset-password"
            element={<ResetPasswordPage />}
          />
          <Route
            path="/authentication/request-password-reset"
            element={<RequestPasswordResetPage />}
          />

          <Route path="user-profile" element={<UserProfile />} />

          <Route path="features" element={<FeatureOverviewPage />} />

          <Route
            path="password-manager/vault"
            element={<PasswordManagerLayout />}
          >
            <Route index element={<VaultPage />} />
            <Route path="overview" element={<VaultOverviewPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
