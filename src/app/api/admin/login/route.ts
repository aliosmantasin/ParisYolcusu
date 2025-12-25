import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '@/src/lib/db';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Geçerli bir e-posta adresi giriniz' }),
  password: z.string().min(1, { message: 'Şifre gereklidir' }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = LoginSchema.parse(body);

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'E-posta veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Kullanıcı aktif mi?
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { message: 'Hesabınız aktif değil' },
        { status: 403 }
      );
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'E-posta veya şifre hatalı' },
        { status: 401 }
      );
    }

    // JWT token oluştur
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } as SignOptions
    );

    // Refresh token oluştur
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtRefreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }
    
    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      jwtRefreshSecret,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as SignOptions
    );

    // Cookie'ye token'ı set et
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // HTTP-only cookie'ler set et
    // Production'da secure: true olmalı (HTTPS için)
    // Domain belirtilmezse otomatik olarak request'in domain'i kullanılır
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 dakika
      path: '/',
      // Domain belirtilmez - otomatik olarak request domain'i kullanılır
    });

    response.cookies.set('admin_refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: '/',
      // Domain belirtilmez - otomatik olarak request domain'i kullanılır
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Geçersiz veri', errors: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Giriş yapılamadı' },
      { status: 500 }
    );
  }
}

