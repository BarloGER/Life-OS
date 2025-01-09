import { useEffect, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { PasswordManagerContext } from '@features/password-manager/context/index';
import { LoadingScreenPage } from '@shared/components/pages';

export const PasswordManagerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isVaultUnlocked, isVaultLoading } = useContext(
    PasswordManagerContext
  );

  useEffect(() => {
    // Solange wir laden => nix tun, gleich unten LoadingScreen
    if (isVaultLoading) return;

    const path = location.pathname;
    // 1) /password-manager/vault => Erstellen/Entsperren => immer okay,
    //    egal ob entsperrt oder nicht
    if (path === '/password-manager/vault') {
      return;
    }

    // 2) Alle anderen Routen unter /password-manager/vault/...
    // => benötigen isVaultUnlocked === true
    if (!isVaultUnlocked) {
      navigate('/password-manager/vault');
    }
  }, [isVaultUnlocked, isVaultLoading, navigate, location.pathname]);

  // Loading screen
  if (isVaultLoading) {
    return <LoadingScreenPage />;
  }

  // Sonst =>
  return <Outlet />;
};
