import { sessionDurations } from '@shared/frameworks/express-session';
import { createRateLimiter } from '@shared/frameworks/express/middlewares';
import { PublicAuthenticationController } from '@features/authentication/interface-adapters/controllers/public/PublicAuthenticationController';
import { PublicAuthenticationPresenter } from '@features/authentication/interface-adapters/presenters/public/PublicAuthenticationPresenter';
import { PublicAuthenticationRepository } from '@features/authentication/interface-adapters/repositories/public/PublicAuthenticationRepository';
import {
  PublicCheckAuthUsecase,
  PublicRegisterUsecase,
  PublicLoginUsecase,
  PublicVerifyEmailUsecase,
  PublicResendEmailVerificationUsecase,
  PublicRequestPasswordResetUsecase,
  PublicResetPasswordUsecase,
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
  isAuthenticated;
};

const checkAuthLimiter = createRateLimiter(15, 100); // 100 in 15min
const registerLimiter = createRateLimiter(5, 5); // 5 in 5min
const loginLimiter = createRateLimiter(5, 5); // 5 in 5min
const logoutLimiter = createRateLimiter(5, 5); // 5 in 5min
const verifyEmailLimiter = createRateLimiter(5, 5); // 5 in 5min
const resendEmailLimiter = createRateLimiter(2, 15); // 2 in 15min
const requestPasswordLimiter = createRateLimiter(2, 15); // 2 in 15min
const resetPasswordLimiter = createRateLimiter(5, 5); // 5 in 5min

