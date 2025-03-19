import React from 'react'
import Image from "next/image"
 
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
 
export interface Artwork {
  artist: string
  art: string
}
 
export const works: Artwork[] = [
  {
    artist: "Özellik ve Avantajlar 1",
    art: "/images/placeholder1.png",
  },
  {
    artist: "Özellik ve Avantajlar 2",
    art: "/images/placeholder2.webp",
  },
  {
    artist: "Özellik ve Avantajlar 3",
    art: "/images/placeholder1.png",
  },
]
const FeaturesBrand = () => {
  return (
    <section className='py-10 p-2'>
      <div className='container flex flex-wrap justify-center mx-auto'>
        <div className='w-full text-center p-2'>
          <h2 className='text-[#067481] font-bold text-3xl'>Özellikler ve Avantajlar</h2>
        </div>

      <div className='flex w-full sm:w-2/4 md:w-5/12 justify-center mx-auto p-4'>
      <ScrollArea className="w-[450px] whitespace-nowrap rounded-md border">
      <div className="flex w-full m-2 sm:w-2/4  space-x-4 sm:m-4">
        {works.map((artwork) => (
          <figure key={artwork.artist} className="shrink-0">
            <div className="overflow-hidden rounded-md">
              <Image
                src={artwork.art}
                alt={`Photo by ${artwork.artist}`}
                className="aspect-[3/4] h-fit w-fit object-contain"
                width={200}
                height={200}
                style={{margin:"0.5rem"}}
              />
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground">
             
              <span className="font-semibold text-foreground">
                {artwork.artist}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>

          </div>


        <div className='w-full flex sm:w-2/4 md:w-6/12 p-2 mx-auto bg-yellow justify-center '>
          <div className=' m-auto'>
            <p className=' my-2 text-xl font-medium text-gray-500 dark:text-gray-400'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic, neque.
            </p>


            <ul className="space-y-4 text-gray-500 list-disc list-inside dark:text-gray-400">
              <li>
                List item one
                <ol className="ps-5 mt-2 space-y-1 list-decimal list-inside">
                  <li>You might feel like you are being really &quot;organized&quot; o</li>
                  <li>Nested navigation in UIs is a bad idea too, keep things as flat as possible.</li>
                  <li>Nesting tons of folders in your source code is also not helpful.</li>
                </ol>
              </li>
              <li>
                List item two
                <ul className="ps-5 mt-2 space-y-1 list-decimal list-inside">
                  <li>Im not sure if we&quot;ll bother styling more than two levels deep.</li>
                  <li>Two is already too much, three is guaranteed to be a bad idea.</li>
                  <li>If you nest four levels deep you belong in prison.</li>
                </ul>
              </li>
              <li>
                List item three
                <ul className="ps-5 mt-2 space-y-1 list-decimal list-inside">
                  <li>Again please don&apos;t nest lists if you want</li>
                  <li>Nobody wants to look at this.</li>
                  <li>I&apos;m upset that we even have to bother styling this.</li>
                </ul>
              </li>
            </ul>

          </div>
        </div>
      </div>

    </section>
  )
}

export default FeaturesBrand