import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpCode,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<any> {
    return this.authService.register(body);
  }
}
