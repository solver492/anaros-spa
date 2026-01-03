import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useQuery } from '@tanstack/react-query';
import type { Setting } from '@shared/schema';

export function SnowEffect() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: setting } = useQuery<Setting>({
        queryKey: ["/api/settings/snow_effect"],
    });

    const isEnabled = setting?.value === "true";

    useEffect(() => {
        if (!containerRef.current || !isEnabled) return;

        const container = containerRef.current;
        const ctx = gsap.context(() => {
            const MAX_SNOW = 150;
            const MAX_SNOW_SIZE = 7;

            const changePosition = (item: HTMLElement) => {
                const width = Math.floor(Math.random() * MAX_SNOW_SIZE);
                const height = width;
                const blur = Math.floor(Math.random() * 5 + 2);
                const left = Math.floor(Math.random() * (window.innerWidth - width));
                const top = -window.innerHeight + Math.floor(Math.random() * (window.innerHeight - height));

                Object.assign(item.style, {
                    width: `${width}px`,
                    height: `${height}px`,
                    marginLeft: `${left}px`,
                    marginTop: `${top}px`,
                    filter: `blur(${blur}px)`,
                    opacity: String(Math.random()),
                });
            };

            const goAnimate = (item: HTMLElement, duration: number) => {
                gsap.to(item, {
                    duration: duration,
                    marginTop: "+=100",
                    ease: "none",
                    onComplete: () => {
                        // Verify context is still active and container exists
                        if (!ctx.data) return;

                        const rect = item.getBoundingClientRect();
                        // Safety check if element is detached
                        if (rect.width === 0 && rect.height === 0) return;

                        if (rect.top > window.innerHeight) {
                            changePosition(item);
                            const newDuration = Math.random() * 1 + 0.5;
                            goAnimate(item, newDuration);
                        } else {
                            goAnimate(item, duration);
                        }
                    }
                });
            };

            const goAnimate2 = (item: HTMLElement) => {
                const directionTime = 1 + Math.floor(Math.random() * 5);
                const randomDirection = 1 + Math.floor(Math.random() * 4);
                const delayTime = 1 + Math.floor(Math.random() * 3);

                const animConfig: gsap.TweenVars = {
                    duration: directionTime,
                    ease: "power1.out",
                };

                if (randomDirection === 1) {
                    animConfig.marginLeft = "+=100";
                    animConfig.onComplete = () => {
                        gsap.to(item, {
                            duration: directionTime,
                            marginLeft: "-=100",
                            delay: delayTime,
                            ease: "power1.out",
                            onComplete: () => goAnimate2(item)
                        });
                    };
                } else if (randomDirection === 2) {
                    animConfig.marginLeft = "-=100";
                    animConfig.onComplete = () => {
                        gsap.to(item, {
                            duration: directionTime,
                            marginLeft: "+=100",
                            delay: delayTime,
                            ease: "power1.out",
                            onComplete: () => goAnimate2(item)
                        });
                    };
                } else if (randomDirection === 3) {
                    animConfig.marginLeft = "+=100";
                    animConfig.onComplete = () => goAnimate2(item);
                } else if (randomDirection === 4) {
                    animConfig.marginLeft = "-=100";
                    animConfig.onComplete = () => goAnimate2(item);
                }

                gsap.to(item, animConfig);
            };

            // Create particles
            for (let i = 0; i < MAX_SNOW; i++) {
                const item = document.createElement('div');
                item.style.position = 'absolute';
                item.style.borderRadius = '50%';
                item.style.backgroundColor = 'white';

                changePosition(item);
                container.appendChild(item);

                const randomTime = Math.random() * 1 + 0.5;
                goAnimate(item, randomTime);
                goAnimate2(item);
            }
        }, container); // Scope GSAP to container

        return () => {
            ctx.revert(); // Kill all animations and revert
            // Clean up DOM elements
            if (container) {
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            }
        };
    }, [isEnabled]);

    if (!isEnabled) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-[50] overflow-hidden"
            style={{ zIndex: 9999 }} // Ensure it's on top of everything but non-blocking
        />
    );
}
