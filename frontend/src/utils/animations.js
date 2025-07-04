import gsap from 'gsap'

export function correctJump(ref) {
    gsap.fromTo(
        ref,
        { y: 0 },
        {
        y: -10,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut", 
        }
    );
}

export function winWave(refs) { // returns a promise
    const animations = refs.map((el, idx) => {
        if (!el) return Promise.resolve(); 

        return new Promise(resolve => {
            gsap.fromTo(
                el,
                { y: 0 },
                {
                y: -20,
                duration: 0.3,
                delay: idx * 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
                onComplete: resolve  
                }
            );
        });
    });

    return Promise.all(animations);
}

export function incorrectShake(refs, connections) {
    refs.forEach((el, idx) => {
        if (el && !connections[idx]) {
            gsap.fromTo(
                el,
                { x: 0 },
                {
                    x: 0,
                    duration: 0.5,
                    keyframes: [
                    { x: -5, duration: 0.05 },
                    { x: 5, duration: 0.05 },
                    { x: -4, duration: 0.05 },
                    { x: 4, duration: 0.05 },
                    { x: -3, duration: 0.05 },
                    { x: 3, duration: 0.05 },
                    { x: 0, duration: 0.05 },
                    ],
                    ease: "power1.inOut"
                }
            );
        }
    })
}
