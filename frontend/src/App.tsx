import { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { Header } from './components/Header';
import * as Icons from 'lucide-react';
import { formatIconName } from './lib/utils';
import { WeatherWidget } from './components/WeatherWidget';
import { WorkspaceViewer } from './components/WorkspaceViewer';
import { GlanceWidget } from './data/apps';
import { GlanceWidgetsRow } from './components/GlanceWidgets';

interface AppItem {
  id: string;
  name: string;
  url: string;
  iconType: 'image' | 'icon';
  icon: string;
  categoryId: string;
  ignoreWorkspace?: boolean;
}

interface Category {
  id: string;
  name: string;
  order: number;
}

interface Config {
  serverName: string;
  serverIcon?: string;
  headerLayout?: "classic" | "minimalist" | "split" | "sidebar";
  themeColor?: "zinc" | "slate" | "emerald" | "blue" | "rose" | "violet" | "amber";
  appCardStyle?: "glass" | "solid" | "outline";
  appCardLayout?: "grid" | "list" | "minimal";
  appCardSize?: "small" | "medium" | "large";
  enableWeather?: boolean;
  enableWorkspaceMode?: boolean;
  weatherLocation?: string;
  weatherUnit?: string;
  categories: Category[];
  apps: AppItem[];
  glanceWidgets?: GlanceWidget[];
}

function AppCard({ app, style = 'glass', layout = 'grid', size = 'medium', onOpenWorkspace }: { app: AppItem, style?: string, layout?: string, size?: string, onOpenWorkspace?: (app: AppItem) => void }) {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [stats, setStats] = useState<any[] | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/${app.id}/status`);
        if (res.ok) {
          const data = await res.json();
          setIsOnline(data.online);
          setLatency(data.latency ?? null);
          if (data.stats) setStats(data.stats);
        } else {
          setIsOnline(false);
        }
      } catch (e) {
        setIsOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [app.id]);

  let iconElement = null;
  const isMinimal = layout === 'minimal';
  const isList = layout === 'list';

  // --- Dynamic Sizing ---
  const sizeClasses = {
    small: {
      card: isMinimal ? "p-3" : isList ? "p-3 gap-3" : "p-4 gap-3",
      iconBox: isMinimal ? "w-10 h-10" : "w-10 h-10",
      iconAsset: "w-5 h-5",
      title: "text-base",
      stats: "text-[10px]"
    },
    medium: {
      card: isMinimal ? "p-4" : isList ? "p-4 gap-4" : "p-6 gap-5",
      iconBox: isMinimal ? "w-14 h-14" : "w-14 h-14",
      iconAsset: "w-8 h-8",
      title: "text-lg",
      stats: "text-xs"
    },
    large: {
      card: isMinimal ? "p-6" : isList ? "p-5 gap-6" : "p-8 gap-6",
      iconBox: isMinimal ? "w-20 h-20" : "w-16 h-16",
      iconAsset: "w-10 h-10",
      title: "text-xl",
      stats: "text-sm"
    }
  };
  const activeSizes = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.medium;

  if (app.iconType === 'image') {
    iconElement = (
      <img
        src={app.icon}
        className={`${activeSizes.iconAsset} object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110`}
        alt={app.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${app.name}&background=random&color=fff&rounded=true&bold=true`;
        }}
      />
    );
  } else {
    // @ts-ignore dynamic icon fetch
    const IconComp = Icons[formatIconName(app.icon)] || Icons.Box;
    iconElement = <IconComp className={`${activeSizes.iconAsset} text-muted-foreground transition-transform duration-300 group-hover:scale-110 group-hover:text-foreground`} />;
  }

  // --- Layout Architecture ---
  // Base classes always apply
  let baseClasses = `group relative rounded-2xl flex items-center transition-all duration-500 overflow-hidden cursor-pointer no-underline ${activeSizes.card}`;

  // If we are in 'minimal', we center everything and throw away the right-side text column unless hovered
  if (isMinimal) {
    baseClasses += " justify-center";
  } else {
    baseClasses += " justify-start";
  }

  // --- Fill Styles ---
  const fillClasses = {
    glass: "bg-card/40 border border-border/50 backdrop-blur-xl hover:bg-card/80 hover:border-border hover:shadow-2xl hover:-translate-y-1",
    solid: "bg-card border border-border hover:bg-muted hover:border-foreground/20 shadow-sm hover:shadow-md hover:-translate-y-1",
    outline: "bg-transparent border-2 border-border/50 hover:border-primary hover:bg-primary/5 hover:-translate-y-1"
  };
  const activeFill = fillClasses[style as keyof typeof fillClasses] || fillClasses.glass;

  const iconBase = `${activeSizes.iconBox} flex items-center justify-center rounded-xl flex-shrink-0 relative z-10 transition-colors duration-300`;
  const iconStyle = {
    glass: "bg-background/50 border border-border/50 shadow-inner group-hover:bg-background/80",
    solid: "bg-muted border border-border shadow-sm group-hover:bg-card",
    outline: "bg-card/50 border border-border/50 group-hover:bg-primary/10"
  };
  const currentIconStyle = iconStyle[style as keyof typeof iconStyle] || iconStyle.glass;

  const handleClick = (e: React.MouseEvent) => {
    if (onOpenWorkspace) {
      e.preventDefault();
      onOpenWorkspace(app);
    }
  };

  return (
    <a href={app.url} target="_blank" rel="noreferrer" onClick={handleClick} className={`${baseClasses} ${activeFill}`} title={isMinimal ? app.name : ''}>
      {/* Light sweep effect */}
      {style === 'glass' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>}

      <div className={`${iconBase} ${currentIconStyle}`}>
        {iconElement}
      </div>

      {!isMinimal && (
        <div className={`flex flex-col gap-1 relative z-10 w-full ${isList ? 'flex-row items-center justify-between gap-4' : ''}`}>
          <h3 className={`${activeSizes.title} font-semibold leading-tight m-0 tracking-tight text-foreground transition-colors group-hover:text-primary whitespace-nowrap overflow-hidden text-ellipsis ${isList ? 'flex-shrink-0 w-1/4' : ''}`}>{app.name}</h3>
          <p className={`${activeSizes.stats} text-muted-foreground flex items-center justify-between gap-1.5 w-full ${isList ? 'flex-1' : ''}`}>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              {isOnline === null ? (
                <><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Checking...</>
              ) : isOnline ? (
                <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online {latency !== null && !isList && <span className="opacity-60 text-[10px] ml-0.5 font-mono tracking-wider">({latency}ms)</span>}</>
              ) : (
                <><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Offline</>
              )}
            </span>
            {stats && stats.length > 0 && (
              <span className={`flex gap-2 font-mono opacity-80 flex-wrap justify-end ${isList ? 'flex-1' : 'mt-1 sm:mt-0'}`}>
                {stats.filter(s => {
                  if ((app as any).widgetPreferences === undefined) return true;
                  return (app as any).widgetPreferences.includes(s.id);
                }).map((s, i) => (
                  <span key={i} className="flex gap-1"><span style={{ color: s.color }}>{s.label}:</span>{s.value}</span>
                ))}
              </span>
            )}
          </p>
        </div>
      )}
    </a>
  );
}

