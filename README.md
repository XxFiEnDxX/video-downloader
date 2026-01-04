# Instagram Reel Downloader

A production-ready Instagram Reel downloader built with **FastAPI**, **yt-dlp**, and **React + TypeScript**. Optimized for **single-server deployment** - fast, simple, and cost-effective.

## Features

- ✅ **Production-ready** - Built with yt-dlp (industry standard)
- ✅ **Single-server architecture** - Frontend + Backend on one server
- ✅ **No authentication required** - Works for public reels
- ✅ **Fast downloads** - 5-6 seconds average
- ✅ **Modern stack** - FastAPI + React + TypeScript
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Easy deployment** - One command to build and deploy
- ✅ **No database** - Stateless architecture
- ✅ **Scalable** - Ready for Redis job queue when needed

## Architecture

```
Single Server (Port 8000)
├── FastAPI Backend
│   ├── /api/download  → Download endpoint
│   ├── /api/health    → Health check
│   └── /api           → API info
└── React Frontend (Static)
    └── /              → Served from /backend/static/
```

**Benefits:**
- 🚀 **Faster** - No network latency between frontend/backend
- 💰 **Cheaper** - Single server ($5-10/month)
- 🔧 **Simpler** - One server to manage
- 📈 **Better SEO** - Single domain, no CORS issues

## Tech Stack

**Backend:**
- **FastAPI** - Modern async Python web framework
- **yt-dlp** - Industry-standard downloader
- **Python 3.8+**

**Frontend:**
- **React 18** - Modern UI library
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool

## Quick Start

### Development Mode (Frontend + Backend Separate)

**1. Start Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 main.py
```
Backend runs on `http://localhost:8000`

**2. Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### Production Mode (Single Server)

**One-Command Build & Deploy:**
```bash
./build.sh && cd backend && python3 main.py
```

Or use the deploy script:
```bash
./deploy.sh
```

This will:
1. Install dependencies
2. Build React frontend
3. Copy build to `backend/static/`
4. Start server on port 8000

**Access:** `http://localhost:8000`

## Manual Build Steps

If you prefer manual control:

```bash
# 1. Build frontend
cd frontend
npm install
npm run build  # Outputs to ../backend/static/

# 2. Run backend
cd ../backend
pip install -r requirements.txt
python3 main.py
```

## Production Deployment

### Deploy to VPS (DigitalOcean, AWS, etc.)

1. **SSH into your server:**
```bash
ssh user@your-server-ip
```

2. **Clone repository:**
```bash
git clone https://github.com/yourusername/video-downloader.git
cd video-downloader
```

3. **Run build script:**
```bash
chmod +x build.sh
./build.sh
```

4. **Run with production server (Gunicorn):**
```bash
cd backend
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

5. **Setup process manager (keep server running):**

Using **systemd**:
```bash
sudo nano /etc/systemd/system/instagram-downloader.service
```

Add:
```ini
[Unit]
Description=Instagram Reel Downloader
After=network.target

[Service]
User=your-user
WorkingDirectory=/path/to/video-downloader/backend
ExecStart=/path/to/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl start instagram-downloader
sudo systemctl enable instagram-downloader  # Auto-start on boot
```

### Setup Nginx Reverse Proxy (Optional)

For HTTPS and domain name:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## API Endpoints

### GET /api
API information

**Response:**
```json
{
  "status": "ok",
  "message": "Instagram Reel Downloader API - Powered by yt-dlp",
  "version": "2.0.0"
}
```

### POST /api/download
Download Instagram reel

**Request:**
```json
{
  "url": "https://www.instagram.com/reel/SHORTCODE/"
}
```

**Response:** Video file (MP4)

### GET /api/health
Health check

**Response:**
```json
{
  "status": "healthy",
  "downloader": "yt-dlp"
}
```

## File Cleanup

Remove old downloaded files:

```bash
cd backend
python cleanup.py --hours 24  # Delete files older than 24h
python cleanup.py --dry-run   # Preview what will be deleted
```

**Schedule with cron:**
```bash
crontab -e
# Add: 0 3 * * * cd /path/to/backend && python cleanup.py --hours 24
```

## Scaling to 10K Users/Day

### Current Capacity
- **Single server**: Handles 2-3K users/day
- **Average download time**: 5-6 seconds
- **Good for**: MVP, testing, small-medium traffic

### When to Add Redis
Add Redis job queue when you reach ~2K users/day for:
- Async job processing
- Progress tracking
- Better concurrency handling
- Traffic spike management

**Architecture is already Redis-ready!**

## Troubleshooting

### Port 8000 already in use
```bash
lsof -ti:8000 | xargs kill -9
```

### Frontend not showing in production
```bash
# Check if static folder exists
ls backend/static/

# Rebuild frontend
cd frontend && npm run build
```

### CORS errors in development
- Backend should be on port 8000
- Frontend should be on port 5173
- CORS is enabled for localhost:5173

### Download fails
- Check if URL is from Instagram
- Ensure reel is public
- Check internet connection
- Instagram may be rate limiting (wait and retry)

## Advantages Over Other Solutions

✅ **No authentication** - Works without Instagram login
✅ **More reliable** - yt-dlp is actively maintained
✅ **Single server** - Faster and cheaper than microservices
✅ **Production-ready** - Used by professional services
✅ **Easy deployment** - One command to build & deploy
✅ **No database** - Stateless, no data to manage

## Project Structure

```
video-downloader/
├── backend/
│   ├── main.py              # FastAPI server + static file serving
│   ├── downloader.py        # yt-dlp wrapper
│   ├── cleanup.py           # File cleanup script
│   ├── requirements.txt     # Python dependencies
│   └── static/              # React build output (generated)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── downloads/               # Temporary video storage
├── build.sh                 # Build script
├── deploy.sh                # Build + deploy script
└── README.md
```

## Environment Variables

**Backend:**
- No environment variables required by default
- Optional: Set `ALLOWED_ORIGINS` for additional CORS origins

**Frontend:**
- No environment variables needed
- API calls use relative paths in production

## Cost Estimate

**For 10K users/day:**
- **VPS**: $10-20/month (DigitalOcean, Hetzner)
- **Bandwidth**: ~500GB/month ($5-10)
- **Domain**: $10/year
- **Total**: ~$20-30/month

**Free tier options:**
- Render.com (free tier, sleeps after inactivity)
- Railway (free $5/month credit)
- Fly.io (free tier available)

## Future Enhancements

- [ ] Add Redis job queue
- [ ] Progress tracking via WebSockets
- [ ] Cookie support for private content
- [ ] Proxy rotation
- [ ] Docker containerization
- [ ] Analytics dashboard
- [ ] Rate limiting

## Contributing

Contributions welcome! Please submit a Pull Request.

## License

MIT License - Free to use and modify.

## Legal Disclaimer

For educational purposes only. Users must respect content creators' rights and Instagram's terms of service. Download content you have permission to use.

## Support

For issues, open a GitHub issue.
