const gameModel = {
    currentPlayer: 1, //1 or 2    
    player1Name : '',
    player2Name : '',    
    positionsOfPlayer1: [],
    positionsOfPlayer2: [],
    markStyle: ['X', 'O'],
    completeMoves: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ],
    diagonal_points: [
        [0, 1, 2], 
        [2, 1, 0]
    ]
};

const gameController = {
    init: function () {
        gameView.init();
        registerView.init();
        registerView.render();
    },
    restartGame: function () {
        //reset game Model
        gameModel.currentPlayer = 1;
        gameModel.positionsOfPlayer1 = [];
        gameModel.positionsOfPlayer2 = [];  
        gameModel.player1Name = '';
        gameModel.player2Name = '';
        console.log(gameModel.positionsOfPlayer2);
        
    },
    isComplete: function (positions) {
        const sortedPositions = positions.sort();
        //Array parameters must be numbers
        //Match with predefined answer and return boolean
        for (const position of sortedPositions) {
            if (typeof position !== 'number') {
                throw new Error("Parameter must be a number array")
            }
        }

        for (const completeMove of gameModel.completeMoves) {
            if (completeMove.every(r => sortedPositions.includes(r))) {
                return true;
            }
        }

        for (let i = 0; i < gameModel.completeMoves.length; i++) {
            let isComplete = true;
            for (const move of gameModel.completeMoves) {
                if (!sortedPositions.includes(move[i])) {
                    isComplete = false;
                }
            }
            if (isComplete) {
                return true;
            }
        }
        
        for(points of gameModel.diagonal_points){
            if(this.randomPointCheck(points, sortedPositions)){
                return true;
            }
        }
        
        return false;
    },
    randomPointCheck: function (input_array, player_position) {
        let is_complete = true;
        for(let i = 0; i < gameModel.completeMoves.length; i ++){
            if(!player_position.includes(gameModel.completeMoves[i][input_array[i]])){
                is_complete = false;
            }        
        }

        return is_complete;
    },
    changePlayer: function () {
        //toggle player
        if (gameModel.currentPlayer === 1) {
            gameModel.currentPlayer = 2;
        }
        else {
            gameModel.currentPlayer = 1;
        }
    },
    getCurrentPlayer: function () {
        //return current player
        return gameModel.currentPlayer;
    },
    getCurrentPlayerName : function(){
        if(gameModel.currentPlayer === 1){
            return gameModel.player1Name;
        }

        return gameModel.player2Name;
    },
    getCurrentMarkStyle: function () {
        return gameModel.markStyle[this.getCurrentPlayer() - 1];
    },
    setPosition: function (index) {
        //throw error if input is smaller than 1 or larger than 9
        //throw error if input position is already selected by current user or opposition 
        //add a position to current player        
        if (index < 1 || index > 9) {
            console.log("here");
            throw new Error("Position out-of-range");
        }
        if (gameModel.positionsOfPlayer1.includes(index) || gameModel.positionsOfPlayer2.includes(index)) {
            throw new Error("Position already selected");
        }
        if (gameModel.currentPlayer === 1) {
            gameModel.positionsOfPlayer1.push(index);
        }
        else {
            gameModel.positionsOfPlayer2.push(index);
        }

    },
    selectPosition: function (index) {
        const position = parseInt(index);
        this.setPosition(position);
        let is_complete = false;
        if (this.getCurrentPlayer() === 1) {
            is_complete = this.isComplete(gameModel.positionsOfPlayer1);
        }
        else {
            is_complete = this.isComplete(gameModel.positionsOfPlayer2);
        }

        if (is_complete) {
            //Game Win
            this.saveWinnerName(this.getCurrentPlayerName());
            alert(`Player ${this.getCurrentPlayer()} win!!!`);
        }

        this.changePlayer();
    },
    saveWinnerName : function(winnerName){
        if(!localStorage.winnerList){
            localStorage.winnerList = JSON.stringify([winnerName]);
        }else{
            let winnerList = JSON.parse(localStorage.winnerList);
            winnerList.push(winnerName);
            localStorage.winnerList = JSON.stringify(winnerList);
        }
    },
    setPlayerName : function(player1Name,player2Name){
        gameModel.player1Name = player1Name;
        gameModel.player2Name = player2Name;
    }
};

const gameView = {
    init: function () {
        this.restartGameBtn = document.querySelector("#btnRestart");
        this.currentPlayerLabel = document.querySelectorAll('.currentPlayer');
        this.inputs = document.querySelectorAll('#board input');
        this.viewport = document.querySelector("#gameView");
        this.eventBinder();
    },
    eventBinder: function () {

        this.restartGameBtn.addEventListener('click', () => {
            gameController.restartGame();
            gameView.resetDisplay();
        });

        this.inputs.forEach(element => {
            element.addEventListener('click', (e) => {
                gameController.selectPosition(e.target.value);
                e.target.setAttribute("disabled", "disable");
                e.target.nextSibling.textContent = gameController.getCurrentMarkStyle();
                gameView.render();
            });
        });
    },
    resetDisplay: function () {
        
        this.inputs.forEach(element => {
            element.removeAttribute("disabled");
            element.nextSibling.textContent = "";
        });
        registerView.render();
    },
    render: function () {
        gameView.viewport.style.display = 'block';
        registerView.hideView();
        this.currentPlayerLabel.forEach(element => {
            element.innerHTML = gameController.getCurrentPlayerName();
        });
    },
    hideView: function(){
        this.viewport.style.display = 'none';
    }
}

const registerView = {
    init : function(){
        this.viewport = document.querySelector('#registerView');
        this.player1Name = document.querySelector('#Player1Name');
        this.player2Name = document.querySelector('#Player2Name');
        this.btnStart = document.querySelector('#btnStart');

        this.btnStart.addEventListener('click',function(){
            if(registerView.player1Name.value !== '' && registerView.player2Name.value !== ''){
                gameController.setPlayerName(registerView.player1Name.value,registerView.player2Name.value);
                gameView.render();
            }
            else{
                alert("Please add both players name");
            }
            
        });
        
    },
    render : function(){
        this.viewport.style.display = 'block';
        gameView.hideView();
    },
    hideView : function(){
        this.viewport.style.display = 'none';
    }
}

