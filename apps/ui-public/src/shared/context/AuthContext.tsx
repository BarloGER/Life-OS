import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

interface User {
  id: string;
  role: string;
  status: string;
  username: string;
  email: string;
  emailVerificationToken: string | null;
  emailVerificationTokenExpiresAt: Date | null;
  emailFailedVerificationAttempts: number;
  hashedPassword: string;
  failedLoginAttempts: number;
  passwordResetToken: string | null;
  passwordResetTokenExpiresAt: Date | null;
  passwordResetFailedVerificationAttempts: number;
  passwordUpdatedAt: Date | null;
  lockedUntil: Date | null;
  multiFactorEnabled: boolean;
  recoveryEmail: string | null;
  recoveryEmailVerificationToken: string | null;
  recoveryEmailVerificationTokenExpiresAt: Date | null;
  recoveryEmailFailedVerificationAttempts: number;
  phoneNumber: string | null;
  phoneNumberVerificationToken: string | null;
  phoneNumberVerificationTokenExpiresAt: Date | null;
  phoneNumberFailedVerificationAttempts: number;
  isNewsletterAllowed: boolean;
  termsAcceptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  isRecoveryEmailVerified: boolean;
  isPhoneNumberVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isBlocked: boolean;
  setIsBlocked: React.Dispatch<React.SetStateAction<boolean>>;
  loadingAuthRequest: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthResponse {
  success: boolean;
  user?: User | null;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuthRequest, setLoadingAuthRequest] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  async function checkAuthAndGetUserRequest(): Promise<AuthResponse> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/authentication/public/check-auth`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      return (await response.json()) as AuthResponse;
    } catch (error) {
      console.error(error);
      return { success: false, user: null };
    }
  }

  const checkAuthentication = useCallback(async () => {
    setLoadingAuthRequest(true);

    const authenticationResponse = await checkAuthAndGetUserRequest();

    if (!authenticationResponse.success && authenticationResponse.user) {
      setUser(null);
      setIsBlocked(true);
      setIsAuthenticated(false);
      setLoadingAuthRequest(false);
      return;
    }

    if (!authenticationResponse.success) {
      setUser(null);
      setIsAuthenticated(false);
      setLoadingAuthRequest(false);
      return;
    }

    setUser(authenticationResponse.user ?? null);
    setIsAuthenticated(true);
    setLoadingAuthRequest(false);
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isBlocked,
        setIsBlocked,
        loadingAuthRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
