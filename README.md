This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Configure your environment variables in `.env.local`:
   - **NEXT_PUBLIC_RECAPTCHA_SITE_KEY**: Get your reCAPTCHA site key (public) from [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
     - For testing, you can use: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
     - For production, you need a real key from Google
   - **RECAPTCHA_SECRET_KEY**: Get your reCAPTCHA secret key (private) from the same Google reCAPTCHA Admin page
     - ⚠️ **IMPORTANT**: This is used for server-side verification and should NEVER be exposed to the client
     - The secret key is different from the site key - you'll see both when you create a reCAPTCHA site
     - For testing with the test site key above, you can use: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`
   - **MONGODB_URI**: Your MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

3. Restart the development server after updating `.env.local`

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
