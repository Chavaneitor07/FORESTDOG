// Menu responsive: concentra aquí el comportamiento para que el HTML conserve
// su función estructural y los estilos se ocupen únicamente de la presentación.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');

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
window.matchMedia('(min-width: 621px)').addEventListener('change', () => setMenuOpen(false));
