// 1. HERO ANIMATION: Slide text in from bottom
anime.timeline({
    easing: 'easeOutExpo',
    duration: 1000
})
.add({
    targets: '.stagger-hero',
    translateY: [50, 0],
    opacity: [0, 1],
    delay: anime.stagger(200, {start: 500})
});

// 2. SVG LINE SETUP (The "n8n" Connector)
function setupLine() {
    const main = document.querySelector('main');
    const path = document.querySelector('#workflow-path');
    const svg = document.querySelector('#workflow-svg');
    
    // Calculate the height required
    // We want the line to start from the top of "About" and go down to "Contact"
    const startY = document.querySelector('#about').offsetTop + 65;
    const endY = document.querySelector('#contact').offsetTop + 65;
    const xPos = 20; // Matches CSS margin-left logic

    // Resize SVG container
    svg.style.height = document.body.scrollHeight + 'px';

    // Draw a straight line with a curve at the bottom (or just straight for simplicity)
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
    const scrollPercentage = (window.scrollY + window.innerHeight * 0.5) / document.body.scrollHeight;
    
    // Draw the line based on how far we scrolled
    const len = path.getTotalLength();
    const drawLength = len * (scrollPercentage * 1.5); // 1.5 multiplier to finish drawing before footer
    
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
            
            // Specific animation for Skills Grid (Grid Stagger)
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
