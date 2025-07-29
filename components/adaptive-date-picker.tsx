"use client"

import * as React from "react"
import { EnhancedDatePicker } from "./enhanced-date-picker"
import { FallbackDateInput } from "./fallback-date-input"

interface AdaptiveDatePickerProps {
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

export function AdaptiveDatePicker(props: AdaptiveDatePickerProps) {
  const [useNative, setUseNative] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    
    // Use a timeout to ensure we're fully hydrated
    const timer = setTimeout(() => {
      // Detect if we should use native date input
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isTouch = "ontouchstart" in window
      const hasNativeDateSupport = (() => {
        const input = document.createElement("input")
        input.type = "date"
        return input.type === "date"
      })()

      // Use native on mobile or if custom picker fails
      setUseNative(isMobile || isTouch || !hasNativeDateSupport)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  // Fallback to native if custom picker has issues
  const handleError = React.useCallback(() => {
    setUseNative(true)
  }, [])

  // During SSR and initial hydration, always use fallback to avoid hydration mismatch
  if (!mounted) {
    return <FallbackDateInput {...props} />
  }

  if (useNative) {
    return <FallbackDateInput {...props} />
  }

  return (
    <React.Suspense fallback={<FallbackDateInput {...props} />}>
      <EnhancedDatePicker {...props} />
    </React.Suspense>
  )
}
