document.addEventListener('DOMContentLoaded', function() {

    // Mobile Menu Toggle

    const menuToggle = document.querySelector('.menu-toggle');

    const navLinks = document.querySelector('.nav-links');

    

    menuToggle.addEventListener('click', function() {

        this.classList.toggle('active');

        navLinks.classList.toggle('active');

    });

    // Text Rotator in Hero Section

    class TextRotator {

        constructor(element) {

            this.element = element;

            this.words = JSON.parse(element.getAttribute('data-rotate'));

            this.currentIndex = 0;

            this.interval = null;

            this.init();

        }

        

        init() {

            this.rotateText();

            this.interval = setInterval(() => this.rotateText(), 2000);

            

            // Pause on hover

            this.element.addEventListener('mouseenter', () => {

                clearInterval(this.interval);

            });

            

            this.element.addEventListener('mouseleave', () => {

                this.interval = setInterval(() => this.rotateText(), 2000);

            });

        }

        

        rotateText() {

            this.element.style.opacity = '0';

            

            setTimeout(() => {

                this.currentIndex = (this.currentIndex + 1) % this.words.length;

                this.element.textContent = this.words[this.currentIndex];

                this.element.style.opacity = '1';

            }, 500);

        }

    }

    

    const textRotateElements = document.querySelectorAll('.text-rotate');

    textRotateElements.forEach(el => new TextRotator(el));

    // Product Filtering

    const filterButtons = document.querySelectorAll('.filter-btn');

    const productCards = document.querySelectorAll('.product-card');

    

    filterButtons.forEach(button => {

        button.addEventListener('click', () => {

            // Update active button

            filterButtons.forEach(btn => btn.classList.remove('active'));

            button.classList.add('active');

            

            // Filter products

            const filter = button.getAttribute('data-filter');

            

            productCards.forEach(card => {

                if (filter === 'all' || card.getAttribute('data-category') === filter) {

                    card.style.display = 'block';

                } else {

                    card.style.display = 'none';

                }

            });

        });

    });

    // Testimonial Slider

    const testimonials = document.querySelectorAll('.testimonial');

    const prevBtn = document.querySelector('.prev');

    const nextBtn = document.querySelector('.next');

    let currentTestimonial = 0;

    let testimonialInterval;

    function showTestimonial(index) {

        testimonials.forEach(testimonial => {

            testimonial.classList.remove('active');

        });

        

        testimonials[index].classList.add('active');

        currentTestimonial = index;

    }

    function nextTestimonial() {

        let newIndex = currentTestimonial + 1;

        if (newIndex >= testimonials.length) newIndex = 0;

        showTestimonial(newIndex);

    }

    function prevTestimonial() {

        let newIndex = currentTestimonial - 1;

        if (newIndex < 0) newIndex = testimonials.length - 1;

        showTestimonial(newIndex);

    }

    prevBtn.addEventListener('click', prevTestimonial);

    nextBtn.addEventListener('click', nextTestimonial);

    // Auto-rotate testimonials

    function startTestimonialInterval() {

        testimonialInterval = setInterval(nextTestimonial, 5000);

    }

    startTestimonialInterval();

    // Pause on hover

    const testimonialSlider = document.querySelector('.testimonial-slider');

    testimonialSlider.addEventListener('mouseenter', () => {

        clearInterval(testimonialInterval);

    });

    testimonialSlider.addEventListener('mouseleave', startTestimonialInterval);

    // Animate stats counter

    function animateStats() {

        const statNumbers = document.querySelectorAll('.stat-number');

        

        statNumbers.forEach(stat => {

            const target = parseInt(stat.getAttribute('data-count'));

            const duration = 2000;

            const start = 0;

            const increment = target / (duration / 16);

            let current = start;

            

            const timer = setInterval(() => {

                current += increment;

                stat.textContent = Math.floor(current);

                

                if (current >= target) {

                    stat.textContent = target;

                    clearInterval(timer);

                }

            }, 16);

        });

    }

    // Intersection Observer for animations

    const observerOptions = {

        threshold: 0.1

    };

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                if (entry.target.classList.contains('stats')) {

                    animateStats();

                }

                

                entry.target.classList.add('animate');

                observer.unobserve(entry.target);

            }

        });

    }, observerOptions);

    document.querySelectorAll('.service-card, .portfolio-item, .stats').forEach(element => {

        observer.observe(element);

    });

    // Shopping Cart Functionality

    const cartIcon = document.querySelector('.cart-icon');

    const cartSidebar = document.querySelector('.cart-sidebar');

    const cartOverlay = document.querySelector('.cart-overlay');

    const closeCart = document.querySelector('.close-cart');

    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    const cartItemsContainer = document.querySelector('.cart-items');

    const cartTotal = document.querySelector('.cart-total .subtotal');

    const cartCount = document.querySelector('.cart-count');

    

    let cart = [];

    

    // Open/close cart

    cartIcon.addEventListener('click', () => {

        cartSidebar.classList.add('active');

        cartOverlay.classList.add('active');

        document.body.style.overflow = 'hidden';

    });

    

    closeCart.addEventListener('click', () => {

        cartSidebar.classList.remove('active');

        cartOverlay.classList.remove('active');

        document.body.style.overflow = '';

    });

    

    cartOverlay.addEventListener('click', () => {

        cartSidebar.classList.remove('active');

        cartOverlay.classList.remove('active');

        document.body.style.overflow = '';

    });

    

    // Add to cart

    addToCartButtons.forEach(button => {

        button.addEventListener('click', () => {

            const productCard = button.closest('.product-card');

            const productId = productCard.getAttribute('data-id') || Math.random().toString(36).substr(2, 9);

            const productName = productCard.querySelector('h3').textContent;

            const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));

            const productImage = productCard.querySelector('img').src;

            

            // Check if product already in cart

            const existingItem = cart.find(item => item.id === productId);

            

            if (existingItem) {

                existingItem.quantity += 1;

            } else {

                cart.push({

                    id: productId,

                    name: productName,

                    price: productPrice,

                    image: productImage,

                    quantity: 1

                });

            }

            

            updateCart();

            

            // Show cart sidebar

            cartSidebar.classList.add('active');

            cartOverlay.classList.add('active');

            document.body.style.overflow = 'hidden';

            

            // Add animation to cart icon

            cartIcon.classList.add('animate');

            setTimeout(() => {

                cartIcon.classList.remove('animate');

            }, 500);

        });

    });

    

    // Update cart UI

    function updateCart() {

        // Update cart count

        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

        cartCount.textContent = totalItems;

        

        // Update cart items

        if (cart.length === 0) {

            cartItemsContainer.innerHTML = `

                <div class="empty-cart">

                    <i class="fas fa-shopping-bag"></i>

                    <p>Your cart is empty</p>

                </div>

            `;

        } else {

            cartItemsContainer.innerHTML = '';

            

            cart.forEach(item => {

                const cartItem = document.createElement('div');

                cartItem.className = 'cart-item';

                cartItem.innerHTML = `

                    <div class="cart-item-img">

                        <img src="${item.image}" alt="${item.name}">

                    </div>

                    <div class="cart-item-info">

                        <h4 class="cart-item-title">${item.name}</h4>

                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>

                        <button class="cart-item-remove" data-id="${item.id}">Remove</button>

                    </div>

                    <div class="cart-item-quantity">${item.quantity}</div>

                `;

                

                cartItemsContainer.appendChild(cartItem);

            });

            

            // Add event listeners to remove buttons

            document.querySelectorAll('.cart-item-remove').forEach(button => {

                button.addEventListener('click', () => {

                    const itemId = button.getAttribute('data-id');

                    cart = cart.filter(item => item.id !== itemId);

                    updateCart();

                });

            });

        }

        

        // Update cart total

        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        cartTotal.textContent = `$${subtotal.toFixed(2)}`;

    }

    

    // Form submissions

    const contactForm = document.getElementById('contactForm');

    const newsletterForm = document.querySelector('.newsletter-form');

    

    if (contactForm) {

        contactForm.addEventListener('submit', function(e) {

            e.preventDefault();

            

            // Get form values

            const name = document.getElementById('name').value;

            const email = document.getElementById('email').value;

            const subject = document.getElementById('subject').value;

            const message = document.getElementById('message').value;

            

            // Here you would typically send the data to a server

            console.log('Contact form submitted:', { name, email, subject, message });

            

            // Show success message

            alert('Thank you for your message! We will get back to you soon.');

            

            // Reset form

            contactForm.reset();

        });

    }

    

    if (newsletterForm) {

        newsletterForm.addEventListener('submit', function(e) {

            e.preventDefault();

            

            const email = this.querySelector('input').value;

            

            // Here you would typically send the data to a server

            console.log('Newsletter subscription:', email);

            

            // Show success message

            alert('Thank you for subscribing to our newsletter!');

            

            // Reset form

            this.reset();

        });

    }

    

    // Smooth scrolling for anchor links

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener('click', function(e) {

            e.preventDefault();

            

            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            

            const targetElement = document.querySelector(targetId);

            if (targetElement) {

                window.scrollTo({

                    top: targetElement.offsetTop - 80,

                    behavior: 'smooth'

                });

            }

        });

    });

    

    // Parallax effect for hero image

    window.addEventListener('scroll', function() {

        const scrollPosition = window.pageYOffset;

        const heroImage = document.querySelector('.main-product');

        

        if (heroImage) {

            heroImage.style.transform = `perspective(1000px) rotateY(-15deg) translateY(${scrollPosition * 0.2}px)`;

        }

    });

});