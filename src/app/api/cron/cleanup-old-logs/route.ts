import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';

const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Cleanup Old Logs Cron Job
 * Her gün 02:00'da çalışır (Vercel Cron Jobs)
 * 
 * Temizleme Kuralları:
 * - Normal kayıtlar: 30 günden eski kayıtlar silinir
 * - Bot/Şüpheli kayıtlar: 90 günden eski kayıtlar silinir
 * 
 * Bu cron job Vercel tarafından otomatik olarak çalıştırılır.
 * Vercel Hobby plan: Günde 2 kez cron job çalıştırılabilir
 * Vercel Pro plan: Daha sık çalıştırılabilir
 */
export async function GET(request: NextRequest) {
  try {
    // Cron secret kontrolü (güvenlik için)
    const authHeader = request.headers.get('authorization');
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    console.log(`[Cron] Cleanup old logs completed: ${normalDeleted.count} normal, ${suspiciousDeleted.count} suspicious, ${totalDeleted} total`);

    return NextResponse.json({
      success: true,
      normalDeleted: normalDeleted.count,
      suspiciousDeleted: suspiciousDeleted.count,
      totalDeleted,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron] Cleanup old logs error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

