import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Eye, User } from 'lucide-react';
import * as BlogsService from '@/src/lib/blogs-service';

type Props = {
  params: Promise<{ locale?: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const blog = await BlogsService.getBlogBySlug(slug);

  if (!blog || !blog.isPublished || !blog.isActive) {
    return {
      title: 'Blog Bulunamadı',
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt || blog.title,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.title,
      images: blog.image ? [blog.image.url] : [],
    },
  };
}

// Revalidate every hour for ISR
export const revalidate = 3600;

const getCategoryLabel = (category: string) => {
  const categoryMap: Record<string, string> = {
    'PARIS_TRANSFER': 'Paris Transfer',
    'PARIS_TURLARI': 'Paris Turları',
    'PARIS_REHBERI': 'Paris Rehberi',
  };
  return categoryMap[category] || category;
};

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const blog = await BlogsService.getBlogBySlug(slug);

  if (!blog || !blog.isPublished || !blog.isActive) {
    notFound();
  }

  // Görüntülenme sayısını artır (async, await etmeden)
  BlogsService.incrementBlogViews(blog.id).catch(console.error);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-[#057381] hover:text-[#067481] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-[#057381] text-white rounded-full text-sm font-semibold">
              {getCategoryLabel(blog.category)}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          
          {blog.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{blog.excerpt}</p>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-500">
            {blog.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(blog.publishedAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{blog.views} görüntülenme</span>
            </div>
            {blog.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{blog.author}</span>
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {blog.image && (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8 shadow-lg">
            <Image
              src={blog.image.url}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-gray-900
            prose-p:text-gray-700
            prose-a:text-[#057381] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900
            prose-ul:text-gray-700
            prose-ol:text-gray-700
            prose-li:text-gray-700
            prose-img:rounded-lg prose-img:shadow-md
            prose-blockquote:border-l-[#057381] prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4
            prose-code:text-[#057381] prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-gray-100"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
}

