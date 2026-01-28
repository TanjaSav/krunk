# Vercel Environment Variables Setup

## Adding reCAPTCHA Keys to Vercel

### Step-by-Step Instructions:

1.  **Go to Vercel Dashboard**
    - Visit https://vercel.com
    - Log in to your account
    - Select your project (krunk)

2.  **Navigate to Settings**
    - Click on your project
    - Click on **Settings** in the top navigation
    - Click on **Environment Variables** in the left sidebar

3.  **Add the Site Key (Public)**
    - Click **Add New** button
    - **Key**: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
    - **Value**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` (test key) or your real site key
    - **Environment**: Select all three: ☑ Production, ☑ Preview, ☑ Development
    - Click **Save**

4.  **Add the Secret Key (Private) - REQUIRED for Server-Side Verification**
    - Click **Add New** button again
    - **Key**: `RECAPTCHA_SECRET_KEY`
    - **Value**: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe` (test secret) or your real secret key
    - ⚠️ **IMPORTANT**: This is a private key - never expose it to the client
    - **Environment**: Select all three: ☑ Production, ☑ Preview, ☑ Development
    - Click **Save**

4.  **Redeploy**
    - Go to **Deployments** tab
    - Click the three dots (⋯) on the latest deployment
    - Click **Redeploy**
    - OR push a new commit to trigger automatic redeploy

### Verification

After redeploying, the reCAPTCHA should work on your Vercel deployment. The test key will work for both localhost and Vercel.

### Note

The test keys are Google's public test keys that always pass validation:
- **Site Key**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` (public, used on client)
- **Secret Key**: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe` (private, used on server)

**For Production:**

- Get real keys from Google reCAPTCHA: https://www.google.com/recaptcha/admin/create
- When creating a reCAPTCHA site, you'll get TWO keys:
  1. **Site Key** (public) - goes in `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
  2. **Secret Key** (private) - goes in `RECAPTCHA_SECRET_KEY`
- When adding domains, include:
  - `localhost`
  - `127.0.0.1`
  - `localhost:3000` (or your dev port)
  - Your Vercel domain (e.g., `your-app.vercel.app`)
- Add both keys to Vercel environment variables
- Keep the test keys in `.env.local` for local development

**Why localhost might not work:**

- Google reCAPTCHA sometimes has issues with `localhost` alone
- Try adding `127.0.0.1` and `localhost:3000` as separate domains
- Or use the test key for localhost and real key for production
