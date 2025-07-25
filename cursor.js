document.addEventListener('DOMContentLoaded', () => {
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    
    // Create arrow lines
    const arrowLines = [];
    const numLines = 3;
    const lineLength = 40;
    
    for (let i = 0; i < numLines; i++) {
        const line = document.createElement('div');
        line.className = 'arrow-line';
        document.body.appendChild(line);
        arrowLines.push({
            element: line,
            length: lineLength,
            angle: (i * 120) + Math.random() * 30, // Distribute lines at different angles
            speed: 2 + Math.random() * 3
        });
    }
    
    // Create trail dots
    const trailDots = [];
    const numDots = 10;
    
    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        document.body.appendChild(dot);
        trailDots.push({
            element: dot,
            x: 0,
            y: 0,
            delay: i * 2
        });
    }
    
    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animation loop
    function animate() {
        // Calculate mouse velocity
        const dx = mouseX - prevMouseX;
        const dy = mouseY - prevMouseY;
        const velocity = Math.sqrt(dx * dx + dy * dy);
        
        // Update cursor
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
        
        // Scale cursor based on velocity
        const scale = Math.min(1 + velocity * 0.05, 2);
        cursor.style.width = `${20 * scale}px`;
        cursor.style.height = `${20 * scale}px`;
        
        // Update trail dots with delay
        trailDots.forEach((dot, index) => {
            const delayFactor = 1 - index / trailDots.length;
            
            dot.x += (mouseX - dot.x) * (0.1 * delayFactor);
            dot.y += (mouseY - dot.y) * (0.1 * delayFactor);
            
            dot.element.style.left = `${dot.x}px`;
            dot.element.style.top = `${dot.y}px`;
            dot.element.style.opacity = delayFactor * 0.5;
            dot.element.style.transform = `translate(-50%, -50%) scale(${delayFactor})`;
        });
        
        // Update arrow lines
        arrowLines.forEach((line, index) => {
            // Calculate angle based on mouse movement
            const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
            line.angle += (targetAngle - line.angle) * 0.1;
            
            // Update line position and rotation
            line.element.style.left = `${mouseX}px`;
            line.element.style.top = `${mouseY}px`;
            line.element.style.width = `${line.length * (1 + velocity * 0.05)}px`;
            line.element.style.transform = `rotate(${line.angle + (index * 120)}deg)`;
        });
        
        // Store current position for next frame
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Handle clicks - create ripple effect
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-trail';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        ripple.style.width = '5px';
        ripple.style.height = '5px';
        ripple.style.opacity = '1';
        
        document.body.appendChild(ripple);
        
        // Animate ripple
        let scale = 1;
        const expandRipple = setInterval(() => {
            scale += 0.5;
            ripple.style.transform = `translate(-50%, -50%) scale(${scale})`;
            ripple.style.opacity = 1 - (scale - 1) / 10;
            
            if (scale >= 10) {
                clearInterval(expandRipple);
                document.body.removeChild(ripple);
            }
        }, 20);
    });
});