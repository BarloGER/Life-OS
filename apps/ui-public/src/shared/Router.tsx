import { BrowserRouter, Routes, Route } from 'react-router';
import { LandingPage } from '@shared/components/pages';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};
