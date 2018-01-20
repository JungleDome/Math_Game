const TicTacToe_gameRow = 5;
const TicTacToe_gameCol = 5;

function Room(args) {
    this.roomID           = args.roomID;
    this.player1          = args.player1;
    this.player2          = args.player2;
    this.status           = 'Initializing';
    this.player1Ready     = false;  //Boolean
    this.player2Ready     = false;  //Boolean
    this.maps             = args.maps;          //[Map_Puzzle;Map_Riddle;Map_FindMe;Map_TicTacToe]
    this.rounds           = 0;
    this.playerTurns      = this.player1;	//Current player turns
    this.timeLimit        = null;           //Map duration in milliseconds.
    this.startTime        = null;	    	//Time of starting the map in js time.
    this.player1Points    = 0;
    this.player2Points    = 0;
    this.questions        = args.questions;		//Questions in array form  {questionID;questionFileName;questionAnswer;questionChoices}
    this.tictactoePattern = null;
    this.findmePattern    = null;
    this.puzzlePattern    = null;
    this.player1False     = false;
    this.player2False     = false;
    this.self_timer       = args.self_timer;
}

Room.prototype.initRoom = function() {
    this.initCheck = this.roomID?true:console.trace('No roomID provided');
    this.initCheck = this.player1?true:console.trace('No player1 provided');
    this.initCheck = this.player2?true:console.trace('No player2 provided');

    switch (this.maps) {
        case "Map_TicTacToe":
            //**5x5 TicTacToe**// B = None, F = Player1, S = Player2
            //Custom format (state)
            //   [0,0,0,0,0]   \\
            //   [0,0,0,0,0]   //
            //   [0,0,0,0,0]   \\
            //   [0,0,0,0,0]   //
            //   [0,0,0,0,0]   \\
            //*****************//
            this.tictactoePattern = [["B","B","B","B","B"],["B","B","B","B","B"],["B","B","B","B","B"],["B","B","B","B","B"],["B","B","B","B","B"]];
            this.timeLimit = 30000;
            break;
        case "Map_Puzzle":
            //****7x7 Puzzle*****// B = NONE, S = SystemDefined, N = EmptyValue, C = CorrectAnswer, W = WrongAnswer
            //Custom format (state_value_number) (ex:S_6_1,C_14_1,W_9_1)
            //  [B,N,B,N,B,B,B]  \\
            //  [N,S,S,S,N,S,N]  //
            //  [B,N,B,N,B,B,B]  \\
            //  [B,S,B,S,B,B,B]  //
            //  [B,N,B,N,B,B,B]  \\
            //  [B,S,B,S,B,B,B]  //
            //  [B,N,B,N,B,B,B]  \\
            //*******************//
            this.puzzlePattern = [["B","N__1","B","N__2","B","B","B"],["N__3","S_*_","S_14_","S_-_","N__4","S_=_","N__"],["B","N__5","B","N__6","B","B","B"],
                ["B","S_*_","B","S_*_","B","B","B"],["B","S_*_","B","S_2_","B","B","B"],["B","S_=_","B","S_=_","B","B","B"],["B","N__","B","N__","B","B","B"]];
            this.timeLimit = 30000;
            break;
        case "Map_FindMe":
            //**5x6 FindMe**// C = Closed(Default), O = Opened, T = True, F = False
            //Custom format (state_value) (ex:C_T,O_F)
            //   [C,C,C,C,C]   \\
            //   [C,C,C,C,C]   //
            //   [C,C,C,C,C]   \\
            //   [C,C,C,C,C]   //
            //   [C,C,C,C,C]   \\
            //   [C,C,C,C,C]   //
            //*****************\\
            this.findmePattern = [["C_F","C_T","C_F"],["C_F","C_F","C_F"],["C_F","C_F","C_F"]];
            this.timeLimit = 90000;
            break;
        case "Map_Riddle":
            this.timeLimit = 30000;
            break;
        default:
            break;
    }
};

Room.prototype.isBothPlayerReady = function() {
    return (this.player1Ready&&this.player2Ready)
};

//For riddle map
Room.prototype.isBothPlayerWrong = function() {
    if (this.player1False&&this.player2False) {
        this.player1False = false;
        this.player2False = false;
        return true;
    } else {
        return false;
    }
};

Room.prototype.startGame = function() {
    if (!this.maps) {console.trace('No map provided');}
    if (!this.timeLimit) {console.trace('No duration provided');}
    //PRODUCTION: if (!this.questions) {console.trace('No questions provided');}

    this.status      = "Start";
    this.playerTurns = this.player1;
    this.startTime   = new Date();


};

/*
 * @function check is room finish
 */
Room.prototype.isTimeEnd= function() {
    this.now = new Date();
    return ((this.now - this.startTime)>=this.timeLimit)
};

/*Calculate time remaining for certain room
 * @function return remaining time with format mm:ss
 */
Room.prototype.getTimeRemain= function() {
    this.now = new Date();
    return new Date((this.startTime-this.now)+this.timeLimit).toISOString().slice(14,19);
};

