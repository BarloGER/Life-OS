import { createRateLimiter } from '@shared/frameworks/express/middlewares/rateLimiterFactory';
import { PublicPasswordManagerController } from '@features/password-manager/interface-adapters/controllers/public/PublicPasswordManagerController';
import { PublicPasswordManagerPresenter } from '@features/password-manager/interface-adapters/presenters/public/PublicPasswordManagerPresenter';
import { PublicPasswordManagerRepository } from '@features/password-manager/interface-adapters/repositories/public/PublicPasswordManagerRepository';
import {
  PublicGetVaultUsecase,
  PublicCreateVaultUsecase,
  PublicGetAccountsUsecase,
  PublicCreateAccountUsecase,
  PublicEditAccountUsecase,
} from '@features/password-manager/use-cases/public';
import { Account, Vault } from '@features/password-manager/entities/index';
import { Router, Request, Response, NextFunction } from 'express';

type PasswordManagerRouterDependencies = {
  pgClient;
  isAuthenticated;
};

const getVaultLimiter = createRateLimiter(5, 15); // 5 in 15min
const createVaultLimiter = createRateLimiter(2, 15); // 2 in 15min
const getAccountsLimiter = createRateLimiter(20, 5); // 20 in 5min
const createAccountLimiter = createRateLimiter(50, 5); // 20 in 5min
const editAccountLimiter = createRateLimiter(20, 5); // 20 in 5min

