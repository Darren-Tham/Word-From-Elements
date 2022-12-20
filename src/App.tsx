const ANIMATION_DURATION = 750

function App() {
  return (
    <div className='prompt'>
        <span style={{ animationDelay: formatDelay(1) }}>Type a Word</span>
        <input type='text' style={{ animationDelay: formatDelay(2) }}></input>
        <button className='elementify' style={{ animationDelay: formatDelay(3) }}>Elementify</button>
    </div>
  )
}

function formatDelay(n: number) {
    return `${ANIMATION_DURATION * n}ms`
}

export default App
