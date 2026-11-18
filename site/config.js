/*
 * eatdick.nl — test configuration.
 * Everything you might want to change for the demand test lives here.
 */
window.EATDICK_CONFIG = {
  // Plausible Analytics (cookieless, EU-hosted). Leave both empty to disable.
  // New Plausible sites get a per-site script: paste its URL from
  // Site settings -> Site installation (https://plausible.io/js/pa-XXXX.js).
  // If plausibleScript is empty, the classic script.js + plausibleDomain is used.
  plausibleScript: "",
  plausibleDomain: "eatdick.nl",

  // Form capture: Web3Forms (https://web3forms.com). Submissions are emailed
  // to the address the access key belongs to. The key is public by design
  // (it can only send mail to you), so it is fine to commit it here.
  // Leave web3formsKey empty and set formEndpoint to any URL that accepts a
  // JSON POST (a Cloudflare Worker, Formspree, ...) to use something else.
  web3formsKey: "",
  formEndpoint: "https://api.web3forms.com/submit",

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
