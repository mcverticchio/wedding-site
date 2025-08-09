# Accessibility Checklist (WCAG 2.2 AA)

This checklist covers the key accessibility requirements implemented in the site and what to verify during content updates.

## Page Structure and Semantics
- Each page has exactly one H1, followed by logical H2 sections.
- Landmarks present: header, nav, main, footer.
- Skip link provided to jump to #main.
- Lists (ul/ol) and tables use proper semantic elements.
- Decorative images use empty alt=""; informative images have descriptive alt.

## Keyboard and Focus
- All interactive elements (links, buttons, inputs) are reachable via keyboard.
- Visible focus indicators using :focus-visible; outlines are not removed.
- Off-canvas/mobile menu is operable with keyboard, has proper aria-expanded and closes with Escape.
- Skip link appears on focus.
- Modal-like elements (menus/accordions) update aria attributes correctly.

## Color and Contrast
- Text meets WCAG AA contrast against backgrounds (body text at least 4.5:1).
- Links and buttons maintain sufficient contrast in normal and hover states.
- Never use color alone to convey meaning; pair with text or icons.

## Images and Media
- Provide alt text for images conveying information. Keep it concise and contextual.
- For purely decorative images, use empty alt="" or CSS background.
- Use <picture> with AVIF/WebP where possible for performance (no accessibility change).

## Forms
- Labels explicitly associated with inputs via for/id.
- Required fields indicated in label or with instructions; error messages are programmatically associated.
- Error and status messages use role="alert" or aria-live="polite" where appropriate.
- Input purpose attributes added when possible (autocomplete="email", "tel", etc.).
- Provide helpful inline hints using .help text.
- Include a honeypot for basic spam protection; rport stronger CAPTCHAs if needed.

## Motion and Preferences
- Reduce/transitions for users with prefers-reduced-motion: reduce.
- Avoid auto-playing, flashing, or rapidly moving content.

## Navigation and Structure
- Sticky header does not overlap skip link target; ensure target can receive focus.
- Nav items use aria-current="page" on the active page link.
- Accordions use aria-expanded and aria-controls; panels use aria-hidden and are tied via aria-labelledby.

## Timing and Feedback
- Buttons provide clear labels. Long-running actions show status text with aria-live.
- On successful RSVP submission, show confirmation and maintain focus management (optionally focus the success box).

## Language and Readability
- <html lang="en"> set globally.
- Write clear, concise copy; avoid jargon; expand abbreviations at first use where helpful.

## Testing
- Keyboard-only run-through of all pages.
- Screen reader sanity check (VoiceOver, NVDA, or JAWS).
- Automated checks (Lighthouse/axe) — address reported issues.
- Color contrast test on custom images and overlays.

## Content Edits Safeguards
- When updating text in /data JSON, preserve semantic roles and ARIA attributes in HTML.
- Ensure any added images include alt and correct dimensions to reduce layout shift.
- If adding new interactive components, follow WAI-ARIA Authoring Practices.
