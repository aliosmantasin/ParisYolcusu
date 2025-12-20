"use client";

import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ThankYouPage = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const [showConfetti, setShowConfetti] = useState(true);
  const t = useTranslations('ThankYou');

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // 10 saniye sonra confetti'yi durdur
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    // Trigger GTM conversion for reservation thank you page
    // Next.js client-side navigation'da GTM Page View trigger çalışmayabilir
    // Bu yüzden custom event gönderiyoruz
    if (typeof window !== 'undefined' && window.dataLayer) {
      // Custom event gönder - GTM trigger'ında Custom Event tipi kullanın
      window.dataLayer.push({
        event: 'reservation_conversion',
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title
      } as Record<string, unknown>);
      
      console.log('[Reservation Conversion] Custom event "reservation_conversion" sent to GTM');
      console.log('[Reservation Conversion] GTM trigger should be: Custom Event with event name "reservation_conversion"');
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}

      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          {t('message')}
        </p>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {t('emailSent')}
          </p>

          <div className="mt-8">
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white animate-pulse">
                {t('backToHome')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage; 