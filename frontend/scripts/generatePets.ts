import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { PET_COLORS, COFFEE_COLORS, MUG2_COLORS, PET_FRAMES, COFFEE_FRAMES, MUG2_FRAMES } from './petFrames';

const OUT_DIR = path.join(process.cwd(), 'frontend', 'public', 'pets');

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

function renderSpriteSheet(
    frames: string[][],
    colors: Record<string, string>,
    name: string,
    scale: number,
    frameSize: number
) {
    const width = frameSize * scale * frames.length;
    const height = frameSize * scale;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    frames.forEach((frameStrArray, frameIndex) => {
        const offsetX = frameIndex * frameSize * scale;
        frameStrArray.forEach((row, y) => {
            for (let x = 0; x < row.length; x++) {
                const char = row[x];
                if (colors[char]) {
                    ctx.fillStyle = colors[char];
                    ctx.fillRect(offsetX + x * scale, y * scale, scale, scale);
                }
            }
        });
    });

    const outPath = path.join(OUT_DIR, `${name}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outPath, buffer);
    console.log(`Generated: ${name}.png`);
}

const animations = {
    walk: ['walk1', 'walk2', 'walk3', 'walk4'],
    idle: ['idle'],
    blink: ['blink'],
    look_left: ['look_left'],
    look_right: ['look_right'],
    happy: ['happy'],
    inflate: ['inflate1', 'inflate2'],
    water: ['water1', 'water2']
};

function generate(
    petName: string,
    framesData: Record<string, string[]>,
    colorsData: Record<string, string>,
    scale = 10,
    frameSize = 16
) {
    for (const [animName, frameKeys] of Object.entries(animations)) {
        const frames = frameKeys.map(key => framesData[key]);
        renderSpriteSheet(frames, colorsData, `${petName}_${animName}`, scale, frameSize);
    }
}

// 16x16 @ scale 10 (160x160px per frame)
generate('bmo', PET_FRAMES, PET_COLORS, 10, 16);
generate('coffee', COFFEE_FRAMES, COFFEE_COLORS, 10, 16);

// 24x24 @ scale 8 (192x192px per frame, displayed at 96px)
generate('mug2', MUG2_FRAMES, MUG2_COLORS, 8, 24);
