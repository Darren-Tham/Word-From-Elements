import { useState, useEffect, useRef } from 'react'

const ANIMATION_DURATION = 1000
const ANIMATION_DELAY = 750
const ELEM_NUM = 3
const ERROR_COLOR = '#e81b00'

function App() {
    const [styles, setStyles] = useState(initStyles())
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setTimeout(() => {
            setStyles(new Array(ELEM_NUM).fill({ opacity: 1 }))
            inputRef.current?.focus()
        }, ANIMATION_DURATION + ANIMATION_DELAY * ELEM_NUM)
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
    let delay = ANIMATION_DELAY
    for (let i = 0; i < ELEM_NUM; i++) {
        styles.push({
            opacity: 0,
            pointerEvents: 'none',
            animationName: 'appear',
            animationDuration: `${ANIMATION_DURATION}ms`,
            animationDelay: `${delay}ms`,
            animationFillMode: 'forwards'
        })
        delay += ANIMATION_DELAY
    }
    return styles
}

function handleClick(e: React.MouseEvent, inputRef: React.RefObject<HTMLInputElement>, setStyles: React.Dispatch<React.SetStateAction<React.CSSProperties[]>>) {
    if (inputRef.current?.value.trim() == '') {
        const styles: React.CSSProperties[] = []
        const style: React.CSSProperties = {
            animationName: 'shake',
            animationDuration: '20ms',
            animationIterationCount: 10
        }
        styles[0] = { ...style, color: ERROR_COLOR }
        console.log(styles[0])
        styles[1] = { ...style, borderBottomColor: ERROR_COLOR }
        styles[2] = { ...style, backgroundColor: ERROR_COLOR }
        setStyles(styles)
    }
}

export default App
