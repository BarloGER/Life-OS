import { initializeServer } from '@shared/frameworks/express';
import { pgClient } from '@shared/frameworks/db/postgres';
import { NotificationService } from '@shared/services/notification/NotificationService';
import { PBKDF2PasswordHasher } from '@shared/utils/password-hasher/PBKDF2PasswordHasher';
import { TokenGenerator } from '@shared/utils/token-generator/TokenGenerator';
import { isAuthenticated } from '@shared/frameworks/express/middlewares/isAuthenticated';

export type AppDependencies = {
  pgClient;
  notificationService: NotificationService;
  passwordHasher: PBKDF2PasswordHasher;
  tokenGenerator: TokenGenerator;
  isAuthenticated;
};

export function buildAppDependencies(): AppDependencies {
  const notificationService = new NotificationService();
  const passwordHasher = new PBKDF2PasswordHasher();
  const tokenGenerator = new TokenGenerator();

  return {
    pgClient,
    notificationService,
    passwordHasher,
    tokenGenerator,
    isAuthenticated,
  };
}

initializeServer(buildAppDependencies());
