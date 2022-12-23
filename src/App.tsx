import { useState } from 'react'
import usePrompt from './hooks/usePrompt'
import useSolution from './hooks/useSolution'

export default function App() {
    const [scene, setScene] = useState('prompt')
    const prompt = usePrompt(setScene)
    const solution = useSolution()
    switch (scene) {
        case 'prompt':
            return prompt
        case 'solution':
            return solution
    }
}