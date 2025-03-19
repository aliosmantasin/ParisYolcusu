import Image from 'next/image'
import React from 'react'

const AboutComponent = () => {
  return (
    <section className='my-10 p-2' id='about'>
        <div className='container flex flex-wrap mx-auto'>

              <div className='w-full text-center p-2'>
                  <h2 className='text-[#067481] font-bold text-3xl my-3'> Hakkımızda</h2>
              </div>

        <div className='flex w-full sm:w-2/4 justify-center'>
            <Image src="/images/placeholder1.png" alt='' width={400} height={400}></Image>
        </div>

        <div className='flex w-full sm:w-2/4 justify-center'>
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

export default AboutComponent