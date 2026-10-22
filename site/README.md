# eatdick.nl: demand test

A static landing page for testing whether Dutch buyers want a premium novelty chocolate gift before anything is made.
The page looks like a real shop with real prices. Clicking **Bestel** opens an honest waitlist ("the first batch is coming"),
so no one is misled about stock and there's no fake "sold out".

## What the test measures

| Event (Plausible) | Fires when | Props |
| --- | --- | --- |
| `Bestelklik` | someone clicks Bestel on a product | `product`, `variant` |
| `Wachtlijst` | someone submits the waitlist form | `product`, `variant`, `gelegenheid`, `verzending` |
| `Gedeeld` | someone shares after signing up | `kanaal` |
| `Onthuld` | someone presses Laat zien to uncensor the product (once per session) | `variant` |
| `Nooit meer` | someone adds an address to the opt-out list | — |

Each submission also lands in Netlify Forms (`wachtlijst`), with the email, product, price variant, price, occasion and delivery choice.

### Prices

Every visitor sees the premium prices (`config.js`). The original A/B test against half prices was dropped on 22 Oct 2026.
Events still carry `variant: b`, so the data stays comparable if the test comes back (see the comment in `config.js`).

| Product | Price |
| --- | --- |
| De D | € 33,95 |
| Mini D's | € 25,95 |
| Vrijgezellenpakket | € 99,95 |

### Censored by default

The product is shown pixelated until the visitor presses **Laat zien**, which uncensors every illustration on the page. The share image (`og.png`) stays pixelated.
`?onthul=1` opens the page uncensored, which is handy for a screen recording of the reveal.
The reveal rate (`Onthuld` / visitors) is a free extra signal of curiosity.

Pixelation lowers the risk on social platforms but doesn't remove it: automated moderation on Instagram and TikTok can still flag a pixelated phallic shape.
For posts, lead with the box, the letterbox and the reveal moment.

### Go / no-go (after at least 300 visitors, 3–4 weeks)

| Metric | Weak | OK | Strong |
| --- | --- | --- | --- |
| Visitors who click Bestel | < 3% | 3–8% | > 8% |
| Clickers who leave an email | < 25% | 25–50% | > 50% |
| Emails in total | < 100 | 100–300 | > 300 |

Decision rule: go ahead at 150 or more emails at premium prices.
Under 100 emails in total after 4 weeks: stop. In between, look at the click and email rates before deciding.

## Run locally

```sh
cd site && python3 -m http.server 8000
# open http://localhost:8000/
```

Form posts only work once the site is deployed on Netlify (or when `formEndpoint` points at another service).

## Deploy (about 15 minutes)

1. **Netlify:** New site → Import from GitHub → this repo, branch `main`. `netlify.toml` in the repo root sets the base directory to `site/` with no build command, so leave the build settings empty.
2. **Forms:** Netlify detects the `wachtlijst` and `nooit-meer` forms on the first deploy. Turn on email notifications under Site → Forms.
   Check the current free-tier submission limit. If you outgrow it, set `formEndpoint` in `config.js` to a Formspree/Brevo URL.
3. **Domain:** Site → Domain management → add `eatdick.nl`. Then point the DNS at Netlify; HTTPS is automatic.
4. **Analytics:** create the `eatdick.nl` site on [plausible.io](https://plausible.io). Under Site settings → Custom properties,
   add `product`, `variant`, `gelegenheid`, `verzending` and `kanaal`, then add the four events above as Goals.
   Plausible is cookieless, so you don't need a cookie banner.

## Before you send real traffic

- Replace `hallo@eatdick.nl` with a mailbox that works.
- Keep the 15% early-bird promise, or change it in `config.js`.
- Traffic: organic TikTok/Instagram (the box and the letterbox, never the product itself), bachelorette organisers, student associations,
  r/thenetherlands. Meta ads don't allow adult content, so don't count on paid social.

## Files

| File | What it is |
| --- | --- |
| `index.html` | the page, waitlist dialog, opt-out form, product illustrations |
| `styles.css` | all styles. Palette: blush `#FFE6F0`, pink `#FF5C9D`, chocolate `#2B150D`, brass `#C9973A`, door green `#1D4A3A` |
| `app.js` | prices, dialog, events, form submission, sharing |
| `config.js` | everything you might tweak for the test |
| `privacy.html` | privacy statement in plain Dutch |
| `fonts/` | self-hosted Bagel Fat One and Schibsted Grotesk (OFL). No calls to Google Fonts, which is better for GDPR |
| `og.png` | share image for WhatsApp and socials |
| `../netlify.toml` | Netlify config (base `site/`, security headers, font caching) |
