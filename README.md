# Character Explorer

A React Native (Expo) app for browsing characters from the
[Rick and Morty API](https://rickandmortyapi.com/). Built as a learning
project covering data fetching, navigation, global state, and persistence.

## Features

- **Character list** — cards showing image, name, species, gender, and a
  color-coded status dot.
- **Debounced search** — filter by name (`?name=`); one request fires after
  you stop typing, not on every keystroke.
- **Status filter chips** — filter by Alive / Dead / Unknown (`?status=`).
- **Infinite scroll** — pages load automatically as you scroll, using the
  API's `info.next` pagination metadata.
- **Detail screen** — tap a character to see status, species, gender, origin,
  location, and episode count.
- **Favorites** — tap the heart on any card; favorites are stored globally
  (React Context) and persisted across restarts (AsyncStorage).
- **Robust fetching** — pull-to-refresh, error + empty states, and in-flight
  request cancellation with `AbortController`.

## Tech stack

- **Expo** SDK 57 · **React Native** 0.86 · **React** 19.2
- **React Navigation** 7 (native stack)
- **AsyncStorage** for persistence
- **@expo/vector-icons** (Ionicons) for the heart icon

## Getting started

Requires Node.js 22.13+ and the Expo tooling.

```bash
npm install
npm run ios      # or: npm run android / npm run web / npm start
```

`npm start` opens the Expo dev server; scan the QR code with Expo Go, or press
`i` / `a` to launch a simulator/emulator.

## Project structure

```
App.js                          # Providers + navigation stack
context/
  FavoritesContext.js           # Global favorites state + AsyncStorage persistence
hooks/
  useCharacters.js              # Fetching: name + status filters, pagination, abort
components/
  CharacterCard.js              # Tappable card with favorite heart
  StatusChips.js                # Status filter chips (controlled component)
pages/
  CharacterExplorer/            # List screen (search, chips, infinite scroll)
    CharacterExplorer.js
    styles.js
  CharacterDetail/              # Detail screen
    CharacterDetail.js
    styles.js
```

## How it works

- **Data layer** — [`useCharacters(filters)`](hooks/useCharacters.js) owns all
  fetching. It resets to page 1 when filters change, appends pages on
  `loadMore()`, treats the API's `404` ("no matches") as an empty list, and
  cancels superseded requests via a shared `AbortController`.
- **Navigation** — a native stack in [`App.js`](App.js) with two screens; the
  list passes the tapped character to the detail screen via route params, so no
  second network request is needed.
- **Favorites** — [`FavoritesProvider`](context/FavoritesContext.js) exposes
  `isFavorite` / `toggleFavorite` through Context. It loads saved favorites on
  startup and writes back on every change.

## Credits

Character data from the free [Rick and Morty API](https://rickandmortyapi.com/).
