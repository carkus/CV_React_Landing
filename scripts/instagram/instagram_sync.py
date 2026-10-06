#!/usr/bin/env python3
"""Writes the latest Instagram posts to the site's data folder.

Runs on the droplet from cron (see README.md beside this file). Reads a
long-lived Instagram API token, renews it once a week so it never reaches its
60-day expiry, fetches the newest posts and writes them as
/data/instagram.json for InstagramSection.tsx to read.

Instagram's image URLs are signed and expire after a few days, so this must
keep running (hourly) rather than being run once. On any API error the
existing JSON is left in place and the script exits non-zero.

Standard library only, so it runs on a stock Ubuntu python3.
"""
import json
import os
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request

TOKEN_FILE = os.environ.get("IG_TOKEN_FILE", "/etc/instagram-feed/token")
OUT_FILE = os.environ.get("IG_OUT_FILE", "/var/www/carkus.com/data/instagram.json")
LIMIT = int(os.environ.get("IG_LIMIT", "12"))
REFRESH_AFTER_SECONDS = 7 * 24 * 3600
API = "https://graph.instagram.com"


def api_get(path, **params):
    url = f"{API}/{path}?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url, timeout=20) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        # Surface Instagram's own error body, not just the status code.
        raise SystemExit(f"Instagram API {path} failed: {e.code} {e.read().decode(errors='replace')}")


def write_atomic(path, text, mode=0o644):
    directory = os.path.dirname(path)
    os.makedirs(directory, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=directory)
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        f.write(text)
    os.chmod(tmp, mode)
    os.replace(tmp, path)


def load_token():
    with open(TOKEN_FILE, encoding="utf-8") as f:
        token = f.read().strip()
    # A long-lived token can be renewed once it is at least 24h old; doing it
    # weekly keeps it far from the 60-day expiry. The file's mtime records the
    # last renewal.
    if time.time() - os.path.getmtime(TOKEN_FILE) > REFRESH_AFTER_SECONDS:
        refreshed = api_get("refresh_access_token", grant_type="ig_refresh_token", access_token=token)
        token = refreshed["access_token"]
        write_atomic(TOKEN_FILE, token + "\n", mode=0o600)
        print("Token renewed", file=sys.stderr)
    return token


def main():
    token = load_token()
    me = api_get("me", fields="username", access_token=token)
    media = api_get(
        "me/media",
        fields="id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
        limit=LIMIT,
        access_token=token,
    )
    posts = []
    for m in media.get("data", []):
        # Videos expose a still in thumbnail_url; images and carousels (first
        # slide) use media_url.
        image = m.get("thumbnail_url") if m.get("media_type") == "VIDEO" else m.get("media_url")
        if not image:
            continue
        posts.append({
            "id": m["id"],
            "caption": m.get("caption", ""),
            "mediaType": m.get("media_type"),
            "imageUrl": image,
            "permalink": m["permalink"],
            "timestamp": m.get("timestamp"),
        })

    feed = {
        "username": me.get("username"),
        "updated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "posts": posts,
    }
    write_atomic(OUT_FILE, json.dumps(feed, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {len(posts)} posts to {OUT_FILE}", file=sys.stderr)


if __name__ == "__main__":
    main()
