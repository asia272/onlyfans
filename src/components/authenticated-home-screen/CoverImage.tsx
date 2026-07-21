import Image from 'next/image'
import React from 'react'

const CoverImage = () => {
    return (
        <div className='h-44 overflow-hidden relative'>
            <Image
                src={"/featured/featured10.jpg"}
                className='h-full w-full object-cover select-none pointer-events-none'
                fill
                alt='horse Cover Image'
            />
        </div>
    )
}

export default CoverImage