# Pourr

**Pourr: Tilt to share files, just like pouring water.**

Sharing files should feel as natural as pouring water from a jug into a glass. With Pourr, it does. No buttons, no menus, no waiting. Just tilt your phone, and your files flow straight into your friend's phone.

**Try it:** https://vjitintech.github.io/pourr/

## How it works

1. Open Pourr on both phones and pick a role: the sender is the **Jug**, the receiver is the **Container**.
2. Pair the phones: the Container scans the Jug's QR code, then the Jug scans the Container's reply.
3. Add files to the Jug and tilt the phone past 40°. Files pour across one by one, first out, first in.
4. The Jug empties itself, and the Container asks to save the files to Files.

## Requirements

- **Same Wi-Fi or hotspot:** works with no internet at all.
- **Different Wi-Fi networks or mobile data:** both phones need internet. Most connect directly; some mobile carriers block direct connections, so add a free relay (TURN) server under "Different networks or mobile data" on the home screen. A free Metered account (metered.ca) gives 20 GB of relay traffic per month.
- **Far apart:** the Jug can share a pairing link through any chat app, and the Container shares its reply code back.
- Open the page over HTTPS (GitHub Pages does this) so the camera and tilt sensor work.
- On iPhone, allow camera and motion access when asked.

## Test on one computer

Open the page in two browser tabs, choose Jug in one and Container in the other, and exchange codes with the "copy / paste the code instead" options. Tap **Enable tilt to pour**, then use **Hold here to pour**.

## How it's built

A single `index.html` with no build step. Phones connect directly using WebRTC data channels, paired by QR code or shared link with no signaling server. Public STUN servers find a route across networks, and an optional TURN relay covers networks that block direct connections. Files are read in large slices and sent as ordered chunks with flow control, and the receiver rebuilds each file as it arrives.
