# eatdick.nl: project brief

Last updated: 22 October 2026. Owner: JP Bothma (GitHub: JP-Alchemy).

## What it is

A Dutch premium novelty chocolate gift. It's a chocolate penis ("De D") in a pink gift box that fits through the letterbox, sent anonymously or with your name.
It's modelled on [eatdick.ca](https://eatdick.ca/) (Vancouver, CA$15–18). JP owns the domain **eatdick.nl**.

**Positioning:** premium and playful, not a crude gag shop. Handmade from Belgian chocolate, with a gift box and card. The Dutch hook is the Sinterklaas chocolate letter: "Geef ze een D."

**Role in JP's life:** a mostly hands-off side income, not his main project. The time cap is 2–3 hours a week, with clear kill criteria (below).

## Status

| Item | Status |
| --- | --- |
| Market research + cost model | Done. Report: https://claude.ai/artifact/8w7p657F7L6SMp5U9QwtBb |
| Demand-test website | Built (static HTML/CSS/JS), in `site/` |
| GitHub repo | Done (22 Oct 2026): `JP-Alchemy/eatdick-nl`, branch `main`, with the original commit history |
| Deploy | **To do:** Netlify + eatdick.nl DNS + Plausible (steps in `site/README.md`) |
| Traffic + test run | Not started. Window: Nov–Dec 2026 (Sinterklaas season) |
| Decision | Early January 2027, then launch for Valentine's Day 2027 if it's a go |

## Decisions made

