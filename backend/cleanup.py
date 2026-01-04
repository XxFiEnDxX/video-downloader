#!/usr/bin/env python3
"""
Cleanup script to remove old downloaded files.

Usage:
    python cleanup.py [--hours HOURS] [--dry-run]

Examples:
    python cleanup.py --hours 24          # Delete files older than 24 hours
    python cleanup.py --hours 12 --dry-run  # Show what would be deleted
"""

import argparse
import shutil
import time
from pathlib import Path


def cleanup_old_files(download_dir: str = "../downloads", max_age_hours: int = 24, dry_run: bool = False):
    """
    Delete downloaded files older than max_age_hours.

    Args:
        download_dir: Directory containing downloaded files
        max_age_hours: Maximum age of files in hours
        dry_run: If True, only show what would be deleted without actually deleting
    """
    download_path = Path(download_dir)

    if not download_path.exists():
        print(f"Download directory does not exist: {download_path}")
        return

    current_time = time.time()
    max_age_seconds = max_age_hours * 3600
    deleted_count = 0
    total_size = 0

    print(f"Scanning {download_path} for files older than {max_age_hours} hours...")

    for item in download_path.iterdir():
        if not item.is_dir():
            continue

        # Get directory age
        dir_age = current_time - item.stat().st_mtime

        if dir_age > max_age_seconds:
            # Calculate directory size
            dir_size = sum(f.stat().st_size for f in item.rglob('*') if f.is_file())
            total_size += dir_size

            if dry_run:
                print(f"[DRY RUN] Would delete: {item.name} (age: {dir_age / 3600:.1f}h, size: {dir_size / 1024 / 1024:.2f}MB)")
            else:
                print(f"Deleting: {item.name} (age: {dir_age / 3600:.1f}h, size: {dir_size / 1024 / 1024:.2f}MB)")
                shutil.rmtree(item)

            deleted_count += 1

    if dry_run:
        print(f"\n[DRY RUN] Would delete {deleted_count} directories ({total_size / 1024 / 1024:.2f}MB total)")
    else:
        print(f"\nDeleted {deleted_count} directories ({total_size / 1024 / 1024:.2f}MB total)")


def main():
    parser = argparse.ArgumentParser(description="Cleanup old downloaded Instagram reels")
    parser.add_argument(
        "--hours",
        type=int,
        default=24,
        help="Delete files older than this many hours (default: 24)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be deleted without actually deleting"
    )
    parser.add_argument(
        "--dir",
        type=str,
        default="../downloads",
        help="Download directory path (default: ../downloads)"
    )

    args = parser.parse_args()

    cleanup_old_files(
        download_dir=args.dir,
        max_age_hours=args.hours,
        dry_run=args.dry_run
    )


if __name__ == "__main__":
    main()
