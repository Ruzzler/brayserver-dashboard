import { useState, useEffect, useRef, useCallback } from 'react';

// MugV2 — SVG-based clean pixel-art-style coffee mug character
// Matches the "Classic" mockup: white mug body, dark coffee visible inside,
// bold D-handle, symmetrical teal arms, dot eyes, smile, rosy cheeks

function MugV2SVG({ walking, phase, flipX }: { walking: boolean; phase: number; flipX: boolean }) {
    // Leg swing angles based on walk phase
    const walkCycle = walking ? Math.sin(phase * 0.18) : 0;
    const leftLegAngle = walking ? walkCycle * 30 : 0;
    const rightLegAngle = walking ? -walkCycle * 30 : 0;
    const bodyBob = walking ? Math.abs(Math.sin(phase * 0.18)) * -2 : 0;

    // Arm swing
    const leftArmAngle = walking ? walkCycle * 20 : 0;
    const rightArmAngle = walking ? -walkCycle * 20 : 0;

    // Idle gentle float
    const idleFloat = walking ? 0 : Math.sin(phase * 0.06) * 1.5;

    // Eye blink (every ~120 frames)
    const blinkPhase = phase % 140;
    const isBlinking = blinkPhase > 134;

    const scale = flipX ? 'scale(-1,1)' : 'scale(1,1)';

    return (
        <svg
            width="80"
            height="100"
            viewBox="0 0 80 100"
            style={{ imageRendering: 'pixelated', transform: `translateY(${bodyBob + idleFloat}px)` }}
        >
            <g transform={`translate(40, 50) ${scale} translate(-40, -50)`}>
                {/* ── Left Arm ── */}
                <g transform={`translate(16, 52) rotate(${leftArmAngle}, 8, 0)`}>
                    <rect x="-10" y="-4" width="14" height="8" rx="4" fill="#0d9488" />
                    <rect x="-10" y="-4" width="14" height="8" rx="4" fill="none" stroke="#0a7c72" strokeWidth="1.5" />
                </g>

                {/* ── Mug Body ── */}
                {/* Outer rim / top opening */}
                <rect x="14" y="16" width="44" height="8" rx="2" fill="#e2e8f0" stroke="#334155" strokeWidth="2.5" />
                {/* Coffee inside the rim */}
                <rect x="16" y="18" width="40" height="5" rx="1" fill="#5c3a1e" />
                {/* Coffee highlight */}
                <rect x="18" y="19" width="20" height="2" rx="1" fill="#7c5230" opacity="0.6" />

                {/* Main mug body */}
                <rect x="12" y="23" width="48" height="40" rx="5" fill="#f0f4f8" stroke="#334155" strokeWidth="2.5" />
                {/* Body inner shadow at top */}
                <rect x="14" y="23" width="44" height="4" rx="2" fill="#e2e8f0" />
                {/* Body highlight left side */}
                <rect x="15" y="28" width="6" height="28" rx="3" fill="white" opacity="0.5" />

                {/* ── Handle (D-shape) ── */}
                <path
                    d="M60 30 Q76 30 76 43 Q76 56 60 56"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
                <path
                    d="M60 30 Q72 30 72 43 Q72 56 60 56"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                    strokeLinecap="round"
                />

                {/* ── Face ── */}
                {/* Left Eye */}
                {isBlinking ? (
                    <rect x="22" y="35" width="8" height="2.5" rx="1.25" fill="#1e293b" />
                ) : (
                    <circle cx="26" cy="36" r="4" fill="#1e293b" />
                )}
                {/* Left eye shine */}
                {!isBlinking && <circle cx="28" cy="34" r="1.2" fill="white" />}

                {/* Right Eye */}
                {isBlinking ? (
                    <rect x="42" y="35" width="8" height="2.5" rx="1.25" fill="#1e293b" />
                ) : (
                    <circle cx="46" cy="36" r="4" fill="#1e293b" />
                )}
                {/* Right eye shine */}
                {!isBlinking && <circle cx="48" cy="34" r="1.2" fill="white" />}

                {/* Blush left */}
                <circle cx="20" cy="41" r="3.5" fill="#fda4af" opacity="0.65" />
                {/* Blush right */}
                <circle cx="52" cy="41" r="3.5" fill="#fda4af" opacity="0.65" />

                {/* Smile */}
                <path
                    d="M27 46 Q36 52 45 46"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />

                {/* ── Right Arm ── */}
                <g transform={`translate(55, 52) rotate(${rightArmAngle}, 0, 0)`}>
                    <rect x="-2" y="-4" width="14" height="8" rx="4" fill="#0d9488" />
                    <rect x="-2" y="-4" width="14" height="8" rx="4" fill="none" stroke="#0a7c72" strokeWidth="1.5" />
                </g>

                {/* ── Mug Bottom ── */}
                <rect x="16" y="60" width="40" height="4" rx="2" fill="#d1d5db" stroke="#334155" strokeWidth="1.5" />

                {/* ── Legs ── */}
                {/* Left Leg */}
                <g transform={`translate(26, 64) rotate(${leftLegAngle}, 4, 0)`}>
                    <rect x="0" y="0" width="9" height="16" rx="4.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                    {/* Left Foot */}
                    <rect x="-3" y="13" width="14" height="6" rx="3" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>

                {/* Right Leg */}
                <g transform={`translate(45, 64) rotate(${rightLegAngle}, 4, 0)`}>
                    <rect x="0" y="0" width="9" height="16" rx="4.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                    {/* Right Foot */}
                    <rect x="-3" y="13" width="14" height="6" rx="3" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>
            </g>
        </svg>
    );
}

