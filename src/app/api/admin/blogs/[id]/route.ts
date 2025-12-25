import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BlogCategory } from '@prisma/client';
import { requireContentAdminAuth } from '@/src/lib/auth';
import * as BlogsService from '@/src/lib/blogs-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireContentAdminAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const blog = await BlogsService.getBlogById(id);
    if (!blog) {
      return NextResponse.json(
        { message: 'Blog bulunamadı' },
        { status: 404 }
      );
    }
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Blog Admin GET error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

const UpdateBlogSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1).optional(),
  category: z.nativeEnum(BlogCategory).optional(),
  imageId: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  authorId: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  isActive: z.boolean().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireContentAdminAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    // Boş string'leri undefined'a çevir (validation için)
    const cleanedBody = {
      ...body,
      excerpt: body.excerpt && body.excerpt.trim() ? body.excerpt.trim() : undefined,
      imageId: body.imageId && body.imageId.trim() ? body.imageId.trim() : undefined,
      author: body.author && body.author.trim() ? body.author.trim() : undefined,
    };
    
    const validatedData = UpdateBlogSchema.parse(cleanedBody);
    const blog = await BlogsService.updateBlog(id, {
      ...validatedData,
      publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : undefined,
    });
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Blog PUT error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Geçersiz veri', errors: error.issues },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireContentAdminAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    await BlogsService.deleteBlog(id);
    return NextResponse.json({ message: 'Blog silindi' });
  } catch (error) {
    console.error('Blog DELETE error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

