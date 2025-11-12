import { Exclude } from 'class-transformer';
import { Role } from 'src/common/enums/role.enum';

export class User {
  userId: number;
  username: string;
  @Exclude()
  password: string;
  role: Role;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
