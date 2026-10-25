import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignInDto, SignUpDto } from './auth.schemas';
import { UsersRepository } from './users.repository';

export interface AuthResult { token: string; user: { id: string; name: string; email: string } }

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersRepository, private readonly jwt: JwtService) {}

  async signUp(dto: SignUpDto): Promise<AuthResult> {
    if (await this.users.findByEmail(dto.email)) throw new ConflictException('Email already registered');
    const user = await this.users.create({
      name: dto.name, email: dto.email, passwordHash: await bcrypt.hash(dto.password, 10),
    });
    return this.issue(user);
  }

  async signIn(dto: SignInDto): Promise<AuthResult> {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !user.passwordHash || !(await bcrypt.compare(dto.password, user.passwordHash)))
      throw new UnauthorizedException('Invalid email or password');
    return this.issue(user);
  }

  async issue(user: { id: string; name: string; email: string }): Promise<AuthResult> {
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }
}
