import { RSVP } from '@/app/prisma';
import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from './ui/drawer';
import { Button } from './ui/button';
import { XIcon } from 'lucide-react';
import { Separator } from './ui/separator';
import { toZonedTime } from 'date-fns-tz';
import { TeamWiseView } from './UmoorWiseRsvp';

export const revalidate = 1;

const RSVPData = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/get/data`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch RSVP data');
  }

  const rsvps = await res.json();

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">RSVP Summary</h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {rsvps.map((rsvp: any) => {
          const uniqueRsvps: RSVP[] = rsvp.rsvps?.filter(
            (r: RSVP, index: number, self: RSVP[]) =>
              self.findIndex(
                (x: RSVP) =>
                  x.name.trim().toLowerCase() === r.name.trim().toLowerCase() &&
                  x.number.trim() === r.number.trim()
              ) === index
          ) || [];

          const lunchCount = uniqueRsvps.filter((r) => r.lunch).length;
          const dinnerCount = uniqueRsvps.filter((r) => r.dinner).length;
          const lunchthaal = lunchCount / 8;
          const dinnerthaal = dinnerCount / 8;

          return (
            <Card key={rsvp.id} className="shadow-md hover:shadow-lg transition duration-300">
              <CardHeader className='h-[20px]'>
                <h2 className="text-lg font-medium text-gray-700">
                  {format(toZonedTime(new Date(rsvp.date), 'Asia/Kolkata'), 'PPP')}
                </h2>
              </CardHeader>
              <Separator />

              <CardContent className="space-y-2 text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Lunch:</span>
                  <span>{lunchCount} attending | {lunchthaal} Thaals</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Dinner:</span>
                  <span>{dinnerCount} attending | {dinnerthaal} Thaals</span>
                </div>
                <Separator />
                <div className='flex items-center justify-center w-full gap-2 mt-4'>
                  <Drawer>
                    <DrawerTrigger>
                      <Button variant="secondary" className="w-fit cursor-pointer">
                        View Attendees
                      </Button>
                    </DrawerTrigger>

                    <DrawerContent className="h-[500px] flex flex-col p-4">
                      <DrawerHeader>
                        <DrawerTitle>Summary</DrawerTitle>
                      </DrawerHeader>

                      <div className="flex-1 overflow-y-auto mt-2">
                        <Table className="min-w-[500px] w-full">
                          <TableHeader>
                            <TableRow>
                              <TableHead>S No</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Team</TableHead>
                              <TableHead>Lunch</TableHead>
                              <TableHead>Dinner</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {uniqueRsvps.map((r: RSVP, index: number) => (
                              <TableRow key={r.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{r.name}</TableCell>
                                <TableCell>{r.field || '-'}</TableCell>
                                <TableCell>{r.lunch ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{r.dinner ? 'Yes' : 'No'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <DrawerFooter className="mt-2">
                        <DrawerClose>
                          <Button variant="destructive" className="w-fit flex items-center gap-1">
                            <XIcon className="w-4 h-4" /> <span>Close</span>
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>

                  <TeamWiseView rsvps={uniqueRsvps} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RSVPData;