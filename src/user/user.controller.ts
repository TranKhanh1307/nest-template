import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  async getProfile() {
    return this.userService.getProfile();
  }
}
