// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Global Variables
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// DOM Elements
const loadingScreen = document.querySelector('.loading-screen');
const customCursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const skillItems = document.querySelectorAll('.skill-item');
const workItems = document.querySelectorAll('.work-item');
const contactForm = document.querySelector('.form');
const statItems = document.querySelectorAll('.stat-item');

// Loading Screen Animation
function initLoadingScreen() {
    const tl = gsap.timeline();
    
    tl.to('.loading-letter', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)"
    })
    .to('.progress-bar', {
        width: '100%',
        duration: 2,
        ease: "power2.out"
    }, '-=0.5')
    .to('.loading-screen', {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
    })
    .set('.loading-screen', { visibility: 'hidden' })
    .to('.hero-title .title-word', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    }, '-=0.3')
    .to('.hero-subtitle', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
    }, '-=0.5')
    .to('.hero-cta', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
    }, '-=0.3')
    .to('.floating-card', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
    }, '-=0.5');
}

// Custom Cursor
function initCustomCursor() {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        gsap.to(cursorDot, {
            x: mouseX,
            y: mouseY,
            duration: 0.1
        });
        
        gsap.to(cursorOutline, {
            x: mouseX,
            y: mouseY,
            duration: 0.3
        });
    });

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .work-item, .skill-item');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            gsap.to(cursorOutline, {
                scale: 1.5,
                duration: 0.3
            });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(cursorOutline, {
                scale: 1,
                duration: 0.3
            });
        });
    });
}

// Three.js Particle System
function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;

        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
        
        // Mouse interaction
        particles.rotation.x += (mouseY - windowHalfY) * 0.00001;
        particles.rotation.y += (mouseX - windowHalfX) * 0.00001;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Navigation
function initNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            gsap.fromTo('.nav-menu .nav-item', {
                y: -20,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.3,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    });

    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: { y: targetSection, offsetY: 80 },
                    ease: "power3.inOut"
                });
            }
            
            // Close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active navigation highlighting
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
}

// GSAP Animations
function initGSAPAnimations() {
    // Hero section animations
    gsap.set('.hero-title .title-word', { y: 100, opacity: 0 });
    gsap.set('.hero-subtitle', { y: 50, opacity: 0 });
    gsap.set('.hero-cta', { y: 50, opacity: 0 });
    gsap.set('.floating-card', { y: 100, opacity: 0 });

    // Section animations
    sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        
        if (sectionId === 'about') {
            gsap.fromTo('.about-content', {
                y: 100,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        }
        
        if (sectionId === 'work') {
            gsap.fromTo('.work-item', {
                y: 100,
                opacity: 0,
                scale: 0.8
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        }
        
        if (sectionId === 'skills') {
            gsap.fromTo('.skill-item', {
                x: -100,
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        }
        
        if (sectionId === 'contact') {
            gsap.fromTo('.contact-content', {
                y: 100,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    });

    // Parallax effects
    gsap.to('.floating-card', {
        y: (i, target) => -parseFloat(target.dataset.speed) * 100,
        ease: "none",
        scrollTrigger: {
            trigger: '.hero',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
}

// Skill Progress Animation
function initSkillProgress() {
    skillItems.forEach(item => {
        const progressBar = item.querySelector('.skill-progress');
        const level = progressBar.dataset.level;
        
        ScrollTrigger.create({
            trigger: item,
            start: "top 80%",
            onEnter: () => {
                gsap.to(progressBar, {
                    width: `${level}%`,
                    duration: 2,
                    ease: "power2.out"
                });
            }
        });
    });
}

// Statistics Counter Animation
function initStatsCounter() {
    statItems.forEach(item => {
        const numberElement = item.querySelector('.stat-number');
        const targetValue = parseInt(item.dataset.value);
        
        ScrollTrigger.create({
            trigger: item,
            start: "top 80%",
            onEnter: () => {
                gsap.to(numberElement, {
                    innerHTML: targetValue,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerHTML: 1 },
                    onUpdate: function() {
                        numberElement.innerHTML = Math.ceil(this.targets()[0].innerHTML);
                    }
                });
            }
        });
    });
}

// Work Item Interactions
function initWorkInteractions() {
    workItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                y: -10,
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// Contact Form
function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Success animation
            gsap.to('.submit-button', {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                }
            });
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    gsap.to(notification, {
        x: 0,
        duration: 0.3,
        ease: "power2.out"
    });
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        gsap.to(notification, {
            x: '100%',
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => notification.remove()
        });
    });
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentNode) {
            gsap.to(notification, {
                x: '100%',
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => notification.remove()
            });
        }
    }, 5000);
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide based on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            gsap.to(scrollToTopBtn, {
                opacity: 1,
                visibility: 'visible',
                duration: 0.3
            });
        } else {
            gsap.to(scrollToTopBtn, {
                opacity: 0,
                visibility: 'hidden',
                duration: 0.3
            });
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: { y: 0 },
            ease: "power3.inOut"
        });
    });
    
    // Hover effects
    scrollToTopBtn.addEventListener('mouseenter', () => {
        gsap.to(scrollToTopBtn, {
            y: -3,
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        gsap.to(scrollToTopBtn, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
}

// Window Resize Handler
function handleResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize Everything
function init() {
    // Start loading screen
    initLoadingScreen();
    
    // Initialize features after loading
    setTimeout(() => {
        initCustomCursor();
        initThreeJS();
        initNavigation();
        initGSAPAnimations();
        initSkillProgress();
        initStatsCounter();
        initWorkInteractions();
        initContactForm();
        initScrollToTop();
    }, 100);
}

// Event Listeners
window.addEventListener('resize', handleResize);
window.addEventListener('load', init);

// Add GSAP ScrollTrigger refresh on page load
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
}); 