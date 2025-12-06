document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.parallax-section');
    const textElements = document.querySelectorAll('.fade-text');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiContext = confettiCanvas.getContext('2d');
    let confettiPieces = [];

    // --- Parallax Text Fade Effect ---
    function checkScroll() {
        const viewportHeight = window.innerHeight;

        textElements.forEach((text, index) => {
            const section = sections[index];
            const rect = section.getBoundingClientRect();

            // Calculate when the text should fade in/out
            // Fades in when the section is about 75% visible in the center
            const startFadeIn = rect.top + (rect.height * 0.25);
            const endFadeOut = rect.top + (rect.height * 0.75);

            // Calculate a scroll ratio for smooth fading
            let opacity = 0;
            if (startFadeIn < viewportHeight && endFadeOut > 0) {
                // Determine the middle point of the section in the viewport
                const middlePoint = viewportHeight / 2;
                const distanceToMiddle = Math.abs(rect.top + (rect.height / 2) - middlePoint);
                
                // Opacity is max (1) when the section is perfectly centered, min (0) when far
                // We use a mathematical function (e.g., based on distance) to control the fade
                // Max distance from center to be fully visible is about 50% of the viewport.
                const maxVisibleDistance = viewportHeight * 0.5;
                
                // Simple linear fade based on distance to center
                opacity = 1 - Math.min(1, distanceToMiddle / maxVisibleDistance);
            }
            
            // Set minimum opacity to ensure it's fully hidden when outside the visible range
            text.style.opacity = opacity;
        });
        
        // Ensure the final message is visible when page 5 is fully on screen
        const finalPageRect = sections[4].getBoundingClientRect();
        if (finalPageRect.top < viewportHeight && finalPageRect.bottom > 0) {
            document.querySelector('.final-message').style.opacity = 1;
        }
    }

    // --- Confetti Effect for Page 5 ---
    
    // Confetti class/structure (simplified for brevity)
    class ConfettiPiece {
        constructor(x, y, color, size, speedY, rotationSpeed) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = size;
            this.speedY = speedY;
            this.rotationSpeed = rotationSpeed;
            this.rotation = Math.random() * 360;
            this.velocity = { x: (Math.random() - 0.5) * 5, y: speedY };
        }

        update() {
            this.velocity.y += 0.1; // Gravity
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            confettiContext.save();
            confettiContext.translate(this.x, this.y);
            confettiContext.rotate(this.rotation * (Math.PI / 180));
            confettiContext.fillStyle = this.color;
            confettiContext.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            confettiContext.restore();
        }
    }

    function createConfetti() {
        confettiPieces = [];
        const colors = ['#ff00ff', '#8a2be2', '#00ffff', '#ffffff']; // Purple, Neon Blue, White
        const density = 100;

        for (let i = 0; i < density; i++) {
            const size = Math.random() * 8 + 4;
            const x = Math.random() * confettiCanvas.width;
            const y = Math.random() * confettiCanvas.height - confettiCanvas.height; // Start off-screen
            const color = colors[Math.floor(Math.random() * colors.length)];
            const speedY = Math.random() * 5 + 2;
            const rotationSpeed = Math.random() * 5 - 2.5;

            confettiPieces.push(new ConfettiPiece(x, y, color, size, speedY, rotationSpeed));
        }
    }

    function animateConfetti() {
        // Only run if the last page is in view
        const finalPageRect = sections[4].getBoundingClientRect();
        if (finalPageRect.top >= window.innerHeight || finalPageRect.bottom <= 0) {
            requestAnimationFrame(animateConfetti);
            return;
        }

        confettiContext.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        for (let i = confettiPieces.length - 1; i >= 0; i--) {
            const piece = confettiPieces[i];
            piece.update();
            piece.draw();

            // Remove pieces that fall off the screen
            if (piece.y > confettiCanvas.height) {
                confettiPieces.splice(i, 1);
            }
        }
        
        // Continuously generate a small stream of confetti while page 5 is in view
        if (Math.random() > 0.95 && confettiPieces.length < 300) {
             const size = Math.random() * 8 + 4;
             const x = Math.random() * confettiCanvas.width;
             const y = 0;
             const colors = ['#ff00ff', '#8a2be2', '#00ffff', '#ffffff'];
             const color = colors[Math.floor(Math.random() * colors.length)];
             const speedY = Math.random() * 5 + 2;
             const rotationSpeed = Math.random() * 5 - 2.5;
             confettiPieces.push(new ConfettiPiece(x, y, color, size, speedY, rotationSpeed));
        }

        requestAnimationFrame(animateConfetti);
    }
    
    // Set up canvas dimensions
    function resizeCanvas() {
        confettiCanvas.width = confettiCanvas.parentElement.clientWidth;
        confettiCanvas.height = confettiCanvas.parentElement.clientHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial call
    
    // Initial confetti burst
    createConfetti(); 
    animateConfetti();


    // --- Event Listeners ---
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check to set the state of the first text
});

// --- UPDATED: MUSIC AUTOPLAY HANDLER WITH EXPLICIT BUTTON ---

const audio = document.getElementById('bday-music');
const startButton = document.getElementById('start-button');

function playAndHide() {
    // 1. Attempt to play the audio
    audio.play().then(() => {
        console.log("Music started successfully.");
        // 2. Hide the button immediately after successful playback
        if (startButton) {
            startButton.style.display = 'none';
        }
    }).catch(e => {
        // 3. If playback fails (e.g., mobile tapping restriction),
        // we keep the button visible and wait for a user tap.
        console.error("Playback blocked or failed:", e);
    });
}

// Attach the function to the button click
if (startButton) {
    startButton.addEventListener('click', playAndHide);
}


// Try to play immediately on load (will likely fail, but we try)
playAndHide();

// If the button wasn't clicked, any other click interaction might still work
document.addEventListener('click', function fallbackPlay() {
    if (audio.paused) {
        audio.play().then(() => {
            if (startButton) startButton.style.display = 'none';
            document.removeEventListener('click', fallbackPlay);
        }).catch(e => {});
    }
}, { once: true });

// --- END UPDATED AUDIO HANDLER ---