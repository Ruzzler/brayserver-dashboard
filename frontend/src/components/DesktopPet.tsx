import { useState, useEffect, useRef, useCallback } from 'react';

type EntityType = 'sprout' | 'chicken' | 'cow' | 'agent' | 'bmo' | 'coffee' | 'object';
type EntityState = 'idle' | 'walk' | 'axe' | 'pickaxe' | 'water' | 'open' | 'closed';
type Direction = 'down' | 'up' | 'left' | 'right';

interface Entity {
    id: string;
    type: EntityType;
    agentIndex?: number;
    subType?: string;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    state: EntityState;
    direction: Direction;
    flipX: boolean;
    speed: number;
    waitTimer: number;
    emote?: string | null;
    emoteTimer: number;
}

export function DesktopPet({ petType = "bmo" }: { petType?: "bmo" | "coffee_mug" | "sprout" }) {
    const [entities, setEntities] = useState<Entity[]>([]);
    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial Entity Setup
    useEffect(() => {
        const initialEntities: Entity[] = [];

        if (petType === 'sprout') {
            initialEntities.push({
                id: 'sprout-1',
                type: 'sprout',
                x: 30,
                y: 0,
                targetX: 30,
                targetY: 0,
                state: 'idle',
                direction: 'down',
                flipX: false,
                speed: 0.15,
                waitTimer: 100,
                emoteTimer: 0
            });

            // Add some agents
            for (let i = 0; i < 2; i++) {
                initialEntities.push({
                    id: `agent-${i}`,
                    type: 'agent',
                    agentIndex: Math.floor(Math.random() * 6),
                    x: 40 + i * 20,
                    y: 0,
                    targetX: 40 + i * 20,
                    targetY: 0,
                    state: 'idle',
                    direction: 'down',
                    flipX: false,
                    speed: 0.1,
                    waitTimer: 150 + Math.random() * 200,
                    emoteTimer: 0
                });
            }

            // Add some chickens
            for (let i = 0; i < 2; i++) {
                initialEntities.push({
                    id: `chicken-${i}`,
                    type: 'chicken',
                    x: 10 + Math.random() * 80,
                    y: 0,
                    targetX: 20 + Math.random() * 60,
                    targetY: 0,
                    state: 'idle',
                    direction: 'down',
                    flipX: false,
                    speed: 0.08,
                    waitTimer: Math.random() * 200,
                    emoteTimer: 0
                });
            }
            // Add a cow
            initialEntities.push({
                id: 'cow-1',
                type: 'cow',
                x: 70,
                y: 0,
                targetX: 70,
                targetY: 0,
                state: 'idle',
                direction: 'down',
                flipX: false,
                speed: 0.05,
                waitTimer: 500,
                emoteTimer: 0
            });
            // Add objects
            initialEntities.push({
                id: 'chest-1',
                type: 'object',
                subType: 'chest',
                x: 20,
                y: 0,
                targetX: 20,
                targetY: 0,
                state: 'closed',
                direction: 'down',
                flipX: false,
                speed: 0,
                waitTimer: 0,
                emoteTimer: 0
            });
            initialEntities.push({
                id: 'plant-1',
                type: 'object',
                subType: 'plant',
                x: 80,
                y: 0,
                targetX: 80,
                targetY: 0,
                state: 'closed',
                direction: 'down',
                flipX: false,
                speed: 0,
                waitTimer: 0,
                emoteTimer: 0
            });
        } else {
            // Legacy pets (BMO, Coffee)
            initialEntities.push({
                id: 'legacy-1',
                type: petType === 'coffee_mug' ? 'coffee' : 'bmo',
                x: 50,
                y: 0,
                targetX: 50,
                targetY: 0,
                state: 'idle',
                direction: 'down',
                flipX: false,
                speed: 0.12,
                waitTimer: 100,
                emoteTimer: 0
            });
        }

        setEntities(initialEntities);
    }, [petType]);

    const updateGame = useCallback((time: number) => {
        if (previousTimeRef.current !== undefined) {
            setEntities(prev => prev.map(entity => {
                const next = { ...entity };

                // Emote timer
                if (next.emoteTimer > 0) {
                    next.emoteTimer--;
                    if (next.emoteTimer === 0) next.emote = null;
                }

                if (next.type === 'object') return next;

                // AI state machine
                if (next.state === 'idle') {
                    if (next.waitTimer > 0) {
                        next.waitTimer--;
                    } else {
                        // Pick a new target
                        next.targetX = 5 + Math.random() * 90;
                        next.state = 'walk';
                        next.flipX = next.targetX > next.x;
                        next.direction = next.flipX ? 'right' : 'left';

                        // Vertical direction chance for variety (mostly for sprites that handle it)
                        if (next.type === 'agent' || next.type === 'sprout') {
                            const randDir = Math.random();
                            if (randDir > 0.8) next.direction = 'up';
                            else if (randDir > 0.6) next.direction = 'down';
                        }
                    }
                } else if (next.state === 'walk') {
                    const dx = next.targetX - next.x;
                    if (Math.abs(dx) < 0.5) {
                        next.x = next.targetX;
                        next.state = 'idle';
                        next.waitTimer = 100 + Math.random() * 300;

                        // Change facing when stopping
                        if (next.type === 'agent' || next.type === 'sprout') {
                            next.direction = Math.random() > 0.5 ? 'down' : 'up';
                        }

                        // Random chance to emote
                        if (Math.random() > 0.9) {
                            next.emote = ['?', '!', '❤️', '...', '♪'][Math.floor(Math.random() * 5)];
                            next.emoteTimer = 120;
                        }
                    } else {
                        next.x += (dx > 0 ? 1 : -1) * next.speed;
                    }
                } else if (['axe', 'pickaxe', 'water'].includes(next.state)) {
                    if (next.waitTimer > 0) {
                        next.waitTimer--;
                    } else {
                        next.state = 'idle';
                        next.waitTimer = 60;
                    }
                }

                return next;
            }));
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(updateGame);
    }, []);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updateGame);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [updateGame]);

    const handleEntityClick = (id: string) => {
        setEntities(prev => prev.map(e => {
            if (e.id === id) {
                if (e.type === 'sprout') {
                    const actions: EntityState[] = ['axe', 'pickaxe', 'water'];
                    const newState = actions[Math.floor(Math.random() * actions.length)];
                    return { ...e, state: newState, waitTimer: 80 };
                }
                if (e.type === 'object') {
                    return { ...e, state: e.state === 'closed' ? 'open' : 'closed', emote: e.state === 'closed' ? '✨' : null, emoteTimer: 60 };
                }
                if (e.type === 'cow') return { ...e, emote: 'MOO!', emoteTimer: 100 };
                if (e.type === 'chicken') return { ...e, emote: 'Cluck!', emoteTimer: 100 };
                if (e.type === 'agent') return { ...e, emote: ['Hello!', 'Ping!', 'Agreed!', 'Ready!'][Math.floor(Math.random() * 4)], emoteTimer: 100 };
                return { ...e, emote: '❤️', emoteTimer: 100 };
            }
            return e;
        }));
    };

    const getSpriteSheet = (entity: Entity) => {
        if (entity.type === 'sprout') {
            if (['axe', 'pickaxe', 'water'].includes(entity.state)) return "url('/pets/sprout_actions.png')";
            return "url('/pets/sprout_base.png')";
        }
        if (entity.type === 'chicken') return "url('/pets/chicken.png')";
        if (entity.type === 'cow') return "url('/pets/cow.png')";
        if (entity.type === 'agent') return `url('/pets/agent_${entity.agentIndex}.png')`;
        if (entity.type === 'object') {
            return entity.subType === 'chest' ? "url('/pets/chest.png')" : "url('/pets/plants.png')";
        }
        return `url('/pets/${entity.type}_${entity.state === 'walk' ? 'walk' : 'idle'}.png')`;
    };

    const getSpriteClass = (entity: Entity) => {
        if (entity.type === 'sprout') {
            if (entity.state === 'walk') return `sprout-walk-${entity.direction}`;
            if (entity.state === 'axe') return 'sprout-axe';
            if (entity.state === 'pickaxe') return 'sprout-pickaxe';
            if (entity.state === 'water') return 'sprout-water';
            return `sprout-idle-${entity.direction}`;
        }
        if (entity.type === 'agent') {
            const suffix = entity.state === 'walk' ? `walk-${entity.direction === 'up' ? 'up' : entity.direction === 'down' ? 'down' : 'right'}` : `idle-${entity.direction === 'up' ? 'up' : 'down'}`;
            return `agent-${suffix}`;
        }
        if (entity.type === 'chicken') return entity.state === 'walk' ? 'chicken-walk' : 'chicken-idle';
        if (entity.type === 'cow') return entity.state === 'walk' ? 'cow-walk' : 'cow-idle';
        if (entity.type === 'object') {
            if (entity.subType === 'chest') return `object-chest-${entity.state}`;
            return `object-plant-${entity.state === 'open' ? 'tall' : 'short'}`;
        }
        return entity.state === 'walk' ? 'pet-walk' : 'pet-idle';
    };

    return (
        <div ref={containerRef} className="absolute top-0 w-full h-0 pointer-events-none z-50">
            {entities.map(entity => (
                <div
                    key={entity.id}
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{
                        left: `${entity.x}%`,
                        bottom: 0,
                        transform: `translate(-50%, 0)`,
                        zIndex: 10
                    }}
                    onClick={() => handleEntityClick(entity.id)}
                >
                    {entity.emote && (
                        <div className="emote-bubble">{entity.emote}</div>
                    )}
                    <div className={(entity.type !== 'agent' && entity.flipX) || (entity.type === 'agent' && entity.direction === 'left') ? '-scale-x-100 transition-transform duration-200' : 'transition-transform duration-200'}>
                        <div
                            className={`${entity.type}-sprite ${getSpriteClass(entity)}`}
                            style={{
                                backgroundImage: getSpriteSheet(entity),
                                transform: 'scale(0.4)',
                                transformOrigin: 'bottom center'
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
