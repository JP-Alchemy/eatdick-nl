"""eatdick.nl cost model and 12-month projection (Feb 2027 - Jan 2028). All amounts in EUR.

Run:  python3 cost_model.py
Edit the ASSUMPTIONS block to try other prices, costs or volumes.
"""

# ---------------- ASSUMPTIONS ----------------
VAT = 0.09                 # chocolate = food, Dutch low VAT rate
PAY_FEE = 0.35             # per order, blend of iDEAL (Mollie EUR 0.29) and cards
DAMAGE_RESERVE = 0.02      # share of net revenue for melted / broken / lost parcels
OUTSOURCE_PER_PIECE = 2.00 # chocolatier labour per piece (ASSUMPTION - get quotes)
FULFILMENT_PER_ORDER = 1.50  # pick/pack partner per order (ASSUMPTION - get quotes)

# price incl. VAT and shipping; costs per order
SKUS = {
    "single": dict(name="De D (letterbox)",        price_a=16.95, price_b=33.95, pieces=1,
                   choc=2.40, flavour=0.40, pack=1.20, ship=3.74, mix=0.60),
    "mini":   dict(name="Mini D's (letterbox)",    price_a=12.95, price_b=25.95, pieces=1,
                   choc=1.80, flavour=0.20, pack=0.90, ship=3.74, mix=0.15),
    "party":  dict(name="Vrijgezellenpakket x6",   price_a=49.95, price_b=99.95, pieces=6,
                   choc=14.40, flavour=1.80, pack=3.00, ship=7.40, mix=0.25),
}
# PostNL Brievenbuspakje+ standaard: 3.74 (<500/yr), 3.57 (500-1000); parcel ~7.40 at low volume

STARTUP = {
    "KvK registration": 85.15,
    "Moulds, 2 designs": 300,
    "Branding, photos, packaging design": 400,
    "Packaging stock and samples": 250,
    "Allergen labels, food-safety prep": 100,
}
MONTHLY_FIXED = {"Shopify Basic (annual)": 24, "Insurance": 20, "Bookkeeping app": 12, "Tools": 10}
MARKETING_PER_PUSH = 400
MARKETING_MONTHS = ("Jan", "Apr", "Sep", "Oct")

MONTHS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"]
SEASONALITY = [0.16, 0.04, 0.05, 0.07, 0.08, 0.07, 0.07, 0.07, 0.05, 0.13, 0.17, 0.04]  # Valentine, weddings, Sint/Xmas
assert abs(sum(SEASONALITY) - 1) < 1e-9


# ---------------- MODEL ----------------
def unit(sku, price_set="a", outsourced=False, fulfilment=False):
    s = SKUS[sku]
    net = s["price_" + price_set] / (1 + VAT)
    labour = OUTSOURCE_PER_PIECE * s["pieces"] if outsourced else 0
    var = (s["choc"] + s["flavour"] + s["pack"] + labour + s["ship"] + PAY_FEE
           + DAMAGE_RESERVE * net + (FULFILMENT_PER_ORDER if fulfilment else 0))
    return dict(net=net, var=var, margin=net - var)


def blended(**kw):
    tot = {"gross": 0, "net": 0, "var": 0}
    for k, s in SKUS.items():
        u = unit(k, **kw)
        tot["gross"] += s["mix"] * s["price_" + kw.get("price_set", "a")]
        tot["net"] += s["mix"] * u["net"]
        tot["var"] += s["mix"] * u["var"]
    tot["margin"] = tot["net"] - tot["var"]
    return tot


def fixed_year():
    return 12 * sum(MONTHLY_FIXED.values()) + MARKETING_PER_PUSH * len(MARKETING_MONTHS)


def year_profit(orders, **kw):
    """First-year profit after startup costs, before income tax and own time."""
    return orders * blended(**kw)["margin"] - fixed_year() - sum(STARTUP.values())


def monthly(orders, **kw):
    b = blended(**kw)
    cum = -sum(STARTUP.values())
    rows = []
    for m, w in zip(MONTHS, SEASONALITY):
        o = orders * w
        fixed = sum(MONTHLY_FIXED.values()) + (MARKETING_PER_PUSH if m in MARKETING_MONTHS else 0)
        cum += o * b["margin"] - fixed
        rows.append((m, round(o), round(cum)))
    return rows


if __name__ == "__main__":
    setups = {
        "A  original prices, DIY":                     dict(price_set="a"),
        "A  original prices, chocolatier":             dict(price_set="a", outsourced=True),
        "B  premium prices, chocolatier + fulfilment": dict(price_set="b", outsourced=True, fulfilment=True),
    }
    startup_and_fixed = sum(STARTUP.values()) + fixed_year()
    print(f"Startup EUR {sum(STARTUP.values()):,.0f}, fixed per year EUR {fixed_year():,.0f}\n")
    for label, kw in setups.items():
        b = blended(**kw)
        print(f"{label}: avg order EUR {b['gross']:.2f}, margin/order EUR {b['margin']:.2f}, "
              f"break-even {startup_and_fixed / b['margin']:.0f} orders/yr")
        for n in (200, 400, 750, 1500, 5000):
            print(f"    {n:>5} orders -> year-one profit EUR {year_profit(n, **kw):>9,.0f}")
    print("\nMonthly cumulative, base case (1,500 orders, original prices, DIY):")
    for m, o, c in monthly(1500, price_set="a"):
        print(f"  {m}: {o:>4} orders, cumulative EUR {c:>7,}")
