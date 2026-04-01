document.addEventListener('DOMContentLoaded', () => {
    const CAROUSEL_AUTOPLAY_INTERVAL = 5000;
    const TESTIMONIALS_AUTOPLAY_INTERVAL = 7000;
    const INTERSECTION_THRESHOLD = 0.15;
    const TOTAL_SLIDES = 5;
    
    // =====================================================
    // ⚙️ CONFIGURACIÓN DEL FORMULARIO DE CONTACTO
    // =====================================================
    const EMAIL_CONFIG = {
        DESTINATARIO: 'somosmundologistico@gmail.com',
        ASUNTO_DEFAULT: 'Nueva solicitud de contacto desde Mundo Logístico',
        METODO_ENVIO: 'api', // 'api' | 'mailto' | 'console' (para pruebas)
        API_ENDPOINT: 'enviar-contacto.php'
    };
    // =====================================================
    
    // =====================================================
    // 🍔 MENÚ HAMBURGUESA MÓVIL
    // =====================================================
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isExpanded);
            
            let overlay = document.querySelector('.nav-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'nav-overlay';
                overlay.setAttribute('aria-hidden', 'true');
                document.body.appendChild(overlay);
            }
            overlay.classList.toggle('active');
            
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
        
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                const overlay = document.querySelector('.nav-overlay');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    // =====================================================
    
    const elementosParaAnimar = document.querySelectorAll('.animar-oculto');
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('animar-visible');
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: INTERSECTION_THRESHOLD
    });

    elementosParaAnimar.forEach(el => observador.observe(el));

    // Lógica del Carrusel Hero (Infinite Scroll con 5 slides)
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const totalSlides = slides.length / 2;
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);
        const carouselContainer = document.querySelector('.carousel-container');

        let currentIndex = 0;
        let autoplayInterval;
        let isTransitioning = false;

        const updateCarousel = (index, instant = false) => {
            if (instant) {
                track.style.transition = 'none';
            } else {
                track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
            const slidePercentage = 100 / TOTAL_SLIDES;
            track.style.transform = `translateX(-${index * slidePercentage}%)`;
            
            if (index < TOTAL_SLIDES) {
                dots.forEach(dot => {
                    dot.classList.remove('active');
                    dot.setAttribute('aria-selected', 'false');
                });
                if (dots[index]) {
                    dots[index].classList.add('active');
                    dots[index].setAttribute('aria-selected', 'true');
                }
            }
        };

        const nextSlide = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            updateCarousel(currentIndex);
        };

        const prevSlide = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex--;
            updateCarousel(currentIndex);
        };

        track.addEventListener('transitionend', () => {
            isTransitioning = false;
            if (currentIndex >= totalSlides) {
                currentIndex = 0;
                updateCarousel(currentIndex, true);
            }
            if (currentIndex < 0) {
                currentIndex = totalSlides - 1;
                updateCarousel(currentIndex, true);
            }
        });

        const startAutoplay = () => {
            autoplayInterval = setInterval(nextSlide, CAROUSEL_AUTOPLAY_INTERVAL);
        };

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

        if (carouselContainer) {
            carouselContainer.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    resetAutoplay();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    resetAutoplay();
                }
            });
            carouselContainer.setAttribute('tabindex', '0');
        }

        startAutoplay();
    }

    // Lógica del Carrusel de Testimonios
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
            testimAutoplay = setInterval(testimNextSlide, TESTIMONIALS_AUTOPLAY_INTERVAL); 
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

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                testimPrevSlide();
                resetTestimAutoplay();
            } else if (e.key === 'ArrowRight') {
                testimNextSlide();
                resetTestimAutoplay();
            }
        });
    }

    // =====================================================
    // 📧 FUNCIONALIDAD DEL FORMULARIO DE CONTACTO
    // =====================================================
    const forms = document.querySelectorAll('form');
    
    const mostrarNotificacion = (form, tipo, mensaje) => {
        const existingNotif = form.querySelector('.form-notification');
        if (existingNotif) existingNotif.remove();
        
        const notificacion = document.createElement('div');
        notificacion.className = `form-notification ${tipo}`;
        notificacion.setAttribute('role', 'alert');
        notificacion.innerHTML = `
            <span class="notif-icon">${tipo === 'success' ? '&#10003;' : '&#10007;'}</span>
            <span class="notif-message">${mensaje}</span>
        `;
        notificacion.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        
        if (tipo === 'success') {
            notificacion.style.cssText += `
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            `;
        } else {
            notificacion.style.cssText += `
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            `;
        }
        
        const btn = form.querySelector('button[type="submit"]');
        form.insertBefore(notificacion, btn);
        
        setTimeout(() => {
            notificacion.style.opacity = '0';
            notificacion.style.transition = 'opacity 0.3s';
            setTimeout(() => notificacion.remove(), 300);
        }, 5000);
    };
    
    const enviarCorreo = async (datos) => {
        switch (EMAIL_CONFIG.METODO_ENVIO) {
            case 'api':
                try {
                    const formData = new FormData();
                    formData.append('nombre', datos.nombre);
                    formData.append('email', datos.email);
                    formData.append('mensaje', datos.mensaje);
                    
                    const response = await fetch(EMAIL_CONFIG.API_ENDPOINT, {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        return { success: true };
                    } else {
                        return { success: false, error: result.message || 'Error al enviar el mensaje' };
                    }
                } catch (error) {
                    console.error('Error al enviar por API:', error);
                    return { success: false, error: 'Error de conexión. Verifica tu conexión a internet.' };
                }
                
            case 'mailto':
                const mailtoLink = `mailto:${EMAIL_CONFIG.DESTINATARIO}?subject=${encodeURIComponent(EMAIL_CONFIG.ASUNTO_DEFAULT)}&body=${encodeURIComponent(
                    `Nombre: ${datos.nombre}\nEmail: ${datos.email}\n\nMensaje:\n${datos.mensaje}`
                )}`;
                window.location.href = mailtoLink;
                return { success: true };
                
            case 'console':
            default:
                console.log('Datos del formulario (MODO PRUEBA):');
                console.log('Para:', EMAIL_CONFIG.DESTINATARIO);
                console.log('Asunto:', EMAIL_CONFIG.ASUNTO_DEFAULT);
                console.log('Nombre:', datos.nombre);
                console.log('Email:', datos.email);
                console.log('Mensaje:', datos.mensaje);
                return { success: true };
        }
    };
    
    forms.forEach(form => {
        const nombreInput = form.querySelector('[name="nombre"]');
        const emailInput = form.querySelector('[name="email"]');
        const mensajeInput = form.querySelector('[name="mensaje"]');
        const honeypotInput = form.querySelector('[name="honeypot"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (!nombreInput || !emailInput || !mensajeInput || !submitBtn) return;
        
        const limpiarErrores = () => {
            [nombreInput, emailInput, mensajeInput].forEach(input => {
                if (input) {
                    input.style.borderColor = '#ddd';
                    input.classList.remove('error');
                    input.removeAttribute('aria-invalid');
                }
            });
        };
        
        const marcarError = (input, mensaje) => {
            if (input) {
                input.style.borderColor = '#e74c3c';
                input.classList.add('error');
                input.setAttribute('aria-invalid', 'true');
                input.setAttribute('aria-describedby', `error-${input.id}`);
                
                let errorEl = document.getElementById(`error-${input.id}`);
                if (!errorEl) {
                    errorEl = document.createElement('span');
                    errorEl.id = `error-${input.id}`;
                    errorEl.className = 'error-message';
                    errorEl.style.cssText = 'color: #e74c3c; font-size: 12px; display: block; margin-top: 4px;';
                    input.parentNode.appendChild(errorEl);
                }
                errorEl.textContent = mensaje;
            }
        };
        
        const quitarError = (input) => {
            if (input) {
                input.style.borderColor = '#ddd';
                input.classList.remove('error');
                input.removeAttribute('aria-invalid');
                const errorEl = document.getElementById(`error-${input.id}`);
                if (errorEl) errorEl.remove();
            }
        };
        
        const validarFormulario = () => {
            let isValid = true;
            limpiarErrores();
            
            if (!nombreInput.value.trim()) {
                marcarError(nombreInput, 'Por favor ingresa tu nombre');
                isValid = false;
            } else {
                quitarError(nombreInput);
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                marcarError(emailInput, 'Por favor ingresa un correo valido');
                isValid = false;
            } else {
                quitarError(emailInput);
            }
            
            if (!mensajeInput.value.trim() || mensajeInput.value.trim().length < 10) {
                marcarError(mensajeInput, 'El mensaje debe tener al menos 10 caracteres');
                isValid = false;
            } else {
                quitarError(mensajeInput);
            }
            
            return isValid;
        };
        
        [nombreInput, emailInput, mensajeInput].forEach(input => {
            if (!input) return;
            
            input.addEventListener('blur', () => {
                if (input.value.trim()) {
                    quitarError(input);
                    input.classList.add('success');
                }
            });
            
            input.addEventListener('focus', () => {
                input.classList.remove('error', 'success');
                quitarError(input);
            });
        });
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (honeypotInput && honeypotInput.value) {
                console.log('Spam detectado');
                return;
            }
            
            if (!validarFormulario()) {
                mostrarNotificacion(form, 'error', 'Por favor completa todos los campos correctamente');
                const firstError = form.querySelector('.error');
                if (firstError) firstError.focus();
                return;
            }
            
            const datos = {
                nombre: nombreInput.value.trim(),
                email: emailInput.value.trim(),
                mensaje: mensajeInput.value.trim()
            };
            
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
            submitBtn.style.backgroundColor = 'var(--naranja-acento-hover)';
            
            const resultado = await enviarCorreo(datos);
            
            if (resultado.success) {
                mostrarNotificacion(form, 'success', 'Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
                submitBtn.innerHTML = '&#10003; Enviado!';
                submitBtn.style.backgroundColor = '#27ae60';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    form.reset();
                    [nombreInput, emailInput, mensajeInput].forEach(input => {
                        if (input) input.classList.remove('success');
                    });
                }, 3000);
            } else {
                mostrarNotificacion(form, 'error', resultado.error || 'Error al enviar el mensaje. Intenta nuevamente.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }
        });
    });
    // =====================================================

    // =====================================================
    // 🏢 CARRUSEL DE CLIENTES (INFINITE SCROLL)
    // =====================================================
    const clientsTrack = document.querySelector('.clients-track');
    if (clientsTrack) {
        let pos = 0;
        let trackWidth = 0;
        let isMobile = window.innerWidth <= 768;
        
        function setupCarousel() {
            isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                const currentLogos = clientsTrack.querySelectorAll('.client-logo');
                if (currentLogos.length <= 4) {
                    const clientLogos = clientsTrack.innerHTML;
                    clientsTrack.innerHTML = clientLogos + clientLogos;
                }
            } else {
                const logos = clientsTrack.querySelectorAll('.client-logo');
                if (logos.length > 4) {
                    const firstFour = Array.from(logos).slice(0, 4).map(l => l.outerHTML).join('');
                    clientsTrack.innerHTML = firstFour;
                }
                clientsTrack.style.transform = 'translateX(0)';
                pos = 0;
            }
        }
        
        let animationId = null;
        
        function updateTrackWidth() {
            const logos = clientsTrack.querySelectorAll('.client-logo');
            trackWidth = 0;
            logos.forEach(logo => {
                trackWidth += logo.offsetWidth + 30;
            });
            trackWidth = trackWidth / 2;
        }
        
        function animateLogos() {
            if (!isMobile) {
                animationId = null;
                return;
            }
            
            updateTrackWidth();
            pos -= 0.4;
            if (pos <= -trackWidth) {
                pos = 0;
            }
            clientsTrack.style.transform = `translateX(${pos}px)`;
            animationId = requestAnimationFrame(animateLogos);
        }
        
        function startAnimation() {
            isMobile = window.innerWidth <= 768;
            if (isMobile) {
                updateTrackWidth();
                if (!animationId) {
                    animateLogos();
                }
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        }
        
        setupCarousel();
        startAnimation();
        window.addEventListener('resize', () => {
            setupCarousel();
            pos = 0;
            startAnimation();
        });
    }
    // =====================================================

    // =====================================================
    // 🔒 SEGURIDAD ADICIONAL
    // =====================================================
    
    // Prevenir clickjacking
    if (self === top) {
        document.documentElement.style.display = 'block';
    } else {
        top.location = self.location;
    }
    
    // Sanitizar inputs al pegar
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('paste', (e) => {
            setTimeout(() => {
                input.value = input.value.replace(/[<>]/g, '');
            }, 0);
        });
    });
    // =====================================================
});
