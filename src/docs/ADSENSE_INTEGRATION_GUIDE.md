# Google AdSense Integration Guide

## Overview
This document outlines the architecture, setup, and usage of Google AdSense within the A2Z Utility Hub project. The integration utilizes a custom React wrapper system around `adsbygoogle` to provide responsive, lazy-loaded, and layout-safe ad placements.

## Components Architecture
The AdSense system is composed of several modular components found in `src/components/ads/`:

1. **`AdSenseAd.jsx`**: The core component that handles the Google AdSense script initialization (`window.adsbygoogle.push`) safely.
2. **`AdSenseResponsive.jsx`**: Auto-scaling ad unit. Adapts to parent container width.
3. **`AdSenseHorizontal.jsx`**: Fixed-dimension horizontal banner (728x90) for top/bottom placements.
4. **`AdSenseVertical.jsx`**: Fixed-dimension vertical block (300x250) intended for sidebars.
5. **`AdSenseContainer.jsx`**: The smart wrapper that handles Intersection Observer (lazy loading), skeleton state rendering, accessibility attributes, and global CSS structure.

## Configuration
AdSense configuration is centrally managed in `src/utils/adSenseConfig.js`. 
- **Client ID**: `ca-pub-9198321800783167`
- The file exposes helpers for checking viewport constraints and skipping ads on restricted pages (e.g., checkout).

## Ad Placements

| Page | Location | Component Used | Ad Slot Context |
|---|---|---|---|
| **HomePage** | Hero Bottom | `AdSenseHorizontal` | `home_hero_bottom` |
| **HomePage** | Mid Content | `AdSenseResponsive` | `home_mid_1`, `home_mid_2` |
| **HomePage** | Footer | `AdSenseHorizontal` | `home_footer` |
| **AppsPage** | Grid Content Bottom | `AdSenseResponsive` | `apps_mid` |
| **AppsPage** | Right Sidebar | `AdSenseVertical` | `apps_sidebar` |
| **AppsPage** | Page Footer | `AdSenseHorizontal` | `apps_footer` |
| **AppDetailPage** | Below App Component | `AdSenseHorizontal` | `app_detail_top` |
| **AppDetailPage** | Between Text Sections | `AdSenseResponsive` | `app_detail_mid` |
| **TaskManagerPage** | Dashboard Content | `AdSenseResponsive` | `task_about_mid` |
| **TaskManagerPage** | User Manual | `AdSenseHorizontal` | `task_manual_mid` |
| **TaskManagerPage** | Dashboard Footer | `AdSenseResponsive` | `task_footer` |
| **AnalyticsDashboard**| Mid Content | `AdSenseResponsive` | `analytics_mid` |
| **AnalyticsDashboard**| Right Sidebar | `AdSenseVertical` | `analytics_sidebar` |
| **AdminDashboardPage**| Mid Content | `AdSenseResponsive` | `admin_dashboard_mid` |
| **AdminDashboardPage**| Right Sidebar | `AdSenseVertical` | `admin_dashboard_sidebar` |

## Performance Considerations
- **Lazy Loading**: `AdSenseContainer` uses `IntersectionObserver` to defer pushing ads until they are within 200px of the viewport, reducing initial load weight.
- **Asynchronous Script**: The AdSense script in `index.html` is loaded with the `async` tag.
- **Cumulative Layout Shift (CLS)**: The `.ad-container` CSS class enforces minimum height reserves (`min-h-[90px]`, `min-h-[250px]`) to ensure the page layout does not jump unexpectedly when an ad resolves.

## Troubleshooting

### Ads Not Showing (Blank Space)
1. **Approval Pending**: New AdSense integrations can take up to 1 hour (sometimes a few days) for Google to approve the domain and start serving live ads.
2. **Localhost**: AdSense often restricts serving on `localhost` or non-whitelisted domains. Blank ads with a `data-ad-status="unfilled"` are normal in development.
3. **Ad Blocker**: Ensure your browser extensions (e.g., uBlock Origin, Brave) are disabled while testing.
4. **Console Errors**: Check for `adsbygoogle.push() error: No slot size for availableWidth`. This usually means a responsive ad is placed in a parent container without a defined width constraint. Ensure the parent container has `width: 100%` or similar.

### Layout Breaking
If an ad forces horizontal scrollbars on mobile:
- Ensure you are using `AdSenseResponsive` or `AdSenseContainer` rather than forcing a 728px horizontal ad into a narrow column.
- Check that the parent wrapper does not have `display: flex` without `overflow: hidden` or `min-width: 0`.

## Policy Compliance
When working with Google AdSense:
- Do NOT place ads near interactive elements (e.g., heavily clicked buttons) to avoid accidental clicks.
- Do NOT place more ads than content on a single screen.
- Ensure the `Advertisement` label remains visible above ad blocks for clear distinction. (Our `AdSenseContainer` handles this automatically).