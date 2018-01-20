//TODO:Convert into nodejs class
module.exports = function(args) {
	const TicTacToe_gameRow = 5;
	const TicTacToe_gameCol = 5;
	var self_timer = null;
    var tictactoePattern,findmePattern,puzzlePattern = null;
	if (args.roomID) {var roomID = args.roomID;}
	else {console.trace('No roomID provided.');}
	
	if (args.player1) {var player1 = args.player1;}
	else {console.trace('No player1 provided');}

    if (args.player2) {var player2 = args.player2;}
    else {var player2 = null;}

	if (args.status) {var status = args.status;}
	else {console.trace('No status provided');}

    if (args.maps) {
	    var maps = args.maps;
        switch (maps) {
            case "Map_TicTacToe":
                //**5x5 TicTacToe**// 0 = None, 1 = Player1, 2 = Player2
                //Custom format (state)
                //   [0,0,0,0,0]   \\
                //   [0,0,0,0,0]   //
                //   [0,0,0,0,0]   \\
                //   [0,0,0,0,0]   //
                //   [0,0,0,0,0]   \\
                //*****************//
                tictactoePattern = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
                break;
            case "Map_Puzzle":
                //****7x7 Puzzle*****// B = NONE, S = SystemDefined, N = EmptyValue, C = CorrectAnswer, W = WrongAnswer
                //Custom format (state_value) (ex:S_6,C_14,W_9)
                //  [B,N,B,N,B,B,B]  \\
                //  [N,S,S,S,N,S,N]  //
                //  [B,N,B,N,B,B,B]  \\
                //  [B,S,B,S,B,B,B]  //
                //  [B,N,B,N,B,B,B]  \\
                //  [B,S,B,S,B,B,B]  //
                //  [B,N,B,N,B,B,B]  \\
                //*******************//
                puzzlePattern = [["B","N__1","B","N__2","B","B","B"],["N__3","S_*","S_14","S_-",,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];
                break;
            case "Map_FindMe":
                //**5x6 FindMe**// C = Closed(Default), O = Opened
                //Custom format (state_value) (ex:S_6,C_14,W_9)
                //   [C,C,C,C,C]   \\
                //   [C,C,C,C,C]   //
                //   [C,C,C,C,C]   \\
                //   [C,C,C,C,C]   //
                //   [C,C,C,C,C]   \\
                //   [C,C,C,C,C]   //
                //*****************\\
                findmePattern = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
                break;
            default:
                break;
        }
	}
    else {var maps = null;}

	if (args.rounds) {var rounds = args.rounds;}
	else {var rounds = 0;}
	
	if (args.playerTurns) {var playerTurns = args.playerTurns;}
	else {var playerTurns = null;}

    var startTime = null;
    var player1Points = 0;
    var player2Points = 0;


    if (args.player1Ready) {var player1Ready = args.player1Ready}
    else {var player1Ready = false;}

    if (args.player2Ready) {var player2Ready = args.player2Ready}
    else {var player2Ready = false;}

    if (args.questions) {
    	var questions = args.questions;
    	/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    	 ! TODO:MOVE THE SHUFFLE ARRAY TO A NEW FUNCTION !
    	 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
        if (args.maps==="Map_FindMe") {
			var answerArray = [];
			for (i=0;i<questions.length-1;i++) {
				//Duplicate the answer bcz this is findme, player must match it.
				answerArray.push(questions[i].questionAnswer);
                answerArray.push(questions[i].questionAnswer);
			}
			//Shuffle answerArray
			Array_shuffle(answerArray);
        }
    } else {console.trace('No question provided.');}
	
	return {
		roomID:roomID,
		player1:player1,
		player2:player2,
		status:status,
		player1Ready:player1Ready,  //Boolean
        player2Ready:player2Ready,  //Boolean
		maps:maps,                  //[Map_Puzzle,Map_Riddle,Map_FindMe,Map_TicTacToe]
		rounds:rounds,				//Current rounds
		playerTurns:playerTurns,	//Current player turns
		timeLimit:args.timeLimit,	//Map duration in milliseconds.
		startTime:startTime,		//Time of starting the map in js time.
		player1Points:player1Points,
		player2Points:player2Points,
		questions:questions,				//Questions in array form  {questionID,questionFileName,questionAnswer,questionChoices}
		tictactoePattern:tictactoePattern,
		findmePattern:findmePattern,
		puzzlePattern:puzzlePattern,
        self_timer:self_timer,


		isBothPlayerReady: function() {
			return (this.player1Ready&&this.player2Ready)
		},

		startGame: function() {
            if (!this.maps) {console.trace('No map provided');}
            if (!this.timeLimit) {console.trace('No duration provided');}
            //PRODUCTION: if (!this.questions) {console.trace('No questions provided');}

			this.status      = "Start";
			this.playerTurns = this.player1;
			this.startTime   = new Date();


		},
		/*
		 * @function check is room finish
		 */
		isTimeEnd: function() {
            this.now = new Date();
			return ((this.now - this.startTime)>=this.timeLimit)
		},
		/*Calculate time remaining for certain room
		 * @function return remaining time with format mm:ss
		 */
		getTimeRemain: function() {
            this.now = new Date();
            var timeRemain = new Date(new Date((this.startTime.getMilliseconds()+this.timeLimit))-this.now);
            return ((timeRemain.getMinutes()<10?'0':'') + timeRemain.getMinutes()) + ":" + ((timeRemain.getSeconds()<10?'0':'') + timeRemain.getSeconds())
		},

		addPlayer1Point: function() {
			this.player1Points++;
		},
		addPlayer2Point: function() {
            this.player2Points++;
		},
        reducePlayer1Point: function() {
            this.player1Points--;
        },
        reducePlayer2Point: function() {
            this.player2Points--;
        },
		checkWins: function() {
			if (this.maps==="Map_Puzzle"||this.maps==="Map_Riddle"||this.maps==="Map_FindMe") {
			    //TODO:Handle draw situation
                if (this.player1Points>this.player2Points) {
                    return {win:this.player1,lose:this.player2}
                } else if (this.player2Points>this.player1Points) {
                    return {win:this.player2,lose:this.player1}
                } else {
                    return {draw:true};
                }
            } else if (this.maps==="Map_TicTacToe") {
                if (TicTacToe_checkPlayer1Win()) {
                    return {win:this.player1,lose:this.player2}
                } else {
                    return {win:this.player2,lose:this.player1}
                }
            } else {
                //Invalid map name
                console.trace('Invalid Map Given.Map Name:'+this.maps);
            }
		},
		destroyRoom: function() {
			//HELPPPPPP!!
            clearTimeout(this.self_timer);
            // this.roomID = undefined;
            // this.player1 = undefined;
            // this.player2 = undefined;
            // this.status = undefined;
            // this.player1Ready = undefined;
            // this.player2Ready = undefined;
            // this.maps = undefined;
            // this.rounds = undefined;
            // this.playerTurns = undefined;
            // this.timeLimit = undefined;
            // this.startTime = undefined;
            // this.player1Points = undefined;
            // this.player2Points = undefined;
            // this.questions = undefined;
            // this.tictactoePattern = undefined;
            // this.puzzlePattern = undefined;
            // this.findmePattern = undefined;
            // this.self_timer = undefined;
		},
		isGameFinish: function() {
			//Check is the game finish by answering all question
			//***********************//
            //FIND ME-15Q    = 15Q   \\
			//RIDDLE -20Q+4Q = 24Q   //
			//TTT    -15Q+4Q = 19Q   \\
			//Puzzle -8Q+4Q  = 12Q   //
			//***********************\\
			
            switch (this.maps) {
                case "Map_TicTacToe":
                    //TTT ends as the user forms a pattern on the boxes.
                    return (TicTacToe_checkPlayer1Win()||TicTacToe_checkPlayer2Win());
                    break;
                case "Map_Puzzle":
                    //Puzzle ends as all the question are answered, which total point for the map is 8 points.
                    return ((this.player1Points+this.player2Points)===8);
                    break;
                case "Map_FindMe":
                    //FindMe ends as all the card are flipped, which total point for the map is 15 points.
                    return ((this.player1Points+this.player2Points)===15);
                    break;
                case "Map_Riddle":
                    //Riddle ends as time reach zero
                    return this.room.isTimeEnd();
                    break;
                default:
                    console.trace('Invalid Map Given.Map Name:'+this.maps);
                    break;
            }
		},
        updatePattern: function(x,y,state,value) {
            //Build pattern
            if (value) var builtPattern = state.concat('_'+value);
            //Update pattern
            switch (this.maps) {
                case "Map_TicTacToe":
                    this.tictactoePattern[y][x] = state;
                    break;
                case "Map_Puzzle":
                    this.puzzlePattern[y][x] = builtPattern;
                    break;
                case "Map_FindMe":
                    this.findmePattern[y][x] = builtPattern;
                    break;
                case "Map_Riddle":
                    break;
                default:
                    console.trace('Invalid Map Given.Map Name:'+this.maps);
                    break;
            }
        },
        getPattern: function() {
            switch (this.maps) {
                case "Map_TicTacToe":
                    return this.tictactoePattern;
                    break;
                case "Map_Puzzle":
                    return this.puzzlePattern;
                    break;
                case "Map_FindMe":
                    return this.findmePattern;
                    break;
                case "Map_Riddle":
                    return null;
                    break;
                default:
                    console.trace('Invalid Map Given.Map Name:'+this.maps);
                    break;
            }
        },
        getProcessedQuestion: function() {
		    //Mirror the data;
		    this.processedQuestions = shallowCopy({},this.questions);
            for (var i =0 ;i<this.processedQuestions.length;i++) {
                delete this.processedQuestions[i]["questionAnswer"];
            }
            //console.trace(this.processedQuestions);
            return this.processedQuestions;
        }
    };

    //**************************************||
    //	Start Custom Functions				||
    //**************************************||

    function shallowCopy(origin, add) {
        // Don't do anything if add isn't an object
        if (!add || typeof add !== 'object') return origin;

        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
            origin[keys[i]] = add[keys[i]];
        }
        return origin;
    };

    function Array_shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
	}
    };

	//**************************************\\
	//										//
	//FUNCTION METHOD FOR TIC TAC TOE MAP   \\
	//										//
	//**************************************\\

    function TicTacToe_checkPlayer1Win() {
        //Make a empty grid.
        //CurentShape:[]
        //ShapeToBe:
        //	[*,*,*,*,*]
        //	[*,*,*,*,*]
        //	[*,*,*,*,*]
        //	[*,*,*,*,*]
        //	[*,*,*,*,*]
        var checkedBox = [];
        for (i=1;i<=gameRow;i++) {
            //Make an array of rows
            //Shape:[*,*,*,*,*]
            var tempRow = [];
            for (j=1;j<=gameCol;j++) {
                //Method 'push' : add elements into an array
                tempRow.push(TicTacToe_IsPlayer1(i,j));
            }
            //Add the array into main grid.
            checkedBox.push(tempRow);
        }
        if (TicTacToe_checkDiagonal(checkedBox)||TicTacToe_checkHorizontal(checkedBox)||TicTacToe_checkVertical(checkedBox)) {
            return true; //Player 1 Wins
        }
        else return false;
    }

    function TicTacToe_checkPlayer2Win() {
        var checkedBox = [];
        for (i=1;i<=gameRow;i++) {
            var tempRow = [];
            for (j=1;j<=gameCol;j++) {
                tempRow.push(TicTacToe_IsPlayer2(i,j));
            }
            checkedBox.push(tempRow);
        }
        if (TicTacToe_checkDiagonal(checkedBox)||TicTacToe_checkHorizontal(checkedBox)||TicTacToe_checkVertical(checkedBox)) {
            return true; //Player2 Wins!
        }
        else return false;
    }

    function TicTacToe_IsPlayer1(row,col) {
        var currentBox = $('#'+row+'-'+col);
        if (currentBox.text() == player1) {
            return 1;
        }
        else return 0;
    }

    function TicTacToe_IsPlayer2(row,col) {
        var currentBox = $('#'+row+'-'+col);
        if (currentBox.text() == player2) {
            return 1;
        }
        else return 0;
    }

    function TicTacToe_checkHorizontal(checkedBox) {
        for (i=0;i<gameRow;i++) {
            for (j=1;j<gameCol-1;j++) {
                console.log(i+'|'+j);
                var H1 = (checkedBox[i][j-1]==1);
                var H2 = (checkedBox[i][j]==1);
                var H3 = (checkedBox[i][j+1]==1);

                if (H1&&H2&&H3) {
                    return true;
                }
            }
        }
        return false;
    }

    function TicTacToe_checkVertical(checkedBox) {
        for (i=1;i<gameRow-1;i++) {
            for (j=0;j<gameCol;j++) {
                var V1 = (checkedBox[i-1][j]==1);
                var V2 = (checkedBox[i][j]==1);
                var V3 = (checkedBox[i+1][j]==1);

                if (V1&&V2&&V3) {
                    return true;
                }

            }
        }
        return false;
    }

	function TicTacToe_checkDiagonal(checkedBox) {
        //In backslash pattern
        for (i=1;i<gameRow-1;i++) {
            for (j=1;j<gameCol-1;j++) {
                var B = (checkedBox[i][j]==1);
                //backslash pattern
                var A = (checkedBox[i-1][j-1]==1);
                var C = (checkedBox[i+1][j+1]==1);
                //forwardslash pattern
                var D = (checkedBox[i-1][j+1]==1);
                var E = (checkedBox[i+1][j-1]==1);

                if ((A&&B&&C)||(B&&D&&E)) {
                    return true;
                }
            }
        }
        return false;
    }