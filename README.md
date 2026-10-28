# Pourr

**Pourr: Tilt to share files, just like pouring water.**

Sharing files should feel as natural as pouring water from a jug into a glass. With Pourr, it does. No buttons, no menus, no waiting. Just tilt your phone, and your files flow straight into your friend's phone.

**Try it:** https://vjitintech.github.io/pourr/

## How it works

1. Open Pourr on both phones and pick a role: the sender is the **Jug**, the receiver is the **Container**.
2. Pair the phones: the Container scans the Jug's QR code, then the Jug scans the Container's reply.
3. Add files to the Jug and tilt the phone past 40°. Files pour across one by one, first out, first in.
4. The Jug empties itself, and the Container asks to save the files to Files.

## How the phones connect

Files always go straight from one phone to the other. There is no relay, no file server and no sign-up.

- **Same Wi-Fi or hotspot:** works with no internet at all. This is the fastest route.
- **Different Wi-Fi networks or mobile data:** both phones need internet; Pourr finds a direct path between them. Some mobile networks block this, and Pourr then shows a one-step fix: turn on a hotspot on one phone and join it from the other.
- **Far apart:** the Jug can share a pairing link through any chat app, and the Container shares its reply code back.
- Open the page over HTTPS (GitHub Pages does this) so the camera and tilt sensor work. On iPhone, allow camera and motion access when asked.

## Light and scalable

- About 17 KB on first load (compressed). QR libraries load only when needed, from Pourr's own site.
- No outside fonts or CDNs. Installable as an app, and opens offline after the first visit.
- No backend: hosting is a static CDN, and transfers never touch a server, so traffic can grow without limits or cost.
- Free for users, supported by ads. Owner steps are in [SETUP.md](SETUP.md).

## Security

Encrypted phone-to-phone transfer, a SHA-256 check on every file, a matching 4-digit safety code on both phones, and a strict security policy on transfer screens so no outside code can run while files are in the page. Details in [SETUP.md](SETUP.md).

## Measured speed

1 GB sent, verified and saved byte-identical in 42 seconds (about 24 MB/s) between two browsers on one 2-core machine. On real phones the Wi-Fi link sets the speed.

## Contact

pourrft@gmail.com

© 2026 Pourr. All rights reserved.

## Test on one computer

Open the page in two browser tabs, choose Jug in one and Container in the other, and exchange codes with the "copy / paste the code instead" options. Tap **Enable tilt to pour**, then use **Hold here to pour**.

## How it's built

A single `index.html` with no build step. Phones connect directly using WebRTC data channels, paired by QR code or shared link with no signaling server. Public STUN servers help find a direct route across networks; no data passes through them. QR codes are made and read with `lib/qrcode.min.js` (MIT) and `lib/jsQR.min.js` (Apache 2.0). Files are read in large slices and sent as ordered chunks with flow control, and the receiver rebuilds each file as it arrives.
