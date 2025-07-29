"use client"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

interface SimpleDateInputProps {
  name?: string
  id?: string
  className?: string
  placeholder?: string
  minDate?: string
  maxDate?: string
  required?: boolean
  defaultValue?: string
}

export function SimpleDateInput({
  name,
  id,
  className,
  placeholder,
  minDate,
  maxDate,
  required = false,
  defaultValue,
}: SimpleDateInputProps) {
  const [today, setToday] = useState("")
  const [maxDateDefault, setMaxDateDefault] = useState("")

  useEffect(() => {
    // Calculate dates on client side to avoid hydration mismatch
    const todayDate = new Date().toISOString().split("T")[0]
    const maxYear = new Date().getFullYear() + 10
    const maxDateValue = `${maxYear}-12-31`
    
    setToday(todayDate)
    setMaxDateDefault(maxDateValue)
  }, [])

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type="date"
        className={cn("bg-white text-black border-gray-700 pr-10", className)}
        placeholder={placeholder}
        min={minDate || today}
        max={maxDate || maxDateDefault}
        required={required}
        defaultValue={defaultValue}
      />
      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  )
}
