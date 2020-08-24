
var view = {
    displayMessage: function(msg){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML=msg;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }

};

var model={
    boardSize:7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    ships: [{locations: [0,0,0], hits:["","",""] },
            {locations: [0,0,0], hits:["","",""] },
            {locations: [0,0,0], hits:["","",""]}
            ],
    collision: function(locations) {
        for (var i = 0; i<this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j<locations.length; j++) {
                if (ship.locations.indexOf(locations[j])>=0) {
                    return true;
                }
            }
        }

        return false;
    },


    fire: function(guess) {
        for (var i=0; i<this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >=0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.displayMessage ("You found a key!")
                    this.shipsSunk++;
                };

                // Key Incremental Display added by V
                    if (this.shipsSunk === 1) {
                        document.getElementById("keyDisplayOne").style.visibility = "visible";
                    };
                
                        if (this.shipsSunk === 2) {
                            document.getElementById("keyDisplayTwo").style.visibility = "visible";
                        };
                
                            if (this.shipsSunk === 3) {
                                document.getElementById("keyDisplayThree").style.visibility = "visible";
                                document.getElementById("restartgame").style.visibility = "visible";
                            };

                            // End of addition

                return true; 
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },

    isSunk: function(ship) {
        for (var i=0; i<this.shipLength; i++){
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;

    },

    generateShipLocations: function() {
        var locations;
        for (var i=0; i<this.numShips; i++) {
            do {
                locations=this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations; 
        }
    },




    
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row;
        var col;
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));

        } else {
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i=0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    }


        
};

var controller= {
    guesses:0,

    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You won in " + this.guesses + " guesses!")
                removeInputWindow();

            };
        }
    }
};

function parseGuess (guess) {
    var alphabet=["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    }


    else {
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        }
        else if (row<0 || row>= model.boardSize ||
                        column < 0 || column >= model.boardSize) {
                            alert("Oops, that's off the board!");
                        }
        else {
            return row + column;
        }
    }
    return null;
}

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    // I added this so users could type in lower case and it would auto convert
    guess = guess.toUpperCase();
    // end of addition
    controller.processGuess(guess);

    guessInput.value = "";
}

// functionality added by V 
// remove opening instruction page upon click
function removeInstructions() {
var instructions = document.getElementById("instructions");
instructions.remove();
}
// remove input window when game finishes and final score reported
function removeInputWindow()
{
    var inputWindow = document.getElementById("inputwindow");
    inputWindow.remove();
}

function restartGame() {
    location.reload(true);
}

// end additions
window.onload = init; 
