# 🎮 QRX — Complete User Guide

[← Back to README.md](README.md) | [👨‍💻 About Developer](ABOUT.md)

---

*Quick Navigation: [README](README.md) • [User Guide](#) • [About Developer](ABOUT.md)*
Fast • Beautiful • Private QR Tool  
Built with cyberpunk style by a 15-year-old developer from Nigeria.

---

## 📖 Table of Contents
- [Quick Start](#quick-start)
- [Generate QR Codes](#generate-qr-codes)
- [Live Camera Scan](#live-camera-scan)
- [Decode from Images](#decode-from-images)
- [Install as App (PWA)](#install-as-app-pwa)
- [Behind the Scenes](#behind-the-scenes)
- [Troubleshooting](#troubleshooting)
- [About the Developer](#about-the-developer)

---

## 🚀 Quick Start

1. Open QRX: [https://desmond845.github.io/QRX/](https://desmond845.github.io/QRX/)
2. Choose a mode from the bottom navigation:
   - 🔳 Generate — Create QR codes
   - 📷 Camera — Scan live with your camera
   - 🖼️ Image — Upload a photo/screenshot to decode

No login. No ads. Works offline after first load.

---

## 🔳 Generate QR Codes

### How to Use
1. Type or paste anything in the input box:
   - URLs, text, Wi-Fi passwords, contact info, crypto addresses...
2. QR code updates in real-time as you type
3. Optional: Upload a logo/image to appear in the center
4. Click Download PNG to save

### Features
- High error correction (scans even if damaged)
- Custom logo support
- Cyberpunk neon styling
- Auto filename with timestamp

---

## 📷 Live Camera Scan

### How to Use
1. Allow camera permission
2. Point at any QR code
3. Watch the glowing scan line and particles
4. When detected → success sound + result modal

### Cool Effects
- Glowing cyan scan line with particles
- Pulsing border
- Vibration feedback on success
- Auto-flip for front camera

---

## 🖼️ Decode from Images

### How to Use
1. Drag & drop an image or click to upload
2. Watch the scan line move across
3. Progress messages:
   - Scanning... (0–30s)
   - Trying harder... (30–45s)
   - Result or "No QR found" (after 45s)

### Features
- Multiple detection methods (normal, enhanced, inverted)
- Works with blurry, damaged, or low-contrast QRs
- Retry button on failure
- Copy button in success modal

---

## 📱 Install as App (PWA)

QRX works like a native app!

### Android (Chrome)
1. Visit QRX
2. Tap menu → "Install app"
3. Add to home screen

### iPhone (Safari)
1. Visit QRX
2. Tap Share → "Add to Home Screen"
3. Name it "QRX" → Add

### Benefits
- Fullscreen (no browser bar)
- Offline access
- Home screen icon
- Fast launch

---

## 🔧 Behind the Scenes

### Tech Stack (Vanilla — No Frameworks)
- QR Code Styling — Beautiful QR generation
- QrScanner — Fast camera detection (WebAssembly)
- jsQR — Pure JS image decoding
- Canvas — All animations and effects
- Service Worker — Offline PWA support

### Key Features Explained
- Real-time generation with debouncing
- Smart camera detection (back vs front)
- 60 FPS scan line animation
- Multiple fallback scanning methods
- Touch-friendly mobile UX

---

## ❓ Troubleshooting

Camera not working?
- Allow permission in browser
- Try different browser (Chrome best)
- Close other apps using camera

QR not scanning?
- Better lighting
- Hold steady 10–30cm away
- Clean lens
- For images: try cropping to QR

App not installing?
- Must be on HTTPS
- Use Chrome (Android) or Safari (iOS)

---

## 👨‍💻 About the Developer

Hey, I'm Desmond — 15 years old from Nigeria.

Started coding in March 2025.  
In 9 months I built:
- CipherX (encryption tool)
- GrowthGrid (habit tracker)
- QRX (this app!)

Why QRX?
- Wanted a fast, beautiful QR tool
- Love cyberpunk aesthetics
- Believe in privacy and open source

Connect with me:
- GitHub: [github.com/desmond845](https://github.com/desmond845)
- Email: akugbedesmond845@gmail.com

Support the project:
- Star on GitHub ⭐
- Share with friends
- Try my other tools

---

> "Built with passion, not perfection.  
> Technology should be beautiful, fast, and free."

Happy scanning! 🚀

— Desmond, DaxTech.
