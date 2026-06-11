import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async register(dto: RegisterDto) {
    const { username, password } = dto;

    // Ckeck if user already exist
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('Username is already taken');
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user

    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    return {
      message: 'User registered successfully',
      userId: user.id,
    };
  }

  async Login(dto: LoginDto) {
    const { username, password } = dto;

    // Find. User
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate Jwt
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
