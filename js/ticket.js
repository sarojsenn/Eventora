/**
 * Eventora Digital Ticket Pass Generator & Management
 * Renders boarding pass cards, clean SVG QR codes, barcodes, and handles image download & print
 * Official Digital Pass Engine for Kalinga Institute of Industrial Technology (KIIT) & KSAC
 */

const TicketPassEngine = {
    /**
     * Generate a deterministic 21x21 QR code matrix based on the booking ID
     * @param {string} text 
     * @returns {Array<Array<boolean>>} 2D boolean matrix where true = dark cell
     */
    getQRMatrix(text) {
        const size = 21;
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = ((hash << 5) - hash) + text.charCodeAt(i);
            hash |= 0;
        }

        const isFinderCorner = (r, c) => {
            // Top-left finder 7x7
            if (r < 7 && c < 7) {
                if (r === 0 || r === 6 || c === 0 || c === 6) return true;
                if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
                return false;
            }
            // Top-right finder 7x7
            if (r < 7 && c >= size - 7) {
                const adjC = c - (size - 7);
                if (r === 0 || r === 6 || adjC === 0 || adjC === 6) return true;
                if (r >= 2 && r <= 4 && adjC >= 2 && adjC <= 4) return true;
                return false;
            }
            // Bottom-left finder 7x7
            if (r >= size - 7 && c < 7) {
                const adjR = r - (size - 7);
                if (adjR === 0 || adjR === 6 || c === 0 || c === 6) return true;
                if (adjR >= 2 && adjR <= 4 && c >= 2 && c <= 4) return true;
                return false;
            }
            return null;
        };

        const matrix = [];
        for (let r = 0; r < size; r++) {
            const row = [];
            for (let c = 0; c < size; c++) {
                const finder = isFinderCorner(r, c);
                if (finder !== null) {
                    row.push(finder);
                } else {
                    const seed = (Math.abs(hash) + (r * 31) + (c * 17)) % 100;
                    row.push(seed % 2 === 0 || seed % 3 === 0);
                }
            }
            matrix.push(row);
        }
        return matrix;
    },

    /**
     * Generate a crisp deterministic SVG QR code pattern based on the booking ID
     * @param {string} text 
     * @returns {string} SVG markup
     */
    generateQRCodeSVG(text) {
        const matrix = this.getQRMatrix(text);
        const size = matrix.length;
        let rects = '';

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (matrix[r][c]) {
                    rects += `<rect x="${c * 5}" y="${r * 5}" width="4.5" height="4.5" rx="0.8" fill="currentColor"/>`;
                }
            }
        }

        return `
            <svg class="ticket-qr-svg" viewBox="0 0 ${size * 5} ${size * 5}" width="110" height="110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pass QR Code">
                ${rects}
            </svg>
        `;
    },

    /**
     * Render Barcode SVG lines
     */
    generateBarcodeSVG(code) {
        let lines = '';
        const pattern = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3];
        let x = 10;
        pattern.forEach((w, idx) => {
            if (idx % 2 === 0) {
                lines += `<rect x="${x}" y="0" width="${w * 1.5}" height="32" fill="currentColor" />`;
            }
            x += w * 2.2;
        });

        return `
            <svg class="ticket-barcode-svg" viewBox="0 0 160 32" width="160" height="32" xmlns="http://www.w3.org/2000/svg">
                ${lines}
            </svg>
        `;
    },

    /**
     * Build digital boarding pass HTML
     * @param {Object} ticket 
     * @param {boolean} showActions 
     * @returns {string} HTML string
     */
    renderTicketHTML(ticket, showActions = true) {
        const qrSvg = this.generateQRCodeSVG(ticket.bookingId);
        const barcodeSvg = this.generateBarcodeSVG(ticket.bookingId);
        const bookedDateStr = new Date(ticket.bookedAt || Date.now()).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        return `
            <div class="digital-ticket-card" id="ticket-${ticket.bookingId}">
                <div class="ticket-main-section">
                    <div class="ticket-header">
                        <div class="ticket-brand">
                            <span class="ticket-logo-icon">🎟️</span>
                            <div>
                                <span class="ticket-brand-name">Eventora PASS</span>
                                <span class="ticket-brand-sub">KIIT Student Activity Centre (KSAC)</span>
                            </div>
                        </div>
                        <div class="ticket-status-badge">
                            <span class="status-dot"></span> CONFIRMED PASS
                        </div>
                    </div>

                    <div class="ticket-event-title">${ticket.eventTitle}</div>
                    
                    <div class="ticket-grid-meta">
                        <div class="ticket-meta-item">
                            <span class="ticket-meta-label"><i class="fa-regular fa-calendar"></i> DATE & TIME</span>
                            <span class="ticket-meta-val">${ticket.eventDate || 'Refer Event Schedule'}</span>
                        </div>
                        <div class="ticket-meta-item">
                            <span class="ticket-meta-label"><i class="fa-solid fa-location-dot"></i> KIIT VENUE</span>
                            <span class="ticket-meta-val" title="${ticket.eventVenue}">${ticket.eventVenue || 'Campus Grounds, KIIT'}</span>
                        </div>
                        <div class="ticket-meta-item">
                            <span class="ticket-meta-label"><i class="fa-solid fa-user"></i> ATTENDEE</span>
                            <span class="ticket-meta-val">${ticket.fullName}</span>
                        </div>
                        <div class="ticket-meta-item">
                            <span class="ticket-meta-label"><i class="fa-solid fa-ticket"></i> PASS TIER</span>
                            <span class="ticket-meta-val">${ticket.ticketType} (${ticket.ticketQty || 1} Person)</span>
                        </div>
                    </div>

                    <div class="ticket-contact-row">
                        <span><i class="fa-regular fa-envelope"></i> ${ticket.email}</span>
                        <span><i class="fa-solid fa-phone"></i> +91 ${ticket.phone}</span>
                    </div>

                    <div class="ticket-barcode-wrap">
                        ${barcodeSvg}
                        <span class="ticket-booking-ref">${ticket.bookingId}</span>
                    </div>
                </div>

                <!-- Perforated Tear Line -->
                <div class="ticket-perforation">
                    <div class="perf-circle top"></div>
                    <div class="perf-line"></div>
                    <div class="perf-circle bottom"></div>
                </div>

                <!-- Ticket Stub with QR Code -->
                <div class="ticket-stub-section">
                    <div class="stub-qr-container">
                        ${qrSvg}
                        <span class="stub-scan-hint">Scan at KSAC Gates</span>
                    </div>
                    <div class="stub-details">
                        <div class="stub-id">${ticket.bookingId}</div>
                        <div class="stub-date">Booked: ${bookedDateStr}</div>
                    </div>

                    ${showActions ? `
                        <div class="ticket-actions">
                            <button type="button" class="btn-ticket-action btn-download" onclick="TicketPassEngine.downloadTicket('${ticket.bookingId}')" title="Download Pass as PNG Image">
                                <i class="fa-solid fa-download"></i> Download Pass
                            </button>
                            <button type="button" class="btn-ticket-action btn-print" onclick="TicketPassEngine.printTicket('${ticket.bookingId}')" title="Print or Save PDF">
                                <i class="fa-solid fa-print"></i> Print / PDF
                            </button>
                            <button type="button" class="btn-ticket-action btn-cancel" onclick="TicketPassEngine.confirmDelete('${ticket.bookingId}')" title="Cancel Booking">
                                <i class="fa-regular fa-trash-can"></i> Cancel
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    /**
     * Download a specific ticket pass as a high-resolution PNG image
     * @param {string} bookingId 
     */
    downloadTicket(bookingId) {
        let ticket = null;
        if (typeof StorageManager !== 'undefined') {
            const regs = StorageManager.getRegistrations();
            ticket = regs.find(r => r.bookingId === bookingId);
        }

        // Fallback: parse from DOM if storage did not return
        if (!ticket) {
            const ticketEl = document.getElementById(`ticket-${bookingId}`);
            if (ticketEl) {
                const title = ticketEl.querySelector('.ticket-event-title')?.textContent?.trim() || 'KIIT Campus Event';
                const metaVals = ticketEl.querySelectorAll('.ticket-meta-val');
                ticket = {
                    bookingId: bookingId,
                    eventTitle: title,
                    eventDate: metaVals[0]?.textContent?.trim() || 'Upcoming Event',
                    eventVenue: metaVals[1]?.textContent?.trim() || 'Campus 6, KIIT',
                    fullName: metaVals[2]?.textContent?.trim() || 'KIIT Student Attendee',
                    ticketType: metaVals[3]?.textContent?.trim() || 'Student Pass',
                    ticketQty: 1,
                    email: ticketEl.querySelector('.ticket-contact-row span:nth-child(1)')?.textContent?.trim() || 'kiit.student@kiit.ac.in',
                    phone: ticketEl.querySelector('.ticket-contact-row span:nth-child(2)')?.textContent?.replace('+91', '').trim() || '9876543210'
                };
            }
        }

        if (!ticket) {
            if (window.showToast) {
                window.showToast('Unable to locate ticket pass details for download.', 'error');
            }
            return;
        }

        this.renderTicketToCanvasAndDownload(ticket);
    },

    /**
     * Helper to download the most recently registered pass
     */
    downloadLatestPass() {
        if (typeof StorageManager !== 'undefined') {
            const regs = StorageManager.getRegistrations();
            if (regs && regs.length > 0) {
                this.downloadTicket(regs[0].bookingId);
                return;
            }
        }
        if (window.showToast) {
            window.showToast('No registered passes available to download.', 'info');
        }
    },

    /**
     * Renders a boarding pass onto an HTML5 Canvas and triggers PNG file download
     * @param {Object} ticket 
     */
    renderTicketToCanvasAndDownload(ticket) {
        try {
            const W = 1000;
            const H = 500;
            const scale = 2; // High-DPI 2x Retina crisp rendering

            const canvas = document.createElement('canvas');
            canvas.width = W * scale;
            canvas.height = H * scale;
            const ctx = canvas.getContext('2d');
            ctx.scale(scale, scale);

            // 1. Base card path with rounded corners
            const cardX = 20;
            const cardY = 20;
            const cardW = 960;
            const cardH = 460;
            const radius = 24;
            const stubX = 700; // Divider line

            // Fill Card Outer Shadow / Background
            ctx.fillStyle = '#080f18';
            ctx.fillRect(0, 0, W, H);

            // Draw Card Background
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, cardH, radius);
            ctx.clip();

            // Gradient card background
            const bgGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
            bgGrad.addColorStop(0, '#0f172a');
            bgGrad.addColorStop(0.5, '#131f33');
            bgGrad.addColorStop(1, '#0b1320');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(cardX, cardY, cardW, cardH);

            // Subtle emerald brand glow top-left
            const glowGrad = ctx.createRadialGradient(cardX + 120, cardY + 80, 10, cardX + 120, cardY + 80, 280);
            glowGrad.addColorStop(0, 'rgba(5, 150, 105, 0.22)');
            glowGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGrad;
            ctx.fillRect(cardX, cardY, stubX - cardX, cardH);

            // Right Stub Background
            ctx.fillStyle = '#162438';
            ctx.fillRect(stubX, cardY, cardX + cardW - stubX, cardH);

            ctx.restore();

            // Card Border
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, cardH, radius);
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();

            // 2. Perforated Notch Circles and Divider
            ctx.save();
            // Top notch
            ctx.beginPath();
            ctx.arc(stubX, cardY, 14, 0, Math.PI);
            ctx.fillStyle = '#080f18';
            ctx.fill();
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Bottom notch
            ctx.beginPath();
            ctx.arc(stubX, cardY + cardH, 14, Math.PI, 0);
            ctx.fillStyle = '#080f18';
            ctx.fill();
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Dashed Line
            ctx.beginPath();
            ctx.setLineDash([6, 6]);
            ctx.moveTo(stubX, cardY + 16);
            ctx.lineTo(stubX, cardY + cardH - 16);
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();

            // 3. Header on Main Section
            // Logo Badge
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(50, 48, 38, 38, 10);
            const logoGrad = ctx.createLinearGradient(50, 48, 88, 86);
            logoGrad.addColorStop(0, '#059669');
            logoGrad.addColorStop(1, '#0284c7');
            ctx.fillStyle = logoGrad;
            ctx.fill();
            ctx.font = '20px system-ui, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⚡', 69, 67);
            ctx.restore();

            // Brand Typography
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
            ctx.font = 'bold 22px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('Eventora PASS', 100, 64);

            ctx.font = '600 11px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('KALINGA INSTITUTE OF INDUSTRIAL TECHNOLOGY • KSAC', 100, 80);

            // Confirmed Status Pill (Top Right of Main Section)
            ctx.save();
            const pillX = 540;
            const pillY = 52;
            ctx.beginPath();
            ctx.roundRect(pillX, pillY, 130, 28, 14);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Status Green Dot
            ctx.beginPath();
            ctx.arc(pillX + 16, pillY + 14, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#10b981';
            ctx.fill();

            ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillStyle = '#34d399';
            ctx.fillText('CONFIRMED', pillX + 28, pillY + 18);
            ctx.restore();

            // 4. Event Title (Auto-wrapping up to 2 lines)
            ctx.font = 'bold 23px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillStyle = '#ffffff';
            const maxTitleWidth = 620;
            const words = (ticket.eventTitle || 'Campus Event').split(' ');
            let line = '';
            let lineY = 135;
            let lineCount = 0;

            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxTitleWidth && n > 0) {
                    ctx.fillText(line, 50, lineY);
                    line = words[n] + ' ';
                    lineY += 28;
                    lineCount++;
                    if (lineCount >= 2) break;
                } else {
                    line = testLine;
                }
            }
            if (lineCount < 2) {
                ctx.fillText(line, 50, lineY);
            }

            // 5. Details 2x2 Grid Container
            const gridY = 185;
            const gridH = 145;
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(50, gridY, 620, gridH, 14);
            ctx.fillStyle = '#131e2f';
            ctx.fill();
            ctx.strokeStyle = '#223249';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();

            // Helper for 2x2 details
            const drawMetaCell = (label, val, x, y, valColor = '#ffffff') => {
                ctx.font = 'bold 10px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.fillStyle = '#94a3b8';
                ctx.fillText(label.toUpperCase(), x, y);

                ctx.font = 'bold 14px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.fillStyle = valColor;
                // Clip if value is too wide
                const maxValWidth = 270;
                let text = val || '-';
                if (ctx.measureText(text).width > maxValWidth) {
                    while (ctx.measureText(text + '...').width > maxValWidth && text.length > 5) {
                        text = text.slice(0, -1);
                    }
                    text += '...';
                }
                ctx.fillText(text, x, y + 22);
            };

            // Quadrant 1: Date & Time
            drawMetaCell('📅 Date & Time', ticket.eventDate || 'Upcoming Schedule', 72, gridY + 30);
            // Quadrant 2: Venue
            drawMetaCell('📍 KIIT Venue', ticket.eventVenue || 'Campus 6, KIIT', 370, gridY + 30, '#38bdf8');
            // Quadrant 3: Attendee
            drawMetaCell('👤 Attendee Name', ticket.fullName || 'Student Attendee', 72, gridY + 95, '#10b981');
            // Quadrant 4: Tier & Quantity
            const qtyText = `${ticket.ticketType || 'Student Pass'} (${ticket.ticketQty || 1} Person)`;
            drawMetaCell('🎟️ Pass Tier & Qty', qtyText, 370, gridY + 95, '#fbbf24');

            // 6. Attendee Contact Details Row
            ctx.font = '600 12px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(`📧 ${ticket.email || 'student@kiit.ac.in'}   •   📞 +91 ${ticket.phone || '9876543210'}`, 50, 360);

            // 7. Barcode Lines & Reference Code
            const barX = 50;
            const barY = 385;
            const pattern = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 2, 1, 3, 2, 1];
            ctx.fillStyle = '#cbd5e1';
            let curX = barX;
            pattern.forEach((w, idx) => {
                if (idx % 2 === 0) {
                    ctx.fillRect(curX, barY, w * 2.2, 34);
                }
                curX += w * 3.1;
            });

            ctx.font = 'bold 15px monospace';
            ctx.fillStyle = '#10b981';
            ctx.fillText(ticket.bookingId, barX + 220, barY + 24);

            // 8. Right Stub Section (x = 700 to 980)
            ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.textAlign = 'center';
            ctx.fillText('ENTRY VERIFICATION STUB', 835, 60);

            // QR Container Card (Clean white rounded box)
            const qrCardX = 740;
            const qrCardY = 78;
            const qrCardSize = 190;
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(qrCardX, qrCardY, qrCardSize, qrCardSize, 14);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 12;
            ctx.restore();

            // Draw QR Code onto Canvas
            const matrix = this.getQRMatrix(ticket.bookingId);
            const matrixSize = matrix.length; // 21
            const qrInnerPadding = 16;
            const availableQrSize = qrCardSize - (qrInnerPadding * 2);
            const cellSize = availableQrSize / matrixSize;

            ctx.fillStyle = '#0f172a';
            for (let r = 0; r < matrixSize; r++) {
                for (let c = 0; c < matrixSize; c++) {
                    if (matrix[r][c]) {
                        const cellX = qrCardX + qrInnerPadding + (c * cellSize);
                        const cellY = qrCardY + qrInnerPadding + (r * cellSize);
                        ctx.beginPath();
                        ctx.roundRect(cellX, cellY, cellSize * 0.95, cellSize * 0.95, 1.2);
                        ctx.fill();
                    }
                }
            }

            // Stub Hint & Details Below QR Card
            ctx.textAlign = 'center';
            ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillStyle = '#38bdf8';
            ctx.fillText('⚡ SCAN AT KSAC GATES', 835, 298);

            ctx.font = 'bold 16px monospace';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(ticket.bookingId, 835, 328);

            ctx.font = '600 11px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(`Issued: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, 835, 350);

            // Watermark / Verification notice
            ctx.save();
            ctx.font = '600 10px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText('Valid KIIT Student ID Required', 835, 430);
            ctx.restore();

            // 9. Convert Canvas to PNG and Trigger Instant Download
            const dataURL = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `Eventora-Pass-${ticket.bookingId}.png`;
            downloadLink.href = dataURL;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            if (window.showToast) {
                window.showToast(`🎟️ Digital pass ${ticket.bookingId} downloaded successfully!`, 'success');
            }
        } catch (error) {
            console.error('Pass download error:', error);
            if (window.showToast) {
                window.showToast('Download failed. Please try Print / PDF option.', 'error');
            }
        }
    },

    /**
     * Print a specific ticket cleanly
     * @param {string} bookingId 
     */
    printTicket(bookingId) {
        const ticketEl = document.getElementById(`ticket-${bookingId}`);
        if (!ticketEl) {
            window.print();
            return;
        }

        // Add temporary print isolation class
        document.body.classList.add('printing-single-ticket');
        ticketEl.classList.add('print-focus-ticket');

        window.print();

        setTimeout(() => {
            document.body.classList.remove('printing-single-ticket');
            ticketEl.classList.remove('print-focus-ticket');
        }, 1000);
    },

    /**
     * Confirm and delete ticket
     * @param {string} bookingId 
     */
    confirmDelete(bookingId) {
        if (confirm(`Are you sure you want to cancel your pass for booking #${bookingId}? This cannot be undone.`)) {
            const success = StorageManager.deleteRegistration(bookingId);
            if (success) {
                if (window.showToast) {
                    window.showToast('Registration cancelled successfully.', 'info');
                }
            }
        }
    }
};

window.TicketPassEngine = TicketPassEngine;
