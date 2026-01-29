/**
 * SocialSpark Landing Page
 * Main JavaScript file for interactive functionality
 */

// ========================================
// DOM Elements
// ========================================
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const leadForm = document.getElementById('leadForm');

// ========================================
// Sticky Header with Shadow
// ========================================
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);

// ========================================
// Mobile Menu Toggle
// ========================================
function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// ========================================
// Smooth Scroll Navigation with Offset
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            // No extra offset - section aligns with header bottom
            const extraOffset = 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// FAQ Accordion with Smooth Animation
// ========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('faq-open');

        // Close all other items with animation
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('faq-open');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherAnswer.style.maxHeight = null;
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            }
        });

        // Toggle current item with smooth height animation
        if (!isOpen) {
            item.classList.add('faq-open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            question.setAttribute('aria-expanded', 'true');
        } else {
            item.classList.remove('faq-open');
            answer.style.maxHeight = null;
            question.setAttribute('aria-expanded', 'false');
        }
    });
});


// ========================================
// Form Validation
// ========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Basic phone validation - at least 10 digits
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function clearAllErrors(form) {
    form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
}

// ========================================
// Lead Form Submission
// ========================================
if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = this.querySelector('#leadName');
        const phone = this.querySelector('#leadPhone');
        const email = this.querySelector('#leadEmail');
        const brief = this.querySelector('#leadBrief');

        let isValid = true;

        // Clear previous errors
        clearAllErrors(this);

        // Validate name
        if (name.value.trim().length < 2) {
            showError(name, 'Please enter your full name');
            isValid = false;
        }

        // Validate phone
        if (!validatePhone(phone.value)) {
            showError(phone, 'Please enter a valid phone number');
            isValid = false;
        }

        // Validate email
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate brief
        if (brief.value.trim().length < 20) {
            showError(brief, 'Please provide more details about your business (at least 20 characters)');
            isValid = false;
        }

        if (isValid) {
            // Show success message
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;

            button.textContent = 'Request Sent! ✓';
            button.style.background = '#6BCB77';
            button.disabled = true;

            // Reset form after delay
            setTimeout(() => {
                this.reset();
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 4000);
        }
    });

    // Real-time validation on blur
    leadForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', function () {
            if (this.id === 'leadEmail' && this.value && !validateEmail(this.value)) {
                showError(this, 'Please enter a valid email address');
            } else if (this.id === 'leadPhone' && this.value && !validatePhone(this.value)) {
                showError(this, 'Please enter a valid phone number');
            } else if (this.value) {
                clearError(this);
            }
        });

        input.addEventListener('input', function () {
            if (this.closest('.form-group').classList.contains('error')) {
                clearError(this);
            }
        });
    });
}

// ========================================
// Scroll Reveal Animations
// ========================================
const revealElements = document.querySelectorAll(
    '.service-card, .process-step, .testimonial-card, .pricing-card, .pricing-overview-card, .quality-list li, .faq-item'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active');
            }, index * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ========================================
// Keyboard Navigation
// ========================================
document.addEventListener('keydown', function (e) {
    // Close mobile menu with Escape
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    // Check initial scroll position
    handleScroll();

    // Add loading animation complete class
    document.body.classList.add('loaded');
});

// ========================================
// Prefers Reduced Motion
// ========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('active');
    });
}
