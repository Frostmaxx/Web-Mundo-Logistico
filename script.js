document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todos los elementos que tienen la clase 'animar-oculto'
    const elementosParaAnimar = document.querySelectorAll('.animar-oculto');
    
    // Configuramos el observador
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            // Si el elemento entra en la pantalla del usuario
            if (entrada.isIntersecting) {
                // Le agregamos la clase que lo hace visible
                entrada.target.classList.add('animar-visible');
                // Dejamos de observarlo para que la animación solo ocurra una vez
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.15 // Se activa cuando el 15% del elemento ya es visible
    });

    // Le decimos al observador que vigile cada elemento
    elementosParaAnimar.forEach(el => observador.observe(el));

    // Lógica del Carrusel de Servicios
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);

        let currentIndex = 0;
        let autoplayInterval;

        const updateCarousel = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel(currentIndex);
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel(currentIndex);
        };

        // Iniciar Autoplay
        const startAutoplay = () => {
            autoplayInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
        };

        // Detener Autoplay temporalmente al interactuar
        const resetAutoplay = () => {
            clearInterval(autoplayInterval);
            startAutoplay();
        };

        nextButton.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });

        prevButton.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel(currentIndex);
                resetAutoplay();
            });
        });

        // Inicia el autoplay apenas cargue
        startAutoplay();
    }

    // Lógica del Carrusel de Testimonios (3 Cartas)
    const testimTrack = document.querySelector('.testimonials-track');
    if (testimTrack) {
        const testimSlides = Array.from(testimTrack.children);
        const testimNext = document.querySelector('.testim-next');
        const testimPrev = document.querySelector('.testim-prev');
        const testimDotsNav = document.querySelector('.testim-nav');
        const testimDots = Array.from(testimDotsNav.children);

        let testimIndex = 0;
        let testimAutoplay;

        const handleTestimCarousel = (index) => {
            testimTrack.style.transform = `translateX(-${index * 100}%)`;
            testimDots.forEach(dot => dot.classList.remove('active'));
            if(testimDots[index]) {
                testimDots[index].classList.add('active');
            }
        };

        const testimNextSlide = () => {
            testimIndex = (testimIndex + 1) % testimSlides.length;
            handleTestimCarousel(testimIndex);
        };

        const testimPrevSlide = () => {
            testimIndex = (testimIndex - 1 + testimSlides.length) % testimSlides.length;
            handleTestimCarousel(testimIndex);
        };

        const startTestimAutoplay = () => {
            testimAutoplay = setInterval(testimNextSlide, 7000); 
        };

        const resetTestimAutoplay = () => {
            clearInterval(testimAutoplay);
            startTestimAutoplay();
        };

        if (testimNext && testimPrev) {
            testimNext.addEventListener('click', () => {
                testimNextSlide();
                resetTestimAutoplay();
            });

            testimPrev.addEventListener('click', () => {
                testimPrevSlide();
                resetTestimAutoplay();
            });
        }

        testimDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                testimIndex = index;
                handleTestimCarousel(testimIndex);
                resetTestimAutoplay();
            });
        });

        startTestimAutoplay();
    }
});