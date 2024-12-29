import { BrowserRouter, Routes, Route } from 'react-router';
import { GlobalLayout } from './layouts';
import { LandingPage } from '@shared/components/pages';
import {
  LoginPage,
  RegisterPage,
  ResendEmailVerificationPage,
  VerifyEmailPage,
} from '@features/authentication/components/pages';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GlobalLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route
            path="/resend-email-verification"
            element={<ResendEmailVerificationPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
