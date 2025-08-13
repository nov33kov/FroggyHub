# FroggyHub Architecture

## State

State is stored in `localStorage` under the key `FROGGY_STATE_V8`. The schema:

```json
{
  "id": "string",
  "title": "string",
  "date": "string",
  "time": "string",
  "address": "string",
  "dress": "string",
  "bring": "string",
  "notes": "string",
  "wishlist": [
    { "id": number, "title": "string", "url": "string", "claimedBy": "string" }
  ],
  "guests": [
    { "name": "string", "rsvp": "yes|maybe|no" }
  ],
  "code": "string|null"
}
```

Old keys (`froggyhub_state_v7`, `froggyhub_event_v01`) are migrated on first load.

## Scenes

The UI is divided into scenes:

1. **intro** – greeting with options to create or join.
2. **pond** – interactive area with forms and wishlists.
3. **final** – summary and countdown.

`scene.js` controls scene changes and frog jumps between pads.

## Modules

- `state.js` – load/save/migrate state.
- `audio.js` – sound effects.
- `scene.js` – scene management and animations.
- `wishlist.js` – admin and guest wishlist logic.
- `rsvp.js` – joining via code, RSVP and final summary.
- `app.js` – ties everything together.
