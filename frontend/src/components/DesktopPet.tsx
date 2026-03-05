import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const PET_COLORS: Record<string, string> = {
    'B': '#105051', // Dark outline / legs / arms
    'M': '#69b09f', // Main body green/teal
    'A': '#8dcabe', // Lighter body highlight
    'S': '#d9f1cd', // Screen background
    'E': '#12413f', // Eyes / mouth
    'Y': '#facc15', // Yellow D-Pad
    'D': '#1e3a8a', // Dark blue button
    'R': '#e11d48', // Red button
    'G': '#86efac', // Green button
    'L': '#38bdf8', // Light blue button
    'W': '#4b9087', // Shadow under screen

    // Props colors
    'P': '#f472b6', // Pink balloon
    'O': '#38bdf8', // Water drops / watering can
    'C': '#60a5fa', // Sleep Zzzs
};

const PET_FRAMES = {
    idle: [
        "                ",
        "                ",
        "   BBBBBBBBBB   ",
        "  BMMMMMMMMMMB  ",
        "  BSSSSSSSSSSB  ",
        "  BSEESSSSEESB  ",
        "  BSEESSSSEESB  ",
        "  BSSSSSSSSSSB  ",
        "  BMMMMWWMMMMB  ",
        "  BBWMMMMMMDMBBB",
        "  BBMYMMMMMLMB B",
        "  B BMMMMMRGMB B",
        "   BMMMMMMMMMB  ",
        "    BBBBBBBBB   ",
        "     B    B     ",
        "    BBB  BBB    "
    ],
    blink: [
        "                ",
        "                ",
        "   BBBBBBBBBB   ",
        "  BMMMMMMMMMMB  ",
        "  BSSSSSSSSSSB  ",
        "  BSSSSSSSSSSB  ",
        "  BSSSSSSSSSSB  ",
        "  BSSSSSSSSSSB  ",
        "  BMMMMWWMMMMB  ",
        "  BBWMMMMMMDMBBB",
        "  BBMYMMMMMLMB B",
        "  B BMMMMMRGMB B",
        "   BMMMMMMMMMB  ",
        "    BBBBBBBBB   ",
        "     B    B     ",
        "    BBB  BBB    "
    ],
    look_left: [
        "                ",
        "                ",
        "   BBBBBBBBBB   ",
        "  BMMMMMMMMMMB  ",
        "  BSSSSSSSSSSB  ",
        "  BEEESSSSEESB  ",
        "  BEEESSSSEESB  ",
        "  BSSSSSSSSSSB  ",
        "  BMMMMWWMMMMB  ",
        "  BBWMMMMMMDMBBB",
        "  BBMYMMMMMLMB B",
        "  B BMMMMMRGMB B",
        "   BMMMMMMMMMB  ",
        "    BBBBBBBBB   ",
        "     B    B     ",
        "    BBB  BBB    "
    ],
    look_right: [
        "                ",
        "                ",
        "   BBBBBBBBBB   ",
        "  BMMMMMMMMMMB  ",
        "  BSSSSSSSSSSB  ",
        "  BSEESSSSEEEB  ",
        "  BSEESSSSEEEB  ",
        "  BSSSSSSSSSSB  ",
        "  BMMMMWWMMMMB  ",
        "  BBWMMMMMMDMBBB",
        "  BBMYMMMMMLMB B",
        "  B BMMMMMRGMB B",
        "   BMMMMMMMMMB  ",
        "    BBBBBBBBB   ",
        "     B    B     ",
        "    BBB  BBB    "
    ],
    walk1: [
        "                ",
        "                ",
        "   BBBBBBBBBB   ",
        "  BMMMMMMMMMMB  ",
        "  BSSSSSSSSSSB  ",
        "  BSEESSSSEESB  ",
        "  BSEESSSSEESB  ",
        "  BSSSSSSSSSSB  ",
        "  BMMMMWWMMMMB  ",
        "  BBWMMMMMMDMBBB",
        "  BBMYMMMMMLMB B",
        "  B BMMMMMRGMB B",
        "   BMMMMMMMMMB  ",
        "    BBBBBBBBB   ",
        "     B    B     ",
        "     BBB   BBB  "
    ],
    walk2: [
        "                ",
        "                ",
        "   BBBBBBBBBB   ",
        "  BMMMMMMMMMMB  ",
        "  BSSSSSSSSSSB  ",
        "  BSEESSSSEESB  ",
        "  BSEESSSSEESB  ",
        "  BSSSSSSSSSSB  ",
        "  BMMMMWWMMMMB  ",
        "  BBWMMMMMMDMBBB",
        "  BBMYMMMMMLMB B",
        "  B BMMMMMRGMB B",
        "   BMMMMMMMMMB  ",
        "    BBBBBBBBB   ",
        "      B  B      ",
        "    BBB  BBB    "
    ],
    happy: [
        "                ",
        "                ",
        "   BBBBBBBBBB   ",
        "  BMMMMMMMMMMB  ",
        "  BSSSSSSSSSSB  ",
        "  BSEESSSSEESB  ",
        "  BSESSSSSSESB  ",
        "  BSSSSSSSSSSB  ",
        "  BMMMMWWMMMMB  ",
        "  BBWMMMMMMDMBBB",
        "  BBMYMMMMMLMB B",
        "  B BMMMMMRGMB B",
        "   BMMMMMMMMMB  ",
        "    BBBBBBBBB   ",
        "      B  B      ",
        "     BB  BB     "
    ],
    inflate1: [
        "                ",
        "                ",
        "   BBBBBBBBBB   ",
        "  BMMMMMMMMMMB  ",
        "  BSSSSSSSSSSB  ",
        "  BSEESSSSEESB  ",
        "  BSEESSSSEESB  ",
        "P BSSSSSSESSB  P",
        "PPBMMMMWWMMMMBPP",
        "P BBWMMMMM DMB P",
        "  BBMYMMMM LMB B",
        "  B BMMMMMRGMB B",
        "   BMMMMMMMMMB  ",
        "    BBBBBBBBB   ",
        "     B    B     ",
        "    BBB  BBB    "
    ],
    inflate2: [
        "    PPPPPP      ",
        "   PPPPPPPP     ",
        "   BBPPPPBB     ",
        "  BMMMMMMMMMMB  ",
        " PSSSSSSSSSSP P ",
        " PBSEESSSSEESBP ",
        " PPBEESSSSEESPP ",
        "  PBBBSSSESSBPP ",
        "   BMMMMWWMMMMB ",
        "   BBWMMMMM DMBB",
        "  BBMYMMMM LMB B",
        "  B BMMMMMRGMB B",
        "   BMMMMMMMMMB  ",
        "    BBBBBBBBB   ",
        "     B    B     ",
        "    BBB  BBB    "
    ],
    water1: [
        "                ",
        "                ",
        "   BBBBBBBBBB   ",
        "  BMMMMMMMMMMB  ",
        "  BSSSSSSSSSSB  ",
        "  BSEESSSSEESB  ",
        "  BSEESSSSEESB  ",
        "  BSSSSSSSSSSB  ",
        "  BMMMMWWMMMMB  ",
        "  BBWMMMMM DMBB ",
        "  BBMYMMMM LMB B",
        "  B BMMMMMRGMB B",
        "   BMMMMMMM M B ",
        "    BBBBBBB M B ",
        "     B    B MMB ",
        "    BBB  BBB    "
    ],
    water2: [
        "                ",
        "                ",
        "   BBBBBBBBBB   ",
        "  BMMMMMMMMMMB  ",
        "  BSSSSSSSSSSB  ",
        "  BSSEESSSSEES  ",
        "  BSEESSSSEESB  ",
        "  BSSSSSSSSSSB  ",
        "  BMMMMWWMMMMB  ",
        "  BBWMMMMM DMBB ",
        "  BBMYMMMM LMB B",
        "  B BMMMMMRGMB B",
        "   BMMMMM MB MB ",
        "    BBBBB BMB B ",
        "     B    B O B ",
        "    BBB  BB B O "
    ],
};

