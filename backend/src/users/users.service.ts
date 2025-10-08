import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: any) {
    console.log('👤 UsersService.create called');
    console.log('📥 Incoming password:', createUserDto.password);
    
    // Check if username already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    console.log('💾 Saving password to database:', createUserDto.password);

    // Create new user
    const newUser = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: createUserDto.password, // Password will be hashed by AuthService
        email: createUserDto.email,
      } as any,
    });

    console.log('✅ User created with password:', (newUser as any).password);
    return newUser;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      } as any,
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        messages: true,
      } as any,
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email: email }
    });
  }
}