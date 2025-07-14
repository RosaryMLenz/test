import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  children: React.ReactNode;
}

export const Dialog = ({ children }: DialogProps) => (
  <RadixDialog.Root>{children}</RadixDialog.Root>
);

export const DialogTrigger = RadixDialog.Trigger;

export const DialogContent = ({ children }: DialogProps) => (
  <RadixDialog.Portal>
    <RadixDialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
    <RadixDialog.Content
      className={cn(
        "fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "bg-white dark:bg-neutral-900 p-6 rounded-xl w-full max-w-md shadow-lg"
      )}
    >
      <RadixDialog.Close className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
        <X size={20} />
      </RadixDialog.Close>
      {children}
    </RadixDialog.Content>
  </RadixDialog.Portal>
);
