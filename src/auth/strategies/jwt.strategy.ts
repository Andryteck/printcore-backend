import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'default-secret-key',
    });
  }

  async validate(payload: any) {
    console.log('[JwtStrategy] validate - начало:', {
      userId: payload.userId,
      email: payload.email,
      hasPayload: !!payload
    });
    
    try {
      if (!payload.userId) {
        console.error('[JwtStrategy] validate - payload не содержит userId');
        throw new UnauthorizedException('Invalid token payload');
      }
      
      const user = await this.authService.validateUser(payload.userId);
      
      if (!user) {
        console.error('[JwtStrategy] validate - пользователь не найден после validateUser');
        throw new UnauthorizedException('User not found');
      }
      
      console.log('[JwtStrategy] validate - успешно:', {
        userId: user.id,
        email: user.email
      });
      
      return user;
    } catch (error) {
      console.error('[JwtStrategy] validate - ошибка:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}

