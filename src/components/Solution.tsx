// React
import { useState, useEffect } from 'react'

// Enum
import Scene from '../enum/Scene'

// Helper
import timeout from '../helper/timeout'

// Style
import { APPEAR_ANIMATION_DURATION, APPEAR_ANIMATION_DELAY, getAppearStyle, getDisappearStyles, resetStyles } from '../styles/AnimationStyle'

// JSON
import data from '../elements.json'

/**
 * Constant for text animation delay
 * 
 * Different than APPEAR_ANIMATION_DELAY because 
 * I wanted a longer pause when transitioning from
 * the Prompt to the Solution
 */
const TEXT_ANIMATION_DELAY = 500

/**
 * Constant for delay after text animation
 * 
 * I did not want the solution to appear quickly; I wanted
 * the user to read the text first, pause, and then display 
 * the solution
 */
const ANIMATION_DELAY_AFTER_TEXT = TEXT_ANIMATION_DELAY * 3

/**
 * Elemental properties displayed
 */
interface Element {
    atomicNumber: number
    symbol: string
    name: string
    group: string
}

/**
 * Properties for the Solution component
 * All are from parent component (App)
 */
interface Props {
    setScene: React.Dispatch<React.SetStateAction<Scene>>
    formattedInputRef: React.MutableRefObject<string>
}

/**
 * Scene that displays the solutions or
 * elements that can create the user's input
 * 
 * @param Props - properties for the Solution component
 * @returns React component
 */
export default function Solution({
    setScene,
    formattedInputRef
}: Props
)
{
    const solutions = elementify(formattedInputRef.current)

    /**
     * Inline CSS animation styles
     * 
     * Initialized with inline CSS appear animation styles
     */
    const [styles, setStyles] = useState(initStyles(solutions.length))

    /**
     * Clears inline CSS appear animation styles
     */
    useEffect(() => {
        setTimeout(() => {
            resetStyles(setStyles, solutions.length + 2)
        }, ANIMATION_DELAY_AFTER_TEXT + APPEAR_ANIMATION_DELAY * solutions.length + APPEAR_ANIMATION_DURATION)
    }, [])

    const text = solutions.length === 0 ? "No Solution" : `${solutions.length} ${solutions.length === 1 ?  "Solution" : "Solutions"}`
    return (
        <div
            className='wrapper'
        >
            <span
                className='solution-text'
                style={styles[0]}
            >{text}</span>
            {solutions.map((elements, key) => (
                <div
                    key={key}
                    className='scroll'
                    style={styles[key + 1]}
                >
                    {elements.map(({ atomicNumber, symbol, name, group }, key) => (
                        <div
                            key={key}
                            className={`element ${groupToClassName(group)}`}
                        >
                            <span>{atomicNumber}</span>
                            <span>{symbol}</span>
                            <span>{name}</span>
                            <span>{group}</span>
                        </div>
                    ))}
                </div>
            ))}
            <button
                className='solution-button'
                style={styles[styles.length - 1]}
                onClick={() => handleClick(setStyles, setScene, solutions.length)}
            >Reset</button>
        </div>
    )
}

function elementify(
    word: string
)
{
    const n = word.length
    const table = new Array<Element[][]>(n + 1).fill([]).map(() => new Array<Element[]>())
    table[0] = [[]]
    for (let i = 0; i <= n; i++) {
        if (table[i].length === 0) continue
        for (const element of data) {
            const { symbol } = element
            if (word.slice(i, i + symbol.length) !== symbol.toLowerCase()) continue
            table[i + symbol.length].push(...table[i].map(subArr => [ ...subArr, element ]))
        }
    }
    return table[n]
}

/**
 * Initializes styles with inline CSS appear animation styles
 * 
 * Different than Prompt initStyles since the text
 * span has a longer delay than other elements
 * 
 * @param solutionsLen - number of solutions
 * @returns inline CSS appear animation styles array
 */
function initStyles(
    solutionsLen: number
)
{
    const styles: React.CSSProperties[] = []
    styles.push(getAppearStyle(TEXT_ANIMATION_DELAY))
    for (let i = 0; i < solutionsLen + 1; i++) {
        styles.push(getAppearStyle(ANIMATION_DELAY_AFTER_TEXT + APPEAR_ANIMATION_DELAY * i))
    }
    return styles
}

/**
 * Adds inline CSS disappear animation styles
 * then changes scene to Prompt
 * 
 * @param setStyles - React state setter to set styles 
 * @param setScene - React state setter to set scene
 * @param solutionLen - number of solutions
 */
async function handleClick(
    setStyles: React.Dispatch<React.SetStateAction<React.CSSProperties[]>>,
    setScene: React.Dispatch<React.SetStateAction<Scene>>,
    solutionLen: number
)
{
    // Adds inline CSS disappear animation
    setStyles(getDisappearStyles(solutionLen + 2)) // + 2 is for the text span and reset button

    // Changes scene to Prompt
    await timeout(APPEAR_ANIMATION_DURATION + APPEAR_ANIMATION_DELAY * (solutionLen + 1))
    setScene(Scene.PROMPT)
}

/**
 * Formats the name of an element's group
 * to a className string used in CSS
 * 
 * In details, replaces all spaces with a hyphen
 * and lowercases
 * 
 * @param group - name of element's group
 * @returns formatted string
 */
function groupToClassName(
    group: string
)
{
    return group.replaceAll(' ', '-').toLowerCase()
}