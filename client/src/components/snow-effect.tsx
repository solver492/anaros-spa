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

        const MAX_SNOW = 150; // Adjusted for performance
        const MAX_SNOW_SIZE = 7;

        const container = containerRef.current;

        // Clear container
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

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
            });
        };

        const goAnimate = (item: HTMLElement, duration: number) => {
            gsap.to(item, {
                duration: duration,
                marginTop: "+=100",
                ease: "none",
                onComplete: () => {
                    const currentTop = parseFloat(item.style.marginTop || "0"); // Note: GSAP might modify this property directly or via style
                    // However, better to check position relative to window
                    const rect = item.getBoundingClientRect();

                    if (rect.top > window.innerHeight) {
                        changePosition(item);
                        const newDuration = Math.random() * 1 + 0.5; // Random speed between 0.5 and 1.5s typically
                        goAnimate(item, newDuration);
                    } else {
                        // Continue falling
                        goAnimate(item, duration);
                    }
                }
            });
        };

        const goAnimate2 = (item: HTMLElement) => {
            const directionTime = 1 + Math.floor(Math.random() * 5);
            const randomDirection = 1 + Math.floor(Math.random() * 4);
            const delayTime = 1 + Math.floor(Math.random() * 3);

            if (randomDirection === 1) {
                gsap.to(item, {
                    duration: directionTime,
                    marginLeft: "+=100",
                    ease: "power1.out",
                    onComplete: () => {
                        gsap.to(item, {
                            duration: directionTime,
                            marginLeft: "-=100",
                            delay: delayTime,
                            ease: "power1.out",
                            onComplete: () => goAnimate2(item)
                        });
                    }
                });
            } else if (randomDirection === 2) {
                gsap.to(item, {
                    duration: directionTime,
                    marginLeft: "-=100",
                    ease: "power1.out",
                    onComplete: () => {
                        gsap.to(item, {
                            duration: directionTime,
                            marginLeft: "+=100",
                            delay: delayTime,
                            ease: "power1.out",
                            onComplete: () => goAnimate2(item)
                        });
                    }
                });
            } else if (randomDirection === 3) {
                gsap.to(item, {
                    duration: directionTime,
                    marginLeft: "+=100",
                    ease: "power1.out",
                    onComplete: () => goAnimate2(item)
                });
            } else if (randomDirection === 4) {
                gsap.to(item, {
                    duration: directionTime,
                    marginLeft: "-=100",
                    ease: "power1.out",
                    onComplete: () => goAnimate2(item)
                });
            }
        };

        for (let i = 0; i < MAX_SNOW; i++) {
            const item = document.createElement('div');
            item.style.position = 'absolute';
            item.style.borderRadius = '50%';
            item.style.backgroundColor = 'white';

            changePosition(item); // Initialize position

            container.appendChild(item);

            const randomTime = Math.random() * 1 + 0.5; // Start with random speed
            goAnimate(item, randomTime);
            goAnimate2(item);
        }

        return () => {
            gsap.killTweensOf(container);
            while (container.firstChild) {
                // Cleanup if necessary, although React will unmount the parent div
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
