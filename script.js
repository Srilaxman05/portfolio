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
```[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQFsz7fYywlRpnTLTMZML3dhZ0i4TEpgOEMQ-M235J7ClVNd-Tj5Sl5rf0JPF9ZqEg9W3f9Vgg_9ssr17Sfr4wu6uOMgbt2MDC3dplqhB2CoUKQIes0OQRNkR7gbwnKPirTDyKBorPNTTFLxkry0PiQQpEXPeVG8qxl62B9rJtjJ9PcTyoTmm6Xr77uRmQ%3D%3D)][[2](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHvFdNfFIMAC-bkLrTYnSfVK6bHTcAHgM3Qdm0rRv46O6FLXonSCv5rmgJ--jwcNfnj4oYqt9KSBswVw2h3g0gCi1uhIzQB99eCS-ozO-yP07tA78gCMgAnvKaPaTBr1sWNe7GeyiZxbRNs7vHzb1c2nJWMuHd2Vh8dxaLyFdTHyapyyyM5vAvvFMateVRPRjU4y8Q1yVEsxNgPkxVsPyq_HLnik0lGLe6dUEFCd2TNAm8Bq5xgiU0%3D)][[4](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHIG683ObNZMdVT9fBSvCP9AIEKQcOcuYGKGmIexSqYWHY4ydW66-bI0bvZh5f5_bH5k9pAH0iS6EkQyzfX8YUgq2Q3UQiq6RWbjoTewm3XwAv3TPSreo-HoTZFdDckIjAI8JWXlJ-4Dw6_DO1c07bAd0Q1rFP95SyVJYZvbrUoGxEKgtSNNb0nQ7wZEIemTfRVzmkC)][[5](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHio8OjYpPkOQKls6m-6s3-6geG8juz1a35Oe5kGTzh5Hk44S9-fUO34WZ45bTDLoQ461DmbwnXjuIFGOIZPE4NlPpIsSYWy-RlI9lHdTkL55esOkLP0SasYZPOWjrTn39AsYtBcKSCt-5vVf6GF1KfJ2aKEZE4ty0LWAZOsl_RBrv-AYncLCWCX5rO)][[6](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQGYYln50bx2aIhOWFWwnpDjSEmIuvsM0pk9ccJiEio1JVBToKHHe5szMyqR7tC_bBGl2PT4m8YB8RxlcbWVPqzHbuGrc3y9CcoGTs1oBuaFHh14mBmi07K40-kth73n3ctl_c34bEHScGmW3R9hwVu-ULgVt_RMivodjPboVR6_hbg7YtVyIxlv1ujJBNPjkR_5EiZc)][[7](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQFXfvuVrMzxSvqtVFmWx6vGZCuJjSnz_Rsw2ItA9E9qWYzMq4d4s2EKrKBuCH2evlLQ0BoIslyzxL_80vfZMjwdZwG5_9qv8PQBKDZcO_LDzySkAWikOZaPfVR7SSufOgNlxPsijldRehxKseKXmMoEpaTqTcP45nCc1rFzfUxdqZEqvJGef1w%3D)][[11](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQGJgEa9ashBAXNMTNcqHaTBUhtPQkXKQA1PTSUMahOjCkDiIpGM64GaBV8ij0G5LI1OisJ9weTbViqRgStZixgaZWgoXm3k-4KKu8Wj-leVB9db6BCzmUDVB3OQe8jqKq0azt8em_s%3D)]
