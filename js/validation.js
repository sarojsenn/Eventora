/**
 * Eventora Form Validation Suite
 * Provides real-time field validation, accessible error announcements,
 * and strict checks for full name, email, phone, and agreement.
 */

const FormValidator = {
    // Validation rules & patterns
    rules: {
        fullName: {
            validate: (value) => {
                const trimmed = value.trim();
                // At least 3 chars, letters and spaces/hyphens only
                const nameRegex = /^[A-Za-z\s.'-]{3,60}$/;
                if (!trimmed) return "Full Name is required.";
                if (trimmed.length < 3) return "Name must be at least 3 characters long.";
                if (!nameRegex.test(trimmed)) return "Name can only contain letters, spaces, and hyphens.";
                return null;
            }
        },
        email: {
            validate: (value) => {
                const trimmed = value.trim();
                // Standard RFC-compliant email regex
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!trimmed) return "Email address is required.";
                if (!emailRegex.test(trimmed)) return "Please enter a valid email address (e.g. name@domain.com).";
                return null;
            }
        },
        phone: {
            validate: (value) => {
                // Strip spaces, dashes, brackets, and leading +91 / country code
                const cleaned = value.replace(/[\s\-\(\)\+]/g, '');
                // Match 10 digit standard phone number (or with 91 prefix)
                const phoneRegex = /^(\d{10}|\d{12})$/;
                if (!value.trim()) return "Phone number is required.";
                if (!phoneRegex.test(cleaned)) return "Please enter a valid 10-digit mobile number.";
                return null;
            }
        },
        eventId: {
            validate: (value) => {
                if (!value || value.trim() === '') return "Please select an event.";
                return null;
            }
        },
        ticketType: {
            validate: (value) => {
                if (!value) return "Please choose a ticket pass type.";
                return null;
            }
        },
        ticketQty: {
            validate: (value) => {
                const num = parseInt(value, 10);
                if (isNaN(num) || num < 1 || num > 5) return "You can book between 1 and 5 tickets.";
                return null;
            }
        },
        terms: {
            validate: (checked) => {
                if (!checked) return "You must agree to the event guidelines & code of conduct.";
                return null;
            }
        }
    },

    /**
     * Validate an individual input element
     * @param {HTMLElement} inputEl 
     * @returns {boolean} isValid
     */
    validateField(inputEl) {
        const fieldName = inputEl.name || inputEl.id;
        const rule = this.rules[fieldName];
        if (!rule) return true;

        const value = inputEl.type === 'checkbox' ? inputEl.checked : inputEl.value;
        const errorMsg = rule.validate(value);

        const formGroup = inputEl.closest('.form-group') || inputEl.parentElement;
        const errorEl = formGroup ? formGroup.querySelector('.form-error-msg') : null;

        if (errorMsg) {
            inputEl.classList.remove('is-valid');
            inputEl.classList.add('is-invalid');
            inputEl.setAttribute('aria-invalid', 'true');
            if (errorEl) {
                errorEl.textContent = errorMsg;
                errorEl.style.display = 'block';
            }
            return false;
        } else {
            inputEl.classList.remove('is-invalid');
            inputEl.classList.add('is-valid');
            inputEl.setAttribute('aria-invalid', 'false');
            if (errorEl) {
                errorEl.textContent = '';
                errorEl.style.display = 'none';
            }
            return true;
        }
    },

    /**
     * Clear validation styles from a form
     * @param {HTMLFormElement} form 
     */
    resetForm(form) {
        if (!form) return;
        form.reset();
        const inputs = form.querySelectorAll('.is-valid, .is-invalid');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
            input.removeAttribute('aria-invalid');
        });
        const errors = form.querySelectorAll('.form-error-msg');
        errors.forEach(err => {
            err.textContent = '';
            err.style.display = 'none';
        });
    },

    /**
     * Validate full registration form
     * @param {HTMLFormElement} form 
     * @returns {{ isValid: boolean, data: Object|null }}
     */
    validateForm(form) {
        const fieldsToValidate = ['fullName', 'email', 'phone', 'eventId', 'ticketType', 'ticketQty', 'terms'];
        let isFormValid = true;
        let firstInvalidInput = null;

        fieldsToValidate.forEach(fieldName => {
            const input = form.elements[fieldName];
            if (input) {
                const isValid = this.validateField(input);
                if (!isValid) {
                    isFormValid = false;
                    if (!firstInvalidInput) {
                        firstInvalidInput = input;
                    }
                }
            }
        });

        if (!isFormValid && firstInvalidInput) {
            firstInvalidInput.focus();
            // Trigger visual shake
            const group = firstInvalidInput.closest('.form-group');
            if (group) {
                group.classList.add('shake-anim');
                setTimeout(() => group.classList.remove('shake-anim'), 600);
            }
            return { isValid: false, data: null };
        }

        const formData = {
            fullName: form.elements['fullName'].value.trim(),
            email: form.elements['email'].value.trim(),
            phone: form.elements['phone'].value.trim(),
            eventId: form.elements['eventId'].value,
            ticketType: form.elements['ticketType'].value,
            ticketQty: parseInt(form.elements['ticketQty'].value, 10) || 1,
            notes: form.elements['notes'] ? form.elements['notes'].value.trim() : ''
        };

        return { isValid: true, data: formData };
    },

    /**
     * Attach real-time validation listeners to form inputs
     * @param {HTMLFormElement} form 
     */
    attachListeners(form) {
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            // Validate on blur (user tabs away or clicks out)
            input.addEventListener('blur', () => {
                if (input.value || input.type === 'checkbox') {
                    this.validateField(input);
                }
            });

            // If already marked invalid, re-validate on keystroke for quick recovery
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    this.validateField(input);
                }
            });

            // Special for select & checkbox
            input.addEventListener('change', () => {
                this.validateField(input);
            });
        });
    }
};

window.FormValidator = FormValidator;
