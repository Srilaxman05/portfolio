document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. HERO REVEAL ANIMATION ---
    anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    })
    .add({
        targets: '.stagger-hero',
        translateY: [30, 0],
        opacity: [0, 1],
        delay: anime.stagger(100)
    });

    // --- 2. 3D TILT EFFECT (Mouse Move) ---
    const tiltCard = document.getElementById('profileTilt');
    const heroSection = document.getElementById('hero');

    if (tiltCard && heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            // Calculate mouse position relative to the card center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Rotation Multipliers (adjust for sensitivity)
            const rotateX = y / -10; // Invert Y for correct tilt direction
            const rotateY = x / 10;

            tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Reset on mouse leave
        heroSection.addEventListener('mouseleave', () => {
            tiltCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    }

    // --- 3. SCROLL ANIMATION (Cards & Sections) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate Section Title
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 800,
                    easing: 'easeOutQuad'
                });

                // Animate Children (Bento Cards)
                const cards = entry.target.querySelectorAll('.bento-card, .skill-pill');
                if(cards.length > 0) {
                    anime({
                        targets: cards,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        delay: anime.stagger(100),
                        duration: 800,
                        easing: 'easeOutCubic'
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-node').forEach(section => observer.observe(section));

    // --- 4. WORKFLOW LINE DRAWING ---
    const svgPath = document.getElementById('workflow-path');
    const nodes = document.querySelectorAll('.node-icon');
    
    function drawLine() {
        if (!svgPath || nodes.length === 0) return;
        
        // Match container height to document
        const totalHeight = document.body.scrollHeight;
        document.querySelector('.line-container').style.height = totalHeight + 'px';

        let path = "";
        
        // Start from hero text bottom approximate area
        const startX = nodes[0].getBoundingClientRect().left + 7; // Center of 14px node
        const startY = 300; // Arbitrary start near hero

        path += `M ${startX} ${startY} `;

        nodes.forEach(node => {
            const rect = node.getBoundingClientRect();
            const y = rect.top + window.scrollY;
            path += `L ${startX} ${y} `;
        });

        // Extend to bottom
        path += `L ${startX} ${totalHeight}`;
        
        svgPath.setAttribute('d', path);
        
        // Set Stroke for Animation
        const len = svgPath.getTotalLength();
        svgPath.style.strokeDasharray = len;
        svgPath.style.strokeDashoffset = len;
    }

    setTimeout(drawLine, 100);
    window.addEventListener('resize', drawLine);

    // Scroll Listener for Line
    window.addEventListener('scroll', () => {
        const len = svgPath.getTotalLength();
        const scrollPercent = (window.scrollY + window.innerHeight * 0.5) / document.body.scrollHeight;
        const draw = len * scrollPercent;
        svgPath.style.strokeDashoffset = len - draw;
    });
});
