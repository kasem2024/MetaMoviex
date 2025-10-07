import React from 'react'
import meta from '@/public/assets/metamoviex.png'
import Image from 'next/image'
function Logo() {
  return (
    <div className='min-w-[200px] '>
      <Image src={meta} alt="img" width={230} height={230} />
    </div>
  )
}

export default Logo