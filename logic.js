// Variables are storage of values
let board;
let score = 0;
let rows = 4;
let columns = 4;

// Monitors value for win condition
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

let startX = 0;
let startY = 0;

// Functions are callable programmed tasks
function setGame(){
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
		// [32, 8, 4, 0],
        // [4, 128, 64, 256],
        // [8, 32, 16, 2],
        // [16, 2, 256, 1024]
	]; // Backend board
	//Goal, we will use the backend board to design and move the tiles of the frontend board

	// Loops are code to repeat taks inside it, until it fulfill its task
	for(let r=0; r < rows; r++){
		for(let c = 0; c < columns; c++){

			// This code is to create a tile through creating div elements
			let tile = document.createElement("div");

			//Each tile will have an id based on its row and column position
			tile.id = r.toString() + "-" + c.toString();

			// Get the number of a tile
			let num = board[r][c];

			// Use the number to update the tile's appearance
			updateTile(tile, num);

			// Add the created tile with id to the frontend game board.
			document.getElementById("board").append(tile); 
		}
	}

	setTwo();
	setTwo();
}

// This function is to update the color of the tile based on its number
function updateTile(tile, num){
    // Resets the tile and its class names 
    tile.innerText = ""; 
    tile.classList.value = "";  
    
    // Add class name "tile" to resize and design the tile based on our assigned size and styles for class name tile.
    tile.classList.add("tile");

    // If the num value is not zero let's change the color of the tile based on it's num value (We will only color tiles with values that are not zero)
    if(num > 0) {
        // This will display the number of the tile
        tile.innerText = num.toString();
        
        // And this will color the tile
        // If the num value of the tile is lesser or equal to 4096, it will use class x2 to x4096 css classes to color the tile (depending on the num value of the tile)
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            // Then if the num value is greater than 4096, it will use class x8192 to color the tile
            tile.classList.add("x8192");
        }
    }
}

// Once the browser load.
window.onload = function(){
	// setGame() is called to be executed.
	setGame();
}

function filterZero(row){
	return row.filter(num => num != 0);
}

function slide(row){

	row = filterZero(row);

	for(let i = 0; i < row.length - 1; i++){
        /* 1st iteration:
        If index 0 == index 1 (2 == 2)
        (true) index 0 = 2 * 2 (4)
        Index 1 = 0 (4,0,2)

        2nd iteration:
        If index 1 == index 2 (0 == 2)
        (false) index 1 = 0
        Index 2 = 2 (4,0,2)
        */
        // If two adjacent numbers are equal.
        if(row[i] == row[i+1]){
            // merge them by doubling the first one
            row[i] *= 2;
            // and setting the second one to zero.      
            row[i+1] = 0;
            // score increase
            score += row[i];       
        } // [2, 2, 2] -> [4, 0, 2]

     }

	row = filterZero(row); // [4,2]

	while(row.length < columns){
		row.push(0);
	}//[4, 2, 0, 0]

	return row;

}

function handleSlide(e){
	//console.log(e.code); //e.code value represents what key is being pressed in our keyboard
	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){

		//Prevent default behavior (scrolling) on keydown
		e.preventDefault()

		if(e.code == "ArrowLeft" && canMoveLeft()){
			slideLeft();
			setTwo();
		}
		else if (e.code == "ArrowRight" && canMoveRight()){
			slideRight();
			setTwo();
		}else if (e.code == "ArrowUp" && canMoveUp()){
			slideUp();
			setTwo();
		}else if (e.code == "ArrowDown" && canMoveDown()){
			slideDown();
			setTwo();
		}



		document.getElementById("score").innerText = score;

		if(hasLost()){
			setTimeout(()=>{
				alert("Game Over! Game will restart");
				restartGame();
				alert("Click any arrow key to restart");
			})
		}
	}
	
}

document.addEventListener("keydown", handleSlide);
	

function slideLeft(){

// iterate through each row
	for(let r=0; r<rows; r++){

		// All tiles values per row are saved in a container
		let row = board[r];

		//Line for animation
		let originalRow = row.slice(); //initial state of the row before the movement

		// We use slide function to merge tiles with the same values
		row = slide(row);
		// Update the row with the merged tiles
		board[r] = row;

		// Update the state of all tiles
		for(let c = 0; c<columns; c++){
			//update id
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			//update color using updateTile
			updateTile(tile, num);

			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-right 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300);
			}

		}
	}

}

