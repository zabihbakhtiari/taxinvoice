"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function GetQuoteForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log("Form submitted:", data)
    alert("Quote request submitted! (Check console for data)")
    // In a real application, you would send this data to a backend
    // For example, using fetch:
    // fetch('/api/send-quote', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // })
    // .then(response => response.json())
    // .then(result => console.log(result))
    // .catch(error => console.error('Error:', error));
  }

  return (
    <div className="w-full max-w-md bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Get Instant Quote</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-gray-300">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your Name"
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your Email"
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-gray-300">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Your Phone Number"
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <div>
          <Label htmlFor="suburb" className="text-gray-300">
            Suburb
          </Label>
          <Input
            id="suburb"
            name="suburb"
            type="text"
            placeholder="Your Suburb"
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <div>
          <Label htmlFor="make" className="text-gray-300">
            Make
          </Label>
          <Input
            id="make"
            name="make"
            type="text"
            placeholder="Car Make"
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <div>
          <Label htmlFor="model" className="text-gray-300">
            Model
          </Label>
          <Input
            id="model"
            name="model"
            type="text"
            placeholder="Car Model"
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <div>
          <Label htmlFor="year" className="text-gray-300">
            Year
          </Label>
          <Input
            id="year"
            name="year"
            type="number"
            placeholder="Car Year"
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <div>
          <Label htmlFor="condition" className="text-gray-300">
            Condition
          </Label>
          <Textarea
            id="condition"
            name="condition"
            placeholder="Describe car condition"
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Get Instant Quote
        </Button>
      </form>
    </div>
  )
}
