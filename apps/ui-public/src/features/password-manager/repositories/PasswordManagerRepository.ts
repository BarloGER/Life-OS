import { Account, Vault } from '@features/password-manager/entities/index';

const API_URL = import.meta.env.VITE_API_URL;

type GetVaultResponse = {
  success: boolean;
  errorCode?: string;
  message?: string;
  vault?: Vault;
};

type CreateVaultResponse = {
  success: boolean;
  errorCode?: string;
  message?: string;
  vault?: Vault;
};

type GetAccountsResponse = {
  success: boolean;
  errorCode?: string;
  message?: string;
  accounts?: Account[];
};

type CreateAccountResponse = {
  success: boolean;
  errorCode?: string;
  message?: string;
  account?: Account;
};

export type EditAccountResponse = {
  success: boolean;
  errorCode?: string;
  message?: string;
  account?: Account;
};

export async function getVaultRequest(): Promise<GetVaultResponse> {
  try {
    const response = await fetch(
      `${API_URL}/password-manager/public/get-vault`,
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

export async function createVaultRequest(data: {
  secret: string;
  encryptedSecret: string;
  secretEncryptionIv: string;
  secretEncryptionSalt: string;
  securityQuestion: string;
}): Promise<CreateVaultResponse> {
  try {
    const response = await fetch(
      `${API_URL}/password-manager/public/create-vault`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      }
    );
    return (await response.json()) as CreateVaultResponse;
  } catch (error) {
    console.error('Create vault request failed:', error);
    return {
      success: false,
      message: 'Failed to fetch',
    };
  }
}

export async function getAccountsRequest(): Promise<GetAccountsResponse> {
  try {
    const response = await fetch(
      `${API_URL}/password-manager/public/get-accounts`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    return (await response.json()) as GetAccountsResponse;
  } catch (error) {
    console.error('Get accounts request failed:', error);
    return {
      success: false,
      message: 'Failed to fetch',
    };
  }
}

export async function createAccountRequest(data: {
  accountName: string;
  username: string | null;
  email: string | null;
  encryptedPassword: string;
  passwordEncryptionIv: string;
  passwordEncryptionSalt: string;
  encryptedNotes: string | null;
  notesEncryptionIv: string | null;
  notesEncryptionSalt: string | null;
}): Promise<CreateAccountResponse> {
  try {
    const response = await fetch(
      `${API_URL}/password-manager/public/create-account`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      }
    );
    return (await response.json()) as CreateAccountResponse;
  } catch (error) {
    console.error('Create account request failed:', error);
    return {
      success: false,
      message: 'Failed to fetch',
    };
  }
}

export async function editAccountRequest(data: {
  id: number | string;
  accountName?: string;
  username?: string;
  email?: string;
  encryptedPassword?: string;
  passwordEncryptionIv?: string;
  passwordEncryptionSalt?: string;
  encryptedNotes?: string;
  notesEncryptionIv?: string;
  notesEncryptionSalt?: string;
}): Promise<EditAccountResponse> {
  try {
    const response = await fetch(
      `${API_URL}/password-manager/public/edit-account`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      }
    );
    return (await response.json()) as EditAccountResponse;
  } catch (error) {
    console.error('Edit account request failed:', error);
    return {
      success: false,
      message: 'Failed to fetch',
    };
  }
}
