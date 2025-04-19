
import './App.css'

function App() {
  

  return (
    <>
      <div className='game-container'>
        <div className="score">Score: 5</div>
        <div className="game-board">
          <div className="cell"></div>
          <div className="snake"></div>
          <div className="food"></div>
        </div>
        {/* <div className="game-over">
          <h2>Game Over</h2>
          <p>Your Score: 5</p>
          <button>Restart</button>

        </div> */}
      </div>
    </>
  )
}

export default App
