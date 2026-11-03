/**
 * Eventora LocalStorage Management Engine
 * Handles persistent storage for:
 * - Event Registrations / Digital Passes
 * - User Bookmarks / Favorites
 * - Theme Preference (Light / Dark Mode)
 */

const STORAGE_KEYS = {
    REGISTRATIONS: 'eventora_registrations_v1',
    BOOKMARKS: 'eventora_bookmarks_v1',
    THEME: 'eventora_theme_v1'
};

const StorageManager = {
    /**
     * Get all registered passes from LocalStorage
     * @returns {Array} List of registration objects
     */
    getRegistrations() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Error reading registrations from localStorage:', e);
            return [];
        }
    },

    /**
     * Save a new registration pass
     * @param {Object} registrationData 
     * @returns {Object} Saved registration with unique booking ID
     */
    saveRegistration(registrationData) {
        try {
            const registrations = this.getRegistrations();
            
            // Generate clean human-readable booking ID (e.g. EVT-941823)
            const randomCode = Math.floor(100000 + Math.random() * 900000);
            const bookingId = `EVT-${randomCode}`;
            
            const newRecord = {
                bookingId,
                ...registrationData,
                bookedAt: new Date().toISOString()
            };

            registrations.unshift(newRecord);
            localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
            
            // Dispatch custom event for UI updates
            window.dispatchEvent(new CustomEvent('eventora:registration-updated', { detail: newRecord }));
            
            return newRecord;
        } catch (e) {
            console.error('Error saving registration to localStorage:', e);
            throw e;
        }
    },

    /**
     * Cancel/delete a registration
     * @param {string} bookingId 
     * @returns {boolean} Success status
     */
    deleteRegistration(bookingId) {
        try {
            let registrations = this.getRegistrations();
            const initialLen = registrations.length;
            registrations = registrations.filter(r => r.bookingId !== bookingId);
            
            if (registrations.length !== initialLen) {
                localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
                window.dispatchEvent(new CustomEvent('eventora:registration-updated'));
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error deleting registration:', e);
            return false;
        }
    },

    /**
     * Get user bookmarks
     * @returns {Array<string>} List of event IDs
     */
    getBookmarks() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Error reading bookmarks:', e);
            return [];
        }
    },

    /**
     * Check if an event is bookmarked
     * @param {string} eventId 
     * @returns {boolean}
     */
    isBookmarked(eventId) {
        const bookmarks = this.getBookmarks();
        return bookmarks.includes(eventId);
    },

    /**
     * Toggle bookmark state for an event
     * @param {string} eventId 
     * @returns {boolean} New bookmarked state (true if added, false if removed)
     */
    toggleBookmark(eventId) {
        try {
            let bookmarks = this.getBookmarks();
            const index = bookmarks.indexOf(eventId);
            let isAdded = false;

            if (index > -1) {
                bookmarks.splice(index, 1);
                isAdded = false;
            } else {
                bookmarks.push(eventId);
                isAdded = true;
            }

            localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
            window.dispatchEvent(new CustomEvent('eventora:bookmarks-updated', { detail: { eventId, isAdded } }));
            return isAdded;
        } catch (e) {
            console.error('Error toggling bookmark:', e);
            return false;
        }
    },

    /**
     * Get current theme preference
     * @returns {'light' | 'dark'}
     */
    getTheme() {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.THEME);
            if (saved === 'light' || saved === 'dark') {
                return saved;
            }
            // Default to system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        } catch (e) {
            return 'light';
        }
    },

    /**
     * Set and apply theme
     * @param {'light' | 'dark'} theme 
     */
    setTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEYS.THEME, theme);
            document.documentElement.setAttribute('data-theme', theme);
            window.dispatchEvent(new CustomEvent('eventora:theme-changed', { detail: { theme } }));
        } catch (e) {
            console.error('Error saving theme:', e);
        }
    },

    /**
     * Toggle between light and dark mode
     * @returns {'light' | 'dark'} Newly applied theme
     */
    toggleTheme() {
        const current = this.getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
        return next;
    },

    /**
     * Pre-populate demo registrations if user is testing for the first time
     */
    seedDemoDataIfEmpty() {
        if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
            const demoPasses = [
                {
                    bookingId: "EVT-784192",
                    fullName: "Alex Rivera",
                    email: "alex.rivera@example.com",
                    phone: "9876543210",
                    eventId: "evt-01",
                    eventTitle: "InnovateX Global Hackathon 2026",
                    eventVenue: "Auditorium Hall 5, Central Tech Block",
                    eventDate: "3 Days Ahead • 9:30 AM",
                    ticketType: "VIP Pass",
                    ticketQty: 1,
                    notes: "Excited for the AI track!",
                    bookedAt: new Date(Date.now() - 3600000 * 24).toISOString()
                }
            ];
            localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(demoPasses));
        }
    }
};

// Immediately apply saved theme to avoid FOUC (Flash of Unstyled Content)
(function initThemeEarly() {
    const theme = StorageManager.getTheme();
    document.documentElement.setAttribute('data-theme', theme);
})();