function slideRight(){

// iterate through each row
	for(let r=0; r<rows; r++){

		// All tiles values per row are saved in a container
		let row = board[r];

		// Line for animation

		let originalRow = row.slice();

		row.reverse();

		// We use slide function to merge tiles with the same values
		row = slide(row);

		// Update the row with the merged tiles
		row.reverse();
		board[r] = row;

		// Update the state of all tiles
		for(let c = 0; c<columns; c++){
			//update id
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			//update color using updateTile
			updateTile(tile, num);

			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-left 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300);
			}

		}
	}

}

// For merging, slideUp and slideDown will be through columns
function slideUp(){

// iterate through each column
	for (let c=0; c<columns; c++){
		let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
		
		// line use for animation
		let originalRow = row.slice();

		row = slide(row);

		let changedIndices = [];
		for (let r = 0; r < rows; r++) { 
		    if (originalRow[r] !== row[r]) {
		        /* 
		        originalRow = [2, 0, 2, 0]
		        row = [4, 0, 0, 0]

		        1st iteration: 2 !== 4 (True) changeIndices = [0]
		        2nd iteration: 0 !== 0 (False)
		        3rd iteration: 2 !== 0 (True) changeIndices = [0, 2]
		        4th iteration: 0 !== 0 (False)
		        */
		        changedIndices.push(r);
		    }
		}

		// This loop is to update the id of the tile and its color
		for(let r=0; r<rows; r++){
			board[r][c] = row[r];

			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile,num);

			if(changedIndices.includes(r) && num !== 0){
				tile.style.animation = "slide-from-bottom 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300);
			}
		}
	}
}

// For merging, slideUp and slideDown will be through columns
function slideDown(){

// iterate through each column
	for (let c=0; c<columns; c++){
		let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
		
		let originalRow = row.slice();

		row.reverse(); //reverse row array

		row = slide(row);

		row.reverse();

		let changedIndices = [];
		for (let r = 0; r < rows; r++) { 
		    if (originalRow[r] !== row[r]) {
		        /* 
		        originalRow = [2, 0, 2, 0]
		        row = [4, 0, 0, 0]

		        1st iteration: 2 !== 4 (True) changeIndices = [0]
		        2nd iteration: 0 !== 0 (False)
		        3rd iteration: 2 !== 0 (True) changeIndices = [0, 2]
		        4th iteration: 0 !== 0 (False)
		        */
		        changedIndices.push(r);
		    }
		}

		// This loop is to update the id of the tile and its color
		for(let r=0; r<rows; r++){
			board[r][c] = row[r];

			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile,num);

			if(changedIndices.includes(r) && num !== 0){
				tile.style.animation = "slide-from-top 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300);
			}
		}
	}
}

function hasEmptyTile(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c] == 0){
				return true;
			}
		}
	}
	return false;
}

function setTwo(){
	if(!hasEmptyTile()){
		return;
	}

	let found = false;

	while(!found){
		let r = Math.floor(Math.random()* rows);
		let c = Math.floor(Math.random()* columns);

		// Then we will check the random tile in the board if it's value is zero. If it is then let's make it 2.
        if(board[r][c] == 0){
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2")

            found = true;
        }
	}
}

function checkWin(){
	for(let r = 0; r<rows; r++){
		for(let c = 0; c<columns; c++){
			if(board[r][c] == 2048 && is2048Exist == false){
				alert("You win! You got 2048");
				is2048Exist = true;
			}else if (board[r][c] == 4096 && is4096Exist == false){
				alert("You are unstoppable!");
				is4096Exist = true;
			}else if (board[r][c] == 8192 && is8192Exist == false){
				alert("Victory! You are awesome!");
				is8192Exist = true;
			}
		}
	}
}

function hasLost() {

    // Check if the board is full (because if the board is full and the player has no possible merges, it means he lose)
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

        	// If it has an empty tile (value 0), it means the player has not yet lost, so it will return false.
            if (board[r][c] === 0) {
                return false;
            }

            const currentTile = board[r][c];

            // Check if there are adjacent cells (up, down, left, right) for possible merge
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }
    // No possible moves left or empty tiles, user has lost
    return true;
}

function restartGame(){
	for(let r = 0; r<rows; r++){
		for(let c = 0; c < columns; c++){
			board[r][c]=0;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile,num);
		}
	}
	score = 0;
	document.getElementById("score").innerText = score;
	setTwo();
}

// This will listen to the device screen is touched and assigns the x coordinate of that touch
document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;

})

