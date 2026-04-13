# Productivity Tracker (Chrome Extension)

A minimal Manifest V3 extension that reads recent browser history and automatically sends it to `/tracker` as tasks.

## What it does

- Reads recent browsing history (configurable days + max items)
- Converts history rows into tracker task payloads
- Automatically dispatches `tracker-external-import` when you visit `/tracker` **without** a `#data=` hash
- Supports optional manual trigger from popup

## Install

### macOS (Chrome)

1. Open Chrome Extensions (`chrome://extensions/`)
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this folder: `chromium-extensions/tracker-history-extension`
5. (Optional) Pin the extension from the puzzle-menu for quick access

If you change extension files later, click **Reload** on the extension card.

### Android (Chrome)

Chrome on Android does **not** support desktop-style Chrome extensions (including unpacked extensions), so this extension cannot be installed there directly.

If you need Android support, use one of these alternatives:

- Use an Android browser that supports Chromium extensions
- Or keep using desktop Chrome for automatic history import and sync your tracker data using the tracker export/import flow

## Usage

1. Open extension popup once and configure days back, max tasks, and task type
2. Visit your tracker page (`/tracker/`) **without** `#data=` in the URL
3. Import runs automatically on page load

You can still use the manual popup import button as an override.

## Event contract

The extension dispatches:

- Event: `tracker-external-import`
- Detail:
  - `source?: string`
  - `showToasts?: boolean`
  - `tasks: Array<{ title: string; description?: string; type: "short" | "medium" | "long" }>`

Tracker remains the canonical state owner and validates/deduplicates before saving.
