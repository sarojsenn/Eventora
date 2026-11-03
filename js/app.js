/**
 * Eventora Core Application Controller
 * Manages UI state, filters, search, modal dialogs, bookmarks, and user interactions
 */

const App = {
    state: {
        searchQuery: '',
        category: 'all',
        format: 'all',
        price: 'all',
        sortBy: 'date',
        onlyBookmarked: false,
        viewMode: 'grid', // 'grid' | 'list'
        activeEventForModal: null
    },

    init() {
        // Seed demo data if first-time user
        StorageManager.seedDemoDataIfEmpty();

        // Populate event dropdown in registration form
        this.populateEventSelectOptions();

        // Initialize Spotlight Hero
        this.initSpotlight();

        // Render initial events catalog
        this.renderEvents();

        // Attach event listeners for controls
        this.bindEvents();

        // Attach form validation listeners
        const regForm = document.getElementById('registration-form');
        if (regForm) {
            FormValidator.attachListeners(regForm);
        }

        // Initialize countdown loop
        CountdownEngine.startGlobalLoop();

        // Update ticket & bookmark counts
        this.updateHeaderBadges();

        console.log('🚀 Eventora Event Management Platform Initialized');
    },

    /**
     * Populate the <select> element in the registration form with all available events
     */
    populateEventSelectOptions() {
        const select = document.getElementById('reg-event-select');
        if (!select) return;

        select.innerHTML = '<option value="">-- Choose an Event --</option>';
        EVENTS_DATA.forEach(evt => {
            const opt = document.createElement('option');
            opt.value = evt.id;
            opt.textContent = `${evt.title} (${evt.priceDisplay})`;
            select.appendChild(opt);
        });
    },

    /**
     * Set up Spotlight / Featured Event in Hero
     */
    initSpotlight() {
        const spotlightEvt = EVENTS_DATA.find(e => e.spotlight) || EVENTS_DATA[0];
        if (!spotlightEvt) return;

        const titleEl = document.getElementById('spotlight-title');
        const descEl = document.getElementById('spotlight-desc');
        const dateEl = document.getElementById('spotlight-date');
        const venueEl = document.getElementById('spotlight-venue');
        const imgEl = document.getElementById('spotlight-img');
        const regBtn = document.getElementById('spotlight-reg-btn');
        const detailsBtn = document.getElementById('spotlight-details-btn');

        if (titleEl) titleEl.textContent = spotlightEvt.title;
        if (descEl) descEl.textContent = spotlightEvt.tagline;
        if (dateEl) dateEl.textContent = spotlightEvt.displayDate;
        if (venueEl) venueEl.textContent = spotlightEvt.venue;
        if (imgEl) imgEl.src = spotlightEvt.image;

        if (regBtn) {
            regBtn.onclick = () => this.openRegistrationModal(spotlightEvt.id);
        }
        if (detailsBtn) {
            detailsBtn.onclick = () => this.openEventDetails(spotlightEvt.id);
        }

        // Initialize countdown for this spotlight event
        CountdownEngine.initSpotlightTimer(spotlightEvt.date);
    },

    /**
     * Filter and sort events based on current application state
     */
    getFilteredEvents() {
        let events = [...EVENTS_DATA];

        // 1. Search Query
        if (this.state.searchQuery.trim() !== '') {
            const q = this.state.searchQuery.toLowerCase().trim();
            events = events.filter(e => 
                e.title.toLowerCase().includes(q) ||
                e.tagline.toLowerCase().includes(q) ||
                e.description.toLowerCase().includes(q) ||
                e.venue.toLowerCase().includes(q) ||
                e.categoryLabel.toLowerCase().includes(q) ||
                e.tags.some(t => t.toLowerCase().includes(q))
            );
        }

        // 2. Category Filter
        if (this.state.category !== 'all') {
            events = events.filter(e => e.category === this.state.category);
        }

        // 3. Format Filter
        if (this.state.format !== 'all') {
            events = events.filter(e => e.format === this.state.format);
        }

        // 4. Price Filter
        if (this.state.price === 'free') {
            events = events.filter(e => e.price === 0);
        } else if (this.state.price === 'paid') {
            events = events.filter(e => e.price > 0);
        }

        // 5. Bookmarks Filter
        if (this.state.onlyBookmarked) {
            const bookmarks = StorageManager.getBookmarks();
            events = events.filter(e => bookmarks.includes(e.id));
        }

        // 6. Sorting
        if (this.state.sortBy === 'date') {
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (this.state.sortBy === 'popular') {
            events.sort((a, b) => (b.spotsBooked / b.spotsTotal) - (a.spotsBooked / a.spotsTotal));
        } else if (this.state.sortBy === 'name') {
            events.sort((a, b) => a.title.localeCompare(b.title));
        }

        return events;
    },

    /**
     * Render the filtered events list to DOM
     */
    renderEvents() {
        const container = document.getElementById('events-container');
        const countEl = document.getElementById('results-count');
        const emptyState = document.getElementById('empty-state');
        if (!container) return;

        const filtered = this.getFilteredEvents();

        // Update count indicator
        if (countEl) {
            let label = `Showing <strong>${filtered.length}</strong> event${filtered.length === 1 ? '' : 's'}`;
            if (this.state.category !== 'all') {
                const catName = document.querySelector(`.cat-pill[data-category="${this.state.category}"]`)?.textContent.trim() || this.state.category;
                label += ` in "${catName}"`;
            }
            if (this.state.onlyBookmarked) {
                label += ` (Saved Bookmarks)`;
            }
            if (this.state.searchQuery) {
                label += ` matching "${this.state.searchQuery}"`;
            }
            countEl.innerHTML = label;
        }

        // Check empty state
        if (filtered.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'flex';
            return;
        } else {
            if (emptyState) emptyState.style.display = 'none';
        }

        // Set container view mode class
        container.className = this.state.viewMode === 'grid' ? 'events-grid' : 'events-list-view';

        // Render Cards
        const bookmarks = StorageManager.getBookmarks();
        container.innerHTML = filtered.map(evt => {
            const isBookmarked = bookmarks.includes(evt.id);
            const percentBooked = Math.round((evt.spotsBooked / evt.spotsTotal) * 100);
            const spotsRemaining = evt.spotsTotal - evt.spotsBooked;

            // Format date components
            const d = new Date(evt.date);
            const monthStr = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const dayNum = d.getDate();

            return `
                <article class="event-card ${evt.featured ? 'is-featured' : ''}" data-event-id="${evt.id}">
                    <div class="card-media">
                        <img src="${evt.image}" alt="${evt.title}" loading="lazy" class="card-img" />
                        <div class="card-overlay-gradient"></div>
                        
                        <div class="card-top-badges">
                            <span class="badge-category cat-${evt.category}">${evt.categoryLabel}</span>
                            <span class="badge-format format-${evt.format}">${evt.formatLabel}</span>
                        </div>

                        <button type="button" class="btn-bookmark ${isBookmarked ? 'active' : ''}" 
                                onclick="App.handleBookmarkToggle('${evt.id}', event)" 
                                title="${isBookmarked ? 'Remove from bookmarks' : 'Save event'}"
                                aria-label="Bookmark event">
                            <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>

                        <div class="card-date-badge">
                            <span class="date-month">${monthStr}</span>
                            <span class="date-day">${dayNum}</span>
                        </div>
                    </div>

                    <div class="card-content">
                        <div class="card-countdown-tag" data-event-countdown="${evt.date}">
                            ⏳ ${CountdownEngine.formatCompact(evt.date)}
                        </div>

                        <h3 class="card-title" onclick="App.openEventDetails('${evt.id}')" role="button" tabindex="0">
                            ${evt.title}
                        </h3>

                        <p class="card-tagline">${evt.tagline}</p>

                        <div class="card-meta">
                            <div class="meta-row">
                                <i class="fa-regular fa-clock"></i>
                                <span>${evt.displayDate}</span>
                            </div>
                            <div class="meta-row">
                                <i class="fa-solid fa-location-dot"></i>
                                <span class="venue-truncate" title="${evt.venue}">${evt.venue}</span>
                            </div>
                        </div>

                        <div class="card-capacity-bar">
                            <div class="capacity-info">
                                <span class="spots-left"><i class="fa-solid fa-fire"></i> ${spotsRemaining} spots left</span>
                                <span class="capacity-pct">${percentBooked}% booked</span>
                            </div>
                            <div class="progress-track">
                                <div class="progress-fill" style="width: ${percentBooked}%"></div>
                            </div>
                        </div>

                        <div class="card-footer">
                            <div class="card-price">
                                <span class="price-val ${evt.price === 0 ? 'is-free' : ''}">${evt.priceDisplay}</span>
                                ${evt.price > 0 ? '<span class="price-unit">/ pass</span>' : ''}
                            </div>
                            <div class="card-buttons">
                                <button type="button" class="btn-card-details" onclick="App.openEventDetails('${evt.id}')">
                                    Details
                                </button>
                                <button type="button" class="btn-card-register" onclick="App.openRegistrationModal('${evt.id}')">
                                    Register <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    },

    /**
     * Handle bookmark toggle
     */
    handleBookmarkToggle(eventId, event) {
        if (event) event.stopPropagation();
        const isAdded = StorageManager.toggleBookmark(eventId);
        this.renderEvents();
        this.updateHeaderBadges();

        const evt = EVENTS_DATA.find(e => e.id === eventId);
        const name = evt ? evt.title : 'Event';
        if (isAdded) {
            this.showToast(`Saved "${name}" to your wishlist!`, 'success');
        } else {
            this.showToast(`Removed from your wishlist`, 'info');
        }
    },

    /**
     * Open Event Details Modal
     */
    openEventDetails(eventId) {
        const evt = EVENTS_DATA.find(e => e.id === eventId);
        if (!evt) return;

        this.state.activeEventForModal = evt;

        const modal = document.getElementById('details-modal');
        const body = document.getElementById('details-modal-body');
        if (!modal || !body) return;

        const isBookmarked = StorageManager.isBookmarked(evt.id);
        const spotsRemaining = evt.spotsTotal - evt.spotsBooked;
        const percentBooked = Math.round((evt.spotsBooked / evt.spotsTotal) * 100);

        body.innerHTML = `
            <div class="details-hero">
                <img src="${evt.image}" alt="${evt.title}" class="details-cover-img" />
                <div class="details-hero-overlay"></div>
                
                <div class="details-hero-badges">
                    <span class="badge-category cat-${evt.category}">${evt.categoryLabel}</span>
                    <span class="badge-format format-${evt.format}">${evt.formatLabel}</span>
                    <span class="details-rating"><i class="fa-solid fa-star"></i> ${evt.rating}</span>
                </div>

                <button type="button" class="btn-modal-bookmark ${isBookmarked ? 'active' : ''}" 
                        onclick="App.handleBookmarkToggle('${evt.id}'); App.openEventDetails('${evt.id}');"
                        title="Save to bookmarks">
                    <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
            </div>

            <div class="details-content-wrap">
                <div class="details-header-info">
                    <div class="details-countdown-strip">
                        <span><i class="fa-solid fa-hourglass-half"></i> Starts in: </span>
                        <strong>${CountdownEngine.formatCompact(evt.date)}</strong>
                    </div>
                    <h2 class="details-title">${evt.title}</h2>
                    <p class="details-tagline">${evt.tagline}</p>
                    <div class="details-organizer">
                        <i class="fa-solid fa-shield-halved"></i> Organized by <strong>${evt.organizer}</strong>
                    </div>
                </div>

                <div class="details-quick-grid">
                    <div class="quick-card">
                        <i class="fa-regular fa-calendar-days"></i>
                        <div>
                            <span class="quick-label">Date & Time</span>
                            <span class="quick-val">${evt.displayDate}</span>
                        </div>
                    </div>
                    <div class="quick-card">
                        <i class="fa-solid fa-location-dot"></i>
                        <div>
                            <span class="quick-label">Venue</span>
                            <span class="quick-val">${evt.venue}</span>
                        </div>
                    </div>
                    <div class="quick-card">
                        <i class="fa-solid fa-clock"></i>
                        <div>
                            <span class="quick-label">Duration</span>
                            <span class="quick-val">${evt.duration}</span>
                        </div>
                    </div>
                    <div class="quick-card">
                        <i class="fa-solid fa-ticket"></i>
                        <div>
                            <span class="quick-label">Ticket Pass</span>
                            <span class="quick-val price-highlight">${evt.priceDisplay}</span>
                        </div>
                    </div>
                </div>

                <div class="details-section">
                    <h4 class="section-heading"><i class="fa-solid fa-circle-info"></i> About This Event</h4>
                    <p class="details-desc-text">${evt.description}</p>
                </div>

                <div class="details-section">
                    <h4 class="section-heading"><i class="fa-solid fa-award"></i> Event Highlights & Perks</h4>
                    <ul class="details-highlights-list">
                        ${evt.highlights.map(h => `<li><i class="fa-solid fa-check"></i> <span>${h}</span></li>`).join('')}
                    </ul>
                </div>

                <div class="details-section">
                    <h4 class="section-heading"><i class="fa-solid fa-list-check"></i> Schedule & Agenda</h4>
                    <div class="details-timeline">
                        ${evt.agenda.map(a => `
                            <div class="timeline-item">
                                <span class="timeline-time">${a.time}</span>
                                <div class="timeline-marker"></div>
                                <span class="timeline-text">${a.title}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${evt.speakers && evt.speakers.length > 0 ? `
                    <div class="details-section">
                        <h4 class="section-heading"><i class="fa-solid fa-microphone-lines"></i> Featured Speakers & Guests</h4>
                        <div class="details-speakers-grid">
                            ${evt.speakers.map(s => `
                                <div class="speaker-card">
                                    <img src="${s.avatar}" alt="${s.name}" class="speaker-img" />
                                    <div>
                                        <div class="speaker-name">${s.name}</div>
                                        <div class="speaker-role">${s.role}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="details-tags-wrap">
                    ${evt.tags.map(t => `<span class="pill-tag">#${t}</span>`).join('')}
                </div>

                <!-- Sticky bottom registration bar -->
                <div class="details-sticky-footer">
                    <div class="footer-price-info">
                        <span class="foot-price">${evt.priceDisplay}</span>
                        <span class="foot-spots">${spotsRemaining} seats remaining</span>
                    </div>
                    <div class="footer-actions">
                        <button type="button" class="btn-share" onclick="App.shareEvent('${evt.id}')" title="Share link">
                            <i class="fa-solid fa-share-nodes"></i> Share
                        </button>
                        <button type="button" class="btn-primary-register" onclick="App.openRegistrationModal('${evt.id}')">
                            Register Now <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.openModal('details-modal');
    },

    /**
     * Share event link / copy to clipboard
     */
    shareEvent(eventId) {
        const evt = EVENTS_DATA.find(e => e.id === eventId);
        const title = evt ? evt.title : 'Eventora Event';
        const url = window.location.href.split('#')[0] + `#event-${eventId}`;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                this.showToast(`Shareable link for "${title}" copied to clipboard!`, 'success');
            });
        } else {
            this.showToast(`Link: ${url}`, 'info');
        }
    },

    /**
     * Open Registration Modal prefilled for an event
     */
    openRegistrationModal(eventId = null) {
        // Close details modal if open
        this.closeModal('details-modal');

        const modal = document.getElementById('register-modal');
        const form = document.getElementById('registration-form');
        const select = document.getElementById('reg-event-select');
        const successBox = document.getElementById('registration-success-screen');

        if (!modal || !form) return;

        // Reset any past state
        FormValidator.resetForm(form);
        if (successBox) successBox.style.display = 'none';
        form.style.display = 'block';

        if (eventId && select) {
            select.value = eventId;
            this.updateRegEventSummary(eventId);
        } else if (select && select.value) {
            this.updateRegEventSummary(select.value);
        }

        this.openModal('register-modal');
    },

    /**
     * Update mini banner inside registration modal when event selection changes
     */
    updateRegEventSummary(eventId) {
        const summaryBox = document.getElementById('reg-event-preview');
        if (!summaryBox) return;

        const evt = EVENTS_DATA.find(e => e.id === eventId);
        if (!evt) {
            summaryBox.style.display = 'none';
            return;
        }

        summaryBox.style.display = 'flex';
        summaryBox.innerHTML = `
            <img src="${evt.image}" alt="${evt.title}" class="preview-thumb" />
            <div class="preview-info">
                <span class="preview-title">${evt.title}</span>
                <span class="preview-meta"><i class="fa-regular fa-calendar"></i> ${evt.displayDate} • <i class="fa-solid fa-location-dot"></i> ${evt.venue}</span>
                <span class="preview-cost">Pass Fee: <strong>${evt.priceDisplay}</strong></span>
            </div>
        `;
    },

    /**
     * Handle registration form submission
     */
    handleRegistrationSubmit(e) {
        e.preventDefault();
        const form = e.target;

        const { isValid, data } = FormValidator.validateForm(form);
        if (!isValid) return;

        // Find event details
        const evt = EVENTS_DATA.find(event => event.id === data.eventId);
        if (!evt) {
            this.showToast('Selected event not found', 'error');
            return;
        }

        // Prepare registration record
        const registrationRecord = {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            eventId: evt.id,
            eventTitle: evt.title,
            eventDate: evt.displayDate,
            eventVenue: evt.venue,
            ticketType: data.ticketType,
            ticketQty: data.ticketQty,
            notes: data.notes
        };

        // Save to LocalStorage
        const savedPass = StorageManager.saveRegistration(registrationRecord);

        // Update badge counts
        this.updateHeaderBadges();

        // Render Confirmation Pass inside Success Box
        const formEl = document.getElementById('registration-form');
        const successBox = document.getElementById('registration-success-screen');
        const passWrap = document.getElementById('success-pass-placeholder');

        if (formEl && successBox) {
            formEl.style.display = 'none';
            successBox.style.display = 'block';

            if (passWrap) {
                passWrap.innerHTML = TicketPassEngine.renderTicketHTML(savedPass, true);
            }

            // Scroll success box into view
            successBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        this.showToast(`🎉 Registration Confirmed! Your Pass ID is ${savedPass.bookingId}`, 'success');
    },

    /**
     * Open "My Passes / Tickets" Modal
     */
    openMyTicketsModal() {
        const modal = document.getElementById('tickets-modal');
        const listEl = document.getElementById('my-tickets-list');
        const emptyEl = document.getElementById('my-tickets-empty');
        if (!modal || !listEl) return;

        const registrations = StorageManager.getRegistrations();

        if (registrations.length === 0) {
            listEl.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
        } else {
            if (emptyEl) emptyEl.style.display = 'none';
            listEl.innerHTML = registrations.map(ticket => TicketPassEngine.renderTicketHTML(ticket, true)).join('');
        }

        this.openModal('tickets-modal');
    },

    /**
     * Update Navbar Counters
     */
    updateHeaderBadges() {
        const ticketBadge = document.getElementById('nav-tickets-count');
        const bookmarkBadge = document.getElementById('filter-saved-count');

        const regs = StorageManager.getRegistrations();
        const bookmarks = StorageManager.getBookmarks();

        if (ticketBadge) {
            ticketBadge.textContent = regs.length;
            ticketBadge.style.display = regs.length > 0 ? 'inline-flex' : 'none';
        }

        if (bookmarkBadge) {
            bookmarkBadge.textContent = bookmarks.length;
        }
    },

    /**
     * Modal Helper: Open
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.add('is-open');
        document.body.classList.add('modal-open');

        // Focus inside modal
        const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex="0"]');
        if (focusable) focusable.focus();
    },

    /**
     * Modal Helper: Close
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.remove('is-open');

        // If no other modals are open, unlock body scroll
        if (!document.querySelector('.modal.is-open')) {
            document.body.classList.remove('modal-open');
        }
    },

    /**
     * Toast Notification Center
     */
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-xmark',
            info: 'fa-circle-info'
        };

        const toast = document.createElement('div');
        toast.className = `toast-pill toast-${type} slide-in-toast`;
        toast.innerHTML = `
            <i class="fa-solid ${icons[type] || 'fa-bell'}"></i>
            <span class="toast-text">${message}</span>
            <button type="button" class="btn-toast-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-fadeout');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    },

    /**
     * Bind all DOM Event Listeners
     */
    bindEvents() {
        // 1. Dark/Light Mode Switcher
        const themeToggles = document.querySelectorAll('.theme-toggle-btn');
        themeToggles.forEach(btn => {
            btn.addEventListener('click', () => {
                const nextTheme = StorageManager.toggleTheme();
                this.updateThemeIcons(nextTheme);
                this.showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
            });
        });
        this.updateThemeIcons(StorageManager.getTheme());

        // 2. Search inputs (Main & Hero)
        const searchInput = document.getElementById('events-search-input');
        const heroSearchInput = document.getElementById('hero-search-input');
        const clearSearchBtn = document.getElementById('search-clear-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.state.searchQuery = e.target.value;
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
                }
                this.renderEvents();
            });
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                this.state.searchQuery = '';
                clearSearchBtn.style.display = 'none';
                this.renderEvents();
            });
        }

        if (heroSearchInput) {
            heroSearchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.state.searchQuery = heroSearchInput.value;
                    if (searchInput) {
                        searchInput.value = heroSearchInput.value;
                        if (clearSearchBtn) clearSearchBtn.style.display = 'block';
                    }
                    this.renderEvents();
                    document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
                }
            });

            const heroSearchBtn = document.getElementById('hero-search-submit');
            if (heroSearchBtn) {
                heroSearchBtn.addEventListener('click', () => {
                    this.state.searchQuery = heroSearchInput.value;
                    if (searchInput) {
                        searchInput.value = heroSearchInput.value;
                        if (clearSearchBtn) clearSearchBtn.style.display = 'block';
                    }
                    this.renderEvents();
                    document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
                });
            }
        }

        // 3. Category Filter Pills
        const catPills = document.querySelectorAll('.cat-pill');
        catPills.forEach(pill => {
            pill.addEventListener('click', () => {
                catPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.state.category = pill.getAttribute('data-category') || 'all';
                this.renderEvents();
            });
        });

        // 4. Advanced Filters (Format, Price, Sort)
        const formatSelect = document.getElementById('filter-format');
        if (formatSelect) {
            formatSelect.addEventListener('change', (e) => {
                this.state.format = e.target.value;
                this.renderEvents();
            });
        }

        const priceSelect = document.getElementById('filter-price');
        if (priceSelect) {
            priceSelect.addEventListener('change', (e) => {
                this.state.price = e.target.value;
                this.renderEvents();
            });
        }

        const sortSelect = document.getElementById('filter-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.state.sortBy = e.target.value;
                this.renderEvents();
            });
        }

        // 5. Saved Events / Bookmarks filter toggle button
        const savedFilterBtn = document.getElementById('filter-saved-btn');
        if (savedFilterBtn) {
            savedFilterBtn.addEventListener('click', () => {
                this.state.onlyBookmarked = !this.state.onlyBookmarked;
                savedFilterBtn.classList.toggle('active', this.state.onlyBookmarked);
                this.renderEvents();
            });
        }

        // 6. View Mode Toggle (Grid vs List)
        const gridBtn = document.getElementById('view-grid-btn');
        const listBtn = document.getElementById('view-list-btn');

        if (gridBtn && listBtn) {
            gridBtn.addEventListener('click', () => {
                this.state.viewMode = 'grid';
                gridBtn.classList.add('active');
                listBtn.classList.remove('active');
                this.renderEvents();
            });

            listBtn.addEventListener('click', () => {
                this.state.viewMode = 'list';
                listBtn.classList.add('active');
                gridBtn.classList.remove('active');
                this.renderEvents();
            });
        }

        // 7. Reset filters button in empty state
        const resetFiltersBtn = document.getElementById('btn-reset-filters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                this.resetAllFilters();
            });
        }

        // 8. Event selection change in registration modal
        const regSelect = document.getElementById('reg-event-select');
        if (regSelect) {
            regSelect.addEventListener('change', (e) => {
                this.updateRegEventSummary(e.target.value);
            });
        }

        // 9. Registration form submit
        const regForm = document.getElementById('registration-form');
        if (regForm) {
            regForm.addEventListener('submit', (e) => this.handleRegistrationSubmit(e));
        }

        // 10. Modal Close buttons & overlay click
        const modals = document.querySelectorAll('.modal');
        modals.forEach(m => {
            const closeBtn = m.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal(m.id));
            }

            m.addEventListener('click', (e) => {
                if (e.target === m) {
                    this.closeModal(m.id);
                }
            });
        });

        // 11. Global Keyboard Listeners (Escape to close modal)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModalEl = document.querySelector('.modal.is-open');
                if (openModalEl) {
                    this.closeModal(openModalEl.id);
                }
            }
        });

        // 12. Listen to custom LocalStorage update events
        window.addEventListener('eventora:registration-updated', () => {
            this.updateHeaderBadges();
            // Re-render my tickets if open
            const ticketsModal = document.getElementById('tickets-modal');
            if (ticketsModal && ticketsModal.classList.contains('is-open')) {
                this.openMyTicketsModal();
            }
        });

        // 13. Mobile Menu Toggle
        const menuToggleBtn = document.getElementById('mobile-menu-btn');
        const mobileDrawer = document.getElementById('mobile-drawer');
        const mobileCloseBtn = document.getElementById('mobile-drawer-close');

        if (menuToggleBtn && mobileDrawer) {
            menuToggleBtn.addEventListener('click', () => {
                mobileDrawer.classList.add('is-open');
            });
        }
        if (mobileCloseBtn && mobileDrawer) {
            mobileCloseBtn.addEventListener('click', () => {
                mobileDrawer.classList.remove('is-open');
            });
        }

        // Close mobile drawer when any link clicked
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer?.classList.remove('is-open');
            });
        });
    },

    /**
     * Reset all filters to default state
     */
    resetAllFilters() {
        this.state.searchQuery = '';
        this.state.category = 'all';
        this.state.format = 'all';
        this.state.price = 'all';
        this.state.onlyBookmarked = false;

        const searchInput = document.getElementById('events-search-input');
        if (searchInput) searchInput.value = '';

        const clearSearchBtn = document.getElementById('search-clear-btn');
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';

        document.querySelectorAll('.cat-pill').forEach(p => {
            p.classList.toggle('active', p.getAttribute('data-category') === 'all');
        });

        const formatSelect = document.getElementById('filter-format');
        if (formatSelect) formatSelect.value = 'all';

        const priceSelect = document.getElementById('filter-price');
        if (priceSelect) priceSelect.value = 'all';

        const savedFilterBtn = document.getElementById('filter-saved-btn');
        if (savedFilterBtn) savedFilterBtn.classList.remove('active');

        this.renderEvents();
        this.showToast('All filters cleared', 'info');
    },

    /**
     * Update Theme toggle icons
     */
    updateThemeIcons(theme) {
        const icons = document.querySelectorAll('.theme-icon');
        icons.forEach(icon => {
            if (theme === 'dark') {
                icon.className = 'fa-solid fa-sun theme-icon';
            } else {
                icon.className = 'fa-solid fa-moon theme-icon';
            }
        });
    }
};

window.App = App;
window.showToast = (msg, type) => App.showToast(msg, type);

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
