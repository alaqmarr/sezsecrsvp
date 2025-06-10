import Header from '@/components/Header';
import MarkRSVP from '@/components/MarkRSVP';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatTime } from '@/lib/time';
import { format, formatDate, formatISO } from 'date-fns';
import React from 'react'

const page = async () => {
  const res = await fetch("http://localhost:3000/api/v1/get/home", { cache: 'no-store' });
  const data = await res.json();
  console.log(data)
  return (
    <div>
      <Header/>
      <Card
      className='w-[400px]'
      >
        <CardHeader>
          {
            format(data.date, 'MMMM dd, yyyy') // Format the date to a readable format
          }
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span>Lunch</span>
              <span>{data.lunch ? formatTime(data.lunch) : 'No lunch RSVP'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Dinner</span>
              <span>{data.dinner ? formatTime(data.dinner) : 'No dinner RSVP'}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <MarkRSVP rsvpId={data.id} />
        </CardFooter>
      </Card>
    </div>
  )
}

export default page
