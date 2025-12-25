"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  category: string;
  image?: { id: string; url: string } | null;
  publishedAt?: string | null;
  views: number;
}

interface BlogCarouselProps {
  locale?: string;
}

export default function BlogCarousel({ locale = 'tr' }: BlogCarouselProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogsAndVisibility = async () => {
      try {
        // Önce visibility ayarını kontrol et
        const settingsResponse = await fetch('/api/settings?key=blog_carousel_visible');
        const settingsData = await settingsResponse.json();
        
        // Eğer ayar yoksa veya "true" ise göster
        const visible = settingsData === null || settingsData.value === 'true';
        setIsVisible(visible);

        if (visible) {
          // Blog'ları getir
          const blogsResponse = await fetch('/api/blogs?limit=6');
          if (blogsResponse.ok) {
            const blogsData = await blogsResponse.json();
            setBlogs(blogsData);
          }
        }
      } catch (error) {
        console.error('Blog carousel fetch error:', error);
        setIsVisible(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogsAndVisibility();
  }, []);

  // Eğer görünür değilse veya yükleniyorsa hiçbir şey render etme
  if (isLoading || !isVisible || blogs.length === 0) {
    return null;
  }

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'PARIS_TRANSFER': 'Paris Transfer',
      'PARIS_TURLARI': 'Paris Turları',
      'PARIS_REHBERI': 'Paris Rehberi',
    };
    return categoryMap[category] || category;
  };

  return (
    <section className="my-20 p-2">
      <div className="w-full text-center p-2 mb-8">
        <h2 className="text-[#067481] font-bold text-3xl my-3">
          Blog Yazılarımız
        </h2>
        <p className="text-gray-600 mt-2">
          Paris hakkında en güncel bilgiler ve rehberler
        </p>
      </div>
      
      <Carousel className="max-w-screen-2xl mx-auto">
        <CarouselContent className="max-w-lg min-h-[400px]">
          {blogs.map((blog) => (
            <CarouselItem key={blog.id} className="mx-auto flex px-5 relative">
              <Link 
                href={`/${locale}/blog/${blog.slug}`}
                className="w-full group"
              >
                <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border-4 border-[#057381] shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {blog.image ? (
                    <Image
                      src={blog.image.url}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#057381] to-[#067481] flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">Blog</span>
                    </div>
                  )}
                  
                  {/* Overlay with content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <div className="text-white">
                      <span className="inline-block px-3 py-1 bg-[#057381] rounded-full text-xs font-semibold mb-2">
                        {getCategoryLabel(blog.category)}
                      </span>
                      <h3 className="text-2xl font-bold mb-2 line-clamp-2 group-hover:text-[#057381] transition-colors">
                        {blog.title}
                      </h3>
                      {blog.excerpt && (
                        <p className="text-sm text-gray-200 line-clamp-2 mb-2">
                          {blog.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-300">
                        <span>{blog.views} görüntülenme</span>
                        {blog.publishedAt && (
                          <span>
                            {new Date(blog.publishedAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 shadow-md rounded-full md:p-4" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 shadow-md rounded-full md:p-4" />
      </Carousel>
    </section>
  );
}

