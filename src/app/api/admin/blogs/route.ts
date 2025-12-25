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
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, { message: 'İçerik gereklidir' }),
  category: z.nativeEnum(BlogCategory, { message: 'Geçerli bir kategori seçiniz' }),
  imageId: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  authorId: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  isActive: z.boolean().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireContentAdminAuth(request);
    if (!auth) {
      console.error('[Blog POST] Auth failed - no token or invalid token');
      return NextResponse.json(
        { message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log('[Blog POST] Received body:', JSON.stringify(body, null, 2));
    
    // Boş string'leri undefined'a çevir (validation için)
    const cleanedBody = {
      ...body,
      excerpt: body.excerpt && body.excerpt.trim() ? body.excerpt.trim() : undefined,
      imageId: body.imageId && body.imageId.trim() ? body.imageId.trim() : undefined,
      author: body.author && body.author.trim() ? body.author.trim() : undefined,
    };
    
    console.log('[Blog POST] Cleaned body:', JSON.stringify(cleanedBody, null, 2));
    
    const validatedData = CreateBlogSchema.parse(cleanedBody);
    console.log('[Blog POST] Validated data:', JSON.stringify(validatedData, null, 2));
    
    const blog = await BlogsService.createBlog({
      ...validatedData,
      authorId: validatedData.authorId || auth.userId,
      publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : undefined,
    });
    
    console.log('[Blog POST] Blog created successfully:', blog.id);
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('[Blog POST] Error details:', error);
    if (error instanceof z.ZodError) {
      console.error('[Blog POST] Zod validation errors:', error.issues);
      return NextResponse.json(
        { 
          message: 'Geçersiz veri', 
          errors: error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
        },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      console.error('[Blog POST] Error message:', error.message);
      console.error('[Blog POST] Error stack:', error.stack);
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

