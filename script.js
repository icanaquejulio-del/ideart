(() => {
    const encabezado = document.querySelector('.encabezado');

    // Sombra en el encabezado cuando se baja la página
    const alScroll = () => encabezado.classList.toggle('compacto', scrollY > 40);
    addEventListener('scroll', alScroll, { passive: true });
    alScroll();

    // Aparición suave al hacer scroll
    const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && !sinMovimiento) {
        const vigia = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (!entrada.isIntersecting) return;
                const el = entrada.target;
                el.classList.add('visible');
                vigia.unobserve(el);
                // al terminar se quitan las clases para que el hover funcione normal
                setTimeout(() => el.classList.remove('revelar', 'visible'), 2200);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll(
            '.encabezado-seccion, .nosotros-texto, .nosotros-imagen, .tarjeta, .dato, .cotizador, .llamada > *'
        ).forEach(el => {
            const posicion = [...el.parentElement.children].indexOf(el);
            el.style.setProperty('--retraso', Math.min(posicion, 4) * 0.09 + 's');
            el.classList.add('revelar');
            vigia.observe(el);
        });
    }

    // Menú del celular
    const botonMenu = document.querySelector('.menu-boton');
    const cambiarMenu = (abrir) => {
        encabezado.classList.toggle('abierto', abrir);
        botonMenu.setAttribute('aria-expanded', abrir);
        botonMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    };
    botonMenu.addEventListener('click', () => cambiarMenu(!encabezado.classList.contains('abierto')));
    document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => cambiarMenu(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') cambiarMenu(false); });

    // Visor para ampliar las fotos
    const fotos = document.querySelectorAll('.tarjeta img, .nosotros-imagen img');
    if (fotos.length) {
        const visor = document.createElement('dialog');
        visor.className = 'visor';
        visor.setAttribute('aria-label', 'Imagen ampliada');
        visor.innerHTML = '<button class="visor-cerrar" aria-label="Cerrar imagen">×</button><img alt="">';
        document.body.append(visor);

        const grande = visor.querySelector('img');
        const abrir = (foto) => {
            grande.src = foto.currentSrc || foto.src;
            grande.alt = foto.alt;
            visor.showModal();
        };

        fotos.forEach(foto => {
            foto.classList.add('ampliable');
            foto.tabIndex = 0;
            foto.setAttribute('role', 'button');
            foto.addEventListener('click', () => abrir(foto));
            foto.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    abrir(foto);
                }
            });
        });
        visor.addEventListener('click', () => visor.close());
    }

    // Cotizador: arma el mensaje y lo abre en WhatsApp
    const cotizador = document.getElementById('cotizador');
    if (cotizador) {
        cotizador.addEventListener('submit', e => {
            e.preventDefault();
            const datos = new FormData(cotizador);
            const detalles = datos.get('detalles').trim();
            const mensaje = `Hola IDEART MELAMINE, soy ${datos.get('nombre').trim()}. Quiero cotizar: ${datos.get('mueble')}.`
                + (detalles ? ` Medidas o detalles: ${detalles}` : '');
            window.open('https://wa.me/51975896088?text=' + encodeURIComponent(mensaje), '_blank', 'noopener');
        });
    }
})();