import Image from 'next/image';
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Bonnie Green",
    role: "CTO at Flowbite",
    image: "/images/placeholder1.png",
    quote: "Flowbite is just awesome. It contains tons of predesigned components and pages starting from login screen to complex dashboard. Perfect choice for your next SaaS application.",
  },
  {
    name: "John Doe",
    role: "CEO at TechCorp",
    image: "/images/placeholder1.png",
    quote: "This product has changed the way we work. The efficiency and speed are unmatched. Highly recommended!",
  },
  {
    name: "Alice Smith",
    role: "Product Manager at WebX",
    image: "/images/placeholder1.png",
    quote: "A must-have tool for any serious development team. The user experience is top-notch!",
  },
  {
    name: "Michael Brown",
    role: "Lead Designer at Creatives",
    image: "/images/placeholder1.png",
    quote: "The design and ease of use are incredible. We've received so many positive reviews from our clients!",
  },
];

const Testimonials = () => {
  return (
    <section className='my-20 p-2 bg-slate-50 dark:bg-black'>
        <div className='w-full text-center p-2'>
          <h2 className='text-[#067481] font-bold text-3xl my-3'>Müşteri Yorumları</h2>
        </div>
      <Carousel className='max-w-screen-2xl mx-auto'>
        <CarouselContent className='max-w-lg min-h-[550px] '>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className='mx-auto flex px-5 '>
              <Card className="flex h-[500] max-h-[550px] items-center justify-center bg-slate-50 dark:bg-black p-10 m-auto">
                <CardContent className=''>
                  <figure className="max-w-screen-md text-center">
                    <div className="flex items-center justify-center mb-4 text-yellow-300">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 22 20">
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">&quot;{testimonial.quote}&quot;</p>
                    </blockquote>
                    <figcaption className="flex items-center justify-center mt-6 space-x-3">
                      <Image width={50} height={50} className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                      <div className="flex items-center divide-x-2 divide-gray-300 dark:divide-gray-700">
                        <cite className="pe-3 font-medium text-gray-900 dark:text-white">{testimonial.name}</cite>
                        <cite className="ps-3 text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</cite>
                      </div>
                    </figcaption>
                  </figure>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 shadow-md rounded-full md:p-4" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 shadow-md rounded-full md:p-4" />
      </Carousel>
    </section>
  );
};

export default Testimonials;