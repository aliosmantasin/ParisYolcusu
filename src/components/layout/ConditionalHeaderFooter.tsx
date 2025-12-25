"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/src/app/[locale]/(routes)/_components/menu/Navbar';
import Footer from '@/src/app/[locale]/(routes)/_components/menu/Footer';

export function ConditionalHeaderFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Admin sayfalarında Header ve Footer gösterilmez
  // Diğer tüm sayfalarda (auth sayfaları dahil) gösterilir
  const isAdminPage = pathname?.startsWith('/admin') || pathname?.includes('/admin');
  const shouldShowHeaderFooter = !isAdminPage;

  return (
    <>
      {shouldShowHeaderFooter && <Navbar />}
      <div>{children}</div>
      {shouldShowHeaderFooter && <Footer />}
    </>
  );
}

