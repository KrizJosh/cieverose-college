// Calendar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize calendar with current month
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // School events data (you can expand this)
    const schoolEvents = {
        '2025-7-15': 'New Student Orientation',
        '2025-7-20': 'First Day of Classes',
        '2025-8-21': 'Midterm Examinations',
        '2025-9-25': 'Foundation Day',
        '2025-10-15': 'Final Examinations',
        '2025-10-16': 'Final Examinations',
        '2025-10-17': 'Final Examinations',
        '2025-10-18': 'Final Examinations'
    };
    
    // Generate calendar
    function generateCalendar(month, year) {
        const calendarGrid = document.getElementById('calendar-grid');
        const monthYearDisplay = document.getElementById('current-month-year');
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Set month and year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
        
        // Create day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            const dateElement = document.createElement('div');
            dateElement.className = 'calendar-date';
            dateElement.textContent = day;
            dayElement.appendChild(dateElement);
            
            // Check if this day has an event
            const dateKey = `${year}-${month + 1}-${day}`;
            if (schoolEvents[dateKey]) {
                const eventElement = document.createElement('span');
                eventElement.className = 'calendar-event';
                eventElement.textContent = schoolEvents[dateKey];
                dayElement.appendChild(eventElement);
            }
            
            // Highlight current day
            if (day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                dayElement.style.backgroundColor = 'rgba(249, 200, 14, 0.2)';
                dayElement.style.border = '2px solid var(--secondary-color)';
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    // Navigation buttons
    document.getElementById('prev-month').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    // Initialize calendar
    generateCalendar(currentMonth, currentYear);
    
    // You can add more events to the calendar by expanding the schoolEvents object
});


        // Enhanced Carousel Implementation
        class EnhancedCarousel {
          constructor(element) {
            this.carousel = element;
            this.container = this.carousel.querySelector('.carousel-container');
            this.slides = this.carousel.querySelectorAll('.carousel-slide');
            this.prevBtn = this.carousel.querySelector('.prev-btn');
            this.nextBtn = this.carousel.querySelector('.next-btn');
            this.indicators = this.carousel.querySelectorAll('.carousel-indicator');
            
            this.currentIndex = 0;
            this.totalSlides = this.slides.length;
            this.autoRotateInterval = null;
            this.rotationSpeed = 5000; // 5 seconds
            
            this.init();
          }
          
          init() {
            // Set up event listeners
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            
            // Indicator events
            this.indicators.forEach((indicator, index) => {
              indicator.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Keyboard navigation
            this.carousel.addEventListener('keydown', (e) => {
              if (e.key === 'ArrowRight') this.nextSlide();
              if (e.key === 'ArrowLeft') this.prevSlide();
            });
            
            // Touch events for mobile
            let touchStartX = 0;
            let touchEndX = 0;
            
            this.container.addEventListener('touchstart', (e) => {
              touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});
            
            this.container.addEventListener('touchend', (e) => {
              touchEndX = e.changedTouches[0].screenX;
              this.handleSwipe();
            }, {passive: true});
            
            // Start auto-rotation
            this.startAutoRotation();
            
            // Pause on hover
            this.carousel.addEventListener('mouseenter', () => this.pauseAutoRotation());
            this.carousel.addEventListener('mouseleave', () => this.startAutoRotation());
            
            // Focus management for accessibility
            this.carousel.addEventListener('focusin', () => this.pauseAutoRotation());
            this.carousel.addEventListener('focusout', () => this.startAutoRotation());
            
            // Initial update
            this.updateCarousel();
          }
          
          updateCarousel() {
            // Smooth transition
            this.container.style.transition = 'transform 0.5s ease';
            this.container.style.transform = `translateX(-${this.currentIndex * 100}%)`;
            
            // Update indicators
            this.indicators.forEach((indicator, index) => {
              indicator.classList.toggle('active', index === this.currentIndex);
              indicator.setAttribute('aria-label', 
                `Slide ${index + 1} of ${this.totalSlides} ${index === this.currentIndex ? '(Current)' : ''}`);
            });
            
            // Update ARIA live region for screen readers
            const currentSlide = this.slides[this.currentIndex];
            const caption = currentSlide.querySelector('.carousel-caption');
            if (caption) {
              caption.setAttribute('aria-live', 'polite');
            }
            
            // Focus management for accessibility
            this.slides.forEach(slide => slide.setAttribute('aria-hidden', 'true'));
            this.slides[this.currentIndex].setAttribute('aria-hidden', 'false');
          }
          
          nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
            this.updateCarousel();
            this.resetAutoRotation();
          }
          
          prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
            this.updateCarousel();
            this.resetAutoRotation();
          }
          
          goToSlide(index) {
            this.currentIndex = index;
            this.updateCarousel();
            this.resetAutoRotation();
          }
          
          handleSwipe() {
            const threshold = 50; // Minimum swipe distance
            
            if (touchStartX - touchEndX > threshold) {
              this.nextSlide();
            } else if (touchEndX - touchStartX > threshold) {
              this.prevSlide();
            }
          }
          
          startAutoRotation() {
            if (this.autoRotateInterval) return;
            this.autoRotateInterval = setInterval(() => this.nextSlide(), this.rotationSpeed);
          }
          
          pauseAutoRotation() {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
          }
          
          resetAutoRotation() {
            this.pauseAutoRotation();
            this.startAutoRotation();
          }
        }

        // Initialize all carousels
        document.querySelectorAll('.event-carousel').forEach(carousel => {
          new EnhancedCarousel(carousel);
        });
        // Carousel functionality
        function setupCarousel(carousel) {
            const container = carousel.querySelector('.carousel-container');
            const slides = carousel.querySelectorAll('.carousel-slide');
            const prevBtn = carousel.querySelector('.prev-btn');
            const nextBtn = carousel.querySelector('.next-btn');
            const indicators = carousel.querySelectorAll('.carousel-indicator');
            
            let currentIndex = 0;
            const totalSlides = slides.length;
            
            function updateCarousel() {
                container.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Update indicators
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentIndex);
                });
            }
            
            function nextSlide() {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateCarousel();
            }
            
            function prevSlide() {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateCarousel();
            }
            
            // Button events
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
            
            // Indicator events
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
            });
            
            // Auto-rotate (optional)
            let interval = setInterval(nextSlide, 5000);
            
            carousel.addEventListener('mouseenter', () => clearInterval(interval));
            carousel.addEventListener('mouseleave', () => {
                interval = setInterval(nextSlide, 5000);
            });
        }

        // Initialize all carousels
        document.querySelectorAll('.event-carousel').forEach(setupCarousel);

        // Event tabs functionality
        const eventTabs = document.querySelectorAll('.event-tab');
        eventTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                document.querySelector('.event-tab.active').classList.remove('active');
                document.querySelector('.event-content.active').classList.remove('active');
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
        // Enhanced directions link with geolocation
        document.getElementById('directions-link').addEventListener('click', function(e) {
            // Only intercept if this is the main click (not middle mouse button, etc.)
            if (e.button === 0) {
                e.preventDefault();
                
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            // User granted permission - use their location
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            window.open(
                                `https://maps.app.goo.gl/8PD8L7VCfyoL6Fca7`,
                                '_blank'
                            );
                        },
                        function(error) {
                            // User denied permission or error occurred - fall back to regular link
                            if (error.code !== error.PERMISSION_DENIED) {
                                console.error("Geolocation error:", error);
                            }
                            window.open(this.href, '_blank');
                        }
                    );
                } else {
                    // Geolocation not supported - fall back to regular link
                    window.open(this.href, '_blank');
                }
            }
            // For other click types (middle mouse, etc.), let the default behavior happen
        });
        // Mobile menu toggle
        document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
            const navUl = document.querySelector('nav ul');
            navUl.classList.toggle('show');
            this.setAttribute('aria-expanded', navUl.classList.contains('show'));
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.querySelector('nav ul.show');
                    if (mobileMenu) {
                        mobileMenu.classList.remove('show');
                        document.querySelector('.mobile-menu-btn').setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });

        // Set copyright year
        document.getElementById('year').textContent = new Date().getFullYear();

        // Add animation class when elements come into view
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.program-card, .section').forEach(section => {
            observer.observe(section);
        });
