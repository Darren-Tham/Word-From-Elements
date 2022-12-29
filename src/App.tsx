// React
import { useState, useRef } from 'react'

// Components
import Prompt from './components/Prompt'
import Solution from './components/Solution'

// Enum
import Scene from './enum/Scene'

export default function App() {
    const [scene, setScene] = useState(Scene.PROMPT)
    const formattedInputRef = useRef('') // Change in Prompt, use in Solution

    switch (scene) {
        case Scene.PROMPT:
            return (
                <Prompt
                    setScene={setScene}
                    formattedInputRef={formattedInputRef}
                />
            )
        case Scene.SOLUTION:
            return (
                <Solution
                    setScene={setScene}
                    formattedInputRef={formattedInputRef}
                />
            )
    }
}