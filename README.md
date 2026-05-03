# Character Pose Viewer

Static 3D character viewer with model switching, camera controls, preset poses, and a live pose tuner.

## Local use

Because this app uses ES modules and loads local assets, serve it with a simple local server:

```bash
cd character-pose-viewer
python -m http.server 8000
```

Open:

```text
http://127.0.0.1:8000/
```

## Models included

- Chun-Li Fortnite
- Nami Bikini
- Chun-Li Alt
- Mizuki Shiranui

## Notes

- The two Chun-Li models are the main poseable rigs.
- Nami Bikini and Mizuki Shiranui are currently view-only models because they do not include usable skin/skeleton rig data for this viewer.

## GitHub deployment

1. Create a new GitHub repo.
2. Upload the contents of this `character-pose-viewer` folder.
3. Commit and push.

## Vercel deployment

### Option 1: import from GitHub

1. Push this folder to GitHub.
2. In Vercel, create a new project from that repo.
3. Framework preset: **Other** / static site.
4. Root directory: `character-pose-viewer` if the repo contains other folders, otherwise repo root.
5. Deploy.

### Option 2: drag and drop

You can also deploy this folder directly as a static site in Vercel.

## Important static hosting note

This app currently uses Three.js modules from a CDN (`unpkg`).
That means the deployed site needs normal internet access.
