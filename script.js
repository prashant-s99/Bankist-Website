'use strict';

///////////////////////////////////////
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');


// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};


btnsOpenModal.forEach (btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');


//Smooth Scroll

btnScrollTo.addEventListener('click', function(e){
    section1.scrollIntoView({behavior: "smooth"});
});


// Page Navigation using Event Deligation

document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();
  if(e.target.classList.contains('nav__link')){
  const id = e.target.getAttribute('href');
  document.querySelector(id).scrollIntoView({behavior: "smooth"});
  }
})


// Tabbed Components Functionality

const tabs= document.querySelectorAll('.operations__tab');
const tabsContainer= document.querySelector('.operations__tab-container');
const tabsContents= document.querySelectorAll('.operations__content')

tabsContainer.addEventListener('click', function(e){
const clicked= e.target.closest('.operations__tab')

if(!clicked) return;  //Guard Clause
tabs.forEach(t => t.classList.remove('operations__tab--active'))
clicked.classList.add('operations__tab--active');

//Activating content area
tabsContents.forEach(c => c.classList.remove('operations__content--active'))
document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

});


// Menu Fade Animation

const nav = document.querySelector('.nav');

const handleHover = function (e, opacityVal){
  if(e.target.classList.contains('nav__link'))
  {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo= link.closest('.nav').querySelector('img');

    siblings.forEach( el=>{
      if(el !== link)  
        el.style.opacity = opacityVal;
    });
    logo.style.opacity = opacityVal;
  }
}
// nav.addEventListener('mouseover', handleHover(e,0.5));  // Not applicable because addEventListener accepts a proper function not function expressions.
// nav.addEventListener('mouseout', handleHover(e,1));
nav.addEventListener('mouseover', (e) => handleHover(e,0.5));
nav.addEventListener('mouseout', (e) => handleHover(e,1));



// Sticky Navigation Bar

// window.addEventListener('scroll', function(){
//   nav.classList.add('sticky');  //Bad practice as 'scroll' event gets triggered every time when we scroll and creates performance issues.
// })

// Sticky Navigation using Intersection Observer

// const obsCallBack= function(entries, observer){
// entries.forEach(entry=>{
//   console.log(entry);
//   });
// };

// const obsOptions= {
//   root : null,
//   threshold: 0.1,
// };

// const observer= new IntersectionObserver(obsCallBack,obsOptions);
// observer.observe(section1);

const header= document.querySelector('.header');

const stickyNav = function(entries){
const [entry]= entries;
if(!entry.isIntersecting){
  nav.classList.add('sticky');
}
else
{
  nav.classList.remove('sticky');
}
}

const headerObserver= new IntersectionObserver(stickyNav,{
  root : null,
  threshold : 0.1,
  rootMargin : `-${nav.getBoundingClientRect().height}px`,
});

headerObserver.observe(header);



// Revealng Elements on Scroll
const allSections= document.querySelectorAll('.section');

const revealSection= function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting)
    return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver= new IntersectionObserver(revealSection, {
  root : null,
  threshold : 0.15,
})

allSections.forEach(function (section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})


// Lazy Loading of Images
const imgTargets = document.querySelectorAll('img[data-src]')

const loadImg= function(entries, observer){
  const [entry]= entries;
  if(!entry.isIntersecting)
    return;
  entry.target.addEventListener('load',() => entry.target.classList.remove('lazy-img')); //
  
  entry.target.src = entry.target.dataset.src;
  observer.unobserve(entry.target);
}

const imgObserver= new IntersectionObserver(loadImg, {
  root : null,
  threshold: 0.5,
});

imgTargets.forEach(function(img){
  imgObserver.observe(img);
})



// Slider Component

const slider= function(){
  
const slides= document.querySelectorAll('.slide');
const dotContainer= document.querySelector('.dots');

const goToSlide = function(slide){
  slides.forEach((s, i)=>{
    s.style.transform= `translateX(${(i-slide)*100}%)`;
  });
};


let currentSlide = 0;
const maxSlide = slides.length;

const btnLeft= document.querySelector('.slider__btn--left');
const btnRight= document.querySelector('.slider__btn--right');

const nextSlide = function(){
  if(currentSlide===maxSlide-1){
    currentSlide=0;
  }
  else
  currentSlide++;

  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const prevSlide= function(){
  if(currentSlide===0){
    currentSlide= maxSlide-1;
  }
  else
  currentSlide--;
  goToSlide(currentSlide);
  activateDot(currentSlide);
};


btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e){
  if(e.key==='ArrowLeft')
    prevSlide();
  if(e.key==='ArrowRight')
    nextSlide();
});


//Dot functionality

const createDots = function(){
  slides.forEach(function(_, i){
    dotContainer.insertAdjacentHTML('beforeend',<button class="dots__dot" data-slide="${i}"></button>)
  });
};


dotContainer.addEventListener('click',function(e){
  if(e.target.classList.contains('dots__dot')){
    const slide= e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});

const activateDot= function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');  
};

const init= function(){
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();

}

slider();