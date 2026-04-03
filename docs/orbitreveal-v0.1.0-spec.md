# OrbitReveal v0.1.0 Product Spec

## 1. Product Summary

**OrbitReveal** is a premium immersive media viewer for modern brands, ecommerce storefronts, portfolios, and launch pages.

It turns ordinary click-to-enlarge interactions into cinematic, brand-adaptive product reveals with motion, spatial depth, and premium presentation behavior.

OrbitReveal is not positioned as a generic lightbox. It is positioned as a:

- premium product gallery enhancer
- cinematic media reveal engine
- immersive fullscreen showcase layer
- brand-adaptive presentation modal

## 2. Version Goal

**Version:** `0.1.0`

**Objective:** ship the first commercially credible core product as a standalone JavaScript SDK with a minimal React wrapper and demo/docs site.

Version `0.1.0` should be good enough to:

- run on A'Dash sites immediately
- support direct install for agencies and developers
- validate demand before WordPress and Shopify wrappers
- form the shared engine for later platform products

## 3. Target Market

### Primary Buyers

- premium Shopify merchants
- WordPress agencies
- creative studios
- product brands with strong visual storytelling
- developers building marketing sites and portfolio experiences

### Best Fit Verticals

- fashion
- jewelry
- automotive
- technology hardware
- luxury packaging
- architecture and interiors
- design portfolios
- campaign and launch microsites

### Poor Fit

- low-cost commodity stores
- text-heavy blogs
- basic catalog sites with no design sensitivity
- ultra-low-performance legacy environments

## 4. Product Promise

OrbitReveal helps brands make products and visual work feel more valuable, memorable, and premium without rebuilding their whole site experience.

## 5. Core Value Proposition

### User Outcome

When a visitor opens an image, it should feel like entering a presentation chamber rather than opening a utility modal.

### Buyer Outcome

A merchant, agency, or creative team should be able to:

- install quickly
- theme the experience to match their brand
- upgrade perceived product value
- improve visual storytelling on product and portfolio pages
- keep acceptable performance and accessibility defaults

## 6. v0.1.0 Scope

### Included

- standalone browser SDK
- minimal React wrapper
- configurable fullscreen immersive viewer
- click-origin aware entry and exit
- shared-image morph transition support
- brand-adaptive gradients
- particle ring, particle trails, and constellation overlays
- parallax response to pointer movement
- ambient mode toggle
- reduced motion support
- keyboard and close controls
- mobile-safe layout mode
- analytics callback hooks
- theme tokens and presets
- demo site with examples
- documentation for install and configuration

### Not Included

- Shopify app
- WordPress plugin
- CMS visual builder integrations
- video support
- 3D model support
- checkout analytics integrations
- multi-user SaaS admin
- billing portal
- cloud-hosted dashboard
- AI-generated themes

## 7. MVP Success Criteria

OrbitReveal `0.1.0` is successful if it:

- can be installed in under 20 minutes by a frontend developer
- works on static HTML and React sites
- feels visibly premium compared to standard lightboxes
- ships with at least 3 polished presets
- performs well on modern desktop and acceptable on mid-range mobile
- passes basic accessibility expectations
- is stable enough to use in production on A'Dash properties

## 8. Core User Stories

### Merchant / Brand Story

As a brand owner, I want my product images to open in a way that feels luxurious and high-value so customers perceive the product as premium.

### Agency Story

As an agency, I want to install and theme the viewer quickly across client projects so I can sell a visual upgrade without building a custom gallery every time.

### Developer Story

As a developer, I want a predictable SDK and event model so I can integrate OrbitReveal into existing sites without fighting the component.

## 9. Feature Requirements

### 9.1 Viewer Behavior

- Open from the exact clicked element position
- Support image morphing from thumbnail to stage
- Close with click-outside, button, and `Esc`
- Trap focus while open
- Restore focus to invoking element when closed

### 9.2 Motion System

- Direction-aware opening motion
- Smooth spring entry
- Controlled parallax depth
- Layered ambient glow and rotating gradient frame
- Subtle micro-feedback on open, close, and toggles

