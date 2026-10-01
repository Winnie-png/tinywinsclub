# TinyWins Portfolio Showcase

## Goal
Create a temporary, public `/portfolio-showcase` gallery for capturing five polished views of the existing TinyWins product. It will remain separate from authentication, payments, navigation, and real user data.

## What will be built
- A desktop-friendly gallery with five labeled, mobile-sized product frames:
  1. Main wins jar / daily wins
  2. Add a tiny win
  3. Badges & achievements
  4. Stats & progress
  5. Pro experience
- Each frame will use the existing TinyWins components and established screen styling, including `WinJar`, `MoodSelector`, `BadgeDisplay`, `StreakDisplay`, `WeeklyStats`, buttons, icons, typography, colors, and animation patterns.
- Showcase-only sample wins will populate the jar, badge, streak, and stats views.
- The Pro frame will use the existing Pro pricing presentation without initiating payment.
- Small understated labels will sit outside each frame for screenshot organization.

## Isolation and safety
- The route will be public and will not be added to normal navigation.
- Sample data will live only in the showcase module and will not read or write the database, authentication state, localStorage, or payment functions.
- Showcase controls will be visual or locally interactive only; they will not navigate into or mutate the real app.
- Existing routes and product behavior will remain unchanged except for registering the new standalone route.

## Presentation details
- Frames will use a consistent phone viewport, neutral outer gallery background, subtle framing, and enough spacing for clean desktop captures.
- The gallery will support both an overview grid and individually addressable frame sections through URL anchors for focused screenshots.
- Motion will respect reduced-motion settings and remain the same playful style already used by TinyWins.

## Verification
- Confirm the project builds without errors.
- Open `/portfolio-showcase` at desktop width and inspect all five populated frames.
- Verify no frame overflows, labels remain outside frames, and the gallery adapts cleanly at narrower widths.
- Confirm the route works while signed out and that no network requests write user or payment data.
