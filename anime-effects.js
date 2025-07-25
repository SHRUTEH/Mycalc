// Anime Fight Effects for Calculator

// Sound effects for different operations
const soundEffects = {
    // Basic operation sounds
    basic: [
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
    ],
    // Special operation sounds (equals, functions)
    special: [
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
    ],
    // Error sound
    error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
};

// Naruto-themed sound URLs (fallback)
const narutoSounds = [
    'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    'https://www.soundjay.com/misc/sounds/beep-07a.wav',
    'https://www.soundjay.com/misc/sounds/beep-10.wav'
];

// Array of English fight texts
const fightTexts = [
    'RASENGAN!', 
    'CHIDORI!', 
    'SHADOW CLONE!', 
    'FIREBALL!', 
    'SHARINGAN!',
    'CRITICAL HIT!',
    'SUPER EFFECTIVE!',
    'COMBO!'
];

// Array of impact effect images
const impactImages = [
    'https://i.imgur.com/JcQsKQY.png',  // Standard impact
    'https://i.imgur.com/8Vkr4XU.png',  // Star impact
    'https://i.imgur.com/pXeq4Ot.png'   // Explosion impact
];

// Add anime fight effects only to operation buttons and equals button
function addAnimeFightEffects() {
    // Only add effects to equals button and operators
    const operationButtons = document.querySelectorAll('.btn.equals, .btn.operator');
    
    operationButtons.forEach(button => {
        button.addEventListener('click', createFightEffect);
    });
    
    // Also add effects to calculation results
    const calculator = window.calculator;
    if (calculator) {
        const originalCalculate = calculator.calculate;
        calculator.calculate = function() {
            const result = originalCalculate.apply(this, arguments);
            
            // Create fight effect at the display
            const display = document.querySelector('.calculator-display');
            if (display) {
                const rect = display.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                
                createResultFightEffect(x, y);
            }
            
            return result;
        };
    }
}

// Create fight effect when button is clicked
function createFightEffect(e) {
    const button = e.currentTarget;
    
    // 1. Add anime hit animation class to button
    button.classList.add('anime-hit');
    
    // 2. Create impact effect
    createImpactEffect(e.clientX, e.clientY);
    
    // 3. Play sound effect based on button type
    const soundType = button.classList.contains('equals') ? 'special' : 
                     button.classList.contains('function') ? 'special' : 'basic';
    playSound(soundType);
    
    // 4. Add English text effect
    createTextEffect(e.clientX, e.clientY);
    
    // 5. Create energy particles
    createEnergyParticles(e.clientX, e.clientY);
    
    // 6. Create screen flash for equals button
    if (button.classList.contains('equals')) {
        createScreenFlash();
        createShockwave(e.clientX, e.clientY);
    }
    
    // Remove animation class after animation completes
    setTimeout(() => {
        button.classList.remove('anime-hit');
    }, 500);
}

// Create fight effect for calculation results
function createResultFightEffect(x, y) {
    // 1. Create impact effect
    createImpactEffect(x, y);
    
    // 2. Play special sound effect for calculation result
    playSound('special');
    
    // 3. Add English text effect
    createTextEffect(x, y);
    
    // 4. Create energy particles
    createEnergyParticles(x, y);
    
    // 5. Create screen flash and shockwave
    createScreenFlash();
    createShockwave(x, y);
}

// Create impact effect
function createImpactEffect(x, y) {
    const impact = document.createElement('div');
    impact.className = 'impact-effect';
    
    // Randomly select an impact image
    const randomImage = impactImages[Math.floor(Math.random() * impactImages.length)];
    impact.style.backgroundImage = `url('${randomImage}')`;
    
    impact.style.left = `${x}px`;
    impact.style.top = `${y}px`;
    document.body.appendChild(impact);
    
    // Remove after animation completes
    setTimeout(() => {
        if (document.body.contains(impact)) {
            document.body.removeChild(impact);
        }
    }, 500);
}

// Play sound effect based on operation type
function playSound(type = 'basic') {
    let soundUrl;
    
    if (type === 'special' || type === 'equals') {
        soundUrl = soundEffects.special[Math.floor(Math.random() * soundEffects.special.length)];
    } else if (type === 'error') {
        soundUrl = soundEffects.error;
    } else {
        soundUrl = soundEffects.basic[Math.floor(Math.random() * soundEffects.basic.length)];
    }
    
    const sound = new Audio(soundUrl);
    sound.volume = 0.4;
    sound.play().catch(e => {
        // Fallback to Naruto sounds if base64 fails
        const fallbackSound = new Audio(narutoSounds[Math.floor(Math.random() * narutoSounds.length)]);
        fallbackSound.volume = 0.3;
        fallbackSound.play().catch(err => console.log('Audio play failed:', err));
    });
}

// Create sound context for better audio management
let audioContext;
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Generate beep sound programmatically
function createBeepSound(frequency = 800, duration = 200, type = 'sine') {
    try {
        const ctx = initAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

// Create English text effect
function createTextEffect(x, y) {
    const textEffect = document.createElement('div');
    textEffect.className = 'fight-text';
    textEffect.textContent = fightTexts[Math.floor(Math.random() * fightTexts.length)];
    textEffect.style.left = `${x}px`;
    textEffect.style.top = `${y - 50}px`;
    document.body.appendChild(textEffect);
    
    // Remove after animation completes
    setTimeout(() => {
        if (document.body.contains(textEffect)) {
            document.body.removeChild(textEffect);
        }
    }, 1000);
}

// Create energy particles
function createEnergyParticles(x, y) {
    const particleCount = 10;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'energy-particle';
        
        // Random color - either orange or blue
        const color = Math.random() > 0.5 ? '#ff8c00' : '#0066cc';
        particle.style.backgroundColor = color;
        
        // Random size
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        // Set initial position
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        document.body.appendChild(particle);
        
        // Animate particle
        let posX = x;
        let posY = y;
        let opacity = 1;
        let frame = 0;
        
        function animateParticle() {
            frame++;
            posX += vx / 10;
            posY += vy / 10;
            opacity -= 0.02;
            
            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            particle.style.opacity = opacity;
            
            if (opacity > 0 && frame < 60) {
                requestAnimationFrame(animateParticle);
            } else {
                document.body.removeChild(particle);
            }
        }
        
        requestAnimationFrame(animateParticle);
    }
}

// Create screen flash effect
function createScreenFlash() {
    const flash = document.createElement('div');
    flash.className = 'screen-flash';
    document.body.appendChild(flash);
    
    // Remove after animation completes
    setTimeout(() => {
        document.body.removeChild(flash);
    }, 300);
}

// Create shockwave effect
function createShockwave(x, y) {
    const shockwave = document.createElement('div');
    shockwave.className = 'shockwave';
    shockwave.style.left = `${x}px`;
    shockwave.style.top = `${y}px`;
    document.body.appendChild(shockwave);
    
    // Remove after animation completes
    setTimeout(() => {
        document.body.removeChild(shockwave);
    }, 600);
}

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to make sure calculator is initialized
    setTimeout(() => {
        addAnimeFightEffects();
    }, 500);
});