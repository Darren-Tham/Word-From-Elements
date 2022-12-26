export const APPEAR_ANIMATION_DURATION = 1000
export const APPEAR_ANIMATION_DELAY = 200

export function appearStyle(delay: number): React.CSSProperties {
    return {
        opacity: 0,
        pointerEvents: 'none',
        animationName: 'appear',
        animationDuration: `${APPEAR_ANIMATION_DURATION}ms`,
        animationDelay: `${delay}ms`,
        animationTimingFunction: 'ease',
        animationFillMode: 'forwards'
    }
}

export function disappearStyle(delay: number): React.CSSProperties {
    return {
        pointerEvents: 'none', 
        animationName: 'disappear',
        animationDuration: `${APPEAR_ANIMATION_DURATION}ms`,
        animationDelay: `${delay}ms`,
        animationTimingFunction: 'ease-in',
        animationFillMode: 'forwards'
    }
}

export function resetStyles(setStyles: React.Dispatch<React.SetStateAction<React.CSSProperties[]>>, len: number) {
    setStyles(new Array(len).fill(undefined))
}