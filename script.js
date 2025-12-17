document.addEventListener('DOMContentLoaded', () => {
    
    // 1. HERO ANIMATION (On Load)
    // Staggers the text elements and the profile image
    anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    })
    .add({
        targets: '.stagger-hero',
        translateY: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(200) // 200ms delay between each element
    });

    // 2. SCROLL REVEAL ANIMATION (Intersection Observer)
    // Triggers animations when sections come into view
    const observerOptions = {
        threshold: 0.2 // Trigger when 20% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate the Section itself
                anime({
                    targets: entry.target,
                    translateY: [50, 0],
                    opacity: [0, 1],
                    easing: 'easeOutCubic',
                    duration: 800
                });

                // Specific Animation for Skills Grid
                if (entry.target.id === 'skills') {
                    anime({
                        targets: '.skill-box',
                        scale: [0, 1],
                        opacity: [0, 1],
                        delay: anime.stagger(100, {grid: [4, 2], from: 'center'}),
                        easing: 'spring(1, 80, 10, 0)'
                    });
                }

                // Specific Animation for Certificates
                if (entry.target.id === 'certificates') {
                    anime({
                        targets: '.cert-card',
                        translateX: [-50, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(150),
                        easing: 'easeOutQuad'
                    });
                }
                
                // Specific Animation for Projects
                if (entry.target.id === 'projects') {
                    anime({
                        targets: '.project-card',
                        translateY: [30, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(200),
                        easing: 'easeOutQuad'
                    });
                }

                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-node').forEach(section => {
        observer.observe(section);
    });

    // 3. ELASTIC BUTTON HOVER EFFECTS
    // Adds a "jelly" scaling effect when mouse enters buttons
    const buttons = document.querySelectorAll('.btn, .btn-sm, .skill-box, .cert-card');

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            anime({
                targets: btn,
                scale: 1.05,
                duration: 800,
                easing: 'easeOutElastic(1, .6)'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            anime({
                targets: btn,
                scale: 1,
                duration: 600,
                easing: 'easeOutElastic(1, .6)'
            });
        });
    });

    // 4. DYNAMIC SVG WORKFLOW LINE
    // Draws a line connecting the "dots" as you scroll
    const svgPath = document.getElementById('workflow-path');
    const dots = document.querySelectorAll('.node-dot');
    
    function updatePath() {
        if(dots.length === 0) return;

        let pathString = "";
        const svgRect = document.getElementById('workflow-svg').getBoundingClientRect();
        
        dots.forEach((dot, index) => {
            const rect = dot.getBoundingClientRect();
            // Calculate relative coordinates within the SVG
            const x = rect.left + (rect.width / 2); 
            const y = rect.top + window.scrollY; // Absolute Y position relative to document

            if (index === 0) {
                pathString += `M ${x} ${y} `; // Start point
            } else {
                // Create a curved line to the next point
                const prevDot = dots[index - 1];
                const prevRect = prevDot.getBoundingClientRect();
                const prevY = prevRect.top + window.scrollY;
                
                // Simple straight line for now, or bezier for curves
                pathString += `L ${x} ${y} `;
            }
        });
        
        // Extend line to bottom of last section
        const lastDot = dots[dots.length - 1];
        const lastRect = lastDot.getBoundingClientRect();
        const lastY = lastRect.top + window.scrollY;
        pathString += `L ${lastRect.left + lastRect.width/2} ${lastY + 200}`;

        svgPath.setAttribute('d', pathString);
        
        // Setup stroke animation based on scroll
        const pathLength = svgPath.getTotalLength();
        svgPath.style.strokeDasharray = pathLength;
        svgPath.style.strokeDashoffset = pathLength;
    }

    // Call once to set initial path
    // Timeout ensures DOM is fully painted
    setTimeout(() => {
        updatePath();
        
        // SCROLL-LINKED DRAWING
        window.addEventListener('scroll', () => {
            const pathLength = svgPath.getTotalLength();
            // Calculate how far down we've scrolled (adjusted for viewport height)
            const scrollPercentage = (window.scrollY + window.innerHeight * 0.6) / document.body.scrollHeight;
            
            const drawLength = pathLength * scrollPercentage;
            
            // Draw the line by reducing the offset
            // We clamp it so it doesn't disappear or go negative
            const offset = Math.max(0, pathLength - drawLength);
            
            svgPath.style.strokeDashoffset = offset;
        });

    }, 500);

    // Update path on resize
    window.addEventListener('resize', updatePath);
});