export function createPublicPasswordManagerRouter(
  deps: PasswordManagerRouterDependencies
) {
  const publicPasswordManagerRepository = new PublicPasswordManagerRepository(
    deps.pgClient
  );
  const publicPasswordManagerPresenter = new PublicPasswordManagerPresenter();

  const publicGetVaultUsecase = new PublicGetVaultUsecase(
    publicPasswordManagerRepository,
    publicPasswordManagerPresenter
  );

  const publicCreateVaultUsecase = new PublicCreateVaultUsecase(
    publicPasswordManagerRepository,
    publicPasswordManagerPresenter
  );

  const publicGetAccountsUsecase = new PublicGetAccountsUsecase(
    publicPasswordManagerRepository,
    publicPasswordManagerPresenter
  );

  const publicCreateAccountUsecase = new PublicCreateAccountUsecase(
    publicPasswordManagerRepository,
    publicPasswordManagerPresenter
  );

  const publicEditAccountUsecase = new PublicEditAccountUsecase(
    publicPasswordManagerRepository,
    publicPasswordManagerPresenter
  );

  const publicPasswordManagerController = new PublicPasswordManagerController(
    publicGetVaultUsecase,
    publicCreateVaultUsecase,
    publicGetAccountsUsecase,
    publicCreateAccountUsecase,
    publicEditAccountUsecase
  );

  const router = Router();

  router.get(
    '/get-vault',
    getVaultLimiter,
    deps.isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
      type TGetVaultClientResponse = {
        success: boolean;
        errorCode?: string;
        vault?: Vault;
      };

      const userId = req.session.userId;

      try {
        await publicPasswordManagerController.handleGetVaultRequest({
          userId,
        });

        const response = publicPasswordManagerPresenter.getGetVaultResult();
        if (!response) {
          res.status(500).json({
            success: false,
            errorCode: 'passwordManager.errors.internalServerError',
            vault: null,
          });
          return;
        }

        if (!response.success) {
          const errorResponse: TGetVaultClientResponse = {
            success: response.success,
            errorCode: response.errorCode || undefined,
            vault: null,
          };
          res.status(400).json(errorResponse);
          return;
        }

        res.status(201).json(response);
      } catch (error) {
        console.log('Router error', error);
        next(error);
      }
    }
  );

  router.post(
    '/create-vault',
    createVaultLimiter,
    deps.isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
      type TCreateVaultClientResponse = {
        success: boolean;
        errorCode?: string;
        vault?: Vault;
      };

      const { userId } = req.session;
      const {
        securityQuestion,
        secret,
        encryptedSecret,
        secretEncryptionIv,
        secretEncryptionSalt,
      } = req.body;

      try {
        await publicPasswordManagerController.handleCreateVaultRequest({
          userId,
          securityQuestion,
          secret,
          encryptedSecret,
          secretEncryptionIv,
          secretEncryptionSalt,
        });

        const response = publicPasswordManagerPresenter.getCreateVaultResult();

        if (!response) {
          res.status(500).json({
            success: false,
            errorCode: 'passwordManager.errors.internalServerError',
          });
          return;
        }

        if (!response.success) {
          const errorResponse: TCreateVaultClientResponse = {
            success: response.success,
            errorCode: response.errorCode || undefined,
          };
          res.status(400).json(errorResponse);
          return;
        }

        const successResponse: TCreateVaultClientResponse = {
          success: response.success,
          vault: response.vault,
        };

        res.status(200).json(successResponse);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    '/get-accounts',
    getAccountsLimiter,
    deps.isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
      type TGetAccountsClientResponse = {
        success: boolean;
        errorCode?: string;
        accounts?: Account;
      };

      const userId = req.session.userId;

      try {
        await publicPasswordManagerController.handleGetAccountsRequest({
          userId,
        });

        const response = publicPasswordManagerPresenter.getGetAccountsResult();
        if (!response) {
          res.status(500).json({
            success: false,
            errorCode: 'passwordManager.errors.internalServerError',
            accounts: null,
          });
          return;
        }

        if (!response.success) {
          const errorResponse: TGetAccountsClientResponse = {
            success: response.success,
            errorCode: response.errorCode || undefined,
            accounts: null,
          };
          res.status(400).json(errorResponse);
          return;
        }

        res.status(201).json(response);
      } catch (error) {
        console.log('Router error', error);
        next(error);
      }
    }
  );

  router.post(
    '/create-account',
    createAccountLimiter,
    deps.isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
      type TCreateAccountClientResponse = {
        success: boolean;
        errorCode?: string;
        account?: Account;
      };

      const { userId } = req.session;
      const {
        accountName,
        username,
        email,
        encryptedPassword,
        passwordEncryptionIv,
        passwordEncryptionSalt,
        encryptedNotes,
        notesEncryptionIv,
        notesEncryptionSalt,
      } = req.body;

      try {
        await publicPasswordManagerController.handleCreateAccountRequest({
          userId,
          accountName,
          username,
          email,
          encryptedPassword,
          passwordEncryptionIv,
          passwordEncryptionSalt,
          encryptedNotes,
          notesEncryptionIv,
          notesEncryptionSalt,
        });

        const response =
          publicPasswordManagerPresenter.getCreateAccountResult();

        if (!response) {
          res.status(500).json({
            success: false,
            errorCode: 'passwordManager.errors.internalServerError',
          });
          return;
        }

        if (!response.success) {
          const errorResponse: TCreateAccountClientResponse = {
            success: response.success,
            errorCode: response.errorCode || undefined,
          };
          res.status(400).json(errorResponse);
          return;
        }

        const successResponse: TCreateAccountClientResponse = {
          success: response.success,
          account: response.account,
        };

        res.status(201).json(successResponse);
      } catch (error) {
        next(error);
      }
    }
  );

  router.patch(
    '/edit-account',
    editAccountLimiter,
    deps.isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
      type TEditAccountClientResponse = {
        success: boolean;
        errorCode?: string;
        account?: Account;
      };

      const { userId } = req.session;
      const { id, ...updates } = req.body;

      try {
        await publicPasswordManagerController.handleEditAccountRequest({
          userId,
          id,
          ...updates,
        });

        const response = publicPasswordManagerPresenter.getEditAccountResult();

        if (!response) {
          res.status(500).json({
            success: false,
            errorCode: 'passwordManager.errors.internalServerError',
          });
          return;
        }

        if (!response.success) {
          const errorResponse: TEditAccountClientResponse = {
            success: response.success,
            errorCode: response.errorCode || undefined,
          };
          res.status(400).json(errorResponse);
          return;
        }

        const successResponse: TEditAccountClientResponse = {
          success: response.success,
          account: response.account,
        };

        res.status(200).json(successResponse);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
