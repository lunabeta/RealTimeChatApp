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
    
    const user = await this.usersService.create({
      username: registerDto.username,
      password: hashedPassword,
      email: registerDto.email,
    });

    console.log('💾 User created with password:', (user as any).password);
    
    const userWithEmail = user as any;

    const payload = { 
      username: userWithEmail.username, 
      sub: userWithEmail.id 
    };
    
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
    console.log('🔐 Login attempt for email:', loginDto.email);
    
    // Use findByEmail for consistency with Google OAuth
    const user = await this.usersService.findByEmail(loginDto.email);
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const userWithPassword = user as any;
    
    if (!userWithPassword.password) {
      console.log('❌ No password field found in user object');
      throw new UnauthorizedException('Invalid email or password');
    }

    console.log('💾 Stored password hash:', userWithPassword.password);
    console.log('📝 Login password attempt:', loginDto.password);

    const passwordMatches = await bcrypt.compare(loginDto.password, userWithPassword.password);
    console.log('🔐 Password matches:', passwordMatches);
    
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

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

  async googleLogin(req: any) {
    console.log('🔐 Google Login called with:', req.user);
    
    if (!req.user) {
      return { message: 'No user from Google' };
    }

    try {
      // Find or create user from Google profile - uses same findByEmail method
      let user = await this.usersService.findByEmail(req.user.email);
      
      if (!user) {
        console.log('👤 Creating new user from Google profile');
        const randomPassword = await bcrypt.hash(Math.random().toString(36) + Date.now().toString(), 12);
        
        user = await this.usersService.create({
          username: req.user.email.split('@')[0],
          password: randomPassword,
          email: req.user.email,
        });
        console.log('✅ New user created from Google OAuth');
      } else {
        console.log('✅ Existing user found for Google OAuth');
      }

      const payload = { 
        username: (user as any).username, 
        sub: (user as any).id 
      };
      
      const access_token = this.jwtService.sign(payload);
      
      console.log('🎉 Google OAuth completed successfully');
      
      return {
        access_token: access_token,
        user: {
          id: (user as any).id,
          username: (user as any).username,
          email: (user as any).email,
          picture: req.user.picture,
          name: `${req.user.firstName} ${req.user.lastName}`,
        },
        message: 'Google OAuth successful!'
      };
    } catch (error) {
      console.error('❌ Google OAuth error:', error);
      return { error: 'Failed to process Google login' };
    }
  }
}