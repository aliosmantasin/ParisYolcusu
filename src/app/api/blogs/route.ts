import { NextRequest, NextResponse } from 'next/server';
import { BlogCategory } from '@prisma/client';
import * as BlogsService from '@/src/lib/blogs-service';

/**
 * Public Blog API
 * Authentication gerektirmez, herkes erişebilir
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    let blogs;
    if (category && Object.values(BlogCategory).includes(category as BlogCategory)) {
      // Kategoriye göre filtrele
      blogs = await BlogsService.getBlogsByCategory(category as BlogCategory, false);
    } else {
      // Tüm blogları getir (sadece aktif ve yayınlanmış)
      blogs = await BlogsService.getBlogs(false, false);
    }

    // Limit uygula
    const limitedBlogs = blogs.slice(0, limit);

    return NextResponse.json(limitedBlogs);
  } catch (error) {
    console.error('Public blogs GET error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

