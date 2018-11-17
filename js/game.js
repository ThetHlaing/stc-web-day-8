const gameModel = {
    currentPlayer: 1, //1 or 2    
    player1Name: '',
    player2Name: '',
    positionsOfPlayer1: [],
    positionsOfPlayer2: [],
    gameStatus: 'playing', //win,draw,playing
    markStyle: ['X', 'O'],
    completeMoves: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ],
    winningMoves : [],
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
        scoreBoardView.init();
    },
    restartGame: function () {
        //reset game Model
        gameModel.currentPlayer = 1;
        gameModel.positionsOfPlayer1 = [];
        gameModel.positionsOfPlayer2 = [];
        gameModel.winningMoves = [];
        gameModel.gameStatus = 'playing';
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
                this.saveWinningMoves(completeMove);
                return true;
            }
        }

        for (let i = 0; i < gameModel.completeMoves.length; i++) {
            let isComplete = true;
            const currentCorrectMoves = [];
            for (const move of gameModel.completeMoves) {
                if (!sortedPositions.includes(move[i])) {
                    isComplete = false;
                }else{
                    currentCorrectMoves.push(move[i])
                }
            }
            if (isComplete) {
                this.saveWinningMoves(currentCorrectMoves);
                return true;
            }
        }

        for (points of gameModel.diagonal_points) {
            if (this.randomPointCheck(points, sortedPositions)) {                
                return true;
            }
        }

        return false;
    },
    isDraw : function(){
        const totalPositions = gameModel.positionsOfPlayer1.length + gameModel.positionsOfPlayer2.length;        
        if(totalPositions == this.getGameBoardSize()){
            return true;
        }
        return false;
    },
    randomPointCheck: function (input_array, player_position) {
        let is_complete = true;
        const winningMoves = [];
        for (let i = 0; i < gameModel.completeMoves.length; i++) {
            const value = gameModel.completeMoves[i][input_array[i]];
            if (!player_position.includes(value)) {
                is_complete = false;
            }else{
                winningMoves.push(value);
            }
        }
        if(is_complete){
            this.saveWinningMoves(points);
        }
        return is_complete;
    },
    saveWinningMoves : function(positions){
        gameModel.winningMoves = positions;
    },
    getWinningMoves : function(){
        return gameModel.winningMoves;
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
    getCurrentPlayerName: function () {
        if (gameModel.currentPlayer === 1) {
            return gameModel.player1Name;
        }

        return gameModel.player2Name;
    },
    getPlayer1Name: function () {
        return gameModel.player1Name;
    },
    getPlayer2Name: function () {
        return gameModel.player2Name;
    },
    getGameStatus: function () {
        return gameModel.gameStatus;
    },
    getCurrentMarkStyle: function () {
        return gameModel.markStyle[this.getCurrentPlayer() - 1];
    },
    setPosition: function (index) {
        //throw error if input is smaller than 1 or larger than 9
        //throw error if input position is already selected by current user or opposition 
        //add a position to current player        
        console.log(`setting position ${index} for ${this.getCurrentPlayerName()}`);
        if (index < 1 || index > 9) {
            console.log("here");
            throw new Error("Position out-of-range");
        }
        if (gameModel.positionsOfPlayer1.includes(index) || gameModel.positionsOfPlayer2.includes(index)) {
            console.log(gameModel.positionsOfPlayer1);
            console.log(gameModel.positionsOfPlayer2);
            console.log(index);
            throw new Error("Position already selected");
        }
        if (gameModel.currentPlayer === 1) {
            gameModel.positionsOfPlayer1.push(index);
        }
        else {
            gameModel.positionsOfPlayer2.push(index);
        }

    },    
    getGameBoardSize : function(){
        return gameModel.completeMoves.length * gameModel.completeMoves[0].length;
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
            gameModel.gameStatus = 'win';            
            this.saveWinnerName(this.getCurrentPlayerName());
        }else if(this.isDraw()){
            gameModel.gameStatus = 'draw';

        }
        else {
            this.changePlayer();
        }
        console.log(gameModel.gameStatus);
    },
    saveWinnerName: function (winnerName) {
        if (!localStorage.winnerList) {
            localStorage.winnerList = JSON.stringify([winnerName]);
        } else {
            let winnerList = JSON.parse(localStorage.winnerList);
            winnerList.push(winnerName);
            localStorage.winnerList = JSON.stringify(winnerList);
        }
    },
    getWinnerList: function () {
        if (!localStorage.winnerList) {
            return [];
        }
        else {
            const winnerList = JSON.parse(localStorage.winnerList);
            const group_by_count = winnerList.reduce((obj, item, index) => {
                obj[item] = obj[item] || { count: 0 };
                obj[item] = { name: item, count: obj[item].count + 1 };
                return obj;
            }, []);

            const keys = Object.keys(group_by_count);

            const values = keys.map(key => { return group_by_count[key]; });

            const sorted_array = values.sort((a, b) => {
                return b.count - a.count;
            })

            return sorted_array;
        }
    },
    setPlayerName: function (player1Name, player2Name) {
        gameModel.player1Name = player1Name;
        gameModel.player2Name = player2Name;
    }
};

