# 📁 Deployment Files Overview

This folder contains all files needed to deploy your Instagram Reel Downloader to a VPS.

---

## 📄 Files in This Folder

### 1. **VPS_SETUP_GUIDE.md** 📖
**Complete deployment guide** with step-by-step instructions for:
- Initial VPS setup
- GitHub Actions configuration
- Domain + Cloudflare setup
- Troubleshooting

👉 **START HERE** - Follow this guide to deploy your app

---

### 2. **instagram-downloader.service** ⚙️
**systemd service file** - Keeps your backend running 24/7

**What it does:**
- Runs Gunicorn with 4 workers
- Auto-restarts if app crashes
- Auto-starts on server reboot
- Runs as non-root user (deployer)

**Where it goes:** `/etc/systemd/system/instagram-downloader.service`

**Commands:**
```bash
sudo systemctl start instagram-downloader      # Start
sudo systemctl stop instagram-downloader       # Stop
sudo systemctl restart instagram-downloader    # Restart
sudo systemctl status instagram-downloader     # Check status
sudo journalctl -u instagram-downloader -f     # View logs
```

---

### 3. **nginx.conf** 🌐
**Nginx configuration** - Reverse proxy and static file serving

**What it does:**
- Serves React frontend (static files)
- Proxies API requests to FastAPI backend (port 8000)
- Handles SSL/TLS (via Cloudflare)
- Gzip compression for faster loading
- Security headers

**Where it goes:** `/etc/nginx/sites-available/instagram-downloader`

**Commands:**
```bash
sudo nginx -t                  # Test configuration
sudo systemctl reload nginx    # Reload config
sudo systemctl restart nginx   # Restart Nginx
```

---

### 4. **cleanup.sh** 🧹
**Auto-cleanup script** - Deletes old downloaded videos

**What it does:**
- Deletes videos older than 24 hours (configurable)
- Runs via cron job daily at 2 AM
- Logs activity to `/var/log/instagram-downloader-cleanup.log`

**Where it goes:** `/usr/local/bin/cleanup-videos.sh`

**Modify cleanup time:**
```bash
sudo nano /usr/local/bin/cleanup-videos.sh
# Change: HOURS_TO_KEEP=24  (to any value you want)
```

**Manual run:**
```bash
sudo /usr/local/bin/cleanup-videos.sh
```

---

### 5. **deploy.sh** 🚀
**Manual deployment script** - Updates app without GitHub Actions

**What it does:**
- Pulls latest code from GitHub
- Installs backend dependencies
- Rebuilds frontend
- Restarts backend service

**Where it goes:** `/var/www/instagram-downloader/deployment/deploy.sh`

**Usage:**
```bash
cd /var/www/instagram-downloader
./deployment/deploy.sh
```

---

### 6. **.github/workflows/deploy.yml** 🤖
**GitHub Actions workflow** - Automated deployment on git push

**What it does:**
- Triggers when you push to `main` branch
- SSHs into VPS
- Runs deployment automatically
- No manual work needed!

**Where it goes:** `.github/workflows/deploy.yml` (root of repo)

**Requires GitHub Secrets:**
- `VPS_HOST` - Your VPS IP
- `VPS_USERNAME` - deployer
- `VPS_SSH_KEY` - Private SSH key

**View deployments:** `https://github.com/YourUsername/video-downloader/actions`

---

## 🎯 Quick Reference

### First-Time Setup
1. Read `VPS_SETUP_GUIDE.md`
2. Follow all 4 phases
3. Takes ~30-45 minutes

### Daily Usage
```bash
# Push code changes
git push origin main
# ✅ GitHub Actions auto-deploys!

# Or deploy manually
ssh deployer@YOUR_VPS_IP
cd /var/www/instagram-downloader
./deployment/deploy.sh
```

### Common Commands
```bash
# Check backend status
sudo systemctl status instagram-downloader

# View live logs
sudo journalctl -u instagram-downloader -f

# Restart backend
sudo systemctl restart instagram-downloader

# Check disk space
df -h

# Clean downloads manually
rm -rf /var/www/instagram-downloader/downloads/*
```

---

## 📊 Deployment Architecture

```
GitHub Repository
       ↓
GitHub Actions (on push to main)
       ↓
VPS (Ubuntu 24.04)
       ↓
┌─────────────────────────────────────┐
│ Nginx (Port 80/443)                 │
│   ├── Serves React static files     │
│   └── Proxies /api/* to backend     │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ Gunicorn (Port 8000)                │
│   ├── 4 workers                     │
│   ├── 10 threads each               │
│   └── = 40 concurrent downloads     │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│ FastAPI Backend                     │
│   ├── ThreadPoolExecutor (async)    │
│   └── yt-dlp (download engine)      │
└─────────────────────────────────────┘
```

---

## 🆘 Help & Support

**If something breaks:**
1. Check logs: `sudo journalctl -u instagram-downloader -n 100`
2. Check Nginx: `sudo nginx -t`
3. Restart services: `sudo systemctl restart instagram-downloader nginx`
4. Refer to troubleshooting section in `VPS_SETUP_GUIDE.md`

**Performance:**
- Can handle **10,000-20,000 users/day**
- **40 concurrent downloads** max
- Auto-cleanup keeps disk space free

**Scaling:**
- Need more capacity? Increase workers in `instagram-downloader.service`
- Edit line: `--workers 4` to `--workers 6` or `--workers 8`

---

## ✅ Checklist

After deployment, verify:
- [ ] Backend running: `sudo systemctl status instagram-downloader`
- [ ] Nginx running: `sudo systemctl status nginx`
- [ ] Website accessible: `http://YOUR_VPS_IP`
- [ ] API working: `http://YOUR_VPS_IP/api/health`
- [ ] GitHub Actions configured
- [ ] Cleanup cron job active: `crontab -l`
- [ ] Domain pointed (if applicable)
- [ ] Cloudflare configured (if applicable)

---

**🎉 You're all set!** Follow `VPS_SETUP_GUIDE.md` to get started.
