"use client"

import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

// This is a placeholder action. In a real app, you'd have a server action
// that actually sends an email.
async function sendInviteEmail(prevState: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
  const email = formData.get("email")
  console.log(`Sending invite to: ${email}`)
  return { success: true, message: `Invitation sent to ${email}!` }
}

export default function InviteMemberForm() {
  const [state, formAction, isPending] = useActionState(sendInviteEmail, { success: false, message: "" })

  return (
    <div className="w-full max-w-md bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Invite New Member</h2>
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-gray-300">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="member@example.com"
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {isPending ? "Sending Invite..." : "Send Invitation"}
        </Button>
      </form>
      {state?.message && (
        <p className={`mt-4 text-center ${state.success ? "text-green-400" : "text-red-400"}`}>{state.message}</p>
      )}
    </div>
  )
}