function App() {
  const [config, setConfig] = useState<Config | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<AppItem | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Failed to load config", err));
  }, []);

  // Update Document Title and Favicon based on Config
  useEffect(() => {
    if (config) {
      document.title = config.serverName || "BrayDashy";

      try {
        const iconKey = config.serverIcon ? formatIconName(config.serverIcon) : 'Server';
        const IconComp = (Icons as any)[iconKey] || Icons.Server;
        // Render the lucide SVG element to a string and encode it for a Data URI
        const svgString = renderToString(<IconComp size={32} color="white" />);
        const encodedSvg = encodeURIComponent(svgString);
        const dataUri = `data:image/svg+xml,${encodedSvg}`;

        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = dataUri;
        link.type = "image/svg+xml";
      } catch (err) {
        console.warn("Could not set dynamic favicon", err);
      }
    }
  }, [config]);

  // Dynamic Theme Color Injection
  useEffect(() => {
    if (!config || !config.themeColor) return;
    const root = document.documentElement;

    const themes: Record<string, { primary: string, ring: string, background?: string }> = {
      zinc: { primary: "240 5.9% 10%", ring: "240 10% 3.9%" }, // default
      slate: { primary: "215.4 16.3% 46.9%", ring: "215.4 16.3% 46.9%" },
      emerald: { primary: "142.1 76.2% 36.3%", ring: "142.1 76.2% 36.3%" },
      blue: { primary: "221.2 83.2% 53.3%", ring: "221.2 83.2% 53.3%" },
      rose: { primary: "346.8 77.2% 49.8%", ring: "346.8 77.2% 49.8%" },
      violet: { primary: "262.1 83.3% 57.8%", ring: "262.1 83.3% 57.8%" },
      amber: { primary: "37.7 92.1% 50.2%", ring: "37.7 92.1% 50.2%" }
    };

    const darkThemes: Record<string, { primary: string, ring: string }> = {
      zinc: { primary: "0 0% 98%", ring: "240 4.9% 83.9%" }, // default dark
      slate: { primary: "210 40% 98%", ring: "212.7 26.8% 83.9%" },
      emerald: { primary: "149.3 80.4% 90.2%", ring: "142.4 71.8% 29.2%" },
      blue: { primary: "210 40% 98%", ring: "217.2 32.6% 17.5%" },
      rose: { primary: "355.7 100% 97.3%", ring: "346.8 77.2% 49.8%" },
      violet: { primary: "255 92% 95%", ring: "262.1 83.3% 57.8%" },
      amber: { primary: "48 96% 89%", ring: "38 92% 50%" }
    };

    const isDarkMode = root.classList.contains('dark');
    const selectedTheme = isDarkMode ? darkThemes[config.themeColor] : themes[config.themeColor];

    if (selectedTheme) {
      if (config.themeColor === 'zinc') {
        // Reset to exact Shadcn defaults
        root.style.setProperty('--primary', isDarkMode ? "0 0% 98%" : "240 5.9% 10%");
        root.style.setProperty('--ring', isDarkMode ? "240 4.9% 83.9%" : "240 10% 3.9%");
      } else {
        root.style.setProperty('--primary', selectedTheme.primary);
        root.style.setProperty('--ring', selectedTheme.ring);
      }
    }
  }, [config?.themeColor]);

  if (!config) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading Dashboard Data...</div>;

  const sortedCategories = [...config.categories].sort((a, b) => a.order - b.order);

  const handleSaveConfig = async (newConfig: Config) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
      if (res.ok) {
        setConfig(newConfig);
      }
    } catch (e) {
      console.error("Failed to save config", e);
    }
  };

  return (
    <>
      <BackgroundOrbs />
      {activeWorkspace && (
        <WorkspaceViewer app={activeWorkspace} onClose={() => setActiveWorkspace(null)} />
      )}
      <div className="relative z-10 w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <Header config={config} onSaveConfig={handleSaveConfig} />

          {config.glanceWidgets && config.glanceWidgets.length > 0 && (
            <GlanceWidgetsRow widgets={config.glanceWidgets} />
          )}

          {config.enableWeather && config.weatherLocation && (
            <WeatherWidget location={config.weatherLocation} unit={config.weatherUnit || 'F'} />
          )}

          <main className="w-full">
            <div className="flex flex-col gap-12">
              {sortedCategories.map(cat => {
                const categoryApps = config.apps.filter(a => a.categoryId === cat.id);
                if (categoryApps.length === 0) return null;

                return (
                  <section key={cat.id} className="flex flex-col gap-5">
                    <h2 className="text-xl font-semibold text-muted-foreground border-b border-border pb-2">{cat.name}</h2>
                    <div className={`grid gap-6 ${config.appCardLayout === 'list' ? 'grid-cols-1' : config.appCardLayout === 'minimal' ? 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                      {categoryApps.map(app => (
                        <AppCard
                          key={app.id}
                          app={app}
                          style={config.appCardStyle}
                          layout={config.appCardLayout}
                          size={config.appCardSize}
                          onOpenWorkspace={
                            config.enableWorkspaceMode && !app.ignoreWorkspace
                              ? (appItem) => setActiveWorkspace(appItem)
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </main>

          <footer className="w-full mt-24 mb-8 text-center">
            <a
              href="https://github.com/Ruzzler/braydashy-dashboard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <Icons.Github className="w-4 h-4" />
              <span>BrayDashy on GitHub</span>
            </a>
          </footer>
        </div>
      </div>
    </>
  )
}

export default App;
