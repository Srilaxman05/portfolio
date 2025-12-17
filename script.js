document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. HERO ANIMATION (Load) ---
    anime.timeline({
        easing: 'easeOutExpo',
        duration: 1200
    })
    .add({
        targets: '.stagger-hero',
        translateY: [40, 0],
        opacity: [0, 1],
        delay: anime.stagger(150)
    })
    .add({
        targets: '.img-frame',
        scale: [0.8, 1],
        opacity: [0, 1],
        rotate: [-5, 0],
        offset: '-=800'
    });

    // --- 2. SCROLL REVEAL OBSERVER ---
    const observerOptions = { threshold: 0.15 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
                // Animate Section Title/Text
                anime({
                    targets: entry.target,
                    translateY: [50, 0],
                    opacity: [0, 1],
                    easing: 'easeOutQuad',
                    duration: 800
                });

                // Stagger Children (Skills, Cards)
                const children = entry.target.querySelectorAll('.skill-box, .project-card, .cert-card');
                if (children.length > 0) {
                    anime({
                        targets: children,
                        translateY: [30, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(100),
                        easing: 'spring(1, 80, 10, 0)'
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-node').forEach(section => {
        observer.observe(section);
    });

    // --- 3. MAGNETIC HOVER EFFECTS ---
    const hoverElements = document.querySelectorAll('.btn, .btn-sm, .skill-box, .project-card, .cert-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            anime({
                targets: el,
                scale: 1.03,
                duration: 500,
                easing: 'easeOutElastic(1, .5)'
            });
        });
        el.addEventListener('mouseleave', () => {
            anime({
                targets: el,
                scale: 1,
                duration: 500,
                easing: 'easeOutElastic(1, .5)'
            });
        });
    });

    // --- 4. SCROLL-LINKED SVG LINE ---
    const svgPath = document.getElementById('workflow-path');
    const dots = document.querySelectorAll('.node-dot');
    const lineContainer = document.querySelector('.line-container');

    function drawLine() {
        if (dots.length === 0) return;

        // Ensure container matches full document height
        const totalHeight = document.body.scrollHeight;
        lineContainer.style.height = totalHeight + 'px';

        let pathD = "";
        
        // Start Path at the first dot
        const firstRect = dots[0].getBoundingClientRect();
        const startX = firstRect.left + (firstRect.width / 2);
        const startY = firstRect.top + window.scrollY; // Absolute Y

        pathD += `M ${startX} ${startY} `;

        // Connect subsequent dots
        for (let i = 1; i < dots.length; i++) {
            const rect = dots[i].getBoundingClientRect();
            const x = rect.left + (rect.width / 2);
            const y = rect.top + window.scrollY;
            pathD += `L ${x} ${y} `;
        }

        // Extend line slightly past the last dot
        const lastRect = dots[dots.length - 1].getBoundingClientRect();
        const lastY = lastRect.top + window.scrollY;
        pathD += `L ${lastRect.left + (lastRect.width / 2)} ${lastY + 150}`;

        svgPath.setAttribute('d', pathD);

        // Prepare Stroke Animation
        const pathLength = svgPath.getTotalLength();
        svgPath.style.strokeDasharray = pathLength;
        svgPath.style.strokeDashoffset = pathLength; // Hidden initially
    }

    // Run initially and on resize
    setTimeout(drawLine, 200); // Small delay to ensure layout is ready
    window.addEventListener('resize', drawLine);

    // Animate Line on Scroll
    window.addEventListener('scroll', () => {
        const pathLength = svgPath.getTotalLength();
        if (pathLength === 0) return;

        // Calculate scroll percentage relative to document height
        // Adjusted to start drawing earlier and finish exactly at bottom
        const scrollPercent = (window.scrollY + window.innerHeight * 0.6) / document.body.scrollHeight;
        
        const drawLength = pathLength * scrollPercent;
        const offset = Math.max(0, pathLength - drawLength);

        svgPath.style.strokeDashoffset = offset;
    });
});
