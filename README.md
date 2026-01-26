# Watcher

Watcher is an Android behavior analysis app built using Expo and React Native.
It provides structured, filtered access to Android UsageStats data for understanding real user app usage patterns.

## Why Watcher exists

Android already collects detailed app usage data at the system level, but this data is:
- Protected by permissions
- Extremely noisy
- Difficult to interpret directly
- Not suitable for analytics or AI training without preprocessing

Watcher acts as a **trusted bridge** between Android’s system-level usage logs and higher-level behavior analysis.

## What Watcher does (Current phase)

Watcher:
- Requests and manages Android Usage Access permission
- Queries historical app usage events (foreground/background)
- Filters out system noise (launcher, keyboard, system UI, etc.)
- Converts raw events into meaningful **usage sessions**
- Discards accidental or impulsive app opens (e.g. < 3 seconds)
- Supports querying usage data for arbitrary time windows (e.g. last 1 hour, last 24 hours)

## What Watcher does NOT do (by design)

- It does not continuously monitor apps in the background
- It does not run persistent services
- It does not spy on user content
- It does not track keystrokes or screen contents

Watcher relies on Android’s existing system logs instead of live monitoring.

## Core Concepts

### Usage Events
Android logs when apps move to:
- Foreground
- Background

Watcher queries these events using `expo-android-usagestats`.

### Sessionization
A usage session is defined as:
- MOVE_TO_FOREGROUND → MOVE_TO_BACKGROUND
- Same package name
- Duration ≥ threshold (default: 3 seconds)

### Noise Filtering
The following are excluded:
- System UI
- Launchers
- Keyboard
- Permission dialogs
- Watcher itself
- Developer / Expo tooling

This ensures the data reflects **intentional human behavior**, not system activity.

## Example Output

```json
{
  "packageName": "com.instagram.android",
  "startTime": 1769230931094,
  "endTime": 1769231164021,
  "duration": 232927
}
