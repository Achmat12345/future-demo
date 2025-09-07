// MaRk7RaW ATELIER - Neural Background System

class NeuralBackground {
    constructor(options = {}) {
        this.canvas = options.canvas || document.getElementById('neural-background');
        this.ctx = this.canvas?.getContext('2d');
        
        if (!this.canvas || !this.ctx) {
            console.warn('Neural Background: Canvas not found');
            return;
        }
        
        // Configuration
        this.config = {
            nodeCount: options.nodeCount || 80,
            connectionDistance: options.connectionDistance || 150,
            animationSpeed: options.animationSpeed || 0.5,
            mouseInfluence: options.mouseInfluence || 100,
            colors: {
                nodes: options.colors?.nodes || '#FFD700',
                connections: options.colors?.connections || 'rgba(255, 215, 0, 0.3)',
                mouseConnections: options.colors?.mouseConnections || 'rgba(255, 215, 0, 0.6)',
                background: options.colors?.background || 'transparent'
            },
            performance: {
                maxFPS: 60,
                lowPowerNodeCount: 30,
                batteryThreshold: 0.2
            }
        };
        
        // State
        this.nodes = [];
        this.mouse = { x: 0, y: 0, active: false };
        this.animationId = null;
        this.isLowPowerMode = false;
        this.lastTime = 0;
        this.fps = 60;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createNodes();
        this.bindEvents();
        this.start();
        
        console.log('🧠 Neural Background initialized with', this.nodes.length, 'nodes');
    }
    
    setupCanvas() {
        const updateCanvasSize = () => {
            const rect = this.canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            
            this.ctx.scale(dpr, dpr);
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            
            this.width = rect.width;
            this.height = rect.height;
        };
        
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
    }
    
