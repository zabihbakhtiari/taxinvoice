"use server"

import nodemailer from "nodemailer"
import { redirect } from "next/navigation"

// Helper function to safely get environment variables with better error messages
function getEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export async function submitTaxInvoice(prevState: any, formData: FormData) {
  console.log('Starting form submission...')
  
  try {
    // Get environment variables with validation
    const emailUser = getEnvVar('EMAIL_USER')
    const emailPass = getEnvVar('EMAIL_PASS')
    
    console.log('Environment variables loaded successfully')
    
    // Log form data (excluding files)
    const formDataObj: Record<string, any> = {}
    formData.forEach((value, key) => {
      formDataObj[key] = value instanceof File ? `[File: ${value.name}, ${value.size} bytes]` : value
    })
    console.log('Form data received:', JSON.stringify(formDataObj, null, 2))

    // Handle file upload if present
    const uploadedFile = formData.get("uploadFile") as File | null
    let fileAttachment = null
    
    if (uploadedFile && uploadedFile.size > 0) {
      console.log(`Processing uploaded file: ${uploadedFile.name} (${uploadedFile.size} bytes)`)
      try {
        const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer())
        fileAttachment = {
          filename: uploadedFile.name,
          content: fileBuffer,
          contentType: uploadedFile.type,
        }
      } catch (fileError) {
        console.error('Error processing file:', fileError)
        throw new Error('Failed to process the uploaded file')
      }
    }

    // Create test account if in development
    let testAccount
    if (process.env.NODE_ENV === 'development') {
      console.log('Creating test email account...')
      testAccount = await nodemailer.createTestAccount()
      console.log('Test account created:', testAccount.user)
    }

    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.NODE_ENV === 'development' ? 'smtp.ethereal.email' : 'smtp.gmail.com',
      port: process.env.NODE_ENV === 'development' ? 587 : 465,
      secure: process.env.NODE_ENV !== 'development', // true for 465, false for other ports
      auth: {
        user: process.env.NODE_ENV === 'development' ? testAccount.user : emailUser,
        pass: process.env.NODE_ENV === 'development' ? testAccount.pass : emailPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    console.log('Transporter created, verifying connection...')
    
    // Verify connection configuration
    try {
      await transporter.verify()
      console.log('Server is ready to take our messages')
    } catch (verifyError) {
      console.error('SMTP connection verification failed:', verifyError)
      throw new Error('Failed to connect to email server. Please check your email settings.')
    }

    // Email content
    const mailOptions = {
      from: `"National Auto Recycling" <${process.env.NODE_ENV === 'development' ? testAccount.user : emailUser}>`,
      to: process.env.NODE_ENV === 'development' ? testAccount.user : emailUser, // Send to self in development
      subject: 'New Tax Invoice Submission',
      text: 'A new tax invoice has been submitted.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">New Tax Invoice Submission</h1>
          <p>You have received a new tax invoice submission.</p>
          <pre>${JSON.stringify(formDataObj, null, 2)}</pre>
        </div>
      `,
      attachments: fileAttachment ? [fileAttachment] : [],
    }

    console.log('Sending email...')
    
    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    console.log('Message sent: %s', info.messageId)
    
    // Preview only available when sending through an Ethereal account
    if (process.env.NODE_ENV === 'development') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    }
    
    // Redirect to success page
    console.log('Form submission successful, redirecting...')
    redirect('/success')
    
  } catch (error) {
    console.error('Form submission error:', error)
    
    // Return detailed error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred during form submission'
    
    // Log the full error for debugging
    console.error('Full error details:', error)
    
    return { 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' 
        ? error instanceof Error ? error.stack : String(error)
        : undefined
    }
  }
}
