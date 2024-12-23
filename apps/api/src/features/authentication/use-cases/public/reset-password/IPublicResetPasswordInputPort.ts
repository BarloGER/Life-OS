import { TPublicResetPasswordRequestModel } from './TPublicResetPasswordModels';

export interface IPublicResetPasswordInputPort {
  resetPassword(requestModel: TPublicResetPasswordRequestModel): Promise<void>;
}
