import {
  PublicRegisterUsecase,
  TPublicRegisterRequestModel,
  PublicLoginUsecase,
  TPublicLoginRequestModel,
} from '@features/authentication/use-cases/public';

export class PublicAuthenticationController {
  constructor(
    private readonly registerInteractor: PublicRegisterUsecase,
    private readonly loginInteractor: PublicLoginUsecase
  ) {}

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

    await this.registerInteractor.registerUser(requestModel);
  }

  async handleLoginRequest(rawData: TPublicLoginRequestModel): Promise<void> {
    const { email, password } = rawData;

    const requestModel: TPublicLoginRequestModel = {
      email,
      password,
    };

    await this.loginInteractor.loginUser(requestModel);
  }
}
