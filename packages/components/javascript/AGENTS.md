**Disclaimer**: This guide is for AI agents and other automated software. If you are a human developer please refer to our readme files.

# what3words — Autosuggest component (no map) Agent Guide (CDN‑only)

Goal: Minimal POC where selecting a suggestion from the what3words autosuggest converts to `{lat,lng}` and displays it. No bundler edits, no extra packages.

Rules:

- Use CDN web‑component only. Do not install `@what3words/*` or edit Vite config.
- Convert only after a selection (`"selected_suggestion"` event), never while typing.
- Expose the API key as `VITE_W3W_API_KEY` (works with default Vite).

## 1) Set the what3words API key

- Key: `VITE_W3W_API_KEY`

## 2) Add the component (no npm)

Open `client/index.html` and paste these **two** lines just before `</head>`:

```html
<script
  async
  type="module"
  src="https://cdn.what3words.com/javascript-components@5.0.0/dist/what3words/what3words.esm.js"
></script>
<script
  nomodule
  src="https://cdn.what3words.com/javascript-components@5.0.0/dist/what3words/what3words.js"
></script>
```

This defines the `<what3words-autosuggest>` element at runtime — no Vite changes needed.

## 3) Minimal `client/src/App.tsx`

```tsx
import { useEffect, useRef, useState } from "react";

// allow the custom element without extra .d.ts files
declare global { namespace JSX { interface IntrinsicElements { "what3words-autosuggest": any } } }

const API_KEY = import.meta.env.VITE_W3W_API_KEY as string | undefined;

export default function App() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const ref = useRef<any>(null);

  if (!API_KEY) return <p>Set <code>VITE_W3W_API_KEY</code> and rerun.</p>;

  useEffect(() => {
    const el = ref.current;
    const onSelect = (e: any) => {
      const w = e.detail?.suggestion?.words as string;
      fetch(
        \`https://api.what3words.com/v3/convert-to-coordinates?words=\${encodeURIComponent(w)}&key=\${API_KEY}\`
      )
        .then((r) => r.json())
        .then((d) => setCoords(d.coordinates ?? null));
    };
    el?.addEventListener("selected_suggestion", onSelect);
    return () => el?.removeEventListener("selected_suggestion", onSelect);
  }, [API_KEY]);

  return (
    <>
      <what3words-autosuggest api_key={API_KEY} ref={ref}>
        <input placeholder="///filled.count.soap" />
      </what3words-autosuggest>
      <pre>{coords ? \`\${coords.lat}, \${coords.lng}\` : "Pick a suggestion"}</pre>
    </>
  );
}
```

# what3words — Autosuggest component (with map) Agent Guide (CDN‑only)

Goal: Minimal POC that shows a full‑viewport map and a what3words search. Picking a suggestion recentres the map to that 3‑word address. No bundler edits, no extra packages.

Rules (for humans & agents):

- Use CDN web‑components only. Do not install `@what3words/*` or edit Vite config.
- Secrets: `VITE_W3W_API_KEY` (what3words) and `VITE_GOOGLE_MAP_API_KEY` (Google Maps).
- Wire selection → map: listen for `"selected_suggestion"` and set the map’s `words` property. No manual API calls required.

---

## 1) Set the API keys

- `VITE_W3W_API_KEY` → what3words key
- `VITE_GOOGLE_MAP_API_KEY` → Google Maps JavaScript API key

---

## 2) Load the components (no npm)

Open `client/index.html` and paste these two lines just before `</head>`:

```html
<script
  async
  type="module"
  src="https://cdn.what3words.com/javascript-components@5.0.0/dist/what3words/what3words.esm.js"
></script>
<script
  nomodule
  src="https://cdn.what3words.com/javascript-components@5.0.0/dist/what3words/what3words.js"
></script>
```

This defines `<what3words-map>` and `<what3words-autosuggest>` at runtime — no Vite changes needed.

---

## 3) Minimal `client/src/App.tsx`

```tsx
import { useEffect, useRef } from "react";

// allow the custom elements without extra .d.ts files
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "what3words-map": any;
      "what3words-autosuggest": any;
    }
  }
}

const W3W_KEY = import.meta.env.VITE_W3W_API_KEY as string | undefined;
const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY as string | undefined;

export default function App() {
  const mapRef = useRef<any>(null);
  const autoRef = useRef<any>(null);

  if (!W3W_KEY || !GMAPS_KEY) {
    return (
      <p>
        Set <code>VITE_W3W_API_KEY</code> and{" "}
        <code>VITE_GOOGLE_MAP_API_KEY</code> then rerun.
      </p>
    );
  }

  useEffect(() => {
    const el = autoRef.current;
    const onSelect = (e: any) => {
      const words = e.detail?.suggestion?.words as string;
      if (words && mapRef.current) mapRef.current.words = words; // recentre map
    };
    el?.addEventListener("selected_suggestion", onSelect);
    return () => el?.removeEventListener("selected_suggestion", onSelect);
  }, []);

  return (
    <what3words-map
      ref={mapRef}
      api_key={W3W_KEY}
      map_api_key={GMAPS_KEY}
      words="filled.count.soap"
    >
      {/* map canvas fills the visible viewport */}
      <div slot="map" style={{ width: "100vw", height: "100dvh" }} />

      {/* centred search bar overlay */}
      <div
        slot="search-control"
        style={{
          position: "absolute",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <what3words-autosuggest api_key={W3W_KEY} ref={autoRef}>
          <input placeholder="Search what3words address" autoComplete="off" />
        </what3words-autosuggest>
      </div>
    </what3words-map>
  );
}
```
