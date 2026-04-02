# Accessibility Guide

## Standards (WCAG 2.1 AA)

### Keyboard Navigation
- **Focus Indicators**: Ensure all interactive elements (buttons, inputs) have visible focus states (`ring-2`).
- **Tab Order**: Logical flow from top-left to bottom-right.
- **Sidebar**: Should support keyboard expansion/collapse.

### Visuals
- **Contrast**: Text must have a contrast ratio of at least 4.5:1 against background.
- **Scaling**: UI should not break when browser zoom is set to 200%.

### ARIA
- **Icons**: Decorative icons must have `aria-hidden="true"`.
- **Modals**: Must use `role="dialog"` and trap focus.
- **Status Messages**: Use `role="alert"` for error toasts.

## Testing
- Use **Lighthouse** audits in Chrome DevTools.
- Manually test with keyboard-only navigation.