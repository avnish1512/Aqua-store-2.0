// AquaVerse Interactive Experience & Store Logic

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initScrollTracker();
    initParallax();
    initBubbleGenerator();
    initCartSystem();
    initSoundscape();
});

// ===== 1. SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Keep observing if we want to toggle visible on scroll up/down,
                // but standard premium look is fade-in once.
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.1, // trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // offset to feel natural
    });
    
    reveals.forEach(el => revealObserver.observe(el));
}

// ===== 2. SCROLL TRACKER (DEPTH GAUGE & NAVIGATION STATUS) =====
function initScrollTracker() {
    const navbar = document.getElementById('navbar');
    const depthFill = document.getElementById('depthFill');
    const depthIndicatorDot = document.getElementById('depthIndicatorDot');
    const depthNumber = document.getElementById('depthNumber');
    
    const sections = document.querySelectorAll('header.hero, section.ocean-zone');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Toggle nav scrolled glassmorphism
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Calculate scroll percentage
        const scrollPercent = docHeight > 0 ? (scrollY / docHeight) : 0;
        
        // Update depth gauge sidebar
        const percentValue = Math.min(Math.max(scrollPercent * 100, 0), 100);
        depthFill.style.height = `${percentValue}%`;
        depthIndicatorDot.style.top = `${percentValue}%`;
        
        // Calculate mock ocean depth (0m to 11,000m - Challenger Deep depth)
        // Let's use a nice non-linear depth curve to show depth transitions:
        // Slow depth increase at start, rapid plunge in the abyss.
        let depth = 0;
        if (scrollPercent <= 0.3) {
            // First 30% of scroll corresponds to Surface & Sunlight (0m - 200m)
            depth = Math.round((scrollPercent / 0.3) * 200);
        } else if (scrollPercent <= 0.7) {
            // Next 40% scroll corresponds to Twilight/Midnight (200m - 4000m)
            depth = Math.round(200 + ((scrollPercent - 0.3) / 0.4) * 3800);
        } else {
            // Last 30% scroll corresponds to Trench (4000m - 11000m)
            depth = Math.round(4000 + ((scrollPercent - 0.7) / 0.3) * 7000);
        }
        
        // Format depth output
        depthNumber.textContent = depth.toLocaleString() + 'm';
        
        // Update active navigation links
        let currentSectionId = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 150;
            const height = sec.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                currentSectionId = sec.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== 3. PARALLAX BACKGROUND EFFECT =====
function initParallax() {
    const backgrounds = [
        { el: document.getElementById('heroBg'), speed: 0.15 },
        { el: document.getElementById('surfaceBg'), speed: 0.12 },
        { el: document.getElementById('midnightBg'), speed: 0.12 },
        { el: document.getElementById('deeptrenchBg'), speed: 0.12 }
    ];
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        backgrounds.forEach(bg => {
            if (!bg.el) return;
            const parent = bg.el.parentElement;
            const rect = parent.getBoundingClientRect();
            
            // Only update parallax if section is partially in viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const relativeScroll = scrollY - parent.offsetTop;
                const offset = relativeScroll * bg.speed;
                bg.el.style.transform = `translateY(${offset}px) scale(1.15)`;
            }
        });
    });
}

// ===== 4. FLOATING BUBBLE GENERATOR =====
function initBubbleGenerator() {
    const containers = document.querySelectorAll('.bubble-container');
    
    containers.forEach(container => {
        const count = 15; // bubbles per section
        
        for (let i = 0; i < count; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            // Random styling for natural dispersion
            const size = Math.random() * 15 + 5; // 5px to 20px
            const left = Math.random() * 100; // 0% to 100%
            const duration = Math.random() * 8 + 6; // 6s to 14s
            const delay = Math.random() * 8; // 0s to 8s delay
            
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.animationDelay = `${delay}s`;
            
            container.appendChild(bubble);
        }
    });
}

