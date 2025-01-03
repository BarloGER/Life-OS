import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '@shared/context/AuthContext';
import { NavLink } from 'react-router-dom';
import './assets/nav-bar.css';

export const NavBar = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  async function logoutRequest() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/public/logout`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
  }

  async function logout() {
    const logoutResponse = await logoutRequest();
    if (logoutResponse.success) {
      setIsAuthenticated(false);
    }

    return;
  }

  return (
    <nav className="nav-bar">
      <div className="nav-bar__container">
        <div className="nav-bar__brand">
          <h3>LifeOS</h3>
        </div>
        <div className="nav-bar__links">
          <button
            onClick={() => changeLanguage('en-EN')}
            className={`${
              i18n.language === 'en-EN'
                ? 'nav-bar__button--active'
                : 'nav-bar__button'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage('de-DE')}
            className={`${
              i18n.language === 'de-DE'
                ? 'nav-bar__button--active'
                : 'nav-bar__button'
            }`}
          >
            DE
          </button>
          {isAuthenticated ? (
            <>
              <NavLink to="/" className="nav-bar__link">
                {t('navBar.links.home')}
              </NavLink>
              <NavLink to="/user-profile" className="nav-bar__link">
                {t('navBar.links.userProfile')}
              </NavLink>
              <button onClick={() => logout()} className="nav-bar__logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-bar__link">
                {t('navBar.links.login')}
              </NavLink>
              <NavLink to="/register" className="nav-bar__link">
                {t('navBar.links.register')}
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
