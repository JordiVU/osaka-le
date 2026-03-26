import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './style.css'

gsap.registerPlugin(ScrollTrigger);

// --- 1. SELECTORES ---
const scene     = document.getElementById('scene');
const doorLeft  = document.getElementById('door-left');
const doorRight = document.getElementById('door-right');
const bg        = document.getElementById('bg'); 
const wall      = document.getElementById('wall');
const doorsClip = document.getElementById('doors-clip');
const hint      = document.getElementById('hint');
const resetBtn  = document.getElementById('reset-btn');

let isOpen = false;
gsap.set(resetBtn, { autoAlpha: 0 });

// --- 2. PREPARACIÓN INICIAL ---
const pergaminos = gsap.utils.toArray(".pergamino-wrapper-gen, .pergamino-wrapper, .pergamino-wrapperfinal");
pergaminos.forEach(p => {
  const padre = p.parentElement;
  gsap.set(padre.querySelector(".pergamino-wrapper-gen, .pergamino-wrapper, .pergamino-wrapperfinal"), { opacity: 0 });
  gsap.set(padre.querySelector(".folio-gen, .folio, .foliofinal"), { scaleX: 0, transformOrigin: "center center", opacity: 0 });
  gsap.set(padre.querySelector(".rollo-izq-gen, .rollo-izq, .rollo-izqfinal"), { xPercent: 180 });
  gsap.set(padre.querySelector(".rollo-der-gen, .rollo-der, .rollo-derfinal"), { xPercent: -175 });
  gsap.set(padre.querySelector(".leyenda-gen, .leyenda, .leyendafinal"), { opacity: 0 });
});

// Colocamos las imágenes horizontales preparadas
gsap.set("#mercado", { xPercent: 100 }); 
gsap.set("#rio", { xPercent: 100 }); 
gsap.set("#mercado-amor", { xPercent: -100 }); 
gsap.set("#zona-final", { autoAlpha: 0 }); // El final escondido

// Colocamos las nubes globales fuera de la pantalla
const nubes = gsap.utils.toArray(".nube-transicion");
gsap.set(nubes[0], { xPercent: -100 }); // Izquierda
gsap.set(nubes[1], { xPercent: 100 });  // Derecha
gsap.set(nubes[2], { yPercent: 100 });  // Abajo
gsap.set(nubes[3], { yPercent: -100 }); // Arriba

// Preparamos el telón de transición para que empiece invisible
const telonTransicion = document.getElementById('telon-transicion');
gsap.set(telonTransicion, { opacity: 0 });


// --- 3. FUNCIONES MAESTRAS ---

function animarPergamino(tl, id, leaveOpen = false) {
  const w = `${id} .pergamino-wrapper-gen, ${id} .pergamino-wrapperfinal`;
  const f = `${id} .folio-gen, ${id} .foliofinal`;
  const rI = `${id} .rollo-izq-gen, ${id} .rollo-izqfinal`;
  const rD = `${id} .rollo-der-gen, ${id} .rollo-derfinal`;
  const l = `${id} .leyenda-gen, ${id} .leyendafinal`;

  tl.to(w, { opacity: 1, duration: 0.3 })
    .to(f,  { scaleX: 1, duration: 1, ease: "power2.out", opacity: 1 }, ">0.2")
    .to(rI, { xPercent: 0, duration: 1, ease: "power2.out" }, "<")
    .to(rD, { xPercent: 0, duration: 1, ease: "power2.out" }, "<")
    .to(l,  { opacity: 1, duration: 0.3 })
    .to({}, { duration: 1.5 }); 
    
  if (!leaveOpen) {
    tl.to(l,  { opacity: 0, duration: 0.3 })
      .to(f,  { scaleX: 0, duration: 1, opacity: 0 })
      .to(rI, { xPercent: 180, duration: 1 }, "<")
      .to(rD, { xPercent: -175, duration: 1 }, "<")
      .to(w,  { opacity: 0, duration: 0.3 });
  }
}


// --- 4. LÍNEAS DE TIEMPO (SCROLL) ---

// ESCENA 1 (Puerta)
const scrollTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#scene",
    start: "top top",
    end: "+=1500",
    scrub: 1,
    pin: true,
    onUpdate: (self) => {
      if (!isOpen) return; 
      gsap.to(resetBtn, { autoAlpha: self.progress > 0.05 ? 0 : 1, duration: 0.2, overwrite: "auto" });
    }
  }
});

scrollTl.to(".pergamino-wrapper", { opacity: 1, duration: 0.3 })
  .to(".folio",     { scaleX: 1, duration: 1, ease: "power2.out", opacity: 1 }, ">0.2")
  .to(".rollo-izq", { xPercent: 0, duration: 1, ease: "power2.out" }, "<")
  .to(".rollo-der", { xPercent: 0, duration: 1, ease: "power2.out" }, "<")
  .to(".leyenda",   { opacity: 1, duration: 0.3 })
  .to({}, { duration: 2 })
  .to(".leyenda",   { opacity: 0, duration: 0.3 })
  .to(".folio",     { scaleX: 0, duration: 1, opacity: 0 })
  .to(".rollo-izq", { xPercent: 180, duration: 1 }, "<")
  .to(".rollo-der", { xPercent: -175, duration: 1 }, "<")
  .to(".pergamino-wrapper", { opacity: 0, duration: 0.3 });

