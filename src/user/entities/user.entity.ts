import { Role } from 'src/common/enums/role.enum';

export class User {
  userId: number;
  username: string;
  password: string;
  role: Role;
}
