import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdAssignmentAdd, MdLock, MdSearch } from 'react-icons/md';
import './assets/vault-nav-bar.css';

interface NavBarProps {
  onHamburgerClick: () => void;
  onCreateAccountClick: () => void;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  searchValue: string;
  onCloseVault: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  onHamburgerClick,
  onCreateAccountClick,
  onSearchChange,
  searchValue,
  onCloseVault,
}) => {
  const { t } = useTranslation();

  return (
    <nav className="vault-nav-bar">
      <div className="vault-nav-bar__container">
        <div>
          <button
            className="vault-nav-bar__hamburger"
            onClick={onHamburgerClick}
          >
            <GiHamburgerMenu />
          </button>
        </div>

        <div className="vault-nav-bar__search">
          <input
            type="text"
            placeholder={t('passwordManager.search.placeholders.search')}
            value={searchValue}
            onChange={onSearchChange}
          />
        </div>

        <div className="vault-nav-bar__actions">
          <button
            className="vault-nav-bar__create-btn"
            onClick={onCreateAccountClick}
          >
            <MdAssignmentAdd />
          </button>

          <button className="vault-nav-bar__lock-btn" onClick={onCloseVault}>
            <MdLock />
          </button>
        </div>
      </div>
    </nav>
  );
};
