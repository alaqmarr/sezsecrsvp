'use client'
import React, { useState } from 'react'
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
    number: z.string().min(1, "Number is required"),
    field: z.string().min(1, "Field is required"),
    deviceId: z.string().optional(), // Optional deviceId field
    lunch: z.boolean(),
    dinner: z.boolean()
})
const MarkRSVP = ({ rsvpId }: { rsvpId: string }) => {

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

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setProcessing(true)
            const response = await axios.post(`/api/v1/post/rsvp/${rsvpId}`, values)
            if (response.status === 200) {
                toast.success("RSVP created successfully!")
                form.reset()
                setProcessing(false)
            } else {
                toast.error("Failed to create RSVP")
                setProcessing(false)
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred while creating RSVP")
            console.error("Error creating RSVP:", error)
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
                        Mark RSVP
                    </Button>

                </DrawerTrigger>
                <DrawerContent
                    className='flex flex-col items-center justify-center mb-4'
                >
                    <DrawerHeader>
                        <DrawerTitle>Mark RSVP</DrawerTitle>
                        <DrawerDescription>
                            {deviceId() ? `Device ID: ${deviceId()}` : "No Device ID found"}
                        </DrawerDescription>
                    </DrawerHeader>
                    <Card>
                        <CardContent>
                            <Form {...form}
                            >
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[300px]">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Al Aqmar Kanchwala" {...field} className='bg-green-100' />
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
                                                    <Input placeholder="9632587410" {...field} className='bg-green-100' />
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
                                            <FormItem className="space-y-3">
                                                <FormLabel>Lunch</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={(value) => field.onChange(value === "true")}
                                                        value={field.value ? "true" : "false"}
                                                        className="flex flex-row space-x-4"
                                                    >
                                                        <FormItem className="flex items-center gap-3">
                                                            <FormControl>
                                                                <RadioGroupItem value="true" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Yes
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center gap-3">
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
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dinner"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Dinner</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={(value) => field.onChange(value === "true")}
                                                        value={field.value ? "true" : "false"}
                                                        className="flex flex-row space-x-4"
                                                    >
                                                        <FormItem className="flex items-center gap-3">
                                                            <FormControl>
                                                                <RadioGroupItem value="true" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Yes
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center gap-3">
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
                                            <Button type="submit" className='w-full'>Submit</Button>
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
