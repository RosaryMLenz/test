
import React, { Dispatch, SetStateAction } from 'react';
import { BookingFormData } from './BookingModal';
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface StepProps {
    formData: BookingFormData;
    setFormData: Dispatch<SetStateAction<BookingFormData>>;
    onNext: () => void;
}

export default function Step1({ formData, setFormData }: StepProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-neutral-900">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                    Book Your Appointment
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                    Start by providing your details so we can confirm your booking.
                </p>

                <div className="my-8">
                    <div className="mb-4 flex flex-col space-y-4">
                        <LabelInputContainer>
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                required
                            />
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                placeholder="you@example.com"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        email: e.target.value,
                                    }))
                                }
                                required
                            />
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                placeholder="+1 702 555 1234"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        phone: e.target.value,
                                    }))
                                }
                                required
                            />
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                By providing your phone number, you agree to receive SMS updates regarding your appointment. Message and data rates may apply. Reply STOP to opt out.
                            </p>
                        </LabelInputContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

const LabelInputContainer = ({
                                 children,
                                 className,
                             }: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
        {children}
    </div>
);
