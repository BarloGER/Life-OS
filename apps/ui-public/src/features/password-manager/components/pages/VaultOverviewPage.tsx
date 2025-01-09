// src/features/password-manager/pages/VaultOverviewPage.tsx

import React, { useState, useEffect, ChangeEvent, useContext } from 'react';
import { Account } from '@features/password-manager/entities/index';
import { PasswordManagerContext } from '../../context';
import { VaultOverviewTemplate } from '../templates/VaultOverviewTemplate';
import { TresorList } from '../organisms/TresorList';
import { AccountList } from '../organisms/AccountList';
import { AccountInfo } from '../organisms/AccountInfo';
import { CreateAccountForm } from '../organisms/CreateAccountForm';
import { EditAccountForm } from '../organisms/EditAccountForm';
import { NavBar } from '../organisms/Navbar';
import {
  getAccountsRequest,
  createAccountRequest,
  editAccountRequest,
} from '@features/password-manager/repositories/PasswordManagerRepository';
import './vault-overview-page.css';
import { LoadingScreenPage } from '@shared/components/pages';

export const VaultOverviewPage: React.FC = () => {
  /********************************
   * Overlays & local states
   ********************************/
  const [showTresorOverlay, setShowTresorOverlay] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  /********************************
   * Ausgewählter Account
   ********************************/
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);

  /********************************
   * Create-Form states
   ********************************/
  const [accountFormData, setAccountFormData] = useState({
    accountName: '',
    username: '',
    email: '',
    password: '',
    notes: '',
  });
  const [isLoadingCreateAccount, setIsLoadingCreateAccount] = useState(false);
  const [createAccountErrorMessage, setCreateAccountErrorMessage] =
    useState('');
  const [createAccountSuccessMessage, setCreateAccountSuccessMessage] =
    useState('');

  /********************************
   * Edit-Form states
   ********************************/
  const [editAccountFormData, setEditAccountFormData] = useState({
    accountName: '',
    username: '',
    email: '',
    password: '',
    notes: '',
  });
  const [isLoadingEditAccount, setIsLoadingEditAccount] = useState(false);
  const [editAccountErrorMessage, setEditAccountErrorMessage] = useState('');
  const [editAccountSuccessMessage, setEditAccountSuccessMessage] =
    useState('');

  /********************************
   * State für Laden der Accounts
   ********************************/
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [getAccountsError, setGetAccountsError] = useState('');

  /********************************
   * Context
   ********************************/
  const {
    masterPassword,
    setIsVaultUnlocked,
    accountList,
    setAccountList,
    cryptoService,
  } = useContext(PasswordManagerContext);

  /********************************
   * GET ACCOUNTS + ENTschlüsseln
   ********************************/
  async function processGetAccounts() {
    setIsLoadingAccounts(true);
    setGetAccountsError('');

    try {
      const response = await getAccountsRequest();
      if (!response.success) {
        if (response.message === 'Failed to fetch') {
          setGetAccountsError('externalService.serverError');
          return;
        }
        setGetAccountsError(
          response.errorCode || 'passwordManager.getAccounts.failed'
        );
        return;
      }

      // success => Accounts vom Backend
      if (response.accounts) {
        const newAccountList: Account[] = [];

        for (const acc of response.accounts) {
          const copy: Account = { ...acc }; // shallow copy

          // a) Entschlüsseln Password
          if (
            acc.encryptedPassword &&
            acc.passwordEncryptionIv &&
            acc.passwordEncryptionSalt
          ) {
            const decPw = await cryptoService.decrypt(
              masterPassword,
              acc.encryptedPassword,
              acc.passwordEncryptionIv,
              acc.passwordEncryptionSalt
            );
            if (decPw.success) {
              copy.decryptedPassword = decPw.data;
            }
          }

          // b) Entschlüsseln Notes
          if (
            acc.encryptedNotes &&
            acc.notesEncryptionIv &&
            acc.notesEncryptionSalt
          ) {
            const decNotes = await cryptoService.decrypt(
              masterPassword,
              acc.encryptedNotes,
              acc.notesEncryptionIv,
              acc.notesEncryptionSalt
            );
            if (decNotes.success) {
              copy.decryptedNotes = decNotes.data;
            }
          }

          newAccountList.push(copy);
        }

        setAccountList(newAccountList);
      }
    } catch (err: any) {
      console.error(err);
      setGetAccountsError(`Error fetching accounts: ${err.message}`);
    } finally {
      setIsLoadingAccounts(false);
    }
  }

  // Beim Mount => Accounts laden
  useEffect(() => {
    processGetAccounts();
  }, []);

  // Falls noch kein currentAccount => nimm den ersten
  useEffect(() => {
    if (currentAccount === null && accountList.length > 0) {
      setCurrentAccount(accountList[0]);
    }
  }, [accountList, currentAccount]);

  /********************************
   * CreateAccount
   ********************************/
  function handleCreateAccountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setAccountFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function processCreateAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoadingCreateAccount(true);
    setCreateAccountErrorMessage('');
    setCreateAccountSuccessMessage('');

    try {
      // encrypt password / notes
      const encPw = await cryptoService.encrypt(
        masterPassword,
        accountFormData.password
      );
      const encNotes = accountFormData.notes
        ? await cryptoService.encrypt(masterPassword, accountFormData.notes)
        : null;

      // createAccountRequest
      const response = await createAccountRequest({
        accountName: accountFormData.accountName,
        username: accountFormData.username,
        email: accountFormData.email,
        encryptedPassword: encPw.encryptedData,
        passwordEncryptionIv: encPw.iv,
        passwordEncryptionSalt: encPw.salt,
        encryptedNotes: encNotes ? encNotes.encryptedData : null,
        notesEncryptionIv: encNotes ? encNotes.iv : null,
        notesEncryptionSalt: encNotes ? encNotes.salt : null,
      });

      if (!response.success) {
        if (response.message === 'Failed to fetch') {
          setCreateAccountErrorMessage('externalService.serverError');
          return;
        }
        setCreateAccountErrorMessage(
          response.errorCode || 'Create account failed'
        );
        return;
      }

      // success => local update
      if (response.account) {
        // wir wissen Klartext => accountFormData.password + .notes
        const newAcc: Account = {
          id: response.account.id,
          userId: response.account.userId,
          accountName: response.account.accountName,
          username: response.account.username || '',
          email: response.account.email || '',
          encryptedPassword: encPw.encryptedData,
          passwordEncryptionIv: encPw.iv,
          passwordEncryptionSalt: encPw.salt,
          encryptedNotes: encNotes?.encryptedData || null,
          notesEncryptionIv: encNotes?.iv || null,
          notesEncryptionSalt: encNotes?.salt || null,
          createdAt: new Date(),
          updatedAt: new Date(),
          // local decrypted
          decryptedPassword: accountFormData.password,
          decryptedNotes: accountFormData.notes || undefined,
        };

        setAccountList((prev) => [...prev, newAcc]);
      }

      setCreateAccountSuccessMessage('Account created successfully!');
      // reset form
      setAccountFormData({
        accountName: '',
        username: '',
        email: '',
        password: '',
        notes: '',
      });
    } catch (err: any) {
      console.error('CreateAccount error:', err);
      setCreateAccountErrorMessage(err.message || 'Unknown error');
    } finally {
      setIsLoadingCreateAccount(false);
    }
  }

  /********************************
   * EditAccount
   ********************************/
  function handleEditClick() {
    if (!currentAccount) return;
    // Übernimm die Felder aus currentAccount
    setEditAccountFormData({
      accountName: currentAccount.accountName,
      username: currentAccount.username || '',
      email: currentAccount.email || '',
      password: currentAccount.decryptedPassword || '',
      notes: currentAccount.decryptedNotes || '',
    });
    setShowEditForm(true);
  }

  function handleEditAccountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditAccountFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function processEditAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentAccount) return;

    setIsLoadingEditAccount(true);
    setEditAccountErrorMessage('');
    setEditAccountSuccessMessage('');

    try {
      // Sammle nur geänderte Felder
      const updates: Record<string, any> = { id: currentAccount.id };

      if (editAccountFormData.accountName !== currentAccount.accountName) {
        updates.accountName = editAccountFormData.accountName;
      }
      if (editAccountFormData.username !== (currentAccount.username || '')) {
        updates.username = editAccountFormData.username;
      }
      if (editAccountFormData.email !== (currentAccount.email || '')) {
        updates.email = editAccountFormData.email;
      }
      if (
        editAccountFormData.password !==
        (currentAccount.decryptedPassword || '')
      ) {
        const encPw = await cryptoService.encrypt(
          masterPassword,
          editAccountFormData.password
        );
        updates.encryptedPassword = encPw.encryptedData;
        updates.passwordEncryptionIv = encPw.iv;
        updates.passwordEncryptionSalt = encPw.salt;
      }
      if (editAccountFormData.notes !== (currentAccount.decryptedNotes || '')) {
        const encPw = await cryptoService.encrypt(
          masterPassword,
          editAccountFormData.notes
        );
        updates.encryptedNotes = encPw.encryptedData;
        updates.notesEncryptionIv = encPw.iv;
        updates.notesEncryptionSalt = encPw.salt;
      }

      const response = await editAccountRequest(updates);
      if (!response.success) {
        if (response.message === 'Failed to fetch') {
          setEditAccountErrorMessage('externalService.serverError');
          return;
        }
        setEditAccountErrorMessage(response.errorCode || 'Edit account failed');
        return;
      }

      if (response.account) {
        const updated = response.account;

        // Wir wissen: user hat ggf. passwort/notes neu eingetragen
        let newDecryptedPassword = currentAccount.decryptedPassword;
        let newDecryptedNotes = currentAccount.decryptedNotes;

        if (editAccountFormData.password.trim() !== '') {
          newDecryptedPassword = editAccountFormData.password;
        }
        if (editAccountFormData.notes.trim() !== '') {
          newDecryptedNotes = editAccountFormData.notes;
        }

        // Patch local accountList
        setAccountList((prev) =>
          prev.map((acc) => {
            if (acc.id === updated.id) {
              return {
                ...acc,
                accountName: updated.accountName,
                username: updated.username,
                email: updated.email,
                encryptedPassword: updated.encryptedPassword,
                passwordEncryptionIv: updated.passwordEncryptionIv,
                passwordEncryptionSalt: updated.passwordEncryptionSalt,
                encryptedNotes: updated.encryptedNotes,
                notesEncryptionIv: updated.notesEncryptionIv,
                notesEncryptionSalt: updated.notesEncryptionSalt,
                decryptedPassword: newDecryptedPassword,
                decryptedNotes: newDecryptedNotes,
              };
            }
            return acc;
          })
        );

        // Falls currentAccount => update
        if (currentAccount.id === updated.id) {
          setCurrentAccount((prev) =>
            prev
              ? {
                  ...prev,
                  accountName: updated.accountName,
                  username: updated.username,
                  email: updated.email,
                  encryptedPassword: updated.encryptedPassword,
                  passwordEncryptionIv: updated.passwordEncryptionIv,
                  passwordEncryptionSalt: updated.passwordEncryptionSalt,
                  encryptedNotes: updated.encryptedNotes,
                  notesEncryptionIv: updated.notesEncryptionIv,
                  notesEncryptionSalt: updated.notesEncryptionSalt,
                  decryptedPassword: newDecryptedPassword,
                  decryptedNotes: newDecryptedNotes,
                }
              : prev
          );
        }
      }

      setEditAccountSuccessMessage('Account updated successfully!');
      setShowEditForm(false);
    } catch (err: any) {
      console.error('EditAccount error:', err);
      setEditAccountErrorMessage(err.message || 'Unknown error');
    } finally {
      setIsLoadingEditAccount(false);
    }
  }

  /********************************
   * Search & UI
   ********************************/
  const [searchValue, setSearchValue] = useState('');

  const handleHamburgerClick = () => {
    setShowTresorOverlay(!showTresorOverlay);
  };
  const handleCreateAccountClick = () => {
    setShowCreateForm(!showCreateForm);
  };
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const handleCloseVault = () => {
    setIsVaultUnlocked(false);
  };

  // Wenn Accounts noch laden => Loading-Screen
  if (isLoadingAccounts) {
    return <LoadingScreenPage />;
  }

  return (
    <VaultOverviewTemplate>
      {/* NAV BAR */}
      <div className="vaultNavArea">
        <NavBar
          onHamburgerClick={handleHamburgerClick}
          onCreateAccountClick={handleCreateAccountClick}
          onSearchChange={handleSearchChange}
          searchValue={searchValue}
          onCloseVault={handleCloseVault}
        />
      </div>

      {/* TRESOR */}
      <div className="vaultTresorArea vaultDesktopTresor">
        <TresorList />
      </div>

      {/* AccountList => klick wählt currentAccount */}
      <div className="vaultAccountListArea">
        <AccountList
          accountList={accountList}
          setCurrentAccount={setCurrentAccount}
        />
      </div>

      {/* AccountInfo => Bearbeiten => handleEditClick */}
      <div className="vaultAccountInfoArea">
        <AccountInfo
          currentAccount={currentAccount}
          onEditClick={handleEditClick}
        />
      </div>

      {/* CREATE FORM */}
      {showCreateForm && (
        <div className="vaultOverview__overlay--form">
          <CreateAccountForm
            handleCreateAccountClick={handleCreateAccountClick}
            accountFormData={accountFormData}
            handleChange={handleCreateAccountChange}
            processCreateAccount={processCreateAccount}
            isLoading={isLoadingCreateAccount}
            successMessage={createAccountSuccessMessage}
            errorMessage={createAccountErrorMessage}
            accountNameError=""
            usernameError=""
            emailError=""
            passwordError=""
            notesError=""
          />
        </div>
      )}

      {/* EDIT FORM */}
      {showEditForm && (
        <div className="vaultOverview__overlay--form">
          <EditAccountForm
            accountFormData={editAccountFormData}
            handleChange={handleEditAccountChange}
            processEditAccount={processEditAccount}
            isLoading={isLoadingEditAccount}
            successMessage={editAccountSuccessMessage}
            errorMessage={editAccountErrorMessage}
            accountNameError=""
            usernameError=""
            emailError=""
            passwordError=""
            notesError=""
            showEditForm={showEditForm}
            setShowEditForm={setShowEditForm}
          />
        </div>
      )}

      {/* TRESOR OVERLAY in Mobile */}
      {showTresorOverlay && (
        <div className="vaultOverview__overlay--tresor">
          <TresorList
            showTresorOverlay={showTresorOverlay}
            setShowTresorOverlay={setShowTresorOverlay}
          />
        </div>
      )}
    </VaultOverviewTemplate>
  );
};
