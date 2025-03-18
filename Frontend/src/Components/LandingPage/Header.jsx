import React, { useState } from 'react'
import SearchBar from '../List/SearchBar';

const Header = () => {
  
  return (
    <div className='min-h-screen  bg-cover bg-center flex 
    items-center w-full overflow-hidden' 
    style={{backgroundImage:"url('/header_img.png')"}} id='Header'>
      <div className='container text-center mx-auto py-4 px-6 md:px-20
       lg:px-32 text-white'>
        <h2 className='text-5xl sm:text-6xl md:text-[82px] inline-block
        max-w-3xl font-semibold pt-20'>Explore homes that fit your dreams</h2>
        <div className='space-x-6 mt-16'>
            <SearchBar/>
        </div>
      </div>
    </div>
  )
}

export default Header;
