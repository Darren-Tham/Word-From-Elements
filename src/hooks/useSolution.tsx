import data from '../elements.json'

interface Element {
    atomicNumber: number
    symbol: string
    name: string
    group: string
}

export default function useSolution(userInput: React.MutableRefObject<string>) {
    elementify(userInput.current)
    return (
        <div className='solution'>
            <span></span>
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
    console.log(table[n])
}