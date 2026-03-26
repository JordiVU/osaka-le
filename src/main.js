import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './style.css'

gsap.registerPlugin(ScrollTrigger);

// --- 1. SELECTORES (¡Siempre arriba del todo para que JS no dé error!) ---
const scene     = document.getElementById('scene');
const doorLeft  = document.getElementById('door-left');
const doorRight = document.getElementById('door-right');
const bg        = document.getElementById('bg'); // Solo cogerá el del capítulo 1 si arreglaste el HTML
const wall      = document.getElementById('wall');
const doorsClip = document.getElementById('doors-clip');
const hint      = document.getElementById('hint');
const resetBtn  = document.getElementById('reset-btn');

let isOpen = false;

// --- 2. ESTADOS INICIALES ---
// Capítulo 1
gsap.set(".pergamino-wrapper", { opacity: 0 });
gsap.set(".folio", { scaleX: 0, transformOrigin: "center center", opacity: 0 });
gsap.set(".rollo-izq", { xPercent: 180 });
gsap.set(".rollo-der", { xPercent: -175 });
gsap.set(".leyenda", { opacity: 0 });
gsap.set(resetBtn, { autoAlpha: 0 }); 

// Capítulo 2 (¡Faltaba esto! Hay que cerrarlo antes de animarlo)
gsap.set(".pergamino-wrapper2", { opacity: 0 });
gsap.set(".folio2", { scaleX: 0, transformOrigin: "center center", opacity: 0 });
gsap.set(".rollo-izq2", { xPercent: 180 });
gsap.set(".rollo-der2", { xPercent: -175 });
gsap.set(".leyenda2", { opacity: 0 });


// --- 3. TIMELINES DE SCROLL ---

// Escena 1 (Abre y cierra el primer pergamino)
const scrollTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#scene",
    start: "top top",
    end: "+=2000",
    scrub: 1,
    pin: true,
    onUpdate: (self) => {
      if (!isOpen) return; 
      // Si baja un 5%, ocultar botón cerrar
      if (self.progress > 0.05) {
        gsap.to(resetBtn, { autoAlpha: 0, duration: 0.2, overwrite: "auto" });
      } else {
        gsap.to(resetBtn, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
      }
    }
  }
});

scrollTl.to(".pergamino-wrapper", { opacity: 1, duration: 0.3 })
  .to(".folio",     { scaleX: 1, duration: 1, ease: "power2.out", opacity: 1 }, ">0.2")
  .to(".rollo-izq", { xPercent: 0, duration: 1, ease: "power2.out" }, "<")
  .to(".rollo-der", { xPercent: 0, duration: 1, ease: "power2.out" }, "<")
  .to(".leyenda",   { opacity: 1, duration: 0.3 })
  .to({}, { duration: 2 }) // Pausa para que el usuario lea
  .to(".leyenda",   { opacity: 0, duration: 0.3 })
  .to(".folio",     { scaleX: 0, duration: 1, opacity: 0, ease: "power2.in" })
  .to(".rollo-izq", { xPercent: 180, duration: 1, ease: "power2.in" }, "<")
  .to(".rollo-der", { xPercent: -175, duration: 1, ease: "power2.in" }, "<")
  .to(".pergamino-wrapper", { opacity: 0, duration: 0.3 });

// Escena 2 (Segundo pergamino)
const tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: "#capitulo-2",
    start: "top top",
    end: "+=1000",
    scrub: 1,
    pin: true,
  }
});

tl2.to(".pergamino-wrapper2", { opacity: 1, duration: 0.3 })
  .to(".folio2",     { scaleX: 1, duration: 1, ease: "power2.out", opacity: 1 }, ">0.2")
  .to(".rollo-izq2", { xPercent: 0, duration: 1, ease: "power2.out" }, "<")
  .to(".rollo-der2", { xPercent: 0, duration: 1, ease: "power2.out" }, "<")
  .to(".leyenda2",   { opacity: 1, duration: 0.3 })
  .to({}, { duration: 2 })
  .to(".leyenda2",   { opacity: 0, duration: 0.3 })
  .to(".folio2",     { scaleX: 0, duration: 1, opacity: 0, ease: "power2.in" })
  .to(".rollo-izq2", { xPercent: 180, duration: 1, ease: "power2.in" }, "<")
  .to(".rollo-der2", { xPercent: -175, duration: 1, ease: "power2.in" }, "<")
  .to(".pergamino-wrapper2", { opacity: 0, duration: 0.3 });


// --- 4. FUNCIONES DE LA PUERTA ---

function openDoor() {
  if (isOpen) return;
  isOpen = true;
  
  gsap.to(hint, { autoAlpha: 0, duration: 0.3 });

  const tlOpen = gsap.timeline({ 
    defaults: { ease: 'power2.inOut' },
    onComplete: () => {
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

  window.scrollTo(0, 0);
  document.body.classList.add('overflow-hidden');

  gsap.to(resetBtn, { autoAlpha: 0, duration: 0.3 });
  gsap.set([wall, doorsClip], { display: 'block' });

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
    .to(hint, { autoAlpha: 1, duration: 0.5 }); 
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