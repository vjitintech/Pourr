# Pourr owner setup

Pourr has no servers to run. It is a static site: files go straight from one phone to the other, so a million users cost the same to host as one.

## Hosting

GitHub Pages serves the app from its global CDN for free. Users download about 17 KB (compressed) on the first visit; after that the app is cached on the phone and opens instantly, even with no internet.

When you change any file, bump `VERSION` in `sw.js` so phones pick up the update.

## Ads with Google AdSense

AdSense needs a domain you own, so use a custom domain instead of `github.io`.

1. **Buy a domain** such as `pourr.app` or `pourr.in` from any registrar.
2. **Point it at GitHub Pages:** in the repo, **Settings → Pages → Custom domain**, enter the domain and follow the DNS steps shown. Tick **Enforce HTTPS**.
3. **Apply for AdSense** at **adsense.google.com** (you must be 18 or older) and add your domain.
4. AdSense gives you a publisher ID like `ca-pub-1234567890123456`. Copy `ads.txt.example` to `ads.txt`, replace the ID, and push. It must be reachable at `https://your-domain/ads.txt`.
5. After approval, create two **Display ad units** (responsive) and set them in `index.html`:

```js
adClient: 'ca-pub-1234567890123456',
adSlots: { home: '1111111111', done: '2222222222' },
```

Ads appear only on the home screen and after a pour finishes, never on the pouring screen, because tilting a phone near an ad leads to accidental taps, which AdSense treats as a policy violation. The privacy policy AdSense requires is in [`privacy.html`](privacy.html). For visitors in Europe and the UK, turn on Google's consent message in **AdSense → Privacy & messaging**.

## Native apps (next step)

Android and iPhone apps can use Wi-Fi Direct (Android) and peer-to-peer Wi-Fi (iPhone) to create the phone-to-phone link automatically, with no hotspot step. Use **AdMob** for their ads.
