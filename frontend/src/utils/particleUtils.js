export const generateFireParticles = (count) => Array.from({ length: count }).map((_, index) => {
    const randomDelay = Math.random() * 1.5;
    const randomScale = 0.8 + Math.random() * 0.5;
    const randomLeftOffset = (Math.random() - 0.5) * 30;

    return {
        id: index,
        style: {
            animationDelay: `${randomDelay}s`,
            transform: `scale(${randomScale})`,
            marginLeft: `${randomLeftOffset}px`
        }
    };
});

export const generateSparks = (count) => Array.from({ length: count }).map((_, index) => {
    const randomTop = Math.random() * 100;
    const randomLeft = Math.random() * 100;
    const randomDuration = 0.2 + Math.random() * 0.4;
    const randomDelay = Math.random() * 1;

    return {
        id: index,
        style: {
            top: `${randomTop}%`,
            left: `${randomLeft}%`,
            animationDuration: `${randomDuration}s`,
            animationDelay: `${randomDelay}s`
        }
    };
});
