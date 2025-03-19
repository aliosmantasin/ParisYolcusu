import React from 'react'
import Logo from './Logo'
import { BigScreenMenu } from './Menu'
import Settings from './Settings'







const Navbar = () => {
  return (
   <>
   <header className='flex items-center h-24 bg-white dark:bg-black shadow-md'  id='home'>
        <div className='container flex justify-between mx-auto px-4 '>
            <Logo/>
            <BigScreenMenu/>
            <Settings/>
          
           
        </div>
   </header>
   </>
  )
}

export default Navbar