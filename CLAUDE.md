# Score Canvas — Project Rules

## DEPLOYMENT — CRITICAL
- **Netlify site**: `score-canvas` (ID: `8712fde4-1a5f-4af0-8c41-72e737a4765c`)
- **URL**: https://score-canvas.netlify.app
- **GitHub repo**: `pour-over/ScoreCanvas`
- Before EVERY deploy: run `npx netlify status` and VERIFY the site name is `score-canvas`. If it shows ANY other site name, STOP and relink first.
- Before EVERY git push: run `git remote -v` and VERIFY origin points to `pour-over/ScoreCanvas`. If it doesn't, STOP.
- NEVER deploy to songwright, pourover-site, or any other Netlify site from this repo.
