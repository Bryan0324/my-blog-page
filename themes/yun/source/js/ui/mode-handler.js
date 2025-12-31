/**
 * Mode Handler - Easy to extend theme mode system
 * Supports multiple modes: light, dark, sunset, and easy to add more
 */

// Mode configuration - Add new modes here
const MODE_CONFIG = {
  light: {
    name: 'light',
    class: '', // No class for light mode (default)
    icon: '☀️',
    next: 'sunset'
  },
  sunset: {
    name: 'sunset',
    class: 'sunset',
    icon: '🌅',
    next: 'dark'
  },
  dark: {
    name: 'dark',
    class: 'dark',
    icon: '🌙',
    next: 'light'
  }
  // To add a new mode, just add another entry here:
  // newmode: {
  //   name: 'newmode',
  //   class: 'newmode',
  //   icon: '🎨',
  //   next: 'light' // or any other mode
  // }
};

const STORAGE_KEY = 'darken-mode';

class ModeHandler {
  constructor(modes = MODE_CONFIG) {
    this.modes = modes;
    this.currentMode = this.getCurrentMode();
  }

  /**
   * Get current mode from DOM or localStorage
   */
  getCurrentMode() {
    const html = document.documentElement;
    
    // Check localStorage first (user preference takes priority)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && this.modes[saved]) {
      return saved;
    }
    
    // Then check DOM classes (for time/auto mode initial detection)
    for (const [name, config] of Object.entries(this.modes)) {
      if (config.class && html.classList.contains(config.class)) {
        return name;
      }
    }
    
    // Default to light (when no class and no localStorage)
    return 'light';
  }

  /**
   * Apply mode to DOM
   */
  applyMode(modeName) {
    if (!this.modes[modeName]) {
      console.error(`Mode "${modeName}" not found`);
      return;
    }

    const html = document.documentElement;
    const mode = this.modes[modeName];
    
    // Remove all mode classes
    Object.values(this.modes).forEach(m => {
      if (m.class) {
        html.classList.remove(m.class);
      }
    });
    
    // Add new mode class
    if (mode.class) {
      html.classList.add(mode.class);
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, modeName);
    this.currentMode = modeName;
  }

  /**
   * Toggle to next mode
   */
  toggle() {
    const current = this.modes[this.currentMode];
    const nextMode = current.next;
    if (nextMode && this.modes[nextMode]) {
      this.applyMode(nextMode);
      return nextMode;
    }
    // Fallback: cycle to first mode
    const firstMode = Object.keys(this.modes)[0];
    this.applyMode(firstMode);
    return firstMode;
  }

  /**
   * Initialize mode handler
   */
  init() {
    // Apply saved mode on load
    this.applyMode(this.currentMode);
    
    // Set up toggle button
    this.setupToggleButton();
  }

  /**
   * Reinitialize for pjax (when page content changes)
   * Re-applies the saved mode without reloading from DOM
   */
  reinit() {
    // Get the saved mode preference
    const saved = localStorage.getItem(STORAGE_KEY);
    const modeToApply = (saved && this.modes[saved]) ? saved : this.currentMode;
    
    // Apply saved mode
    this.applyMode(modeToApply);
    
    // Re-setup toggle button in case DOM changed
    this.setupToggleButton();
  }

  /**
   * Setup toggle button click handler
   */
  setupToggleButton() {
    const toggleBtn = document.getElementById('toggle-mode-btn');
    if (toggleBtn) {
      // Remove existing listeners by cloning
      const newBtn = toggleBtn.cloneNode(true);
      toggleBtn.parentNode.replaceChild(newBtn, toggleBtn);
      
      // Add click handler
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }
  }

  /**
   * Get mode configuration for external use
   */
  getModeConfig(modeName) {
    return this.modes[modeName] || null;
  }

  /**
   * Add a new mode dynamically (advanced usage)
   */
  addMode(name, config) {
    this.modes[name] = {
      name,
      class: config.class || name,
      icon: config.icon || '🎨',
      next: config.next || 'light',
      ...config
    };
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.modeHandler = new ModeHandler();
      window.modeHandler.init();
      
      // Re-apply mode when pjax changes page
      if (window.Pjax) {
        document.addEventListener('pjax:complete', () => {
          window.modeHandler.reinit();
        });
      }
    });
  } else {
    window.modeHandler = new ModeHandler();
    window.modeHandler.init();
    
    // Re-apply mode when pjax changes page
    if (window.Pjax) {
      document.addEventListener('pjax:complete', () => {
        window.modeHandler.reinit();
      });
    }
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModeHandler;
}
