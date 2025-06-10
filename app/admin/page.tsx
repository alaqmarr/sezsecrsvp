import CreateRSVP from '@/components/CreateRSVP'
import RSVPData from '@/components/RSVPData'
import React from 'react'

const page = () => {
  return (
    <div
      className='flex flex-col items-center justify-center w-full p-4'
    >
      <CreateRSVP />
      <RSVPData />
    </div>
  )
}

export default page
