import { useEffect, useContext, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Vault } from '@features/password-manager/entities/index';
import { PasswordManagerContext } from '@features/password-manager/context/index';
import { LoadingScreenPage } from '@shared/components/pages';

type GetVaultResponse = {
  success: boolean;
  errorCode?: string;
  message?: string;
  vault?: Vault;
};

export const PasswordManagerLayout = () => {
  const navigate = useNavigate();
  const {
    isVaultLoading,
    setIsVaultLoading,
    vaultData,
    setVaultData,
    setHasVault,
  } = useContext(PasswordManagerContext);

  async function getVaultRequest(): Promise<GetVaultResponse> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/password-manager/public/get-vault`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      return (await response.json()) as GetVaultResponse;
    } catch (error) {
      console.error('Get vault request failed:', error);
      return {
        success: false,
        message: 'Failed to fetch',
      };
    }
  }

  const getVault = useCallback(async () => {
    setIsVaultLoading(true);

    const response = await getVaultRequest();

    if (!response.success && response.vault) {
      setVaultData(null);
      setHasVault(false);
      setIsVaultLoading(false);
      navigate('/password-manager/vault');
      return;
    }

    if (!response.success) {
      setVaultData(null);
      setHasVault(false);
      setIsVaultLoading(false);
      navigate('/password-manager/vault');
      return;
    }

    setVaultData(response.vault ?? null);
    setHasVault(true);
    setIsVaultLoading(false);
  }, [navigate, setHasVault, setVaultData, setIsVaultLoading]);

  useEffect(() => {
    if (vaultData) return;
    getVault();
  }, [getVault, vaultData]);

  if (isVaultLoading) {
    return <LoadingScreenPage />;
  }

  return <Outlet />;
};
