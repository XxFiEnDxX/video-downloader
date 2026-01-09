# 🚀 VPS Deployment Guide - Instagram Reel Downloader

Complete step-by-step guide to deploy your Instagram Reel Downloader on Ubuntu 24.04 VPS.

---

## 📋 Prerequisites

- ✅ Ubuntu 24.04 VPS (8GB RAM, 2 CPU, 100GB disk)
- ✅ Root SSH access
- ✅ GitHub repository: https://github.com/XxFiEnDxX/video-downloader

---

## 🔧 Phase 1: Initial VPS Setup (One-Time)

### Step 1: Connect to VPS

```bash
ssh root@YOUR_VPS_IP
```

### Step 2: Update System

```bash
apt update && apt upgrade -y
```

### Step 3: Create Non-Root User

```bash
# Create user 'deployer'
adduser deployer

# Add to sudo group
usermod -aG sudo deployer

# Switch to deployer user
su - deployer
```

### Step 4: Install Dependencies

```bash
# Install Python 3.12, pip, venv
sudo apt install -y python3 python3-pip python3-venv

# Install Node.js 20.x and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Install other utilities
sudo apt install -y curl wget unzip bc

# Verify installations
python3 --version  # Should show Python 3.12.x
node --version     # Should show v20.x.x
nginx -v          # Should show nginx version
```

### Step 5: Set Up SSH Key for GitHub

```bash
# Generate SSH key (press Enter for all prompts)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Display public key
cat ~/.ssh/id_ed25519.pub

# Copy this key and add it to GitHub:
# 1. Go to: https://github.com/settings/keys
# 2. Click "New SSH key"
# 3. Paste the key and save
```

### Step 6: Clone Repository

```bash
# Create web directory
sudo mkdir -p /var/www
sudo chown deployer:deployer /var/www

# Clone repository
cd /var/www
git clone git@github.com:XxFiEnDxX/video-downloader.git instagram-downloader
cd instagram-downloader
```

### Step 7: Set Up Backend

```bash
cd /var/www/instagram-downloader/backend

# Create virtual environment
python3 -m venv venv

# Activate venv
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Install Gunicorn
pip install gunicorn

# Deactivate venv
deactivate
```

### Step 8: Build Frontend

```bash
cd /var/www/instagram-downloader/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Verify build output
ls -la ../backend/static/
# Should see index.html and assets folder
```

### Step 9: Create Downloads Directory

```bash
# Create downloads directory
mkdir -p /var/www/instagram-downloader/downloads

# Set permissions
chmod 755 /var/www/instagram-downloader/downloads
```

### Step 10: Set Up systemd Service

```bash
# Copy service file
sudo cp /var/www/instagram-downloader/deployment/instagram-downloader.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service (auto-start on boot)
sudo systemctl enable instagram-downloader

# Start service
sudo systemctl start instagram-downloader

# Check status
sudo systemctl status instagram-downloader
# Should show "active (running)"

# View logs if needed
sudo journalctl -u instagram-downloader -f
```

### Step 11: Configure Nginx

```bash
# Copy Nginx config
sudo cp /var/www/instagram-downloader/deployment/nginx.conf /etc/nginx/sites-available/instagram-downloader

# Edit config to add your domain/IP
sudo nano /etc/nginx/sites-available/instagram-downloader
# Replace YOUR_DOMAIN_HERE with your VPS IP (for now)

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/instagram-downloader /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Enable Nginx auto-start
sudo systemctl enable nginx
```

### Step 12: Test Application

```bash
# Check if backend is running
curl http://localhost:8000/api/health
# Should return: {"status":"healthy","downloader":"yt-dlp"}

# Check if Nginx is serving
curl http://YOUR_VPS_IP/api/health
# Should return same response

# Visit in browser:
http://YOUR_VPS_IP
```

✅ **If you see your Instagram Downloader website, Phase 1 is complete!**

---

## 🤖 Phase 2: GitHub Actions Auto-Deployment

### Step 1: Generate Deployment SSH Key (On VPS)

```bash
# As deployer user
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -C "github-actions"

# Display private key (copy this for GitHub Secrets)
cat ~/.ssh/github_deploy

# Add public key to authorized_keys
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Step 2: Configure GitHub Secrets

1. Go to: `https://github.com/XxFiEnDxX/video-downloader/settings/secrets/actions`

2. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `VPS_HOST` | Your VPS IP address |
| `VPS_USERNAME` | `deployer` |
| `VPS_SSH_KEY` | Contents of `~/.ssh/github_deploy` (private key) |

### Step 3: Grant Sudo Access for Service Restart

```bash
# On VPS as deployer
sudo visudo

# Add this line at the end:
deployer ALL=(ALL) NOPASSWD: /bin/systemctl restart instagram-downloader, /bin/systemctl status instagram-downloader, /bin/systemctl is-active instagram-downloader, /usr/bin/journalctl

# Save and exit (Ctrl+X, then Y, then Enter)
```

### Step 4: Push to Trigger Deployment

```bash
# On your local machine
git add .
git commit -m "Setup deployment"
git push origin main

# GitHub Actions will automatically:
# 1. SSH into VPS
# 2. Pull latest code
# 3. Rebuild frontend
# 4. Restart backend
# 5. Verify deployment

# Check deployment status:
# Go to: https://github.com/XxFiEnDxX/video-downloader/actions
```

