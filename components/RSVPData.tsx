import { RSVP } from '@/app/prisma';
import prisma from '@/lib/db';
import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { Button } from './ui/button';

export const revalidate = 1;// Revalidate every 60 seconds
const RSVPData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/get/data`, {
        cache: 'no-store', // Disable caching for fresh data
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
                    const lunchCount = rsvp.rsvps?.filter((r: RSVP) => r.lunch).length || 0;
                    const dinnerCount = rsvp.rsvps?.filter((r: RSVP) => r.dinner).length || 0;

                    return (
                        <Card key={rsvp.id} className="shadow-md hover:shadow-lg transition duration-300">
                            <CardHeader>
                                <h2 className="text-lg font-medium text-gray-700">
                                    {format(new Date(rsvp.date), 'MMMM dd, yyyy')}
                                </h2>
                            </CardHeader>

                            <CardContent className="space-y-2 text-gray-600">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Lunch:</span>
                                    <span>{lunchCount} attending</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Dinner:</span>
                                    <span>{dinnerCount} attending</span>
                                </div>
                                <div>
                                    <Drawer>
                                        <DrawerTrigger>
                                            <Button variant="secondary" className="w-full mt-4">
                                                View Attendees
                                            </Button>
                                        </DrawerTrigger>
                                        <DrawerContent
                                            className='h-[400px] flex flex-col items-center justify-center'
                                        >
                                            <DrawerHeader>
                                                <DrawerTitle>Attendees</DrawerTitle>
                                            </DrawerHeader>
                                            <div
                                                className='flex flex-col items-center justify-center'
                                            >
                                                <Table
                                                    className='w-fit'
                                                >
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className='w-fit'>S No</TableHead>
                                                            <TableHead>Name</TableHead>
                                                            <TableHead>Lunch</TableHead>
                                                            <TableHead>Dinner</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {
                                                            rsvp.rsvps?.map((r: RSVP, index: number) => (
                                                                <TableRow key={r.id}>
                                                                    <TableCell className="font-medium w-fit">{index + 1}</TableCell>
                                                                    <TableCell>{r.name}</TableCell>
                                                                    <TableCell>{r.lunch ? 'Yes' : 'No'}</TableCell>
                                                                    <TableCell>{r.dinner ? 'Yes' : 'No'}</TableCell>
                                                                </TableRow>
                                                            ))
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            <DrawerFooter>
                                                <DrawerClose>
                                                    <Button variant="outline">Close</Button>
                                                </DrawerClose>
                                            </DrawerFooter>
                                        </DrawerContent>
                                    </Drawer>
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
