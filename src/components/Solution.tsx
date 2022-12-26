import React, { useState, useEffect, ReactText } from 'react'
import { APPEAR_ANIMATION_DURATION, APPEAR_ANIMATION_DELAY, appearStyle, disappearStyle, resetStyles } from '../styles/AnimationStyle'
import timeout from '../helper/timeout'
import Scene from '../enum/Scene'
import data from '../elements.json'

const TEXT_DELAY = 500
const DELAY_AFTER_TEXT = TEXT_DELAY * 3

interface Element {
    atomicNumber: number
    symbol: string
    name: string
    group: string
}

interface Props {
    setScene: React.Dispatch<React.SetStateAction<Scene>>
    userInput: React.MutableRefObject<string>
}

export default function Solution({ setScene, userInput }: Props) {
    const solutions = elementify(userInput.current)
    const [styles, setStyles] = useState(initStyles(solutions.length))

    useEffect(() => {
        setTimeout(() => {
            resetStyles(setStyles, solutions.length + 2)
        }, DELAY_AFTER_TEXT + APPEAR_ANIMATION_DELAY * solutions.length + APPEAR_ANIMATION_DURATION)
    }, [])

    const text = solutions.length === 0 ? "No Solution" : `${solutions.length} ${solutions.length === 1 ?  "Solution" : "Solutions"}`
    return (
        <div className='wrapper'>
            <span
                className='solution-text'
                style={styles[0]}
            >{text}
            </span>
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
            >Reset
            </button>
        </div>
    )
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

function initStyles(solutionsLen: number) {
    const styles: React.CSSProperties[] = []
    styles.push(appearStyle(TEXT_DELAY))
    for (let i = 0; i < solutionsLen + 1; i++) {
        styles.push(appearStyle(DELAY_AFTER_TEXT + APPEAR_ANIMATION_DELAY * i))
    }
    return styles
}

async function handleClick(
    setStyles: React.Dispatch<React.SetStateAction<React.CSSProperties[]>>,
    setScene: React.Dispatch<React.SetStateAction<Scene>>,
    solutionLen: number
)
{
    const styles: React.CSSProperties[] = []  
    for (let i = 0; i < solutionLen + 2; i++) {
        styles.push(disappearStyle(APPEAR_ANIMATION_DELAY * (solutionLen + 1 - i)))
    }
    setStyles(styles)

    await timeout(APPEAR_ANIMATION_DURATION + APPEAR_ANIMATION_DELAY * (solutionLen + 1))
    setScene(Scene.PROMPT)
}

function groupToClassName(group: string) {
    return group.replace(/\s/g, '-').toLowerCase()
}