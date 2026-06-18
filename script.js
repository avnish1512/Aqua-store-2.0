(function() {
    'use strict';

    // ===== HERO CANVAS: Bubble & Particle System =====
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles = [], bubbles = [];
        const PARTICLE_COUNT = 60;
        const BUBBLE_COUNT = 25;

        function resize() {
            width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3 - 0.2,
                    radius: Math.random() * 2 + 0.5,
                    alpha: Math.random() * 0.5 + 0.2,
                    pulse: Math.random() * Math.PI * 2
                });
            }
        }

        function createBubbles() {
            bubbles = [];
            for (let i = 0; i < BUBBLE_COUNT; i++) {
                bubbles.push({
                    x: Math.random() * width,
                    y: height + Math.random() * 200,
                    vy: -(Math.random() * 0.8 + 0.3),
                    radius: Math.random() * 4 + 2,
                    wobble: Math.random() * Math.PI * 2,
                    wobbleSpeed: Math.random() * 0.02 + 0.01
                });
            }
        }

        function drawParticles() {
            const w = width / window.devicePixelRatio;
            const h = height / window.devicePixelRatio;

            ctx.clearRect(0, 0, w, h);

            // Draw subtle gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, h);
            gradient.addColorStop(0, 'rgba(14, 165, 160, 0.03)');
            gradient.addColorStop(0.5, 'transparent');
            gradient.addColorStop(1, 'rgba(10, 126, 122, 0.05)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            // Draw particles (plankton-like)
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.pulse += 0.02;

                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(20, 184, 166, ${alpha})`;
                ctx.fill();
            });

            // Draw bubbles
            bubbles.forEach(b => {
                b.y += b.vy;
                b.wobble += b.wobbleSpeed;
                const x = b.x + Math.sin(b.wobble) * 10;

                if (b.y < -20) {
                    b.y = h + 20;
                    b.x = Math.random() * w;
                }

                ctx.beginPath();
                ctx.arc(x, b.y, b.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(20, 184, 166, ${0.15 + 0.1 * Math.sin(b.wobble)})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Bubble highlight
                ctx.beginPath();
                ctx.arc(x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
                ctx.fill();
            });

            // Draw connecting lines between nearby particles
            ctx.strokeStyle = 'rgba(14, 165, 160, 0.03)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(drawParticles);
        }

        resize();
        createParticles();
        createBubbles();
        drawParticles();

        window.addEventListener('resize', () => {
            resize();
            createParticles();
            createBubbles();
        });
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // ===== HERO PARALLAX & FADE ON SCROLL =====
    const heroBg = document.getElementById('heroBg');
    const heroContent = document.querySelector('.hero-content');
    const heroOverlay = document.querySelector('.hero-overlay');
    const hero = document.getElementById('hero');

    if (heroBg && heroContent) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;
            const progress = Math.min(scrollY / heroHeight, 1);

            // Parallax background: moves slower than scroll
            const parallaxOffset = scrollY * 0.4;
            heroBg.style.transform = `translateY(${parallaxOffset}px) scale(${1 + progress * 0.1})`;

            // Fade and scale hero content
            heroContent.style.opacity = 1 - progress * 1.5;
            heroContent.style.transform = `translateY(${scrollY * 0.3}px) scale(${1 - progress * 0.05})`;

            // Darken overlay as we scroll
            if (heroOverlay) {
                heroOverlay.style.opacity = 1 - progress * 0.3;
            }

            // Subtle zoom on hero
            hero.style.perspective = '1000px';
        }, { passive: true });
    }

    // ===== SCROLL PROGRESS BAR =====
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = progress + '%';
        }, { passive: true });
    }

    // ===== MOBILE MENU =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ===== SCROLL ANIMATIONS =====
    const animateElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Start counter animation if it's a stat
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber) animateCounter(statNumber);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));

    // ===== COUNTER ANIMATION =====
    function animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.round(startValue + (target - startValue) * eased);
            element.textContent = current;
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    // ===== FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'Message Sent!';
                btn.style.background = '#10b981';
                contactForm.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 2500);
            }, 1500);
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHORS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== PARALLAX FOR GALLERY ITEMS =====
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const statItems = document.querySelectorAll('.stat-item');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Gallery parallax
        galleryItems.forEach((img) => {
            const rect = img.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (rect.top - window.innerHeight * 0.5) * 0.03;
                img.style.transform = `translateY(${offset}px) scale(1.08)`;
            }
        });

        // Stats parallax (subtle rotation)
        statItems.forEach((stat, i) => {
            const rect = stat.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (rect.top - window.innerHeight * 0.5) * 0.01;
                const dir = i % 2 === 0 ? 1 : -1;
                stat.style.transform = `translateY(${offset * dir}px)`;
            }
        });
    }, { passive: true });

})();
