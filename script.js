const themeBtn = document.querySelector('.theme-btn');

function getCurrentTheme() {
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  localStorage.getItem('theme')
    ? (theme = localStorage.getItem('theme'))
    : null;

  return theme;
}

function loadTheme(theme) {
  const root = document.querySelector(':root');

  if (theme === 'light') {
    themeBtn.innerText = 'Dark';
  } else {
    themeBtn.innerText = 'Light';
  }
  localStorage.setItem('theme', theme);
  root.setAttribute('color-scheme', theme);
}

themeBtn.addEventListener('click', () => {
  let theme = getCurrentTheme();

  if (theme === 'dark') {
    theme = 'light';
  } else {
    theme = 'dark';
  }

  loadTheme(theme);
});

window.addEventListener('DOMContentLoaded', () => {
  loadTheme(getCurrentTheme());
});

// Our callback iass passed in an entries array
function callback(entries) {
  console.log('Observer callback called!');
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Entries appear not to be DOM elements, so you can't access properties like .style
      slide.style.background = 'white';
      console.log('Entry: ', entry);
    } else {
      slide.style.background = 'red';
    }
  });
}

const slide = document.querySelector('.section1');

let options = {
  // If null, just use browser viewport
  root: null, //document.querySelector(''),
  rootMargin: '0px',
  threshold: 0.5, // 1.0 means observe element is fully in view
};

let observer = new IntersectionObserver(callback, options);

// observer.observe(slide);
// observer.observe(themeBtn);

// The ScrollMagic Way!
let controller;
let slideScene;
let pageScene;

function animateSlides() {
  // Initialize Controller
  controller = new ScrollMagic.Controller();

  const sliders = document.querySelectorAll('.slide');
  const nav = document.querySelector('.nav-header');
  const navbar = document.querySelector('.nav-bar');

  for (let i = 0; i < sliders.length; i++) {
    const slide = sliders[i];

    const heroImage = slide.querySelector('.hero-image');
    const description = slide.querySelector('.hero-description');
    const revealImage = slide.querySelector('.reveal-image');
    console.log('REVEAL', revealImage);
    const image = slide.querySelector('img');
    const revealText = slide.querySelector('.reveal-text');

    // gsap.to(revealImage, 1, { x: '100%' });

    // Timeline
    const slideTimeline = gsap.timeline({
      defaults: { duration: 1, ease: 'power2.inOut' },
    });

    // Animate clipPath if we decide to use that for animation
    slideTimeline.fromTo(
      heroImage,
      1,
      {
        clipPath: 'inset(0% 100% 0% 0%)',
      },
      {
        // clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        clipPath: 'inset(0% 0% 0% 0%)',
      }
    );
    // slideTimeline.fromTo(revealImage, 1, { x: '0%' }, { x: '100%' });
    slideTimeline.fromTo(image, 1, { scale: 2 }, { scale: 1 }, '-=1'); // Animate this one second sooner (so same time as previous)
    slideTimeline.fromTo(
      description,
      1,
      {
        clipPath: 'inset(0% 100% 0% 0%)',
      },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
      },
      '-=.75'
    );
    // slideTimeline.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.75');
    slideTimeline.fromTo(nav, 1, { y: '-100%' }, { y: '0%' }, '-=0.5');

    // Create Scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false, // Don't let it disappear
    })
      .setTween(slideTimeline)
      //   .addIndicators({ name: `Slide ${i + 1}` })
      .addTo(controller);

    // Animate the second section
    const pageTimeline = gsap.timeline();

    // Due to our animation, the next slide is getting pushed down too far
    // These following manipulations handle that a little by pushing the next slide down
    // By pushing this down, our current slide lingers in place longer before animating out
    let nextSlide = sliders.length - 1 === i ? 'end' : sliders[i + 1];

    pageTimeline.fromTo(nextSlide, { y: '0%' }, { y: '10%' });
    pageTimeline.fromTo(
      slide,
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: 0.5 }
    );
    // Set the next slide back into the position it should be in
    pageTimeline.fromTo(nextSlide, { y: '10%' }, { y: '0%' }, '-=0'); // Using a negative value shows some period of slide overlap, if we like that effect

    // Create new Scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: '50%', // 100% = last whole height of the Slide
      triggerHook: 0,
    })
      //   .addIndicators({ name: 'Page', indent: 200 })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTimeline)
      .addTo(controller);
  }
}

animateSlides();

const navHamburger = document.querySelector('.nav-hamburger');
const navScreen = document.querySelector('.nav-bar');

navHamburger.addEventListener('click', (event) => {
  //   const navbarTimeline = gsap.timeline({
  //     defaults: { duration: 1, ease: 'power2.inOut' },
  //   });

  if (!event.target.classList.contains('active')) {
    event.target.classList.add('active');
    gsap.to('.line1', 0.5, {
      rotate: '45deg',
      y: 10,
    });
    gsap.to('.line3', 0.5, {
      rotate: '-45deg',
      y: -10,
    });
    gsap.to('.line2', 0.2, { opacity: 0 });
    gsap.to('#logo', 1, { color: 'black ' });
    gsap.fromTo(
      '.nav-bar',
      1,
      { clipPath: 'circle(50px at 100% -10%)' },
      { clipPath: 'circle(100% at 50% 50%)' }
    );

    document.body.classList.add('hide');
  } else {
    event.target.classList.remove('active');
    gsap.to('.line1', 0.5, {
      rotate: '0',
      y: 0,
    });
    gsap.to('.line2', 0.5, { opacity: 1 });
    gsap.to('.line3', 0.5, {
      rotate: '0',
      y: 0,
    });
    gsap.to('#logo', 1, { color: 'white ' });
    gsap.to('.nav-bar', 1, { clipPath: 'circle(50px at 100% -10%)' });

    document.body.classList.remove('hide');
  }

  //   navbarTimeline.fromTo(
  //     navScreen,
  //     1,
  //     { clipPath: 'circle(50px at 100% -10%)' },
  //     { clipPath: 'circle(100% at 50% 50%)' }
  //   );
});

const mouse = document.querySelector('.cursor');
const mouseText = mouse.querySelector('span');

function cursor(event) {
  mouse.style.top = event.pageY + 'px';
  mouse.style.left = event.pageX + 'px';
}

function activeCursor(event) {
  const activeElement = event.target;

  if (
    activeElement.id === 'logo' ||
    activeElement.classList.contains('nav-hamburger')
  ) {
    mouse.classList.add('nav-active');
    mouseText.innerText = 'Fancy!';
  } else {
    mouse.classList.remove('nav-active');
    mouseText.innerText = '';
  }

  if (mouseText.innerText) return;

  if (activeElement.classList.contains('cta')) {
    mouse.classList.add('cta-active');
    mouseText.innerText = 'Click Me!';
    gsap.to('.title-swipe', 1, { y: '0%' });
  } else {
    activeElement.classList.contains('cta');
    mouse.classList.remove('cta-active');
    gsap.to('.title-swipe', 1, { y: '100%' });
    mouseText.innerText = '';
  }
}

window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);

// const testScene = new ScrollMagic.Scene({
//   triggerElement: '.section1',
//   triggerHook: 0.5,
// })
//   .addIndicators({ colorStart: 'white', colorTrigger: 'white' })
//   .addTo(controller);

// const buttonScene = new ScrollMagic.Scene({
//   triggerElement: '.cta',
//   triggerHook: 0.5,
// })
//   .setClassToggle('.cta', 'active')
//   .addIndicators({ colorStart: 'white', colorTrigger: 'white' })
//   .addTo(controller);
