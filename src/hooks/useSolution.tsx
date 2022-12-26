import data from '../elements.json'

interface Element {
    atomicNumber: number
    symbol: string
    name: string
    group: string
}

export default function useSolution(userInput: React.MutableRefObject<string>) {
    const solutions = elementify(userInput.current)
    const text = solutions.length === 0 ? "No Solution" : `${solutions.length} ${solutions.length == 1 ?  "Solution" : "Solutions"}`
    return (
        <div className='solution'>
            <span className='solution-text'>{text}</span>
            {solutions.map((elements, key) => (
                <div
                    key={key}
                    className='scroll'
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
            <button>Reset</button>
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