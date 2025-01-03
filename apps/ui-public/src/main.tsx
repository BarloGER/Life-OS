import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Router } from './shared/Router';
import { FPSCounter } from './shared/utils/FPSCounter';
import { AuthProvider, DesignProvider } from '@shared/context/index';
import '@shared/configs/i18Config';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    {/* <FPSCounter /> */}
    <AuthProvider>
      <DesignProvider>
        <Router />
      </DesignProvider>
    </AuthProvider>
  </StrictMode>
);
