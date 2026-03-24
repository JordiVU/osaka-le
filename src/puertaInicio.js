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

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

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
    
    .call(() => { resetBtn.style.display = 'block'; });
}

function closeDoor() {
  if (!isOpen) return;
  isOpen = false;
  resetBtn.style.display = 'none';

  // Volvemos a mostrar los elementos antes de animarlos
  wall.style.display = 'block';
  doorsClip.style.display = 'block';

  gsap.timeline({ defaults: { ease: 'power2.inOut' } })
    // Alejar la cámara de nuevo (rebobinar el zoom)
    .to([wall, doorsClip], {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out'
    })
    // (Mantenemos el fondo a scale 1)
    .to(bg, { scale: 1, duration: 1.2, ease: 'power2.out' }, '<')
    
    // Cerrar puertas
    .to(doorLeft,  { x: '0%', duration: 0.9, ease: 'power3.inOut' }, '-=0.5')
    .to(doorRight, { x: '0%', duration: 0.9, ease: 'power3.inOut' }, '<')
    .call(() => { hint.style.display = 'block'; });
}

scene.addEventListener('click', (e) => {
  if (e.target === resetBtn) return;
  openDoor();
});

resetBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  closeDoor();
});