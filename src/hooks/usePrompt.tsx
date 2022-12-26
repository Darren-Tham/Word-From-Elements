import { useState, useEffect, useRef } from 'react'
import { APPEAR_ANIMATION_DURATION, appearStyle, disappearStyle, resetStyles } from '../styles/AnimationStyle'
import Scene from '../enum/Scene'

const APPEAR_ANIMATION_DELAY = 200

const ERROR_ANIMATION_DURATION = 20
const ERROR_ANIMATION_COUNT = 15
const ERROR_COLOR = '#ff4033'

const ELEM_NUM = 3

export default function usePrompt(setScene: React.Dispatch<React.SetStateAction<Scene>>, userInput: React.MutableRefObject<string>) {
    const [styles, setStyles] = useState(initStyles())
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setTimeout(() => {
            resetStyles(setStyles, ELEM_NUM)
            inputRef.current?.focus()
        }, APPEAR_ANIMATION_DURATION + APPEAR_ANIMATION_DELAY * ELEM_NUM)
    }, [])

    return (
        <div className='prompt'>
            <span style={styles[0]}>Type a Word</span>
            <input
                style={styles[1]}
                ref={inputRef}
            />
            <button
                style={styles[2]}
                onClick={() => handleClick(inputRef, setStyles, setScene, userInput)}
            >Elementify
            </button>
        </div>
    )
}

function initStyles() {
    const styles: React.CSSProperties[] = []
    for (let i = 0; i < ELEM_NUM; i++) {
        styles.push(appearStyle(APPEAR_ANIMATION_DELAY * (i + 1)))
    }
    return styles
}

async function handleClick(
    inputRef: React.RefObject<HTMLInputElement>,
    setStyles: React.Dispatch<React.SetStateAction<React.CSSProperties[]>>,
    setScene: React.Dispatch<React.SetStateAction<Scene>>,
    userInput: React.MutableRefObject<string>)
{
    const input = inputRef.current?.value.trim().replace(/\+s/g, ' ').toLowerCase()
    const styles: React.CSSProperties[] = []
    if (input === '') {
        // Add shake animation
        const style: React.CSSProperties = {
            pointerEvents: 'none',
            animationName: 'shake',
            animationDuration: `${ERROR_ANIMATION_DURATION}ms`,
            animationIterationCount: ERROR_ANIMATION_COUNT
        }
        styles[0] = { ...style, color: ERROR_COLOR }
        styles[1] = { ...style, borderBottomColor: ERROR_COLOR }
        styles[2] = { ...style, backgroundColor: ERROR_COLOR }
        setStyles(styles)

        // Reset inline CSS
        await timeout(ERROR_ANIMATION_DURATION * ERROR_ANIMATION_COUNT)
        resetStyles(setStyles, ELEM_NUM)
    } else {
        if (input !== undefined) userInput.current = input

        for (let i = ELEM_NUM - 1; i >= 0; i--) {
            styles[i] = disappearStyle(APPEAR_ANIMATION_DELAY * (ELEM_NUM - 1 - i))
        }
        setStyles(styles)

        await timeout(APPEAR_ANIMATION_DURATION + APPEAR_ANIMATION_DELAY * ELEM_NUM - 1)
        setScene(Scene.SOLUTION)
    }
}

function timeout(time: number) {
    return new Promise(res => setTimeout(res, time))
}