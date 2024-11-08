import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() body) {
    const { email, password } = body;
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    await this.userService.registerUser(email, password);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async login(@Body() body) {
    const { email, password } = body;
    const token = await this.userService.validateUser(email, password);
    if (!token) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return { message: 'Login successful', token };
  }

  @Get('profile')
  async getProfile(@Req() req) {
    return { user: req.user };
  }
}
