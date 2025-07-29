"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface FallbackDateInputProps {
  name?: string
  id?: string
  className?: string
  placeholder?: string
  minDate?: string
  maxDate?: string
  required?: boolean
  defaultValue?: string
  onChange?: (date: string) => void
}

export function FallbackDateInput({
  name,
  id,
  className,
  placeholder,
  minDate,
  maxDate,
  required = false,
  defaultValue,
  onChange,
}: FallbackDateInputProps) {
  const [value, setValue] = React.useState(defaultValue || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onChange?.(newValue)
  }

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type="date"
        value={value}
        onChange={handleChange}
        className={cn("bg-white text-black border-gray-700 pr-10", className)}
        placeholder={placeholder}
        min={minDate}
        max={maxDate}
        required={required}
      />
      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  )
}
