import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './style.css'

gsap.registerPlugin(ScrollTrigger);

gsap.set(".pergamino-wrapper", { opacity: 0 });
gsap.set(".folio", { scaleX: 0, transformOrigin: "center center", opacity: 0 });
gsap.set(".rollo-izq", { xPercent: 180 });
gsap.set(".rollo-der", { xPercent: -175 });
gsap.set(".leyenda", { opacity: 0 });
gsap.set('.cerrar', { opacity: 1 });

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#scene",
    start: "top top",
    end: "+=1000",
    scrub: 1,
    pin: true,
  }
});

tl.to(".pergamino-wrapper", { opacity: 1, duration: 0.3 })
  .to(".folio",     { scaleX: 1, duration: 1, ease: "power2.out", opacity: 1 }, ">0.2")
  .to(".rollo-izq", { xPercent: 0, duration: 1, ease: "power2.out" }, "<")
  .to(".rollo-der", { xPercent: 0, duration: 1, ease: "power2.out" }, "<")
  .to(".leyenda",   { opacity: 1, duration: 0.3 })
  .to(".cerrar",    { opacity: 0, duration: 0.3 }, "<");

  // --- CÓDIGO DE LAS PUERTAS ---
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

  const tlOpen = gsap.timeline({ 
    defaults: { ease: 'power2.inOut' },
    onComplete: () => {
      document.body.classList.remove('overflow-hidden');
      document.body.classList.add('overflow-x-hidden');
    }
  });

  tlOpen.to([doorLeft, doorRight], {
      x: (i) => i === 0 ? -4 : 4,
      duration: 0.30,
      yoyo: true,
      repeat: 3,
      ease: 'power1.inOut'
    })
    .to(doorLeft,  { x: '-100%', duration: 1.1, ease: 'power3.inOut' }, '+=0.05')
    .to(doorRight, { x:  '100%', duration: 1.1, ease: 'power3.inOut' }, '<')
    .to([wall, doorsClip], {
        scale: 15,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.in',
        display: 'none'
    }, '-=0.3')
    .to(bg, { 
        scale: 1, 
        duration: 1.5, 
        ease: 'power2.in' 
    }, '<')
    .to(resetBtn, { autoAlpha: 1, duration: 0.5 });
}

function closeDoor() {
  if (!isOpen) return;
  isOpen = false;

  // Resetear el scroll para que el pergamino se cierre visualmente
  window.scrollTo(0, 0);
  
  document.body.classList.add('overflow-hidden');
  document.body.classList.remove('overflow-x-hidden');

  gsap.to(resetBtn, { autoAlpha: 0, duration: 0.3 });

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
  if (e.target === resetBtn || resetBtn.contains(e.target)) return;
  openDoor();
});

resetBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation(); 
  closeDoor();
});