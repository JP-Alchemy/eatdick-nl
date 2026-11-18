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

Each submission is also emailed to you by Web3Forms (subject `Wachtlijst eatdick.nl`), with the email, product, price variant, price, occasion and delivery choice.
Opt-outs arrive with the subject `Nooit-meer-lijst eatdick.nl`. Your mailbox is the list: filter both subjects into their own folders.

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

Forms post to Web3Forms from localhost too, as soon as `web3formsKey` is set in `config.js`. Each test submission counts towards the free 250 a month.

## Deploy (about 20 minutes)

Hosting is GitHub Pages, deployed by `.github/workflows/pages.yml` on every push to `main` that touches `site/`.
Forms go to [Web3Forms](https://web3forms.com) (free: 250 submissions a month).

1. **Pages access:** the repo is private, so Pages needs GitHub Pro on your account. Then Settings → Pages → Build and deployment → Source: **GitHub Actions**.
2. **Deploy:** push to `main` (or Actions → "Deploy site to GitHub Pages" → Run workflow). The site appears at `https://jp-alchemy.github.io/eatdick-nl/`.
3. **Domain:** Settings → Pages → Custom domain: `eatdick.nl` → Save. Point DNS at GitHub (records below), wait for the DNS check to go green, then tick **Enforce HTTPS**.
   With an Actions deploy, GitHub ignores `site/CNAME`; the setting is what counts. The file is there as a record.
4. **Forms:** on web3forms.com, enter the mailbox that should receive signups and confirm the access key it emails you.
   Paste the key into `web3formsKey` in `config.js` and push. In the Web3Forms dashboard, set the form's data retention to **7 days** (the privacy page promises that).
   Send one test signup and one test opt-out, then delete them from your mailbox.
5. **Analytics:** create the `eatdick.nl` site on [plausible.io](https://plausible.io). If it gives you a per-site script (`pa-XXXX.js`), paste that URL into `plausibleScript` in `config.js`.
   Under Site settings → Custom properties, add `product`, `variant`, `gelegenheid`, `verzending` and `kanaal`, then add the five events above as Goals.
   Plausible is cookieless, so you don't need a cookie banner.

### DNS at Namecheap (Advanced DNS)

Delete the old records first: the URL Redirect on `@`, the `A @ 75.2.60.5` (Netlify) and the `CNAME www` to Netlify. Then add:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | jp-alchemy.github.io. |

GitHub redirects `www.eatdick.nl` to `eatdick.nl` once both resolve. Check with `dig +short eatdick.nl` and `dig +short www.eatdick.nl`.
Optional, against domain takeover: verify `eatdick.nl` under your GitHub profile → Settings → Pages (it gives you a TXT record to add).

### What Pages can't do

GitHub Pages doesn't let you set response headers, so the old Netlify security headers are gone. The referrer policy is set with a `<meta>` tag instead.
Fonts get GitHub's default 10-minute cache, which is fine at this traffic.
GitHub's terms say Pages isn't meant for running an online business. A waitlist page is fine; the real shop (checkout, payments) goes elsewhere if this is a go.

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
| `app.js` | prices, dialog, events, form submission (Web3Forms), sharing |
| `config.js` | everything you might tweak for the test |
| `privacy.html` | privacy statement in plain Dutch |
| `fonts/` | self-hosted Bagel Fat One and Schibsted Grotesk (OFL). No calls to Google Fonts, which is better for GDPR |
| `og.png` | share image for WhatsApp and socials |
| `CNAME` | custom domain record for GitHub Pages |
| `.nojekyll` | tells Pages to serve the files as they are |
| `../.github/workflows/pages.yml` | deploys `site/` to GitHub Pages |
