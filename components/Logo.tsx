import React from 'react'
import logo from '@/public/assets/logoicon.png'
import Image from 'next/image'
import Link from 'next/link'

function Logo() {
  return (
    <Link
     href={'/'} 
    className='bg-black  rounded-2xl overflow-hidden mr-4 lg:mr-16 '>
      <Image src={logo} alt="img" width={50} height={50} />
    </Link>
  )
}

export default Logo