const PixelFrame = ({ frame, flipX = false }: { frame: string[], flipX?: boolean }) => {
    return (
        <svg viewBox="0 0 16 16" className={`w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${flipX ? '-scale-x-100' : ''}`} style={{ shapeRendering: 'crispEdges' }}>
            {frame.map((row, y) =>
                row.split('').map((char, x) => (
                    PET_COLORS[char] ? <rect key={`${x}-${y}`} x={x} y={y} width="1.05" height="1.05" fill={PET_COLORS[char]} /> : null
                ))
            )}
        </svg>
    );
};

export function DesktopPet() {
    const [interactions, setInteractions] = useState(0);
    const [currentFrame, setCurrentFrame] = useState<keyof typeof PET_FRAMES>('idle');
    const [position, setPosition] = useState(50); // percentage 0-100
    const [flipX, setFlipX] = useState(false);

    // Smooth transition toggle
    const [isWalking, setIsWalking] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const loop = () => {
            if (interactions > 0) {
                setIsWalking(false);
                setCurrentFrame('happy');
                setInteractions(prev => prev - 1);
                timeout = setTimeout(loop, 400);
                return;
            }

            const rand = Math.random();

            // 30% chance to walk
            if (rand > 0.7) {
                const step = Math.random() > 0.5 ? 1 : -1;
                const dist = Math.floor(Math.random() * 15) + 5;
                const newPos = Math.max(5, Math.min(95, position + (step * dist)));

                setFlipX(step > 0);
                setIsWalking(true);

                // Animate walking
                setCurrentFrame('walk1');
                setPosition(newPos);

                // Toggle feet while walking
                let alternations = dist;
                const walkCycle = setInterval(() => {
                    setCurrentFrame(prev => prev === 'walk1' ? 'walk2' : 'walk1');
                    alternations--;
                    if (alternations <= 0) {
                        clearInterval(walkCycle);
                        setIsWalking(false);
                        setCurrentFrame('idle');
                        timeout = setTimeout(loop, 1000 + Math.random() * 2000);
                    }
                }, 200);

                return;
            }

            // 15% chance to inflate balloon
            if (rand > 0.55 && !isWalking) {
                setCurrentFrame('inflate1');
                timeout = setTimeout(() => {
                    setCurrentFrame('inflate2');
                    timeout = setTimeout(() => {
                        setCurrentFrame('idle');
                        timeout = setTimeout(loop, 1000 + Math.random() * 2000);
                    }, 1000);
                }, 500);
                return;
            }

            // 15% chance to water flowers
            if (rand > 0.4 && !isWalking) {
                setCurrentFrame('water1');
                let drops = 4;
                const waterCycle = setInterval(() => {
                    setCurrentFrame(prev => prev === 'water1' ? 'water2' : 'water1');
                    drops--;
                    if (drops <= 0) {
                        clearInterval(waterCycle);
                        setCurrentFrame('idle');
                        timeout = setTimeout(loop, 1000 + Math.random() * 2000);
                    }
                }, 400);
                return;
            }

            // Just idle/look/blink
            if (rand > 0.3) {
                setCurrentFrame('blink');
                timeout = setTimeout(() => {
                    setCurrentFrame('idle');
                    timeout = setTimeout(loop, 1500 + Math.random() * 2000);
                }, 150);
            } else if (rand > 0.15) {
                setCurrentFrame('look_left');
                timeout = setTimeout(() => {
                    setCurrentFrame('look_right');
                    timeout = setTimeout(() => {
                        setCurrentFrame('idle');
                        timeout = setTimeout(loop, 1000 + Math.random() * 2000);
                    }, 500);
                }, 500);
            } else {
                setCurrentFrame('idle');
                timeout = setTimeout(loop, 1000 + Math.random() * 2000);
            }
        };

        timeout = setTimeout(loop, 2000);
        return () => clearTimeout(timeout);
    }, [position, interactions, isWalking]);

    return (
        <div
            className="absolute top-0 pointer-events-none"
            style={{
                left: `${position}%`,
                transform: 'translate(-50%, -100%)',
                transition: isWalking ? 'left 2s linear' : 'none'
            }}
        >
            <div
                className="w-16 h-16 cursor-pointer pointer-events-auto group relative"
                onClick={() => setInteractions(3)}
            >
                <div className="absolute inset-0 z-10">
                    <PixelFrame frame={PET_FRAMES[currentFrame]} flipX={flipX} />
                </div>

                {/* Hearts particle system wrapper */}
                <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
                    {interactions > 0 && Array.from({ length: 3 }).map((_, i) => (
                        <Heart
                            key={i}
                            className="absolute text-pink-500 fill-pink-500 w-3 h-3 animate-[float_1s_ease-out_forwards]"
                            style={{
                                left: `${Math.random() * 80 + 10}%`,
                                bottom: '50%',
                                animationDelay: `${i * 0.1}s`,
                                opacity: 0
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
