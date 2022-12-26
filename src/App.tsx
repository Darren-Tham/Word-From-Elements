import { useState, useRef } from 'react'
import Prompt from './components/Prompt'
import Solution from './components/Solution'
import Scene from './enum/Scene'

export default function App() {
    const [scene, setScene] = useState(Scene.PROMPT)
    const userInput = useRef('')

    switch (scene) {
        case Scene.PROMPT:
            return (
                <Prompt
                    setScene={setScene}
                    userInput={userInput}
                />
            )
        case Scene.SOLUTION:
            return (
                <Solution
                    setScene={setScene}
                    userInput={userInput}
                />
            )
    }
}