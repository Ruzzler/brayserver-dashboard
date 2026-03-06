---
name: Pixel Art Sprite Sheet Pipeline
description: How to create high-quality, consistent pixel art sprite sheets for animated web characters
---

# Pixel Art Sprite Sheet Pipeline

A systematic workflow for generating game-quality pixel art characters with consistent style across multiple animation frames, then integrating them as animated sprites in a web application.

---

## Overview

This skill covers the full pipeline:
1. **Design** → Generate a character mockup and get user approval
2. **Sprite Generation** → Create animation frames from the approved design
3. **Assembly** → Stitch frames into sprite sheets
4. **Integration** → Wire up CSS sprite animation in the web app

---

## Phase 1: Character Design (Mockup)

Generate a single **hero image** of the character for user approval.

### Prompt Template for Mockup

```
A cute kawaii pixel art character, [CHARACTER_DESCRIPTION].
High resolution pixel art style, 16-bit SNES era aesthetic.
Clean black pixel outlines on all shapes.
[COLOR_PALETTE_DESCRIPTION].
Two symmetrical teal/green stubby arms extend from each side.
Two small teal legs with round feet at the bottom.
Two round black dot eyes with white shine highlights.
Rosy pink blush dots on cheeks. Small happy smile.
Background: neutral gray checkerboard transparency grid.
Display: single character, centered, large, full body visible.
```

### Key Prompt Rules
- **Always specify "pixel art"** — without it, AI generates smooth vector art
- **Specify bit-depth** — "16-bit" or "SNES style" for good detail with authentic look
- **Describe the character body exhaustively** — every visual element matters
- **Use "clean black pixel outlines"** — prevents blurry edges
- **Gray checkerboard background** — easy to remove, signals "transparency"
- **"Single character, centered"** — prevents multi-character or cluttered output

### Approval Gate
Show the user the mockup. Do NOT proceed until they approve. If they want changes, regenerate with adjusted prompts.

---

## Phase 2: Sprite Frame Generation

Once the character design is approved, generate **individual animation frames**. Each frame shows the character in a specific pose.

### Required Animation States

| State | Frames | Description |
|-------|--------|-------------|
| `idle` | 2 | Subtle breathing/bob. Frame 1: normal. Frame 2: slightly raised |
| `walk` | 4 | Walk cycle. Alternating arm/leg positions |
| `blink` | 2 | Eyes open → eyes closed (horizontal lines) |
| `happy` | 1 | Big smile, slightly squished (squash effect) |

### Prompt Template for Animation Frames

Use the **approved mockup image as a reference** (pass it via `ImagePaths`). This is the single most important technique for consistency.

```
A cute kawaii pixel art character, [EXACT SAME CHARACTER DESCRIPTION AS MOCKUP].
High resolution pixel art style, 16-bit SNES era aesthetic.
Clean black pixel outlines on all shapes.
[EXACT SAME COLOR PALETTE].
Background: solid bright green (#00FF00) for chroma key removal.
[POSE_DESCRIPTION].
Same character as reference image, maintaining exact proportions,
colors, and style. Single character, centered, full body visible.
```

### Pose Descriptions per Frame

**Idle Frame 1 (neutral):**
```
Standing still in neutral pose. Arms at sides, feet together.
```

**Idle Frame 2 (bob up):**
```
Standing still, body shifted up slightly (breathing). Arms at sides.
```

**Walk Frame 1:**
```
Walking pose: left arm forward, right arm back.
Left leg forward/extended, right leg back. Mid-stride contact pose.
```

**Walk Frame 2:**
```
Walking pose: body slightly higher (passing position).
Left leg under body, right leg lifting. Arms transitioning.
```

**Walk Frame 3:**
```
Walking pose: right arm forward, left arm back.
Right leg forward/extended, left leg back. Mirror of frame 1.
```

**Walk Frame 4:**
```
Walking pose: body slightly higher again (passing).
Right leg under body, left leg lifting. Arms transitioning.
```

**Blink Frame:**
```
Same as idle frame 1, but eyes are closed.
Eyes shown as small horizontal lines instead of circles.
```

**Happy Frame:**
```
Excited happy pose. Arms raised up in celebration.
Big open smile. Body slightly squished/bouncing with joy.
```

### Consistency Techniques

