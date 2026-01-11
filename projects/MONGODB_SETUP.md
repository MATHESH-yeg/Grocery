# MongoDB Atlas Connection - Step by Step Guide

## Step 1: Create MongoDB Atlas Account

1. Go to **https://www.mongodb.com/cloud/atlas**
2. Click **"Try Free"** or **"Sign Up"**
3. Fill in your details:
   - Email address
   - Password
   - First name, Last name
   - Company (optional)
4. Click **"Create your Atlas account"**
5. Verify your email if prompted

---

## Step 2: Create a Free Cluster

1. After logging in, you'll see the **"Deploy a cloud database"** screen
2. Select **"M0 FREE"** (Free tier)
3. Choose a **Cloud Provider** (AWS, Google Cloud, or Azure)
4. Select a **Region** closest to you (e.g., `N. Virginia (us-east-1)`)
5. Click **"Create"** (or "Create Cluster")
6. Wait 3-5 minutes for cluster to be created

---

## Step 3: Create Database User

1. You'll see a popup: **"Create Database User"**
2. Choose **"Password"** authentication method
3. Enter a **Username** (e.g., `qualityedu`)
4. Enter a **Password** (create a strong password - **SAVE THIS!**)
5. Click **"Create Database User"**
6. **IMPORTANT**: Copy and save your password somewhere safe!

---

## Step 4: Whitelist Your IP Address

1. You'll see a popup: **"Where would you like to connect from?"**
2. Click **"Add My Current IP Address"** (recommended for security)
   - OR click **"Allow Access from Anywhere"** (for testing - less secure)
3. Click **"Finish and Close"**

**If you missed this step:**
- Go to **"Network Access"** (left sidebar, under Security)
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"** (for testing)
- OR click **"Add Current IP Address"**
- Click **"Confirm"**
- Wait 1-2 minutes for changes to apply

---

## Step 5: Get Your Connection String

1. Click **"Connect"** button on your cluster
2. Select **"Drivers"** (or "Connect your application")
3. Choose **"Node.js"** as your driver
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 6: Update Your .env File

1. Open `server/.env` file in your project
2. Replace the connection string with your actual values:

```env
MONGO_URI=mongodb+srv://qualityedu:YOUR_ACTUAL_PASSWORD@cluster2.th3fayk.mongodb.net/grocery_delivery?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

**Important changes:**
- Replace `YOUR_ACTUAL_PASSWORD` with the password you created in Step 3
- Add `/grocery_delivery` before the `?` (this is your database name)
- Keep the rest of the connection string as is

**Example:**
```
MONGO_URI=mongodb+srv://qualityedu:MyPassword123@cluster2.th3fayk.mongodb.net/grocery_delivery?retryWrites=true&w=majority
```

---

## Step 7: Test the Connection

1. Make sure your backend server is running:
   ```powershell
   cd C:\projects\server
   npm start
   ```

2. You should see:
   ```
   ✅ MongoDB connected successfully
   Server running on port 5000
   ```

3. If you see an error:
   - Check that your IP is whitelisted (Step 4)
   - Verify password in `.env` is correct (no `<password>` placeholder)
   - Make sure database name is added (`/grocery_delivery`)

---

## Step 8: Seed Your Database (Optional)

Once connected, add sample products:

```powershell
cd C:\projects\server
node seedProducts.js
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing products
✅ Successfully seeded 20 products
```

---

## Troubleshooting

### Error: "IP not whitelisted"
- Go to **Network Access** in Atlas
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"**
- Wait 1-2 minutes, then restart server

### Error: "Authentication failed"
- Check your username and password in `.env`
- Make sure there are no spaces or special characters causing issues
- Try resetting the database user password in Atlas

### Error: "Connection timeout"
- Check your internet connection
- Verify the connection string is correct
- Make sure cluster is running (not paused)

### Can't find connection string
- Click **"Connect"** on your cluster
- Select **"Drivers"**
- Choose **"Node.js"**
- Copy the connection string

---

## Your Final .env File Should Look Like:

```env
PORT=5000
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster2.th3fayk.mongodb.net/grocery_delivery?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey12345
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

**Remember:**
- Never commit `.env` file to Git
- Keep your password secure
- Use "Allow Access from Anywhere" only for development




