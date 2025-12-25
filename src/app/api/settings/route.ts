import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { requireAdminAuth } from '@/src/lib/auth';

/**
 * Settings API
 * Site ayarlarını yönetmek için
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      // Tek bir ayar getir
      const setting = await prisma.settings.findUnique({
        where: { key },
      });
      return NextResponse.json(setting ? { key: setting.key, value: setting.value } : null);
    }

    // Tüm ayarları getir
    const settings = await prisma.settings.findMany();
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Settings güncelleme (sadece admin)
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { message: 'Key and value are required' },
        { status: 400 }
      );
    }

    // Upsert (varsa güncelle, yoksa oluştur)
    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({ key: setting.key, value: setting.value });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

