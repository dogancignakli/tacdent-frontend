# SEO Measurement Baseline

Record these values at deploy and review monthly. Search Console is already verified with sitemap submitted.

## Search Console queries to track

| Query cluster | Example | Month 1 impressions | Month 1 avg position | Month 1 clicks |
|---------------|---------|--------------------|-----------------------|----------------|
| Brand | tugce aydin cignakli, dt tuğçe | | | |
| Dalaman local | dalaman diş hekimi | | | |
| Muğla regional | muğla diş hekimi | | | |
| Nearby towns | ortaca diş hekimi, göcek diş hekimi | | | |
| Treatment | fethiye diş implantı, dalaman implant | | | |

## GA4 conversion events (site)

Configured in code (`src/lib/analytics.ts`):

| Event | When fired | Mark as conversion in GA4 |
|-------|------------|---------------------------|
| `phone_click` | User taps a tracked phone link (footer, contact) | Yes |
| `appointment_start` | Appointments page loads | Optional |
| `appointment_submit` | Appointment form submitted successfully | Yes |

Events only fire when `gtag` is available (after Cookiebot **statistics** consent).

### GA4 admin steps

1. Admin → Data display → Events → wait for events to appear after real traffic
2. Toggle **Mark as conversion** for `phone_click` and `appointment_submit`
3. Optional: create exploration report “Local conversions” with these events + page path

## Schema validation (after each SEO deploy)

1. [Rich Results Test](https://search.google.com/test/rich-results) — home page URL
2. [Schema Markup Validator](https://validator.schema.org/) — paste rendered JSON-LD from page source
3. Confirm `@graph` contains `WebSite`, `Dentist`, `Person` on layout
4. Confirm service detail pages include `Service` + `BreadcrumbList`

## Performance

Run [PageSpeed Insights](https://pagespeed.web.dev/) on:

- `https://tugceaydincignakli.com/tr` (home)
- `https://tugceaydincignakli.com/tr/appointments` (conversion page)

Target: no regression in LCP after analytics/schema changes.

## 8–12 week focus

- **Primary:** Dalaman + brand queries
- **Secondary:** treatment-specific (implant, whitening) with service detail pages indexed
- **Tertiary:** Ortaca/Göcek/Fethiye — only expand content if Search Console shows impressions but low CTR/position AND patients actually travel from those areas
