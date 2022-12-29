// React
import { useState, useEffect, useRef } from 'react'

// Enum
import Scene from '../enum/Scene'

//Helper
import timeout from '../helper/timeout'

// Style
import { APPEAR_ANIMATION_DURATION, APPEAR_ANIMATION_DELAY, getAppearStyle, getDisappearStyles, resetStyles } from '../styles/AnimationStyle'

/**
 * Constant for duration of error animation
 */
const ERROR_ANIMATION_DURATION = 20

/**
 * Constant for the number of cycles for the error animation
 */
const ERROR_ANIMATION_COUNT = 15

/**
 * Constant for the color of the error displayed on the screen
 */
const ERROR_COLOR = '#ff4033'

/**
 * Number of child elements inside the wrapper div
 * Used for length of styles array and timing purposes
 */
const ELEM_NUM = 3

/**
 * Properties for the Prompt component
 * All are from parent component (App)
 */
interface Props {
    setScene: React.Dispatch<React.SetStateAction<Scene>>
    formattedInputRef: React.MutableRefObject<string>
}

/**
 * First scene that prompts the user to enter a word
 * to be elementify
 * 
 * @param Props - properties for the Prompt component
 * @returns React component
 */
export default function Prompt({
    setScene,
    formattedInputRef
}: Props
)
{
    /**
     * Inline CSS animation styles
     * 
     * Initialized with inline CSS appear animation styles
     */
    const [styles, setStyles] = useState<React.CSSProperties[]>(initStyles())

    /**
     * Gets user's raw input
     */
    const inputRef = useRef<HTMLInputElement>(null)

    /**
     * Resets inline CSS appear animation
     * styles and focus on input element
     */
    useEffect(() => {
        setTimeout(() => {
            resetStyles(setStyles, ELEM_NUM)
            inputRef.current?.focus()
        }, APPEAR_ANIMATION_DURATION + APPEAR_ANIMATION_DELAY * ELEM_NUM)
    }, [])

    return (
        <div
            className='wrapper'
        >
            <span
                style={styles[0]}
            >Type a Word</span>
            <input
                style={styles[1]}
                ref={inputRef}
            />
            <button
                style={styles[2]}
                onClick={() => handleClick(setStyles, setScene, inputRef, formattedInputRef)}
            >Elementify</button>
        </div>
    )
}

/**
 * Initializes style with inline CSS appear animation styles
 * 
 * @returns inline CSS appear animation styles array
 */
function initStyles() {
    return new Array(ELEM_NUM)
        .fill(undefined)
        .map((_, i) => getAppearStyle(APPEAR_ANIMATION_DELAY * (i + 1)))
}

/**
 * Gets inline CSS error animation styles that
 * creates a shaking effect when user inputs an
 * incorrectly-formatted string
 * 
 * @returns inline CSS error animation styles array
 */
function getErrorStyles(): React.CSSProperties[] {
    const errorStyle: React.CSSProperties = {
        pointerEvents: 'none',
        animationName: 'shake',
        animationDuration: `${ERROR_ANIMATION_DURATION}ms`,
        animationIterationCount: ERROR_ANIMATION_COUNT,
    }
    return [
        { ...errorStyle, color: ERROR_COLOR },
        { ...errorStyle, borderBottomColor: ERROR_COLOR, color: ERROR_COLOR },
        { ...errorStyle, background: ERROR_COLOR }
    ]
}

/**
 * Formats user's input
 * - Removes all space in the beginning and end of input
 * - If there are extra spaces between two words, replaces
 *   with one space
 * - Lowercases all letters
 * 
 * After user's input is formatted, checks if formatted input
 * only consists of English letters and spaces. If not, throws Error
 * 
 * @param inputRef - gets user's raw input
 * @throws Error if inputRef is null
 * @throws Error if formatted input is empty
 * @throws Error if formatted input contains a letter other than English letters or spaces
 */
function formatInput(
    inputRef: React.RefObject<HTMLInputElement>
)
{
    if (inputRef.current == null) throw 'inputRef is null'
    const formattedInput = inputRef.current.value.trim().replace(/\+s/g, ' ').toLowerCase()
    if (formattedInput == '') throw 'Empty string detected'
    if (!isAlpha(formattedInput)) throw 'String should only consist of English letters and spaces'
    return formattedInput
}

/**
 * Returns true if the formatted input only consists of English letters and spaces
 * Otherwise, returns false
 * 
 * @param formattedInput - formatted user's input
 * @returns true if the formatted input only consists of English letters and spaces;
 * otherwise, false
 */
function isAlpha(
    formattedInput: string
)
{
    return /^[A-Z ]+$/i.test(formattedInput)
}

/**
 * If user's input is NOT formatted correctly, styles will
 * update to inline CSS error animation styles
 * 
 * Else, styles will update to inline CSS disappear
 * animation styles then change scene to the Solution screen
 * 
 * @param setStyles - React state setter to set styles
 * @param setScene  - React state setter to set scene
 * @param inputRef  - React ref to get user's input
 * @param formattedInputRef - React ref to store formatted input
 */
async function handleClick(
    setStyles: React.Dispatch<React.SetStateAction<React.CSSProperties[]>>,
    setScene: React.Dispatch<React.SetStateAction<Scene>>,
    inputRef: React.RefObject<HTMLInputElement>,
    formattedInputRef: React.MutableRefObject<string>
)
{
    try {
        formattedInputRef.current = formatInput(inputRef)

        // Add inline CSS disappear animation
        setStyles(getDisappearStyles(ELEM_NUM))

        // Change scene to Solution
        await timeout(APPEAR_ANIMATION_DURATION + APPEAR_ANIMATION_DELAY * ELEM_NUM - 1)
        setScene(Scene.SOLUTION)
    } catch (_) {
        // Add inline CSS error animation
        setStyles(getErrorStyles())

        // Reset inline CSS
        await timeout(ERROR_ANIMATION_DURATION * ERROR_ANIMATION_COUNT)
        resetStyles(setStyles, ELEM_NUM)
    }
}