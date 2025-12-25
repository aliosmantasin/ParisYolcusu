import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/src/lib/db';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Login sayfasını authentication kontrolünden muaf tut
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Eğer login sayfasındaysak, authentication kontrolü yapma
  // Login sayfası kendi layout'unu kullanır (admin/login/layout.tsx)
  if (pathname.includes('/admin/login')) {
    return <>{children}</>;
  }
  
  // Admin sayfası için authentication kontrolü
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  // Token yoksa login'e yönlendir
  if (!token) {
    redirect('/admin/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };
    
    // Kullanıcının gerçekten veritabanında var olup olmadığını kontrol et
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.status !== 'ACTIVE') {
      redirect('/admin/login');
    }
  } catch {
    redirect('/admin/login');
  }

  // Admin sayfası için Header ve Footer gösterilmez
  return <>{children}</>;
}
