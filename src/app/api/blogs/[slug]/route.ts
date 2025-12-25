import { NextRequest, NextResponse } from 'next/server';
import * as BlogsService from '@/src/lib/blogs-service';

/**
 * Public Blog by Slug API
 * Authentication gerektirmez, herkes erişebilir
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blog = await BlogsService.getBlogBySlug(slug);

    if (!blog) {
      return NextResponse.json(
        { message: 'Blog bulunamadı' },
        { status: 404 }
      );
    }

    // Sadece yayınlanmış ve aktif blogları göster
    if (!blog.isPublished || !blog.isActive) {
      return NextResponse.json(
        { message: 'Blog bulunamadı' },
        { status: 404 }
      );
    }

    // Görüntülenme sayısını artır (async, blocking yapmadan)
    // Not: Page component'te de çağrılıyor, burada sadece API için
    BlogsService.incrementBlogViews(blog.id).catch(console.error);

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Public blog GET error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

