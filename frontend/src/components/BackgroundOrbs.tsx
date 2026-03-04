

export function BackgroundOrbs({ themeColor }: { themeColor?: string }) {
    // If the user selected Zinc/Slate (grayscale themes), we drop the opacity slightly and remove the aggressive color saturation
    const isGrayscale = themeColor === 'zinc' || themeColor === 'slate';
    const bgClass = isGrayscale ? "bg-muted-foreground/30" : "bg-primary";

    return (
        <div className="background-orbs">
            <div className={`orb orb-1 ${bgClass}`}></div>
            <div className={`orb orb-2 ${bgClass}`}></div>
            <div className={`orb orb-3 ${bgClass}`}></div>
        </div>
    );
}
