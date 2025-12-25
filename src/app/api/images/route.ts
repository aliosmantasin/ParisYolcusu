import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { requireContentAdminAuth } from '@/src/lib/auth';
import { Prisma } from '@prisma/client';

/**
 * Images API
 * Get images by bucket/category
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get('bucket') || 'blog';
    // Category filtreleme URL'den yapılacak (client-side'da)

    const where: Prisma.ImageWhereInput = { bucket };

    const images = await prisma.image.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Images GET error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Delete image (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireContentAdminAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Image ID is required' },
        { status: 400 }
      );
    }

    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Image deleted' });
  } catch (error) {
    console.error('Image DELETE error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

