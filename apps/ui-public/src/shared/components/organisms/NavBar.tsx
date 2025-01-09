import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AuthContext } from '@shared/context/AuthContext';

import './assets/nav-bar.css';

export const NavBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const changeLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'de' : 'en';
    i18n.changeLanguage(newLang);
  };

  async function logoutRequest() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/authentication/public/logout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );
      return response.json();
    } catch (error) {
      console.error('Logout request failed:', error);
      return { success: false };
    }
  }

  async function logout() {
    const logoutResponse = await logoutRequest();
    console.log(logoutResponse);
    if (logoutResponse && logoutResponse.success) {
      setIsAuthenticated(false);
    }
  }

  const isEnglish = i18n.language.startsWith('en');
  const flagSrc = isEnglish ? '/flag-en.svg' : '/flag-de.svg';
  const flagAlt = isEnglish ? 'US Flag' : 'German Flag';

  return (
    <nav className="nav-bar">
      <div className="nav-bar__container">
        <div className="nav-bar__brand">
          <Link to="/">
            <h3>LifeOS</h3>
          </Link>
        </div>

        <button
          className="nav-bar__hamburger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <GiHamburgerMenu />
        </button>

        <div className={`nav-bar__links ${menuOpen ? 'open' : ''}`}>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/"
                className="nav-bar__link"
                onClick={() => setMenuOpen(false)}
              >
                {t('navBar.links.home')}
              </NavLink>
              <NavLink
                to="/features"
                className="nav-bar__link"
                onClick={() => setMenuOpen(false)}
              >
                {t('navBar.links.features')}
              </NavLink>
              <NavLink
                to="/user-profile"
                className="nav-bar__link"
                onClick={() => setMenuOpen(false)}
              >
                {t('navBar.links.userProfile')}
              </NavLink>
              <button onClick={logout} className="nav-bar__logout">
                {t('navBar.links.logout')}
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                className="nav-bar__link"
                onClick={() => setMenuOpen(false)}
              >
                {t('navBar.links.home')}
              </NavLink>
              <NavLink
                to="/authentication/login"
                className="nav-bar__link"
                onClick={() => setMenuOpen(false)}
              >
                {t('navBar.links.login')}
              </NavLink>
              <NavLink
                to="/authentication/register"
                className="nav-bar__link"
                onClick={() => setMenuOpen(false)}
              >
                {t('navBar.links.register')}
              </NavLink>
            </>
          )}
          <button onClick={changeLanguage} className="nav-bar__flag">
            <img src={flagSrc} alt={flagAlt} className="nav-bar__flag-img" />
          </button>
        </div>
      </div>
    </nav>
  );
};
