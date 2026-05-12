<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent Next.js App Router project. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new file): Initializes PostHog client-side using the `instrumentation-client` pattern for Next.js 15.3+. Configures a reverse proxy via `/ingest`, enables exception capture, and enables debug mode in development.
- **`next.config.ts`**: Added `rewrites` to proxy PostHog requests through `/ingest` (both static assets and ingestion), and set `skipTrailingSlashRedirect: true` to support PostHog's trailing-slash API calls.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`components/ExploreBtn.tsx`**: Added `"use client"` directive, imported `posthog-js`, and added `posthog.capture("explore_events_clicked")` to the button's `onClick` handler.
- **`components/EventCard.tsx`**: Added `"use client"` directive, imported `posthog-js`, and added `posthog.capture("event_card_clicked", { event_title, event_slug, event_location, event_date })` to the card's `onClick` handler.
- **`components/NavBar.tsx`**: Added `"use client"` directive, imported `posthog-js`, and added `posthog.capture("nav_link_clicked", { label })` to each navigation link's `onClick` handler.

## Events

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the 'Explore Events' button on the homepage hero section | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to view event details — top of conversion funnel | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicked a navigation link in the site header | `components/NavBar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1572725)
- [Explore Events Clicks Over Time](/insights/gB5ScEYN)
- [Event Card Clicks Over Time](/insights/DRxZN0Ec)
- [Nav Link Clicks by Label](/insights/nzvAmYpg)
- [Homepage to Event Detail Conversion Funnel](/insights/90JUmY5n)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
