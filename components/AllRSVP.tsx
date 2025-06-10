'use client';

import { deviceId } from '@/lib/device';
import React, { useEffect } from 'react';

const AllRSVP = () => {
  const device = deviceId();
  const [data, setData] = React.useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/v1/get/allrsvp?device=${device}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch RSVPs:', error);
      }
    };

    fetchData();
  }, [device]);

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Your RSVP Records</h1>

      {data.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data.map((rsvp) => (
            <div
              key={rsvp.id}
              className="p-6 border rounded-xl shadow-sm hover:shadow-md transition bg-white space-y-2"
            >
              <h3 className="text-lg font-bold text-gray-800">{rsvp.name}</h3>

              <div className="text-sm text-gray-600">
                <p><span className="font-medium">Field:</span> {rsvp.field}</p>
                <p><span className="font-medium">Number:</span> {rsvp.number}</p>
                <p><span className="font-medium">Lunch:</span> {rsvp.lunch ? '✅ Yes' : '❌ No'}</p>
                <p><span className="font-medium">Dinner:</span> {rsvp.dinner ? '✅ Yes' : '❌ No'}</p>
                <p><span className="font-medium">Date:</span> {new Date(rsvp.rsvpDay.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No RSVPs found for this device.</p>
      )}
    </div>
  );
};

export default AllRSVP;
