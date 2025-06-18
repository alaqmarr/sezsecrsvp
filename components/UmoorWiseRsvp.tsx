"use client"

import { RSVP } from '@/app/prisma';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TeamWiseViewProps {
  rsvps: RSVP[];
}

export const TeamWiseView = ({ rsvps }: TeamWiseViewProps) => {
  // Filter unique entries by name + number
  const uniqueRsvps = rsvps?.filter(
    (r, index, self) =>
      self.findIndex(
        (x) =>
          x.name.trim().toLowerCase() === r.name.trim().toLowerCase() &&
          x.number.trim() === r.number.trim()
      ) === index
  ) || [];

  // Check if there are any lunch or dinner attendees
  const hasLunch = uniqueRsvps.some(r => r.lunch);
  const hasDinner = uniqueRsvps.some(r => r.dinner);

  // Group by team
  const teamGroups = uniqueRsvps.reduce((acc: Record<string, RSVP[]>, rsvp) => {
    const team = rsvp.field || 'No Team';
    if (!acc[team]) {
      acc[team] = [];
    }
    acc[team].push(rsvp);
    return acc;
  }, {});

  // Calculate team counts for lunch and dinner
  const teamCounts = Object.entries(teamGroups).map(([team, members]) => {
    const lunchMembers = members.filter(m => m.lunch);
    const dinnerMembers = members.filter(m => m.dinner);
    return {
      team,
      total: members.length,
      lunch: lunchMembers.length,
      dinner: dinnerMembers.length,
      members,
      lunchMembers,
      dinnerMembers
    };
  });

  // Determine grid columns based on which meals exist
  const gridCols = hasLunch && hasDinner ? "grid-cols-3" : 
                   hasLunch || hasDinner ? "grid-cols-2" : "grid-cols-1";

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-fit cursor-pointer">
          Team Wise
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-[500px] flex flex-col p-4">
        <DrawerHeader>
          <DrawerTitle>Team-wise Summary</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto mt-2 space-y-4">
          {teamCounts.map((team) => (
            <div key={team.team} className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">{team.team}</h3>
              <div className={`grid ${gridCols} gap-4`}>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200">
                      <div className="font-medium">Total</div>
                      <div className="text-center text-xl">{team.total}</div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">All Members ({team.total})</h4>
                      <ul className="max-h-60 overflow-y-auto">
                        {team.members.map((member, idx) => (
                          <li key={idx} className="py-1 border-b last:border-0">
                            {member.name}
                            <span className="text-sm text-gray-500 ml-2">
                              {member.lunch && member.dinner ? '(L+D)' :
                                member.lunch ? '(L)' :
                                member.dinner ? '(D)' : ''}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </PopoverContent>
                </Popover>

                {hasLunch && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer p-2 bg-blue-100 rounded hover:bg-blue-200">
                        <div className="font-medium">Lunch</div>
                        <div className="text-center text-xl">{team.lunch}</div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Lunch Members ({team.lunch})</h4>
                        <ul className="max-h-60 overflow-y-auto">
                          {team.lunchMembers.map((member, idx) => (
                            <li key={idx} className="py-1 border-b last:border-0">
                              {member.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {hasDinner && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer p-2 bg-green-100 rounded hover:bg-green-200">
                        <div className="font-medium">Dinner</div>
                        <div className="text-center text-xl">{team.dinner}</div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Dinner Members ({team.dinner})</h4>
                        <ul className="max-h-60 overflow-y-auto">
                          {team.dinnerMembers.map((member, idx) => (
                            <li key={idx} className="py-1 border-b last:border-0">
                              {member.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          ))}
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
  );
};