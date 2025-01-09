import { useTranslation } from 'react-i18next';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { Account } from '@features/password-manager/entities/index';

import './assets/account-list.css';

interface AccountListProps {
  accountList: Account[];
  setCurrentAccount: (acc: Account) => void;
}

export const AccountList: React.FC<AccountListProps> = ({
  accountList,
  setCurrentAccount,
}) => {
  const { t } = useTranslation();

  if (!accountList || accountList.length === 0) {
    return <span>{t('passwordManager.accountList.noAccounts')}</span>;
  }

  return (
    <div className="account-list">
      <h1>{t('passwordManager.accountList.title')}</h1>
      <ul>
        {accountList.map((account) => (
          <li
            key={account.id}
            onClick={() => setCurrentAccount(account)}
            className="account-list__item"
          >
            {account.accountName} <FaAngleDoubleRight />
          </li>
        ))}
      </ul>
    </div>
  );
};
