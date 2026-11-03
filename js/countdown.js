/**
 * Eventora Real-Time Countdown Timer Engine
 * Powers the Hero Spotlight Timer, Event Card badges, and Event Modal live counters
 */

const CountdownEngine = {
    intervalId: null,

    /**
     * Calculate remaining time broken down into components
     * @param {string|Date} targetDate 
     * @returns {Object} { totalMs, days, hours, minutes, seconds, isPast }
     */
    getTimeRemaining(targetDate) {
        const totalMs = new Date(targetDate).getTime() - new Date().getTime();
        
        if (totalMs <= 0) {
            return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
        }

        const seconds = Math.floor((totalMs / 1000) % 60);
        const minutes = Math.floor((totalMs / 1000 / 60) % 60);
        const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
        const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

        return {
            totalMs,
            days,
            hours,
            minutes,
            seconds,
            isPast: false
        };
    },

    /**
     * Format into compact card badge string (e.g. "3d 14h left")
     * @param {string|Date} targetDate 
     * @returns {string}
     */
    formatCompact(targetDate) {
        const t = this.getTimeRemaining(targetDate);
        if (t.isPast) return "Event Ended";
        if (t.days > 0) return `${t.days}d ${t.hours}h left`;
        if (t.hours > 0) return `${t.hours}h ${t.minutes}m left`;
        return `${t.minutes}m ${t.seconds}s left`;
    },

    /**
     * Format into pad string "04"
     */
    padZero(n) {
        return n < 10 ? `0${n}` : `${n}`;
    },

    /**
     * Initialize spotlight hero countdown
     * @param {string} targetDate 
     */
    initSpotlightTimer(targetDate) {
        const daysEl = document.getElementById('spotlight-days');
        const hoursEl = document.getElementById('spotlight-hours');
        const minsEl = document.getElementById('spotlight-mins');
        const secsEl = document.getElementById('spotlight-secs');

        if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

        const update = () => {
            const t = this.getTimeRemaining(targetDate);
            daysEl.textContent = this.padZero(t.days);
            hoursEl.textContent = this.padZero(t.hours);
            minsEl.textContent = this.padZero(t.minutes);
            secsEl.textContent = this.padZero(t.seconds);
        };

        update();
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(update, 1000);
    },

    /**
     * Update all dynamic card badges on screen
     */
    updateCardTimers() {
        const badges = document.querySelectorAll('[data-event-countdown]');
        badges.forEach(badge => {
            const dateStr = badge.getAttribute('data-event-countdown');
            if (dateStr) {
                badge.textContent = `⏳ ${this.formatCompact(dateStr)}`;
            }
        });
    },

    /**
     * Start background loop for all dynamic counters
     */
    startGlobalLoop() {
        // Run every 10 seconds for card badges to conserve CPU while remaining accurate
        setInterval(() => {
            this.updateCardTimers();
        }, 10000);
    }
};

window.CountdownEngine = CountdownEngine;
