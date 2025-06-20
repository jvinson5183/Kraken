"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "./button";
import { cn } from "./utils";

function Checkbox({
  className,
  checked,
  onCheckedChange,
  disabled,
  ...props
}: {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
} & React.ComponentProps<"button">) {
  return (
    <Button
      type="button"
      size="sm"
      variant={checked ? "default" : "outline"}
      className={cn(
        "w-6 h-6 p-0 shrink-0 rounded-[4px] border",
        checked 
          ? "bg-purple-600 hover:bg-purple-700 border-purple-600" 
          : "border-gray-600 hover:bg-gray-800",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      disabled={disabled}
      {...props}
    >
      {checked && <Check className="w-4 h-4" />}
    </Button>
  );
}

export { Checkbox };