Room.prototype.addPlayer1Point= function() {this.player1Points++;};
Room.prototype.addPlayer2Point= function() {this.player2Points++;};
Room.prototype.reducePlayer1Point= function() {this.player1Points--;};
Room.prototype.reducePlayer2Point= function() {this.player2Points--;};

Room.prototype.addRounds = function() {this.rounds++;};

Room.prototype.checkWins= function() {
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
        return TicTacToe_checkPlayer1Win(this.tictactoePattern)?{win:this.player1,lose:this.player2}:{win:this.player2,lose:this.player1};
    } else {console.trace('Invalid Map Given.Map Name='+this.maps);}
};

Room.prototype.destroyRoom= function() {
    clearInterval(this.self_timer);
    this.roomID           = null;
    this.player1          = null;
    this.player2          = null;
    this.status           = null;
    this.player1Ready     = null;
    this.player2Ready     = null;
    this.maps             = null;
    this.rounds           = null;
    this.playerTurns      = null;
    this.timeLimit        = null;
    this.startTime        = null;
    this.player1Points    = null;
    this.player2Points    = null;
    this.questions        = null;
    this.tictactoePattern = null;
    this.findmePattern    = null;
    this.puzzlePattern    = null;
    delete this.roomID;
    delete this.player1;
    delete this.player2;
    delete this.status           ;
    delete this.player1Ready     ;
    delete this.player2Ready     ;
    delete this.maps             ;
    delete this.rounds           ;
    delete this.playerTurns      ;
    delete this.timeLimit        ;
    delete this.startTime       ;
    delete this.player1Points    ;
    delete this.player2Points    ;
    delete this.questions       ;
    delete this.tictactoePattern ;
    delete this.findmePattern    ;
    delete this.puzzlePattern    ;
};

Room.prototype.isGameFinish= function() {
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
            return (TicTacToe_checkPlayer1Win(this.tictactoePattern)||TicTacToe_checkPlayer2Win(this.tictactoePattern));
            break;
        case "Map_Puzzle":
            //Puzzle ends as all the question are answered, which total point for the map is 8 points.
            console.trace("game finish: " + ((this.player1Points+this.player2Points)));
            return ((this.player1Points+this.player2Points)===8);
            break;
        case "Map_FindMe":
            //FindMe ends as either player1 or player2 found the true card three times.
            //return ((this.player1Points+this.player2Points)===3);
            return (this.rounds===3);
            break;
        case "Map_Riddle":
            //Riddle ends as time reach zero or all question is answered, which total point for the map is 8 points.
            console.trace("game finish: " + ((this.player1Points+this.player2Points)));
            return ((this.rounds>=8)||this.isTimeEnd()); //Using >= operator is due to the player.answered mechanism adding rounds even it exceeds question count.
            break;
        default:
            console.trace('Invalid Map Given.Map Name='+this.maps);
            break;
    }
};

Room.prototype.updatePattern= function(x,y,state,value,questionNumber) {
    //Build pattern
    value = value?value:"";
    questionNumber = questionNumber?questionNumber:"";
    var builtPattern = null;
    //Update pattern
    switch (this.maps) {
        case "Map_TicTacToe":
            this.tictactoePattern[y][x] = state;
            break;
        case "Map_Puzzle":
            builtPattern = state.concat('_'+value).concat('_'+questionNumber);
            // console.log(builtPattern);
            // console.log(this.puzzlePattern);
            // console.log("X: "+x+" ,Y: "+y);
            this.puzzlePattern[y][x] = builtPattern;
            break;
        case "Map_FindMe":
            var beforePattern = this.findmePattern[x][y];
            builtPattern = state.concat('_'+beforePattern.split("_")[1]);
            this.findmePattern[x][y] = builtPattern;
            break;
        case "Map_Riddle":
            break;
        default:
            console.trace('Invalid Map Given.Map Name='+this.maps);
            break;
    }
};

Room.prototype.getPattern= function() {
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
            console.trace('Invalid Map Given.Map Name='+this.maps);
            break;
    }
};

Room.prototype.getProcessedQuestion= function() {
    //Mirror the data;
    this.processedQuestions = shallowCopy({},this.questions);
    for (var i =0 ;i<this.processedQuestions.length;i++) {
        delete this.processedQuestions[i]["questionAnswer"];
    }
    //console.trace(this.processedQuestions);
    return this.processedQuestions;
};

Room.prototype.randomizePattern = function() {
    this.findmePattern = [["C_F","C_F","C_F"],["C_F","C_F","C_F"],["C_F","C_F","C_F"]];
    var newX = getRandomInt(2);
    var newY = getRandomInt(2);
    this.findmePattern[newY][newX] = "C_T";
    console.log(this.findmePattern);
}

module.exports = Room;

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
};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
};

//**************************************\\
//										//
//FUNCTION METHOD FOR TIC TAC TOE MAP   \\
//										//
//**************************************\\

