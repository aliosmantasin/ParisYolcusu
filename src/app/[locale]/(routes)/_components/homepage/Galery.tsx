"use client"
import Image from 'next/image';
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Script from 'next/script';
// import { useTranslations } from 'next-intl';

interface GalleryItem {
  id: number;
  type: 'image' | 'video';
  image?: string;
  videoUrl?: string;
  thumbnail?: string;
  alt?: string;
  title: string;
}

// Gallery data structure for easy mapping
const galleryData: GalleryItem[] = [
  {
    id: 9,
    type: 'image',
    image: "/images/misafir/parisgezi2.webp",
    alt: "Murat bey ve ailesi eyfe kulesi turu",
    title: "Murat bey ve ailesi eyfe kulesi turu"
  },
  {
    id: 8,
    type: 'image',
    image: "/images/misafir/parisgezi1.webp",
    alt: "Paris Şehir Gezi Turu",
    title: "Paris Şehir Gezi Turu"
  },
  {
    id: 5,
    type: 'image',
    image: "/images/misafir/misafir1.webp",
    alt: "Tarık bey paris CDG havalimanından Paris şehir merkezine yolculuğu sağlandı",
    title: "Tarık bey Paris CDG havalimanından Paris şehir merkezine yolculuğu sağlandı"
  },
  {
    id: 6,
    type: 'image',
    image: "/images/misafir/misafir2.webp",
    alt: "Yaren hanım bizi tercih ettiği için teşekkürler",
    title: "Yaren hanım bizi tercih ettiği için teşekkürler"
  },
  {
    id: 7,
    type: 'image',
    image: "/images/misafir/misafir3.webp",
    alt: "CDG havalimanı misafir karşılama",
    title: "CDG havalimanı misafir karşılama"
  },
  {
    id: 1,
    type: 'image',
    image: "https://res.cloudinary.com/dppmtyact/image/upload/v1744625041/havalimaniGorsel3_cfyyk7.webp",
    alt: "Aeroport Le Bourget Özel Jet Karşılama",
    title: "Aeroport Le Bourget Özel Jet Karşılama"
  },
  {
    id: 2,
    type: 'video',
    videoUrl: "https://res.cloudinary.com/dppmtyact/video/upload/v1744625037/ParisRefVideo1_wkwyhx.mp4",
    thumbnail: "https://res.cloudinary.com/dppmtyact/image/upload/v1744626313/Kapak-100_ngsrzr.jpg",
    title: "Paris Türk Şoförlü VIP Transfer Hizmeti"
  },
  {
    id: 3,
    type: 'image',
    image: "https://res.cloudinary.com/dppmtyact/image/upload/v1744625041/havalimaniGorsel2_namc3b.webp",
    alt: "Aeroport Le Bourget Özel Jet Karşılama",
    title: "Aeroport Le Bourget Özel Jet Karşılama"
  },
  {
    id: 4,
    type: 'image',
    image: "https://res.cloudinary.com/dppmtyact/image/upload/v1744625040/havalimaniGorsel1_wahkoe.webp",
    alt: "Aeroport Le Bourget Özel Jet Karşılama",
    title: "Aeroport Le Bourget Özel Jet Karşılama"
  },


];

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Aeroport Le Bourget Özel Jet Karşılama",
  "description": "Aeroport Le Bourget - Paris Özel Jet Karşılama ve VIP transfer hizmetleri sunuyoruz.",
  "image": galleryData
    .filter(item => item.type === 'image')
    .map(item => ({
      "@type": "ImageObject",
      "contentUrl": item.image,
      "name": item.title,
      "description": item.alt || item.title
    }))
};

// Video JSON-LD structured data
const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGallery",
  "name": "Paris VIP Transfer Hizmetleri",
  "description": "Aeroport Le Bourget - Paris Özel Jet Karşılama ve VIP transfer hizmetlerimizden örnekler",
  "video": galleryData
    .filter(item => item.type === 'video')
    .map(item => ({
      "@type": "VideoObject",
      "name": item.title,
      "description": "Paris VIP transfer hizmetlerimizden örnek bir video",
      "thumbnailUrl": item.thumbnail,
      "contentUrl": item.videoUrl,
      "uploadDate": "2024-03-14",
      "duration": "PT1M", // Video süresi (örnek olarak 1 dakika)
      "embedUrl": item.videoUrl,
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/WatchAction",
        "userInteractionCount": 0
      }
    }))
};

const Gallery = () => {
  // State for modal and video control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{url: string, title: string} | null>(null);
  
  // Function to handle video selection
  const handleVideoSelect = (videoUrl: string | undefined, title: string) => {
    if (videoUrl) {
      setSelectedVideo({ url: videoUrl, title });
      setIsModalOpen(true);
    }
  };

  return (
    <section className='my-20 p-2'>
      {/* Image Gallery JSON-LD structured data */}
      <Script
        id="gallery-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Video Gallery JSON-LD structured data */}
      <Script
        id="video-gallery-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      
      <div className='w-full text-center p-2'>
        <h2 className='text-[#067481] font-bold text-3xl my-3'>Galerimizi İnceleyin</h2>
      </div>
      <Carousel className='max-w-screen-2xl mx-auto'>
        <CarouselContent className='max-w-lg min-h-[550px]'>
          {galleryData.map((item) => (
            <CarouselItem key={item.id} className='mx-auto flex px-5 relative'>
              <div className="relative w-full h-[500px] max-h-[550px] group">
                {item.type === 'image' ? (
                  // Image content
                  <>
                    <Image 
                      src={item.image || ''} 
                      alt={item.alt || ''} 
                      fill
                      className='rounded-3xl object-cover p-5 m-auto border-4 border-[#057381]'
                    />
                    {/* Dark overlay with text - visible on hover */}
                    <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center p-5 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                      <h3 className="text-white text-2xl font-bold text-center">{item.title}</h3>
                    </div>
                  </>
                ) : (
                  // Video thumbnail with play button
                  <div 
                    className="relative w-full h-full cursor-pointer"
                    onClick={() => handleVideoSelect(item.videoUrl, item.title)}
                  >
                    <Image 
                      src={item.thumbnail || ''} 
                      alt={item.title || ''} 
                      fill
                      className='rounded-3xl object-cover p-5 m-auto border-4 border-[#057381]'
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center p-5 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#057381]">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-white text-2xl font-bold text-center">{item.title}</h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 shadow-md rounded-full md:p-4" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 shadow-md rounded-full md:p-4" />
      </Carousel>

      {/* Video Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95%] md:max-w-xl h-auto max-h-[80vh] p-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#067481]">
              {selectedVideo?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="relative w-full aspect-[9/16] max-h-[calc(80vh-100px)]">
              <video
                className="w-full h-full rounded-lg object-contain bg-black"
                controls
                autoPlay
                playsInline
                src={selectedVideo.url}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Gallery;
