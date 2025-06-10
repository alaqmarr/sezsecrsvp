import AllRSVP from '@/components/AllRSVP';
import Header from '@/components/Header';
import MarkRSVP from '@/components/MarkRSVP';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';

const Page = async () => {
  let data = null;
  let fetchError = '';

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/get/home`, {
      cache: 'no-store',
      next: { revalidate: 0 }, // ensures fresh data each time
    });

    if (!res.ok) {
      throw new Error('Failed to fetch RSVP data');
    }

    data = await res.json();
  } catch (error: any) {
    fetchError = error?.message || 'Failed to fetch RSVP data';
  }

  if (fetchError) {
    return <div className="text-red-500">{fetchError}</div>;
  }

  if (!data) {
    return <div className="text-red-500">No RSVP data available</div>;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Header />

      <Card className="w-[300px] mt-6">
        <CardHeader>
          {data.date ? (
            <div className="flex items-center justify-between">
              <span>{format(new Date(data.date), 'MMMM dd, yyyy')}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-red-500">No RSVP date available</span>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span>Lunch</span>
              <span>{data.lunch ? "1:30PM - 2:30PM" : "No lunch RSVP"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Dinner</span>
              <span>{data.dinner ? "8:00PM - 9:00PM" : "No dinner RSVP"}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <MarkRSVP rsvpId={data.id} />
        </CardFooter>
      </Card>

      <AllRSVP/>
    </div>
  );
};

export default Page;
