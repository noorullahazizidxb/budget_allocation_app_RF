import { Body, Controller, Headers, HttpCode, Ip, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SignInDto, signInSchema, SignUpDto, signUpSchema } from './auth.schemas';
import { AuthService } from './auth.service';
import { RecaptchaService } from './recaptcha.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly recaptcha: RecaptchaService) {}

  @Post('sign-up')
  async signUp(@Body(new ZodValidationPipe(signUpSchema)) dto: SignUpDto, @Headers('x-recaptcha-token') token?: string, @Ip() ip?: string) {
    await this.recaptcha.assertHuman(token, 'sign_up', ip);
    return this.auth.signUp(dto);
  }

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body(new ZodValidationPipe(signInSchema)) dto: SignInDto, @Headers('x-recaptcha-token') token?: string, @Ip() ip?: string) {
    await this.recaptcha.assertHuman(token, 'sign_in', ip);
    return this.auth.signIn(dto);
  }
}
