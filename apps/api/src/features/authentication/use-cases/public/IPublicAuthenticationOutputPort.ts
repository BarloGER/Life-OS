import { TPublicCheckAuthResponseModel } from './check-auth/TPublicCheckAuthModels';
import { TPublicRegisterResponseModel } from './register/TPublicRegisterModels';
import { TPublicLoginResponseModel } from './login/TPublicLoginModels';
import { TPublicVerifyEmailResponseModel } from './verify-email/TPublicVerifyEmailModels';
import { TPublicResendEmailVerificationResponseModel } from './resend-email-verification/TPublicResendEmailVerificationModels';
import { TPublicRequestPasswordResetResponseModel } from './request-password-reset/TPublicRequestPasswordResetModels';
import { TPublicResetPasswordResponseModel } from './reset-password/TPublicResetPasswordModels';

export interface IPublicAuthenticationOutputPort {
  presentCheckAuthResult(responseModel: TPublicCheckAuthResponseModel): void;
  presentRegistrationResult(responseModel: TPublicRegisterResponseModel): void;
  presentLoginResult(responseModel: TPublicLoginResponseModel): void;
  presentVerifyEmailResult(
    responseModel: TPublicVerifyEmailResponseModel
  ): void;
  presentResendEmailVerificationResult(
    responseModel: TPublicResendEmailVerificationResponseModel
  ): void;
  presentRequestPasswordResetResult(
    responseModel: TPublicRequestPasswordResetResponseModel
  ): void;
  presentResetPasswordResult(
    responseModel: TPublicResetPasswordResponseModel
  ): void;
}
