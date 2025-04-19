
/**
 * The main App component that renders the Snake game.
 * It manages the game state, including the snake, food, direction, score, and game over status.
 * It also handles game logic, rendering, and user interactions.
 */
 
/**
 * @constant {number} GRID_SIZE - The size of the game grid (number of cells in one row/column).
 * @constant {number} CELL_SIZE - The size of each cell in pixels.
 * @constant {Array<Object>} INITIAL_SNAKE - The initial position of the snake on the grid.
 * @constant {Object} INITIAL_FOOD - The initial position of the food on the grid.
 * @constant {string} INITIAL_DIRECTION - The initial direction of the snake's movement.
 */

/**
 * @function generateFood
 * @description Generates a new random position for the food on the grid, ensuring it does not overlap with the snake.
 * @returns {Object} The new food position with x and y coordinates.
 */

/**
 * @function moveSnake
 * @description Moves the snake in the current direction, checks for collisions, and updates the game state.
 * If the snake eats the food, the score is incremented, and new food is generated.
 * If the snake collides with itself or the grid boundaries, the game ends.
 */

/**
 * @function handleKeyPress
 * @description Handles keyboard input to change the snake's direction.
 * Prevents the snake from reversing direction directly.
 * @param {KeyboardEvent} e - The keyboard event triggered by user input.
 */

/**
 * @function renderGrid
 * @description Renders the game grid as a collection of cells.
 * Highlights cells occupied by the snake and the food.
 * @returns {Array<JSX.Element>} An array of JSX elements representing the grid cells.
 */

/**
 * @function resetGame
 * @description Resets the game state to its initial values, allowing the user to restart the game.
 */

/**
 * @useEffect
 * @description Adds an event listener for keyboard input to control the snake's direction.
 * Cleans up the event listener when the component unmounts or the direction changes.
 */

/**
 * @useEffect
 * @description Sets up the game loop to move the snake at regular intervals.
 * Cleans up the interval when the component unmounts or the game state changes.
 */




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


      const generateFood = () => {
          const newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          };
          return snake.some((item) => item.x === newFood.x && item.y === newFood.y) ? generateFood() : newFood;
        }

        const moveSnake = () => {
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
              head.x += 1
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
                  if(direction !== "DOWN" && direction !== "UP") setDirection("UP");
                    break;
                case "ArrowDown":
                  if(direction !== "UP" && direction !== "DOWN") setDirection("DOWN");
                    break;
                case "ArrowLeft":
                  if(direction !== "RIGHT" && direction !== "LEFT") setDirection("LEFT");
                    break;
                case "ArrowRight":
                  if(direction !== "LEFT" && direction !== "RIGHT") setDirection("RIGHT");
                    break;

              }
            }

            window.addEventListener("keydown", handleKeyPress);
            return () => {
              window.removeEventListener("keydown", handleKeyPress)
            }
          },[direction])


          useEffect(()=>{
            const gameLoop = setInterval(moveSnake, 100)
            return ()=> {
              clearInterval(gameLoop)
            }
          }, [direction, gameOver, snake, food, score]);


          const renderGrid = () => {
            const grid = []
            for(let i = 0; i < GRID_SIZE; i++){
              for(let j = 0; j < GRID_SIZE; j++){
                const isSnake = snake.some((item)=> item.x === j && item.y === i);
                const isFood = food.x === j && food.y === i;
                grid.push(
                  <div key={`${i}-${j}`} className={`cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`} style={{ width: CELL_SIZE, height: CELL_SIZE }}></div>
                )
              }
            }
            return grid
          }



          


const resetGame = () => {
  setSnake(INITIAL_SNAKE);
  setFood(INITIAL_FOOD);
  setDirection(INITIAL_DIRECTION);
  setScore(0);
  setGameOver(false);
  
}
useEffect(() => {
  if (score > 0 && score % 100 === 0) {
    const newSpeed = Math.max(50, 100 - Math.floor(score / 100) * 10); // Increase speed by reducing interval
    const gameLoop = setInterval(moveSnake, newSpeed);
    return () => clearInterval(gameLoop);
  }
}, [score]);
            

       


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
