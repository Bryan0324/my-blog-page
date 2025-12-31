/**
 * Activate TOC link and update active state in the table of contents
 */
function activateTocLink(element) {
  if (element.classList.contains('active-current')) return;

  // Remove active state from all TOC items
  document.querySelectorAll('.post-toc .active').forEach((item) => {
    item.classList.remove('active', 'active-current');
  });

  // Add active state to current item
  element.classList.add('active', 'active-current');

  // Highlight parent list items up to TOC container
  let parent = element.parentNode;
  while (!parent.matches('.post-toc')) {
    if (parent.matches('li')) {
      parent.classList.add('active');
    }
    parent = parent.parentNode;
  }
}

/**
 * Initialize table of contents with scroll tracking and click handling
 */
function initializeToc() {
  let tocItems = document.querySelectorAll('.post-toc li');
  if (!tocItems.length) return;

  // Map TOC items to their corresponding heading elements
  let headings = [...tocItems].map((item) => {
    let tocLink = item.querySelector('.toc-link');
    let heading = document.getElementById(decodeURI(tocLink.getAttribute('href')).replace('#', ''));

    // Handle TOC link click - smooth scroll to heading
    tocLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo(0, heading.offsetTop + 1);
    });

    return heading;
  });

  /**
   * Find the current heading based on intersection observer entries
   */
  function findCurrentHeading(entries) {
    let index = 0;
    let current = entries[index];

    // If first heading is above viewport
    if (current.boundingClientRect.top > 0) {
      index = headings.indexOf(current.target);
      return index === 0 ? 0 : index - 1;
    }

    // Find the last heading that's in or above viewport
    for (; index < entries.length; index++) {
      if (entries[index].boundingClientRect.top <= 0) {
        current = entries[index];
      } else {
        return headings.indexOf(current.target);
      }
    }

    return headings.indexOf(current.target);
  }

  /**
   * Set up intersection observer to track heading visibility
   */
  function observeHeadings(threshold) {
    threshold = Math.floor(threshold + 10000);

    let observer = new IntersectionObserver(
      (entries, obs) => {
        let docHeight = document.documentElement.scrollHeight + 100;

        // If document grew, restart observation with new threshold
        if (docHeight > threshold) {
          obs.disconnect();
          observeHeadings(docHeight);
          return;
        }

        // Update active TOC item based on scroll position
        let currentIndex = findCurrentHeading(entries);
        activateTocLink(tocItems[currentIndex]);
      },
      {
        rootMargin: `${threshold}px 0px -100% 0px`,
        threshold: 0
      }
    );

    // Start observing all headings
    headings.forEach((heading) => {
      if (heading) {
        observer.observe(heading);
      }
    });
  }

  observeHeadings(document.documentElement.scrollHeight);
}

/**
 * Initialize sidebar navigation and TOC functionality
 */
function initializeSidebar() {
  const ACTIVE_NAV_CLASS = 'sidebar-nav-active';
  const ACTIVE_PANEL_CLASS = 'sidebar-panel-active';

  /**
   * Set up TOC number toggle (ordered/unordered list)
   */
  function setupTocToggle() {
    let tocToggleBtn = document.querySelector('.sidebar-nav-toc');
    const ORDERED_ICON = 'ri:list-ordered';
    const UNORDERED_ICON = 'ri:list-unordered';

    if (!tocToggleBtn) return;

    tocToggleBtn.addEventListener('click', () => {
      // Only toggle if TOC nav is active
      if (tocToggleBtn.classList.contains(ACTIVE_NAV_CLASS)) {
        let icon = tocToggleBtn.querySelector('.iconify');

        // Toggle icon between ordered and unordered
        icon.dataset.icon = icon.dataset.icon === ORDERED_ICON ? UNORDERED_ICON : ORDERED_ICON;

        // Toggle visibility of TOC numbers
        document.querySelectorAll('.toc-number').forEach((item) => {
          item.classList.toggle('hidden');
        });
      }
    });
  }

  /**
   * Set up sidebar navigation panel switching
   */
  function setupNavLinks() {
    document.querySelectorAll('.sidebar-nav li').forEach((item) => {
      item.onclick = function () {
        // Only switch panel if this nav item isn't already active
        if (!this.classList.contains(ACTIVE_NAV_CLASS)) {
          // Remove active panel
          document.querySelector(`.${ACTIVE_PANEL_CLASS}`).classList.remove(ACTIVE_PANEL_CLASS);

          // Add active panel
          document.querySelector(`#${this.dataset.target}`).classList.add(ACTIVE_PANEL_CLASS);

          // Update active nav item
          document.querySelector(`.${ACTIVE_NAV_CLASS}`).classList.remove(ACTIVE_NAV_CLASS);
          this.classList.add(ACTIVE_NAV_CLASS);
        }
      };
    });
  }

  // Initialize all sidebar features
  setupTocToggle();
  setupNavLinks();
  initializeToc();
}

// Initialize on page load and after pjax navigation
document.addEventListener('DOMContentLoaded', initializeSidebar);
document.addEventListener('pjax:success', initializeSidebar);
