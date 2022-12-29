// React
import { useState, useRef } from 'react'

// Components
import Prompt from './components/Prompt'
import Solution from './components/Solution'

// Enum
import Scene from './enum/Scene'

/**
 * Root file of the React application
 * 
 * @returns React application
 */
export default function App() {
    /**
     * Changes scene on screen
     */
    const [scene, setScene] = useState(Scene.PROMPT)

    /**
     * Stores formatted user's input
     * 
     * Stored in Prompt
     * Used in Solution
     */
    const formattedInputRef = useRef('')

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