// Emote bubble (reused from the main DesktopPet system)
function EmoteBubble({ emote }: { emote: string }) {
    return (
        <div className="emote-bubble">{emote}</div>
    );
}

// Main autonomous MugV2 entity that wanders the screen
export function CoffeeMugV2Pet() {
    const [x, setX] = useState(30);
    const [targetX, setTargetX] = useState(30);
    const [flipX, setFlipX] = useState(false);
    const [walking, setWalking] = useState(false);
    const [waitTimer, setWaitTimer] = useState(80);
    const [emote, setEmote] = useState<string | null>(null);
    const [_emoteTimer, setEmoteTimer] = useState(0);
    const [phase, setPhase] = useState(0);

    const requestRef = useRef<number>();

    const update = useCallback(() => {
        setPhase(p => p + 1);

        setX(prev => {
            const dx = targetX - prev;
            if (Math.abs(dx) < 0.4) return targetX;
            return prev + (dx > 0 ? 1 : -1) * 0.12;
        });

        // State machine
        if (!walking) {
            setWaitTimer(prev => {
                if (prev > 0) return prev - 1;
                // Pick new target
                const newTarget = 5 + Math.random() * 90;
                setTargetX(newTarget);
                setFlipX(() => newTarget > x);
                setWalking(true);
                return 0;
            });
        } else {
            setX(prev => {
                if (Math.abs(targetX - prev) < 0.4) {
                    setWalking(false);
                    setWaitTimer(80 + Math.random() * 250);
                    if (Math.random() > 0.85) {
                        setEmote(['❤️', '☕', '♪', '...'][Math.floor(Math.random() * 4)]);
                        setEmoteTimer(100);
                    }
                    return targetX;
                }
                return prev;
            });
        }

        setEmoteTimer(prev => {
            if (prev <= 0) return 0;
            if (prev === 1) setEmote(null);
            return prev - 1;
        });

        requestRef.current = requestAnimationFrame(update);
    }, [walking, waitTimer, targetX, x]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(update);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [update]);

    const handleClick = () => {
        setEmote('❤️');
        setEmoteTimer(100);
    };

    return (
        <div
            className="absolute pointer-events-auto cursor-pointer"
            style={{ left: `${x}%`, bottom: 0, transform: 'translate(-50%, 0)', zIndex: 10 }}
            onClick={handleClick}
        >
            {emote && <EmoteBubble emote={emote} />}
            <MugV2SVG walking={walking} phase={phase} flipX={flipX} />
        </div>
    );
}
