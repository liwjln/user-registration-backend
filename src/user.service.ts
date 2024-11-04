import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async registerUser(email: string, password: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword });
    return newUser.save();
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return this.generateToken(user);
    }
    return null;
  }

  private generateToken(user: User): string {
    const payload = { email: user.email, sub: user.email };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.userModel.findById(decoded.sub);
      return user;
    } catch (err) {
      return null;
    }
  }
}