const gameView = {
    init: function () {
        this.restartGameBtn = document.querySelector("#btnRestart");
        this.newGameBtn = document.querySelectorAll('.btnNewGame');
        this.currentPlayerLabel = document.querySelectorAll('.currentPlayer');
        this.player1Label = document.querySelectorAll('.player1Name');
        this.player2Label = document.querySelectorAll('.player2Name');
        this.inputs = document.querySelectorAll('#board input');
        this.gameStatusLabel = document.querySelector('#game-status');
        this.winningMessageTemplate = document.querySelector('template#win-game-message');
        this.drawMessageTemplate = document.querySelector('template#draw-game-message');
        this.viewport = document.querySelector("#gameView");
        this.eventBinder();
    },
    eventBinder: function () {

        this.restartGameBtn.addEventListener('click', () => {
            gameController.restartGame();
            gameView.resetDisplay();
            registerView.render();
        });

        this.viewport.addEventListener('click', event => {
            if (event.target.classList.contains('btnNewGame')) {
                event.preventDefault();
                gameController.restartGame();
                gameView.resetDisplay();
                gameView.updatePlayerName();
            }
        });


        this.inputs.forEach(element => {
            element.addEventListener('click', (e) => {
                e.target.setAttribute("disabled", "disable");
                e.target.nextSibling.textContent = gameController.getCurrentMarkStyle();

                gameController.selectPosition(e.target.value);                
                gameView.gameStatusDisplayUpdate();
                gameView.updatePlayerName();
            });
        });
    },
    gameStatusDisplayUpdate: function () {
        const gameStatus = gameController.getGameStatus();
        const currentPlayerName = gameController.getCurrentPlayerName();
        if (gameStatus === 'win') {
            const message =  this.winningMessageTemplate.innerHTML.replace(/{{playerName}}/g, currentPlayerName);
            this.gameStatusLabel.innerHTML = message;
            this.disableDisplay();
            this.showWinningPattern();
            console.log(gameController.getWinningMoves());
            scoreBoardView.render();
        }
        else if (gameStatus === 'draw') {
            this.gameStatusLabel.innerHTML = this.drawMessageTemplate.innerHTML;
            this.disableDisplay();
        }
        else {
            this.gameStatusLabel.innerHTML = '';
        }

    },
    showWinningPattern : function(){

        this.inputs.forEach(element => {            
            const value = parseInt(element.value);
            const winningMoves = gameController.getWinningMoves();
            if(winningMoves.includes(value)){
                element.nextSibling.classList.add("wining-position");
            }
        });
    },
    resetDisplay: function () {

        this.inputs.forEach(element => {
            element.removeAttribute("disabled");
            element.nextSibling.textContent = "";
        });
        this.gameStatusDisplayUpdate();

    },
    disableDisplay : function(){
        this.inputs.forEach(element => {
            element.setAttribute("disabled", "disable");
        });
    },
    render: function () {
        gameView.viewport.style.display = 'block';
        registerView.hideView();

        this.player1Label.forEach(element => {
            element.innerHTML = gameController.getPlayer1Name();
        });

        this.player2Label.forEach(element => {
            element.innerHTML = gameController.getPlayer2Name();
        });

        this.updatePlayerName();
    },

    updatePlayerName: function () {
        this.currentPlayerLabel.forEach(element => {
            element.innerHTML = gameController.getCurrentPlayerName();
        });
    },

    hideView: function () {
        this.viewport.style.display = 'none';
    }
}

const registerView = {
    init: function () {
        this.viewport = document.querySelector('#registerView');
        this.player1Name = document.querySelector('#Player1Name');
        this.player2Name = document.querySelector('#Player2Name');
        this.btnStart = document.querySelector('#btnStart');

        this.btnStart.addEventListener('click', function () {
            if (registerView.player1Name.value !== '' && registerView.player2Name.value !== '') {
                gameController.setPlayerName(registerView.player1Name.value, registerView.player2Name.value);
                gameView.render();
            }
            else {
                alert("Please add both players name");
            }

        });

    },
    render: function () {
        this.viewport.style.display = 'block';
        gameView.hideView();
    },
    hideView: function () {
        this.viewport.style.display = 'none';
    }
}

const scoreBoardView = {
    init: function () {
        this.scoreboard = document.querySelector('#scoreboard ul');
        this.render();
    },
    render: function () {
        const winnerList = gameController.getWinnerList();
        let position = 1;
        let previousCount = 0;
        winnerList.forEach((item) => {
            const liEle = document.createElement('li');
            if (previousCount > item.count) {
                position++;
            }
            previousCount = item.count;
            const is_multiple = item.count > 1 ? 's' : '';
            liEle.innerHTML = `
                <span class='font-weight-bold'>#${position}</span>
                <span>${item.name}</span>
                <span class="text-right">(${item.count} win${is_multiple})</span>`;
            liEle.classList.add('list-group-item');
            scoreBoardView.scoreboard.appendChild(liEle);
        });
    }
}

