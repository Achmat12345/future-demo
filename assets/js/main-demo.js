// MaRk7RaW ATELIER Demo - Main JavaScript

class MaRk7RaWDemo {
    constructor() {
        this.isLoaded = false;
        this.currentUser = {
            tier: 'platinum',
            points: 12450,
            name: 'Demo User'
        };
        
        console.log('🔮 MaRk7RaW Demo constructor called');
        this.init();
    }
    
    init() {
        console.log('🔮 Initializing demo systems');
        try {
            this.setupLoader();
            this.setupNavigation();
            this.setupCustomCursor();
            this.setupScrollEffects();
            this.setupModalSystem();
            this.setupVIPSystem();
            this.setup3DInteractions();
            this.setupPerformanceMonitoring();
            
            // Initialize when DOM is loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
            } else {
                setTimeout(() => this.onDOMReady(), 100);
            }
        } catch (error) {
            console.error('Demo initialization error:', error);
            // Fallback: just show content
            this.showContentDirectly();
        }
    }
    
    showContentDirectly() {
        console.log('🔄 Using fallback content display');
        setTimeout(() => {
            const loader = document.getElementById('holographic-loader');
            const mainContent = document.getElementById('main-content');
            
            if (loader) loader.style.display = 'none';
            if (mainContent) {
                mainContent.classList.remove('hidden');
                mainContent.style.display = 'block';
            }
        }, 500);
    }
    
    onDOMReady() {
        console.log('🔮 MaRk7RaW ATELIER Demo Initialized');
        this.startLoadingSequence();
        this.initializeNeuralBackground();
        this.updateVIPStatus();
    }
    
    // Initialize Neural Background
    initializeNeuralBackground() {
        try {
            console.log('🔮 Initializing neural background');
            // Check if NeuralBackground class exists
            if (typeof NeuralBackground !== 'undefined') {
                window.neuralBg = new NeuralBackground();
                console.log('✅ Neural background initialized');
            } else {
                console.warn('⚠️ NeuralBackground class not found, using fallback');
            }
        } catch (error) {
            console.warn('⚠️ Neural background initialization failed:', error);
        }
    }
    
    // Loading System
    startLoadingSequence() {
        console.log('🔮 Starting loading sequence');
        const loader = document.getElementById('holographic-loader');
        const mainContent = document.getElementById('main-content');
        
        if (!loader) {
            console.error('Loader element not found!');
            return;
        }
        
        if (!mainContent) {
            console.error('Main content element not found!');
            return;
        }
        
        // Ensure loading is visible
        loader.style.display = 'flex';
        loader.style.opacity = '1';
        
        // Complete loading after 2 seconds
        setTimeout(() => {
            console.log('🎯 Completing loading sequence');
            loader.style.transition = 'opacity 0.5s ease';
            loader.style.opacity = '0';
            
            setTimeout(() => {
                loader.style.display = 'none';
                mainContent.classList.remove('hidden');
                mainContent.style.display = 'block';
                this.isLoaded = true;
                console.log('✅ Demo fully loaded');
                this.animateHeroSection();
            }, 500);
        }, 2000);
    }
    
    animateHeroSection() {
        const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    // Navigation System
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');
        
        // Smooth scrolling for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active nav link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
        
        // Update nav on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
        
        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
            });
        }
    }
    
    // Custom Cursor
    setupCustomCursor() {
        const cursor = document.getElementById('custom-cursor');
        if (!cursor) return;
        
        const cursorDot = cursor.querySelector('.cursor-dot');
        const cursorTrail = cursor.querySelector('.cursor-trail');
        
        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (cursorDot) {
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
            }
        });
        
        // Smooth trail animation
        const animateTrail = () => {
            trailX += (mouseX - trailX) * 0.1;
            trailY += (mouseY - trailY) * 0.1;
            
            if (cursorTrail) {
                cursorTrail.style.left = trailX + 'px';
                cursorTrail.style.top = trailY + 'px';
            }
            
            requestAnimationFrame(animateTrail);
        };
        animateTrail();
        
        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .brand-card, model-viewer');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
    }
    
    // Scroll Effects
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };
        
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                }
            });
        }, observerOptions);
        
        // Observe elements for fade-in animation
        const fadeElements = document.querySelectorAll('.brand-card, .tier-card, .tech-card');
        fadeElements.forEach(el => {
            el.classList.add('fade-in-element');
            fadeInObserver.observe(el);
        });
    }
    
    // Modal System
    setupModalSystem() {
        // Features modal
        window.showFullFeatures = () => {
            const modal = document.getElementById('features-modal');
            if (modal) {
                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('active'), 10);
            }
        };
        
        // Close modals
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                    setTimeout(() => modal.style.display = 'none', 300);
                }
            });
        });
        
        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
                setTimeout(() => e.target.style.display = 'none', 300);
            }
        });
    }
    
    // VIP System
    setupVIPSystem() {
        this.updateVIPDisplay();
        this.setupVIPInteractions();
    }
    
    updateVIPDisplay() {
        const vipBadge = document.querySelector('.vip-badge');
        const vipPoints = document.querySelector('.vip-points');
        const currentTier = document.querySelector('.current-tier');
        const currentPoints = document.querySelector('.current-points');
        
        if (vipBadge) {
            vipBadge.className = `vip-badge ${this.currentUser.tier}`;
            vipBadge.textContent = this.getTierName(this.currentUser.tier);
        }
        
        if (vipPoints) {
            vipPoints.textContent = `${this.currentUser.points.toLocaleString()} pts`;
        }
        
        if (currentTier) {
            currentTier.textContent = this.getTierName(this.currentUser.tier);
        }
        
        if (currentPoints) {
            currentPoints.textContent = `${this.currentUser.points.toLocaleString()} Points`;
        }
    }
    
    getTierName(tier) {
        const names = {
            bronze: 'Bronze Member',
            silver: 'Silver Elite',
            gold: 'Gold Connoisseur',
            platinum: 'Platinum Curator'
        };
        return names[tier] || 'Standard Member';
    }
    
    setupVIPInteractions() {
        // VIP tier cards interaction
        const tierCards = document.querySelectorAll('.tier-card');
        tierCards.forEach(card => {
            card.addEventListener('click', () => {
                // Highlight current tier
                tierCards.forEach(c => c.classList.remove('highlighted'));
                card.classList.add('highlighted');
                
                setTimeout(() => {
                    card.classList.remove('highlighted');
                }, 2000);
            });
        });
    }
    
    updateVIPStatus() {
        // Simulate VIP status updates
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            // Animate progress bar
            setTimeout(() => {
                progressFill.style.width = '100%';
            }, 1000);
        }
    }
    
    // 3D Interactions
    setup3DInteractions() {
        const modelViewers = document.querySelectorAll('model-viewer');
        
        modelViewers.forEach(viewer => {
            // Loading states
            viewer.addEventListener('load', () => {
                console.log('3D Model loaded successfully');
                viewer.classList.add('model-loaded');
            });
            
            viewer.addEventListener('error', (e) => {
                console.error('3D Model failed to load:', e);
                this.show3DFallback(viewer);
            });
            
            // Interaction feedback
            viewer.addEventListener('camera-change', () => {
                viewer.classList.add('model-interacting');
                clearTimeout(viewer.interactionTimeout);
                viewer.interactionTimeout = setTimeout(() => {
                    viewer.classList.remove('model-interacting');
                }, 1000);
            });
        });
    }
    
    show3DFallback(viewer) {
        const fallback = document.createElement('div');
        fallback.className = 'model-fallback';
        fallback.innerHTML = `
            <div class="fallback-content">
                <div class="fallback-icon">🔮</div>
                <p>3D Model Preview</p>
                <small>Interactive 3D view available in full version</small>
            </div>
        `;
        viewer.parentNode.replaceChild(fallback, viewer);
    }
    
    // Neural Background Integration
    initializeNeuralBackground() {
        if (typeof NeuralBackground !== 'undefined') {
            this.neuralBg = new NeuralBackground({
                canvas: document.getElementById('neural-background'),
                nodeCount: this.isMobile() ? 30 : 80,
                connectionDistance: 150,
                animationSpeed: 0.5,
                colors: {
                    nodes: '#FFD700',
                    connections: 'rgba(255, 215, 0, 0.3)',
                    background: 'transparent'
                }
            });
        }
    }
    
    // Performance Monitoring
    setupPerformanceMonitoring() {
        // FPS monitoring
        let fps = 0;
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                // Adjust performance based on FPS
                if (fps < 30 && this.neuralBg) {
                    this.neuralBg.enableLowPowerMode();
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
        
        // Battery status monitoring
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (!battery.charging && battery.level < 0.2) {
                    this.enableBatteryMode();
                }
            });
        }
    }
    
    enableBatteryMode() {
        document.body.classList.add('battery-saver-mode');
        if (this.neuralBg) {
            this.neuralBg.enableLowPowerMode();
        }
        console.log('🔋 Battery saver mode enabled');
    }
    
    // Utility Methods
    isMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    isHighPerformanceDevice() {
        return navigator.hardwareConcurrency > 4 && window.devicePixelRatio <= 2;
    }
    
    // Demo-specific interactions
    setupDemoInteractions() {
        // Brand card animations
        const brandCards = document.querySelectorAll('.brand-card');
        brandCards.forEach(card => {
            card.addEventListener('click', () => {
                const brandType = card.classList.contains('m7r-brand') ? 'M7R' : '7R';
                this.showBrandModal(brandType);
            });
        });
        
        // CTA button interactions
        const ctaButtons = document.querySelectorAll('.cta-button, .brand-cta');
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerCTAAction(btn);
            });
        });
    }
    
    showBrandModal(brandType) {
        const modalContent = brandType === 'M7R' ? 
            'Explore raw streetwear luxury with bold designs and urban aesthetics.' :
            'Discover elegant atelier pieces crafted for discerning connoisseurs.';
            
        // Create temporary modal for demo
        const modal = document.createElement('div');
        modal.className = 'demo-modal';
        modal.innerHTML = `
            <div class="demo-modal-content">
                <h3>${brandType} Collection</h3>
                <p>${modalContent}</p>
                <p><em>Full shopping experience available in WordPress theme.</em></p>
                <button onclick="this.closest('.demo-modal').remove()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    triggerCTAAction(button) {
        const buttonText = button.textContent.trim();
        
        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        // Show appropriate demo message
        const demoMessages = {
            'Explore Collections': 'Full product catalog available in WordPress theme',
            'Join VIP Program': 'VIP registration available in full version',
            'Explore M7R': 'M7R streetwear collection coming soon',
            'Discover 7R': '7R atelier pieces available to VIP members'
        };
        
        const message = demoMessages[buttonText] || 'Feature available in full WordPress theme';
        this.showNotification(message);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'demo-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('active'), 10);
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the demo when script loads
window.addEventListener('load', () => {
    window.mark7rawDemo = new MaRk7RaWDemo();
});

// Global functions for HTML onclick handlers
window.showFullFeatures = function() {
    const modal = document.getElementById('features-modal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaRk7RaWDemo;
}
