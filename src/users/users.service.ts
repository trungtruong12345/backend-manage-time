import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { sendFCMMessage } from 'src/services/firebase-admin';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepositorry: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      12,
    );
    const { username, email } = createUserDto;
    let confirmCode: string = (Math.random() + 1).toString(36).substring(6);
    while (
      (await (
        await this.userRepositorry.findBy({ confirmCode: confirmCode })
      ).length) > 0
    ) {
      confirmCode = (Math.random() + 1).toString(36).substring(6);
    }
    const newUser = await this.userRepositorry.save({
      username,
      email,
      password: hashedPassword,
      confirmCode,
    });
    delete newUser?.password;
    return newUser;
  }

  async findOneBy(data: any) {
    const user = await this.userRepositorry.findOneBy(data);
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    return await this.userRepositorry.findOneBy({ id: id });
  }

  async changeConfirmationCode(id) {
    let confirmCode;
    while (
      (await (
        await this.userRepositorry.findBy({ confirmCode: confirmCode })
      ).length) > 0
    ) {
      confirmCode = (Math.random() + 1).toString(36).substring(6);
    }
    const user = await this.update(id, { confirmCode });
    return user;
  }

  async update(id: number, data: any) {
    return await this.userRepositorry.update({ id: id }, data);
  }

  async remove(id: number) {
    return await this.userRepositorry.delete({ id: id });
  }

  async pushNotiForMySelf({ token, title, body = '', link = null }) {
    return await sendFCMMessage(token, {
      title,
      body,
      requireInteraction: true,
      link,
    }).catch((err) => {
      console.log('error', err);
    });
  }
}
