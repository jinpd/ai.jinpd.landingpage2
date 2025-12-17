// Modal Logic is now handled inline in index.html for reliability
// Legacy code removed to prevent conflicts

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Intersection Observer for Fade Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Start counter if it's a metric item
            if (entry.target.classList.contains('metric-item')) {
                const numberSpan = entry.target.querySelector('.number');
                if (numberSpan) {
                    animateValue(numberSpan, 0, parseInt(numberSpan.getAttribute('data-target')), 2000);
                }
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-up, .fade-right').forEach(el => {
    observer.observe(el);
});

// Counter Animation Function
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        if (nav.style.display === 'flex') {
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '80px';
            nav.style.left = '0';
            nav.style.width = '100%';
            nav.style.background = '#0a192f';
            nav.style.padding = '20px';
            nav.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        }
    });
}

// Contact Form Logic
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Reset Error Messages
        document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));

        // Values
        const name = document.getElementById('user_name').value.trim();
        const phone = document.getElementById('user_phone').value.trim();
        const email = document.getElementById('user_email').value.trim();
        const message = document.getElementById('message').value.trim();
        const budget = document.getElementById('budget').value;

        // Validation
        let isValid = true;

        if (!name) {
            showError('user_name', 'error_name');
            isValid = false;
        }

        const phoneRegex = /^[\d\-\.]+$/; // Simple check for digits, hyphens, dots
        if (!phone || !phoneRegex.test(phone) || phone.length < 10) {
            showError('user_phone', 'error_phone');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showError('user_email', 'error_email');
            isValid = false;
        }

        if (!message) {
            showError('message', 'error_message');
            isValid = false;
        }

        if (!isValid) return;

        // Prepare Send
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';

        // EmailJS Send
        // Replace with your actual Service ID and Template ID
        const serviceID = 'service_dnmhapk';
        const templateID = 'template_a244hc3';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                alert('문의가 성공적으로 접수되었습니다. 곧 연락드리겠습니다.');
                contactForm.reset();
                closeModal(); // Close modal on success
            })
            .catch((err) => {
                console.error('EmailJS Error:', err);
                alert('전송에 실패했습니다. 잠시 후 다시 시도해주시거나 ai.jinpd@gmail.com으로 연락 주세요.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                btnText.style.display = 'block';
                btnLoading.style.display = 'none';
            });
    });
}

function showError(inputId, errorId) {
    document.getElementById(inputId).parentElement.classList.add('error');
    document.getElementById(errorId).style.display = 'block';
}


