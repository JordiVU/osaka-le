import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './style.css'

gsap.registerPlugin(ScrollTrigger);

// --- SELECTORES ---
const scene     = document.getElementById('scene');
const doorLeft  = document.getElementById('door-left');
const doorRight = document.getElementById('door-right');
const bg        = document.getElementById('bg');
const wall      = document.getElementById('wall');
const doorsClip = document.getElementById('doors-clip');
const hint      = document.getElementById('hint');
const resetBtn  = document.getElementById('reset-btn');

let isOpen = false;

// --- ESTADOS INICIALES ---
gsap.set(".pergamino-wrapper", { opacity: 0 });
gsap.set(".folio", { scaleX: 0, transformOrigin: "center center", opacity: 0 });
gsap.set(".rollo-izq", { xPercent: 180 });
gsap.set(".rollo-der", { xPercent: -175 });
gsap.set(".leyenda", { opacity: 0 });
gsap.set(resetBtn, { autoAlpha: 0 }); 

// --- TIMELINE DEL SCROLL (PERGAMINO) ---
const scrollTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#scene",
    start: "top top",
    end: "+=1000",
    scrub: 1,
    pin: true,
    // Controlamos el botón manualmente escuchando el progreso del scroll
    onUpdate: (self) => {
      if (!isOpen) return; // Si la puerta está cerrada, ignoramos
      
      // Si el usuario baja más de un 5% del scroll, ocultamos el botón
      if (self.progress > 0.05) {
        gsap.to(resetBtn, { autoAlpha: 0, duration: 0.2, overwrite: "auto" });
      } 
      // Si vuelve arriba, lo mostramos de nuevo
      else {
        gsap.to(resetBtn, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
      }
    }
  }
});

scrollTl.to(".pergamino-wrapper", { opacity: 1, duration: 0.3 })
  .to(".folio",     { scaleX: 1, duration: 1, ease: "power2.out", opacity: 1 }, ">0.2")
  .to(".rollo-izq", { xPercent: 0, duration: 1, ease: "power2.out" }, "<")
  .to(".rollo-der", { xPercent: 0, duration: 1, ease: "power2.out" }, "<")
  .to(".leyenda",   { opacity: 1, duration: 0.3 });
  // ELIMINADO EL .to del resetBtn de esta cadena


// --- FUNCIONES DE LA PUERTA ---

function openDoor() {
  if (isOpen) return;
  isOpen = true;
  
  gsap.to(hint, { autoAlpha: 0, duration: 0.3 });

  const tlOpen = gsap.timeline({ 
    defaults: { ease: 'power2.inOut' },
    onComplete: () => {
      // Liberamos el scroll solo al terminar de abrir
      document.body.classList.remove('overflow-hidden');
      document.body.classList.add('overflow-x-hidden');
      ScrollTrigger.refresh(); 
    }
  });

  tlOpen.to([doorLeft, doorRight], {
      x: (i) => i === 0 ? -6 : 6,
      duration: 0.1,
      yoyo: true,
      repeat: 4,
    })
    .to(doorLeft,  { x: '-100%', duration: 1.1, ease: 'power3.inOut' }, '+=0.1')
    .to(doorRight, { x: '100%', duration: 1.1, ease: 'power3.inOut' }, '<')
    .to([wall, doorsClip], {
        scale: 15,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.in',
        display: 'none'
    }, '-=0.3')
    .to(bg, { scale: 1.1, duration: 2, ease: 'power2.out' }, '<')
    .to(resetBtn, { autoAlpha: 1, duration: 0.5 });
}

function closeDoor() {
  if (!isOpen) return;
  isOpen = false;

  // 1. Forzamos el scroll al principio por si acaso, y bloqueamos la pantalla
  window.scrollTo(0, 0);
  document.body.classList.add('overflow-hidden');

  // 2. Ocultamos el botón al instante
  gsap.to(resetBtn, { autoAlpha: 0, duration: 0.3 });
  
  // 3. Devolvemos el display: block a los contenedores antes de animar
  gsap.set([wall, doorsClip], { display: 'block' });

  // 4. Animación inversa de las puertas y el zoom
  const tlClose = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

  tlClose.to([wall, doorsClip], {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out'
    })
    .to(bg, { scale: 1, duration: 1.2, ease: 'power2.out' }, '<')
    .to(doorLeft,  { x: '0%', duration: 0.8, ease: 'power3.inOut' }, '-=0.4')
    .to(doorRight, { x: '0%', duration: 0.8, ease: 'power3.inOut' }, '<')
    .to(hint, { autoAlpha: 1, duration: 0.5 }); // Reaparece "Toca para abrir"
}

// --- EVENTOS ---
scene.addEventListener('click', (e) => {
  if (resetBtn.contains(e.target)) return;
  openDoor();
});

resetBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation(); 
  closeDoor();
});