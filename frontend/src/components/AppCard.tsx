import { useEffect, useState } from 'react';
import { AppItem, AppStatus } from '../data/apps';

interface AppCardProps {
    app: AppItem;
}

export function AppCard({ app }: AppCardProps) {
    const [status, setStatus] = useState<AppStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchStatus = async () => {
            try {
                const response = await fetch(`/api/${app.id}/status`);
                if (!response.ok) throw new Error('Status fetch failed');
                const data: AppStatus = await response.json();
                if (isMounted) {
                    setStatus(data);
                    setLoading(false);
                }
            } catch {
                if (isMounted) {
                    setStatus({ online: false });
                    setLoading(false);
                }
            }
        };

        fetchStatus();
        // Poll every 30 seconds
        const interval = setInterval(fetchStatus, 30000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [app.id]);

    const IconComponent = app.icon;

    return (
        <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-card/60 border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 backdrop-blur-md transition-all duration-300 hover:bg-card/80 hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 overflow-hidden cursor-pointer"
        >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <div className="w-12 h-12 flex items-center justify-center bg-black/20 rounded-xl flex-shrink-0 relative z-10 text-muted-foreground group-hover:text-primary transition-colors">
                {app.iconUrl && !imageError ? (
                    <img
                        src={app.iconUrl}
                        alt={app.name}
                        className="w-8 h-8 object-contain"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <IconComponent className="w-8 h-8" />
                )}
            </div>

            <div className="flex flex-col gap-1 relative z-10 flex-grow min-w-0">
                <h3 className="text-lg font-medium leading-tight m-0 tracking-tight text-foreground truncate">
                    {app.name}
                </h3>

                <div className="flex items-center gap-3 text-sm flex-wrap">
                    {loading ? (
                        <p className="text-muted-foreground flex items-center gap-1.5 m-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse"></span> Checking...
                        </p>
                    ) : status?.online ? (
                        <>
                            <p className="text-muted-foreground flex items-center gap-1.5 m-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Online
                            </p>
                            {status.stats && status.stats.filter(stat => {
                                // If widgetPreferences is undefined, user hasn't touched the settings yet, so default to true.
                                // If it is defined, check if this stat's ID is in the array.
                                if (app.widgetPreferences === undefined) return true;
                                return app.widgetPreferences.includes(stat.id);
                            }).map((stat, idx) => (
                                <p key={idx} className="text-muted-foreground m-0 flex items-center gap-1 whitespace-nowrap">
                                    <span className="opacity-50 tracking-wider text-[10px] uppercase font-semibold">{stat.label}</span>
                                    <span style={{ color: stat.color }} className="font-medium">{stat.value}</span>
                                </p>
                            ))}
                        </>
                    ) : (
                        <p className="text-muted-foreground flex items-center gap-1.5 m-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Offline
                        </p>
                    )}
                </div>
            </div>
        </a>
    );
}
