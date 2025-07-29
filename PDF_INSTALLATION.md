# PDF Download Feature Installation

## Overview
The tax invoice form now includes a PDF download feature that allows users to download their submission as a PDF file.

## Installation

### Option 1: Using the batch file (Windows)
1. Double-click the `install-packages.bat` file
2. Wait for the installation to complete
3. The packages will be installed automatically

### Option 2: Manual installation
If the batch file doesn't work, run these commands in your terminal:

```bash
npm install jspdf html2canvas
```

Or if you're using pnpm:
```bash
pnpm add jspdf html2canvas
```

## Features Added

### PDF Download Button
- Added a "Download PDF" button next to the "Print Receipt" button
- The button includes a download icon for better UX
- Downloads the submission as a PDF file named `tax_invoice_[SUBMISSION_ID].pdf`

### PDF Generation Features
- Converts the submission results page to a high-quality PDF
- Automatically handles multi-page content
- Includes proper margins and formatting
- Hides action buttons during PDF generation for cleaner output
- Uses white background for better PDF readability

### Print Styles
- Added comprehensive print CSS styles
- Ensures the page prints correctly with proper colors and layout
- Hides action buttons during printing
- Converts dark theme to light theme for better print readability

## Usage

1. Fill out and submit the tax invoice form
2. On the submission results page, you'll see three buttons:
   - **Print Receipt**: Opens the browser's print dialog
   - **Download PDF**: Downloads the submission as a PDF file
   - **Submit Another Form**: Returns to the main form

## Technical Details

### Dependencies
- `jspdf`: JavaScript library for PDF generation
- `html2canvas`: Converts HTML elements to canvas for PDF conversion

### Files Modified
- `app/submission-results/page.tsx`: Added PDF generation functionality
- `app/globals.css`: Added print styles for better PDF/print output
- `package.json`: Added new dependencies
- `install-packages.bat`: Installation script for Windows users

### PDF Generation Process
1. Captures the receipt content area using html2canvas
2. Converts the canvas to a high-resolution image
3. Creates a PDF document using jsPDF
4. Handles multi-page content automatically
5. Downloads the file with a descriptive filename

## Troubleshooting

### If packages fail to install:
1. Check your Node.js and npm installation
2. Try running the command manually in your terminal
3. Ensure you have proper permissions to install packages

### If PDF generation fails:
1. Check the browser console for error messages
2. Ensure all images are loaded before generating PDF
3. Try refreshing the page and generating the PDF again

### If the PDF looks incorrect:
1. The print styles should handle most styling issues
2. Check that the receipt content is properly contained within the `#receipt-content` div
3. Ensure all CSS classes are properly applied 