import {
  PublicRegisterUsecase,
  TPublicRegisterRequestModel,
} from '@features/authentication/use-cases/public';

export class PublicAuthenticationController {
  constructor(private readonly interactor: PublicRegisterUsecase) {}

  async handleRegistrationRequest(
    rawData: TPublicRegisterRequestModel
  ): Promise<void> {
    const { username, email, password, isNewsletterAccepted, isTermsAccepted } =
      rawData;

    const requestModel: TPublicRegisterRequestModel = {
      username,
      email,
      password,
      isNewsletterAccepted,
      isTermsAccepted,
    };

    await this.interactor.registerUser(requestModel);
  }
}
