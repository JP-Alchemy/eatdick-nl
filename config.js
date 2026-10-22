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

  // Price test. Each visitor gets one variant for their session.
  // Force a variant with ?prijs=a or ?prijs=b (handy for targeted links).
  variants: {
    a: { single: 16.95, mini: 12.95, party: 49.95 },
    b: { single: 33.95, mini: 25.95, party: 99.95 },
  },
  // Share of visitors that get variant "b" (0–1).
  variantBShare: 0.5,
};
