"use client"

import { useActionState, useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SignaturePad from "./signature-pad"
import { AdaptiveDatePicker } from "./adaptive-date-picker"
import { submitTaxInvoice } from "@/app/actions"
import Image from "next/image"
import { Calendar, Clock, CheckCircle2 } from "lucide-react"

const SuccessNotification = ({ show, message }: { show: boolean; message: string }) => {
  if (!show) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up">
        <CheckCircle2 className="h-6 w-6 text-white" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default function EnhancedTaxInvoiceForm() {
  const [state, formAction, isPending] = useActionState(submitTaxInvoice, { success: false, message: "" })
  const [showSuccess, setShowSuccess] = useState(false)
  const signaturePadRef = useRef<{ getSignature: () => string | null; clear: () => void }>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const router = useRouter()

  // State for date values
  const [expiryDate, setExpiryDate] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  
  // State for calculated dates to avoid hydration issues
  const [today, setToday] = useState("")
  const [maxDate, setMaxDate] = useState("")
  const [years, setYears] = useState<number[]>([])

  useEffect(() => {
    // Calculate dates on client side to avoid hydration mismatch
    const todayDate = new Date().toISOString().split("T")[0]
    const maxYear = new Date().getFullYear() + 10
    const maxDateValue = `${maxYear}-12-31`
    
    // Generate years array
    const yearsArray = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)
    
    setToday(todayDate)
    setMaxDate(maxDateValue)
    setYears(yearsArray)
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear()
    }
    setExpiryDate("")
    setPickupDate("")
    formRef.current?.reset()
    setSubmitError(null)
  }

  const handleSave = () => {
    try {
      const formData = new FormData(formRef.current!);
      const formValues = Object.fromEntries(formData.entries());
      
      // Include signature data if available
      const signatureData = signaturePadRef.current?.getSignature();
      const dataToSave = {
        ...formValues,
        signature: signatureData || null,
        lastSaved: new Date().toISOString()
      };
      
      localStorage.setItem('taxInvoiceDraft', JSON.stringify(dataToSave));
      
      // Show success message or toast notification
      alert('Form data saved successfully!');
    } catch (error) {
      console.error('Error saving form data:', error);
      alert('Failed to save form data. Please try again.');
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      
      // In development, simulate a successful submission
      if (process.env.NODE_ENV !== 'production') {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
        console.log('Form data (simulated submission):', Object.fromEntries(formData.entries()))
        
        // Show success notification
        setShowSuccess(true);
        
        // Create submission data for the results page
        const submissionData = {
          submissionId: `INV-${Date.now()}`,
          timestamp: new Date().toISOString(),
          seller: {
            firstName: formData.get('seller.firstName') || '',
            surname: formData.get('seller.surname') || '',
            address: formData.get('seller.address') || '',
            phone: formData.get('seller.phone') || '',
            email: formData.get('seller.email') || '',
            driverLicenseNo: formData.get('seller.driverLicenseNo') || '',
            driverName: formData.get('seller.driverName') || '',
            truckNumberDetail: formData.get('seller.truckNumberDetail') || '',
          },
          car: {
            make: formData.get('car.make') || '',
            model: formData.get('car.model') || '',
            vinNo: formData.get('car.vinNo') || '',
            bodyType: formData.get('car.bodyType') || '',
            year: formData.get('car.year') || '',
            color: formData.get('car.color') || '',
            km: formData.get('car.km') || '',
            regoNo: formData.get('car.regoNo') || '',
            expires: formData.get('car.expires') || '',
            pickupDate: formData.get('car.pickupDate') || '',
            selectTime: formData.get('car.selectTime') || '',
            plateReturned: formData.get('car.plateReturned') || '',
            pickupAddress: formData.get('car.pickupAddress') || '',
          },
          additional: {
            consent: formData.get('consent') === 'on',
            noOfUploadedFiles: formData.get('noOfUploadedFiles') || '1',
            price: formData.get('price') || '0',
            paymentMethod: formData.get('paymentMethod') || '',
            hasSignature: !!signaturePadRef.current?.getSignature(),
          },
          eft: {
            acName: formData.get('eft.acName') || '',
            bank: formData.get('eft.bank') || '',
            bsb: formData.get('eft.bsb') || '',
            accountNumber: formData.get('eft.accountNumber') || '',
          },
        }

        const encodedData = encodeURIComponent(JSON.stringify(submissionData))
        router.push(`/submission-results?data=${encodedData}`)
        return
      }
      
      // Production code (will only run in production)
      const signatureData = signaturePadRef.current?.getSignature()
      if (signatureData) {
        formData.append("customerSignature", signatureData)
      }

      // Ensure date values are included
      if (expiryDate) {
        formData.set("car.expires", expiryDate)
      }
      if (pickupDate) {
        formData.set("car.pickupDate", pickupDate)
      }

      const result = await formAction(formData)
      
      if (result?.success) {
        const encodedData = encodeURIComponent(JSON.stringify(result.data))
        router.push(`/submission-results?data=${encodedData}`)
      } else {
        setSubmitError(result?.message || 'Failed to submit form. Please try again.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-6xl bg-black text-white p-8 rounded-lg shadow-lg relative">
      {/* Success Notification */}
      <SuccessNotification 
        show={showSuccess} 
        message="Form submitted successfully!" 
      />
      
      {/* Preview Mode Banner */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="bg-yellow-500 text-black text-center p-2 mb-6 rounded-t-lg">
          📧 Preview Mode: Form submissions will be simulated. Deploy to production for actual email sending.
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Submission Error</h3>
          <p className="mt-1">{submitError}</p>
          {process.env.NODE_ENV === 'development' && state?.error && (
            <div className="mt-2 p-2 bg-red-50 text-xs overflow-auto">
              <pre className="whitespace-pre-wrap">{state.error}</pre>
            </div>
          )}
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">TAX INVOICE</h1>
        
        {/* Responsive Header Layout */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full mb-6 space-y-4 md:space-y-0">
          {/* Left: Logo and Company Info */}
          <div className="flex items-center md:items-start space-x-3 w-full md:w-1/3 justify-center md:justify-start">
            <Image
              src="/images/vmr-logo.png"
              alt="National Auto Recycling Logo"
              width={60}
              height={60}
              className="mt-1 md:w-[70px] md:h-[70px]"
            />
            <div className="text-center md:text-left min-w-0">
              <h2 className="text-xl md:text-2xl font-bold leading-tight">National Auto Recycling</h2>
              <div className="text-xs md:text-sm font-normal space-y-0.5">
                <div>
                  E: <a href="mailto:info@nationalautorecycling.com.au" className="underline hover:text-blue-400">info@nationalautorecycling.com.au</a>
                </div>
                <div>
                  Call Us: <a href="tel:0424633535" className="underline hover:text-blue-400">0424 633 535</a>
                </div>
                <div>ABN: 65 686 264 933</div>
                <div className="text-xs md:text-sm">
                  <span className="md:hidden">Unit 4/433-435 Hammond Rd, Dandenong South VIC 3175</span>
                  <span className="hidden md:inline">Address: Unit 4/433-435 Hammond Rd, Dandenong South VIC 3175, Australia</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Center: Empty space for balance (desktop only) */}
          <div className="hidden md:block w-1/3"></div>
          
          {/* Right: Google Review */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <Image
              src="/images/google-review.png"
              alt="Review on Google"
              width={120}
              height={50}
              className="mt-1 md:w-[150px] md:h-[60px]"
            />
          </div>
        </div>
      </div>

      <form 
        ref={formRef}
        action={handleFormSubmit}
        className="space-y-6"
      >
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
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="seller.surname">Surname:</Label>
                <Input
                  id="seller.surname"
                  name="seller.surname"
                  type="text"
                  className="bg-white text-black border-gray-700"
                  placeholder="Enter surname"
                  required
                />
              </div>
              <div>
                <Label htmlFor="seller.address">Address:</Label>
                <Input
                  id="seller.address"
                  name="seller.address"
                  type="text"
                  className="bg-white text-black border-gray-700"
                  placeholder="Enter full address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="seller.phone">Phone:</Label>
                <Input
                  id="seller.phone"
                  name="seller.phone"
                  type="tel"
                  placeholder="e.g. +61 4XX XXX XXX"
                  className="bg-white text-black border-gray-700"
                  required
                />
              </div>
              <div>
                <Label htmlFor="seller.email">Email Address:</Label>
                <Input
                  id="seller.email"
                  name="seller.email"
                  type="email"
                  className="bg-white text-black border-gray-700"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="seller.driverLicenseNo">Driver License No:</Label>
                <Input
                  id="seller.driverLicenseNo"
                  name="seller.driverLicenseNo"
                  type="text"
                  className="bg-white text-black border-gray-700"
                  placeholder="Enter license number"
                />
              </div>
              <div>
                <Label htmlFor="seller.driverName">Driver Name:</Label>
                <Input
                  id="seller.driverName"
                  name="seller.driverName"
                  type="text"
                  className="bg-white text-black border-gray-700"
                  placeholder="Enter driver name"
                />
              </div>
              <div>
                <Label htmlFor="seller.truckNumberDetail">Truck Number / Detail:</Label>
                <Input
                  id="seller.truckNumberDetail"
                  name="seller.truckNumberDetail"
                  type="text"
                  className="bg-white text-black border-gray-700"
                  placeholder="Enter truck details"
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
                  <Input
                    id="car.make"
                    name="car.make"
                    type="text"
                    className="bg-white text-black border-gray-700"
                    placeholder="e.g. Toyota"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="car.model">Model</Label>
                  <Input
                    id="car.model"
                    name="car.model"
                    type="text"
                    className="bg-white text-black border-gray-700"
                    placeholder="e.g. Camry"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="car.vinNo">VIN No:</Label>
                <Input
                  id="car.vinNo"
                  name="car.vinNo"
                  type="text"
                  maxLength={17}
                  placeholder="17 character VIN number"
                  className="bg-white text-black border-gray-700 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="car.bodyType">Body Type</Label>
                  <Select name="car.bodyType" required>
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
                      <SelectItem value="wagon">Wagon</SelectItem>
                      <SelectItem value="convertible">Convertible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="car.year">Select Year</Label>
                  <Select name="car.year" required>
                    <SelectTrigger className="w-full bg-white text-black border-gray-700">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      {years.map((year) => (
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
                  <Input
                    id="car.color"
                    name="car.color"
                    type="text"
                    className="bg-white text-black border-gray-700"
                    placeholder="e.g. Red"
                  />
                </div>
                <div>
                  <Label htmlFor="car.km">Kilometers</Label>
                  <Input
                    id="car.km"
                    name="car.km"
                    type="number"
                    min="0"
                    max="999999"
                    className="bg-white text-black border-gray-700"
                    placeholder="e.g. 150000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="car.regoNo">Registration No.</Label>
                  <Input
                    id="car.regoNo"
                    name="car.regoNo"
                    type="text"
                    className="bg-white text-black border-gray-700 uppercase"
                    placeholder="e.g. ABC123"
                    style={{ textTransform: "uppercase" }}
                  />
                </div>
                <div>
                  <Label htmlFor="car.expires" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Registration Expires
                  </Label>
                  <AdaptiveDatePicker
                    name="car.expires"
                    id="car.expires"
                    placeholder="Select expiry date"
                    minDate={today}
                    maxDate={maxDate}
                    onChange={setExpiryDate}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="car.pickupDate" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Pickup Date
                  </Label>
                  <AdaptiveDatePicker
                    name="car.pickupDate"
                    id="car.pickupDate"
                    placeholder="Select pickup date"
                    minDate={today}
                    onChange={setPickupDate}
                  />
                </div>
                <div>
                  <Label htmlFor="car.selectTime" className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Pickup Time
                  </Label>
                  <Select name="car.selectTime">
                    <SelectTrigger className="w-full bg-white text-black border-gray-700">
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="08:30">8:30 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="09:30">9:30 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="10:30">10:30 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="11:30">11:30 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="12:30">12:30 PM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="13:30">1:30 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="14:30">2:30 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="15:30">3:30 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="16:30">4:30 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
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
                  placeholder="Enter full pickup address"
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
              required
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
            <Input
              id="uploadFile"
              name="uploadFile"
              type="file"
              className="bg-white text-black border-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <p className="text-xs text-gray-400 mt-1">Maximum file size: 10MB. Accepted formats: PDF, JPG, PNG, DOC</p>
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
              min="0"
              step="0.01"
              placeholder="Enter price (e.g. 5000.00)"
              className="bg-white text-black border-gray-700"
              required
            />
          </div>
          <div>
            <Label htmlFor="paymentMethod">Select Your Method</Label>
            <Select name="paymentMethod" required>
              <SelectTrigger className="w-full bg-white text-black border-gray-700">
                <SelectValue placeholder="Select Payment Method" />
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
          <p className="text-xs text-gray-400 mt-1">Draw your signature above</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClear}
            disabled={isSubmitting}
          >
            Clear
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  )
}
