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
const pricingToggle = document.getElementById('pricingToggle');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');

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
// Smooth Scroll Navigation
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Pricing Toggle (Monthly/Yearly)
// ========================================
let isYearly = false;

function togglePricing() {
    isYearly = !isYearly;
    pricingToggle.classList.toggle('active', isYearly);
    
    // Update toggle labels
    document.querySelectorAll('.toggle-label').forEach(label => {
        label.classList.toggle('active', 
            (label.dataset.period === 'yearly' && isYearly) || 
            (label.dataset.period === 'monthly' && !isYearly)
        );
    });
    
    // Update prices
    document.querySelectorAll('.price').forEach(priceEl => {
        const monthly = priceEl.dataset.monthly;
        const yearly = priceEl.dataset.yearly;
        priceEl.textContent = isYearly ? yearly : monthly;
    });
}

pricingToggle.addEventListener('click', togglePricing);

// Also allow clicking on labels
document.querySelectorAll('.toggle-label').forEach(label => {
    label.addEventListener('click', () => {
        if ((label.dataset.period === 'yearly' && !isYearly) || 
            (label.dataset.period === 'monthly' && isYearly)) {
            togglePricing();
        }
    });
});

// ========================================
// Statistics Counter Animation
// ========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * easeOut;
        
        element.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Intersection Observer for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseFloat(stat.dataset.target);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsBanner = document.querySelector('.stats-banner');
if (statsBanner) {
    statsObserver.observe(statsBanner);
}

// ========================================
// Scroll Reveal Animations
// ========================================
const revealElements = document.querySelectorAll(
    '.feature-card, .step, .testimonial-card, .pricing-card, .about-list li, .info-card'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active');
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ========================================
// Form Validation
// ========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    formGroup.querySelector('.error-message').textContent = message;
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
}

function validateForm(form) {
    let isValid = true;
    
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    
    // Clear previous errors
    [name, email, message].forEach(clearError);
    
    // Validate name
    if (name.value.trim().length < 2) {
        showError(name, 'Please enter your name');
        isValid = false;
    }
    
    // Validate email
    if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (message.value.trim().length < 10) {
        showError(message, 'Please enter a message (at least 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

// Contact form submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm(this)) {
        // Show success message
        const button = this.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        button.textContent = 'Message Sent! ✓';
        button.style.background = '#6BCB77';
        button.disabled = true;
        
        // Reset form
        setTimeout(() => {
            this.reset();
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 3000);
    }
});

// Real-time validation
contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.id === 'email' && this.value && !validateEmail(this.value)) {
            showError(this, 'Please enter a valid email address');
        } else if (this.value) {
            clearError(this);
        }
    });
    
    input.addEventListener('input', function() {
        if (this.closest('.form-group').classList.contains('error')) {
            clearError(this);
        }
    });
});

// ========================================
// Newsletter Form
// ========================================
newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.querySelector('input[type="email"]');
    const button = this.querySelector('button');
    
    if (validateEmail(email.value)) {
        const originalText = button.textContent;
        button.textContent = 'Subscribed! ✓';
        button.style.background = '#6BCB77';
        
        setTimeout(() => {
            email.value = '';
            button.textContent = originalText;
            button.style.background = '';
        }, 3000);
    }
});

// ========================================
// Keyboard Navigation
// ========================================
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', function() {
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
