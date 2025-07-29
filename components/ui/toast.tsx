"use client"

import * as React from "react"
import { ToastProvider } from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Toast = ToastProvider

const toastVariants = cva(
  "group-data-[swipe=cancel]:translate-x-0 group-data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] group-data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] group-data-[swipe=move]:transition-none group-data-[state=open]:animate-in group-data-[state=closed]:animate-out group-data-[swipe=end]:animate-out group-data-[state=closed]:fade-out-80 group-data-[state=open]:slide-in-from-top-full group-data-[state=open]:sm:slide-in-from-bottom-full group-data-[state=closed]:slide-out-to-right-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const ToastViewport = React.forwardRef<React.ElementRef<typeof Toast>, React.ComponentPropsWithoutRef<typeof Toast>>(
  ({ className, ...props }, ref) => (
    <Toast.Viewport
      ref={ref}
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className,
      )}
      {...props}
    />
  ),
)
ToastViewport.displayName = Toast.Viewport.displayName

const ToastContainer = React.forwardRef<
  React.ElementRef<typeof Toast>,
  React.ComponentPropsWithoutRef<typeof Toast> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <Toast.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
))
ToastContainer.displayName = ToastContainer.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof Toast.Title>,
  React.ComponentPropsWithoutRef<typeof Toast.Title>
>(({ className, ...props }, ref) => (
  <Toast.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
))
ToastTitle.displayName = Toast.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof Toast.Description>,
  React.ComponentPropsWithoutRef<typeof Toast.Description>
>(({ className, ...props }, ref) => (
  <Toast.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
))
ToastDescription.displayName = Toast.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof ToastContainer>

type ToastActionElement = React.ElementRef<typeof Toast.Action>

export { Toast, ToastViewport, ToastContainer, ToastTitle, ToastDescription, type ToastProps, type ToastActionElement }
