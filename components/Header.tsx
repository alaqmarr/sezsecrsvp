import Image from 'next/image'
import React from 'react'

const Header = () => {
    return (
        <div
            className='flex items-center w-[70%] justify-center gap-x-8'
        >
            <Image
                src="/logo.jpg"
                alt="Ashara Mubaraka 1447H Relay Center"
                width={100}
                height={100}
                className="mx-auto mb-4 rounded-md"
            />
            <Image
                src="/logo.png"
                alt="Shabab Ul Eidiz Zahabi"
                width={100}
                height={100}
                className="mx-auto mb-4 rounded-md"
            />

        </div>
    )
}

export default Header
