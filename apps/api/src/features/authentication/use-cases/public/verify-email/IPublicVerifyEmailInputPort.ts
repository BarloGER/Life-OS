import { TPublicVerifyEmailRequestModel } from './TPublicVerifyEmailModels';

export interface IPublicVerifyEmailInputPort {
  verifyEmail(requestModel: TPublicVerifyEmailRequestModel): Promise<void>;
}
