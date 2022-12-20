import { useState, useEffect, useRef } from 'react'

const APPEAR_ANIMATION_DURATION = 1000
const APPEAR_ANIMATION_DELAY = 750

const ERROR_ANIMATION_DURATION = 20
const ERROR_ANIMATION_COUNT = 10
const ERROR_COLOR = '#e81b00' // If change, change in _color.sass
const FADE_ANIMATION_DURATION = 250

const ELEM_NUM = 3

function App() {
    const [styles, setStyles] = useState(initStyles())
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setTimeout(() => {
            setStyles(new Array(ELEM_NUM).fill(undefined))
            inputRef.current?.focus()
        }, APPEAR_ANIMATION_DURATION + APPEAR_ANIMATION_DELAY * ELEM_NUM)
    }, [])

    return (
        <div className='prompt'>
            <span style={styles[0]}>Type a Word</span>
            <input
                type='text'
                style={styles[1]}
                ref={inputRef}
            />
            <button
                className='elementify'
                style={styles[2]}
                onClick={e => handleClick(e, inputRef, setStyles)}
            >Elementify
            </button>
        </div>
    )
}

function initStyles() {
    const styles: React.CSSProperties[] = []
    let delay = APPEAR_ANIMATION_DELAY
    for (let i = 0; i < ELEM_NUM; i++) {
        styles.push({
            opacity: 0,
            pointerEvents: 'none',
            animationName: 'appear',
            animationDuration: `${APPEAR_ANIMATION_DURATION}ms`,
            animationDelay: `${delay}ms`,
            animationFillMode: 'forwards'
        })
        delay += APPEAR_ANIMATION_DELAY
    }
    return styles
}

async function handleClick(e: React.MouseEvent, inputRef: React.RefObject<HTMLInputElement>, setStyles: React.Dispatch<React.SetStateAction<React.CSSProperties[]>>) {
    if (inputRef.current?.value.trim() == '') {
        // Add shake animation
        const styles: React.CSSProperties[] = []
        let style: React.CSSProperties = {
            animationName: 'shake',
            animationDuration: `${ERROR_ANIMATION_DURATION}ms`,
            animationIterationCount: ERROR_ANIMATION_COUNT
        }
        styles[0] = { ...style, color: ERROR_COLOR }
        styles[1] = { ...style, borderBottomColor: ERROR_COLOR }
        styles[2] = { ...style, backgroundColor: ERROR_COLOR }
        setStyles(styles)

        // Add fade animation
        await new Promise(res => setTimeout(res, ERROR_ANIMATION_DURATION * ERROR_ANIMATION_COUNT))
        style = { animationDuration: `${FADE_ANIMATION_DURATION}ms` }
        styles[0] = { ...style, animationName: 'fade-text-color' }
        styles[1] = { ...style, animationName: 'fade-border-color' }
        styles[2] = { ...style, animationName: 'fade-bg-color' }
        setStyles([...styles])

        // Reset inline CSS
        await new Promise(res => setTimeout(res, FADE_ANIMATION_DURATION))
        setStyles(new Array(ELEM_NUM).fill(undefined))
    }
}

export default App
