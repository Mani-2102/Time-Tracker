# iamtimer.com Domain Setup Guide

## Your Setup:

- **Domain**: iamtimer.com
- **Frontend**: GitHub Pages (https://mani-2102.github.io/Time-Tracker/)
- **Backend**: DigitalOcean Server (139.59.30.160:5000)

---

## Step 1: DNS Records (Add at your domain registrar)

Go to where you bought the domain (GoDaddy, Namecheap, Google Domains, etc.) and add these DNS records:

### For Frontend (iamtimer.com → GitHub Pages):

| Type  | Name/Host | Value/Points to     | TTL  |
| ----- | --------- | ------------------- | ---- |
| A     | @         | 185.199.108.153     | 3600 |
| A     | @         | 185.199.109.153     | 3600 |
| A     | @         | 185.199.110.153     | 3600 |
| A     | @         | 185.199.111.153     | 3600 |
| CNAME | www       | mani-2102.github.io | 3600 |

### For Backend API (api.iamtimer.com → Your Server):

| Type | Name/Host | Value/Points to | TTL  |
| ---- | --------- | --------------- | ---- |
| A    | api       | 139.59.30.160   | 3600 |

---

## Step 2: GitHub Pages Setup

1. Go to: https://github.com/mani-2102/Time-Tracker/settings/pages
2. Under **Custom domain**, enter: `iamtimer.com`
3. Click Save
4. Wait for DNS check (may take a few minutes)
5. Check ✅ "Enforce HTTPS" (after DNS propagates)

**Note**: The `CNAME` file has been created in your repo. Push it to GitHub:

```
git add CNAME
git commit -m "Add custom domain"
git push
```

---

## Step 3: SSL Certificate for API (Run after DNS propagates)

After your DNS is set up (wait 5-30 minutes), run this command to get free SSL:

```bash
ssh root@139.59.30.160 "certbot --nginx -d api.iamtimer.com --non-interactive --agree-tos --email your-email@example.com"
```

Replace `your-email@example.com` with your actual email.

---

## Step 4: Update Backend CORS

The backend needs to allow requests from your new domain. Update DEPLOY_THIS_BACKEND.js CORS settings:

```javascript
// Add iamtimer.com to allowed origins
const corsOptions = {
  origin: [
    "https://iamtimer.com",
    "https://www.iamtimer.com",
    "https://mani-2102.github.io",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
  ],
  credentials: true,
};
```

---

## Final URLs:

After setup is complete:

| Purpose                      | URL                       |
| ---------------------------- | ------------------------- |
| **Main Website**             | https://iamtimer.com      |
| **With www**                 | https://www.iamtimer.com  |
| **API Backend**              | https://api.iamtimer.com  |
| **Old Server (still works)** | http://139.59.30.160:5000 |

---

## Troubleshooting:

### DNS not working?

- Use https://dnschecker.org to check if DNS has propagated
- DNS can take up to 48 hours (usually 5-30 minutes)

### SSL Certificate error?

- Make sure DNS is pointing correctly first
- Run: `ssh root@139.59.30.160 "certbot --nginx -d api.iamtimer.com"`

### CORS errors?

- Check browser console for specific error
- Make sure backend CORS includes your domain

### GitHub Pages not showing?

- Make sure CNAME file exists in repo
- Check Settings > Pages for any errors