function TicTacToe_checkPlayer1Win(tictactoePattern) {
    //Make a empty grid.
    //CurentShape:[]
    //ShapeToBe:
    //	[*,*,*,*,*]
    //	[*,*,*,*,*]
    //	[*,*,*,*,*]
    //	[*,*,*,*,*]
    //	[*,*,*,*,*]
    var checkedBox = [];
    for (var i=0;i<5;i++) {
        //Make an array of rows
        //Shape:[*,*,*,*,*]
        var tempRow = [];
        for (var j=0;j<5;j++) {
            tempRow.push(TicTacToe_IsPlayer1(tictactoePattern,i,j));
        }
        //Add the array into main grid.
        checkedBox.push(tempRow);
    }
    return (TicTacToe_checkDiagonal(checkedBox)||TicTacToe_checkHorizontal(checkedBox)||TicTacToe_checkVertical(checkedBox))
}

function TicTacToe_checkPlayer2Win(tictactoePattern) {
    var checkedBox = [];
    for (var i=0;i<5;i++) {
        var tempRow = [];
        for (var j=0;j<5;j++) {
            tempRow.push(TicTacToe_IsPlayer2(tictactoePattern,i,j));
        }
        checkedBox.push(tempRow);
    }
    return (TicTacToe_checkDiagonal(checkedBox)||TicTacToe_checkHorizontal(checkedBox)||TicTacToe_checkVertical(checkedBox))
}

function TicTacToe_IsPlayer1(tictactoePattern,row,col) {
    var currentBox = tictactoePattern[row][col];
    if (currentBox == "F") {
        return 1;
    }
    else return 0;
}

function TicTacToe_IsPlayer2(tictactoePattern,row,col) {
    var currentBox = tictactoePattern[row][col];
    if (currentBox == "S") {
        return 1;
    }
    else return 0;
}

function TicTacToe_checkHorizontal(checkedBox) {
    for (var i=0;i<5;i++) {
        var H1 = (checkedBox[i][0]==1);
        var H2 = (checkedBox[i][1]==1);
        var H3 = (checkedBox[i][2]==1);
        var H4 = (checkedBox[i][3]==1);
        var H5 = (checkedBox[i][4]==1);

        var case1 = H1&&H2&&H3&&H4;
        var case2 = H2&&H3&&H4&&H5;
        if (case1||case2) {
            return true;
        }
    }
    return false;
}

function TicTacToe_checkVertical(checkedBox) {
    for (var j=0;j<5;j++) {
        var V1 = (checkedBox[0][j]==1);
        var V2 = (checkedBox[1][j]==1);
        var V3 = (checkedBox[2][j]==1);
        var V4 = (checkedBox[3][j]==1);
        var V5 = (checkedBox[4][j]==1);

        var case1 = V1&&V2&&V3&&V4;
        var case2 = V2&&V3&&V4&&V5;
        if (case1||case2) {
            return true;
        }
    }
    return false;
}

function TicTacToe_checkDiagonal(checkedBox) {
    //	[*,*,*,*,*]
    //	[*,*,*,*,*]
    //	[*,*,*,*,*]
    //	[*,*,*,*,*]
    //	[*,*,*,*,*]
    //In backslash pattern
    var D1 = (checkedBox[2][1]==1);
    var D2 = (checkedBox[2][2]==1);
    var D3 = (checkedBox[2][3]==1);

    if (D1) {
        let C1_1 = (checkedBox[1][0]==1);
        let C1_2 = (checkedBox[2][1]==1);
        let C1_3 = (checkedBox[3][2]==1);
        let C1_4 = (checkedBox[4][3]==1);

        let C2_1 = (checkedBox[0][3]==1);
        let C2_2 = (checkedBox[1][2]==1);
        let C2_3 = (checkedBox[2][1]==1);
        let C2_4 = (checkedBox[3][0]==1);

        let case1 = C1_1&&C1_2&&C1_3&&C1_4;
        let case2 = C2_1&&C2_2&&C2_3&&C2_4;
        
        if (case1||case2) {
            return true;
        }
    } else if (D2) {
        let C1_1 = (checkedBox[0][0]==1);
        let C1_2 = (checkedBox[1][1]==1);
        let C1_3 = (checkedBox[2][2]==1);
        let C1_4 = (checkedBox[3][3]==1);
        let C1_5 = (checkedBox[4][4]==1);
        
        let case1 = C1_1&&C1_2&&C1_3&&C1_4;
        let case2 = C1_2&&C1_3&&C1_4&&C1_5;

        if (case1||case2) {
            return true;
        }
    } else if (D3) {
        let C1_1 = (checkedBox[0][1]==1);
        let C1_2 = (checkedBox[1][2]==1);
        let C1_3 = (checkedBox[2][3]==1);
        let C1_4 = (checkedBox[3][4]==1);

        let C2_1 = (checkedBox[1][4]==1);
        let C2_2 = (checkedBox[2][3]==1);
        let C2_3 = (checkedBox[3][2]==1);
        let C2_4 = (checkedBox[4][1]==1);

        let case1 = C1_1&&C1_2&&C1_3&&C1_4;
        let case2 = C2_1&&C2_2&&C2_3&&C2_4;

        if (case1||case2) {
            return true;
        }
    }
    return false;
}
