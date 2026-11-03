# 🎟️ Eventora: KIIT Student Activity Centre (KSAC) Event & Pass Hub

> A modern, responsive, and feature-packed web application built with **HTML5, CSS3, and Modern JavaScript**. Dedicated exclusively to **Kalinga Institute of Industrial Technology (KIIT)**, showcasing premier events hosted by **KSAC (KIIT Student Activity Centre)** and active university student societies. Includes instant high-resolution PNG digital pass downloads, real-time live countdowns, robust form validation, and LocalStorage ticket management.

---

## 📌 Overview & Campus Context

**Eventora** serves as the central digital event discovery and entry pass gateway for **Kalinga Institute of Industrial Technology (KIIT)**, Bhubaneswar. It brings together all events organized by the **KIIT Student Activity Centre (KSAC)** and official student societies across technology, music, entrepreneurship, athletics, performing arts, quizzing, and robotics.

**Eventora** enables KIITians and campus visitors to:
1. **Discover** upcoming campus fests, hackathons, and tournaments across university campuses (Campus 6, 7, 8, 11, 13, 15, 16, 3).
2. **Search & Filter** events in real-time by keyword, society (KRS, Konnexions, Korus, Kalakar, Qutopia...), domain, format, and pricing.
3. **Inspect Comprehensive Details** including full schedules, student leads, keynote guests, and venue locations.
4. **Register with Instant Validation** using an accessible form with live validation feedback.
5. **Download & Manage Digital Entry Passes** stored securely in browser `localStorage`, with instant high-resolution PNG download, scannable QR verification, print/PDF capabilities, and cancellation options.

---

## 🌟 Key Features

### 1. 🚀 Engaging Hero & Spotlight Experience
- **Hero Banner**: Animated floating pill badges, high-impact typography, embedded instant search, and platform statistics (25+ Societies, 40+ Campus Events, 30,000+ KIITians).
- **Weekly Spotlight Event**: Dedicated glassmorphic spotlight card highlighting the premier flagship event of the week (e.g. *KIIT Fest 2026: Star Night*).
- **⚡ Live Countdown Timers**: Real-time ticker counting down Days, Hours, Minutes, and Seconds with pulsating active indicators.

### 2. 🔍 Real-Time Search & Multi-Criteria Filtering
- **Live Keyword Search**: Instant filtering by event title, society (KRS, Konnexions, Korus, Kalakar, Qutopia...), venue, and tags.
- **Category Pills**: One-click filtering across university domains:
  - 💻 Technology & AI (Konnexions, KRS)
  - 🎵 Music & Concerts (Korus, KIIT Fest Star Night)
  - 💼 Business & Startups (KIIT E-Cell, KIIT-TBI)
  - ⚽ Sports & Esports (Athletic Board, K-Gamerz)
  - 🎨 Arts & Culture (Kalakar, Kreative)
  - 🧠 Workshops & Seminars (Qutopia, Kronicle, K-LARISS)
- **Advanced Controls**:
  - **Format Filter**: All, In-Person, Virtual, Hybrid.
  - **Price Filter**: All, Free Only, Paid Passes.
  - **Sorting**: Date (Soonest first), Popularity (% capacity booked), Alphabetical (A-Z).
  - **View Switcher**: Toggle between responsive Grid View and List View.
  - **Saved Wishlist (❤️)**: Instant filter showing only bookmarked events.

### 3. 📋 Comprehensive Event Details Modal
- Full cover hero with category and format badges.
- Time remaining countdown strip.
- 4-column quick facts grid (Date & Time, Venue, Duration, Ticket Tier).
- Detailed description, key perks & highlights.
- Interactive timeline / schedule breakdown.
- Keynote speakers / faculty coordinator cards with photos and titles.
- Social sharing (one-click copy of event link).

### 4. ✍️ Robust Form Validation Engine
- **Full Name**: Strict alphabetic verification (minimum 3 characters, no symbols or digits).
- **Email Address**: RFC-compliant regular expression check.
- **Mobile Number**: Standard 10-digit mobile number pattern validation.
- **Selected Event & Ticket Tier**: Dropdown selection with automatic event pre-selection.
- **Ticket Quantity**: Configurable (1 to 5 attendees).
- **Terms & Conduct Agreement**: Checkbox verification.
- **Validation Feedback**:
  - Real-time `blur` and `input` validation indicators.
  - Green border and checkmarks for valid fields.
  - Red highlighting, accessible error messages, and attention-drawing shake animation on invalid inputs.

### 5. 🎫 Digital Pass & High-Resolution Image Download Engine
- **Boarding Pass Aesthetic**: Perforated tear line, corner cutouts, barcodes, and official KSAC branding.
- **Instant PNG Pass Download**: Built-in 2x High-DPI HTML5 canvas renderer that draws and downloads an authentic, scannable digital boarding pass directly to your device (`Eventora-Pass-[ID].png`).
- **Deterministic SVG QR Code**: Dynamically generated QR matrix uniquely bound to the booking reference ID (e.g. `EVT-784192`).
- **"My Passes" Modal**: Accessible anytime via the navbar badge to review all active bookings.
- **Print / Save as PDF**: Print-ready media stylesheet (`@media print`) that isolates and formats the pass for clean physical printing or PDF export.
- **Booking Cancellation**: Easy pass revocation with instant `localStorage` synchronization.

### 6. 🌓 Dark / Light Mode
- Seamless theme toggle in the header navigation.
- CSS Custom Properties with vibrant KIIT Emerald & Cyber Ocean Blue light and dark palettes.
- Automatically persists the user's preference in `localStorage`.
- Respects the operating system's `prefers-color-scheme` if no prior choice was saved.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Structure** | HTML5 | Semantic markup, ARIA roles, accessible forms, meta viewport |
| **Styling** | CSS3 & Custom Properties | Modern KIIT Emerald/Teal palette, CSS Grid, Flexbox, Glassmorphism, Print stylesheet |
| **Icons & Fonts** | Font Awesome 6.5 & Google Fonts | *Plus Jakarta Sans* & *Outfit* for modern typography |
| **Logic & State** | Vanilla Modern JavaScript (ES6+) | Event delegation, DOM manipulation, custom events |
| **Canvas Graphics** | HTML5 Canvas API | High-DPI offline pass image generator & PNG downloader |
| **Storage** | Browser `localStorage` API | Persistent storage for registrations, bookmarks, and theme |
| **Version Control** | Git & GitHub | Semantic commit history and clean branching |

---

## 📂 Project Architecture

```
eventora/
├── index.html              # Main single-page application entry point
├── .gitignore              # Ignored operating system and temporary files
├── README.md               # Detailed project documentation
├── css/
│   ├── style.css           # Core styling, design tokens, layout & responsive queries
│   ├── animations.css      # Keyframes, pulse dots, shake animations & toasts
│   └── ticket.css          # Digital boarding pass card, QR presentation & print rules
└── js/
    ├── data.js             # 12 authentic KIIT & KSAC events dataset
    ├── storage.js          # LocalStorage abstractions for bookings, bookmarks, theme
    ├── countdown.js        # Dynamic countdown timers & time remaining formatting
    ├── ticket.js           # Digital pass rendering, QR generator & PNG canvas downloader
    ├── validation.js       # Real-time form input validation rules & visual errors
    └── app.js              # Application orchestrator, search/filter, modals, and toasts
```

---

## 🚀 Getting Started

1. Clone or download the repository.
2. Open `index.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
3. No build tools, compilers, or server installations are required! All libraries are loaded via CDN or rendered client-side.