export function createPublicAuthenticationRouter(
  deps: AuthenticationRouterDependencies
) {
  const publicAuthenitcationRepository = new PublicAuthenticationRepository(
    deps.pgClient
  );
  const publicAuthenticationPresenter = new PublicAuthenticationPresenter();

  const publicCheckAuthUsecase = new PublicCheckAuthUsecase(
    publicAuthenitcationRepository,
    publicAuthenticationPresenter
  );

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

  const publicVerifyEmailUsecase = new PublicVerifyEmailUsecase(
    publicAuthenitcationRepository,
    publicAuthenticationPresenter
  );

  const publicResendEmailVerificationUsecase =
    new PublicResendEmailVerificationUsecase(
      deps.notificationService,
      deps.passwordHasher,
      deps.tokenGenerator,
      publicAuthenitcationRepository,
      publicAuthenticationPresenter
    );

  const publicRequestPasswordResetUsecase =
    new PublicRequestPasswordResetUsecase(
      deps.notificationService,
      deps.passwordHasher,
      deps.tokenGenerator,
      publicAuthenitcationRepository,
      publicAuthenticationPresenter
    );

  const publicResetPasswordUsecase = new PublicResetPasswordUsecase(
    deps.passwordHasher,
    publicAuthenitcationRepository,
    publicAuthenticationPresenter
  );

  const publicAuthenticationController = new PublicAuthenticationController(
    publicCheckAuthUsecase,
    publicRegisterUsecase,
    publicLoginUsecase,
    publicVerifyEmailUsecase,
    publicResendEmailVerificationUsecase,
    publicRequestPasswordResetUsecase,
    publicResetPasswordUsecase
  );

  const router = Router();

  router.get(
    '/check-auth',
    checkAuthLimiter,
    deps.isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
      type TCheckAuthClientResponse = {
        success: boolean;
        errorCode?: string;
        user?: User;
      };

      const userId = req.session.userId;

      try {
        await publicAuthenticationController.handleCheckAuthRequest({ userId });

        const response = publicAuthenticationPresenter.getCheckAuthResult();
        if (!response) {
          res.status(500).json({
            success: false,
            errorCode: 'authentication.errors.internalServerError',
            user: null,
          });
          return;
        }

        if (!response.success) {
          const errorResponse: TCheckAuthClientResponse = {
            success: response.success,
            errorCode: response.errorCode || undefined,
            user: null,
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
    '/register',
    registerLimiter,
    async (req: Request, res: Response, next: NextFunction) => {
      type TRegisterClientResponse = {
        success: boolean;
        errorCode?: string;
      };

      const language = req.headers['accept-language'] || 'en';

      try {
        await publicAuthenticationController.handleRegistrationRequest(
          req.body,
          language
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
    '/login',
    loginLimiter,
    async (req: Request, res: Response, next: NextFunction) => {
      type TLoginClientResponse = {
        success: boolean;
        errorCode?: string;
        user?: User;
      };

      const language = req.headers['accept-language'] || 'en';

      try {
        await publicAuthenticationController.handleLoginRequest(
          req.body,
          language
        );

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

        // Regenerate session to avoid session fixation
        req.session.regenerate((err) => {
          if (err) {
            console.error('Session regenerate error:', err);
            return res.status(500).json({
              success: false,
              errorCode: 'authentication.login.errors.sessionRegenerateFailed',
            });
          }

          const userRole = response.user.role;
          const sessionDuration =
            sessionDurations[userRole] || sessionDurations['guest'];

          req.session.userId = response.user.id;
          req.session.role = response.user.role;
          req.session.status = response.user.status;
          req.session.cookie.maxAge = sessionDuration;

          res.status(201).json(response);
        });
      } catch (error) {
        console.log('Router error', error);
        next(error);
      }
    }
  );

  router.post(
    '/logout',
    logoutLimiter,
    deps.isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
      type TLogoutClientResponse = {
        success: boolean;
        errorCode?: string;
      };

      try {
        req.session.destroy((err) => {
          if (err) {
            const errorResponse: TLogoutClientResponse = {
              success: false,
              errorCode: 'authentication.logout.failed',
            };
            res.status(400).json(errorResponse);
            return;
          }

          res.clearCookie('connect.sid', {
            path: '/',
            secure: true,
            httpOnly: true,
            sameSite: true,
          });

          const successResponse: TLogoutClientResponse = {
            success: true,
          };

          res.status(200).json(successResponse);
        });
      } catch (error) {
        console.log('Router error', error);
        next(error);
      }
    }
  );

  router.post(
    '/verify-email',
    verifyEmailLimiter,
    async (req: Request, res: Response, next: NextFunction) => {
      type TVerifyEmailClientResponse = {
        success: boolean;
        errorCode?: string;
      };

      const token = req.query.token.toString();

      try {
        await publicAuthenticationController.handleVerifyEmailRequest({
          token,
        });

        const response = publicAuthenticationPresenter.getVerifyEmailResult();

        if (!response) {
          res.status(500).json({
            success: false,
            errorCode: 'authentication.errors.internalServerError',
          });
          return;
        }

        if (!response.success) {
          const errorResponse: TVerifyEmailClientResponse = {
            success: response.success,
            errorCode: response.errorCode || undefined,
          };
          res.status(400).json(errorResponse);
          return;
        }

        const successResponse: TVerifyEmailClientResponse = {
          success: response.success,
        };

        res.status(200).json(successResponse);
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/resend-email-verification',
    resendEmailLimiter,
    async (req: Request, res: Response, next: NextFunction) => {
      type TResendEmailVerificationClientResponse = {
        success: boolean;
        errorCode?: string;
      };

      const language = req.headers['accept-language'] || 'en';

      try {
        await publicAuthenticationController.handleResendEmailVerificationRequest(
          req.body,
          language
        );

        const response =
          publicAuthenticationPresenter.getResendEmailVerificationResult();

        if (!response) {
          res.status(500).json({
            success: false,
            errorCode: 'authentication.errors.internalServerError',
          });
          return;
        }

        if (!response.success) {
          const errorResponse: TResendEmailVerificationClientResponse = {
            success: response.success,
            errorCode: response.errorCode || undefined,
          };
          res.status(400).json(errorResponse);
          return;
        }

        const successResponse: TResendEmailVerificationClientResponse = {
          success: response.success,
        };

        res.status(200).json(successResponse);
      } catch (error) {
        console.log('Router error', error);
        next(error);
      }
    }
  );

  router.post(
    '/request-password-reset',
    requestPasswordLimiter,
    async (req: Request, res: Response, next: NextFunction) => {
      type TRequestPasswordResetClientResponse = {
        success: boolean;
        errorCode?: string;
      };

      const language = req.headers['accept-language'] || 'en';

      try {
        await publicAuthenticationController.handleRequestPasswordResetRequest(
          req.body,
          language
        );

        const response =
          publicAuthenticationPresenter.getRequestPasswordResetResult();

        if (!response) {
          res.status(500).json({
            success: false,
            errorCode: 'authentication.errors.internalServerError',
          });
          return;
        }

        if (!response.success) {
          const errorResponse: TRequestPasswordResetClientResponse = {
            success: response.success,
            errorCode: response.errorCode || undefined,
          };
          res.status(400).json(errorResponse);
          return;
        }

        const successResponse: TRequestPasswordResetClientResponse = {
          success: response.success,
        };

        res.status(200).json(successResponse);
      } catch (error) {
        console.log('Router error', error);
        next(error);
      }
    }
  );

  router.post(
    '/reset-password',
    resetPasswordLimiter,
    async (req: Request, res: Response, next: NextFunction) => {
      type TResetPasswordClientResponse = {
        success: boolean;
        errorCode?: string;
      };

      const token = req.query.token.toString();
      const { newPassword } = req.body;

      try {
        await publicAuthenticationController.handleResetPasswordRequest({
          passwordResetToken: token,
          newPassword,
        });

        const response = publicAuthenticationPresenter.getResetPasswordResult();

        if (!response) {
          res.status(500).json({
            success: false,
            errorCode: 'authentication.errors.internalServerError',
          });
          return;
        }

        if (!response.success) {
          const errorResponse: TResetPasswordClientResponse = {
            success: response.success,
            errorCode: response.errorCode || undefined,
          };
          res.status(400).json(errorResponse);
          return;
        }

        const successResponse: TResetPasswordClientResponse = {
          success: response.success,
        };

        res.status(200).json(successResponse);
      } catch (error) {
        console.log('Router error', error);
        next(error);
      }
    }
  );

  return router;
}
