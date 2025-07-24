### HORIZON - Offline First Web Mapping Engine 

*Innovative Mapping. Unmatched Detail.*  


> A full-fledged WebGL-powered map engine that works offline, renders live data, and scales to the planet — all in your browser.

---

## 🧠 What is Horizon?

*Horizon* is not just another map viewer. It’s a *progressive web mapping platform* built from scratch to challenge the norms of traditional GIS tools like Google Maps and OsmAnd:

- 🗺 Offline-first: Works entirely offline with *downloadable vector areas*
- ⚡ GPU-powered: Uses *MapLibre GL JS* for fast, 3D WebGL rendering
- 🔍 Smart search: Integrated ranking engine using *PostgreSQL + trigram + full-text search*
- 🧭 Route like a pro: *pgRouting*-driven server-side routing engine
- 💾 Client-side spatial DB: Features are stored in *IndexedDB*, not bloated memory
- 🧩 Fully modular: Add new layers, services, and plugins like LEGO®

---

## 🚀 Quick Production Setup

```bash
git clone https://gitlab.cim.rhul.ac.uk/wkis128/PROJECT.git
```
```bash
cd horizon
```
```bash
docker-compose up --build
```

##  ⚡ Access At
Frontend:
```bash
localhost:3000
```
GraphQL:
```bash
localhost:4000/graphql
```
Cloudbeaver:
```bash
localhost:8080
```

