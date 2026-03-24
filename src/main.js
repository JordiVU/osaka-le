import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './style.css'

gsap.registerPlugin(ScrollTrigger);

// Estado inicial donde el pergamino no está y empieza en el centro junto
gsap.set(".pergamino-wrapper", { opacity: 0 });
gsap.set(".folio", { scaleX: 0, transformOrigin: "center center" });
gsap.set(".rollo-izq", { left: "50%", xPercent: 125 });
gsap.set(".rollo-der", { right: "50%", xPercent: -125 });
gsap.set(".leyenda", {opacity: 0});

//Hacemos que cuando el usuario llegue al diosLuna, se bloquee y durante los siguientes
//1000 pixeles se produce la animación
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".diosLuna-wrapper",  //div en el que se ancla
    start: "top top", //cuando empieza la animación
    end: "+=1000", //cuando acaba
    scrub: 1, //sigue el ritmo del scroll usuario
    pin: true, //se queda anclado mientras haces scroll
  }
});

//Primero el pergamino pasa a ser visible 
tl.to(".pergamino-wrapper", { opacity: 1, duration: 0.3 })
//power2.out hace que empiece rápido y luego vaya más lento
//las animaciones empiezan 0.2s depués de la anterior.
//con scale hacemos que vaya a su tamaño original
  .to(".folio", { scaleX: 1, duration: 1, ease: "power2.out" }, ">0.2")
  .to(".rollo-izq", { left: "3%", xPercent: 0, duration: 1, ease: "power2.out" }, "<")
  .to(".rollo-der", { right: "3%", xPercent: 0, duration: 1, ease: "power2.out" }, "<")
  .to(".leyenda", { opacity: 1, duration: 0.3});