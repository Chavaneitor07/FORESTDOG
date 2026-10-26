// Menu responsive: concentra aquí el comportamiento para que el HTML conserve
// su función estructural y los estilos se ocupen únicamente de la presentación.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');

// Compatibilidad para navegadores que aún exponen MediaQueryList.addListener.
function listenForMediaChange(mediaQuery, callback) {
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', callback);
  } else {
    mediaQuery.addListener?.(callback);
  }
}

// Mantén el estado visual y el estado accesible sincronizados; así los lectores
// de pantalla reciben el mismo cambio que percibe una persona al abrir el menú.
function setMenuOpen(open) {
  menuButton?.setAttribute('aria-expanded', String(open));
  menuButton?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  navigation?.classList.toggle('is-open', open);
}

// El atributo aria-expanded refleja el estado real del desplegable para teclado
// y lectores de pantalla, no solo el cambio visual de la clase CSS.
menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  setMenuOpen(!isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

// Cerrar con Escape y al pulsar fuera evita que el menú móvil se quede cubriendo
// contenido después de que la persona haya terminado de navegar.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});

document.addEventListener('click', (event) => {
  if (!menuButton || !navigation || !navigation.classList.contains('is-open')) return;
  if (!menuButton.contains(event.target) && !navigation.contains(event.target)) setMenuOpen(false);
});

// Al pasar de móvil a escritorio se limpia el estado móvil para no conservar
// una navegación oculta si el tamaño de ventana cambia con el menú abierto.
listenForMediaChange(window.matchMedia('(min-width: 621px)'), () => setMenuOpen(false));

// Mantiene la navegación a mano: se esconde al bajar y vuelve al subir.
const siteHeader = document.querySelector('.site-header');
let previousScrollY = window.scrollY;

function syncHeaderToScroll(currentScrollY) {
  if (!siteHeader) return;

  const menuIsOpen = menuButton?.getAttribute('aria-expanded') === 'true';

  if (currentScrollY < 80 || menuIsOpen || currentScrollY < previousScrollY) {
    siteHeader.classList.remove('is-hidden');
  } else if (currentScrollY > previousScrollY) {
    siteHeader.classList.add('is-hidden');
  }

  previousScrollY = currentScrollY;
}

window.addEventListener('scroll', () => {
  // La posicion real cubre la rueda, trackpad, tactil y teclas de desplazamiento.
  syncHeaderToScroll(window.scrollY);
}, { passive: true });

window.addEventListener('wheel', (event) => {
  if (!siteHeader) return;

  // Responde al sentido de la rueda de inmediato en computadoras de escritorio.
  const menuIsOpen = menuButton?.getAttribute('aria-expanded') === 'true';
  if (event.deltaY < 0 || window.scrollY < 80 || menuIsOpen) {
    siteHeader.classList.remove('is-hidden');
  } else if (event.deltaY > 0) {
    siteHeader.classList.add('is-hidden');
  }
}, { passive: true });

// El video de portada es decorativo: se reproduce sin sonido y se pausa cuando
// la persona pidió reducir el movimiento en la configuración de su dispositivo.
const heroVideo = document.querySelector('.hero-video');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const networkConnection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

// Evita descargar el video decorativo si el usuario activa ahorro de datos o
// usa una red móvil muy lenta; la imagen poster sigue mostrando la portada.
function shouldSkipHeroVideo() {
  return motionPreference.matches || networkConnection?.saveData ||
    ['slow-2g', '2g'].includes(networkConnection?.effectiveType);
}

function syncHeroVideoMotion() {
  if (!heroVideo) return;

  if (shouldSkipHeroVideo()) {
    heroVideo.pause();
    return;
  }

  // Algunos navegadores bloquean reproducción automática; el póster queda visible.
  const playRequest = heroVideo.play();
  playRequest?.catch(() => {});
}

syncHeroVideoMotion();
listenForMediaChange(motionPreference, syncHeroVideoMotion);
networkConnection?.addEventListener?.('change', syncHeroVideoMotion);
