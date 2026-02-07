// TypeWriter Class
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];
        if(this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;
        let typeSpeed = 100;
        if(this.isDeleting) typeSpeed /= 2;
        if(!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if(this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Particle Background Animation
class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.hoverMouse = { x: -100, y: -100 };
        this.numParticles = 0;
        
        // Resize logic
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Mouse tracking
        window.addEventListener('mousemove', (e) => {
            this.hoverMouse.x = e.clientX;
            this.hoverMouse.y = e.clientY;
        });

        // Start Loop
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Adjust particle count based on screen size
        this.numParticles = (this.canvas.width * this.canvas.height) / 12000;
        this.createParticles();
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5, // Velocity X
                vy: (Math.random() - 0.5) * 0.5, // Velocity Y
                size: Math.random() * 2 + 1
            });
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw Particles & Connections
        this.particles.forEach((p, i) => {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Draw Dot
            this.ctx.fillStyle = 'rgba(0, 242, 255, 0.4)';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Connect to nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < 120) {
                    this.ctx.strokeStyle = `rgba(0, 242, 255, ${0.1 - dist/1200})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }

            // Connect to Mouse
            const dx = p.x - this.hoverMouse.x;
            const dy = p.y - this.hoverMouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 180) {
                this.ctx.strokeStyle = `rgba(0, 242, 255, ${0.3 - dist/600})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(this.hoverMouse.x, this.hoverMouse.y);
                this.ctx.stroke();
            }
        });
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Init App
document.addEventListener('DOMContentLoaded', init);

function init() {
    // 0. START LOGIN LOGIC
    handleLogin();

    // 1. Start TypeWriter
    const txtElement = document.querySelector('.txt-type');
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    new TypeWriter(txtElement, words, wait);
    
    // 2. Start Particle Background
    new ParticleNetwork('bg-canvas');

    // 3. Initialize Scroll Animation
    setupScrollAnimation();
    
    // 4. Initialize Magnetic Buttons
    initMagneticButtons();
}

// ============================================
// UPDATED LOGIN/REGISTER SYSTEM
// ============================================
function handleLogin() {
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('login-form');
    const body = document.body;
    
    // Elements
    const toggleAuth = document.getElementById('toggle-auth');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const authBtn = document.getElementById('auth-btn');
    const switchTextSpan = document.getElementById('switch-text');
    
    const userInput = document.getElementById('username');
    const passInput = document.getElementById('password');

    let isLoginMode = true;

    // Toggle Mode Logic
    toggleAuth.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        
        if (!isLoginMode) {
            // Switch to Register View
            authTitle.innerText = "Create Account";
            authSubtitle.innerText = "Register to access the portfolio.";
            authBtn.innerText = "Register";
            switchTextSpan.innerText = "Already have an account?";
            toggleAuth.innerText = "Login";
        } else {
            // Switch to Login View
            authTitle.innerText = "Welcome Back";
            authSubtitle.innerText = "Please authenticate to access the portfolio.";
            authBtn.innerText = "Access Site";
            switchTextSpan.innerText = "Don't have an account?";
            toggleAuth.innerText = "Register";
        }
        
        // Clear inputs when switching
        userInput.value = '';
        passInput.value = '';
    });

    // Handle Form Submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = userInput.value.trim();
        const password = passInput.value.trim();

        if (isLoginMode) {
            // --- LOGIN LOGIC ---
            // 1. Get user from local storage
            const storedUser = localStorage.getItem('user_' + username);
            
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                if (password === userData.password) {
                    // Success: Unlock Site
                    authBtn.innerText = "Authenticating...";
                    setTimeout(() => {
                        unlockSite();
                    }, 800);
                } else {
                    alert("Incorrect Password!");
                }
            } else {
                alert("User not found! Please Register first.");
            }

        } else {
            // --- REGISTER LOGIC ---
            if (localStorage.getItem('user_' + username)) {
                alert("Username already exists! Please choose another.");
            } else {
                // Save user to Local Storage
                const newUser = {
                    username: username,
                    password: password
                };
                localStorage.setItem('user_' + username, JSON.stringify(newUser));
                
                alert("Registration Successful! Please Login.");
                
                // Automatically switch back to login mode
                toggleAuth.click(); 
            }
        }
    });

    function unlockSite() {
        loginOverlay.style.opacity = '0';
        body.classList.remove('locked');
        setTimeout(() => {
            loginOverlay.style.display = 'none';
            // We do NOT save state to session/local storage for 'isLoggedIn'
            // This ensures it locks again on refresh.
        }, 800);
    }
}

// Magnetic Button Effect
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            // Move button slightly towards mouse
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

// Smooth Scrolling for Anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Advanced 3D Scroll Animation Logic
function setupScrollAnimation() {
    const hiddenElements = document.querySelectorAll('.scroll-3d');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    }, {
        threshold: 0.1
    });

    hiddenElements.forEach((el) => observer.observe(el));
}