1. **Fake-door test with honest wording.** Real-looking shop and prices. "Bestel" opens a waitlist ("De eerste batch komt eraan").
   **No fake "sold out"**, because the ACM treats false scarcity as misleading ([NOS](https://nos.nl/l/2313059), [ACM vs SHEIN](https://www.acm.nl/nl/publicaties/acm-en-europese-consumententoezichthouders-shein-moet-website-aanpassen)).
   A top bar says "Nog niet te koop".
2. **Premium prices only:** €33,95 / €25,95 / €99,95. The A/B test against half prices (€16,95 / €12,95 / €49,95) was dropped on 22 Oct 2026, which means the test can no longer show whether the lower price would sell more. Events still log `variant: b`; `config.js` explains how to bring variant a back.
3. **Show the real shape, pixelated by default.** A "Laat zien" button reveals it. The share image stays pixelated. The art is a veiny chocolate cartoon, never a photo.
   `?onthul=1` opens the page uncensored (for screen recordings).
4. **Outsource production.** A chocolatier pours and ideally packs. A fulfilment partner ships. No hardware packing automation, since volume is far too low.
5. **Harassment is handled in the product:** "from me" as default for launch, sender details kept, a "nooit-meer-lijst" address opt-out, 18+ only, and an abuse policy ("Anoniem, maar niet gemeen").
   The seller stays legally responsible; outsourcing complaint handling doesn't change that.
6. **Privacy-friendly stack:** Plausible (cookieless, EU, no cookie banner), self-hosted fonts (no Google Fonts), Netlify Forms.

## Key numbers (from `cost_model.py`)

| Setup | Avg order | Margin / order | Break-even (orders/yr) | Profit at 750 | Profit at 1,500 |
| --- | --- | --- | --- | --- | --- |
| Original prices, make it yourself | €24,60 | €9,48 | 372 | €3.6k | €10.7k |
| Original prices, chocolatier | €24,60 | €4,98 | 709 | €0.2k | €3.9k |
| **Premium prices, chocolatier + fulfilment** | **€49,25** | **€25,64** | **138** | **€15.7k** | **€34.9k** |

Profit is year one, after €1,135 startup and €2,392/yr fixed costs, before income tax and own time.
Seasonality: February ~16% of orders, November 13%, December 17%.
**Not yet verified:** chocolatier cost (€2/piece assumed), fulfilment cost (€1,50/order assumed), and all order volumes. Volumes are what the test is for.

**Sourced costs:** PostNL letterbox parcel €3,74 (<500/yr) and €3,57 (500–1,000); Mollie iDEAL €0,29; KvK €85,15; Shopify Basic €24/month annually; Callebaut milk ~€22/kg; 9% VAT on food.

## Market (Netherlands)

| Segment | Signal | Timing | Fit |
| --- | --- | --- | --- |
| Bachelor/bachelorette parties | 70,141 weddings + 27,968 partnerships in 2025 (CBS). Pimpgips.nl sells "thousands a month" of plaster penises for these parties | May–Sep | Strongest, group purchase |
| Sinterklaas surprises | 52% celebrate, average planned spend €134, half draw lots (lootjestrekken.nl 2025) | mid-Nov–5 Dec | Strong, anonymous teasing is tradition |
| Valentine's Day (ironic) | 20% definitely + 7% probably celebrate (Hart van Nederland 2025) | 1–14 Feb | Medium |
| Abraham/Sarah, 30/40 birthdays | Year-round | — | Medium |

There's no Dutch-language brand in this niche. An Australian seller ships "Eat a Dick" boxes to Europe via eBay for about €17.

## Go / no-go for the demand test

After at least 300 visitors (3–4 weeks):

| Metric | Weak | OK | Strong |
| --- | --- | --- | --- |
| Visitors who click Bestel | < 3% | 3–8% | > 8% |
| Clickers who leave an email | < 25% | 25–50% | > 50% |
| Emails total | < 100 | 100–300 | > 300 |

- **Go:** at least 150 emails at premium prices. Between 100 and 150, look at the click and email rates before deciding.
- **Stop:** under 100 emails total after 4 weeks. Then sell the domain or let it rest. No KvK, moulds or NVWA paperwork until real demand shows.
- Only about 3% of waitlist signups typically convert within a week, so 300 emails might mean only 10–30 first orders.

## Risks

- **Getting customers is the bottleneck.** Meta ads ban adult content. Growth has to come from organic TikTok/Instagram (the box, the letterbox, the reveal), bachelorette organisers, student associations, Reddit and press.
  Pixelation reduces the risk of posts being flagged but doesn't remove it.
- **Payment provider policy.** Check that Mollie or Shopify Payments accepts a novelty adult-humour product. Not verified.
- **Summer heat.** The page promises no shipping during heatwaves, so insulated packaging is needed.
- **Novelty fades and copying is easy.** Plan new designs and occasions for year two.
- **Food rules.** Register with the NVWA (via the chocolatier where possible), label allergens (peanut flavour), follow a hygiene code.

## Next steps

- [x] Create the private repo `JP-Alchemy/eatdick-nl` and push the code
- [ ] Deploy on Netlify, point eatdick.nl DNS, set up Plausible goals + custom properties
- [ ] Replace `hallo@eatdick.nl` with a working mailbox
- [ ] Shoot 3–5 short videos: box through the letterbox, the reveal, a bachelorette unboxing (mock-up)
- [ ] Post organically, aiming for ≥300 visitors by mid-December
- [ ] Meanwhile, get quotes from 2–3 Dutch/Belgian chocolatiers (custom mould, cost per piece, packing) and one fulfilment partner
- [ ] Check Mollie/Shopify Payments policy on novelty adult products
- [ ] Early January: go/no-go decision using the table above

## Brand tokens

| Token | Value |
| --- | --- |
| Blush (page) | `#FFE6F0` |
| Pink (box, brand) | `#FF5C9D` |
| Pink soft | `#FFD3E4` |
| Chocolate (text, buttons) | `#2B150D` |
| Cocoa (secondary text) | `#6B3A24` |
| Brass (details) | `#C9973A` |
| Door green (accent sections) | `#1D4A3A` |
| Display font | Bagel Fat One (OFL, self-hosted) |
| Text font | Schibsted Grotesk 400/500/700 (OFL, self-hosted) |
| Hero device | Green Dutch front door, brass "BRIEVEN" letterbox, the box drops through on load |
| Tone | Dutch, direct, warm, self-aware. Short sentences. Jokes in the copy, never mean |

## Sources

- [eatdick.ca](https://eatdick.ca/)
- [CBS: weddings and partnerships 2025](https://www.cbs.nl/nl-nl/cijfers/detail/37772ned?dl=46E78)
- [lootjestrekken.nl: Sinterklaas survey 2025](https://static-cdn.drawnames.com/Content/Press/20251113-NL-Persbericht-Feestdagenonderzoek.pdf)
- [Hart van Nederland: Valentine's Day 2025](https://www.hartvannederland.nl/het-beste-van-hart/panel/artikelen/populairste-manieren-valentijnsdag-valentijn-2025)
- [Omroep Brabant: Pimpgips.nl](https://www.omroepbrabant.nl/nieuws/4225061/gipsen-doe-het-zelf-piemels-van-martijn-en-jolanda-vinden-gretig-aftrek)
- [PostNL business rates 2026](https://www.postnl.nl/zakelijk/tarieven/)
- [Meta ad policy: adult content](https://transparency.meta.com/ja-jp/policies/ad-standards/objectionable-content/adult-content)
- [Rijksoverheid: Wet seksuele misdrijven](https://www.rijksoverheid.nl/actueel/nieuws/2024/03/20/nieuwe-wet-aanpak-seksuele-misdrijven-gaat-in-per-1-juli-2024)
- [KVK: trust signals for webshops](https://www.kvk.nl/veilig-zakendoen/kijk-mijn-webshop-deugt/)
- [SIDN: trust and .nl](https://www.sidn.nl/en/news-and-blogs/trust-is-good-for-turnover-and-margins)
- [Creative Review: Tony's Chocolonely branding](https://www.creativereview.co.uk/tonys-chocolonely-branding-chocolate/)
