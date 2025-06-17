'use client'
import React, { useEffect, useState } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Calendar } from './ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { deviceId } from '@/lib/device'
import { Card, CardContent } from './ui/card'



const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    number: z.string().min(10, "Mobile number must be at least 10 digits").max(10, "Mobile number must be at most 10 digits"),
    field: z.string().min(1, "Field is required"),
    deviceId: z.string().optional(), // Optional deviceId field
    lunch: z.boolean(),
    dinner: z.boolean()
})
const MarkRSVP = ({ rsvpId }: { rsvpId: string }) => {
    const [lunchAllowed, setLunchAllowed] = useState(true)
    const [dinnerAllowed, setDinnerAllowed] = useState(true)

    // Set cut-off times for lunch and dinner
    //Lunch is 12:00PM and Dinner is 5:00PM



    const [processing, setProcessing] = useState(false)

    const device = deviceId();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            number: "",
            field: "",
            deviceId: device || undefined,
            lunch: false,
            dinner: false,
        },
    })

    useEffect(() => {
        const checkRSVPDetails = async () => {
            try {
                const { data, status } = await axios.get(`/api/v1/get/home`);

                if (status === 200) {
                    const now = new Date();
                    const lunchCutoff = new Date(data.date);
                    lunchCutoff.setHours(12, 0, 0, 0); // Set to 12:00 PM
                    const dinnerCutoff = new Date(data.date);
                    dinnerCutoff.setHours(15, 0, 0, 0); // Set to 5:00 PM

                    if (data.bypassTimes) {
                        setLunchAllowed(true);
                        setDinnerAllowed(true);
                    } else {
                        const lunch = data.lunch && now <= lunchCutoff;
                        const dinner = data.dinner && now <= dinnerCutoff;
                        setLunchAllowed(lunch);
                        setDinnerAllowed(dinner);
                    }
                } else {
                    toast.error("Failed to fetch RSVP details");
                }
            } catch (error: any) {
                toast.error(error.message || "An error occurred while fetching RSVP details");
                console.error("Error fetching RSVP details:", error);
            }
        };

        checkRSVPDetails();
    }, [rsvpId]);


    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setProcessing(true)
            const response = await axios.post(`/api/v1/post/rsvp/${rsvpId}`, values)
            if (response.status === 200) {
                toast.success("RSVP marked successfully!")
                form.reset()
                setProcessing(false)
            } else {
                toast.error("Failed to mark RSVP")
                setProcessing(false)
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred while marking RSVP")
            console.error("Error marking RSVP:", error)
            setProcessing(false)
        }
    }
    return (
        <div
            className='p-4 flex flex-col items-center justify-center w-full'
        >
            <Drawer>
                <DrawerTrigger>
                    <Button variant="default" className="w-[100px] cursor-pointer">
                        Fill RSVP
                    </Button>

                </DrawerTrigger>
                <DrawerContent
                    className='flex flex-col items-center justify-center mb-4'
                >
                    <DrawerHeader>
                        <DrawerDescription
                            className='text-xs'
                        >
                            {deviceId() ? `Device ID: ${deviceId()}` : "No Device ID found"}
                        </DrawerDescription>
                    </DrawerHeader>
                    <Card>
                        <CardContent>
                            <Form {...form}
                            >
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-[300px]">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ABC XYZ" {...field} className='bg-green-100' />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="number"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mobile Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="WhatsApp Number" {...field} className='bg-green-100' maxLength={10} minLength={10} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="field"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Team</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger

                                                            className='w-full bg-green-100'>
                                                            <SelectValue placeholder="Select your team" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Relay Center Management">Relay Center Management</SelectItem>
                                                        <SelectItem value="C and F">C&F</SelectItem>
                                                        <SelectItem value="ITS and AVR">ITS & AVR</SelectItem>
                                                        <SelectItem value="HR">HR</SelectItem>
                                                        <SelectItem value="Mawaid">Mawaid</SelectItem>
                                                        <SelectItem value="Public Relations">Public Relations</SelectItem>
                                                        <SelectItem value="Tazyeen">Tazyeen</SelectItem>
                                                        <SelectItem value="Finance">Finance</SelectItem>
                                                        <SelectItem value="Flow Management">Flow Management</SelectItem>
                                                        <SelectItem value="Nazafat">Nazafat</SelectItem>
                                                        <SelectItem value="Fire Safety">Fire Safety</SelectItem>

                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lunch"
                                        render={({ field }) => (
                                            <FormItem className={`space-y-3 ${!lunchAllowed ? 'hidden' : ''}`}>
                                                <FormLabel>Lunch</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={(value) => field.onChange(value === "true")}
                                                        value={field.value ? "true" : "false"}
                                                        className="flex flex-row space-x-4"
                                                        disabled={!lunchAllowed}
                                                    >
                                                        <FormItem className="flex items-center gap-3 bg-green-300 p-2 rounded-full">
                                                            <FormControl>
                                                                <RadioGroupItem value="true" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Yes
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center gap-3 bg-red-300 p-2 rounded-full">
                                                            <FormControl>
                                                                <RadioGroupItem value="false" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                No
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                                {!lunchAllowed && (
                                                    <p className="text-red-500 text-xs font-bold">
                                                        Lunch RSVP is closed.
                                                    </p>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dinner"
                                        render={({ field }) => (
                                            <FormItem className={`space-y-3 ${!dinnerAllowed ? 'hidden' : ''}`}>
                                                <FormLabel>Dinner</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={(value) => field.onChange(value === "true")}
                                                        value={field.value ? "true" : "false"}
                                                        className="flex flex-row space-x-4"
                                                        disabled={!dinnerAllowed}
                                                    >
                                                        <FormItem className="flex items-center gap-3 bg-green-300 p-2 rounded-full">
                                                            <FormControl>
                                                                <RadioGroupItem value="true" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Yes
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center gap-3 bg-red-300 p-2 rounded-full">
                                                            <FormControl>
                                                                <RadioGroupItem value="false" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                No
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                                {!dinnerAllowed && (
                                                    <p className="text-red-500 text-xs font-bold">
                                                        Dinner RSVP is closed.
                                                    </p>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                    {
                                        processing ? (
                                            <p

                                                className='text-center text-red-500 font-semibold'>
                                                Processing...
                                            </p>
                                        )
                                            :
                                            <Button type="submit" className='w-full mt-4'>Submit</Button>
                                    }
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default MarkRSVP
