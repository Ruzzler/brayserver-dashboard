import { PetWrapper } from './PetWrapper';

// Latte Art Bowl — wide ceramic bowl with heart latte art foam on top

function LatteArtSVG({ walking, phase, flipX }: { walking: boolean; phase: number; flipX: boolean }) {
    const walkCycle = walking ? Math.sin(phase * 0.18) : 0;
    const leftLegAngle = walking ? walkCycle * 28 : 0;
    const rightLegAngle = walking ? -walkCycle * 28 : 0;
    const bodyBob = walking ? Math.abs(Math.sin(phase * 0.18)) * -2 : 0;
    const armAngle = walking ? walkCycle * 18 : 0;
    const idleFloat = walking ? 0 : Math.sin(phase * 0.06) * 1.5;
    const isBlinking = (phase % 150) > 144;
    const scale = flipX ? 'scale(-1,1)' : 'scale(1,1)';

    return (
        <svg width="90" height="95" viewBox="0 0 90 95"
            style={{ transform: `translateY(${bodyBob + idleFloat}px)` }}>
            <g transform={`translate(45, 47) ${scale} translate(-45, -47)`}>
                {/* Left Arm */}
                <g transform={`translate(10, 46) rotate(${armAngle}, 6, 0)`}>
                    <rect x="-8" y="-4" width="14" height="8" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>

                {/* Bowl body — wide and rounded */}
                <ellipse cx="45" cy="40" rx="34" ry="22" fill="#f5f0e8" stroke="#334155" strokeWidth="2.5" />
                {/* Ceramic highlight */}
                <ellipse cx="30" cy="34" rx="8" ry="14" fill="white" opacity="0.35" />

                {/* Foam surface */}
                <ellipse cx="45" cy="26" rx="28" ry="10" fill="#f5f5dc" stroke="#334155" strokeWidth="2" />

                {/* Latte art heart */}
                <path d="M39 24 Q39 20 42 20 Q45 20 45 24 Q45 20 48 20 Q51 20 51 24 Q51 28 45 32 Q39 28 39 24Z"
                    fill="#c4956a" stroke="#a0784e" strokeWidth="0.8" />
                {/* Heart highlight */}
                <circle cx="42" cy="22" r="1" fill="#d4a574" opacity="0.7" />

                {/* Handle (small) */}
                <path d="M76 34 Q86 34 86 42 Q86 50 76 50" fill="none" stroke="#334155" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M76 34 Q83 34 83 42 Q83 50 76 50" fill="none" stroke="#f5f0e8" strokeWidth="1.5" strokeLinecap="round" />

                {/* Face */}
                {isBlinking ? (
                    <><rect x="30" y="38" width="7" height="2" rx="1" fill="#1e293b" /><rect x="50" y="38" width="7" height="2" rx="1" fill="#1e293b" /></>
                ) : (
                    <><circle cx="34" cy="38" r="3.5" fill="#1e293b" /><circle cx="35.5" cy="36.5" r="1" fill="white" /><circle cx="54" cy="38" r="3.5" fill="#1e293b" /><circle cx="55.5" cy="36.5" r="1" fill="white" /></>
                )}
                {/* Blush */}
                <circle cx="27" cy="43" r="3" fill="#fda4af" opacity="0.6" />
                <circle cx="61" cy="43" r="3" fill="#fda4af" opacity="0.6" />
                {/* Smile */}
                <path d="M37 46 Q45 51 53 46" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

                {/* Right Arm */}
                <g transform={`translate(70, 46) rotate(${-armAngle}, 0, 0)`}>
                    <rect x="-2" y="-4" width="14" height="8" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>

                {/* Bowl bottom */}
                <ellipse cx="45" cy="58" rx="18" ry="4" fill="#e0dcd0" stroke="#334155" strokeWidth="1.5" />

                {/* Legs */}
                <g transform={`translate(33, 60) rotate(${leftLegAngle}, 4, 0)`}>
                    <rect x="0" y="0" width="8" height="14" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                    <rect x="-3" y="11" width="13" height="5" rx="2.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>
                <g transform={`translate(50, 60) rotate(${rightLegAngle}, 4, 0)`}>
                    <rect x="0" y="0" width="8" height="14" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                    <rect x="-3" y="11" width="13" height="5" rx="2.5" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>
            </g>
        </svg>
    );
}

export function LatteArtPet() {
    return <PetWrapper>{(props) => <LatteArtSVG {...props} />}</PetWrapper>;
}