    createNodes() {
        this.nodes = [];
        const nodeCount = this.isLowPowerMode ? 
            this.config.performance.lowPowerNodeCount : 
            this.config.nodeCount;
            
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push(new NeuralNode(this.width, this.height, this.config));
        }
    }
    
    bindEvents() {
        // Mouse/touch tracking
        const updateMousePosition = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.active = true;
        };
        
        this.canvas.addEventListener('mousemove', updateMousePosition);
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                updateMousePosition(e.touches[0]);
            }
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.active = false;
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.mouse.active = false;
        });
        
        // Visibility API for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Battery API monitoring
        this.monitorBatteryStatus();
    }
    
    monitorBatteryStatus() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const checkBattery = () => {
                    if (!battery.charging && battery.level < this.config.performance.batteryThreshold) {
                        this.enableLowPowerMode();
                    }
                };
                
                checkBattery();
                battery.addEventListener('levelchange', checkBattery);
                battery.addEventListener('chargingchange', checkBattery);
            });
        }
    }
    
    enableLowPowerMode() {
        if (this.isLowPowerMode) return;
        
        this.isLowPowerMode = true;
        this.config.animationSpeed *= 0.5;
        this.config.performance.maxFPS = 30;
        this.createNodes(); // Recreate with fewer nodes
        
        console.log('🔋 Neural Background: Low power mode enabled');
    }
    
    start() {
        if (this.animationId) return;
        this.animate();
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    animate(currentTime = 0) {
        // FPS limiting
        const elapsed = currentTime - this.lastTime;
        const fpsInterval = 1000 / this.config.performance.maxFPS;
        
        if (elapsed > fpsInterval) {
            this.update();
            this.render();
            this.lastTime = currentTime - (elapsed % fpsInterval);
        }
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    update() {
        // Update nodes
        this.nodes.forEach(node => {
            node.update(this.mouse, this.config.animationSpeed);
            
            // Boundary checking
            if (node.x < 0 || node.x > this.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.height) node.vy *= -1;
            
            node.x = Math.max(0, Math.min(this.width, node.x));
            node.y = Math.max(0, Math.min(this.height, node.y));
        });
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = this.config.colors.background;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw connections
        this.drawConnections();
        
        // Draw mouse connections if active
        if (this.mouse.active) {
            this.drawMouseConnections();
        }
        
        // Draw nodes
        this.drawNodes();
    }
    
    drawConnections() {
        this.ctx.strokeStyle = this.config.colors.connections;
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const node1 = this.nodes[i];
                const node2 = this.nodes[j];
                const distance = this.getDistance(node1, node2);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = 1 - (distance / this.config.connectionDistance);
                    this.ctx.globalAlpha = opacity * 0.6;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(node1.x, node1.y);
                    this.ctx.lineTo(node2.x, node2.y);
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    drawMouseConnections() {
        this.ctx.strokeStyle = this.config.colors.mouseConnections;
        this.ctx.lineWidth = 2;
        
        this.nodes.forEach(node => {
            const distance = this.getDistance(this.mouse, node);
            
            if (distance < this.config.mouseInfluence) {
                const opacity = 1 - (distance / this.config.mouseInfluence);
                this.ctx.globalAlpha = opacity;
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.mouse.x, this.mouse.y);
                this.ctx.lineTo(node.x, node.y);
                this.ctx.stroke();
                
                // Add glow effect to connected nodes
                node.isHighlighted = true;
                node.highlightDecay = 1.0;
            }
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    drawNodes() {
        this.nodes.forEach(node => {
            node.render(this.ctx, this.config.colors.nodes);
        });
    }
    
    getDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Public methods
    destroy() {
        this.pause();
        this.nodes = [];
        console.log('🧠 Neural Background destroyed');
    }
    
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        this.createNodes();
    }
}

class NeuralNode {
    constructor(canvasWidth, canvasHeight, config) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        
        // Velocity
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        
        // Visual properties
        this.radius = Math.random() * 3 + 1;
        this.baseRadius = this.radius;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.baseOpacity = this.opacity;
        
        // Interaction properties
        this.isHighlighted = false;
        this.highlightDecay = 0;
        this.pulsePhase = Math.random() * Math.PI * 2;
        
        // Configuration
        this.maxSpeed = 0.5;
        this.mouseRepulsion = 50;
    }
    
    update(mouse, animationSpeed) {
        // Apply mouse influence
        if (mouse.active) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouseRepulsion) {
                const force = (this.mouseRepulsion - distance) / this.mouseRepulsion;
                this.vx += (dx / distance) * force * 0.1;
                this.vy += (dy / distance) * force * 0.1;
            }
        }
        
        // Limit velocity
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
            this.vx = (this.vx / speed) * this.maxSpeed;
            this.vy = (this.vy / speed) * this.maxSpeed;
        }
        
        // Update position
        this.x += this.vx * animationSpeed;
        this.y += this.vy * animationSpeed;
        
        // Update visual effects
        this.updateVisualEffects();
    }
    
    updateVisualEffects() {
        // Pulse animation
        this.pulsePhase += 0.02;
        const pulseEffect = Math.sin(this.pulsePhase) * 0.1 + 1;
        
        // Highlight decay
        if (this.isHighlighted) {
            this.highlightDecay -= 0.05;
            if (this.highlightDecay <= 0) {
                this.isHighlighted = false;
                this.highlightDecay = 0;
            }
        }
        
        // Update radius and opacity based on effects
        this.radius = this.baseRadius * pulseEffect * (1 + this.highlightDecay * 0.5);
        this.opacity = this.baseOpacity * (0.7 + this.highlightDecay * 0.3);
    }
    
    render(ctx, color) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Main node
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect for highlighted nodes
        if (this.isHighlighted) {
            ctx.globalAlpha = this.highlightDecay * 0.3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Auto-initialize if canvas exists
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('neural-background');
    if (canvas && !window.neuralBackground) {
        window.neuralBackground = new NeuralBackground();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NeuralBackground, NeuralNode };
}
