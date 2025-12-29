/**
 * Initialize fireworks animation system
 * @param {Object} options - Configuration options
 */
function initFireworks(options) {
  // Default color palette (shades of blue)
  const defaultColors = ["102, 167, 221", "62, 131, 225", "33, 78, 194"];
  
  // Merge user options with defaults
  options = Object.assign({
    colors: defaultColors,
    numberOfParticles: 20,
    orbitRadius: { min: 50, max: 100 },
    circleRadius: { min: 10, max: 20 },
    diffuseRadius: { min: 50, max: 100 },
    animeDuration: { min: 900, max: 1500 }
  }, options);

  // Current mouse/touch position
  let mouseX = 0;
  let mouseY = 0;
  
  // Active color palette
  const colors = options.colors || defaultColors;
  
  // Canvas setup
  const canvas = document.querySelector(".fireworks");
  const ctx = canvas.getContext("2d");

  /**
   * Resize canvas to fill viewport
   */
  function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }

  /**
   * Update mouse/touch coordinates from event
   */
  function updatePointerPosition(event) {
    mouseX = event.clientX || (event.touches[0] ? event.touches[0].clientX : event.changedTouches[0].clientX);
    mouseY = event.clientY || (event.touches[0] ? event.touches[0].clientY : event.changedTouches[0].clientY);
  }

  /**
   * Calculate random endpoint for particle explosion
   * Uses polar coordinates for radial distribution
   */
  function calculateEndPosition(particle) {
    const angle = window.anime.random(0, 360) * Math.PI / 180;
    const distance = window.anime.random(options.diffuseRadius.min, options.diffuseRadius.max);
    const direction = [-1, 1][window.anime.random(0, 1)] * distance;
    
    return {
      x: particle.x + direction * Math.cos(angle),
      y: particle.y + direction * Math.sin(angle)
    };
  }

  /**
   * Create a particle object
   */
  function createParticle(x, y) {
    const particle = {
      x: x,
      y: y,
      color: `rgba(${colors[window.anime.random(0, colors.length - 1)]}, ${window.anime.random(0.2, 0.8)})`,
      radius: window.anime.random(options.circleRadius.min, options.circleRadius.max),
      endPos: null,
      draw() {}
    };
    
    particle.endPos = calculateEndPosition(particle);
    
    particle.draw = function() {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = particle.color;
      ctx.fill();
    };
    
    return particle;
  }

  /**
   * Create expanding ring effect (shockwave)
   */
  function createRing(x, y) {
    const ring = {
      x: x,
      y: y,
      color: "#000",
      radius: 0.1,
      alpha: 0.5,
      lineWidth: 6,
      draw() {}
    };
    
    ring.draw = function() {
      ctx.globalAlpha = ring.alpha;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.radius, 0, 2 * Math.PI, true);
      ctx.lineWidth = ring.lineWidth;
      ctx.strokeStyle = ring.color;
      ctx.stroke();
      ctx.globalAlpha = 1;
    };
    
    return ring;
  }

  /**
   * Animation update callback - redraws all animated targets
   */
  function updateAnimation(animation) {
    for (let i = 0; i < animation.animatables.length; i++) {
      animation.animatables[i].target.draw();
    }
  }

  /**
   * Create fireworks burst at specified position
   */
  function createFireworksBurst(x, y) {
    const ring = createRing(x, y);
    const particles = [];
    
    // Create all particles
    for (let i = 0; i < options.numberOfParticles; i++) {
      particles.push(createParticle(x, y));
    }
    
    // Animate particles and ring
    window.anime.timeline()
      .add({
        targets: particles,
        x(particle) { return particle.endPos.x; },
        y(particle) { return particle.endPos.y; },
        radius: 0.1,
        duration: window.anime.random(options.animeDuration.min, options.animeDuration.max),
        easing: "easeOutExpo",
        update: updateAnimation
      })
      .add({
        targets: ring,
        radius: window.anime.random(options.orbitRadius.min, options.orbitRadius.max),
        lineWidth: 0,
        alpha: {
          value: 0,
          easing: "linear",
          duration: window.anime.random(600, 800)
        },
        duration: window.anime.random(1200, 1800),
        easing: "easeOutExpo",
        update: updateAnimation
      }, 0); // Start at same time as particles
  }

  // Continuous canvas clearing animation
  const clearAnimation = window.anime({
    duration: Infinity,
    update: () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  // Handle mouse/touch clicks
  document.addEventListener("mousedown", (event) => {
    clearAnimation.play();
    updatePointerPosition(event);
    createFireworksBurst(mouseX, mouseY);
  }, false);

  // Initialize canvas
  resizeCanvas(canvas);
  
  // Handle window resize
  window.addEventListener("resize", () => {
    resizeCanvas(canvas);
  }, false);
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("Fireworks: DOMContentLoaded fired");
  console.log("Fireworks: window.CONFIG =", window.CONFIG);
  
  const config = {};
  
  // Load custom colors from global config if available
  if (window.CONFIG && window.CONFIG.fireworks && window.CONFIG.fireworks.colors) {
    config.colors = window.CONFIG.fireworks.colors;
    console.log("Fireworks: Using custom colors", config.colors);
  } else {
    console.log("Fireworks: Using default colors");
  }
  
  const canvas = document.querySelector(".fireworks");
  console.log("Fireworks: Canvas element found?", !!canvas);
  
  if (!canvas) {
    console.error("Fireworks: Canvas element not found!");
    return;
  }
  
  initFireworks(config);
  console.log("Fireworks: Initialized successfully");
});
