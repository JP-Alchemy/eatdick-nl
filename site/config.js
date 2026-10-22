/*
 * eatdick.nl — test configuration.
 * Everything you might want to change for the demand test lives here.
 */
window.EATDICK_CONFIG = {
  // Plausible Analytics (cookieless, EU-hosted). Leave empty to disable.
  plausibleDomain: "eatdick.nl",

  // Where waitlist + opt-out submissions go.
  //  "netlify"  -> Netlify Forms (zero setup when hosted on Netlify)
  //  any URL    -> POSTs JSON to that endpoint (Formspree, a Worker, etc.)
  formEndpoint: "netlify",

  // When the first batch ships, as shown on the page.
  launchLabel: "Valentijnsdag 2027",

  // Early-bird discount promised to people on the list (keep this promise!).
  earlyBirdDiscount: 15,

  // Prices. Only the premium (doubled) prices are live; the A/B test was
  // dropped on 22 Oct 2026. Kept as variant "b" so analytics stay comparable.
  // To bring the test back, add a: { single: 16.95, mini: 12.95, party: 49.95 }
  // and set variantBShare to 0.5.
  variants: {
    b: { single: 33.95, mini: 25.95, party: 99.95 },
  },
  // Share of visitors that get variant "b" (0–1).
  variantBShare: 1,
};
