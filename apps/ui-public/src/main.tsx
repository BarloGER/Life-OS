import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Router } from './shared/Router';
import { FPSCounter } from './shared/utils/FPSCounter';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <FPSCounter />
    <Router />
  </StrictMode>
);
