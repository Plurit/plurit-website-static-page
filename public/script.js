// Change Header Background on Scroll
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Fade-in Animation on Scroll
document.addEventListener('DOMContentLoaded', () => {
  const faders = document.querySelectorAll('.content-wrapper');

  const appearOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const appearOnScroll = new IntersectionObserver(function(
    entries,
    appearOnScroll
  ) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('visible');
        appearOnScroll.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});

// Parallax Effect on Scroll for Background Images
window.addEventListener('scroll', function () {
  const elements = document.querySelectorAll('.hero, .tribe-section, .plans-section');
  elements.forEach(element => {
    let offset = window.pageYOffset;
    element.style.backgroundPositionY = `${offset * 0.5}px`;
  });
});

// Smooth scrolling for anchor links (if not already handled by CSS)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
