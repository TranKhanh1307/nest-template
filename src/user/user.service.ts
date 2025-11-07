import { Injectable, OnModuleInit } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/common/util/bcrypt.util';
import { Role } from 'src/common/enums/role.enum';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private als: AsyncLocalStorage<Map<string, any>>) {}

  private users: User[] = [];

  async onModuleInit() {
    this.users = [
      {
        userId: 1,
        username: 'john',
        password: await hashPassword('changeme'),
        role: Role.Admin,
      },
      {
        userId: 2,
        username: 'maria',
        password: await hashPassword('guess'),
        role: Role.User,
      },
    ];
  }

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
      role: Role.User,
    });
    console.log(this.users);
    return {
      userId,
      username,
    };
  }

  async findAll(): Promise<any> {
    const userDto = this.users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });
    return userDto;
  }

  async getProfile() {
    return this.als.getStore()?.get('user');
  }
}
