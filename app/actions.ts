"use server"

import nodemailer from "nodemailer"

export async function submitTaxInvoice(prevState: any, formData: FormData) {
  // Extract form data
  const data: { [key: string]: FormDataEntryValue | string } = Object.fromEntries(formData.entries())

  // Handle file upload (conceptual - actual file handling needs more robust logic, e.g., Vercel Blob)
  const uploadedFile = formData.get("uploadFile") as File | null
  let fileAttachment = null
  if (uploadedFile && uploadedFile.size > 0) {
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer())
    fileAttachment = {
      filename: uploadedFile.name,
      content: fileBuffer,
      contentType: uploadedFile.type,
    }
  }

  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  try {
    const htmlContent = `
      <h1>New Tax Invoice Submission</h1>
      <p><strong>Seller Details:</strong></p>
      <ul>
        <li>First Name: ${data["seller.firstName"]}</li>
        <li>Surname: ${data["seller.surname"]}</li>
        <li>Address: ${data["seller.address"]}</li>
        <li>Phone: ${data["seller.phone"]}</li>
        <li>Email: ${data["seller.email"]}</li>
        <li>Driver License No: ${data["seller.driverLicenseNo"]}</li>
        <li>Driver Name: ${data["seller.driverName"]}</li>
        <li>Truck Number / Detail: ${data["seller.truckNumberDetail"]}</li>
      </ul>
      <p><strong>Car Details:</strong></p>
      <ul>
        <li>Make: ${data["car.make"]}</li>
        <li>Model: ${data["car.model"]}</li>
        <li>VIN No: ${data["car.vinNo"]}</li>
        <li>Body Type: ${data["car.bodyType"]}</li>
        <li>Year: ${data["car.year"]}</li>
        <li>Color: ${data["car.color"]}</li>
        <li>Km: ${data["car.km"]}</li>
        <li>Rego No: ${data["car.regoNo"]}</li>
        <li>Expires: ${data["car.expires"]}</li>
        <li>Pickup Date: ${data["car.pickupDate"]}</li>
        <li>Select Time: ${data["car.selectTime"]}</li>
        <li>Plate Returned: ${data["car.plateReturned"]}</li>
        <li>Pickup Address: ${data["car.pickupAddress"]}</li>
      </ul>
      <p><strong>Terms & Conditions Consent:</strong> ${data["consent"] === "on" ? "Agreed" : "Not Agreed"}</p>
      <p><strong>No. of Uploaded Files:</strong> ${data["noOfUploadedFiles"]}</p>
      <p><strong>Price:</strong> $${data["price"]}</p>
      <p><strong>Payment Method:</strong> ${data["paymentMethod"]}</p>
      ${data.customerSignature ? `<p><strong>Customer Signature:</strong></p><img src="${data.customerSignature}" alt="Customer Signature" style="max-width: 300px; border: 1px solid #ccc;" />` : ""}
      <p><strong>EFT Bank Transfer Details:</strong></p>
      <ul>
        <li>A/C Name: ${data["eft.acName"]}</li>
        <li>Bank: ${data["eft.bank"]}</li>
        <li>BSB: ${data["eft.bsb"]}</li>
        <li>Account Number: ${data["eft.accountNumber"]}</li>
      </ul>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM, // Sender address
      to: "info@nationalautorecycling.com.au", // Recipient email
      subject: "New Tax Invoice Submission",
      html: htmlContent,
      attachments: fileAttachment ? [fileAttachment] : [],
    })

    return { success: true, message: "Invoice submitted and email sent successfully!" }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, message: "Failed to submit invoice or send email." }
  }
}
