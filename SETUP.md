# Pourr owner setup

Pourr is free for users. Three one-time steps by the app owner make it work everywhere and earn from ads. Users never sign up, pay or configure anything.

| What | Cost to users | Cost to owner |
|---|---|---|
| Same Wi-Fi or hotspot | Free, no internet needed | Free |
| Different networks, direct route | Free (normal mobile data) | Free |
| Different networks, relay needed | Free (normal mobile data) | Free up to 1,000 GB a month on Cloudflare, then $0.05 per GB |
| Ads | Free | Earns revenue |

Pourr always tries a direct route first. The relay is used only when a network blocks direct connections, so most transfers never touch it.

---

## 1. Free relay with Cloudflare (about 15 minutes)

### 1a. Create the TURN key
1. Sign up free at **dash.cloudflare.com**.
2. In the left menu open **Realtime** (older accounts: **Calls**) and choose **TURN Server**.
3. Create a TURN key. Copy the **Key ID** and the **API token**. The token is shown once, so save it somewhere safe.

### 1b. Create the relay Worker
1. In the left menu open **Workers & Pages → Create → Create Worker**.
2. Name it `pourr-relay` and tap **Deploy**.
3. Tap **Edit code**, delete the sample code, paste everything from [`relay/worker.js`](relay/worker.js), and tap **Deploy**.
4. Open the Worker's **Settings → Variables and Secrets** and add:

| Name | Type | Value |
|---|---|---|
| `TURN_KEY_ID` | Text | the Key ID from step 1a |
| `TURN_KEY_API_TOKEN` | Secret | the API token from step 1a |
| `ALLOWED_ORIGINS` | Text | `https://vjitintech.github.io` (add your own domain later, comma-separated) |

5. Open `https://pourr-relay.<your-subdomain>.workers.dev/health`. It should show `{"ok":true,...}`.

Workers' free plan allows 100,000 requests a day. Pourr makes one request per pairing, at most.

### 1c. Connect it to the app
In `index.html`, near the top of the script, set:

```js
relayEndpoint: 'https://pourr-relay.<your-subdomain>.workers.dev/ice',
```

Commit, push, and the home screen will show **Different networks · free relay built in**.

**Safety:** in Cloudflare, open **Notifications** and add a usage or billing alert so you hear about it well before 1,000 GB.

---

## 2. Ads with Google AdSense

AdSense needs a site you own, so use a custom domain instead of `github.io`.

1. **Buy a domain** such as `pourr.app` or `pourr.in` from any registrar.
2. **Point it at GitHub Pages:** in the repo, **Settings → Pages → Custom domain**, enter the domain and follow the DNS steps shown. Tick **Enforce HTTPS**.
3. Add the new domain to the Worker's `ALLOWED_ORIGINS`.
4. **Apply for AdSense** at **adsense.google.com** (you must be 18 or older) and add your domain.
5. AdSense gives you a publisher ID like `ca-pub-1234567890123456`. Copy `ads.txt.example` to `ads.txt`, replace the ID, and push. It must be reachable at `https://your-domain/ads.txt`.
6. After approval, create two **Display ad units** (responsive) and set them in `index.html`:

```js
adClient: 'ca-pub-1234567890123456',
adSlots: { home: '1111111111', done: '2222222222' },
```

Ads appear only on the home screen and after a pour finishes. They never appear on the pouring screen, because tilting the phone near an ad leads to accidental taps, which AdSense treats as a policy violation.

AdSense also requires a privacy policy, which is already in [`privacy.html`](privacy.html) and linked from the home screen. For visitors in Europe and the UK, turn on Google's consent message in **AdSense → Privacy & messaging**.

---

## 3. Later: native apps

The Android and iPhone versions should use **AdMob** for ads and Wi-Fi Direct (Android) or peer-to-peer Wi-Fi (iPhone) for faster offline transfers. The same Cloudflare relay Worker works for them unchanged.
