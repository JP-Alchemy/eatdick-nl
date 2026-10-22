/* eat dick — demand test logic
 * 1. assigns a price variant (a/b) per session and renders prices
 * 2. opens the waitlist dialog when someone clicks "Bestel"
 * 3. records events in Plausible and submits forms (Netlify Forms or a custom endpoint)
 */
(function () {
  "use strict";

  var cfg = window.EATDICK_CONFIG || {};
  var PRODUCTS = {
    single: "De D",
    mini: "Mini D's",
    party: "Het vrijgezellenpakket",
  };

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function euro(n) {
    return "€ " + n.toFixed(2).replace(".", ",");
  }

  function safeGet(store, key) {
    try { return store.getItem(key); } catch (e) { return null; }
  }
  function safeSet(store, key, value) {
    try { store.setItem(key, value); } catch (e) { /* private mode etc. */ }
  }

  /* ---------- analytics ---------- */
  window.plausible = window.plausible || function () {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };
  if (cfg.plausibleDomain) {
    var s = document.createElement("script");
    s.defer = true;
    s.dataset.domain = cfg.plausibleDomain;
    s.src = "https://plausible.io/js/script.js";
    document.head.appendChild(s);
  }
  function track(name, props) {
    try { window.plausible(name, { props: props }); } catch (e) { /* ignore */ }
  }

  /* ---------- price variant ---------- */
  var variants = cfg.variants || { b: { single: 33.95, mini: 25.95, party: 99.95 } };
  var params = new URLSearchParams(window.location.search);
  var forced = (params.get("prijs") || "").toLowerCase();
  var variant = variants[forced] ? forced : safeGet(window.sessionStorage, "ed-variant");
  if (!variants[variant]) {
    variant = Math.random() < (cfg.variantBShare == null ? 0.5 : cfg.variantBShare) && variants.b ? "b" : "a";
  }
  safeSet(window.sessionStorage, "ed-variant", variant);
  var prices = variants[variant];
  document.documentElement.dataset.variant = variant;

  $all("[data-price]").forEach(function (el) {
    var key = el.getAttribute("data-price");
    if (prices[key] != null) el.textContent = euro(prices[key]);
  });
  $all("[data-price-pp]").forEach(function (el) {
    var key = el.getAttribute("data-price-pp");
    if (prices[key] != null) el.textContent = euro(prices[key] / 6);
  });
  if (cfg.launchLabel) $all("[data-launch]").forEach(function (el) { el.textContent = cfg.launchLabel; });
  if (cfg.earlyBirdDiscount) $all("[data-discount]").forEach(function (el) { el.textContent = cfg.earlyBirdDiscount; });

  /* ---------- censor / reveal ---------- */
  var revealButtons = $all("[data-reveal]");
  var revealedOnce = false;
  function setRevealed(on) {
    document.documentElement.classList.toggle("uncensored", on);
    revealButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.textContent = on ? "Pixels terug" : "Laat zien";
    });
    if (on && !revealedOnce) {
      revealedOnce = true;
      track("Onthuld", { variant: variant });
    }
  }
  revealButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      setRevealed(!document.documentElement.classList.contains("uncensored"));
    });
  });
  if (params.get("onthul") === "1") setRevealed(true);

  /* ---------- form submission ---------- */
  function encode(data) {
    return Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    }).join("&");
  }

  function formData(form) {
    var out = {};
    new FormData(form).forEach(function (value, key) { out[key] = value; });
    return out;
  }

  function submit(form) {
    var data = formData(form);
    if (data["bot-field"]) return Promise.resolve(); // honeypot tripped: pretend success
    if (!cfg.formEndpoint || cfg.formEndpoint === "netlify") {
      return fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(data),
      }).then(function (r) { if (!r.ok) throw new Error(r.status); });
    }
    return fetch(cfg.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    }).then(function (r) { if (!r.ok) throw new Error(r.status); });
  }

  function setStatus(form, text, isError) {
    var el = $(".form-status", form);
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("is-error", !!isError);
  }

  /* ---------- order dialog ---------- */
  var dialog = $("#order");
  var form = $("[data-form='waitlist']");
  var stepForm = $("[data-step='form']", form);
  var stepDone = $("[data-step='done']", form);
  var lastTrigger = null;

  function openOrder(product, trigger) {
    lastTrigger = trigger || null;
    form.reset();
    stepForm.hidden = false;
    stepDone.hidden = true;
    setStatus(form, "");
    form.elements.product.value = product;
    form.elements.variant.value = variant;
    form.elements.prijs.value = prices[product].toFixed(2);
    $("[data-summary-name]", form).textContent = PRODUCTS[product];
    $("[data-summary-price]", form).textContent = euro(prices[product]);

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    track("Bestelklik", { product: product, variant: variant });
  }

  function closeOrder() {
    if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open");
  }

  dialog.addEventListener("close", function () {
    if (lastTrigger) lastTrigger.focus();
  });
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) closeOrder(); // click on backdrop
  });
  $all("[data-close]", dialog).forEach(function (b) { b.addEventListener("click", closeOrder); });

  $all("[data-order]").forEach(function (btn) {
    btn.addEventListener("click", function () { openOrder(btn.getAttribute("data-order"), btn); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var button = $("button[type='submit']", form);
    button.disabled = true;
    setStatus(form, "Even geduld…");
    var data = formData(form);
    submit(form).then(function () {
      track("Wachtlijst", {
        product: data.product,
        variant: variant,
        gelegenheid: data.gelegenheid,
        verzending: data.verzending,
      });
      stepForm.hidden = true;
      stepDone.hidden = false;
      $("[data-done-title]", form).focus();
    }).catch(function () {
      setStatus(form, "Dat lukte niet. Controleer je internet en probeer het opnieuw.", true);
    }).then(function () {
      button.disabled = false;
    });
  });

  /* ---------- sharing ---------- */
  var shareUrl = window.location.origin + window.location.pathname;
  var shareText = "Ik weet wie er een D verdient: " + shareUrl;
  var wa = $("[data-share-whatsapp]");
  if (wa) {
    wa.href = "https://wa.me/?text=" + encodeURIComponent(shareText);
    wa.addEventListener("click", function () { track("Gedeeld", { kanaal: "whatsapp" }); });
  }
  var copyBtn = $("[data-share-copy]");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var done = function () { copyBtn.textContent = "Link gekopieerd"; };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(done, function () { copyBtn.textContent = shareUrl; });
      } else {
        copyBtn.textContent = shareUrl;
      }
      track("Gedeeld", { kanaal: "link" });
    });
  }

  /* ---------- opt-out ("nooit-meer-lijst") ---------- */
  var optout = $("[data-form='optout']");
  if (optout) {
    optout.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!optout.reportValidity()) return;
      var button = $("button[type='submit']", optout);
      button.disabled = true;
      submit(optout).then(function () {
        optout.reset();
        setStatus(optout, "Staat erop. Naar dit adres sturen we niets meer.");
        track("Nooit meer", {});
      }).catch(function () {
        setStatus(optout, "Dat lukte niet. Probeer het opnieuw of mail hallo@eatdick.nl.", true);
      }).then(function () {
        button.disabled = false;
      });
    });
  }
})();
