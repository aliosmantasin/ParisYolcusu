import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { requireAnalystAuth } from '@/src/lib/auth';

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
    const days = parseInt(searchParams.get('days') || '7');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Toplam kayıt sayısı
    const totalLogs = await prisma.iPLog.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // En çok ziyaret edilen sayfalar
    const topPaths = await prisma.iPLog.groupBy({
      by: ['path'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    // En aktif IP'ler
    const topIPs = await prisma.iPLog.groupBy({
      by: ['ipAddress'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    // Benzersiz IP sayısı
    const uniqueIPs = await prisma.iPLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        ipAddress: true,
      },
      distinct: ['ipAddress'],
    });

    // Günlük istatistikler (son N gün)
    const dailyStats = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await prisma.iPLog.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate,
          },
        },
      });

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        count,
      });
    }

    return NextResponse.json({
      totalLogs,
      uniqueIPs: uniqueIPs.length,
      topPaths: topPaths.map((item) => ({
        path: item.path,
        count: item._count.id,
      })),
      topIPs: topIPs.map((item) => ({
        ipAddress: item.ipAddress,
        count: item._count.id,
      })),
      dailyStats,
    });
  } catch (error) {
    console.error('Admin IP logs stats error:', error);
    return NextResponse.json(
      { message: 'IP log istatistikleri getirilemedi.' },
      { status: 500 }
    );
  }
}

