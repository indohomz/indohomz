# Hero Video Setup Guide

## Overview
The Hero component is a full-screen video background with a dark overlay, text content, and call-to-action buttons. It's designed to create a premium, modern first impression for the IndoHomz platform.

## File Structure
```
frontend/
├── public/
│   ├── hero.mp4           ← Add your video file here
│   └── images/
│       └── hero-fallback.jpg  ← Optional: fallback image
└── src/
    └── components/
        └── Hero.tsx       ← Video Hero component
```

## How to Add Your Video

### Step 1: Download Video
1. Go to **[Pexels.com](https://www.pexels.com)** or **[Mixkit.co](https://mixkit.co)**
2. Search for: `"Students Living"`, `"Modern Apartment"`, `"Happy Roommates"`, or `"Lifestyle Housing"`
3. Download a video (preferably 10–30 seconds, 1080p or higher)
4. Check that the video is in **MP4 format** (best browser compatibility)

### Step 2: Place the File
1. Save the video as `hero.mp4`
2. Move it to: `frontend/public/hero.mp4`
   
   On Windows PowerShell:
   ```powershell
   Copy-Item "C:\Downloads\your-video.mp4" -Destination "C:\Users\hp\Retail-Analytics-Platform\frontend\public\hero.mp4"
   ```

### Step 3: (Optional) Add Fallback Image
1. Take a screenshot from your video or find a matching image (1920×1080 or larger)
2. Save it as `hero-fallback.jpg`
3. Place it in: `frontend/public/images/hero-fallback.jpg`
4. The fallback displays if the video fails to load

### Step 4: Test Locally
```powershell
cd C:\Users\hp\Retail-Analytics-Platform
npm run dev
# Visit http://localhost:5173 and verify the video loads
```

## Component Features

### Dark Overlay
- `bg-black/40` creates a dark overlay (40% opacity) to ensure text readability
- Meets WCAG AA accessibility standards for contrast

### Animated Badge
- Green pulsing dot (`animate-ping`) signals "live" status
- Message: "Live in Gurgaon & Noida"
- Reinforces real-time platform activity

### Headline & Copy
- Gradient text: "Don't Just Rent. **Live The Experience.**"
- Subheadline emphasizes key value props: WiFi, housekeeping, community, zero brokerage

### Call-to-Action Buttons
1. **"Find My Room"** — Scrolls to `#properties` section
2. **"Explore Areas"** — Ready for future implementation

### Responsive Design
- Full height on desktop (`h-screen`)
- Optimized text sizing for mobile (`text-5xl` → `sm:text-7xl`)
- Flexible button layout (`flex-col` → `sm:flex-row`)

## Customization Options

### Change Headline
Edit `frontend/src/components/Hero.tsx`, line ~62:
```tsx
<h1 className="...">
  Don't Just Rent. <br />
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
    Live The Experience.  {/* Change this text */}
  </span>
</h1>
```

### Change Overlay Darkness
Edit line ~28:
```tsx
<div className="absolute top-0 left-0 h-full w-full bg-black/40 z-10" />
{/* bg-black/40 = 40% opacity. Change to bg-black/50 for darker, bg-black/30 for lighter */}
```

### Change Button Styles
Edit lines ~86 and ~95:
```tsx
<button className="group flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 ...">
{/* bg-blue-600 = blue. Try bg-indigo-600, bg-green-600, etc. */}
```

## Browser Support
- ✅ Chrome, Safari, Edge, Firefox (all modern versions)
- ✅ Mobile browsers (iOS Safari, Chrome Android)
- ⚠️ IE11 not supported (video tag + Tailwind CSS)

## Performance Notes
- **Video Size**: Keep videos under 20MB (reduces page load)
- **Duration**: 15–30 seconds optimal (loops smoothly)
- **Format**: MP4 (H.264 codec) for best compatibility
- **Compression**: Use [HandBrake](https://handbrake.fr/) (free) to compress large videos

## Troubleshooting

### Video doesn't load
- ✓ Verify file is at `frontend/public/hero.mp4`
- ✓ Check file format is MP4
- ✓ Try a different video file
- ✓ Run `npm run dev` and check browser console for errors

### Video plays but sound is audible
- The component has `muted` attribute, so audio should be silent
- Verify video file doesn't have audio or is muted in the source file

### Text is hard to read over video
- Increase overlay opacity: Change `bg-black/40` to `bg-black/50`
- Reduce video brightness or use a darker video

## Next Steps
1. **Download your hero video** from Pexels/Mixkit
2. **Place it at** `frontend/public/hero.mp4`
3. **Run** `npm run dev` and verify locally
4. **Take a screenshot** and send it to the founder 🚀

---

**Status:** Ready for video asset. Once uploaded, the Hero section will be fully functional.
