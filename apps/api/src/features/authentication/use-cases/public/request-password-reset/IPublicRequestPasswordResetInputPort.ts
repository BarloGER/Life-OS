import { TPublicRequestPasswordResetRequestModel } from './TPublicRequestPasswordResetModels';

export interface IPublicRequestPasswordResetInputPort {
  requestPasswordReset(
    requestModel: TPublicRequestPasswordResetRequestModel
  ): Promise<void>;
}
