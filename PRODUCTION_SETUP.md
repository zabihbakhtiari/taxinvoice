# Production Setup Guide

## 🚀 Complete Guide to Deploy Your Tax Invoice App with Real Email

### **Step 1: Set Up Gmail App Password**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Tax Invoice App"
   - Copy the 16-character password

### **Step 2: Create Environment Variables**

1. **Create `.env.local` file** in your project root:
```bash
# Copy the env.example file
cp env.example .env.local
```

2. **Edit `.env.local`** with your real values:
```env
# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-actual-email@gmail.com

# Production Settings
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### **Step 3: Install Required Packages**

```bash
# Install nodemailer types for TypeScript
npm install --save-dev @types/nodemailer

# Install production dependencies
npm install jspdf html2canvas
```

### **Step 4: Test Email Functionality Locally**

1. **Start development server**:
```bash
npm run dev
```

2. **Fill out the form** and submit
3. **Check your email** - you should receive the tax invoice
4. **Check browser console** for any errors

### **Step 5: Choose Your Hosting Platform**

#### **Option A: Vercel (Recommended)**

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy to Vercel**:
```bash
vercel
```

3. **Set Environment Variables in Vercel Dashboard**:
   - Go to your project dashboard
   - Settings → Environment Variables
   - Add all variables from `.env.local`

4. **Deploy to Production**:
```bash
vercel --prod
```

#### **Option B: Netlify**

1. **Build the project**:
```bash
npm run build
```

2. **Deploy to Netlify**:
   - Drag `out` folder to Netlify
   - Or use Netlify CLI

3. **Set Environment Variables** in Netlify dashboard

#### **Option C: Traditional Web Server**

1. **Build for production**:
```bash
npm run build
```

2. **Upload files** to your web server
3. **Set environment variables** on your server
4. **Configure Node.js** to run the app

### **Step 6: Configure Domain & SSL**

1. **Point your domain** to your hosting provider
2. **Enable SSL/HTTPS** (automatic on Vercel/Netlify)
3. **Update `NEXT_PUBLIC_SITE_URL`** in environment variables

### **Step 7: Test Production Deployment**

1. **Visit your live site**
2. **Submit a test form**
3. **Verify email delivery**
4. **Check PDF download functionality**

## 🔧 Troubleshooting

### **Email Not Sending**

1. **Check Gmail App Password**:
   - Ensure 2FA is enabled
   - Verify app password is correct
   - Check if Gmail blocked the app

2. **Check Environment Variables**:
   - Verify all variables are set correctly
   - Restart your server after changes

3. **Check Server Logs**:
   - Look for SMTP errors
   - Verify network connectivity

### **PDF Download Issues**

1. **Install missing packages**:
```bash
npm install jspdf html2canvas
```

2. **Check browser console** for errors
3. **Verify file permissions** on server

### **Form Not Working**

1. **Check build errors**:
```bash
npm run build
```

2. **Verify all dependencies** are installed
3. **Check server logs** for errors

## 📧 Email Templates

The app sends professional HTML emails with:
- ✅ Seller details
- ✅ Vehicle information  
- ✅ Payment details
- ✅ Customer signature (if provided)
- ✅ File attachments (if uploaded)

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env.local` to git
2. **App Passwords**: Use Gmail app passwords, not regular passwords
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Consider adding rate limiting for form submissions

## 📊 Monitoring

1. **Email Delivery**: Monitor email delivery rates
2. **Form Submissions**: Track successful submissions
3. **Error Logs**: Monitor server error logs
4. **Performance**: Monitor page load times

## 🚀 Next Steps

1. **Add Database**: Store submissions in a database
2. **File Storage**: Use cloud storage for file uploads
3. **Analytics**: Add Google Analytics
4. **Backup**: Set up automated backups
5. **Monitoring**: Add uptime monitoring

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs
3. Test email configuration
4. Verify all environment variables are set correctly

---

**Your tax invoice app is now ready for production with real email functionality!** 🎉 