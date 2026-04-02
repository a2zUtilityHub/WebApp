
# Ad Sidebar Layout Guide

This guide documents the Three-Column Ad Sidebar Layout System implemented across A2Z Utility Hub.

## Overview
To maximize ad revenue without disrupting user experience, a three-column layout is used. It positions the main content in the center while dynamically rendering sticky left and right ad sidebars based on the user's viewport. 

## Component Architecture

1. **`useAdSidebarLayout` Hook**
   - Determines the current breakpoint (`isDesktop`, `isTablet`, `isMobile`).
   - Determines whether to show left ads (desktop only) and right ads (desktop & tablet).
   - Manages resize event listeners efficiently.

2. **`AdSidebarLayout`**
   - CSS Grid-based structure relying on `src/styles/AdSidebarLayout.css`.
   - Desktop: `300px minmax(0, 1fr) 300px`
   - Tablet: `minmax(0, 1fr) 300px`
   - Mobile: `1fr`

3. **`AdSidebar`**
   - Represents a single sidebar column (left or right).
   - Handles `position: sticky` and `max-height: calc(100vh - 100px)`.
   - Collapses gracefully if no ads are provided.

4. **`AdContainer`**
   - Individual wrapper for AdSense ad units (`AdSenseVertical`).
   - Implements `IntersectionObserver` for lazy loading to improve page load speed.
   - Provides consistent spacing, padding, borders, and the "Advertisement" label.

5. **`AdSidebarLayoutWrapper`**
   - High-level wrapper component intended to enclose page contents.
   - Accepts arrays of ad slots (`leftAdSlots`, `rightAdSlots`).
   - Conditionally renders layout only if `shouldShowAds` is true (via `AdSenseProvider`).

## Usage Examples

### Wrapping Page Content
To apply the sidebar layout, simply import `AdSidebarLayoutWrapper` and wrap your main content. It's best to exclude full-width elements like Hero Sections from the wrapper.

