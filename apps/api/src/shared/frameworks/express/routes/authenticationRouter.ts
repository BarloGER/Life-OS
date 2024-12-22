import { sessionDurations } from '@shared/frameworks/express-session';
import { PublicAuthenticationController } from '@features/authentication/interface-adapters/controllers/public/PublicAuthenticationController';
import { PublicAuthenticationPresenter } from '@features/authentication/interface-adapters/presenters/public/PublicAuthenticationPresenter';
import { PublicAuthenticationRepository } from '@features/authentication/interface-adapters/repositories/public/PublicAuthenticationRepository';
import {
  PublicLoginUsecase,
  PublicRegisterUsecase,
} from '@features/authentication/use-cases/public';
import { User } from '@shared/entities/User';
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

  const publicLoginUsecase = new PublicLoginUsecase(
    deps.notificationService,
    deps.passwordHasher,
    deps.tokenGenerator,
    publicAuthenitcationRepository,
    publicAuthenticationPresenter
  );

  const publicAuthenticationController = new PublicAuthenticationController(
    publicRegisterUsecase,
    publicLoginUsecase
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

  router.post(
    '/public/login',
    async (req: Request, res: Response, next: NextFunction) => {
      type TLoginClientResponse = {
        success: boolean;
        errorCode?: string;
        user?: User;
      };

      try {
        await publicAuthenticationController.handleLoginRequest(req.body);

        const response = publicAuthenticationPresenter.getLoginResult();

        if (!response) {
          res.status(500).json({
            success: false,
            errorCode: 'authentication.errors.internalServerError',
          });
          return;
        }

        if (!response.success) {
          const errorResponse: TLoginClientResponse = {
            success: response.success,
            errorCode: response.errorCode || undefined,
            user: null,
          };
          res.status(400).json(errorResponse);
          return;
        }

        const userRole = response.user.role;
        const sessionDuration =
          sessionDurations[userRole] || sessionDurations['guest']; // Standard for guests

        req.session.userId = response.user.id;
        req.session.role = response.user.role;
        req.session.status = response.user.status;
        req.session.cookie.maxAge = sessionDuration;

        res.status(201).json(response);
      } catch (error) {
        console.log('Router error', error);
        next(error);
      }
    }
  );

  return router;
}
