# Pourr owner setup

Pourr has no servers to run. It is a static site: files go straight from one phone to the other, so a million users cost the same to host as one.

## Hosting

GitHub Pages serves the app from its global CDN for free. Users download about 17 KB (compressed) on the first visit; after that the app is cached on the phone and opens instantly, even with no internet.

When you change any file, bump `VERSION` in `sw.js` so phones pick up the update.

## Analytics with Google Analytics 4

1. Go to **analytics.google.com**, create an account and a **Web** data stream for your site's address.
2. Done for Measurement ID `G-RQ5PJ9RTX8`: Google's tag is in the `<head>` of `index.html`, and `gaId` is set to match. On transfer screens the security policy blocks gtag.js, so nothing is sent from them.

You'll see visitors, countries, devices and traffic sources, plus these Pourr events:

| Event | When | Details sent |
|---|---|---|
| `role_select` | Someone picks Jug or Container | role |
| `paired` | Two phones connect | role, route (same network / via internet) |
| `pour_complete` | A pour finishes | files, MB, seconds, MB/s, damaged |
| `receive_complete` | Files arrive | files, MB, seconds, damaged |
| `save` | Files are saved | method, files |
| `hotspot_help` | Networks block a direct connection | role |

File names and contents are never sent. Transfer screens run no analytics code: their events are held on the phone and sent when the user returns to the home screen, so a few may be lost if someone closes the app mid-transfer.

## Ads with Google AdSense

AdSense needs a domain you own, so use a custom domain instead of `github.io`.

1. **Buy a domain** such as `pourr.app` or `pourr.in` from any registrar.
2. **Point it at GitHub Pages:** in the repo, **Settings → Pages → Custom domain**, enter the domain and follow the DNS steps shown. Tick **Enforce HTTPS**.
3. **Apply for AdSense** at **adsense.google.com** (you must be 18 or older) and add your domain.
4. Done for publisher `ca-pub-8906312854927768`: the AdSense verification tag is in the `<head>` of `index.html`, and `ads.txt` is at the site root. On transfer screens the browser may fetch that script, but the security policy blocks it from running.
5. After approval, create two **Display ad units** (responsive) and set them in `index.html`:

```js
adClient: 'ca-pub-1234567890123456',
adSlots: { home: '1111111111', afterPour: '2222222222' },
```

Both ads appear on the home screen only: `afterPour` sits in the summary card shown when someone returns from a pour. Transfer screens never load ad code, for two reasons. Ad scripts could otherwise read files held in the page, and tilting a phone near an ad causes accidental taps, which AdSense treats as a policy violation. The privacy policy AdSense requires is in [`privacy.html`](privacy.html). For visitors in Europe and the UK, turn on Google's consent message in **AdSense → Privacy & messaging**.

## Security built in

- Files are encrypted in transit and checked with a SHA-256 fingerprint on arrival; damaged or altered files are rejected.
- Both phones show a matching 4-digit safety code after pairing.
- Transfer screens run under a strict Content-Security-Policy: only Pourr's own code runs and nothing can be uploaded anywhere.
- Right-click and the usual inspect shortcuts are blocked. This deters casual copying only; the code is public on GitHub and any developer can still read it.
- Turn on two-factor authentication for the GitHub account, since whoever can push to the repo controls the app.

## Native apps (next step)

Android and iPhone apps can use Wi-Fi Direct (Android) and peer-to-peer Wi-Fi (iPhone) to create the phone-to-phone link automatically, with no hotspot step. Use **AdMob** for their ads.
