/**
 * Eventora Events Dataset
 * Exclusive events occurring at Kalinga Institute of Industrial Technology (KIIT)
 * Organized by KIIT Student Activity Centre (KSAC) & University Student Societies
 */

// Helper to generate dynamic future dates relative to current execution time
function getFutureDate(daysAhead, hours = 10, minutes = 0) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
}

const EVENTS_DATA = [
    {
        id: "kiit-01",
        title: "KIIT Fest 2026: Star Night & Mega Cultural Carnival",
        tagline: "Eastern India's Premier University Fest: Celebrity Concert, EDM Arena & Food Village",
        category: "music",
        categoryLabel: "Music & Concerts",
        format: "in-person",
        formatLabel: "In-Person (Campus Arena)",
        date: getFutureDate(4, 18, 0),
        displayDate: "4 Days Ahead • 6:00 PM",
        duration: "3 Days",
        venue: "Campus 13 International Cricket Stadium & Grounds, KIIT",
        locationCity: "KIIT Deemed to be University, Bhubaneswar",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        priceDisplay: "FREE FOR KIITIANS",
        spotsTotal: 15000,
        spotsBooked: 12850,
        featured: true,
        spotlight: true,
        rating: 4.95,
        organizer: "KSAC (KIIT Student Activity Centre) & Cultural Affairs Council",
        description: "KIIT Fest is eastern India's biggest annual collegiate cultural and technical extravaganza. Held across the sprawling KIIT grounds, Star Night brings together over 15,000 students for sensational headline concerts by India's top indie and Bollywood artists, high-voltage DJ dance sets, laser light spectacles, and 50+ artisan food stalls.",
        highlights: [
            "Headline star performance on the Campus 13 mega stage",
            "Pyrotechnic visual laser array and live electronic DJ arena",
            "Entry restricted to registered KIIT & KISS students with valid digital pass",
            "Complimentary LED glow wristbands at gate checkpoints"
        ],
        agenda: [
            { time: "Day 1 - 06:00 PM", title: "Grand Inauguration & Traditional Odia Cultural Gala" },
            { time: "Day 2 - 07:00 PM", title: "National Indie Rock & Fusion Band Showcase" },
            { time: "Day 3 - 08:00 PM", title: "Celebrity Star Night & Neon EDM Dance Festival" }
        ],
        speakers: [
            { name: "Dr. Achyuta Samanta", role: "Founder, KIIT & KISS (Chief Patron)", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
            { name: "DJ Shirley & The Beats", role: "Headline Star Artist & Producer", avatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["KIITFest", "KSAC", "StarNight", "Concert", "Cultural", "Free"]
    },
    {
        id: "kiit-02",
        title: "Konnexions HackCon 2026: 36-Hour National Campus Hackathon",
        tagline: "36 Hours of Collaborative Coding, AI/ML Challenges & ₹2,00,000 Prize Pool",
        category: "technology",
        categoryLabel: "Technology & AI",
        format: "hybrid",
        formatLabel: "Hybrid (Campus 6 & Online)",
        date: getFutureDate(7, 9, 30),
        displayDate: "7 Days Ahead • 9:30 AM",
        duration: "36 Hours",
        venue: "Auditorium Hall & Labs, Campus 6 (KSAC Building), KIIT",
        locationCity: "KIIT Deemed to be University, Bhubaneswar",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        priceDisplay: "FREE",
        spotsTotal: 450,
        spotsBooked: 380,
        featured: true,
        spotlight: false,
        rating: 4.9,
        organizer: "Konnexions - The Official Web & IT Society of KIIT",
        description: "Organized by Konnexions, KIIT's premier web and IT society, HackCon 2026 invites student coders to build impactful real-world software across Web3, Generative AI, Cloud Native architectures, and HealthTech. Enjoy midnight pizza sessions, mentorship from KIIT alumni at top tech firms, and fast-track hiring interviews.",
        highlights: [
            "₹2,00,000+ Cash Prize Pool and sponsored developer grants",
            "Mentorship rounds by KIIT alumni from Google, Microsoft, and Amazon",
            "High-speed 1 Gbps campus gigabit Wi-Fi & midnight RedBull refueling lounge",
            "Special sponsor bounties for best AI agent & Web3 dApp"
        ],
        agenda: [
            { time: "Day 1 - 09:30 AM", title: "Problem Statement Reveal & Team Alignment" },
            { time: "Day 1 - 01:00 PM", title: "Hacking Sprint 1 & Architecture Guidance" },
            { time: "Day 1 - 09:00 PM", title: "Midnight Code Check-in & Snack Break" },
            { time: "Day 2 - 03:00 PM", title: "Code Freeze & Final Jury Presentations" }
        ],
        speakers: [
            { name: "Rohan Sengupta", role: "Staff Engineer, Uber (Konnexions Alumnus)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
            { name: "Prof. S. N. Mishra", role: "Faculty Coordinator, Konnexions KIIT", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["Konnexions", "Hackathon", "Coding", "AI", "KSAC", "Web3"]
    },
    {
        id: "kiit-03",
        title: "KRS Roboverse: Combat Bot Wars & Autonomous Maze Challenge",
        tagline: "High-Impact Combat Robotics, Autonomous Line Followers & Drone Obstacle Derby",
        category: "technology",
        categoryLabel: "Technology & AI",
        format: "in-person",
        formatLabel: "In-Person (Arena)",
        date: getFutureDate(10, 10, 0),
        displayDate: "10 Days Ahead • 10:00 AM",
        duration: "2 Days",
        venue: "Campus 7 Multipurpose Indoor Stadium, KIIT",
        locationCity: "KIIT Deemed to be University, Bhubaneswar",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        priceDisplay: "FREE FOR SPECTATORS",
        spotsTotal: 600,
        spotsBooked: 510,
        featured: true,
        spotlight: false,
        rating: 4.88,
        organizer: "KIIT Robotics Society (KRS) & KSAC Tech Cell",
        description: "The arena is electrified as KRS (KIIT Robotics Society) hosts its flagship combat and autonomous robotics tournament. Teams pit custom-built metal armor bots in the polycarbonate cage, maneuver precision micro-drones through neon obstacle rings, and test autonomous sensor navigation.",
        highlights: [
            "30kg Combat Bot War inside reinforced steel-mesh arena",
            "First-Person View (FPV) Drone Racing Obstacle Course",
            "Interactive robotics display booth & 3D printing showcase for freshmen",
            "Cash awards & KRS advanced prototyping lab access passes"
        ],
        agenda: [
            { time: "Day 1 - 10:00 AM", title: "Weigh-in & Safety Inspection of Combat Bots" },
            { time: "Day 1 - 02:00 PM", title: "Autonomous Line Follower & Maze Solver Knockouts" },
            { time: "Day 2 - 11:00 AM", title: "FPV Drone Obstacle Time Trials" },
            { time: "Day 2 - 04:30 PM", title: "Grand Combat Bot Wars Final Showdown" }
        ],
        speakers: [
            { name: "Arya Dash", role: "Captain, Team KRS Robotics", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
            { name: "Dr. B. C. Rout", role: "Faculty Mentor, KRS KIIT", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["KRS", "Robotics", "BotWars", "Hardware", "KSAC", "Drones"]
    },
    {
        id: "kiit-04",
        title: "Korus Unplugged: Acoustic Sunset & Battle of Campus Bands",
        tagline: "Soulful Acoustic Melodies, Fusion Rock Jams & Open Mic Under Campus Fairy Lights",
        category: "music",
        categoryLabel: "Music & Concerts",
        format: "in-person",
        formatLabel: "In-Person",
        date: getFutureDate(13, 17, 30),
        displayDate: "13 Days Ahead • 5:30 PM",
        duration: "4 Hours",
        venue: "Campus 6 Open Air Amphitheatre, KIIT University",
        locationCity: "KIIT Deemed to be University, Bhubaneswar",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        priceDisplay: "FREE ENTRY",
        spotsTotal: 800,
        spotsBooked: 695,
        featured: true,
        spotlight: false,
        rating: 4.92,
        organizer: "Korus - The Official Music Society of KSAC",
        description: "Join Korus, the heart of musical talent at KIIT, for an intimate yet rocking campus evening. From heartfelt acoustic ballads and classical fusion to thunderous rock anthems, experience the very best student vocalists and instrumentalists under the starlit Campus 6 Amphitheatre.",
        highlights: [
            "12 KIIT student rock and fusion bands competing for title",
            "Unplugged acoustic corner with warm campus brews",
            "Audience live-voting via Eventora digital pass QR",
            "Surprise acoustic guest showcase by Korus alumni"
        ],
        agenda: [
            { time: "05:30 PM", title: "Gates Open & Soulful Acoustic Sunset Sets" },
            { time: "06:45 PM", title: "Classical Instrumental Fusion Round" },
            { time: "08:00 PM", title: "Battle of the Bands: Rock & Pop Showdown" },
            { time: "09:15 PM", title: "Encore Jam & Korus All-Stars Finale" }
        ],
        speakers: [
            { name: "Tanmay Roy", role: "President, Korus Music Society", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
            { name: "Ipsita Mohanty", role: "Classical Vocalist & KSAC Lead", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["Korus", "Music", "Acoustic", "Bands", "KSAC", "LiveConcert"]
    },
    {
        id: "kiit-05",
        title: "KIIT E-Summit 2026: Youth Entrepreneurship & Angel Conclave",
        tagline: "Pitch for Seed Grants, Learn from Unicorn Founders & Network with Venture Investors",
        category: "business",
        categoryLabel: "Business & Startups",
        format: "hybrid",
        formatLabel: "Hybrid (KIIT-TBI & Online)",
        date: getFutureDate(16, 10, 0),
        displayDate: "16 Days Ahead • 10:00 AM",
        duration: "2 Days",
        venue: "Convention Centre & KIIT-TBI Auditorium (Campus 11), KIIT",
        locationCity: "KIIT Deemed to be University, Bhubaneswar",
        image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
        price: 149,
        priceDisplay: "₹149",
        spotsTotal: 350,
        spotsBooked: 290,
        featured: true,
        spotlight: false,
        rating: 4.87,
        organizer: "KIIT E-Cell (Entrepreneurship Cell) & KIIT-TBI",
        description: "Hosted by KIIT E-Cell and the prestigious KIIT Technology Business Incubator (KIIT-TBI), E-Summit 2026 connects aspiring student innovators with seasoned startup founders, angel investors, and venture funds. Includes the flagship 'Million-Dollar Pitch' contest, startup expo, and equity-free incubation grants.",
        highlights: [
            "₹15 Lakhs seed grant funding pool powered by KIIT-TBI",
            "Keynote addresses by prominent Indian unicorn founders and angel investors",
            "Speed networking and 1-on-1 pitch clinics for student ventures",
            "Internship fair with 20+ incubated high-growth tech startups"
        ],
        agenda: [
            { time: "Day 1 - 10:00 AM", title: "Inaugural Keynote: Scaling From Campus Dorm to Series A" },
            { time: "Day 1 - 02:00 PM", title: "Panel Discussion: Future of AI in Enterprise Startups" },
            { time: "Day 2 - 11:00 AM", title: "The Million-Dollar Pitch Arena (Shark-Tank Style)" },
            { time: "Day 2 - 04:30 PM", title: "Seed Grant Announcements & Networking High Tea" }
        ],
        speakers: [
            { name: "Dr. Mrutyunjay Suar", role: "CEO, KIIT-TBI & Innovation Director", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" },
            { name: "Pooja Singhania", role: "Partner, Odisha Angel Network", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["ECell", "KIITTBI", "Startups", "Pitch", "Funding", "KSAC"]
    },
    {
        id: "kiit-06",
        title: "Kalakar Nukkad Natak & Street Theatre Mahotsav",
        tagline: "Thought-Provoking Street Plays, Dholak Beats & Social Satires",
        category: "arts",
        categoryLabel: "Arts & Culture",
        format: "in-person",
        formatLabel: "In-Person",
        date: getFutureDate(19, 16, 0),
        displayDate: "19 Days Ahead • 4:00 PM",
        duration: "4 Hours",
        venue: "Sculpture Garden & KSAC Lawn, Campus 6, KIIT",
        locationCity: "KIIT Deemed to be University, Bhubaneswar",
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        priceDisplay: "FREE",
        spotsTotal: 500,
        spotsBooked: 410,
        featured: false,
        spotlight: false,
        rating: 4.82,
        organizer: "Kalakar - The Official Dramatic Society of KSAC",
        description: "Kalakar brings raw energy, thumping dhol beats, and passionate voices to the campus grounds. Witness powerful Nukkad Natak performances addressing pressing social issues, followed by evening mono-acts and stage drama performances in the KSAC theatre.",
        highlights: [
            "8 high-energy street theatre troupes from KIIT schools",
            "Vibrant percussion, live dholak, and choral street poetry",
            "Open forum discussion with national theatre personalities",
            "Street art live canvas painting alongside the performances"
        ],
        agenda: [
            { time: "04:00 PM", title: "Dholak Beats Prelude & Troupe Assembly" },
            { time: "04:30 PM", title: "Nukkad Natak Performances (Round 1)" },
            { time: "06:15 PM", title: "Inter-School Street Drama Championship Finale" },
            { time: "07:30 PM", title: "Mono-Acting Showcase & Felicitation Ceremony" }
        ],
        speakers: [
            { name: "Abhishek Tripathy", role: "Lead Director, Kalakar Dramatic Society", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["Kalakar", "Theatre", "NukkadNatak", "Drama", "KSAC", "Free"]
    },
    {
        id: "kiit-07",
        title: "Qutopia Udghosh 2026: National Collegiate Quiz Championship",
        tagline: "Eastern India's Ultimate Mind Challenge: Pop Culture, Tech, General & Biz Quizzes",
        category: "workshops",
        categoryLabel: "Workshops & Seminars",
        format: "in-person",
        formatLabel: "In-Person",
        date: getFutureDate(22, 10, 30),
        displayDate: "22 Days Ahead • 10:30 AM",
        duration: "6 Hours",
        venue: "Campus 15 School of Computer Engineering Auditorium, KIIT",
        locationCity: "KIIT Deemed to be University, Bhubaneswar",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        priceDisplay: "FREE ENTRY",
        spotsTotal: 300,
        spotsBooked: 240,
        featured: false,
        spotlight: false,
        rating: 4.91,
        organizer: "Qutopia - The Official Quizzing Society of KIIT",
        description: "Founded in 2004, Qutopia is renowned across India's collegiate quizzing circuit. Udghosh 2026 brings gripping audio-visual rounds, rapid-fire buzzer finals, and mind-bending trivia spanning technology, pop culture, mythology, and world affairs.",
        highlights: [
            "Hosted by esteemed national Quizmasters",
            "₹50,000 in cash prizes and rolling champion trophies",
            "Interactive live audience quizzes with on-the-spot goodies",
            "Open to all KIIT schools and registered student duos"
        ],
        agenda: [
            { time: "10:30 AM", title: "Written Preliminary Round (30 Questions)" },
            { time: "01:30 PM", title: "Top 8 Finalist Announcement" },
            { time: "02:30 PM", title: "The Grand Buzzer Stage Final" },
            { time: "04:30 PM", title: "Prize Distribution & Open Audience Quiz" }
        ],
        speakers: [
            { name: "Siddhartha Basu", role: "Honorary Quizmaster & Media Mentor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["Qutopia", "Quiz", "Trivia", "Udghosh", "KSAC", "Free"]
    },
    {
        id: "kiit-08",
        title: "KIIT Premier League (KPL) & Inter-School Football Cup",
        tagline: "Inter-School Football Showdown Under Floodlights with 24 KIIT Hostels",
        category: "sports",
        categoryLabel: "Sports & Esports",
        format: "in-person",
        formatLabel: "In-Person",
        date: getFutureDate(25, 16, 0),
        displayDate: "25 Days Ahead • 4:00 PM",
        duration: "4 Days",
        venue: "Biju Patnaik Indoor Stadium & Campus 8 Sports Complex, KIIT",
        locationCity: "KIIT Deemed to be University, Bhubaneswar",
        image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        priceDisplay: "FREE FOR SPECTATORS",
        spotsTotal: 2500,
        spotsBooked: 2100,
        featured: false,
        spotlight: false,
        rating: 4.85,
        organizer: "KIIT Athletic Board & Sports Society (Campus 8)",
        description: "Cheer for your school and hostel! The annual KIIT Inter-School Football Cup brings fierce collegiate rivalry, electrifying goals, and athletic excellence to the state-of-the-art turf of Campus 8 Sports Complex under international standard floodlights.",
        highlights: [
            "Floodlit evening knockout matches with VAR assistance",
            "Student fan zones, cheering squads & halftime dance showcases",
            "Gold, Silver & Bronze medals plus prestigious University Trophy",
            "Player of the Tournament scouts for university team selection"
        ],
        agenda: [
            { time: "Day 1 - 04:00 PM", title: "Tournament Kickoff: Knockout Stage 1" },
            { time: "Day 2 - 04:30 PM", title: "Quarterfinal Clashes Under Floodlights" },
            { time: "Day 3 - 05:00 PM", title: "Semifinal Showdowns" },
            { time: "Day 4 - 06:30 PM", title: "Grand Final & Championship Trophy Presentation" }
        ],
        speakers: [
            { name: "Dr. Gaganendu Dash", role: "Director of Sports, KIIT University", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["Football", "KPL", "Sports", "Athletics", "Campus8", "Free"]
    },
    {
        id: "kiit-09",
        title: "K-Gamerz Arena: KIIT Collegiate Valorant & BGMI Cup",
        tagline: "5v5 LAN Battles, 240Hz High-Refresh Battle Stations & Live Twitch Shoutcasting",
        category: "sports",
        categoryLabel: "Sports & Esports",
        format: "hybrid",
        formatLabel: "Hybrid (KSAC Arena & Online)",
        date: getFutureDate(28, 11, 0),
        displayDate: "28 Days Ahead • 11:00 AM",
        duration: "2 Days",
        venue: "KSAC Gaming Lab & Campus 7 Indoor Stadium Stage, KIIT",
        locationCity: "KIIT Deemed to be University, Bhubaneswar",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
        price: 99,
        priceDisplay: "₹99",
        spotsTotal: 320,
        spotsBooked: 280,
        featured: false,
        spotlight: false,
        rating: 4.79,
        organizer: "K-Gamerz (KIIT Esports Society) & KSAC Gaming Cell",
        description: "The premier esports showdown at KIIT! K-Gamerz brings competitive LAN gaming to campus with professional shoutcasters, multi-angle giant projection screens, and thrilling 5v5 tactical shooter brackets for Valorant and BGMI squad matches.",
        highlights: [
            "Dedicated 240Hz low-latency gaming rigs setup in the KSAC arena",
            "₹60,000 Esports prize pool + official sponsor gaming gear",
            "Live student commentary and Discord community stream",
            "Exclusive energy drink pop-up and 1v1 fun mini-tournaments"
        ],
        agenda: [
            { time: "Day 1 - 11:00 AM", title: "Valorant Group Stage LAN Brackets" },
            { time: "Day 1 - 04:00 PM", title: "BGMI Custom Lobby Showdowns" },
            { time: "Day 2 - 01:00 PM", title: "Semifinals Main Stage Broadcast" },
            { time: "Day 2 - 06:00 PM", title: "Grand Finals & Trophy Handover" }
        ],
        speakers: [
            { name: "Rishabh 'Phantom' Sen", role: "Caster & K-Gamerz Lead", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["KGamerz", "Esports", "Valorant", "BGMI", "Gaming", "KSAC"]
    },
    {
        id: "kiit-10",
        title: "Kreative Chitra-Kriti: Fine Arts & VR Sculpture Expo",
        tagline: "Traditional Pattachitra, Oil Canvases, Modern VR Sculpting & Photography Gallery",
        category: "arts",
        categoryLabel: "Arts & Culture",
        format: "in-person",
        formatLabel: "In-Person",
        date: getFutureDate(31, 14, 0),
        displayDate: "31 Days Ahead • 2:00 PM",
        duration: "5 Hours",
        venue: "KSAC Art & Sculpture Gallery, Campus 6, KIIT",
        locationCity: "KIIT Deemed to be University, Bhubaneswar",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        priceDisplay: "FREE ENTRY",
        spotsTotal: 450,
        spotsBooked: 340,
        featured: false,
        spotlight: false,
        rating: 4.86,
        organizer: "Kreative - The Fine Arts Society of KSAC",
        description: "Curated by Kreative (the fine arts society of KSAC), Chitra-Kriti celebrates Odisha's rich heritage alongside cutting-edge modern digital arts. Features live pottery wheels, traditional Pattachitra masters, student photography showcases, and VR 3D sculpture walks.",
        highlights: [
            "Over 100 original student paintings, sketches, and installations",
            "Live handloom and Odishan pottery wheel interactive workshop",
            "Photography contest gallery by Film & Photography Society (FPS KIIT)",
            "Student artisan merchandise and postcard pop-up stalls"
        ],
        agenda: [
            { time: "02:00 PM", title: "Gallery Ribbon Cutting & Artist Walkthrough" },
            { time: "03:30 PM", title: "Live Pottery Wheel & Sand Art Demonstration" },
            { time: "05:00 PM", title: "FPS Photography Awards & Critic Reviews" }
        ],
        speakers: [
            { name: "Sudarsan Pattnaik", role: "Guest Sand Artist & Cultural Advisor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["Kreative", "FineArts", "Pattachitra", "Culture", "KSAC", "Free"]
    },
    {
        id: "kiit-11",
        title: "Kronicle Parliamentary Debate & Youth Parliament 2026",
        tagline: "Asian Parliamentary Debate (APD), Geopolitical Analysis & Oratory Clash",
        category: "workshops",
        categoryLabel: "Workshops & Seminars",
        format: "in-person",
        formatLabel: "In-Person",
        date: getFutureDate(35, 9, 30),
        displayDate: "35 Days Ahead • 9:30 AM",
        duration: "2 Days",
        venue: "Moot Court Hall, School of Law (Campus 16), KIIT",
        locationCity: "KIIT Deemed to be University, Bhubaneswar",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        priceDisplay: "FREE FOR OBSERVERS",
        spotsTotal: 200,
        spotsBooked: 165,
        featured: false,
        spotlight: false,
        rating: 4.89,
        organizer: "Kronicle - The Literary & Debating Society of KIIT",
        description: "Sharpen your eloquence and argumentative prowess with Kronicle, KIIT's premier debating body. Debaters from across India simulate high-stakes parliamentary policymaking, tackling foreign relations, technological ethics, and national socioeconomic reforms.",
        highlights: [
            "Official Asian Parliamentary 3v3 format with adjudicator adjudication",
            "Adjudicator masterclass by national debate champions",
            "Over ₹40,000 in oratory and best adjudicator cash awards",
            "Certificate of Distinction endorsed by KIIT Student Activity Centre"
        ],
        agenda: [
            { time: "Day 1 - 09:30 AM", title: "Motion Release & Round 1 Debate Matches" },
            { time: "Day 1 - 02:30 PM", title: "Round 2 & 3: Geopolitics & Constitutional Law" },
            { time: "Day 2 - 10:30 AM", title: "Semifinals & Policy Adjudication" },
            { time: "Day 2 - 04:00 PM", title: "Grand Finals & Orator of the Year Award" }
        ],
        speakers: [
            { name: "Prof. N. K. Chakrabarti", role: "Director, School of Law, KIIT", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["Kronicle", "Debate", "Oratory", "Law", "KSAC", "Free"]
    },
    {
        id: "kiit-12",
        title: "K-LARISS & KRS Autonomous Drone Masterclass",
        tagline: "Hands-On Quadcopter Assembly, PX4 Flight Controllers & Autonomous Missions",
        category: "workshops",
        categoryLabel: "Workshops & Seminars",
        format: "hybrid",
        formatLabel: "Hybrid (Campus 3 & Online)",
        date: getFutureDate(38, 14, 0),
        displayDate: "38 Days Ahead • 2:00 PM",
        duration: "4 Hours",
        venue: "Aerospace & Robotics Center, Campus 3 (Kathajodi Campus), KIIT",
        locationCity: "KIIT Deemed to be University, Bhubaneswar",
        image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80",
        price: 149,
        priceDisplay: "₹149",
        spotsTotal: 120,
        spotsBooked: 98,
        featured: false,
        spotlight: false,
        rating: 4.93,
        organizer: "K-LARISS (Aerospace Lab) & KRS (Robotics Society), KIIT",
        description: "Delve into autonomous aerial robotics with K-LARISS and KRS! Participants learn drone aerodynamics, calibrate brushless motors, program PX4/ArduPilot flight controllers, and execute autonomous waypoint missions on the Campus 3 grounds.",
        highlights: [
            "Hands-on quadcopter assembly kits provided per 4-student cohort",
            "Programming obstacle avoidance with LiDAR and OpenCV",
            "Outdoor flight trial on the Kathajodi campus grounds",
            "Certificate of Aerospace Robotics from KSAC & KIIT School of Mechanical Eng."
        ],
        agenda: [
            { time: "02:00 PM", title: "Drone Aerodynamics, Frame Dynamics & ESC Calibration" },
            { time: "03:15 PM", title: "PX4 Autonomous Waypoint Mission Scripting" },
            { time: "04:45 PM", title: "Live Outdoor Flight Field Trials & Fail-Safe Testing" }
        ],
        speakers: [
            { name: "Dr. K. B. Sahu", role: "Head of Aerospace Research, K-LARISS KIIT", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["KLARISS", "Drones", "KRS", "Robotics", "Workshop", "KSAC"]
    }
];
