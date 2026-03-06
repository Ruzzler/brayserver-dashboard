import { PetWrapper } from './PetWrapper';

// French Press — tall glass body with metal frame, plunger knob on top

function FrenchPressSVG({ walking, phase, flipX }: { walking: boolean; phase: number; flipX: boolean }) {
    const walkCycle = walking ? Math.sin(phase * 0.18) : 0;
    const leftLegAngle = walking ? walkCycle * 25 : 0;
    const rightLegAngle = walking ? -walkCycle * 25 : 0;
    const bodyBob = walking ? Math.abs(Math.sin(phase * 0.18)) * -2 : 0;
    const armAngle = walking ? walkCycle * 18 : 0;
    const idleFloat = walking ? 0 : Math.sin(phase * 0.06) * 1.5;
    const isBlinking = (phase % 130) > 124;
    const scale = flipX ? 'scale(-1,1)' : 'scale(1,1)';

    return (
        <svg width="75" height="105" viewBox="0 0 75 105"
            style={{ transform: `translateY(${bodyBob + idleFloat}px)` }}>
            <g transform={`translate(37, 52) ${scale} translate(-37, -52)`}>
                {/* Left Arm */}
                <g transform={`translate(12, 52) rotate(${armAngle}, 6, 0)`}>
                    <rect x="-10" y="-4" width="14" height="8" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>

                {/* Plunger knob */}
                <circle cx="37" cy="8" r="5" fill="#9ca3af" stroke="#334155" strokeWidth="2" />
                <circle cx="37" cy="8" r="2" fill="#d1d5db" />
                {/* Plunger rod */}
                <rect x="35" y="12" width="4" height="8" rx="1" fill="#9ca3af" stroke="#334155" strokeWidth="1.5" />

                {/* Lid */}
                <rect x="16" y="18" width="42" height="8" rx="3" fill="#b0bec5" stroke="#334155" strokeWidth="2" />
                <rect x="20" y="19" width="16" height="4" rx="2" fill="#cfd8dc" opacity="0.6" />

                {/* Metal frame top bar */}
                <rect x="14" y="25" width="46" height="3" rx="1" fill="#90a4ae" stroke="#334155" strokeWidth="1.5" />

                {/* Glass body */}
                <rect x="16" y="27" width="42" height="40" rx="3" fill="#e3f2fd" stroke="#334155" strokeWidth="2.5" opacity="0.85" />
                {/* Coffee inside glass */}
                <rect x="18" y="32" width="38" height="33" rx="2" fill="#5d3a1a" />
                <rect x="18" y="32" width="38" height="4" rx="1" fill="#8b6914" opacity="0.5" />
                {/* Glass shine */}
                <rect x="19" y="29" width="5" height="30" rx="2.5" fill="white" opacity="0.3" />

                {/* Metal frame side bars */}
                <rect x="14" y="25" width="3" height="44" rx="1" fill="#90a4ae" stroke="#334155" strokeWidth="1" />
                <rect x="57" y="25" width="3" height="44" rx="1" fill="#90a4ae" stroke="#334155" strokeWidth="1" />

                {/* Handle */}
                <path d="M60 32 Q72 32 72 43 Q72 54 60 54" fill="none" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
                <path d="M60 32 Q69 32 69 43 Q69 54 60 54" fill="none" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" />

                {/* Face (on coffee) */}
                {isBlinking ? (
                    <><rect x="24" y="44" width="7" height="2" rx="1" fill="#f5f0e8" /><rect x="42" y="44" width="7" height="2" rx="1" fill="#f5f0e8" /></>
                ) : (
                    <><circle cx="28" cy="44" r="3.5" fill="#1e293b" /><circle cx="29.5" cy="42.5" r="1.2" fill="white" /><circle cx="46" cy="44" r="3.5" fill="#1e293b" /><circle cx="47.5" cy="42.5" r="1.2" fill="white" /></>
                )}
                <circle cx="22" cy="49" r="2.5" fill="#fda4af" opacity="0.5" />
                <circle cx="52" cy="49" r="2.5" fill="#fda4af" opacity="0.5" />
                <path d="M31 52 Q37 56 44 52" fill="none" stroke="#f5f0e8" strokeWidth="2" strokeLinecap="round" />

                {/* Metal frame bottom */}
                <rect x="14" y="66" width="46" height="4" rx="1" fill="#90a4ae" stroke="#334155" strokeWidth="1.5" />

                {/* Right Arm */}
                <g transform={`translate(53, 52) rotate(${-armAngle}, 0, 0)`}>
                    <rect x="-2" y="-4" width="14" height="8" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>

                {/* Legs */}
                <g transform={`translate(26, 69) rotate(${leftLegAngle}, 4, 0)`}>
                    <rect x="0" y="0" width="8" height="14" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                    <rect x="-2" y="11" width="12" height="5" rx="2.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>
                <g transform={`translate(42, 69) rotate(${rightLegAngle}, 4, 0)`}>
                    <rect x="0" y="0" width="8" height="14" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                    <rect x="-2" y="11" width="12" height="5" rx="2.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>
            </g>
        </svg>
    );
}

export function FrenchPressPet() {
    return <PetWrapper>{(props) => <FrenchPressSVG {...props} />}</PetWrapper>;
}
