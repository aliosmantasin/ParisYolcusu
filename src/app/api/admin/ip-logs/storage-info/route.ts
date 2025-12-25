import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { requireAnalystAuth } from '@/src/lib/auth';

/**
 * Storage Info API
 * Veritabanı saklama bilgilerini döndürür
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAnalystAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Toplam kayıt sayısı
    const totalRecords = await prisma.iPLog.count();

    // Normal kayıt sayısı
    const normalRecords = await prisma.iPLog.count({
      where: { isSuspicious: false },
    });

    // Bot kayıt sayısı
    const suspiciousRecords = await prisma.iPLog.count({
      where: { isSuspicious: true },
    });

    // En eski normal kayıt
    const oldestNormal = await prisma.iPLog.findFirst({
      where: { isSuspicious: false },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    });

    // En eski bot kayıt
    const oldestSuspicious = await prisma.iPLog.findFirst({
      where: { isSuspicious: true },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    });

    // Tahmini depolama boyutu (1.2 KB per record)
    const estimatedStorageMB = (totalRecords * 1.2) / 1024;
    const estimatedStorage = estimatedStorageMB < 1024
      ? `${estimatedStorageMB.toFixed(2)} MB`
      : `${(estimatedStorageMB / 1024).toFixed(2)} GB`;

    return NextResponse.json({
      totalRecords,
      normalRecords,
      suspiciousRecords,
      oldestNormalRecord: oldestNormal?.createdAt || null,
      oldestSuspiciousRecord: oldestSuspicious?.createdAt || null,
      estimatedStorage,
    });
  } catch (error) {
    console.error('Storage info error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : error;
    
    // Development'ta daha detaylı hata bilgisi göster
    return NextResponse.json(
      { 
        message: 'Storage bilgileri alınamadı.',
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { details: errorDetails }),
      },
      { status: 500 }
    );
  }
}