// ===== 5. E-COMMERCE SHOPPING CART SYSTEM =====
function initCartSystem() {
    let cart = [];
    
    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmptyMessage = document.getElementById('cartEmptyMessage');
    const cartTotalVal = document.getElementById('cartTotalVal');
    const cartCount = document.getElementById('cartCount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    const successModal = document.getElementById('successModal');
    const successCloseBtn = document.getElementById('successCloseBtn');
    
    // Add to cart listeners
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const title = btn.getAttribute('data-title');
            const price = parseFloat(btn.getAttribute('data-price'));
            
            addToCart(id, title, price);
            openCart();
            
            // Add subtle click micro-animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => { btn.style.transform = 'none'; }, 150);
        });
    });
    
    // Drawer open/close toggles
    cartToggleBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    // Checkout trigger
    checkoutBtn.addEventListener('click', () => {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Securing Itinerary...';
        
        // Simulating booking registration
        setTimeout(() => {
            closeCart();
            openSuccessModal();
            clearCart();
            
            // Reset button state
            checkoutBtn.textContent = 'Confirm Bookings';
        }, 1500);
    });
    
    successCloseBtn.addEventListener('click', closeSuccessModal);
    
    function addToCart(id, title, price) {
        // Prevent duplicate bookings for expeditions
        const exists = cart.find(item => item.id === id);
        if (exists) return;
        
        cart.push({ id, title, price });
        updateCartUI();
    }
    
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    }
    
    function clearCart() {
        cart = [];
        updateCartUI();
    }
    
    function updateCartUI() {
        // Update count badge
        cartCount.textContent = cart.length;
        
        // Clear items display
        cartItemsContainer.querySelectorAll('.cart-item').forEach(el => el.remove());
        
        if (cart.length === 0) {
            cartEmptyMessage.style.display = 'block';
            checkoutBtn.disabled = true;
            cartTotalVal.textContent = '$0';
        } else {
            cartEmptyMessage.style.display = 'none';
            checkoutBtn.disabled = false;
            
            let total = 0;
            cart.forEach(item => {
                total += item.price;
                
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>${formatCurrency(item.price)}</p>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Remove</button>
                `;
                
                // Remove button logic
                itemEl.querySelector('.remove-item-btn').addEventListener('click', () => {
                    removeFromCart(item.id);
                });
                
                cartItemsContainer.appendChild(itemEl);
            });
            
            cartTotalVal.textContent = formatCurrency(total);
        }
    }
    
    function formatCurrency(val) {
        if (val >= 1000) {
            return '$' + val.toLocaleString();
        }
        return '$' + val;
    }
    
    function openCart() {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
    }
    
    function closeCart() {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
    }
    
    function openSuccessModal() {
        successModal.classList.add('open');
        cartOverlay.classList.add('open'); // re-use backdrop
    }
    
    function closeSuccessModal() {
        successModal.classList.remove('open');
        cartOverlay.classList.remove('open');
    }
}

// ===== 6. WEB AUDIO AMBIENT SOUNDSCAPE =====
function initSoundscape() {
    const audioBtn = document.getElementById('audioToggleBtn');
    let audioCtx = null;
    let rumblingNode = null;
    let isPlaying = false;
    
    // pink/brown noise audio buffer generator
    function createNoiseBuffer(ctx) {
        const bufferSize = ctx.sampleRate * 2; // 2 seconds of sound
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            // Brown noise filter (integrator of white noise)
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5; // Amplify
        }
        return noiseBuffer;
    }
    
    function startAmbientNoise() {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Noise source
        const noiseSource = audioCtx.createBufferSource();
        noiseSource.buffer = createNoiseBuffer(audioCtx);
        noiseSource.loop = true;
        
        // Lowpass filter for deep underwater pressure rumble
        const lowpassFilter = audioCtx.createBiquadFilter();
        lowpassFilter.type = 'lowpass';
        lowpassFilter.frequency.setValueAtTime(120, audioCtx.currentTime); // Deep rumble
        lowpassFilter.Q.setValueAtTime(1, audioCtx.currentTime);
        
        // LFO (Low-Frequency Oscillator) to simulate rolling waves
        const waveLfo = audioCtx.createOscillator();
        waveLfo.type = 'sine';
        waveLfo.frequency.setValueAtTime(0.08, audioCtx.currentTime); // Very slow oscillation (12.5 seconds cycle)
        
        // LFO gain depth
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.setValueAtTime(45, audioCtx.currentTime); // Modulate filter frequency by +/-45Hz
        
        // Master gain (volume)
        const masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
        
        // Connect LFO modulation to filter frequency
        waveLfo.connect(lfoGain);
        lfoGain.connect(lowpassFilter.frequency);
        
        // Connect audio graph
        noiseSource.connect(lowpassFilter);
        lowpassFilter.connect(masterGain);
        masterGain.connect(audioCtx.destination);
        
        // Start sources
        noiseSource.start(0);
        waveLfo.start(0);
        
        // Fade in volume to prevent pop
        masterGain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 2);
        
        // Save node references
        rumblingNode = {
            ctx: audioCtx,
            source: noiseSource,
            lfo: waveLfo,
            filter: lowpassFilter,
            gain: masterGain
        };
    }
    
    function stopAmbientNoise() {
        if (!rumblingNode) return;
        
        const gainNode = rumblingNode.gain;
        const ctx = rumblingNode.ctx;
        
        // Fade out
        gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        
        setTimeout(() => {
            try {
                rumblingNode.source.stop();
                rumblingNode.lfo.stop();
                ctx.close();
            } catch(e) {
                // Already closed
            }
            rumblingNode = null;
            audioCtx = null;
        }, 1100);
    }
    
    audioBtn.addEventListener('click', () => {
        if (!isPlaying) {
            try {
                startAmbientNoise();
                isPlaying = true;
                audioBtn.classList.add('playing');
                audioBtn.querySelector('span').textContent = 'Ambient ON';
            } catch(err) {
                console.error("Audio Context could not start:", err);
            }
        } else {
            stopAmbientNoise();
            isPlaying = false;
            audioBtn.classList.remove('playing');
            audioBtn.querySelector('span').textContent = 'Ambient OFF';
        }
    });
}
