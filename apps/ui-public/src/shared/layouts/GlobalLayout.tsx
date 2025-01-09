import { useEffect, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@shared/context/AuthContext';
import { LoadingScreenPage } from '@shared/components/pages';
import { NavBar } from '@shared/components/organisms';

export const GlobalLayout = () => {
  const { user, isBlocked, isAuthenticated, loadingAuthRequest } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loadingAuthRequest) {
      return;
    }

    const path = location.pathname;
    const isExceptionPath =
      path === '/' ||
      path === '/authentication/reset-password' ||
      path === '/authentication/request-password-reset' ||
      path === '/authentication/verify-email' ||
      path === '/authentication/resend-email-verification' ||
      path === '/authentication/register' ||
      path === '/authentication/support';

    if (!isExceptionPath) {
      if (isBlocked) {
        navigate('/blocked');
      } else if (!isAuthenticated) {
        navigate('/authentication/login');
      } else if (user && !user.isEmailVerified) {
        navigate('/confirm-email');
      }
    } else if (isExceptionPath) {
      if (isBlocked) {
        navigate('/blocked');
      } else if (isAuthenticated) {
        navigate('/');
      }
    }
  }, [
    isBlocked,
    isAuthenticated,
    user,
    navigate,
    loadingAuthRequest,
    location.pathname,
  ]);

  if (loadingAuthRequest) {
    return <LoadingScreenPage />;
  }

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};
