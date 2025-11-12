import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Role } from 'src/common/enums/role.enum';

export class User {
  userId: number;
  username: string;

  @ApiHideProperty()
  @Exclude()
  password: string;
  role: Role;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
