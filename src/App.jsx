
import { useEffect, useState } from 'react';
import './App.css'

function App() {

       const GRID_SIZE = 20;
       const CELL_SIZE = 20;       
       const INITIAL_SNAKE = [{ x: 10, y: 10 }];
       const INITIAL_FOOD = { x: 15, y: 15 };
       const INITIAL_DIRECTION = "RIGHT";
       
       
       const [snake, setSnake] = useState(INITIAL_SNAKE);
       const [food, setFood] = useState(INITIAL_FOOD);
       const [direction, setDirection] = useState(INITIAL_DIRECTION);
       const [score, setScore] = useState(0);
       const [gameOver, setGameOver] = useState(false);


       const generateFood = () =>{
          const newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          };
          return snake.some((item) => item.x === newFood.x && item.y === newFood.y) ? generateFood() : newFood;
        }

        const moveSnake = () =>{
          if(gameOver) return;

          const head = { ...snake[0] };
          
          switch(direction){
            case "UP":
              head.y -= 1;
              break;
            case "DOWN":
              head.y += 1;
              break;
            case "LEFT":
              head.x -= 1
              break;
            case "RIGHT":
              head.y += 1
              break;  
            }

            if(head.x < 0 || 
              head.x >= GRID_SIZE || 
              head.y < 0 || 
              head.y >= GRID_SIZE || 
              snake.some((item)=> item.x === head.x && item.y === head.y)){
                  setGameOver(true);
                  return;
            }

            const newSnake = [head, ...snake];
            if(head.x === food.x && head.y === food.y){
              setScore(score + 1)
              setFood(generateFood());
            }else{
              newSnake.pop();
            }       
            
            setSnake(newSnake)
          }

          useEffect(()=>{
            const handleKeyPress = (e)=>{
              switch(e.key){
                case "ArrowUp":
                  if(direction !== "DOWN") setDirection("UP");
                    break;
                case "ArrowDown":
                  if(direction !== "UP") setDirection("DOWN");
                    break;
                case "ArrowLeft":
                  if(direction !== "RIGHT") setDirection("LEFT");
                    break;
                case "ArrowRight":
                  if(direction !== "LEFT") setDirection("RIGHT");
                    break;

              }
            }

            window.addEventListener("keydown", handleKeyPress);
            return () => {
              window.removeEventListener("keydown", handleKeyPress)
            }
          },[direction])


          useEffect(()=>{
            const gameLoop = setInterval(moveSnake, 200)
            return ()=> {
              clearInterval(gameLoop)
            }
          }, [direction, gameOver]);


          const renderGrid = () => {
            const grid = []
            for(let i = 0; i < GRID_SIZE; i++){
              for(let j = 0; j < GRID_SIZE; j++){
                const isSnake = snake.some((item)=> item.x === j && item.y === i);
                const isFood = food.x === j && food.y === i;
                grid.push(
                  <div key={`${i}-${j}`} className={`cell ${isSnake ? "snake": ""} ${isFood ? "food": ""}`} ></div>
                )
              }
            }
            return grid
          }

let resetGame=()=>{
  setSnake(INITIAL_SNAKE);
  setFood(INITIAL_FOOD);
  setDirection(INITIAL_DIRECTION);
  setScore(0);
  setGameOver(false);
  
}
            

       


  return (
    <>
      <div className='game-container'>
        <div className="score">Score : {score}</div>
        <div className="game-board " style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          width : `${GRID_SIZE * CELL_SIZE}px`,
          height: `${GRID_SIZE * CELL_SIZE}px`,
        }}>
         {renderGrid()}
        </div>
        {gameOver && (
          <div className="game-over">
          <h2>Game Over</h2>
          <p>Your Score: {score}</p>
          <button onClick={resetGame}>Restart</button>

        </div>
        )

        }
      </div>
    </>
  )
}

export default App
