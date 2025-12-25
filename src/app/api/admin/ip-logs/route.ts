import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { requireAnalystAuth } from '@/src/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAnalystAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const ipAddress = searchParams.get('ipAddress') || '';
    const path = searchParams.get('path') || '';
    const trafficSource = searchParams.get('trafficSource') || '';
    const suspiciousOnly = searchParams.get('suspiciousOnly') === 'true';

    const skip = (page - 1) * limit;

    // Filtreleme koşulları
    const where: Prisma.IPLogWhereInput = {};
    if (search) {
      where.OR = [
        { ipAddress: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { path: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { userAgent: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { country: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { city: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ];
    }
    if (ipAddress) {
      where.ipAddress = { contains: ipAddress, mode: Prisma.QueryMode.insensitive };
    }
    if (path) {
      where.path = { contains: path, mode: Prisma.QueryMode.insensitive };
    }
    if (trafficSource) {
      where.trafficSource = trafficSource;
    }
    if (suspiciousOnly) {
      where.isSuspicious = true;
    }

    // IP logları getir
    const [ipLogs, total] = await Promise.all([
      prisma.iPLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.iPLog.count({ where }),
    ]);

    return NextResponse.json({
      ipLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin IP logs list error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : error;
    
    // Development'ta daha detaylı hata bilgisi göster
    return NextResponse.json(
      { 
        message: 'IP log listesi getirilemedi.',
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { details: errorDetails }),
      },
      { status: 500 }
    );
  }
}

