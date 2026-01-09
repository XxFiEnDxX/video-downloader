#!/bin/bash

# ========================================
# Auto-cleanup script for downloaded videos
# Deletes videos older than specified hours
# ========================================

# CONFIGURABLE VARIABLE - Change this value as needed
HOURS_TO_KEEP=24

# Directory containing downloads
DOWNLOADS_DIR="/var/www/instagram-downloader/downloads"

# Log file
LOG_FILE="/var/log/instagram-downloader-cleanup.log"

# Current timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$TIMESTAMP] Starting cleanup - Deleting videos older than $HOURS_TO_KEEP hours" >> "$LOG_FILE"

# Check if downloads directory exists
if [ ! -d "$DOWNLOADS_DIR" ]; then
    echo "[$TIMESTAMP] ERROR: Downloads directory not found: $DOWNLOADS_DIR" >> "$LOG_FILE"
    exit 1
fi

# Count files before cleanup
BEFORE_COUNT=$(find "$DOWNLOADS_DIR" -type f 2>/dev/null | wc -l)

# Delete files and directories older than specified hours
# -type f: files only
# -type d: directories
# -mtime +0: modified more than N hours ago (converted from hours to days)
DAYS=$(echo "scale=2; $HOURS_TO_KEEP / 24" | bc)

# Delete old files
find "$DOWNLOADS_DIR" -type f -mmin +$((HOURS_TO_KEEP * 60)) -delete 2>&1 | tee -a "$LOG_FILE"

# Delete empty directories
find "$DOWNLOADS_DIR" -type d -empty -delete 2>&1 | tee -a "$LOG_FILE"

# Count files after cleanup
AFTER_COUNT=$(find "$DOWNLOADS_DIR" -type f 2>/dev/null | wc -l)
DELETED_COUNT=$((BEFORE_COUNT - AFTER_COUNT))

echo "[$TIMESTAMP] Cleanup complete - Deleted $DELETED_COUNT files (Before: $BEFORE_COUNT, After: $AFTER_COUNT)" >> "$LOG_FILE"

# Optional: Delete log entries older than 30 days to prevent log bloat
find "$LOG_FILE" -type f -mtime +30 -delete 2>/dev/null

exit 0
