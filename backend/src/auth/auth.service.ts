import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    console.log('🔐 Registration for:', registerDto.username);
    console.log('📝 Original password:', registerDto.password);
    
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    console.log('🔑 Hashed password:', hashedPassword);
    
    // Create user - this returns user with all fields
    const user = await this.usersService.create({
      username: registerDto.username,
      password: hashedPassword,
      email: registerDto.email,
    });

    console.log('💾 User created with password:', (user as any).password);
    
    // Since we used 'as any' in UsersService, we need to assert the type here
    const userWithEmail = user as any;

    // Create JWT payload
    const payload = { 
      username: userWithEmail.username, 
      sub: userWithEmail.id 
    };
    
    // Return token and user info
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userWithEmail.id,
        username: userWithEmail.username,
        email: userWithEmail.email,
        createdAt: userWithEmail.createdAt,
      },
    };
  }

  async login(loginDto: LoginDto) {
    console.log('🔐 Login attempt for:', loginDto.username);
    
    // Get user for authentication
    const user = await this.usersService.findByUsername(loginDto.username);
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Debug: Check what fields user has
    console.log('📋 User fields:', Object.keys(user));
    console.log('🔑 Has password field:', 'password' in user);
    
    // Type assertion for password check
    const userWithPassword = user as any;
    
    if (!userWithPassword.password) {
      console.log('❌ No password field found in user object');
      throw new UnauthorizedException('Invalid username or password');
    }

    console.log('💾 Stored password hash:', userWithPassword.password);
    console.log('📝 Login password attempt:', loginDto.password);

    // Debug password comparison
    const passwordMatches = await bcrypt.compare(loginDto.password, userWithPassword.password);
    console.log('🔐 Password matches:', passwordMatches);
    
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Create JWT payload
    const payload = { 
      username: userWithPassword.username, 
      sub: userWithPassword.id 
    };
    
    console.log('✅ Login successful for user:', userWithPassword.username);
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userWithPassword.id,
        username: userWithPassword.username,
        email: userWithPassword.email,
        createdAt: userWithPassword.createdAt,
      },
    };
  }
}