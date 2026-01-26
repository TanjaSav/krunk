# Vercel Environment Variables Setup

## Adding reCAPTCHA Site Key to Vercel

### Step-by-Step Instructions:

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Log in to your account
   - Select your project (krunk)

2. **Navigate to Settings**
   - Click on your project
   - Click on **Settings** in the top navigation
   - Click on **Environment Variables** in the left sidebar

3. **Add the Environment Variable**
   - Click **Add New** button
   - **Key**: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - **Value**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
   - **Environment**: Select all three:
     - ☑ Production
     - ☑ Preview
     - ☑ Development
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**
   - OR push a new commit to trigger automatic redeploy

### Verification

After redeploying, the reCAPTCHA should work on your Vercel deployment. The test key will work for both localhost and Vercel.

### Note

The test key (`6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`) is Google's public test key that always passes validation.

**For Production:**

- Get a real key from Google reCAPTCHA: https://www.google.com/recaptcha/admin/create
- When adding domains, include:
  - `localhost`
  - `127.0.0.1`
  - `localhost:3000` (or your dev port)
  - Your Vercel domain (e.g., `your-app.vercel.app`)
- Add the real key to Vercel environment variables
- Keep the test key in `.env.local` for local development

**Why localhost might not work:**

- Google reCAPTCHA sometimes has issues with `localhost` alone
- Try adding `127.0.0.1` and `localhost:3000` as separate domains
- Or use the test key for localhost and real key for production