### 9.3 Brand System

- Theme tokens via CSS variables and JS config
- At least 3 built-in presets:
  - `luminous-blue`
  - `neon-green`
  - `solar-gold`
- Support custom brand colors
- Support custom particle shape family

### 9.4 Particle System

- Base orbit particle layer
- Branded particle trail layer
- Constellation overlay nodes and lines
- Runtime switch by preset
- Performance fallback mode

### 9.5 Ambient Mode

- Toggle control in UI
- Optional Web Audio atmospheric layer
- Visual equalizer/toggle state
- Safe fallback if audio APIs are unavailable

### 9.6 Accessibility

- `prefers-reduced-motion` support
- keyboard navigation
- labeled close control
- adequate contrast defaults
- no required audio for core function

### 9.7 Analytics Hooks

- `onOpen`
- `onClose`
- `onToggleAmbient`
- `onImageChange`
- `onCtaClick` reserved for later overlays

## 10. Non-Functional Requirements

### Performance

- lazy-init only when matching elements exist
- no continuous heavy loops outside active viewer
- target fast interaction on modern browsers
- reduced particle density on smaller screens

### Reliability

- no hard dependency on framework runtime for core
- safe no-op behavior when media config is incomplete
- defensive fallback when Web Audio or View Transition behavior is unsupported

### Browser Support

- latest Chrome
- latest Edge
- latest Safari
- latest Firefox
- graceful degradation where specific effects are unsupported

## 11. Product Packaging Strategy

### Launch Product

Standalone JavaScript SDK

### Secondary Packages

- React wrapper
- docs/demo app

### Future Packages

- WordPress plugin adapter
- Shopify app adapter

## 12. Package Architecture

Recommended monorepo structure:

```text
orbitreveal/
  package.json
  pnpm-workspace.yaml
  turbo.json
  apps/
    docs-site/
      package.json
      index.html
      src/
        main.tsx
        app/
        pages/
        demos/
        content/
  packages/
    core/
      package.json
      src/
        index.ts
        viewer/
          createViewer.ts
          ViewerController.ts
          ViewerState.ts
        motion/
          transitions.ts
          springs.ts
          parallax.ts
        themes/
          presets.ts
          tokens.ts
          resolveTheme.ts
        particles/
          particleEngine.ts
          particlePresets.ts
          constellationLayouts.ts
        ambient/
          ambientAudio.ts
          ambientFallback.ts
        a11y/
          focusTrap.ts
          reducedMotion.ts
          keyboard.ts
        dom/
          selectors.ts
          portal.ts
          measurements.ts
        utils/
          events.ts
          guards.ts
          ids.ts
          types.ts
      styles/
        base.css
        viewer.css
        themes.css
    react/
      package.json
      src/
        index.ts
        OrbitRevealProvider.tsx
        OrbitRevealGallery.tsx
        OrbitRevealImage.tsx
        useOrbitReveal.ts
    shared/
      package.json
      src/
        contracts/
        constants/
        analytics/
```

## 13. v0.1.0 File Architecture

Practical first-pass build layout if we start now:

```text
orbitreveal/
  README.md
  package.json
  pnpm-workspace.yaml
  apps/
    docs-site/
      package.json
      vite.config.ts
      src/
        main.tsx
        App.tsx
        pages/
          Home.tsx
          DemoPortfolio.tsx
          DemoStore.tsx
        demos/
          demoData.ts
  packages/
    core/
      package.json
      src/
        index.ts
        createOrbitReveal.ts
        defaults.ts
        types.ts
        viewer/
          mountViewer.ts
          openViewer.ts
          closeViewer.ts
          syncSharedImage.ts
        layers/
          glowLayer.ts
          particleLayer.ts
          trailLayer.ts
          constellationLayer.ts
        theme/
          builtinThemes.ts
          themeResolver.ts
        motion/
          launchOrigin.ts
          parallaxController.ts
          microFeedback.ts
        ambient/
          ambientController.ts
        a11y/
          focusManager.ts
          keyboardShortcuts.ts
        css/
          orbitreveal.css
    react/
      package.json
      src/
        index.ts
        OrbitRevealGallery.tsx
        OrbitRevealItem.tsx
        OrbitRevealRoot.tsx
```

