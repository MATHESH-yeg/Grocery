# 🚀 How to Deploy to Vercel

Your project is now fully configured for deployment on Vercel! Because you have both a `client` (React) and `server` (Express) in the same project, we have set up a `vercel.json` file to handle the routing and building of both parts automatically.

## Step 1: Push to GitHub
If you haven't already, push your code to a GitHub repository.

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

## Step 2: Import into Vercel
1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** -> **"Project"**.
3. Select your GitHub repository.
4. **Important**: In the standard configuration screen:
   - **Root Directory**: Click "Edit" and select the `projects` folder.
   - **Framework Preset**: Vercel should automatically detect "Vite" or "Other". If it asks, "Other" or "Vite" is fine, as `vercel.json` overrides the build steps.
   - **Build Command**: Leave default (handled by `vercel.json`).
   - **Output Directory**: Leave default (handled by `vercel.json`).

## Step 3: Environment Variables
Before clicking "Deploy", expand the **"Environment Variables"** section and add the keys from your `server/.env` file:

| Key | Value (Example) |
|-----|-----------------|
| `MONGO_URI` | `mongodb+srv://...` (Your MongoDB Atlas URI) |
| `JWT_SECRET` | `supersecret...` |
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |
| `RAZORPAY_KEY_ID` | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | `...` |

> **Note**: Do not use `port` or `localhost` variables. Vercel handles the port automatically.

## Step 4: Deploy
Click **"Deploy"**. Vercel will:
1. Build your React frontend.
2. Convert your Express backend into Serverless Functions.
3. Route `/api/*` requests to your backend and all other requests to your frontend.

## Troubleshooting
- If you see a **500 Error** on API calls, check the "Functions" logs in Vercel Dashboard.
- Ensure your MongoDB Atlas IP Whitelist allows "Allow Access from Anywhere" (0.0.0.0/0), as Vercel IPs change dynamically.
