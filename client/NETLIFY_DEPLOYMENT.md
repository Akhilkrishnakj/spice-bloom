# Netlify Deployment Guide for Spice Bloom

## 🚀 Quick Deploy to Netlify

### Option 1: Deploy via Netlify UI (Recommended)

1. **Go to [netlify.com](https://netlify.com)** and sign up/login
2. **Click "New site from Git"**
3. **Connect your GitHub repository**
4. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
   - **Base directory:** `client` (if deploying from root repo)
5. **Set environment variables:**
   - `REACT_APP_API_URL` = `https://spice-bloom.onrender.com/api/v1`
6. **Click "Deploy site"**

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify (from client directory)
cd client
netlify init

# Deploy
netlify deploy --prod
```

## 🔧 Environment Variables

Set these in Netlify dashboard → Site settings → Environment variables:

```
REACT_APP_API_URL=https://spice-bloom.onrender.com/api/v1
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
```

## 📁 File Structure

```
client/
├── netlify.toml          # Netlify configuration
├── public/
│   └── _redirects        # SPA routing
├── src/
│   └── api/
│       └── axios.js      # API configuration
└── package.json
```

## 🔄 Custom Domain (Optional)

1. Go to Netlify dashboard → Site settings → Domain management
2. Add your custom domain
3. Update DNS records as instructed

## 🐛 Troubleshooting

- **Build fails:** Check Node.js version (use 18.x)
- **API calls fail:** Verify environment variables are set
- **Routing issues:** Ensure `_redirects` file is in `public/` folder 