import Image from 'next/image'
import React from 'react'

const Header = () => {
    return (
        <div>
            <Image
                src="/logo.jpg"
                alt="Ashara Mubaraka 1447H Relay Center"
                width={200}
                height={200}
                className="mx-auto mb-4 rounded-md"
            />
        </div>
    )
}

export default Header
