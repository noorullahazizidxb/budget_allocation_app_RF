import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RecaptchaService } from './recaptcha.service';
import { UsersRepository } from './users.repository';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'dev-only-secret',
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
      }),
    }),
  ],
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, GoogleAuthService, UsersRepository, JwtAuthGuard, RecaptchaService],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
