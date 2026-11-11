# Pause & Go Dryer Simulator

A beginner-friendly interactive dryer simulator created for a computational thinking course. It models a shared-laundry dryer with clear states, variables, buttons, and rules.

## Main idea

People sometimes notice that they need to add or remove clothing after a dryer cycle has started. This project models a safer workflow: users can pause the dryer, keep their remaining paid time, adjust the load, close the door, and manually resume.

## Files

- `index.html` — page structure and controls
- `style.css` — responsive layout, dryer illustration, transparent door, and clothes animation
- `script.js` — state variables, event listeners, countdown, and button rules

## How to run

Open `index.html` in a web browser. No installation, framework, or server is required.

For a local server, run this command inside this folder:

```bash
python3 -m http.server 4173
```

Then visit `http://127.0.0.1:4173`.

## Main interactions

1. Pay for the cycle.
2. Select Low, Medium, or High temperature.
3. Start the dryer.
4. Pause to save remaining time and payment.
5. Open and close the door while paused.
6. Press Resume to continue the saved cycle.

The Demo Speed switch makes one real second equal one simulated minute.

## GitHub Pages

For GitHub Pages, place these files in the repository root or in a `docs` folder:

```text
index.html
style.css
script.js
README.md
```

In GitHub, go to **Settings → Pages**, choose the branch and the matching folder, then save.
