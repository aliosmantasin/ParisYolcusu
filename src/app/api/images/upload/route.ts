import { NextRequest, NextResponse } from 'next/server';
import { requireContentAdminAuth } from '@/src/lib/auth';
import { prisma } from '@/src/lib/db';
import { supabase } from '@/src/lib/supabase';
import path from 'path';

const ALLOWED_BUCKETS = [
  'blog',
  'product-images',
  'category-images',
];

export async function POST(request: NextRequest) {
  try {
    const auth = await requireContentAdminAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!supabase) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      let errorMessage = 'Supabase is not configured. ';
      if (!supabaseUrl) {
        errorMessage += 'SUPABASE_URL is missing. ';
      } else if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
        errorMessage += `SUPABASE_URL must be a valid HTTP or HTTPS URL. Current value: ${supabaseUrl.substring(0, 20)}...`;
      } else if (!supabaseServiceRoleKey) {
        errorMessage += 'SUPABASE_SERVICE_ROLE_KEY is missing.';
      } else {
        errorMessage += 'Please check your Supabase configuration.';
      }
      
      return NextResponse.json(
        { message: errorMessage },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const bucketName = formData.get('bucketName') as string || 'blog';
    const category = formData.get('category') as string | null;
    const files = formData.getAll('images') as File[];

    if (!ALLOWED_BUCKETS.includes(bucketName)) {
      return NextResponse.json(
        {
          message: 'Geçerli bir bucket adı belirtilmedi.',
          received: bucketName,
          allowed: ALLOWED_BUCKETS,
        },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: 'Yüklenecek dosya bulunamadı.' },
        { status: 400 }
      );
    }

    const createdImages = [];

    for (const file of files) {
      // Dosya tipini kontrol et
      if (!file.type.startsWith('image/')) {
        continue; // Skip non-image files
      }

      // Dosya boyutunu kontrol et (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        continue; // Skip files larger than 5MB
      }

      const fileExtension = path.extname(file.name);
      
      // Dosya adını sanitize et
      const sanitizeFileName = (name: string): string => {
        const baseName = path.basename(name, fileExtension);
        return baseName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Türkçe karakterleri normalize et
          .replace(/[^a-z0-9]/g, '-') // Özel karakterleri tire ile değiştir
          .replace(/-+/g, '-') // Birden fazla tireyi tek tire yap
          .replace(/^-|-$/g, ''); // Başta ve sonda tire varsa kaldır
      };

      const sanitizedBaseName = sanitizeFileName(file.name);
      const fileName = `${sanitizedBaseName}-${Date.now()}${fileExtension}`;

      // Upload path: blog bucket için kategori klasörü kullan
      const uploadPath = bucketName === 'blog' && category
        ? `${category}/${fileName}`
        : fileName;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(uploadPath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error(`Supabase upload error for file ${file.name}:`, uploadError);
        continue; // Skip this file and continue with others
      }

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(uploadData.path);

      const publicUrl = urlData.publicUrl;

      const newImage = await prisma.image.create({
        data: {
          url: publicUrl,
          bucket: bucketName,
        },
      });

      createdImages.push(newImage);
    }

    if (createdImages.length === 0) {
      return NextResponse.json(
        { message: 'Hiçbir görsel yüklenemedi. Lütfen geçerli görsel dosyaları seçin.' },
        { status: 400 }
      );
    }

    return NextResponse.json(createdImages, { status: 201 });
  } catch (error) {
    console.error('Image upload error:', error);
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

