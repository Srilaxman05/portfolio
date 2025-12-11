// 1. HERO ANIMATION: Slide text in from bottom
var heroTimeline = anime.timeline({
    easing: 'easeOutExpo',
    duration: 1000
});

// Animate Text Elements
heroTimeline.add({
    targets: '.stagger-hero',
    translateY: [50, 0],
    opacity: [0, 1],
    delay: anime.stagger(200, {start: 300})
});

// NEW: Floating Animation for Profile Image
// This makes the image bob up and down slightly like a sci-fi node
anime({
    targets: '.img-frame',
    translateY: [-10, 10], // Move up 10px, down 10px
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
    duration: 2000
});

// 2. SVG LINE SETUP (The "n8n" Connector)
function setupLine() {
    const main = document.querySelector('main');
    const path = document.querySelector('#workflow-path');
    const svg = document.querySelector('#workflow-svg');
    
    // Check if elements exist (in case of page errors)
    if(!path || !svg) return;

    // Calculate the height required
    const aboutSection = document.querySelector('#about');
    const contactSection = document.querySelector('#contact');
    
    // Safety check
    if(!aboutSection || !contactSection) return;

    const startY = aboutSection.offsetTop + 65;
    const endY = contactSection.offsetTop + 65;
    const xPos = 20; 

    // Resize SVG container
    svg.style.height = document.body.scrollHeight + 'px';

    // Draw straight vertical line
    const d = `M ${xPos} ${startY} L ${xPos} ${endY}`;
    path.setAttribute('d', d);

    // Prepare line for animation (hide it initially)
    path.style.strokeDasharray = path.getTotalLength();
    path.style.strokeDashoffset = path.getTotalLength();
}

// Initialize line
window.addEventListener('load', setupLine);
window.addEventListener('resize', setupLine);

// 3. SCROLL ANIMATION (Line Drawing)
window.addEventListener('scroll', () => {
    const path = document.querySelector('#workflow-path');
    if(!path) return;

    const scrollPercentage = (window.scrollY + window.innerHeight * 0.5) / document.body.scrollHeight;
    
    // Draw the line based on how far we scrolled
    const len = path.getTotalLength();
    const drawLength = len * (scrollPercentage * 1.5); 
    
    // Clamp values
    const offset = Math.max(0, len - drawLength);
    path.style.strokeDashoffset = offset;
});

// 4. INTERSECTION OBSERVER (Reveal Cards on Scroll)
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            
            // Specific animation for Skills Grid
            if(entry.target.classList.contains('skill-grid')) {
                anime({
                    targets: entry.target.children,
                    scale: [0.8, 1],
                    opacity: [0, 1],
                    delay: anime.stagger(100, {grid: [4, 2], from: 'center'}),
                    duration: 800,
                    easing: 'easeOutElastic(1, .6)'
                });
            }
            // Animation for Cards
            else {
                anime({
                    targets: entry.target,
                    translateY: [50, 0],
                    opacity: [0, 1],
                    duration: 1000,
                    easing: 'easeOutQuart'
                });
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe Elements
document.querySelectorAll('.project-card, .content-card, form').forEach(el => observer.observe(el));
document.querySelector('.skill-grid') && observer.observe(document.querySelector('.skill-grid'));

// 5. FORM HANDLER
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const btn = this.querySelector('button');
  const originalText = btn.innerText;
  
  btn.innerText = "Sent!";
  btn.style.backgroundColor = "#4cc9f0";
  
  anime({
      targets: btn,
      scale: [1, 1.1, 1],
      duration: 300,
      easing: 'easeInOutQuad'
  });

  setTimeout(() => {
      alert("Thank you! Your message has been sent.");
      this.reset();
      btn.innerText = originalText;
      btn.style.backgroundColor = "";
  }, 1000);
});
