"use client"

import { useActionState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SignaturePad from "./signature-pad"
import { submitTaxInvoice } from "@/app/actions"
import Image from "next/image"

export default function TaxInvoiceForm() {
  const [state, formAction, isPending] = useActionState(submitTaxInvoice, { success: false, message: "" })
  const signaturePadRef = useRef<{ getSignature: () => string | null; clear: () => void }>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear()
    }
    formRef.current?.reset() // Reset all form fields
  }

  const handleFormSubmit = async (formData: FormData) => {
    const signatureData = signaturePadRef.current?.getSignature()
    if (signatureData) {
      formData.append("customerSignature", signatureData)
    }
    await formAction(formData)
  }

  return (
    <div className="w-full max-w-6xl bg-black text-white p-8 rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-center">TAX INVOICE</h1>
        <div className="flex flex-row items-start justify-between mb-4 w-full">
          <div>
            <Image
              src="/images/vmr-logo.png"
              alt="National Auto Recycling Logo"
              width={150}
              height={50}
              className="mb-2"
            />
            <h2 className="text-3xl font-bold text-left mb-2">National Auto Recycling</h2>
            <p className="text-sm">
              A: Melbourne
            </p>
            <p className="text-sm">
              E: <a href="mailto:info@nationalautorecycling.com.au" className="underline hover:text-blue-400">info@nationalautorecycling.com.au</a>
            </p>
            <p className="text-sm">
              Call Us: <a href="tel:0469322952" className="underline hover:text-blue-400">0469 322 952</a>
            </p>
          </div>
          <Image
            src="/images/google-review.png"
            alt="Review on Google"
            width={150}
            height={50}
            className="ml-8"
          />
        </div>
      </div>

      <form ref={formRef} action={handleFormSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Seller Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Seller Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="seller.firstName">First Name:</Label>
                <Input
                  id="seller.firstName"
                  name="seller.firstName"
                  type="text"
                  className="bg-white text-black border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="seller.surname">Surname:</Label>
                <Input
                  id="seller.surname"
                  name="seller.surname"
                  type="text"
                  className="bg-white text-black border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="seller.address">Address:</Label>
                <Input
                  id="seller.address"
                  name="seller.address"
                  type="text"
                  className="bg-white text-black border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="seller.phone">Phone:</Label>
                <Input
                  id="seller.phone"
                  name="seller.phone"
                  type="text"
                  placeholder="+61"
                  className="bg-white text-black border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="seller.email">Email Address:</Label>
                <Input
                  id="seller.email"
                  name="seller.email"
                  type="email"
                  className="bg-white text-black border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="seller.driverLicenseNo">Driver License No:</Label>
                <Input
                  id="seller.driverLicenseNo"
                  name="seller.driverLicenseNo"
                  type="text"
                  className="bg-white text-black border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="seller.driverName">Driver Name:</Label>
                <Input
                  id="seller.driverName"
                  name="seller.driverName"
                  type="text"
                  className="bg-white text-black border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="seller.truckNumberDetail">Truck Number / Detail:</Label>
                <Input
                  id="seller.truckNumberDetail"
                  name="seller.truckNumberDetail"
                  type="text"
                  className="bg-white text-black border-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Car Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Car Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="car.make">Make</Label>
                  <Input id="car.make" name="car.make" type="text" className="bg-white text-black border-gray-700" />
                </div>
                <div>
                  <Label htmlFor="car.model">Model</Label>
                  <Input id="car.model" name="car.model" type="text" className="bg-white text-black border-gray-700" />
                </div>
              </div>
              <div>
                <Label htmlFor="car.vinNo">VIN No:</Label>
                <Input
                  id="car.vinNo"
                  name="car.vinNo"
                  type="text"
                  maxLength={17}
                  placeholder="17 of 17 max characters"
                  className="bg-white text-black border-gray-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="car.bodyType">Body Type</Label>
                  <Select name="car.bodyType">
                    <SelectTrigger className="w-full bg-white text-black border-gray-700">
                      <SelectValue placeholder="Select Body Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="coupe">Coupe</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="car.year">Select Year</Label>
                  <Select name="car.year">
                    <SelectTrigger className="w-full bg-white text-black border-gray-700">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="car.color">Color</Label>
                  <Input id="car.color" name="car.color" type="text" className="bg-white text-black border-gray-700" />
                </div>
                <div>
                  <Label htmlFor="car.km">Km</Label>
                  <Input id="car.km" name="car.km" type="number" className="bg-white text-black border-gray-700" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="car.regoNo">Rego No.</Label>
                  <Input
                    id="car.regoNo"
                    name="car.regoNo"
                    type="text"
                    className="bg-white text-black border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="car.expires">Expires</Label>
                  <Input
                    id="car.expires"
                    name="car.expires"
                    type="text"
                    placeholder="DD/MM/YYYY"
                    className="bg-white text-black border-gray-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="car.pickupDate">Pickup Date</Label>
                  <Input
                    id="car.pickupDate"
                    name="car.pickupDate"
                    type="date"
                    className="bg-white text-black border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="car.selectTime">Select Time</Label>
                  <Input
                    id="car.selectTime"
                    name="car.selectTime"
                    type="time"
                    className="bg-white text-black border-gray-700"
                  />
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Plate Returned: Y/N</Label>
                <RadioGroup defaultValue="No" name="car.plateReturned" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="plate-yes" className="text-white border-gray-700" />
                    <Label htmlFor="plate-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="plate-no" className="text-white border-gray-700" />
                    <Label htmlFor="plate-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="car.pickupAddress">Pickup Address</Label>
                <Input
                  id="car.pickupAddress"
                  name="car.pickupAddress"
                  type="text"
                  className="bg-white text-black border-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Terms & Conditions (T&C)</h3>
          <p className="text-sm leading-relaxed">
            1. I agree to sell the above vehicle and its accessories to the National Auto Recycling company(s) 2. I
            certify that I have full title to the vehicle and its accessories and there is no money owing to any third
            party concerning the vehicle by way of Lease, Hire Purchase Agreement, Bill for Sale, Personal Loan,
            Promissory note or any other Agreement, the vehicle and accessory are completely unencumbered 3. To the best
            of my knowledge there are no fines or infringements notices outstanding in relation to the vehicle and no
            theft involved. All personal belongings must be removed from the vehicle before it&apos;s towed away 4. All
            the above prices are included G.S.T 5. The car will be disposed of within 24 hours.
          </p>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              name="consent"
              className="border-gray-700 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <Label
              htmlFor="consent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Consent * I confirm that I have read and agree to the National Auto Recycling Terms Agreement. I consent
              to the National Auto Recycling collecting and holding my information. I understand that the information I
              have provided is for the purpose to respond to my inquiry and any future outstanding records.
            </Label>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="noOfUploadedFiles">No. of Uploaded Files</Label>
            <Select name="noOfUploadedFiles">
              <SelectTrigger className="w-[180px] bg-white text-black border-gray-700">
                <SelectValue placeholder="1" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="uploadFile">Upload Your File</Label>
            <div className="flex items-center space-x-2">
              <Button type="button" variant="outline" className="bg-white text-black border-gray-700 hover:bg-gray-100">
                Choose files
              </Button>
              <Input id="uploadFile" name="uploadFile" type="file" className="hidden" />
              <span className="text-sm text-gray-400">No file chosen</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Maximum file size: 10MB.</p>
          </div>
        </div>

        {/* Price and Payment Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Label htmlFor="price">Price $</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="Price $"
              className="bg-white text-black border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="paymentMethod">Select Your Method</Label>
            <Select name="paymentMethod">
              <SelectTrigger className="w-full bg-white text-black border-gray-700">
                <SelectValue placeholder="Select Your Method" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                <SelectItem value="paypal">PAYPAL</SelectItem>
                <SelectItem value="check">CHECK</SelectItem>
                <SelectItem value="bank_transfer">BANK TRANSFER</SelectItem>
                <SelectItem value="cash">CASH</SelectItem>
                <SelectItem value="free">FREE</SelectItem>
                <SelectItem value="eft">EFT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Customer Signature */}
        <div>
          <Label htmlFor="customerSignature">Customer Signature</Label>
          <SignaturePad ref={signaturePadRef} className="bg-white border border-gray-700 rounded-md w-full h-48" />
        </div>

        {/* EFT Bank Transfer */}
        <div>
          <h3 className="text-xl font-semibold mb-4">EFT Bank Transfer</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="eft.acName">A/C Name:</Label>
              <Input id="eft.acName" name="eft.acName" type="text" className="bg-white text-black border-gray-700" />
            </div>
            <div>
              <Label htmlFor="eft.bank">Bank:</Label>
              <Input id="eft.bank" name="eft.bank" type="text" className="bg-white text-black border-gray-700" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eft.bsb">BSB</Label>
                <Input id="eft.bsb" name="eft.bsb" type="text" className="bg-white text-black border-gray-700" />
              </div>
              <div>
                <Label htmlFor="eft.accountNumber">Account Number</Label>
                <Input
                  id="eft.accountNumber"
                  name="eft.accountNumber"
                  type="text"
                  className="bg-white text-black border-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="bg-white text-black border-gray-700 hover:bg-gray-100"
          >
            Clear
          </Button>
          <Button type="button" variant="outline" className="bg-white text-black border-gray-700 hover:bg-gray-100">
            Save
          </Button>
          <Button type="submit" disabled={isPending} className="bg-white text-black border-gray-700 hover:bg-gray-100">
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>

        {state?.message && (
          <div className={`mt-4 text-center ${state.success ? "text-green-500" : "text-red-500"}`}>{state.message}</div>
        )}
      </form>
    </div>
  )
}
