# Patella Rehab Log

Installable rehab tracker. Plain static site: no build step, no dependencies.
Data is stored on the phone (localStorage). Use Data > Export backup regularly.

## Deploy to Vercel (from a computer)

Option A: GitHub
1. Create a new private GitHub repo and push this folder to it.
2. vercel.com > Add New > Project > import the repo.
3. Framework Preset: Other. Build command: leave empty. Output directory: leave empty (root).
4. Deploy.

Option B: CLI
    npm i -g vercel
    cd patella-rehab
    vercel --prod

## Install on your phone
- iPhone: open the Vercel URL in Safari > Share > Add to Home Screen.
- Android: open it in Chrome > menu > Install app.
Open it from the home screen icon every time, so your data stays in one place.
Browser storage is per site address, so keep using the same URL.

## Updating
Edit files, bump VERSION in sw.js, redeploy. Phones update the next time they are online.

## Loading a new rehab block
Data tab > "Copy request for Claude", paste into a Claude chat with your latest checkpoint
results, then paste the JSON it returns into "Load a new block".
