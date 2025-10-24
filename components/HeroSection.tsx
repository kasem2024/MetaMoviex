import React from 'react'

function HeroSection() {
  return (
    <div
      className="h-[400px] w-full  bg-center flex items-center justify-center text-white bg-zinc-500"
    
    >
      <div className="text-4xl font-bold drop-shadow-lg flex flex-col gap-y-4 max-w-[1170px] mx-auto">
        <h1>Welcom.</h1>
        <p className='text-2xl tracking-wider'>Millions of movies, TV shows and people to discover. Explore now.</p>
        <div className='flex items-center justify-between bg-white rounded-3xl mt-6'>
        <input type="text"
        placeholder='Search for Movie , TV show , Person ...' 
        className='text-black text-lg focus:none focus:ring-0 focus:outline-none focus:border-none pl-4 flex-1'/>
        <button type='submit' className='bg-red-800 hover:bg-red-900 rounded-3xl text-zinc-100 px-6 py-2 text-lg '>Search</button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection