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

// Selectores del progreso y la música
const progressBar = document.getElementById('progress-bar');
const bgMusic = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');

//como empieza la página
let isOpen = false;
gsap.set(resetBtn, { autoAlpha: 0 });

// recogemos todos los pergaminos y les ponemos sus valores por defecto
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
gsap.set("#zona-final", { autoAlpha: 0 }); 

// Colocamos las nubes globales fuera de la pantalla
const nubes = gsap.utils.toArray(".nube-transicion");
gsap.set(nubes[0], { xPercent: -100 }); 
gsap.set(nubes[1], { xPercent: 100 });  
gsap.set(nubes[2], { yPercent: 100 });  
gsap.set(nubes[3], { yPercent: -100 }); 

// Preparamos el telón de transición
const telonTransicion = document.getElementById('telon-transicion');
gsap.set(telonTransicion, { opacity: 0 });

// Empezamos la música en silencio
if (bgMusic) bgMusic.volume = 0;


// Creamos un array con los carácteres chinos que vamos a cargar en la barra de progreso
const poolCaracteres = ["龙", "武", "道", "魂", "风", "火", "水", "土", "心", "神", "命", "力", "勇", "智", "义", "礼", "忠", "信", "和", "平", "光", "影", "古", "今", "禅", "德", "美", "忍"];

//Conforme vamos bajando esta función va restando lo que queda y si es mayor o igual a cero vamos agregando carácteres a la barra de progreso
function actualizarBarra() {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.pageYOffset;
    if (totalScroll <= 0) return;

    const progreso = currentScroll / totalScroll; 
    const anchoPantalla = window.innerWidth;
    const maxCaracteresQueCaben = Math.floor(anchoPantalla / 30);
    const cantidadAMostrar = Math.floor(progreso * maxCaracteresQueCaben);

    let stringResultado = "";
    for (let i = 0; i < cantidadAMostrar; i++) {
        stringResultado += poolCaracteres[i % poolCaracteres.length] + " ";
    }

    if (progressBar.innerText !== stringResultado) {
        progressBar.innerText = stringResultado;
    }
}

//con esto lo llamamos
window.addEventListener("scroll", () => {
    if (isOpen) actualizarBarra();
});


// aqui le ponemos a cada pergamnino que hay por cada escena lo que va a hacer en la animación en función de si se abre o cierra
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


// la animación en si

const scrollTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#scene", //cuando llegue a este div
    start: "top top", //cuando ocupe la posición top top
    end: "+=1500", // durante cuantos pixeles se va a usar
    scrub: 1, //sigue el scroll del usuario
    pin: true, //ancla la imagen hasta que acabe
    onUpdate: (self) => { //La animación del pergamino
      if (!isOpen) return; 
      gsap.to(resetBtn, { autoAlpha: self.progress > 0.05 ? 0 : 1, duration: 0.2, overwrite: "auto" });
    }
  }
});

//el primer pergamino 

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


  //animación de la zona horizontal
const tlHistoria = gsap.timeline({
  scrollTrigger: { 
    trigger: "#zona-horizontal", 
    start: "top top", 
    end: "+=10000", 
    scrub: 1, 
    pin: true 
  }
});

animarPergamino(tlHistoria, "#bosque");

tlHistoria.to("#bosque",  { xPercent: -100, duration: 2, ease: "power1.inOut" }, "t1")
          .to("#mercado", { xPercent: 0,    duration: 2, ease: "power1.inOut" }, "t1");
animarPergamino(tlHistoria, "#mercado");

tlHistoria.to("#mercado", { xPercent: -100, duration: 2, ease: "power1.inOut" }, "t2")
          .to("#rio",     { xPercent: 0,    duration: 2, ease: "power1.inOut" }, "t2");
animarPergamino(tlHistoria, "#rio");

tlHistoria.to("#rio",          { xPercent: 100, duration: 2, ease: "power1.inOut" }, "t3")
          .to("#mercado-amor", { xPercent: 0,   duration: 2, ease: "power1.inOut" }, "t3");
animarPergamino(tlHistoria, "#mercado-amor");

// NUBES Y TELÓN
tlHistoria.to(telonTransicion, { opacity: 1, duration: 1.0 })
          .to(nubes, { xPercent: 0, yPercent: 0, scale: 1.2, opacity: 1, duration: 1.5, ease: "power2.inOut", stagger: 0.1 }, "<");

