# Customizations Made to hexo-theme-yun

This document tracks all custom modifications made to the original hexo-theme-yun theme.

## Table of Contents
- [Search Enhancements](#search-enhancements)
- [Visual Effects](#visual-effects)
- [Comments Integration](#comments-integration)
- [Theme Toggle](#theme-toggle)
- [Configuration](#configuration)

---

## Search Enhancements

### Local Search Improvements
**Files Modified:**
- `scripts/helpers/yun-config.js`
- `source/js/search/local-search.js`

**Changes:**
- Added null safety guard for `local_search.path` configuration to prevent TypeError when config is missing
- Implemented auto-trigger search functionality on input change
- Added Enter key support for triggering search
- Removed search button UI element in favor of input-only interface

**Configuration Required:**
```yaml
# In _config.yml (root)
search:
  path: search.xml
  field: post

# In _config.yun.yml
local_search:
  enable: true
  trigger: auto  # triggers search on typing
```

---

## Visual Effects

### Fireworks Animation
**Files Modified:**
- `source/js/ui/fireworks.js`
- `layout/_partial/background.pug`
- `source/css/_components/ui.styl`
- `scripts/helpers/yun-config.js`

**Changes:**
- Reformatted fireworks code for better readability
- Fixed anime.js vendor path to `animejs@latest/lib/anime.min.js`
- Added wait mechanism for anime.js library to load
- Implemented customizable fireworks colors via configuration
- Added canvas pointer-events prevention to avoid click interference
- Triggers on click with animated particle bursts

**Configuration:**
```yaml
fireworks:
  enable: true
  colors:
    - "102, 167, 221"
    - "62, 131, 225"
    - "33, 78, 194"
    - "3, 28, 95"
    - "0, 8, 55"
```

### Aurora Mouse Trail Effect
**Files Created:**
- `source/js/ui/aurora.js` (new file)

**Files Modified:**
- `layout/_partial/background.pug`
- `source/css/_components/ui.styl`
- `scripts/helpers/yun-config.js`

**Changes:**
- Created custom aurora particle effect following mouse cursor
- Canvas-based implementation with gradient particles
- Pointer-events disabled to prevent interaction issues
- Configurable colors and enable/disable toggle

**Features:**
- Particle trail follows mouse movement
- Gradient effects with customizable colors
- Fade-out animation for particles
- Non-intrusive (pointer-events: none)

---

## Comments Integration

### Utterances Theme Synchronization
**Files Modified:**
- `layout/_third-party/comments/utterances.pug`

**Changes:**
- Added automatic theme sync between site mode and utterances iframe
- Supports all theme modes: `light`, `dark`, `auto`, and `time`
- Uses postMessage API to communicate with utterances iframe
- Detects system color scheme preference via `prefers-color-scheme`
- Listens for HTML class changes to catch auto/time mode transitions
- Syncs on theme toggle button clicks
- Re-checks theme after utterances ready event with delay

**Implementation Details:**
- Monitors `document.documentElement` class changes for "dark" class
- Considers `CONFIG.mode` setting and system preferences
- Sets utterances theme to `github-dark` or `github-light` accordingly
- Handles timing issues with delayed re-sync after iframe ready

**Configuration:**
```yaml
utterances:
  enable: true
  repo: your-username/your-repo
  issue-term: pathname
  theme: preferred-color-scheme  # initial theme, will auto-sync
```

---

## Theme Toggle

### Mode Toggle Button Control
**Files Modified:**
- `layout/_partial/sidebar.pug`
- `_config.yml` (theme default)

**Changes:**
- Changed mode toggle button visibility logic
- Previously only showed for `auto` and `time` modes
- Now shows for all modes when configured
- Added `mode_toggle.enable` setting for manual control
- Toggle renders when `mode` is set AND `mode_toggle.enable !== false`

**Configuration:**
```yaml
# mode: light | dark | auto | time
mode: time

# Toggle button for switching theme mode in sidebar
mode_toggle:
  enable: true  # set to false to hide toggle button
```

**Behavior:**
- When `mode_toggle.enable: true` (default): button shows if mode is set
- When `mode_toggle.enable: false`: button is hidden regardless of mode
- Works with all mode types: light, dark, auto, time

---

## Configuration

### Package.json Updates
**File Modified:**
- `package.json` (root)

**Changes:**
- Updated `start` script to include `hexo clean` before generate
- Changed from `hexo generate && hexo server` to `hexo clean && hexo generate && hexo server`
- Ensures clean builds during development

---

## Dependencies

### Required Packages
```json
{
  "hexo-generator-searchdb": "^1.5.0",  // for local search
  "hexo-render-pug": "^2.1.4",           // pug template rendering
  "hexo-renderer-stylus": "^3.0.1"       // stylus css processing
}
```

### CDN Vendors
- **anime.js**: `animejs@latest/lib/anime.min.js` (for fireworks)
- **darken.js**: `darken@1.5.0` (for theme switching)

---

## Notes

### Maintenance Considerations
1. **Search**: Ensure `hexo-generator-searchdb` plugin is installed and generates `search.xml`
2. **Fireworks**: Anime.js must load before fireworks initialization
3. **Utterances**: Theme sync requires iframe to emit 'ready' event
4. **Aurora**: Canvas-based, may impact performance on low-end devices

### Future Enhancements
- Consider adding aurora enable/disable toggle in config
- Add more fireworks customization options (speed, size, duration)
- Implement search result highlighting
- Add theme transition animations

---

## Testing Checklist

- [ ] Local search works on typing
- [ ] Search results display correctly
- [ ] Fireworks trigger on click with configured colors
- [ ] Aurora trail follows mouse smoothly
- [ ] Utterances comments respect theme changes
- [ ] Theme toggle button visibility controlled by config
- [ ] Theme switching updates utterances in real-time
- [ ] All modes work: light, dark, auto, time

---

**Last Updated:** December 30, 2025
**Base Theme Version:** hexo-theme-yun v1.10.11
