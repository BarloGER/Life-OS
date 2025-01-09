import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Router } from './shared/Router';
import { FPSCounter } from './shared/utils/FPSCounter';
import { AuthProvider, DesignProvider } from '@shared/context/index';
import '@shared/configs/i18Config';
import { PasswordManagerProvider } from '@features/password-manager/context/PasswordManagerContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    {/* <FPSCounter /> */}
    <AuthProvider>
      <PasswordManagerProvider>
        <DesignProvider>
          <Router />
        </DesignProvider>
      </PasswordManagerProvider>
    </AuthProvider>
  </StrictMode>
);
