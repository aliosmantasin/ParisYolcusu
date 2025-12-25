import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { requireAnalystAuth } from '@/src/lib/auth';

/**
 * Clear All IP Logs
 * Tüm IP log kayıtlarını siler
 */
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAnalystAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Tüm IP log kayıtlarını sil
    const result = await prisma.iPLog.deleteMany({});

    return NextResponse.json({
      message: `${result.count} IP log kaydı silindi.`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Admin IP logs clear error:', error);
    return NextResponse.json(
      { message: 'IP log kayıtları temizlenemedi.' },
      { status: 500 }
    );
  }
}

