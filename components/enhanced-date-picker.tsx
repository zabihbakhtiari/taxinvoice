"use client"

import * as React from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface EnhancedDatePickerProps {
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

export function EnhancedDatePicker({
  name,
  id,
  className,
  placeholder = "Select date",
  minDate,
  maxDate,
  required = false,
  defaultValue,
  onChange,
}: EnhancedDatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<string>(defaultValue || "")
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState<Date | null>(null)
  const [inputValue, setInputValue] = React.useState("")

  // Initialize currentMonth on client side to avoid hydration mismatch
  React.useEffect(() => {
    setCurrentMonth(new Date())
  }, [])

  // Initialize input value from selected date
  React.useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate)
      setInputValue(date.toLocaleDateString("en-AU"))
    }
  }, [selectedDate])

  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString)
    onChange?.(dateString)
    setIsOpen(false)

    // Update input display
    const date = new Date(dateString)
    setInputValue(date.toLocaleDateString("en-AU"))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Try to parse the input as a date
    const parsedDate = new Date(value)
    if (!isNaN(parsedDate.getTime())) {
      const dateString = parsedDate.toISOString().split("T")[0]
      setSelectedDate(dateString)
      onChange?.(dateString)
    }
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth?.getFullYear() || new Date().getFullYear()
    const month = currentMonth?.getMonth() || new Date().getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const today = new Date()
    const minDateObj = minDate ? new Date(minDate) : null
    const maxDateObj = maxDate ? new Date(maxDate) : null

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const isCurrentMonth = date.getMonth() === month
      const isToday = date.toDateString() === today.toDateString()
      const isSelected = selectedDate === date.toISOString().split("T")[0]
      const isDisabled = Boolean((minDateObj && date < minDateObj) || (maxDateObj && date > maxDateObj))

      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled,
        dateString: date.toISOString().split("T")[0],
      })
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev || new Date())
      if (direction === "prev") {
        newMonth.setMonth(prev?.getMonth() || new Date().getMonth() - 1)
      } else {
        newMonth.setMonth(prev?.getMonth() || new Date().getMonth() + 1)
      }
      return newMonth
    })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Only generate days if currentMonth is available to avoid hydration issues
  const days = currentMonth ? generateCalendarDays() : []

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id={id}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder={placeholder}
              className={cn("bg-white text-black border-gray-700 pr-10", className)}
              autoComplete="off"
            />
            <CalendarIcon
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-white border border-gray-300" align="start">
          <div className="p-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold text-black">
                {monthNames[currentMonth?.getMonth() || new Date().getMonth()]} {currentMonth?.getFullYear() || new Date().getFullYear()}
              </h3>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => !day.isDisabled && handleDateSelect(day.dateString)}
                  disabled={day.isDisabled}
                  className={cn(
                    "h-8 w-8 p-0 text-sm",
                    !day.isCurrentMonth && "text-gray-300",
                    day.isToday && "bg-blue-100 text-blue-600",
                    day.isSelected && "bg-blue-600 text-white hover:bg-blue-700",
                    day.isDisabled && "opacity-30 cursor-not-allowed",
                  )}
                >
                  {day.day}
                </Button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0]
                  handleDateSelect(today)
                }}
                className="text-xs"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDate("")
                  setInputValue("")
                  onChange?.("")
                  setIsOpen(false)
                }}
                className="text-xs"
              >
                Clear
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={selectedDate} />
    </div>
  )
}
