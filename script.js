// Global variables
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: 0, y: 0 };
let time = 0;

// Canvas setup for animated background
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle system for gaming background
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 3 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.005 + 0.002;
        this.hue = Math.random() * 60 + 180; // Cyan to blue range
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Mouse attraction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            this.vx += dx * 0.01;
            this.vy += dy * 0.01;
        }

        // Boundary wrap
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        this.life -= this.decay;
        if (this.life <= 0) this.reset();
    }

    draw() {
        const alpha = this.life;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = `hsla(${this.hue}, 70%, 60%, ${alpha})`;
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.vx * 10, this.y + this.vy * 10);
        ctx.stroke();
        ctx.restore();
    }
}

// Initialize particles
for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
}

// Animation loop
function animate() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 80) {
                ctx.strokeStyle = `rgba(0, 212, 255, ${1 - dist / 80})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    time++;
    requestAnimationFrame(animate);
}

animate();

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.backdropFilter = 'blur(30px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
});

// Smooth scroll to sections
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Scroll to live section
function scrollToLive() {
    scrollToSection('live');
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .card, .social-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    observer.observe(el);
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current) + (target > 1000 ? 'K' : target > 100 ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = counter.getAttribute('data-target') + (target > 1000 ? 'K' : target > 100 ? '+' : '');
            }
        };
        
        if (window.scrollY > 1000) {
            updateCounter();
        }
    });
}

// Throttle scroll events
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(() => {
            animateCounters();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Card hover effects
document.querySelectorAll('.card').forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        const overlay = card.querySelector('.card-overlay');
        const playIcon = card.querySelector('.play-icon');
        
        overlay.style.background = 'rgba(0, 212, 255, 0.3)';
        playIcon.style.transform = 'scale(1.2)';
        playIcon.style.textShadow = '0 0 20px var(--neon-blue)';
    });
    
    card.addEventListener('mouseleave', () => {
        const overlay = card.querySelector('.card-overlay');
        const playIcon = card.querySelector('.play-icon');
        
        overlay.style.background = 'rgba(0, 212, 255, 0.1)';
        playIcon.style.transform = 'scale(1)';
        playIcon.style.textShadow = 'none';
    });
});

// Live status pulse animation
const statusIndicator = document.querySelector('.status-indicator');
setInterval(() => {
    statusIndicator.style.boxShadow = Math.random() > 0.5 
        ? '0 0 20px var(--neon-red)' 
        : '0 0 30px var(--neon-red)';
}, 500);

// Parallax effect on hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Preload fonts and optimize performance
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add loaded class for final animations
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Smooth reveal on page load
document.addEventListener('DOMContentLoaded', () => {
    // Navbar links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            scrollToSection(href.substring(1));
        });
    });
    
    // Watch live button
    document.querySelector('.watch-live-btn').addEventListener('click', () => {
        // Replace with actual YouTube link
        window.open('https://youtube.com/@GamerSneaker', '_blank');
    });
    
    // Social links
    document.querySelectorAll('.social-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = card.classList[1];
            const links = {
                youtube: 'https://youtube.com/@ISneakerboy',
                instagram: 'https://instagram.com/gamer_sneaker2',
                
              };
            window.open(links[platform], '_blank');
        });
    });
});

// Mobile responsiveness
function handleMobileMenu() {
    const mobileBreakpoint = 768;
    
    if (window.innerWidth <= mobileBreakpoint) {
        document.querySelector('.hamburger').style.display = 'flex';
        document.querySelector('.nav-menu').style.display = 'none';
    } else {
        document.querySelector('.hamburger').style.display = 'none';
        document.querySelector('.nav-menu').style.display = 'flex';
    }
}

window.addEventListener('resize', handleMobileMenu);
handleMobileMenu();

// Performance optimization - reduce animation complexity on mobile
if (window.innerWidth <= 768) {
    // Reduce particle count on mobile
    particles.length = 50;
}
