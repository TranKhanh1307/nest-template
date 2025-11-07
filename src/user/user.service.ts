import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/common/util/bcrypt.util';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { username, password } = createUserDto;
    const userId = this.users.length + 1;
    this.users.push({
      userId,
      username,
      password: await hashPassword(password),
    });
    console.log(this.users);
    return {
      userId,
      username,
    };
  }
}
