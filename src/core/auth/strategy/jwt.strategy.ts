import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('api.jwtSecret'),
    });
  }

  async validate(payload: any) {
    //Can add more logic here such as lookup userId in database
    return {
      userId: payload.sub,
      username: payload.username,
      scope: payload.scope,
    };
  }
}
