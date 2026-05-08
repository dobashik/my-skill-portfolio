document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Email Copy Functionality
    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const email = copyBtn.getAttribute('data-email');
            try {
                await navigator.clipboard.writeText(email);

                // Show tooltip
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy email:', err);
                alert('Failed to copy email. Please manually copy: ' + email);
            }
        });
    }

    // =====================================================
    // Contact Form (AJAX submission via Formspree)
    // =====================================================
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success-message');
    const contactError = document.getElementById('contact-error-message');
    const contactSubmitBtn = document.getElementById('contact-submit-btn');
    const contactResetBtn = document.getElementById('contact-reset-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Reset error display
            if (contactError) {
                contactError.textContent = '';
                contactError.classList.remove('visible');
            }

            // Disable button during submission
            const originalBtnText = contactSubmitBtn.textContent;
            contactSubmitBtn.disabled = true;
            contactSubmitBtn.textContent = '送信中...';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Show success message, hide form
                    contactForm.style.display = 'none';
                    if (contactSuccess) {
                        contactSuccess.classList.add('visible');
                        contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    contactForm.reset();
                } else {
                    // Try to extract Formspree error
                    let errorMsg = '送信に失敗しました。時間をおいて再度お試しください。';
                    try {
                        const data = await response.json();
                        if (data && data.errors && data.errors.length > 0) {
                            errorMsg = data.errors.map(err => err.message).join(' / ');
                        }
                    } catch (_) { /* ignore JSON parse error */ }

                    if (contactError) {
                        contactError.textContent = '⚠ ' + errorMsg;
                        contactError.classList.add('visible');
                    }
                }
            } catch (error) {
                if (contactError) {
                    contactError.textContent = '⚠ ネットワークエラーが発生しました。接続を確認して再度お試しください。';
                    contactError.classList.add('visible');
                }
            } finally {
                contactSubmitBtn.disabled = false;
                contactSubmitBtn.textContent = originalBtnText;
            }
        });
    }

    if (contactResetBtn) {
        contactResetBtn.addEventListener('click', () => {
            if (contactSuccess) contactSuccess.classList.remove('visible');
            if (contactForm) {
                contactForm.style.display = '';
                contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Focus first input for convenience
                const firstInput = contactForm.querySelector('input, textarea');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 400);
                }
            }
        });
    }

    // =====================================================
    // Image Modal (Lightbox) Functionality
    // =====================================================
    // Create modal HTML dynamically
    const modalHtml = `
        <div id="imageModal" class="image-modal">
            <span class="image-modal-close">&times;</span>
            <img class="image-modal-content" id="modalImage">
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeBtn = document.getElementsByClassName("image-modal-close")[0];

    document.querySelectorAll('.clickable-image').forEach(img => {
        img.addEventListener('click', function () {
            modal.style.display = "flex";
            // slight delay to allow display flex to apply before transitioning opacity
            setTimeout(() => modal.classList.add('show'), 10);
            modalImg.src = this.src;
            modalImg.alt = this.alt;
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = "none", 300); // match transition duration
    };

    closeBtn.addEventListener('click', closeModal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });
});
