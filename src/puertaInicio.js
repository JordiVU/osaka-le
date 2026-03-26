import gsap from 'gsap';

const scene     = document.getElementById('scene');
const doorLeft  = document.getElementById('door-left');
const doorRight = document.getElementById('door-right');
const bg        = document.getElementById('bg');
const wall      = document.getElementById('wall');
const doorsClip = document.getElementById('doors-clip');
const hint      = document.getElementById('hint');
const resetBtn  = document.getElementById('reset-btn');

let isOpen = false;

function openDoor() {
  if (isOpen) return;
  isOpen = true;
  hint.style.display = 'none';

  const tl = gsap.timeline({ 
    defaults: { ease: 'power2.inOut' },
    // Cuando toda la animación de apertura termine:
    onComplete: () => {
      // Habilitamos el scroll permitiendo que el contenido fluya
      document.body.classList.remove('overflow-hidden');
      document.body.classList.add('overflow-x-hidden'); // Mantenemos el x oculto por seguridad
    }
  });

  // 1. Temblor de las puertas
  tl.to([doorLeft, doorRight], {
      x: (i) => i === 0 ? -4 : 4,
      duration: 0.30,
      yoyo: true,
      repeat: 3,
      ease: 'power1.inOut'
    })
    // 2. Abrir puertas hacia los lados
    .to(doorLeft,  { x: '-100%', duration: 1.1, ease: 'power3.inOut' }, '+=0.05')
    .to(doorRight, { x:  '100%', duration: 1.1, ease: 'power3.inOut' }, '<')
    
    // 3. (Quitamos el efecto de profundidad inicial que había aquí)

    // 4. EL GRAN ZOOM: Atravesamos el marco de la puerta
    .to([wall, doorsClip], {
        scale: 15,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.in', // 'in' para que empiece lento y acelere
        display: 'none'
    }, '-=0.3') // Empieza un poco antes de que las puertas terminen de abrirse
    
    // 5. EL AJUSTE IMPORTANTE: El fondo se queda a escala 1 para verse completo
    .to(bg, { 
        scale: 1, // <--- CAMBIADO DE 1.3 A 1
        duration: 1.5, 
        ease: 'power2.in' 
    }, '<') // Sincronizado con el zoom del marco
    
    .to(resetBtn, { autoAlpha: 1, duration: 0.5 });
}

function closeDoor() {
  if (!isOpen) return;
  isOpen = false;

  // 1. Resetear el scroll al principio para que el pergamino se cierre y se libere el PIN
  window.scrollTo(0, 0);
  
  // 2. Bloquear el scroll de nuevo
  document.body.classList.add('overflow-hidden');
  document.body.classList.remove('overflow-x-hidden');

  // 3. Ocultar el botón inmediatamente
  gsap.to(resetBtn, { autoAlpha: 0, duration: 0.3 });

  // 4. Volver a mostrar los elementos antes de animarlos
  wall.style.display = 'block';
  doorsClip.style.display = 'block';

  gsap.timeline({ defaults: { ease: 'power2.inOut' } })
    .to([wall, doorsClip], {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out'
    })
    .to(bg, { scale: 1, duration: 1.2, ease: 'power2.out' }, '<')
    .to(doorLeft,  { x: '0%', duration: 0.9, ease: 'power3.inOut' }, '-=0.5')
    .to(doorRight, { x: '0%', duration: 0.9, ease: 'power3.inOut' }, '<')
    .call(() => { 
        hint.style.display = 'block'; 
    });
}

scene.addEventListener('click', (e) => {
  if (e.target === resetBtn) return;
  openDoor();
});

resetBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation(); // Evita que el clic active la función de abrir de nuevo
  closeDoor();
});