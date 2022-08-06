import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { ChangePasswordDto } from './dto/change-password';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { link } from 'fs';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  @Post() /// Register page
  async create(@Body() createUserDto: CreateUserDto) {
    const currentUser = await this.usersService.findOneBy({
      email: createUserDto.email,
    });
    if (!!currentUser) {
      if (!!currentUser.active) {
        throw new BadRequestException('This user is registereds!');
      } else {
        await this.usersService.remove(currentUser.id);
      }
    }
    const newUser = await this.usersService.create(createUserDto);
    if (!!newUser && !!newUser.email) {
      await this.sendMailConfirmCode(newUser.id);
    }
    delete newUser.password;
    delete newUser.confirmCode;
    return newUser;
  }

  @Post('active') /// Active user
  async active(
    @Body('email') email: string,
    @Body('confirmCode') confirmCode: string,
  ) {
    const user = await this.usersService.findOneBy({ email });
    if (user && user.confirmCode === confirmCode) {
      user.active = true;
      await user.save();
      delete user.password;
      delete user.confirmCode;
      return user;
    }

    throw new BadRequestException('Confirm code is not correct !');
  }

  @Post('changePassword')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    try {
      const { id, confirmCode, username, password } = changePasswordDto;
      const user = await this.usersService.findOneBy({ id });
      if (!user) throw new BadRequestException('Error!');
      if (user.confirmCode !== confirmCode) {
        throw new BadRequestException('Confirm code is not correct !');
      }
      const hashedPassword: string = await bcrypt.hash(password, 12);
      await this.usersService.update(user.id, {
        username,
        password: hashedPassword,
        active: true,
      });
      return { message: 'Success!' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('reSendConfirmCode')
  async reSendConfirmCode(@Body('email') email: string) {
    try {
      const user = await this.usersService.findOneBy({ email: email });
      if (!user) throw new BadRequestException('Email not found!');
      await this.usersService.changeConfirmationCode(user.id);
      await this.sendMailConfirmCode(user.id);
      return { user_id: user.id };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('updateDeviceToken')
  async updateDeviceToken(@Body('token') token: string, @Req() request) {
    return await this.usersService.update(request.user.userId, {
      deviceToken: token,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('pushNotiForMe')
  async pushNotiForMe(
    @Body('title') title: string,
    @Body('body') body: string,
    @Body('link') link: string | null | undefined,
    @Req() request,
  ) {
    const token = await (
      await this.usersService.findOne(request.user.userId)
    ).deviceToken;
    return await this.usersService.pushNotiForMySelf({
      title,
      body,
      token,
      link,
    });
  }

  private async sendMailConfirmCode(id) {
    const user = await this.usersService.findOne(id);
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'confirmationCode',
      context: {
        user: {
          username: user.username,
          email: user.email,
          confirmCode: user.confirmCode,
        },
      },
    });
  }
}
