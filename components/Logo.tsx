import React from 'react'
import meta from '@/public/assets/metamoviex.png'
import Image from 'next/image'
import Link from 'next/link'
function Logo() {
  return (
    <Link
     href={'/'} 
    className='min-w-[200px] '>
      <Image src={meta} alt="img" width={100} height={100} />
    </Link>
  )
}

export default Logo