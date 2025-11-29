import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    console.log('[JwtAuthGuard] Проверка авторизации:', {
      hasAuthHeader: !!authHeader,
      path: request.url,
      method: request.method
    });
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    
    if (err || !user) {
      console.error('[JwtAuthGuard] Ошибка авторизации:', {
        error: err?.message,
        info: info?.message,
        path: request?.url,
        method: request?.method,
        hasUser: !!user
      });
      throw err || new UnauthorizedException('Требуется авторизация');
    }
    
    console.log('[JwtAuthGuard] Авторизация успешна:', {
      userId: user?.userId || user?.id,
      email: user?.email,
      path: request?.url
    });
    
    return user;
  }
}

