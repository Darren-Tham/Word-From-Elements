/**
 * Constant that controls duration time for
 * appear and disappear animation
 */
export const APPEAR_ANIMATION_DURATION = 1000

/**
 * Constant that controls delay time for
 * appear and disappear animation
 */
export const APPEAR_ANIMATION_DELAY = 200

/**
 * Gets inline CSS animation style to
 * animate an element appearing
 * 
 * Note: This does not return an array of styles, unlike
 * getDisappearStyles, because the appear animation for
 * Prompt and Solution are different
 * 
 * @param delay - number in milliseconds to delay the animation
 * @returns inline CSS animation style
 */
export function getAppearStyle(
    delay: number
): React.CSSProperties
{
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

/**
 * Gets inline CSS disappear animation styles
 * to animate elements disappearing
 * 
 * Note: This returns an array of styles, unlike
 * getAppearStyle, because the disappear animations
 * for Prompt and Solution are the same
 * 
 * @param len - number of styles
 * @returns inline CSS disappear animation styles array
 */
export function getDisappearStyles(
    len: number
): React.CSSProperties[]
{
    return new Array(len)
        .fill(undefined)
        .map((_, i) => ({
            pointerEvents: 'none', 
            animationName: 'disappear',
            animationDuration: `${APPEAR_ANIMATION_DURATION}ms`,
            animationDelay: `${APPEAR_ANIMATION_DELAY * (len - 1 - i)}ms`,
            animationTimingFunction: 'ease-in',
            animationFillMode: 'forwards'
        }))
}

/**
 * Resets inline CSS styles
 * 
 * @param setStyles - React's useState setter to set styles
 * @param len - number of styles
 */
export function resetStyles(
    setStyles: React.Dispatch<React.SetStateAction<React.CSSProperties[]>>,
    len: number
)
{
    setStyles(new Array(len).fill(undefined))
}