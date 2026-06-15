// IT Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {


    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth Scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
    
    // Initial call to set active nav
    updateActiveNav();

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate skill bars
                if (entry.target.classList.contains('skill-item')) {
                    const skillProgress = entry.target.querySelector('.skill-progress');
                    const level = entry.target.getAttribute('data-level');
                    if (skillProgress && level) {
                        setTimeout(() => {
                            skillProgress.style.width = level + '%';
                        }, 200);
                    }
                }

                // Animate certification progress bars
                if (entry.target.classList.contains('cert-card')) {
                    const progressFill = entry.target.querySelector('.progress-fill');
                    const progress = progressFill ? progressFill.getAttribute('data-progress') : null;
                    if (progressFill && progress) {
                        setTimeout(() => {
                            progressFill.style.width = progress + '%';
                        }, 300);
                    }
                }

                // Animate stats with counter effect
                if (entry.target.classList.contains('stat-item')) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    const finalNumber = statNumber.textContent;
                    const isPlus = finalNumber.includes('+');
                    const numValue = parseInt(finalNumber.replace('+', ''));
                    
                    let currentNumber = 0;
                    const increment = Math.ceil(numValue / 30);
                    const timer = setInterval(() => {
                        currentNumber += increment;
                        if (currentNumber >= numValue) {
                            currentNumber = numValue;
                            clearInterval(timer);
                        }
                        statNumber.textContent = currentNumber + (isPlus ? '+' : '');
                    }, 50);
                    
                    entry.target.classList.add('fade-in-up');
                }

                // Animate project cards
                if (entry.target.classList.contains('project-card')) {
                    entry.target.classList.add('fade-in-up');
                }

                // Animate education and timeline items
                if (entry.target.classList.contains('education-item') || 
                    entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('slide-in-left');
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.skill-item, .cert-card, .stat-item, .project-card, .education-item, .timeline-item').forEach(el => {
        observer.observe(el);
    });


    

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const colors = {
            success: 'var(--color-success)',
            error: 'var(--color-error)',
            warning: 'var(--color-warning)',
            info: 'var(--color-info)'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: colors[type] || colors.info,
            color: type === 'success' ? 'var(--color-btn-primary-text)' : 'var(--color-surface)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-base)',
            border: `1px solid ${colors[type] || colors.info}`,
            boxShadow: 'var(--shadow-md)',
            zIndex: '3000',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)'
        });
        
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            Object.assign(closeBtn.style, {
                background: 'none',
                border: 'none',
                color: 'inherit',
                fontSize: '1.5rem',
                cursor: 'pointer',
                opacity: '0.7',
                transition: 'opacity 0.3s ease',
                padding: '0',
                marginLeft: '1rem'
            });
            
            closeBtn.addEventListener('click', function() {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            });
            
            closeBtn.addEventListener('mouseenter', function() {
                this.style.opacity = '1';
            });
            
            closeBtn.addEventListener('mouseleave', function() {
                this.style.opacity = '0.7';
            });
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Add notification animations to document head
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            
            .notification-message {
                flex: 1;
                line-height: 1.4;
            }
        `;
        document.head.appendChild(style);
    }

    // Scroll-triggered animations for various sections
    function animateOnScroll() {
        const elements = document.querySelectorAll('.about-text, .contact-info, .linkedin-content > *');
        elements.forEach(el => {
            if (isElementInViewport(el) && !el.classList.contains('animated')) {
                el.classList.add('fade-in-up', 'animated');
            }
        });
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Throttled scroll handler for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(animateOnScroll, 10);
    });

    // Theme toggle functionality (if needed in future)
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const currentTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-color-scheme', currentTheme);
            
            themeToggle.addEventListener('click', function() {
                const newTheme = document.documentElement.getAttribute('data-color-scheme') === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-color-scheme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    // Initialize theme toggle
    initThemeToggle();

    // LinkedIn profile interactions
    const linkedinBtns = document.querySelectorAll('.linkedin-btn');
    linkedinBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const btnText = this.textContent.toLowerCase();
            
            if (btnText.includes('connect')) {
                showNotification('Connection request would be sent on the real LinkedIn platform!', 'info');
            } else if (btnText.includes('message')) {
                showNotification('This would open LinkedIn messaging in the real platform!', 'info');
            } else {
                showNotification('Additional LinkedIn actions would be available here!', 'info');
            }
        });
    });

    // Smooth reveal animations for page load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-name, .hero-title, .hero-subtitle, .hero-status');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('fade-in-up');
            }, index * 200);
        });
        
        setTimeout(() => {
            document.querySelector('.hero-buttons')?.classList.add('fade-in-up');
        }, heroElements.length * 200);
    }, 500);

    // Performance optimization: Lazy load images if any
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Back to top functionality
    function createBackToTopButton() {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');
        
        Object.assign(backToTop.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            color: 'var(--color-btn-primary-text)',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            opacity: '0',
            visibility: 'hidden',
            transition: 'all var(--duration-normal) var(--ease-standard)',
            zIndex: '1000',
            boxShadow: 'var(--shadow-md)'
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
        
        document.body.appendChild(backToTop);
    }

    // Create back to top button
    createBackToTopButton();

    // Console welcome message
    console.log(`
    🚀 IT Professional Portfolio
    ============================
    
    Welcome to my portfolio! This site showcases my journey as an IT professional.
    
    Tech Stack:
    - Vanilla JavaScript for performance
    - CSS Grid & Flexbox for responsive layouts
    - Intersection Observer API for smooth animations
    - Modern CSS variables for consistent theming
    - Progressive enhancement principles
    
    Features:
    - Responsive design for all devices
    - Smooth scrolling and animations
    - Interactive project modals
    - Form validation and submission
    - Performance optimized loading
    - Accessibility considerations
    
    Currently pursuing MCA at AIMIS, Anand University, GTU
    Completed BCA with 8.2 CGPA
    
    Feel free to explore the code and connect with me!
    
    GitHub: https://github.com/yourprofile
    LinkedIn: https://linkedin.com/in/yourprofile
    `);

    // Track page interactions for analytics (if implemented)
    function trackInteraction(action, element) {
        // This would integrate with analytics services like Google Analytics
        console.log(`User interaction: ${action} on ${element}`);
    }

    // Add interaction tracking to key elements
    document.querySelectorAll('.btn, .nav-link, .project-card, .social-link').forEach(el => {
        el.addEventListener('click', function() {
            trackInteraction('click', this.textContent || this.className);
        });
    });
});

// Service Worker registration for PWA capabilities (if needed in future)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // This would be implemented for offline functionality
        console.log('Service Worker support detected - ready for PWA implementation');
    });
}

// Error handling for any uncaught errors
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // In production, this would send error reports to a logging service
});

// Handle page visibility changes for performance optimization
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden - pause any animations or expensive operations
        console.log('Page hidden - optimizing performance');
    } else {
        // Page is visible - resume normal operations
        console.log('Page visible - resuming normal operations');
    }
});