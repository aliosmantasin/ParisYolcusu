import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BlogCategory } from '@prisma/client';
import { requireContentAdminAuth } from '@/src/lib/auth';
import * as BlogsService from '@/src/lib/blogs-service';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireContentAdminAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    const blogs = await BlogsService.getBlogs(true, true);
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Blogs Admin GET error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

const CreateBlogSchema = z.object({
  title: z.string().min(1, { message: 'Başlık gereklidir' }),
  slug: z.string().min(1, { message: 'Slug gereklidir' }),
  excerpt: z.string().optional(),
  content: z.string().min(1, { message: 'İçerik gereklidir' }),
  category: z.nativeEnum(BlogCategory, { message: 'Geçerli bir kategori seçiniz' }),
  imageId: z.string().optional(),
  author: z.string().optional(),
  authorId: z.string().optional(),
  isPublished: z.boolean().optional(),
  isActive: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireContentAdminAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = CreateBlogSchema.parse(body);
    const blog = await BlogsService.createBlog({
      ...validatedData,
      authorId: validatedData.authorId || auth.userId,
      publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : undefined,
    });
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Blog POST error:', error);
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

