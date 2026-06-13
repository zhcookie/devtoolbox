# I Built 32 Free Browser-Based Developer Tools — No Signup, No Server Uploads

It started as a simple JSON formatter. One tool led to another, and before I knew it I had built an entire **online developer toolbox** — 32 tools that run entirely in the browser. No data leaves your computer. No accounts. No paywalls. Just pure client-side processing.

## 🔗 [Check it out: DevTools Toolbox](https://devtoolbox-53g.pages.dev/)

---

## 🛠️ The Full Tool Collection

### 📝 Formatters & Validators
- **JSON Formatter** — Pretty-print, validate, and minify JSON with tree view
- **Code Formatter** — Format HTML, CSS, and JavaScript with syntax highlighting
- **Markdown Preview** — Live preview with GitHub-flavored markdown support

### 🔐 Encoders & Decoders
- **Base64 Encoder/Decoder** — Encode and decode Base64 strings instantly
- **URL Encoder/Decoder** — Handle URL parameters without breaking
- **Unicode Converter** — Convert between Unicode, emoji, and escape sequences
- **HTML Entity Encoder/Decoder** — Escape and unescape HTML entities
- **JWT Decoder** — Decode JWT tokens and inspect header/payload/signature

### 🎨 Image & Color Tools
- **QR Code Generator** — Generate customizable QR codes, download as PNG
- **Image Compressor** — Compress PNG and JPG with quality control, entirely in-browser
- **Image to Base64** — Convert any image to a Base64 data URI
- **Color Picker** — Pick, convert, and copy colors in HEX/RGB/HSL
- **Palette Generator** — Generate harmonious color palettes
- **Video to GIF** — Convert video clips to animated GIFs
- **Meme Generator** — Add text to images and create memes
- **ASCII Art Generator** — Convert images to ASCII art
- **SVG Editor** — Edit SVG code with live preview

### ✍️ Text Tools
- **Text Diff Checker** — Compare two texts side by side with highlighted diffs
- **Word Counter** — Count words, characters, sentences, and reading time
- **Lorem Ipsum Generator** — Generate placeholder text of any length
- **Regex Tester** — Test regular expressions with match highlighting

### 🔢 Generators & Converters
- **UUID Generator** — Generate UUID v1/v4 in bulk
- **Password Generator** — Generate secure passwords with custom rules
- **Timestamp Converter** — Convert between Unix timestamps and human-readable dates
- **Number Base Converter** — Convert between binary, octal, decimal, and hex
- **Unit Converter** — Convert length, weight, temperature, and more
- **Cron Expression Parser** — Parse and explain cron schedules
- **URL Parser** — Break down URLs into protocol, host, path, and query params

### 📦 File & Productivity
- **PDF Merger** — Combine multiple PDFs into one, no upload needed
- **File Hash Calculator** — Compute MD5, SHA-1, SHA-256 of any file locally
- **Pomodoro Timer** — 25-minute focus timer with break reminders

---

## 💡 Why I Built This

Every developer has been there — you Google "JSON formatter," land on some ad-ridden site, paste your data, and immediately wonder: **"Wait, did I just upload sensitive API response data to some random server?"**

I wanted tools where:

1. **Everything runs client-side** — The code never leaves your browser. JSON formatting, image compression, PDF merging — all JavaScript, all local.

2. **No signup required** — Open the page, use the tool, close the tab. That's it.

3. **Zero cost, forever** — No premium tiers, no feature gates. Hosted on Cloudflare Pages (free tier), domain included.

4. **Works offline** — The entire site is a PWA with a service worker. Once loaded, most tools work without internet.

---

## 🏗️ Tech Stack

- **Pure Vanilla JS** — No React, no Vue, no framework overhead. Each tool is a standalone HTML file.
- **Cloudflare Pages** — Hosting and CDN with instant deploys via Wrangler CLI
- **Service Worker** — PWA support for offline usage
- **Dark/Light Theme** — CSS custom properties for theming

The beauty of keeping it simple: the entire site is **under 100KB per tool**, loads near-instantly from any Cloudflare edge node, and has zero dependencies to maintain.

---

## 🚀 What's Next

I'm actively adding more tools. On the roadmap:
- **RSA/ECDSA Key Generator** — Generate public/private key pairs in-browser
- **JSON to TypeScript** — Auto-generate TypeScript types from JSON
- **Diff Viewer for Images** — Visual diff between two images
- **i18n** — Multi-language support

---

## 📢 Try It Out

**[devtoolbox-53g.pages.dev](https://devtoolbox-53g.pages.dev/)** — bookmark it, share it, and let me know what tools you'd like to see next!

---

*All 32 tools are free, open in your browser, and never send your data anywhere. Built for developers who care about privacy and speed.*
