"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Car, User, CreditCard, FileText, Calendar, MapPin, Phone, Mail, Download, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Suspense, useRef, useEffect, useState } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface SubmissionData {
  submissionId: string
  timestamp: string
  seller: {
    firstName: string
    surname: string
    address: string
    phone: string
    email: string
    driverLicenseNo: string
    driverName: string
    truckNumberDetail: string
  }
  car: {
    make: string
    model: string
    vinNo: string
    bodyType: string
    year: string
    color: string
    km: string
    regoNo: string
    expires: string
    pickupDate: string
    selectTime: string
    plateReturned: string
    pickupAddress: string
  }
  additional: {
    consent: boolean
    noOfUploadedFiles: string
    price: string
    paymentMethod: string
    hasSignature: boolean
  }

}

const SuccessOverlay = ({ show }: { show: boolean }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-300">
      <div className="bg-green-600 text-white px-8 py-6 rounded-lg shadow-xl flex flex-col items-center animate-fade-in">
        <CheckCircle2 className="h-12 w-12 text-white mb-3" />
        <h3 className="text-xl font-semibold">Success!</h3>
        <p>Your form has been submitted successfully.</p>
      </div>
    </div>
  );
};

function SubmissionResultsContent() {
  const searchParams = useSearchParams()
  const dataParam = searchParams.get("data")
  const [showSuccess, setShowSuccess] = useState(true)

  // Auto-hide success notification after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!dataParam) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-900 border-gray-700">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-bold mb-4">No Submission Data Found</h1>
            <p className="text-gray-400 mb-4">Unable to load submission results.</p>
            <Link href="/">
              <Button className="bg-white text-black hover:bg-gray-100">Return to Form</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  let submissionData: SubmissionData
  try {
    submissionData = JSON.parse(decodeURIComponent(dataParam))
  } catch (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-900 border-gray-700">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-bold mb-4">Invalid Submission Data</h1>
            <p className="text-gray-400 mb-4">Unable to parse submission results.</p>
            <Link href="/">
              <Button className="bg-white text-black hover:bg-gray-100">Return to Form</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPaymentMethodColor = (method: string) => {
    const colors: { [key: string]: string } = {
      paypal: "bg-blue-500",
      check: "bg-green-500",
      bank_transfer: "bg-purple-500",
      cash: "bg-yellow-500",
      free: "bg-gray-500",
      eft: "bg-indigo-500",
    }
    return colors[method] || "bg-gray-500"
  }

  const generatePDF = async () => {
    const receiptElement = document.getElementById("receipt-content")
    if (!receiptElement) {
      console.error("Receipt element not found.")
      return
    }

    try {
      // Temporarily hide action buttons for PDF generation
      const actionButtons = document.querySelector('.action-buttons') as HTMLElement
      if (actionButtons) {
        actionButtons.style.display = 'none'
      }

      // Apply light mode styles for PDF generation
      const originalClasses = receiptElement.className
      receiptElement.className = originalClasses + ' pdf-mode'
      
      // Add light mode styles temporarily
      const style = document.createElement('style')
      style.textContent = `
        .pdf-mode {
          background: white !important;
          color: black !important;
        }
        .pdf-mode * {
          color: black !important;
        }
        .pdf-mode .bg-black {
          background: white !important;
        }
        .pdf-mode .text-white {
          color: black !important;
        }
        .pdf-mode .bg-gray-900 {
          background: #f8f9fa !important;
          border: 1px solid #dee2e6 !important;
        }
        .pdf-mode .border-gray-700 {
          border-color: #dee2e6 !important;
        }
        .pdf-mode .text-gray-400 {
          color: black !important;
        }
        .pdf-mode .text-green-500 {
          color: black !important;
        }
        .pdf-mode .text-green-400 {
          color: black !important;
        }
        .pdf-mode .bg-green-500 {
          background: #f8f9fa !important;
          color: black !important;
          border: 1px solid #dee2e6 !important;
        }
        .pdf-mode .bg-blue-500 {
          background: #f8f9fa !important;
          color: black !important;
          border: 1px solid #dee2e6 !important;
        }
        .pdf-mode .bg-purple-500 {
          background: #f8f9fa !important;
          color: black !important;
          border: 1px solid #dee2e6 !important;
        }
        .pdf-mode .bg-yellow-400 {
          background: #f8f9fa !important;
          color: black !important;
          border: 1px solid #dee2e6 !important;
        }
        .pdf-mode .bg-purple-400 {
          background: #f8f9fa !important;
          color: black !important;
          border: 1px solid #dee2e6 !important;
        }
        .pdf-mode .bg-blue-400 {
          background: #f8f9fa !important;
          color: black !important;
          border: 1px solid #dee2e6 !important;
        }
        .pdf-mode .bg-green-400 {
          background: #f8f9fa !important;
          color: black !important;
          border: 1px solid #dee2e6 !important;
        }
        .pdf-mode .bg-blue-900\/20 {
          background: #f8f9fa !important;
          border: 1px solid #dee2e6 !important;
        }
        .pdf-mode .text-blue-400 {
          color: black !important;
        }
        .pdf-mode .text-gray-300 {
          color: black !important;
        }
        .pdf-mode .text-blue-300 {
          color: black !important;
        }
        .pdf-mode .text-gray-500 {
          color: black !important;
        }
        .pdf-mode .text-xs {
          color: black !important;
        }
        .pdf-mode .text-sm {
          color: black !important;
        }
        .pdf-mode .font-medium {
          color: black !important;
        }
        .pdf-mode .font-bold {
          color: black !important;
        }
        .pdf-mode .font-mono {
          color: black !important;
        }
        .pdf-mode h1, .pdf-mode h2, .pdf-mode h3, .pdf-mode h4, .pdf-mode h5, .pdf-mode h6 {
          color: black !important;
        }
        .pdf-mode p {
          color: black !important;
        }
        .pdf-mode span {
          color: black !important;
        }
        .pdf-mode div {
          color: black !important;
        }
        .pdf-mode li {
          color: black !important;
        }
      `
      document.head.appendChild(style)

      const canvas = await html2canvas(receiptElement, { 
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      })

      // Restore original styling
      receiptElement.className = originalClasses
      document.head.removeChild(style)

      // Restore action buttons
      if (actionButtons) {
        actionButtons.style.display = 'flex'
      }

      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 190 // Slightly smaller than A4 width for margins
      const pageHeight = 277 // Slightly smaller than A4 height for margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`tax_invoice_${submissionData.submissionId}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <SuccessOverlay show={showSuccess} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide text-center mb-6">TAX INVOICE</h1>
          
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
                priority
              />
              <div className="text-center md:text-left min-w-0">
                <h2 className="text-xl md:text-2xl font-bold leading-tight">National Auto Recycling</h2>
                <div className="text-xs md:text-sm font-normal space-y-0.5">
                  <div>
                    E: <a href="mailto:info@nationalautorecycling.com.au" className="underline text-blue-300">info@nationalautorecycling.com.au</a>
                  </div>
                  <div>
                    Call Us: <a href="tel:0424633535" className="underline text-blue-300">0424 633 535</a>
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
                alt="Review us on Google"
                width={120}
                height={50}
                className="mt-1 md:w-[150px] md:h-[60px]"
                priority
              />
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <h3 className="text-xl font-bold">Seller Details</h3>
            <h3 className="text-xl font-bold">Car Details</h3>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Seller</p>
              <p className="font-bold">
                {submissionData.seller.firstName} {submissionData.seller.surname}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <Car className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Vehicle</p>
              <p className="font-bold">
                {submissionData.car.year} {submissionData.car.make} {submissionData.car.model}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <CreditCard className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Price</p>
              <p className="font-bold text-green-400">${submissionData.additional.price}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Status</p>
              <Badge className="bg-green-500 text-white">
                {submissionData.additional.consent ? "Approved" : "Pending"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Seller Details */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <User className="h-5 w-5 mr-2 text-blue-400" />
                Seller Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">First Name</p>
                  <p className="font-medium">{submissionData.seller.firstName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Surname</p>
                  <p className="font-medium">{submissionData.seller.surname || "N/A"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Address
                </p>
                <p className="font-medium">{submissionData.seller.address || "N/A"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone
                  </p>
                  <p className="font-medium">{submissionData.seller.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </p>
                  <p className="font-medium">{submissionData.seller.email || "N/A"}</p>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Driver License</p>
                  <p className="font-medium">{submissionData.seller.driverLicenseNo || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Driver Name</p>
                  <p className="font-medium">{submissionData.seller.driverName || "N/A"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">Truck Details</p>
                <p className="font-medium">{submissionData.seller.truckNumberDetail || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Car className="h-5 w-5 mr-2 text-green-400" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Make</p>
                  <p className="font-medium">{submissionData.car.make || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Model</p>
                  <p className="font-medium">{submissionData.car.model || "N/A"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">VIN Number</p>
                <p className="font-mono text-sm bg-gray-800 p-2 rounded">{submissionData.car.vinNo || "N/A"}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Year</p>
                  <p className="font-medium">{submissionData.car.year || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Body Type</p>
                  <p className="font-medium">{submissionData.car.bodyType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Color</p>
                  <p className="font-medium">{submissionData.car.color || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Kilometers</p>
                  <p className="font-medium">{submissionData.car.km ? `${submissionData.car.km} km` : "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Registration</p>
                  <p className="font-medium">{submissionData.car.regoNo || "N/A"}</p>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Pickup Date
                  </p>
                  <p className="font-medium">{submissionData.car.pickupDate || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Pickup Time</p>
                  <p className="font-medium">{submissionData.car.selectTime || "N/A"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Pickup Address
                </p>
                <p className="font-medium">{submissionData.car.pickupAddress || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Plate Returned</p>
                <Badge variant={submissionData.car.plateReturned === "Yes" ? "default" : "secondary"}>
                  {submissionData.car.plateReturned || "N/A"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <CreditCard className="h-5 w-5 mr-2 text-yellow-400" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-2xl font-bold text-green-400">${submissionData.additional.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Payment Method</p>
                  <Badge className={`${getPaymentMethodColor(submissionData.additional.paymentMethod)} text-white`}>
                    {submissionData.additional.paymentMethod?.toUpperCase() || "N/A"}
                  </Badge>
                </div>
              </div>


            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="h-5 w-5 mr-2 text-purple-400" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Terms Consent</p>
                  <Badge variant={submissionData.additional.consent ? "default" : "destructive"}>
                    {submissionData.additional.consent ? "✅ Agreed" : "❌ Not Agreed"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Uploaded Files</p>
                  <p className="font-medium">{submissionData.additional.noOfUploadedFiles}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">Customer Signature</p>
                <Badge variant={submissionData.additional.hasSignature ? "default" : "secondary"}>
                  {submissionData.additional.hasSignature ? "✅ Provided" : "❌ Not Provided"}
                </Badge>
              </div>

              <Separator className="bg-gray-700" />

              <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
                <h4 className="font-medium text-blue-400 mb-2">Next Steps</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Your submission has been received and is being processed</li>
                  <li>• You will receive a confirmation email shortly</li>
                  <li>• Our team will contact you within 24 hours</li>
                  <li>• Keep your submission ID for reference</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons flex justify-center space-x-4 mt-8">
          <Button onClick={() => window.print()} variant="outline" className="bg-gray-800 border-gray-600 text-white">
            Print Receipt
          </Button>
          <Button onClick={generatePDF} variant="outline" className="bg-gray-800 border-gray-600 text-white">
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </Button>
          <Link href="/">
            <Button className="bg-white text-black hover:bg-gray-100">Submit Another Form</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SubmissionResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading submission results...</p>
          </div>
        </div>
      }
    >
      <SubmissionResultsContent />
    </Suspense>
  )
}
