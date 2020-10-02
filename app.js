/*ensure all thml file is loaded before loading in javascript */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid') // . means class name
    let width = 10
    let bombAmount = 20
    let squares = []

    //Create the broad
    function createBoard() {

        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        console.log(gameArray)
        const shuffleArray = gameArray.sort(() => Math.random() - 0.5)
        console.log(shuffleArray)

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div') //create a square with a div
            square.setAttribute('id', i) //gives the square a unqiue id
            square.classList.add(shuffleArray[i])
            grid.appendChild(square) /* pass the square as a param into the grid*/
            squares.push(square)
        }

        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0) //if the i / width has no remainder, it must be divisible by 10 and on the left edge
            const isRightEdge = (i % width === width - 1) //if it is 1 less than left edge, it must be right edge.

            if (squares[i].classList.contains('valid')) {
                //if the square index is not 0, and not leftEdge 
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++ //checks directly above the square
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++

                squares[i].setAttribute('data', total)
                console.log(squares[i])
            }
        }









    }
    createBoard()

})