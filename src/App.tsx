import { useState, useEffect, useRef } from 'react'

const ANIMATION_DURATION = 1000
const ANIMATION_DELAY = 750
const ELEM_NUM = 3

function App() {
    const [styles, setStyles] = useState(initStyles(ELEM_NUM))
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setTimeout(() => {
            setStyles(new Array(3).fill({ opacity: 1 }))
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
                onClick={e => handleClick(e, setStyles)}
            >Elementify
            </button>
        </div>
    )
}

function initStyles(elemNum: number) {
    const styles: React.CSSProperties[] = []
    let delay = ANIMATION_DELAY
    for (let i = 0; i < elemNum; i++) {
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

function handleClick(e: React.MouseEvent, setStyles: React.Dispatch<React.SetStateAction<React.CSSProperties[]>>) {
    const styles: React.CSSProperties[] = []
    for (let i = 0; i < 3; i++) {
        styles.push({ animationFillMode: 'none' })
    } 
    setStyles(styles)

}

export default App
