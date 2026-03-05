import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

type PetAction = "idle" | "blink" | "look_left" | "look_right" | "walk" | "happy" | "inflate" | "water";

export function DesktopPet({ petType = "bmo" }: { petType?: "bmo" | "coffee_mug" }) {
    const [interactions, setInteractions] = useState(0);
    const [currentAction, setCurrentAction] = useState<PetAction>('idle');
    const [position, setPosition] = useState(petType === 'bmo' ? 45 : 55);
    const [flipX, setFlipX] = useState(false);
    const [isWalking, setIsWalking] = useState(false);
    const [walkDuration, setWalkDuration] = useState(0);

    const charName = petType === 'coffee_mug' ? 'coffee' : 'bmo';

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const loop = () => {
            if (interactions > 0) {
                setIsWalking(false);
                setCurrentAction('happy');
                setInteractions(prev => prev - 1);
                timeout = setTimeout(loop, 400);
                return;
            }

            const rand = Math.random();

            if (rand > 0.7) {
                const step = Math.random() > 0.5 ? 1 : -1;
                const dist = Math.floor(Math.random() * 20) + 10;
                const newPos = Math.max(5, Math.min(95, position + (step * dist)));

                const calcDuration = Math.abs(newPos - position) * 0.1;
                setWalkDuration(calcDuration);
                setFlipX(step > 0);
                setIsWalking(true);

                setCurrentAction('walk');
                setPosition(newPos);

                timeout = setTimeout(() => {
                    setIsWalking(false);
                    setCurrentAction('idle');
                    timeout = setTimeout(loop, 1000 + Math.random() * 2000);
                }, calcDuration * 1000);

                return;
            }

            if (rand > 0.55 && !isWalking) {
                setCurrentAction('inflate');
                timeout = setTimeout(() => {
                    setCurrentAction('idle');
                    timeout = setTimeout(loop, 1000 + Math.random() * 2000);
                }, 1000);
                return;
            }

            if (rand > 0.4 && !isWalking) {
                setCurrentAction('water');
                timeout = setTimeout(() => {
                    setCurrentAction('idle');
                    timeout = setTimeout(loop, 1000 + Math.random() * 2000);
                }, 1600);
                return;
            }

            if (rand > 0.3) {
                setCurrentAction('blink');
                timeout = setTimeout(() => {
                    setCurrentAction('idle');
                    timeout = setTimeout(loop, 1500 + Math.random() * 2000);
                }, 300);
            } else if (rand > 0.15) {
                setCurrentAction('look_left');
                timeout = setTimeout(() => {
                    setCurrentAction('look_right');
                    timeout = setTimeout(() => {
                        setCurrentAction('idle');
                        timeout = setTimeout(loop, 1000 + Math.random() * 2000);
                    }, 500);
                }, 500);
            } else {
                setCurrentAction('idle');
                timeout = setTimeout(loop, 1000 + Math.random() * 2000);
            }
        };

        timeout = setTimeout(loop, 2000);
        return () => clearTimeout(timeout);
    }, [position, interactions, isWalking]);

    const getSpriteClass = () => {
        switch (currentAction) {
            case 'walk': return 'pet-walk';
            case 'inflate': return 'pet-inflate';
            case 'water': return 'pet-water';
            case 'blink': return 'pet-blink';
            default: return 'pet-idle';
        }
    };

    return (
        <div
            className="absolute top-0 pointer-events-none"
            style={{
                left: `${position}%`,
                transform: 'translate(-50%, -100%)',
                transition: isWalking ? `left ${walkDuration}s linear` : 'none'
            }}
        >
            <div
                className="w-16 h-16 cursor-pointer pointer-events-auto group relative flex items-center justify-center transform origin-bottom"
                onClick={() => setInteractions(3)}
            >
                <div className={`absolute bottom-0 z-10 transition-transform duration-200 ${interactions === 0 && !isWalking ? 'hover:scale-110 hover:-translate-y-2' : ''} ${flipX ? '-scale-x-100' : ''}`}>
                    <div
                        className={`desktop-pet-sprite ${getSpriteClass()}`}
                        style={{ backgroundImage: `url('/pets/${charName}_${currentAction}.png')`, transform: 'scale(0.4)', transformOrigin: 'bottom center' }}
                    />
                </div>

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
