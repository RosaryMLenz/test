
import React, { Dispatch, SetStateAction, useState } from "react";
import { BookingFormData } from "./BookingModal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
}

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
const maxWeeksAhead = 12; // ~3 months

export default function Step4({ formData, setFormData }: StepProps) {
    const today = dayjs();
    const [weekOffset, setWeekOffset] = useState(0);
    const [selectedDate, setSelectedDate] = useState<string | null>(formData.date || null);
    const [selectedTime, setSelectedTime] = useState<string | null>(formData.time || null);

    const startOfWeek = today.add(weekOffset, "week").startOf("week");

    const handleDateSelect = (date: dayjs.Dayjs) => {
        if (date.isBefore(today, "day") || date.day() === 0) return; // disable past and Sundays
        const dateStr = date.format("YYYY-MM-DD");
        setSelectedDate(dateStr);
        setFormData((prev) => ({ ...prev, date: dateStr }));
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setFormData((prev) => ({ ...prev, time }));
    };

    const generateTimeSlots = (date: string | null) => {
        if (!date) return [];
        const d = dayjs(date);
        const slots = [];
        if (d.day() >= 1 && d.day() <= 5) {
            // Mon-Fri 9am-6pm
            for (let hour = 9; hour < 18; hour++) {
                slots.push(dayjs().hour(hour).minute(0).format("h:mm A"));
                slots.push(dayjs().hour(hour).minute(30).format("h:mm A"));
            }
        } else if (d.day() === 6) {
            // Sat 9am-12pm
            for (let hour = 9; hour < 12; hour++) {
                slots.push(dayjs().hour(hour).minute(0).format("h:mm A"));
                slots.push(dayjs().hour(hour).minute(30).format("h:mm A"));
            }
        }
        return slots;
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-neutral-900">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                    Step 4: Select Appointment Date & Time
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                    Choose a convenient day and time for your appointment.
                </p>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-4 mb-2">
                    <button
                        onClick={() => weekOffset > 0 && setWeekOffset(weekOffset - 1)}
                        disabled={weekOffset === 0}
                        className={cn(
                            "p-2 rounded hover:bg-gray-200 dark:hover:bg-neutral-800 transition",
                            weekOffset === 0 && "opacity-30 cursor-not-allowed"
                        )}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                        {startOfWeek.format("MMMM YYYY")}
                    </span>
                    <button
                        onClick={() => weekOffset < maxWeeksAhead && setWeekOffset(weekOffset + 1)}
                        disabled={weekOffset === maxWeeksAhead}
                        className={cn(
                            "p-2 rounded hover:bg-gray-200 dark:hover:bg-neutral-800 transition",
                            weekOffset === maxWeeksAhead && "opacity-30 cursor-not-allowed"
                        )}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {daysOfWeek.map((d, idx) => (
                        <div key={`${d}-${idx}`} className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {d}
                        </div>
                    ))}

                </div>

                {/* Dates */}
                <div className="grid grid-cols-7 gap-1 text-center mb-3">
                    {Array.from({ length: 7 }).map((_, idx) => {
                        const date = startOfWeek.add(idx, "day");
                        const isPast = date.isBefore(today, "day");
                        const isSunday = date.day() === 0;
                        const isSelected = selectedDate === date.format("YYYY-MM-DD");

                        return (
                            <div
                                key={date.toString()}
                                onClick={() => handleDateSelect(date)}
                                className={cn(
                                    "p-2 rounded cursor-pointer text-sm transition",
                                    isPast || isSunday
                                        ? "line-through text-gray-400 cursor-not-allowed"
                                        : "hover:bg-gray-200 dark:hover:bg-neutral-800",
                                    isSelected && "bg-blue-500 text-white hover:bg-blue-600"
                                )}
                            >
                                {date.date()}
                            </div>
                        );
                    })}
                </div>

                <div className="border-t border-gray-300 dark:border-neutral-700 mb-4"></div>

                {/* Time Slots */}
                {selectedDate ? (
                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                        {generateTimeSlots(selectedDate).map((time) => (
                            <div
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                className={cn(
                                    "p-2 text-center rounded cursor-pointer text-sm transition",
                                    selectedTime === time
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700"
                                )}
                            >
                                {time}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        Please select a date to see available times.
                    </p>
                )}
            </div>
        </div>
    );
}