// LA GRAN LÍNEA DE TIEMPO (Toda la historia en un solo bloque)
const tlHistoria = gsap.timeline({
  scrollTrigger: { 
    trigger: "#zona-horizontal", 
    start: "top top", 
    end: "+=10000", // Scroll largo para que se lea suave
    scrub: 1, 
    pin: true 
  }
});

// 1. Bosque
animarPergamino(tlHistoria, "#bosque");

// 2. Transición Horizontal (Bosque a Izq, Mercado desde Der)
tlHistoria.to("#bosque",  { xPercent: -100, duration: 2, ease: "power1.inOut" }, "t1")
          .to("#mercado", { xPercent: 0,    duration: 2, ease: "power1.inOut" }, "t1");
animarPergamino(tlHistoria, "#mercado");

// 3. Transición Horizontal (Mercado a Izq, Río desde Der)
tlHistoria.to("#mercado", { xPercent: -100, duration: 2, ease: "power1.inOut" }, "t2")
          .to("#rio",     { xPercent: 0,    duration: 2, ease: "power1.inOut" }, "t2");
animarPergamino(tlHistoria, "#rio");

// 4. Transición Horizontal (Río a Der, MercadoAmor desde Izq)
tlHistoria.to("#rio",          { xPercent: 100, duration: 2, ease: "power1.inOut" }, "t3")
          .to("#mercado-amor", { xPercent: 0,   duration: 2, ease: "power1.inOut" }, "t3");
animarPergamino(tlHistoria, "#mercado-amor");


// 5. TRANSICIÓN FINAL: NUBES MÁGICAS (Bomba de humo con telón)
// Entran nubes y el telón sólido se vuelve opaco (se hinchan un 20% para tapar huecos)
tlHistoria.to(telonTransicion, { opacity: 1, duration: 1.0 })
          .to(nubes, { xPercent: 0, yPercent: 0, scale: 1.2, opacity: 1, duration: 1.5, ease: "power2.inOut", stagger: 0.1 }, "<");

// Cambiazo mientras está 100% tapado
tlHistoria.set("#mercado-amor", { autoAlpha: 0 })
          .set("#zona-final", { autoAlpha: 1 });

// Se retiran las nubes deshinchiéndose y el telón desaparece
tlHistoria.to(telonTransicion, { opacity: 0, duration: 1.5, ease: "power2.inOut" })
          .to(nubes[0], { xPercent: -100, scale: 1, opacity: 0, duration: 1.5, ease: "power2.inOut" }, "<")
          .to(nubes[1], { xPercent: 100, scale: 1, opacity: 0, duration: 1.5, ease: "power2.inOut" }, "<")
          .to(nubes[2], { yPercent: 100, scale: 1, opacity: 0, duration: 1.5, ease: "power2.inOut" }, "<")
          .to(nubes[3], { yPercent: -100, scale: 1, opacity: 0, duration: 1.5, ease: "power2.inOut" }, "<");

// 6. Pergamino Final
animarPergamino(tlHistoria, "#zona-final", true); // Queda abierto


// --- 5. FUNCIONES DE LA PUERTA (SIN TOCAR) ---
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

  tlOpen.to([doorLeft, doorRight], { x: (i) => i === 0 ? -6 : 6, duration: 0.1, yoyo: true, repeat: 4 })
    .to(doorLeft,  { x: '-100%', duration: 1.1, ease: 'power3.inOut' }, '+=0.1')
    .to(doorRight, { x: '100%', duration: 1.1, ease: 'power3.inOut' }, '<')
    .to([wall, doorsClip], { scale: 15, opacity: 0, duration: 1.5, display: 'none' }, '-=0.3')
    .to(bg, { scale: 1.1, duration: 2 }, '<')
    .to(resetBtn, { autoAlpha: 1, duration: 0.5 });
}

function closeDoor() {
  if (!isOpen) return;
  isOpen = false;
  window.scrollTo(0, 0);
  document.body.classList.add('overflow-hidden');
  gsap.to(resetBtn, { autoAlpha: 0, duration: 0.3 });
  gsap.set([wall, doorsClip], { display: 'block' });
  
  gsap.timeline({ defaults: { ease: 'power2.inOut' } })
    .to([wall, doorsClip], { scale: 1, opacity: 1, duration: 1.2 })
    .to(bg, { scale: 1, duration: 1.2 }, '<')
    .to(doorLeft,  { x: '0%', duration: 0.8 }, '-=0.4')
    .to(doorRight, { x: '0%', duration: 0.8 }, '<')
    .to(hint, { autoAlpha: 1, duration: 0.5 }); 
}

scene.addEventListener('click', (e) => { if (!resetBtn.contains(e.target)) openDoor(); });
resetBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeDoor(); });