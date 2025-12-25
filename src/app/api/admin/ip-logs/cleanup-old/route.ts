import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { requireAnalystAuth } from '@/src/lib/auth';

/**
 * Cleanup Old IP Logs
 * Eski IP log kayıtlarını temizler (retention policy'ye göre)
 * 
 * Temizleme Kuralları:
 * - Normal kayıtlar: 30 günden eski kayıtlar silinir
 * - Bot/Şüpheli kayıtlar: 90 günden eski kayıtlar silinir
 * 
 * Bu endpoint admin panelden manuel olarak çağrılabilir
 * veya mevcut bir cron job'a entegre edilebilir
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAnalystAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Son 30 günden eski normal kayıtları sil
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const normalDeleted = await prisma.iPLog.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo },
        isSuspicious: false,
      },
    });

    // Son 90 günden eski bot/şüpheli kayıtlarını sil
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    ninetyDaysAgo.setHours(0, 0, 0, 0);

    const suspiciousDeleted = await prisma.iPLog.deleteMany({
      where: {
        createdAt: { lt: ninetyDaysAgo },
        isSuspicious: true,
      },
    });

    const totalDeleted = normalDeleted.count + suspiciousDeleted.count;

    return NextResponse.json({
      success: true,
      message: `${totalDeleted} eski IP log kaydı temizlendi.`,
      normalDeleted: normalDeleted.count,
      suspiciousDeleted: suspiciousDeleted.count,
      totalDeleted,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cleanup old logs error:', error);
    return NextResponse.json(
      { 
        message: 'Eski log kayıtları temizlenemedi.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

