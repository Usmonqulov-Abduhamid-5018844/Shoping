import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly JWT: JwtService){}
  canActivate(
    context: ExecutionContext,
  ): boolean{
    const request: Request = context.switchToHttp().getRequest();
    let Token = request.headers.authorization?.split(' ')[1];
    if (!Token) {
      throw new UnauthorizedException('Not fount Token');
    }
    
    try {
      const data = this.JWT.verify(Token, { secret: process.env.ACCS_SECRET });
      request['user'] = data;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Wrong Token');
    }
  }
}