tlHistoria.set("#mercado-amor", { autoAlpha: 0 })
          .set("#zona-final", { autoAlpha: 1 });

tlHistoria.to(telonTransicion, { opacity: 0, duration: 1.5, ease: "power2.inOut" })
          .to(nubes[0], { xPercent: -100, scale: 1, opacity: 0, duration: 1.5, ease: "power2.inOut" }, "<")
          .to(nubes[1], { xPercent: 100, scale: 1, opacity: 0, duration: 1.5, ease: "power2.inOut" }, "<")
          .to(nubes[2], { yPercent: 100, scale: 1, opacity: 0, duration: 1.5, ease: "power2.inOut" }, "<")
          .to(nubes[3], { yPercent: -100, scale: 1, opacity: 0, duration: 1.5, ease: "power2.inOut" }, "<");

animarPergamino(tlHistoria, "#zona-final", true);


// --- FUNCIONES DE LA PUERTA Y MÚSICA ---

//Función para abrir la puerta
function openDoor() {
  if (isOpen) return;
  isOpen = true;

  //la musica aparece suavemente
  if (bgMusic) {
      bgMusic.play().catch(e => console.log("Audio bloqueado:", e));
      gsap.to(bgMusic, { volume: 0.4, duration: 3, ease: "power1.in" });
  }

  gsap.to(hint, { autoAlpha: 0, duration: 0.3 });
  
  //agregamos la clase overflow-x para permitir el scroll vertical y quitamos el overflow-hidden que evitaba que antes el usuario pudiera moverse
  const tlOpen = gsap.timeline({ 
    defaults: { ease: 'power2.inOut' },
    onComplete: () => {
      document.body.classList.remove('overflow-hidden');
      document.body.classList.add('overflow-x-hidden');
      ScrollTrigger.refresh(); 
      actualizarBarra();
    }
  });

  //la animación de las puertas
  tlOpen.to([doorLeft, doorRight], { x: (i) => i === 0 ? -6 : 6, duration: 0.1, yoyo: true, repeat: 4 })
    .to(doorLeft,  { x: '-100%', duration: 1.1, ease: 'power3.inOut' }, '+=0.1')
    .to(doorRight, { x: '100%', duration: 1.1, ease: 'power3.inOut' }, '<')
    .to([wall, doorsClip], { scale: 15, opacity: 0, duration: 1.5, display: 'none' }, '-=0.3')
    .to(bg, { scale: 1.1, duration: 2 }, '<')
    .to(resetBtn, { autoAlpha: 1, duration: 0.5 });
}

//animación para cerrarlas
function closeDoor() {
  if (!isOpen) return;
  isOpen = false;

  //se apague suavemente la música
  if (bgMusic) {
      gsap.to(bgMusic, { volume: 0, duration: 1.5, onComplete: () => bgMusic.pause() });
  }

  window.scrollTo(0, 0);
  document.body.classList.add('overflow-hidden');
  gsap.to(resetBtn, { autoAlpha: 0, duration: 0.3 });
  gsap.set([wall, doorsClip], { display: 'block' });
  
  gsap.timeline({ 
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
          if(progressBar) progressBar.innerText = ""; 
          ScrollTrigger.refresh();
      }
  })
    .to([wall, doorsClip], { scale: 1, opacity: 1, duration: 1.2 })
    .to(bg, { scale: 1, duration: 1.2 }, '<')
    .to(doorLeft,  { x: '0%', duration: 0.8 }, '-=0.4')
    .to(doorRight, { x: '0%', duration: 0.8 }, '<')
    .to(hint, { autoAlpha: 1, duration: 0.5 }); 
}

// ---  EVENTOS Y MUTE ---
//si el usuario para la música se para, sino se oye.
scene.addEventListener('click', (e) => { if (!resetBtn.contains(e.target)) openDoor(); });
resetBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeDoor(); });

if (muteBtn) {
    muteBtn.addEventListener('click', () => {
        if (bgMusic.muted) {
            bgMusic.muted = false;
            muteIcon.innerText = "🔊";
        } else {
            bgMusic.muted = true;
            muteIcon.innerText = "🔇";
        }
    });
}