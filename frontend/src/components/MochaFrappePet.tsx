import { PetWrapper } from './PetWrapper';

// Mocha Frappé — tall layered glass with whipped cream, cherry, straw, chocolate drizzle

function MochaFrappeSVG({ walking, phase, flipX }: { walking: boolean; phase: number; flipX: boolean }) {
    const walkCycle = walking ? Math.sin(phase * 0.18) : 0;
    const leftLegAngle = walking ? walkCycle * 25 : 0;
    const rightLegAngle = walking ? -walkCycle * 25 : 0;
    const bodyBob = walking ? Math.abs(Math.sin(phase * 0.18)) * -2 : 0;
    const armAngle = walking ? walkCycle * 18 : 0;
    const idleFloat = walking ? 0 : Math.sin(phase * 0.06) * 1.5;
    const isBlinking = (phase % 125) > 119;
    const scale = flipX ? 'scale(-1,1)' : 'scale(1,1)';

    return (
        <svg width="72" height="110" viewBox="0 0 72 110"
            style={{ transform: `translateY(${bodyBob + idleFloat}px)` }}>
            <g transform={`translate(36, 55) ${scale} translate(-36, -55)`}>
                {/* Left Arm */}
                <g transform={`translate(10, 52) rotate(${armAngle}, 6, 0)`}>
                    <rect x="-8" y="-4" width="13" height="7" rx="3.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>

                {/* Straw (behind whipped cream) */}
                <rect x="44" y="4" width="4" height="60" rx="2" fill="#e74c3c" stroke="#c0392b" strokeWidth="1" transform="rotate(12, 46, 30)" />
                {/* Straw stripes */}
                <rect x="44" y="10" width="4" height="3" rx="1" fill="white" opacity="0.8" transform="rotate(12, 46, 30)" />
                <rect x="44" y="18" width="4" height="3" rx="1" fill="white" opacity="0.8" transform="rotate(12, 46, 30)" />
                <rect x="44" y="26" width="4" height="3" rx="1" fill="white" opacity="0.8" transform="rotate(12, 46, 30)" />

                {/* Glass body (tall, slightly tapered) */}
                <path d="M14 24 L18 72 L54 72 L58 24 Z" fill="#e3f2fd" stroke="#334155" strokeWidth="2.5" opacity="0.8" />

                {/* Chocolate layer (bottom) */}
                <path d="M19 58 L20 70 L52 70 L53 58 Z" fill="#3e1e0a" />
                {/* Coffee layer (middle) */}
                <path d="M17 36 L19 58 L53 58 L55 36 Z" fill="#6f4e37" />
                <path d="M17 36 L18 42 L54 42 L55 36 Z" fill="#8b6914" opacity="0.3" />
                {/* Glass highlight */}
                <rect x="19" y="26" width="4" height="40" rx="2" fill="white" opacity="0.25" />

                {/* Whipped cream mound */}
                <ellipse cx="36" cy="24" rx="22" ry="8" fill="#fef9c3" stroke="#334155" strokeWidth="2" />
                <ellipse cx="36" cy="20" rx="18" ry="6" fill="#fffde4" />
                <ellipse cx="36" cy="16" rx="12" ry="5" fill="white" />
                {/* Cream highlights */}
                <ellipse cx="30" cy="15" rx="5" ry="2.5" fill="white" opacity="0.6" />

                {/* Chocolate drizzle */}
                <path d="M24 20 Q28 24 32 20 Q36 16 40 20 Q44 24 48 20" fill="none" stroke="#5c3a1e" strokeWidth="1.8" strokeLinecap="round" />

                {/* Cherry */}
                <circle cx="36" cy="10" r="5" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                <circle cx="34" cy="8" r="1.5" fill="#fca5a5" opacity="0.6" />
                {/* Cherry stem */}
                <path d="M36 5 Q34 1 38 0" fill="none" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />

                {/* Face (on coffee area) */}
                {isBlinking ? (
                    <><rect x="22" y="44" width="7" height="2" rx="1" fill="#f5f0e8" /><rect x="40" y="44" width="7" height="2" rx="1" fill="#f5f0e8" /></>
                ) : (
                    <><circle cx="26" cy="44" r="3.5" fill="#1e293b" /><circle cx="27.5" cy="42.5" r="1.1" fill="white" /><circle cx="44" cy="44" r="3.5" fill="#1e293b" /><circle cx="45.5" cy="42.5" r="1.1" fill="white" /></>
                )}
                <circle cx="19" cy="49" r="2.5" fill="#fda4af" opacity="0.5" />
                <circle cx="51" cy="49" r="2.5" fill="#fda4af" opacity="0.5" />
                {/* Open mouth happy smile */}
                <path d="M28 52 Q36 58 44 52" fill="#2d1a0e" stroke="#f5f0e8" strokeWidth="1.5" strokeLinecap="round" />

                {/* Right Arm */}
                <g transform={`translate(54, 52) rotate(${-armAngle}, 0, 0)`}>
                    <rect x="-2" y="-4" width="13" height="7" rx="3.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>

                {/* Glass bottom */}
                <rect x="20" y="70" width="32" height="4" rx="2" fill="#cfd8dc" stroke="#334155" strokeWidth="1.5" />

                {/* Legs */}
                <g transform={`translate(26, 73) rotate(${leftLegAngle}, 4, 0)`}>
                    <rect x="0" y="0" width="8" height="13" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                    <rect x="-2" y="10" width="12" height="5" rx="2.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>
                <g transform={`translate(40, 73) rotate(${rightLegAngle}, 4, 0)`}>
                    <rect x="0" y="0" width="8" height="13" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                    <rect x="-2" y="10" width="12" height="5" rx="2.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>
            </g>
        </svg>
    );
}

export function MochaFrappePet() {
    return <PetWrapper>{(props) => <MochaFrappeSVG {...props} />}</PetWrapper>;
}
