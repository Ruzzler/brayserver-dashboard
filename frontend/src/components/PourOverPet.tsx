import { PetWrapper } from './PetWrapper';

// Pour Over — Chemex/V60 style dripper cone on top of glass carafe body

function PourOverSVG({ walking, phase, flipX }: { walking: boolean; phase: number; flipX: boolean }) {
    const walkCycle = walking ? Math.sin(phase * 0.18) : 0;
    const leftLegAngle = walking ? walkCycle * 25 : 0;
    const rightLegAngle = walking ? -walkCycle * 25 : 0;
    const bodyBob = walking ? Math.abs(Math.sin(phase * 0.18)) * -2 : 0;
    const armAngle = walking ? walkCycle * 18 : 0;
    const idleFloat = walking ? 0 : Math.sin(phase * 0.06) * 1.5;
    const isBlinking = (phase % 135) > 129;
    const scale = flipX ? 'scale(-1,1)' : 'scale(1,1)';
    // Drip animation
    const dripY = (phase % 60) * 0.3;
    const dripOpacity = dripY < 10 ? 1 : 0;

    return (
        <svg width="80" height="110" viewBox="0 0 80 110"
            style={{ transform: `translateY(${bodyBob + idleFloat}px)` }}>
            <g transform={`translate(40, 55) ${scale} translate(-40, -55)`}>
                {/* Left Arm */}
                <g transform={`translate(8, 56) rotate(${armAngle}, 6, 0)`}>
                    <rect x="-8" y="-4" width="13" height="7" rx="3.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>

                {/* Filter paper / rim */}
                <rect x="22" y="10" width="28" height="5" rx="2" fill="#c4a882" stroke="#a08060" strokeWidth="1.5" />

                {/* Cone dripper (V60 shape) */}
                <path d="M16 14 L26 40 L46 40 L56 14 Z" fill="#f0f8ff" stroke="#334155" strokeWidth="2.5" />
                {/* Cone highlight */}
                <path d="M20 16 L26 36 L32 36 L26 16 Z" fill="white" opacity="0.35" />

                {/* Handle on cone */}
                <path d="M56 18 Q66 18 66 27 Q66 36 56 36" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                <path d="M56 18 Q63 18 63 27 Q63 36 56 36" fill="none" stroke="#f0f8ff" strokeWidth="1.5" strokeLinecap="round" />

                {/* Face on cone */}
                {isBlinking ? (
                    <><rect x="27" y="24" width="6" height="2" rx="1" fill="#1e293b" /><rect x="40" y="24" width="6" height="2" rx="1" fill="#1e293b" /></>
                ) : (
                    <><circle cx="30" cy="24" r="3" fill="#1e293b" /><circle cx="31.5" cy="22.5" r="1" fill="white" /><circle cx="43" cy="24" r="3" fill="#1e293b" /><circle cx="44.5" cy="22.5" r="1" fill="white" /></>
                )}
                <circle cx="24" cy="29" r="2.5" fill="#fda4af" opacity="0.55" />
                <circle cx="49" cy="29" r="2.5" fill="#fda4af" opacity="0.55" />
                <path d="M31 31 Q36 35 42 31" fill="none" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />

                {/* Collar / waist piece */}
                <rect x="26" y="40" width="20" height="4" rx="1" fill="#f0f8ff" stroke="#334155" strokeWidth="1.5" />

                {/* Coffee drip */}
                <circle cx="36" cy={46 + dripY} r="2" fill="#5c3a1e" opacity={dripOpacity} />

                {/* Glass carafe body */}
                <path d="M18 44 Q14 60 14 68 Q14 74 22 74 L50 74 Q58 74 58 68 Q58 60 54 44 Z"
                    fill="#e3f2fd" stroke="#334155" strokeWidth="2" opacity="0.8" />
                {/* Coffee inside carafe */}
                <path d="M20 58 Q17 66 17 70 Q17 72 22 72 L50 72 Q55 72 55 70 Q55 66 52 58 Z"
                    fill="#5c3a1e" />
                <path d="M22 58 L26 58 Q23 64 22 68 Z" fill="#7c5230" opacity="0.3" />
                {/* Glass shine */}
                <rect x="20" y="46" width="4" height="22" rx="2" fill="white" opacity="0.25" />

                {/* Right Arm */}
                <g transform={`translate(56, 56) rotate(${-armAngle}, 0, 0)`}>
                    <rect x="-2" y="-4" width="13" height="7" rx="3.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>

                {/* Carafe bottom */}
                <rect x="18" y="73" width="36" height="4" rx="2" fill="#cfd8dc" stroke="#334155" strokeWidth="1.5" />

                {/* Legs */}
                <g transform={`translate(28, 76) rotate(${leftLegAngle}, 4, 0)`}>
                    <rect x="0" y="0" width="8" height="14" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                    <rect x="-2" y="11" width="12" height="5" rx="2.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>
                <g transform={`translate(44, 76) rotate(${rightLegAngle}, 4, 0)`}>
                    <rect x="0" y="0" width="8" height="14" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                    <rect x="-2" y="11" width="12" height="5" rx="2.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>
            </g>
        </svg>
    );
}

export function PourOverPet() {
    return <PetWrapper>{(props) => <PourOverSVG {...props} />}</PetWrapper>;
}
