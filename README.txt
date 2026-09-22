MONEY APP — UI MOCKUP
======================

Files included:
- index.html      Page structure/markup
- style.css        All visual styling (dark theme, green glow, cards, layout)
- script.js        Interactivity: eye icon toggles hiding balances, the
                    "Locked" pill toggles to "Unlocked", Add money / Withdraw
                    / Search buttons log to the browser console as placeholders
- manifest.json     PWA manifest so the page can be "installed" to a phone
                    home screen as an app icon
- README.txt        This file

HOW TO RUN
----------
1. Keep all five files in the same folder (don't rename or move them).
2. Double-click index.html to open it in any browser, or serve the folder
   with a local server, e.g.:
       python3 -m http.server 8000
   then visit http://localhost:8000 in your browser.
3. Best viewed narrow (phone-width) since it's designed as a mobile screen.

NOTES
-----
- This is a static front-end mockup only — there is no backend, no real
  accounts, no real money movement. The numbers on screen are hardcoded
  placeholders.
- To wire it to real data, you'd replace the placeholder click handlers in
  script.js with actual API calls, and swap the hardcoded balance/savings
  figures with values fetched from your backend.
