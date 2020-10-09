//ensure all thml file is loaded before loading in javascript 
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')

    let width = 10
    let bombAmount = 20
    let flags = 0;
    let squares = []
    let isGameOver = false
    const choice = document.querySelector('.difficulty')
    choice.addEventListener('difficulty', function (e) {
        difficulty(choice)
    })

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


            //normal click
            square.addEventListener('click', function (e) {
                click(square)
            })

            //ctrl and left click
            square.oncontextmenu = function (e) {
                e.preventDefault()
                addFlag(square)
            }

        }

        //add numbers of bomb adjacent to the square
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0) //if the i / width has no remainder, it must be divisible by 10 and on the left edge
            const isRightEdge = (i % width === width - 1) //if it is 1 less than left edge, it must be right edge.

            if (squares[i].classList.contains('valid')) {
                //if the square is not left edge of grid and check to the left for a bomb, if it contains a bomb, increase total by 1.
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++

                //if square is not right edge of grid, check the square to the top-right for bomb, if found increase total by 1.
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++

                //checks  above the square for a bomb. If found it will add one to the total
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++

                //check for bombs top-left, if it found a bomb add 1 to total
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++

                //checks right of square for bomb, if found increase total by one
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++

                //checks bottom-left square for bomb, if found increase total by one
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++

                //check below-right square for bomb, if found increase total by one
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++

                //check below square for bomb
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++

                //gives the total amount of bombs adjacent to the square at index i
                squares[i].setAttribute('data', total)
            }
        }

    }
    createBoard()

    //add flag with right click
    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🚩'
                flags++
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
            }
        }
    }


    //click on square actions
    function click(square) {
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        //if you press on a bomb, end the game
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)

        }
        square.classList.add('checked')
    }



    //check neighboring square once square is clicked
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 10) {
                const newId = squares[parseInt(currentId - width)].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
        }, 10)
    }

    //game over takes in the square, alert the user the game is over
    function gameOver(square) {
        alert('BOOM! GAME OVER!')
        isGameOver = true

        //reveal all bomb location
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
            }
        });
    }


    //check for Win
    function checkForWin() {
        let matches = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++
            }
            if (matches == bombAmount) {
                console.log("You Won!")
                isGameOver = true
            }
        }
    }


    //change the dificulty of the game
    function difficulty(choice) {
        let level = ["easy", "medium", "hard"]
        if (choice == level[0]) {
            this.width = 10
            this.bombAmount = 20

        } else if (choice == level[1]) {
            this.width = 15
            this.bombAmount = 30
        } else {
            this.width = 20
            this.bombAmount = 45
        }
    }

})