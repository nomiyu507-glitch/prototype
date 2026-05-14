# ml5.js PDF part 4 demo project

This repo packages the five starter sketches from PDF part 4 as static pages you can open in a browser:

- `bodypose.html`
- `handpose.html`
- `facemesh.html`
- `segmentation.html`
- `classifier.html`

## How to run

From this directory:

```bash
npm start
```

Then open:

- `http://localhost:8000/`

## Notes

- These demos need camera access; allow the permission prompt on first load.
- `segmentation.html` loads `assets/background.jpg` as the default background.
- All sketches use the CDN builds of `p5.js` and `ml5.js`; no extra frontend install is required.

## Files

- `index.html` — landing page with links to each example
- `examples/*.js` — sketch code
- `assets/background.jpg` — placeholder background for the body segmentation demo
