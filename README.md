# Todo

A classic to-do list built with plain HTML, CSS and JavaScript. No framework, no build step.

## Features

- Add a task with Enter or the Add button. Empty or whitespace-only input adds nothing.
- Mark a task as done and delete a task.
- Filter by all, active or done.
- Counter of remaining tasks and a "Clear completed" action.
- Tasks are saved in `localStorage`, so they survive a page reload.
- Designed empty state, dark theme, and keyboard and screen reader support.

## Tech

- HTML, CSS and vanilla JavaScript
- No dependencies, no bundler, no `package.json`

## Run locally

Open `index.html` in a browser. Nothing to install.

To serve it from a local server instead, any static server works, for example:

```
npx serve
```

## How it works

- **State lives in an array.** Each task is `{ id, text, done }`. The DOM is only a view of that array, and `render()` is the single place that updates it.
- **Event delegation.** One `click` and one `change` listener on the list handle every task, including the ones added later. The task is found through `closest("li")` and its `data-id`.
- **`<template>` instead of HTML strings.** New rows are cloned from `#task-template`, and user text is set with `textContent`.
- **The list is reconciled, not rebuilt.** Rows are matched by `id`, so an existing row stays in the DOM and the CSS strike-through transition can play when a task is checked.
- **Safe storage.** Loading handles a missing key, invalid JSON and unexpected data, and falls back to an empty list. Saving does not break the app when storage is unavailable.

## Accessibility

- Filter buttons expose their state with `aria-pressed`.
- The remaining counter is an `aria-live` region.
- The input has a label, hidden visually but available to screen readers.
- Transitions are disabled for users who prefer reduced motion.

## Project structure

```
index.html   markup and the task template
style.css    styles, colors as custom properties on :root
script.js    state, rendering, events and storage
images/      favicon
fonts/       Hanken Grotesk
```

## Out of scope

Editing task text, due dates, priorities, categories and drag and drop. The goal was to do the basics completely.
