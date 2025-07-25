"use client"

import type React from "react"
import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react"
import { cn } from "@/lib/utils"

interface SignaturePadProps extends React.HTMLAttributes<HTMLCanvasElement> {
  width?: number
  height?: number
}

const SignaturePad = forwardRef<{ getSignature: () => string | null; clear: () => void }, SignaturePadProps>(
  ({ width = 600, height = 200, className, ...props }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const isDrawing = useRef(false)
    const lastPoint = useRef<{ x: number; y: number } | null>(null)

    const getCanvasContext = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return null
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.strokeStyle = "black"
      }
      return ctx
    }, [])

    const clear = useCallback(() => {
      const ctx = getCanvasContext()
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      }
    }, [getCanvasContext])

    const getSignature = useCallback(() => {
      const canvas = canvasRef.current
      if (canvas && !isCanvasEmpty(canvas)) {
        return canvas.toDataURL("image/png")
      }
      return null
    }, [])

    useImperativeHandle(ref, () => ({
      getSignature,
      clear,
    }))

    const isCanvasEmpty = (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return true
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < imageData.data.length; i++) {
        if (imageData.data[i] !== 0) return false
      }
      return true
    }

    const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      isDrawing.current = true
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      let clientX, clientY

      if ("touches" in e) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      lastPoint.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      }
    }, [])

    const draw = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing.current) return
        const ctx = getCanvasContext()
        const canvas = canvasRef.current
        if (!ctx || !canvas || !lastPoint.current) return

        const rect = canvas.getBoundingClientRect()
        let clientX, clientY

        if ("touches" in e) {
          clientX = e.touches[0].clientX
          clientY = e.touches[0].clientY
        } else {
          clientX = e.clientX
          clientY = e.clientY
        }

        const currentPoint = {
          x: clientX - rect.left,
          y: clientY - rect.top,
        }

        ctx.beginPath()
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
        ctx.lineTo(currentPoint.x, currentPoint.y)
        ctx.stroke()
        lastPoint.current = currentPoint
      },
      [getCanvasContext],
    )

    const stopDrawing = useCallback(() => {
      isDrawing.current = false
      lastPoint.current = null
    }, [])

    useEffect(() => {
      const canvas = canvasRef.current
      if (canvas) {
        // Set canvas resolution for clear drawing
        const dpr = window.devicePixelRatio || 1
        canvas.width = width * dpr
        canvas.height = height * dpr
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.scale(dpr, dpr)
        }

        // Add event listeners
        canvas.addEventListener("mousedown", startDrawing as EventListener)
        canvas.addEventListener("mousemove", draw as EventListener)
        canvas.addEventListener("mouseup", stopDrawing as EventListener)
        canvas.addEventListener("mouseleave", stopDrawing as EventListener)

        canvas.addEventListener("touchstart", startDrawing as EventListener, { passive: true })
        canvas.addEventListener("touchmove", draw as EventListener, { passive: true })
        canvas.addEventListener("touchend", stopDrawing as EventListener)
        canvas.addEventListener("touchcancel", stopDrawing as EventListener)

        return () => {
          canvas.removeEventListener("mousedown", startDrawing as EventListener)
          canvas.removeEventListener("mousemove", draw as EventListener)
          canvas.removeEventListener("mouseup", stopDrawing as EventListener)
          canvas.removeEventListener("mouseleave", stopDrawing as EventListener)

          canvas.removeEventListener("touchstart", startDrawing as EventListener)
          canvas.removeEventListener("touchmove", draw as EventListener)
          canvas.removeEventListener("touchend", stopDrawing as EventListener)
          canvas.removeEventListener("touchcancel", stopDrawing as EventListener)
        }
      }
    }, [width, height, startDrawing, draw, stopDrawing])

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={cn("border border-input bg-background rounded-md", className)}
        {...props}
      />
    )
  },
)

SignaturePad.displayName = "SignaturePad"

export default SignaturePad
