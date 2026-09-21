ANISHMART PWA - COPY THESE FILES

1) Copy these files into:
   C:\Users\veera\OneDrive\Desktop\AnishMart\client

   manifest.json
   service-worker.js
   offline.html
   pwa.js
   index.html   (replace your current index.html)

2) Copy:
   images\icon-192.png
   images\icon-512.png

   into:
   C:\Users\veera\OneDrive\Desktop\AnishMart\client\images

3) Start server:
   cd C:\Users\veera\OneDrive\Desktop\AnishMart\server
   node server.js

4) Open:
   http://localhost:5000

5) Chrome/Edge:
   Use the install icon in the address bar OR the
   "Install AnishMart App" button when it appears.

IMPORTANT:
- Buyer/Seller/Admin backend still needs Node.js + MySQL running.
- API requests are NOT cached by the service worker.
- Localhost PWA works on the same PC.
- To install on a phone independently, deploy the backend/frontend on HTTPS.
