describe("Game Controller Test", function () {

    beforeEach(function () {
        
    });

    describe("in the isComplete function", function () {
        it("should return the boolean true only when correct inputs are given", function () {
            expect(gameController.isComplete([1, 2])).toBe(false);
            expect(gameController.isComplete([1, 2, 3])).toBe(true);
            expect(gameController.isComplete([2, 3, 4, 5])).toBe(false);
            expect(gameController.isComplete([4, 5, 6])).toBe(true);
        });
        it("should throw error if string is include in the parameters", function () {
            expect(function(){
                gameController.isComplete(["1", 2, 3]);
            }).toThrowError("Parameter must be a number array");
            expect(function(){
                gameController.isComplete(["1", false, 3]);
            }).toThrowError("Parameter must be a number array");
        });
    });

    describe("in the changePlayer function", function () {
        it("should change current player if changePlayer function is called", function () {
            const firstPlayer = gameController.getCurrentPlayer();
            gameController.changePlayer();

            expect(gameController.getCurrentPlayer()).not.toEqual(firstPlayer);
        });
    });

    describe("in the selectPosition function", function () {
        it("should throw error if index is out of range from 1 to 9", function () {
            expect(function () {
                gameController.setPosition(0);
            }).toThrowError("Position out-of-range");
        });
        it("should throw error if the position is already selected by any players", function () {
            gameController.setPosition(1);
            expect(function () {
                gameController.setPosition(1);
            }).toThrowError("Position already selected");
        });
    });

    describe("in the restartGame function", function () {                
        it("should change the current player to player 1", function () {
            gameController.restartGame();
            expect(gameController.getCurrentPlayer()).toEqual(1);
        });
        it("should empty the selected potision of both players", function () {
            gameController.restartGame();
            expect(gameModel.positionsOfPlayer1).toEqual([]);
            expect(gameModel.positionsOfPlayer2).toEqual([]);
        });
    });

});
