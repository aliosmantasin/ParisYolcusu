import { prisma } from './db';
import { BlogCategory } from '@prisma/client';
import { Prisma } from '@prisma/client';

export interface CreateBlogInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  category: BlogCategory;
  imageId?: string | null;
  author?: string | null;
  authorId?: string | null;
  isPublished?: boolean;
  isActive?: boolean;
  publishedAt?: Date;
}

export interface UpdateBlogInput {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  category?: BlogCategory;
  imageId?: string | null;
  author?: string | null;
  authorId?: string | null;
  isPublished?: boolean;
  isActive?: boolean;
  publishedAt?: Date;
}

export const getBlogs = async (includeInactive = false, includeUnpublished = false) => {
  return prisma.blog.findMany({
    where: {
      ...(includeInactive ? {} : { isActive: true }),
      ...(includeUnpublished ? {} : { isPublished: true }),
    },
    include: {
      image: true,
      authorUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  });
};

export const getBlogBySlug = async (slug: string) => {
  return prisma.blog.findUnique({
    where: { slug },
    include: {
      image: true,
      authorUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getBlogById = async (id: string) => {
  return prisma.blog.findUnique({
    where: { id },
    include: {
      image: true,
      authorUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getBlogsByCategory = async (category: BlogCategory, includeInactive = false) => {
  return prisma.blog.findMany({
    where: {
      category,
      ...(includeInactive ? {} : { isActive: true, isPublished: true }),
    },
    include: {
      image: true,
      authorUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  });
};

export const createBlog = async (data: CreateBlogInput) => {
  return prisma.blog.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      imageId: data.imageId,
      author: data.author,
      authorId: data.authorId,
      isPublished: data.isPublished ?? false,
      isActive: data.isActive ?? true,
      publishedAt: data.publishedAt || (data.isPublished ? new Date() : null),
    },
    include: {
      image: true,
      authorUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const updateBlog = async (id: string, data: UpdateBlogInput) => {
  const updateData: Prisma.BlogUpdateInput = { ...data };
  if (data.isPublished === true && !data.publishedAt) {
    updateData.publishedAt = new Date();
  }

  return prisma.blog.update({
    where: { id },
    data: updateData,
    include: {
      image: true,
      authorUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const deleteBlog = async (id: string) => {
  await prisma.blog.delete({
    where: { id },
  });
};

export const incrementBlogViews = async (id: string) => {
  return prisma.blog.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
  });
};

