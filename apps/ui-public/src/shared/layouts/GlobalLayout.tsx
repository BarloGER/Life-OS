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
      path === '/forgot-password' ||
      path === '/verify-email' ||
      path === '/resend-email-verification' ||
      path === '/register' ||
      path === '/support';

    if (!isExceptionPath) {
      if (isBlocked) {
        navigate('/blocked');
      } else if (!isAuthenticated) {
        navigate('/login');
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
