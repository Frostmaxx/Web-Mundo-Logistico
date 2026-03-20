document.addEventListener('DOMContentLoaded', () => {
    const CAROUSEL_AUTOPLAY_INTERVAL = 5000;
    const TESTIMONIALS_AUTOPLAY_INTERVAL = 7000;
    const INTERSECTION_THRESHOLD = 0.15;
    
    // =====================================================
    // ⚙️ CONFIGURACIÓN DEL FORMULARIO DE CONTACTO
    // =====================================================
    const EMAIL_CONFIG = {
        // ═══════════════════════════════════════════════════════
        // 📧 CORREO DE DESTINO - MODIFICAR AQUÍ
        // Reemplazar con el correo real de Mundo Logístico
        // ═══════════════════════════════════════════════════════
        DESTINATARIO: 'contacto@mundologistico.com',
        // ═══════════════════════════════════════════════════════
        
        ASUNTO_DEFAULT: 'Nueva solicitud de contacto desde Mundo Logístico',
        METODO_ENVIO: 'api', // 'api' | 'mailto' | 'console' (para pruebas)
        
        // Configuración de API (si se usa METODO_ENVIO: 'api')
        // Reemplazar con la URL del backend/API de envío
        API_ENDPOINT: 'https://api.mundologistico.com/enviar-correo'
    };
    // =====================================================
    
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
        threshold: INTERSECTION_THRESHOLD
    });

    // Le decimos al observador que vigile cada elemento
    elementosParaAnimar.forEach(el => observador.observe(el));

    // Lógica del Carrusel de Servicios (Infinite Scroll)
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const totalSlides = slides.length / 2; // 4 slides reales (tenemos 8 duplicados)
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);

        let currentIndex = 0;
        let autoplayInterval;
        let isTransitioning = false;

        const updateCarousel = (index, instant = false) => {
            if (instant) {
                track.style.transition = 'none';
            } else {
                track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
            track.style.transform = `translateX(-${index * 25}%)`;
            
            // Only update dots for the first set of slides
            if (index < 4) {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[index].classList.add('active');
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
            // Infinite scroll: cuando llega al final (slide 5-8), vuelve al inicio (slide 1-4)
            if (currentIndex >= totalSlides) {
                currentIndex = 0;
                updateCarousel(currentIndex, true);
            }
            // Infinite scroll: cuando llega al inicio (slide -1), va al final
            if (currentIndex < 0) {
                currentIndex = totalSlides - 1;
                updateCarousel(currentIndex, true);
            }
        });

        // Iniciar Autoplay
        const startAutoplay = () => {
            autoplayInterval = setInterval(nextSlide, CAROUSEL_AUTOPLAY_INTERVAL);
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
        notificacion.innerHTML = `
            <span class="notif-icon">${tipo === 'success' ? '✓' : '✕'}</span>
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
        }, 4000);
    };
    
    const enviarCorreo = async (datos) => {
        switch (EMAIL_CONFIG.METODO_ENVIO) {
            case 'api':
                try {
                    const response = await fetch(EMAIL_CONFIG.API_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            para: EMAIL_CONFIG.DESTINATARIO,
                            asunto: EMAIL_CONFIG.ASUNTO_DEFAULT,
                            nombre: datos.nombre,
                            email: datos.email,
                            mensaje: datos.mensaje
                        })
                    });
                    if (!response.ok) throw new Error('Error en la respuesta del servidor');
                    return { success: true };
                } catch (error) {
                    console.error('Error al enviar por API:', error);
                    return { success: false, error: 'Error de conexión con el servidor' };
                }
                
            case 'mailto':
                const mailtoLink = `mailto:${EMAIL_CONFIG.DESTINATARIO}?subject=${encodeURIComponent(EMAIL_CONFIG.ASUNTO_DEFAULT)}&body=${encodeURIComponent(
                    `Nombre: ${datos.nombre}\nEmail: ${datos.email}\n\nMensaje:\n${datos.mensaje}`
                )}`;
                window.location.href = mailtoLink;
                return { success: true };
                
            case 'console':
            default:
                console.log('📧 Datos del formulario (MODO PRUEBA):');
                console.log('─────────────────────────────────────');
                console.log('Para:', EMAIL_CONFIG.DESTINATARIO);
                console.log('Asunto:', EMAIL_CONFIG.ASUNTO_DEFAULT);
                console.log('Nombre:', datos.nombre);
                console.log('Email:', datos.email);
                console.log('Mensaje:', datos.mensaje);
                console.log('─────────────────────────────────────');
                return { success: true };
        }
    };
    
    forms.forEach(form => {
        const nombreInput = form.querySelector('[name="nombre"]');
        const emailInput = form.querySelector('[name="email"]');
        const mensajeInput = form.querySelector('[name="mensaje"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        const limpiarErrores = () => {
            [nombreInput, emailInput, mensajeInput].forEach(input => {
                input.style.borderColor = '#ddd';
                input.classList.remove('error');
            });
        };
        
        const validarFormulario = () => {
            let isValid = true;
            limpiarErrores();
            
            if (!nombreInput.value.trim()) {
                nombreInput.style.borderColor = '#e74c3c';
                nombreInput.classList.add('error');
                isValid = false;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailInput.style.borderColor = '#e74c3c';
                emailInput.classList.add('error');
                isValid = false;
            }
            
            if (!mensajeInput.value.trim() || mensajeInput.value.trim().length < 10) {
                mensajeInput.style.borderColor = '#e74c3c';
                mensajeInput.classList.add('error');
                isValid = false;
            }
            
            return isValid;
        };
        
        // Validación en tiempo real
        [nombreInput, emailInput, mensajeInput].forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim()) {
                    input.style.borderColor = '#ddd';
                    input.classList.remove('error');
                    input.classList.add('success');
                }
            });
            
            input.addEventListener('focus', () => {
                input.classList.remove('error', 'success');
            });
        });
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validarFormulario()) {
                mostrarNotificacion(form, 'error', 'Por favor completa todos los campos correctamente');
                return;
            }
            
            const datos = {
                nombre: nombreInput.value.trim(),
                email: emailInput.value.trim(),
                mensaje: mensajeInput.value.trim()
            };
            
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span> Enviando...';
            submitBtn.style.backgroundColor = 'var(--naranja-acento-hover)';
            
            const resultado = await enviarCorreo(datos);
            
            if (resultado.success) {
                mostrarNotificacion(form, 'success', '¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
                submitBtn.innerHTML = '<span>✓</span> ¡Enviado!';
                submitBtn.style.backgroundColor = '#27ae60';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    form.reset();
                    [nombreInput, emailInput, mensajeInput].forEach(input => {
                        input.classList.remove('success');
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

    const carouselContainer = document.querySelector('.carousel-container');
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
});