## 14. Core API Design

### JavaScript SDK

```ts
import { createOrbitReveal } from "@orbitreveal/core";

const viewer = createOrbitReveal({
  selector: "[data-orbitreveal]",
  theme: "luminous-blue",
  ambient: true,
  parallax: true,
  particles: "auto",
  motion: "cinematic",
  mobileMode: "adaptive",
  analytics: {
    onOpen: (payload) => {},
    onClose: (payload) => {},
    onToggleAmbient: (payload) => {},
  },
});

viewer.init();
```

### React Wrapper

```tsx
<OrbitRevealGallery
  theme="solar-gold"
  ambient
  motion="cinematic"
  items={[
    { id: "1", src: "/img/one.jpg", alt: "Product one" },
    { id: "2", src: "/img/two.jpg", alt: "Product two" },
  ]}
/>
```

## 15. Config Model

```ts
type OrbitRevealConfig = {
  selector?: string;
  theme?: string | CustomTheme;
  ambient?: boolean;
  parallax?: boolean;
  particles?: "auto" | "low" | "off";
  motion?: "cinematic" | "balanced" | "minimal";
  mobileMode?: "adaptive" | "simple";
  reducedMotionMode?: "respect" | "force-minimal";
  zIndex?: number;
  analytics?: {
    onOpen?: (payload: ViewerEventPayload) => void;
    onClose?: (payload: ViewerEventPayload) => void;
    onToggleAmbient?: (payload: ViewerEventPayload) => void;
    onImageChange?: (payload: ViewerEventPayload) => void;
  };
};
```

## 16. Theme Presets

### Built-In Presets

- `luminous-blue`
- `neon-green`
- `solar-gold`

Each preset includes:

- primary color
- secondary color
- tertiary color
- glow palette
- particle color
- particle shape family
- trail style
- constellation layout profile
- ambient sound profile

## 17. Demo Requirements

The docs/demo app should include:

- homepage with positioning
- side-by-side comparison with ordinary lightbox
- product gallery demo
- portfolio demo
- theme preset switcher
- performance/reduced-motion demo
- install docs

## 18. Pricing Concept

Initial business model:

- Free internal/private alpha
- Early access direct license for agencies
- Paid site license for production use
- Later:
  - WordPress Pro plugin
  - Shopify monthly subscription

## 19. v0.1.0 Delivery Milestones

### Milestone 1: Core Viewer Shell

- modal lifecycle
- open/close controls
- shared image morph
- theme token system

### Milestone 2: Premium Motion Layer

- click-origin motion
- parallax
- micro feedback
- rotating gradient stage

### Milestone 3: Signature Effects

- particle ring
- particle trails
- constellations
- ambient mode

### Milestone 4: Production Hardening

- reduced motion
- accessibility
- mobile tuning
- error handling
- docs

### Milestone 5: Commercial Readiness

- versioned package release
- demo site
- license language
- landing page assets

## 20. Risks

### Product Risks

- becoming “too flashy” and losing premium restraint
- performance degradation on lower-end devices
- animation quality differing across browsers
- difficult integration if API is not kept simple

### Mitigations

- offer `cinematic`, `balanced`, and `minimal` modes
- mobile-safe adaptive downgrade path
- strict reduced-motion handling
- keep the core install surface very small

## 21. Out of Scope Decisions

To protect `0.1.0`, we explicitly reject:

- CMS-specific admin screens
- no-code builder UI
- cloud account system
- real-time analytics dashboard
- video / 3D viewer support
- AI theming assistant

## 22. Ship Decision

We should build OrbitReveal `0.1.0` first as:

- a **standalone SDK**
- a **React wrapper**
- a **demo/docs app**

This gives us the strongest foundation for later WordPress and Shopify commercialization without locking the product too early into platform-specific constraints.