1. **Always pass the approved mockup as a reference image** via `ImagePaths`
2. **Reuse the EXACT same character description** — copy-paste, don't paraphrase
3. **Use solid green (#00FF00) background** for all frames — easier post-processing
4. **Generate frames in order** — AI models tend to be more consistent within a session
5. **If a frame looks inconsistent**, regenerate it passing both the mockup AND a good frame as references

---

## Phase 3: Sprite Sheet Assembly

### Option A: Canvas-Based Script (Recommended)

Use a Node.js script to stitch individual frame PNGs into horizontal sprite sheets:

```typescript
// scripts/buildSpriteSheet.ts
import { createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

interface SpriteConfig {
    name: string;         // Character name (e.g., "latte_art")
    frameSize: number;    // Width/height of each frame in pixels
    states: {
        name: string;     // Animation state (e.g., "walk", "idle")
        frames: string[]; // Paths to frame PNGs in order
    }[];
    outputDir: string;    // Where to save sprite sheets
    scale?: number;       // Optional downscale factor
}

async function buildSpriteSheet(config: SpriteConfig) {
    for (const state of config.states) {
        const images = await Promise.all(
            state.frames.map(f => loadImage(f))
        );
        const frameW = config.frameSize;
        const frameH = config.frameSize;
        const canvas = createCanvas(frameW * images.length, frameH);
        const ctx = canvas.getContext('2d');

        images.forEach((img, i) => {
            ctx.drawImage(img, i * frameW, 0, frameW, frameH);
        });

        const outPath = path.join(
            config.outputDir,
            `${config.name}_${state.name}.png`
        );
        fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
        console.log(`Generated: ${outPath}`);
    }
}
```

### Option B: Manual Assembly

If the canvas library isn't available, use an image editor or online tool to place frames side-by-side in a horizontal strip.

### Output Format

Each sprite sheet should be a **horizontal strip** of equal-sized frames:

```
┌────────┬────────┬────────┬────────┐
│ Frame1 │ Frame2 │ Frame3 │ Frame4 │
└────────┴────────┴────────┴────────┘
```

File naming convention: `{character}_{state}.png`
- Example: `latte_art_walk.png`, `latte_art_idle.png`

Place sprite sheets in: `frontend/public/pets/`

---

## Phase 4: Web Integration

### CSS Sprite Animation

```css
/* Base sprite class — adjust dimensions per character */
.pet-sprite {
    width: 64px;          /* Display size */
    height: 64px;
    background-repeat: no-repeat;
    background-size: auto 64px;

    /* CRITICAL for pixel art crispness */
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}

/* Walk animation (4 frames) */
.pet-walk {
    animation: sprite-walk 0.6s steps(4) infinite;
}

@keyframes sprite-walk {
    from { background-position: 0 0; }
    to { background-position: -256px 0; }
    /* Total width = frame_width × num_frames = 64 × 4 = 256px */
}

/* Idle animation (2 frames) */
.pet-idle {
    animation: sprite-idle 1.2s steps(2) infinite;
}

@keyframes sprite-idle {
    from { background-position: 0 0; }
    to { background-position: -128px 0; }
}
```

### Key CSS Rules
- **`image-rendering: pixelated`** is essential — without it, browsers smooth/blur the pixels
- **`steps(N)`** — N must match the number of frames in the sprite sheet
- **`background-position`** end value = `-(frameWidth × numFrames)px`
- Frame width and display width can differ (use `background-size` to scale)

### React Component Pattern

Use the existing `PetWrapper` component for autonomous movement. The sprite rendering:

```tsx
function PixelPet({ characterName, state }: {
    characterName: string;
    state: 'idle' | 'walk';
}) {
    return (
        <div
            className={`pet-sprite pet-${state}`}
            style={{
                backgroundImage: `url('/pets/${characterName}_${state}.png')`,
            }}
        />
    );
}
```

---

## Quick Reference: Full Workflow Checklist

```
1. [ ] Generate character mockup with pixel art prompt
2. [ ] Get user approval on the design
3. [ ] Generate animation frames (idle×2, walk×4, blink×2, happy×1)
   - Pass approved mockup as reference image for each
   - Use green background for easy removal
4. [ ] Process frames (crop, remove background if needed)
5. [ ] Assemble into horizontal sprite sheets
6. [ ] Place PNGs in frontend/public/pets/
7. [ ] Add CSS sprite classes + keyframe animations
8. [ ] Wire up in React component with PetWrapper
9. [ ] Test in browser — verify crisp pixels + smooth animation
10.[ ] Build + push
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Pixels look blurry when scaled up | Add `image-rendering: pixelated` to the sprite element |
| Character looks different between frames | Pass the approved mockup as reference image for every frame |
| Animation is jerky | Ensure `steps(N)` matches exact frame count |
| Frames are misaligned | Ensure all frame PNGs are the exact same dimensions |
| Colors shift between frames | Specify exact hex colors in every prompt |
| Background not transparent | Use green screen background + remove in post-processing |
