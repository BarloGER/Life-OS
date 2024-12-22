import { PublicAuthenticationController } from '@features/authentication/interface-adapters/controllers/public/PublicAuthenticationController';
import { PublicAuthenticationPresenter } from '@features/authentication/interface-adapters/presenters/public/PublicAuthenticationPresenter';
import { PublicAuthenticationRepository } from '@features/authentication/interface-adapters/repositories/public/PublicAuthenticationRepository';
import { PublicRegisterUsecase } from '@features/authentication/use-cases/public';
import { NotificationService } from '@shared/services/index';
import { PBKDF2PasswordHasher } from '@shared/utils/password-hasher/PBKDF2PasswordHasher';
import { TokenGenerator } from '@shared/utils/token-generator/TokenGenerator';
import { Router, Request, Response, NextFunction } from 'express';

type AuthenticationRouterDependencies = {
  pgClient;
  notificationService: NotificationService;
  passwordHasher: PBKDF2PasswordHasher;
  tokenGenerator: TokenGenerator;
};

export function createAuthenticationRouter(
  deps: AuthenticationRouterDependencies
) {
  const publicAuthenitcationRepository = new PublicAuthenticationRepository(
    deps.pgClient
  );
  const publicAuthenticationPresenter = new PublicAuthenticationPresenter();

  const publicRegisterUsecase = new PublicRegisterUsecase(
    deps.notificationService,
    deps.passwordHasher,
    deps.tokenGenerator,
    publicAuthenitcationRepository,
    publicAuthenticationPresenter
  );

  const publicAuthenticationController = new PublicAuthenticationController(
    publicRegisterUsecase
  );

  const router = Router();

  router.post(
    '/public/register',
    async (req: Request, res: Response, next: NextFunction) => {
      type TRegisterClientResponse = {
        success: boolean;
        errorCode?: string;
      };

      try {
        await publicAuthenticationController.handleRegistrationRequest(
          req.body
        );

        const response = publicAuthenticationPresenter.getRegistrationResult();

        if (!response) {
          res.status(500).json({
            success: false,
            errorCode: 'authentication.errors.internalServerError',
          });
          return;
        }

        if (!response.success) {
          const errorResponse: TRegisterClientResponse = {
            success: response.success,
            errorCode: response.errorCode || undefined,
          };
          res.status(400).json(errorResponse);
          return;
        }

        const successResponse: TRegisterClientResponse = {
          success: response.success,
        };

        res.status(200).json(successResponse);
      } catch (error) {
        next(error);
      }
    }
  );
  return router;
}
