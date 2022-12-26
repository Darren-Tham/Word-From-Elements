import { useState } from 'react'
import { appearStyle, disappearStyle, resetStyles } from '../styles/AnimationStyle'
import data from '../elements.json'

interface Element {
    atomicNumber: number
    symbol: string
    name: string
    group: string
}

const INITIAL_APPEAR_ANIMATION_DELAY = 500
const APPEAR_ANIMATION_DELAY = 200

export default function useSolution(userInput: React.MutableRefObject<string>) {
    const solutions = elementify(userInput.current)
    const [styles, setStyles] = useState(initStyles(solutions.length))

    useEffect(() => {
        setTimeout(() => {
            resetStyles(setStyles, solutions.length + 2)
        }, INITIAL_APPEAR_ANIMATION_DELAY * 2 + APPEAR_ANIMATION_DELAY * (solutions.length + 1))
    }, [])

    const text = solutions.length === 0 ? "No Solution" : `${solutions.length} ${solutions.length === 1 ?  "Solution" : "Solutions"}`
    return (
        <div className='solution'>
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
                            className='element'
                        >
                            <span className='atomic-number'>{atomicNumber}</span>
                            <span className='symbol'>{symbol}</span>
                            <span className='name'>{name}</span>
                            <span className='group'>{group}</span>
                        </div>
                    ))}
                </div>
            ))}
            <button style={styles[styles.length - 1]}>Reset</button>
        </div>
    )
}

function initStyles(solutionsLen: number) {
    const styles: React.CSSProperties[] = []
    styles.push(appearStyle(INITIAL_APPEAR_ANIMATION_DELAY))
    for (let i = 0; i < solutionsLen + 1; i++) {
        styles.push(appearStyle(INITIAL_APPEAR_ANIMATION_DELAY * 2 + APPEAR_ANIMATION_DELAY * i))
    }
    return styles
}

function elementify(word: string) {
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