import { Controller, Post, Body, HttpCode, HttpStatus, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // 👇 Add Google OAuth endpoints
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // This will redirect to Google OAuth
    console.log('🔐 Initiating Google OAuth flow');
  }

  @Get('google/callback') 
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    console.log('📨 Google OAuth callback received');
    const result = await this.authService.googleLogin(req);
    
    // Redirect to frontend with token and user data
    const frontendUrl = `http://localhost:5173/auth/google/callback?token=${result.access_token}&user=${encodeURIComponent(JSON.stringify(result.user))}`;
    res.redirect(frontendUrl);
  }
}