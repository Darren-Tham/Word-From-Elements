// React
import React, { useState, useEffect, useRef } from 'react'

// Enum
import Scene from '../enum/Scene'

// Helper
import timeout from '../helper/timeout'
import foo from '../helper/foo'

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
     * Stores scroll div elements to add drag feature
     */
    const scrollRefs = useRef<(HTMLDivElement | null)[]>([])

    /**
     * Clears inline CSS appear animation styles
     * and add keydown event listener
     */
    useEffect(() => {
        setTimeout(() => {
            window.addEventListener('keydown', handleKeyDown)
            resetStyles(setStyles, solutions.length + 2)
        }, ANIMATION_DELAY_AFTER_TEXT + APPEAR_ANIMATION_DELAY * solutions.length + APPEAR_ANIMATION_DURATION)

        return () => { window.removeEventListener('keydown', handleKeyDown) } // Cleanup function
    }, [])

    /**
     * Add event listener to each element row to allow
     * users to drag and scroll
     */
    useEffect(() => {
        const startEventListeners: ((evt: MouseEvent) => void)[] = []
        const dragEventListeners: ((evt: MouseEvent) => void)[] = []
        const stopEventListeners: (() => void)[] = []
 
        let isClicked = false
        let startX: number
        let initialScrollLeft: number

        scrollRefs.current.forEach((elem, i) => {
            if (elem === null) return

            const start = (evt: MouseEvent) => {
                isClicked = true
                startX = evt.pageX - elem.offsetLeft
                initialScrollLeft = elem.scrollLeft
            }

            const drag = (evt: MouseEvent) => {
                if (!isClicked) return
                evt.preventDefault()
                const x = evt.pageX - elem.offsetLeft
                const dist = x - startX
                elem.scrollLeft = initialScrollLeft - dist
            }

            const stop = () => { isClicked = false }

            startEventListeners[i] = start
            dragEventListeners[i] = drag
            stopEventListeners[i] = stop

            elem.addEventListener('mousedown', start)
            elem.addEventListener('mousemove', drag)
            elem.addEventListener('mouseup', stop)
            elem.addEventListener('mouseleave', stop)
        })

        return () => {
            scrollRefs.current.forEach((elem, i) => {
                elem?.removeEventListener('mousedown', startEventListeners[i])
                elem?.removeEventListener('mousemove', dragEventListeners[i])
                elem?.removeEventListener('mouseup', stopEventListeners[i])
                elem?.removeEventListener('mouseleave', stopEventListeners[i])
            })
        }
    }, [])

    /**
     * Allows user to press the Enter key to return to Prompt scene
     * 
     * Adds inline CSS disappear animation styles
     * then changes scene to Prompt
     * 
     * @param evt event that reads user's keyboard input
     */
    function handleKeyDown({ key }: KeyboardEvent) {
       if (key === 'Enter') handleClick(setStyles, setScene, solutions.length, handleKeyDown)
    }

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
                    ref={el => scrollRefs.current[key] = el}
                >
                    {elements.map(({ atomicNumber, symbol, name, group }, key) => (
                        <div
                            key={key}
                            className={`element ${groupToClassName(group)}`}
                        >
                            <span>{atomicNumber === 0 ? '' : atomicNumber}</span>
                            <span>{symbol}</span>
                            <span>{name}</span>
                            <span>{group === 'space' ? '' : group}</span>
                        </div>
                    ))}
                </div>
            ))}
            <button
                className='solution-button'
                style={styles[styles.length - 1]}
                onClick={() => handleClick(setStyles, setScene, solutions.length, handleKeyDown)}
            >Reset</button>
        </div>
    )
}

/**
 * Returns all possible ways the user's input can be
 * created using symbols from elements from the
 * periodic table
 * 
 * @param formattedInput - formatted user's input
 * @returns array containing different solutions (solutions are arrays storing Element objects)
 */
function elementify(
    formattedInput: string
)
{
    /**
     * Elemental properties displayed
     */
    interface Element {
        atomicNumber: number
        symbol: string
        name: string
        group: string
    }

    const n = formattedInput.length
    const table = new Array<Element[][]>(n + 1).fill([]).map(() => new Array<Element[]>())
    table[0] = [[]]
    for (let i = 0; i <= n; i++) {

        if (table[i].length === 0) continue
        for (const element of data) {
            const symbol = element.symbol.toLowerCase()
            if (formattedInput.slice(i, i + symbol.length) !== symbol) continue
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
 * Allows user to press button to return to Prompt scene
 * 
 * Adds inline CSS disappear animation styles
 * then changes scene to Prompt
 * 
 * @param setStyles - React state setter to set styles 
 * @param setScene - React state setter to set scene
 * @param solutionLen - number of solutions
 * @param handleKeyDown - function to be removed from event listener when transitioning to Prompt scene 
 */
async function handleClick(
    setStyles: React.Dispatch<React.SetStateAction<React.CSSProperties[]>>,
    setScene: React.Dispatch<React.SetStateAction<Scene>>,
    solutionLen: number,
    handleKeyDown: (evt: KeyboardEvent) => void
)
{
    window.removeEventListener('keydown', handleKeyDown)

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