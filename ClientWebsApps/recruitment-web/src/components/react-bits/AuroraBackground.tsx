"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children?: ReactNode;
    showRadialGradient?: boolean;
}

export const AuroraBackground = ({
    className,
    children,
    showRadialGradient = true,
    ...props
}: AuroraBackgroundProps) => {
    return (
        <main>
            <div
                className={cn(
                    "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
                    className
                )}
                {...props}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className={cn(
                            `
                            absolute -inset-[10px] opacity-50 will-change-transform
                            animate-aurora
                            [background-image:var(--white-gradient),var(--aurora)]
                            dark:[background-image:var(--dark-gradient),var(--aurora)]
                            [background-size:300%,_200%]
                            [background-position:50%_50%,50%_50%]
                            filter blur-[10px] invert dark:invert-0
                            after:content-[""] after:absolute after:inset-0 
                            after:[background-image:var(--white-gradient),var(--aurora)] 
                            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
                            after:[background-size:200%,_100%] 
                            after:[background-attachment:fixed] after:mix-blend-difference
                            pointer-events-none
                            `,
                            showRadialGradient &&
                            `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
                        )}
                        style={{
                            "--white-gradient": "repeating-linear-gradient(100deg, #ffffff 0%, #ffffff 7%, transparent 10%, transparent 12%, #ffffff 16%)",
                            "--dark-gradient": "repeating-linear-gradient(100deg, #000000 0%, #000000 7%, transparent 10%, transparent 12%, #000000 16%)",
                            "--aurora": "repeating-linear-gradient(100deg, #3b82f6 10%, #a5b4fc 15%, #93c5fd 20%, #ddd6fe 25%, #60a5fa 30%)",
                        } as React.CSSProperties}
                    ></div>
                </div>
                {children}
            </div>
        </main>
    );
};
