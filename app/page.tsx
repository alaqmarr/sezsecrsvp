import Header from '@/components/Header';
import MarkRSVP from '@/components/MarkRSVP';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatTime } from '@/lib/time';
import { format, formatDate, formatISO } from 'date-fns';
import React from 'react'

const page = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/get/home`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch RSVP data');
  }

  const data = await res.json();
  if (!data) return <div className="text-red-500">No RSVP data available</div>;
  console.log(data)
  return (
    <div>
      <Header />
      <Card
        className='w-[300px]'
      >
        <CardHeader>
          {
            data.date ?
              <div className="flex items-center justify-between">
                {format(data.date, 'MMMM dd, yyyy')}
              </div>
              :
              <div className="flex items-center justify-between">
                <span className="text-red-500">No RSVP data available</span>
              </div>
          }
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span>Lunch</span>
              <span>{data.lunch ? "Lunch at 1.30PM-2:30PM" : 'No lunch RSVP'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Dinner</span>
              <span>{data.dinner ? "Dinner | 8PM-9PM" : 'No dinner RSVP'}</span>
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