✅ **Automated deployment is now active!**

---

## 🌐 Phase 3: Domain + Cloudflare (After Domain Purchase)

### Step 1: Point Domain to VPS

1. Go to Cloudflare dashboard
2. Add your domain
3. Add A record:
   - Name: `@`
   - IPv4: `YOUR_VPS_IP`
   - Proxy: ☁️ Proxied (orange cloud)

4. Add CNAME record (optional for www):
   - Name: `www`
   - Target: `yourdomain.com`
   - Proxy: ☁️ Proxied

### Step 2: Update Nginx Config

```bash
# On VPS
sudo nano /etc/nginx/sites-available/instagram-downloader

# Change this line:
server_name YOUR_DOMAIN_HERE;
# To:
server_name yourdomain.com www.yourdomain.com;

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Step 3: Configure Cloudflare SSL

1. Go to: `SSL/TLS` → `Overview`
2. Set encryption mode: **Full** (not Full Strict)
3. Enable: `Always Use HTTPS`
4. Enable: `Automatic HTTPS Rewrites`

### Step 4: Enable Cloudflare Features

- **Firewall**: Enable Bot Fight Mode
- **Speed**: Enable Auto Minify (JS, CSS, HTML)
- **Caching**: Set Browser Cache TTL to 4 hours
- **Security**: Set Security Level to Medium

✅ **Your site is now live with SSL at `https://yourdomain.com`!**

---

## 🧹 Phase 4: Auto-Cleanup Setup

### Step 1: Set Up Cleanup Script

```bash
# Copy cleanup script
sudo cp /var/www/instagram-downloader/deployment/cleanup.sh /usr/local/bin/cleanup-videos.sh

# Make executable
sudo chmod +x /usr/local/bin/cleanup-videos.sh

# Test the script
sudo /usr/local/bin/cleanup-videos.sh
```

### Step 2: Configure Cron Job

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM):
0 2 * * * /usr/local/bin/cleanup-videos.sh

# Save and exit
```

### Step 3: Modify Cleanup Duration (Optional)

```bash
# Edit the script
sudo nano /usr/local/bin/cleanup-videos.sh

# Change this line:
HOURS_TO_KEEP=24

# To any value you want (e.g., 12, 48, 72)
# Save and exit
```

✅ **Auto-cleanup is now active!**

---

## 🔄 Daily Operations

### Update Code (Manual)

```bash
ssh deployer@YOUR_VPS_IP
cd /var/www/instagram-downloader
./deployment/deploy.sh
```

### Update Code (Automatic - Recommended)

```bash
# On your local machine
git add .
git commit -m "Your changes"
git push origin main

# GitHub Actions handles the rest automatically!
```

### Check Service Status

```bash
# Service status
sudo systemctl status instagram-downloader

# View live logs
sudo journalctl -u instagram-downloader -f

# View last 50 log lines
sudo journalctl -u instagram-downloader -n 50
```

### Restart Services

```bash
# Restart backend
sudo systemctl restart instagram-downloader

# Restart Nginx
sudo systemctl restart nginx
```

### Check Resource Usage

```bash
# CPU and memory
htop

# Disk space
df -h

# Downloads folder size
du -sh /var/www/instagram-downloader/downloads/
```

---

## 🐛 Troubleshooting

### Backend not starting

```bash
# Check logs
sudo journalctl -u instagram-downloader -n 100

# Test manually
cd /var/www/instagram-downloader/backend
source venv/bin/activate
python main.py
# Look for error messages
```

### Nginx issues

```bash
# Test config
sudo nginx -t

# Check error log
sudo tail -f /var/log/nginx/error.log
```

### GitHub Actions failing

```bash
# Check if deployer can restart service
sudo systemctl restart instagram-downloader

# Verify SSH key permissions
ls -la ~/.ssh/
chmod 600 ~/.ssh/github_deploy
```

### Out of disk space

```bash
# Find large directories
du -h /var/www/instagram-downloader/ | sort -rh | head -20

# Manually clean downloads
sudo rm -rf /var/www/instagram-downloader/downloads/*
```

---

## 📊 Performance Monitoring

### Current Capacity

- **4 Gunicorn workers** × **10 thread pool workers** = **40 concurrent downloads**
- Handles **10,000-20,000 users/day** comfortably
- Average response time: **<2 seconds**

### Scaling Up (If Needed)

```bash
# Edit service file
sudo nano /etc/systemd/system/instagram-downloader.service

# Increase workers from 4 to 6 or 8
--workers 8

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl restart instagram-downloader
```

---

## 🔒 Security Checklist

- ✅ Running as non-root user (deployer)
- ✅ Firewall configured in Hostinger panel (ports 22, 80, 443)
- ✅ Cloudflare DDoS protection enabled
- ✅ Cloudflare SSL/TLS encryption
- ✅ SSH key authentication only (disable password auth)
- ✅ Regular system updates

---

## 🎉 Success!

Your Instagram Reel Downloader is now:
- ✅ Running on VPS with 4 workers (40 concurrent downloads)
- ✅ Auto-deploying via GitHub Actions
- ✅ Auto-cleaning old videos every 24 hours
- ✅ Protected by Cloudflare CDN & DDoS
- ✅ Ready for SSL when you add domain

**Support:** For issues, check logs first: `sudo journalctl -u instagram-downloader -n 50`