// This will check where you touch your screen and prevents scrolling swipe
// input targets any elements that includes the word tile in their class name
document.addEventListener('touchmove', (e) => {
	if(!e.target.className.includes("tile")){
		return;
	}
	e.preventDefault();
}, {passive:false})


// Listen for the 'touchend' event on the entire document
document.addEventListener('touchend', (e) => {
    
    // Check if the element that triggered the event has a class name containing "tile"
    if (!e.target.className.includes("tile")) {
        return; // If not, exit the function
    }
    
    // Calculate the horizontal and vertical differences between the initial touch position and the final touch position
    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    // Check if the horizontal swipe is greater in magnitude than the vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && canMoveLeft()) {
            slideLeft(); // Call a function for sliding left
            setTwo(); // Call a function named "setTwo"
        } else if (diffX < 0 && canMoveRight()) {
            slideRight(); // Call a function for sliding right
            setTwo(); // Call a function named "setTwo"
        }
    } else {
        // Vertical swipe
        if (diffY > 0 && canMoveUp()) {
            slideUp(); // Call a function for sliding up
            setTwo(); // Call a function named "setTwo"
        } else if (diffY < 0 && canMoveDown()) {
            slideDown(); // Call a function for sliding down
            setTwo(); // Call a function named "setTwo"
        }
    }

    document.getElementById("score").innerText = score;
        
    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
        alert("Game Over! You have lost the game. Game will restart");
        restartGame();
        alert("Click any key to restart");
        // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed
    }
});


    // Check if there are available merging moves in the right direction, if there is none it should not add new tile when pressing left 
    function canMoveLeft() {
        // It goes through each row of the grid, one by one (a row is like a horizontal line in the grid).
        for (let r = 0; r < rows; r++) {
            // For each row, it starts from the second column (position) because moving to the left means it's checking if the number can slide to the left.
            for (let c = 1; c < columns; c++) {
                //console.log(`${r} - ${c}`);
                // This line checks if the current position on the grid (board[r][c]) has a number in it (not empty). If there's a number there, it means the function is looking at a tile that needs to be checked for moving left.
                if (board[r][c] !== 0) {
                    // Inside the loop, this line checks two things:
                        // It checks if the position to the left of the current tile is empty (0).
                        // It also checks if the number to the left is the same as the current number.
                    if (board[r][c - 1] === 0 || board[r][c - 1] === board[r][c]) {
                        // If the conditions are met (you can move a tile to the left), the function immediately says, "Yes, you can move left in this row!" and stops checking.
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Check if there are available merging moves in the right direction, if there is none it should not add new tile when pressing right 
    function canMoveRight() {
        for (let r = 0; r < rows; r++) {
            //  This loop starts from the second-to-last column and goes backwards because moving to the right means checking the number's interaction with the one to its right.
            for (let c = columns - 2; c >= 0; c--) {
                //console.log(`${r} - ${c}`);
                if (board[r][c] !== 0) {
                    // Inside the loop, this line checks two things:
                        // It checks if the position to the right of the current tile is empty (0).
                        // It also checks if the number to the right is the same as the current number.
                    if (board[r][c + 1] === 0 || board[r][c + 1] === board[r][c]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

     // Check if there are available merging moves in the upward direction,if there is none it should not add new tile when pressing up 
    function canMoveUp() {
        // This line starts a loop that goes through each column in the game grid. A column is like a vertical line in the grid, and this loop checks one column at a time.
        for (let c = 0; c < columns; c++) {
            // This loop starts from the second row because moving upward means checking the number's interaction with the one above it.
            for (let r = 1; r < rows; r++) {
                //console.log(`${c} - ${r}`);
                if (board[r][c] !== 0) {
                    // Inside the loop, this line checks two things:
                        // It checks if the position above the current tile is empty (0).
                        // It also checks if the number above is the same as the current number.
                    if (board[r - 1][c] === 0 || board[r - 1][c] === board[r][c]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Check if there are available merging moves in the downward direction, if there is none it should not add new tile when pressing down 
    function canMoveDown() {
        for (let c = 0; c < columns; c++) {
            // This loop starts from the second-to-last row and goes backward because moving downward means checking the number's interaction with the one below it.
            for (let r = rows - 2; r >= 0; r--) {
                //console.log(`${c} - ${r}`);
                if (board[r][c] !== 0) {
                    // Inside the loop, this line checks two things:
                        // It checks if the position below the current tile is empty (0).
                        // It also checks if the number below is the same as the current number.
                    if (board[r + 1][c] === 0 || board[r + 1][c] === board[r][c]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
