import { PetWrapper } from './PetWrapper';

// Takeout Cup — paper cup with cardboard sleeve, dome lid, steam wisps, café logo

function TakeoutCupSVG({ walking, phase, flipX }: { walking: boolean; phase: number; flipX: boolean }) {
    const walkCycle = walking ? Math.sin(phase * 0.18) : 0;
    const leftLegAngle = walking ? walkCycle * 28 : 0;
    const rightLegAngle = walking ? -walkCycle * 28 : 0;
    const bodyBob = walking ? Math.abs(Math.sin(phase * 0.18)) * -2 : 0;
    const armAngle = walking ? walkCycle * 20 : 0;
    const idleFloat = walking ? 0 : Math.sin(phase * 0.06) * 1.5;
    const isBlinking = (phase % 145) > 139;
    const scale = flipX ? 'scale(-1,1)' : 'scale(1,1)';
    // Steam animation
    const steam1Y = 6 - (phase % 40) * 0.25;
    const steam2Y = 8 - ((phase + 20) % 40) * 0.25;
    const steamOp1 = Math.max(0, 1 - (phase % 40) * 0.04);
    const steamOp2 = Math.max(0, 1 - ((phase + 20) % 40) * 0.04);

    return (
        <svg width="75" height="105" viewBox="0 0 75 105"
            style={{ transform: `translateY(${bodyBob + idleFloat}px)` }}>
            <g transform={`translate(37, 52) ${scale} translate(-37, -52)`}>
                {/* Steam */}
                <path d={`M28 ${steam1Y} Q32 ${steam1Y - 4} 28 ${steam1Y - 8}`} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity={steamOp1 * 0.6} />
                <path d={`M38 ${steam2Y} Q34 ${steam2Y - 5} 38 ${steam2Y - 9}`} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity={steamOp2 * 0.6} />
                <path d={`M46 ${steam1Y + 2} Q50 ${steam1Y - 2} 46 ${steam1Y - 6}`} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity={steamOp1 * 0.5} />

                {/* Left Arm */}
                <g transform={`translate(12, 48) rotate(${armAngle}, 6, 0)`}>
                    <rect x="-8" y="-4" width="13" height="8" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>

                {/* Dome lid */}
                <ellipse cx="37" cy="16" rx="22" ry="6" fill="#6d4c2a" stroke="#334155" strokeWidth="2" />
                <ellipse cx="37" cy="14" rx="20" ry="5" fill="#8b6336" />
                <ellipse cx="30" cy="13" rx="8" ry="2.5" fill="#a07742" opacity="0.5" />
                {/* Sip hole */}
                <ellipse cx="37" cy="12" rx="4" ry="2" fill="#4a3218" />

                {/* Cup body (slightly tapered) */}
                <path d="M14 20 L18 68 L56 68 L60 20 Z" fill="#f0f4f8" stroke="#334155" strokeWidth="2.5" />
                {/* Upper cup highlight */}
                <path d="M16 20 L17 32 L26 32 L25 20 Z" fill="white" opacity="0.3" />

                {/* Cardboard sleeve */}
                <path d="M16 34 L18 58 L56 58 L58 34 Z" fill="#b8860b" stroke="#8b6914" strokeWidth="1.5" />
                {/* Sleeve texture lines */}
                <line x1="20" y1="36" x2="21" y2="56" stroke="#9a7512" strokeWidth="0.8" opacity="0.4" />
                <line x1="26" y1="36" x2="27" y2="56" stroke="#9a7512" strokeWidth="0.8" opacity="0.4" />
                <line x1="47" y1="36" x2="48" y2="56" stroke="#9a7512" strokeWidth="0.8" opacity="0.4" />
                <line x1="53" y1="36" x2="54" y2="56" stroke="#9a7512" strokeWidth="0.8" opacity="0.4" />

                {/* Café logo circle */}
                <circle cx="37" cy="47" r="8" fill="#0d7377" stroke="#0a5c5f" strokeWidth="1.5" />
                <circle cx="37" cy="47" r="5.5" fill="#0d7377" stroke="#f0f4f8" strokeWidth="0.8" />
                {/* Coffee bean in logo */}
                <ellipse cx="37" cy="47" rx="3" ry="2.2" fill="#4a2c17" />
                <line x1="37" y1="45" x2="37" y2="49" stroke="#2d1a0e" strokeWidth="0.8" />

                {/* Face (above sleeve) */}
                {isBlinking ? (
                    <><rect x="24" y="27" width="7" height="2" rx="1" fill="#1e293b" /><rect x="42" y="27" width="7" height="2" rx="1" fill="#1e293b" /></>
                ) : (
                    <><circle cx="28" cy="27" r="3.5" fill="#1e293b" /><circle cx="29.5" cy="25.5" r="1.1" fill="white" /><circle cx="46" cy="27" r="3.5" fill="#1e293b" /><circle cx="47.5" cy="25.5" r="1.1" fill="white" /></>
                )}
                <circle cx="21" cy="31" r="2.5" fill="#fda4af" opacity="0.55" />
                <circle cx="53" cy="31" r="2.5" fill="#fda4af" opacity="0.55" />
                <path d="M31 32 Q37 36 44 32" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

                {/* Right Arm */}
                <g transform={`translate(55, 48) rotate(${-armAngle}, 0, 0)`}>
                    <rect x="-2" y="-4" width="13" height="8" rx="4" fill="#0d9488" stroke="#0a7c72" strokeWidth="1.5" />
                </g>

                {/* Cup bottom */}
                <rect x="20" y="66" width="34" height="4" rx="2" fill="#e2e8f0" stroke="#334155" strokeWidth="1.5" />

                {/* Legs */}
                <g transform={`translate(27, 69) rotate(${leftLegAngle}, 4, 0)`}>
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

export function TakeoutCupPet() {
    return <PetWrapper>{(props) => <TakeoutCupSVG {...props} />}</PetWrapper>;
}
