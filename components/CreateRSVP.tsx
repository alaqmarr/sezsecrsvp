'use client'
import React from 'react'
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



const formSchema = z.object({
    date: z.date(),
    lunch: z.boolean(),
    dinner: z.boolean(),
})
const CreateRSVP = () => {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date(),
            lunch: false,
            dinner: false,
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await axios.post("/api/v1/post/rsvp", values)
            if (response.status === 200) {
                toast.success("RSVP created successfully!")
                form.reset()
            } else {
                toast.error("Failed to create RSVP")
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred while creating RSVP")
            console.error("Error creating RSVP:", error)
        }
    }
    return (
        <div>
            <Drawer>
                <DrawerTrigger>
                    <Button variant="default" className="w-[120px] cursor-pointer">
                        Create RSVP
                    </Button>

                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Create RSVP</DrawerTitle>
                    </DrawerHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date of birth</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value as Date, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date()
                                                    }
                                                    captionLayout="dropdown"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Your date of birth is used to calculate your age.
                                        </FormDescription>
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
                                                className="flex flex-col"
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
                                                className="flex flex-col"
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
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default CreateRSVP
