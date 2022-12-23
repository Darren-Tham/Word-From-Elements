import { useState, useRef } from 'react'
import usePrompt from './hooks/usePrompt'
import useSolution from './hooks/useSolution'
import Scene from './enum/Scene'

export default function App() {
    const [scene, setScene] = useState(Scene.PROMPT)
    const userInput = useRef('')
    const prompt = usePrompt(setScene, userInput)
    const solution = useSolution(userInput)

    switch (scene) {
        case 'prompt':
            return prompt
        case 'solution':
            return solution
    }
}