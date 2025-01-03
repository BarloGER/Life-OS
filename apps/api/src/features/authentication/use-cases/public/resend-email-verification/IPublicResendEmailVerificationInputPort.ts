import { TPublicResendEmailVerificationRequestModel } from './TPublicResendEmailVerificationModels';

export interface IPublicResendEmailVerificationInputPort {
  resendEmailVerification(
    requestModel: TPublicResendEmailVerificationRequestModel
  ): Promise<void>;
}
