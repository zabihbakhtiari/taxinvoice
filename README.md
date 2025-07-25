# 📋 Tax Invoice Generator


A modern, responsive Next.js application for creating and submitting professional tax invoices. Built with React, TypeScript, and Tailwind CSS, this application provides a seamless user experience with a rich set of custom components and a clean, professional design.

## ✨ Features

- **📝 Comprehensive Tax Invoice Form**: Detailed and user-friendly form with sections for seller details, car information, terms and conditions, and payment data
- **✍️ Integrated Digital Signature**: Custom signature pad component for capturing digital signatures directly within the form
- **📎 File Upload Support**: Easy attachment of supporting documents to invoice submissions
- **📧 Automated Email Delivery**: Uses Nodemailer to automatically send completed invoices with signatures and attachments
- **📱 Fully Responsive Design**: Optimized for all devices - desktop, tablet, and mobile
- **🎨 Rich UI Component Library**: Built with shadcn/ui components for accessibility and customization
- **🔍 Form Validation**: Robust validation using Zod and React Hook Form
- **⚡ Performance Optimized**: Built with Next.js for optimal performance and SEO

## 🚀 Demo

[Live Demo](https://your-demo-link.com)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.18.0 or later) - [Download here](https://nodejs.org/)
- **npm**, **yarn**, or **pnpm** package manager

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zabihbakhtiari/taxinvoice.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd taxinvoice
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables in `.env.local`:
   ```env
   # Email Configuration
   SMTP_HOST=your-smtp-host
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASS=your-password
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Runs the app in development mode |
| `npm run build` | Builds the app for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Lints the code using ESLint |
| `npm run type-check` | Runs TypeScript type checking |



## 🛠️ Built With

### Core Technologies
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### UI & Components
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[Lucide React](https://lucide.dev/)** - Beautiful icon set

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with easy validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Email & Communication
- **[Nodemailer](https://nodemailer.com/)** - Email sending for Node.js



## 🔧 Configuration

### Email Setup
Configure your email settings in `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Customization
- Modify `tailwind.config.js` for custom styling
- Update components in `components/ui/` for different themes
- Adjust form fields in `components/tax-invoice-form.tsx`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Zabih Bakhtiari**
- GitHub: [@zabihbakhtiari](https://github.com/zabihbakhtiari)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [Vercel](https://vercel.com/) for the deployment platform
- [Next.js team](https://nextjs.org/) for the incredible framework

## 📞 Support

If you have any questions or need help, please open an issue or reach out via:
- Email: your-email@example.com
- GitHub Issues: [Create an issue](https://github.com/zabihbakhtiari/taxinvoice/issues)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/zabihbakhtiari">Zabih Bakhtiari</a>
</div>