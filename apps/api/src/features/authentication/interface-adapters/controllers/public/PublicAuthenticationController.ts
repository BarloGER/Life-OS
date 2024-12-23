import {
  PublicRegisterUsecase,
  TPublicRegisterRequestModel,
  PublicLoginUsecase,
  TPublicLoginRequestModel,
  PublicVerifyEmailUsecase,
  TPublicVerifyEmailRequestModel,
} from '@features/authentication/use-cases/public';

export class PublicAuthenticationController {
  constructor(
    private readonly registerInteractor: PublicRegisterUsecase,
    private readonly loginInteractor: PublicLoginUsecase,
    private readonly verifyEmailInteractor: PublicVerifyEmailUsecase
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

  async handleVerifyEmailRequest(
    rawData: TPublicVerifyEmailRequestModel
  ): Promise<void> {
    const { token } = rawData;

    const requestModel: TPublicVerifyEmailRequestModel = {
      token,
    };

    await this.verifyEmailInteractor.verifyEmail(requestModel);
  }
}
