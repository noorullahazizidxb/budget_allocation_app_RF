import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SignInDto, signInSchema, SignUpDto, signUpSchema } from './auth.schemas';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('sign-up')
  signUp(@Body(new ZodValidationPipe(signUpSchema)) dto: SignUpDto) {
    return this.auth.signUp(dto);
  }

  @Post('sign-in')
  @HttpCode(200)
  signIn(@Body(new ZodValidationPipe(signInSchema)) dto: SignInDto) {
    return this.auth.signIn(dto);
  }
}
