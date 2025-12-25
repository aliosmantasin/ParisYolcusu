import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from './db';
import { UserRole } from '@prisma/client';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  userRole?: UserRole;
}

/**
 * JWT token'ı doğrular ve kullanıcı bilgilerini döndürür
 */
export async function authenticateToken(request: NextRequest): Promise<{ userId: string; userRole: UserRole } | null> {
  try {
    // Cookie'den token al
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: UserRole };

    // Kullanıcının gerçekten veritabanında var olup olmadığını kontrol et
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.status !== 'ACTIVE') {
      return null;
    }

    return { userId: decoded.userId, userRole: decoded.role };
  } catch {
    return null;
  }
}

/**
 * Admin yetkisi kontrolü (SUPER_ADMIN, ADMIN, CONTENT_ADMIN, ANALYST)
 */
export function requireAdmin(userRole?: UserRole): boolean {
  if (!userRole) return false;
  return ['SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN', 'ANALYST'].includes(userRole);
}

/**
 * Content Admin yetkisi kontrolü (Blog yönetimi için)
 */
export function requireContentAdmin(userRole?: UserRole): boolean {
  if (!userRole) return false;
  return ['SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN'].includes(userRole);
}

/**
 * Analyst yetkisi kontrolü (Trafik analizi için)
 */
export function requireAnalyst(userRole?: UserRole): boolean {
  if (!userRole) return false;
  return ['SUPER_ADMIN', 'ADMIN', 'ANALYST'].includes(userRole);
}

/**
 * Super Admin yetkisi kontrolü
 */
export function requireSuperAdmin(userRole?: UserRole): boolean {
  return userRole === 'SUPER_ADMIN';
}

/**
 * Authenticated request için helper
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<{ userId: string; userRole: UserRole } | null> {
  return await authenticateToken(request);
}

/**
 * Admin yetkisi kontrolü için helper
 */
export async function requireAdminAuth(request: NextRequest): Promise<{ userId: string; userRole: UserRole } | null> {
  const auth = await authenticateToken(request);
  if (!auth) {
    return null;
  }
  if (!requireAdmin(auth.userRole)) {
    return null;
  }
  return auth;
}

/**
 * Content Admin yetkisi kontrolü için helper
 */
export async function requireContentAdminAuth(request: NextRequest): Promise<{ userId: string; userRole: UserRole } | null> {
  const auth = await authenticateToken(request);
  if (!auth) {
    return null;
  }
  if (!requireContentAdmin(auth.userRole)) {
    return null;
  }
  return auth;
}

/**
 * Analyst yetkisi kontrolü için helper
 */
export async function requireAnalystAuth(request: NextRequest): Promise<{ userId: string; userRole: UserRole } | null> {
  const auth = await authenticateToken(request);
  if (!auth) {
    return null;
  }
  if (!requireAnalyst(auth.userRole)) {
    return null;
  }
  return auth;
}

/**
 * Super Admin yetkisi kontrolü için helper
 */
export async function requireSuperAdminAuth(request: NextRequest): Promise<{ userId: string; userRole: UserRole } | null> {
  const auth = await authenticateToken(request);
  if (!auth) {
    return null;
  }
  if (!requireSuperAdmin(auth.userRole)) {
    return null;
  }
  return auth;
}

