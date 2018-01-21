//Libraries.
var express    = require('express');  
var app        = express();  
var server     = require('http').createServer(app);  
var io         = require('socket.io')(server);
var mysql      = require('mysql');
var Player     = require('./player');
var Room       = require('./room2');
var Question   = require('./question');
var WinDow_lib = require('./WinDow_lib');

//Configs.
// var con = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: ''
//   //database: 'Math_Game'
// });

//Serve home page when requested.
app.use(express.static(__dirname + '/html'));
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/html/index.html');
});

app.get('/hello', function(request, response) {
    response.send("Hello!");
});

//Connects to mysql database.
// con.connect(function(err) {
//     if (err) throw err;
//     console.log('Database connected!');
//     console.log('Server started up!');
//     console.log('-------------------------------------');
// });

//Binds to a port.
app.set('port', (process.env.PORT || 4004));
server.listen(process.env.PORT || 4004, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

//Example:console.log(WinDow_lib.Array_search(SYS_PLAYER,1,"ID"));//
//TODO: Add player to SYS_PLAYER when they connects to server.


var SYS_PLAYER = [];
var SYS_QUEUE  = [];
var SYS_ROOMS  = [];



//var player1 = new Player({ID: 1, name: "tim", rank: 1201, coin: 1001,socketID:1});
//var player2 = new Player({ID: 2, name: "john", rank: 1202, coin: 1002,socketID:2});

// var player3 = new Player({ID: 3, name: "poop", rank: 1203, coin: 1003,socketID:3});
// var player4 = new Player({ID: 4, name: "chalk", rank: 1204, coin: 1004,socketID:4});
// var room1   = new Room({roomID:1,player1:player1,player2:player2});
// var room2   = new Room({roomID:2,player1:player3,player2:player4});
//

//SYS_PLAYER.push(player1);
//SYS_PLAYER.push(player2);

// SYS_ROOMS.push(room1);
// SYS_ROOMS.push(room2);

//Example: console.log(WinDow_lib.Array_nestedSearch(SYS_ROOMS,1202,['player1','player2'],'rank'));

const SYS_MAP  = ['Map_Puzzle','Map_TicTacToe','Map_FindMe','Map_Riddle'];



//Event listeners.
io.on('connection', function(client) {
    console.log('New connection established.');
    console.log(io.engine.clientsCount + ' client connected...');

    client.on('join', function(data) {
        console.log(data);
        client.emit('messages', 'Hello from server.Your ID is '+client.id+' .');
        //Login
        /*Fake user ID inserted here*/
        /*Remove for production*/
	});

    client.on('disconnect', function(data) {
        console.log('One connection dropped.');
        console.log(io.engine.clientsCount + ' client left...');
    });

    client.on('MENU.Handshake',function(data){
        console.log("(✓) Connected to client" + "|ID:"+ data.id +"|socketID:"+ data.socketID);
    });

    client.on('PLAYER.login',function(data) {
        console.log(data);
        //connection.query('SELECT * FROM [player] WHERE PlayerUsername = ? AND PlayerPassword = ?',[data.PlayerUsername,data.PlayerPassword], function (error, results, fields) {
            //if (error) throw error;
            //Failed to login
            //if (!results) {
            //     client.emit('PLAYER.loginFailed');
            //} else {
                client.emit('PLAYER.loginSuccess',{id:data.username,socketID:client.id});
            // }
        // });
    });

    client.on('PLAYER.register',function(data) {
        connection.query('INSERT INTO [player] (PlayerUsername,PlayerPassword) VALUES (?,?)',[data.PlayerUsername,data.PlayerPassword], function (error, results, fields) {
            if (error) throw error;
            //Failed to login
            if (results.affectedRows !== 1) {
                client.emit('PLAYER.registerFailed');
            } else {
                client.emit('PLAYER.registerSuccess');
            }
        });
    });

    client.on('PLAYER.getStats',function(arg,cb) {
       var player = loadPlayerData(arg);
       cb(player);
       console.log(player);
    });

    client.on('PLAYER.getMatchHistory',function(arg) {
        client.emit('PLAYER.matchHistory',{matchHistory:[{maps:"Riddle",player1:"Tim",player2:"John",moneyEarned:"100",rankEarned:"50",result:"Win"}]});
    });

    client.on('QUEUE.join',function(data) {
        console.log("-----START------QUEUE-----");
        console.log("QUEUE.join from ID:"+data.id);
        console.log("--------------------------");
        //Find queue player if not then join queue
        var gameFound = false;
        var player = loadPlayerData(data);
        SYS_PLAYER.push(player);
        console.log(player);
        console.log("--------------------------");
        for (i=0;i<SYS_QUEUE.length;i++) {
            var rankDifference = player.rank-SYS_QUEUE[i].rank;
            //POSSIBLE BUG: queue not syncronized for every socket request
            console.log('Finding player from SYS_QUEUE');
            console.log("--------------------------");
            if ((rankDifference<=100&&rankDifference>=-50)) {
                //Let player join room
                var roomID = SYS_ROOMS.length+1;
                console.log("Created room with RoomID:"+roomID);
                client.join(roomID);
                //PRODUCTION:SYS_MAP[Math.floor(Math.random()*3)]});
				var newRoom = new Room({roomID:roomID,player1:player,status:'initializing',maps:SYS_MAP[Math.floor(Math.random()*3)]});
				SYS_ROOMS.push(newRoom);
                console.log("--------------------------");
                console.log("Room initiatorID:"+player.socketID);
                console.log("Room connectorID:"+SYS_QUEUE[i].socketID);
                console.log("--------------------------");
                    //Tells the opponent to join his room
                console.log("Calling connector to join room");
                console.log("-----END------QUEUE-----");
                io.to(SYS_QUEUE[i].socketID).emit('QUEUE.found',{roomID:roomID});
                gameFound = true;
            } else {
            }
        }
        if (!gameFound) {
            console.log("No queue found.Adding player to SYS_QUEUE. SocketID:"+player.socketID);
            console.log("-----END------QUEUE-----");
            SYS_QUEUE.push(player);
            client.emit('QUEUE.wait',{/* FOR FUN :) */globalPlayerCount:io.engine.clientsCount});
        }
    });

    client.on('QUEUE.leave',function(data) {
        console.log("Queue Remove:"+data.id);
        WinDow_lib.Array_remove(SYS_QUEUE,parseInt(data.id),"ID");
    });

    client.on('ROOM.join',function(data) {
       var roomID = data.roomID;
       client.join(roomID);
	   console.log("Someone joined the room :"+roomID);
       console.log("Room "+roomID+" : "+io.sockets.adapter.rooms[roomID].length+" client");
       WinDow_lib.Array_remove(SYS_QUEUE,parseInt(data.id),"ID");
       //Tell both player to start game
	   console.log("Initializing room "+roomID);

	   var room       = WinDow_lib.Array_search(SYS_ROOMS,parseInt(roomID),"roomID");
	   room.player2   = WinDow_lib.Array_search(SYS_PLAYER,data.socketID,"socketID");
	   room.status    = "Loading";
	   room.initRoom();

       io.in(roomID).emit('GAME.startload',{mapName:room.maps});
	   console.log('Get question');
	   loadQuestion(room); //POSSIBLE BUG (DELAY OF LOADING FROM DATABASE CAUSING NULL VALUES LOADED)
    });


    //TODO:Event Correction-DC more than 1min//
    client.on('ROOM.leave',function(data) {
        var roomID = data.roomID;
        client.to(roomID).emit('ROOM.leave',roomID);
        client.leave(roomID);
        WinDow_lib.Array_nestedRemove(SYS_ROOMS,parseInt(roomID),"roomID");
        console.log("Room disband: "+roomID);
    });

    client.on('GAME.requestRoomDetails',function(data,callback) {
            console.log('SERVER:GAME.requestRoomDetails');
            var room = WinDow_lib.Array_nestedSearch(SYS_ROOMS,data.socketID,['player1','player2'],'socketID');
            var processedQuestion = room.getProcessedQuestion();
            callback({room:room,questions:processedQuestion});
    });

    client.on('GAME.ready',function(data) {
        //Flag the player as ready
	    this.room = WinDow_lib.Array_nestedSearch(SYS_ROOMS,data.socketID,['player1','player2'],'socketID');
	    if (this.room.player1.socketID===data.socketID) {
	        this.room.player1Ready = true;
	        console.log("Player "+this.room.player1.name+" ready");
        } else if (this.room.player2.socketID===data.socketID) {
            this.room.player2Ready = true;
            console.log("Player "+this.room.player2.name+" ready");
        } else {
            console.trace('Player not in the room!Socket ID: '+data.socketID+' ,Room ID: '+this.room.roomID);
        }

        //Check is both player ready, if ready then start the game.
        if (this.room.isBothPlayerReady()) {
            console.log("GAME.ready:"/*+io.sockets.adapter.rooms['1']*/);
            this.room.status = "Ready";
            //Broadcast GAME.start Event
            io.in(this.room.roomID).emit('GAME.start', {room: this.room});
            this.room.startGame();
            //Broadcast PLAYER.move Event
            //TODO: insert game start logic here for every map!!
            if (this.room.maps === "Map_Puzzle") {
                setTimeout(function (room2) {
                    io.in(room2.roomID).emit('PLAYER.move');
                }, 5000, this.room);
            } else if (this.room.maps === "Map_Riddle") {
                setTimeout(function (room2) {
                    io.in(room2.roomID).emit('GAME.updateQuestion', {rounds: room2.rounds});
                }, 5000, this.room);
            } else if (this.room.maps === "Map_TicTacToe") {
                setTimeout(function (room2) {
                    io.in(room2.roomID).emit('PLAYER.move');
                }, 5000, this.room);
            } else if (this.room.maps === "Map_FindMe") {
                setTimeout(function (room2) {
                    io.in(room2.roomID).emit('GAME.updateQuestion', {nothing: 0});
                }, 5000, this.room);
            }
            this.room.self_timer = setInterval(function (room) {
                if (room.maps === "Map_Puzzle") {
                    if (!room.isTimeEnd()) {
                        io.in(room.roomID).emit("GAME.tick", {timerText: room.getTimeRemain()});
                        console.log('Room '+room.roomID+' | Time Left:'+room.getTimeRemain());
                    } else {
                        io.in(room.roomID).emit("GAME.stop", {reason: 'Times Up!'});
                        console.log("Game.stop");
                        checkGameWins(room);
                    }
                } else if (room.maps === "Map_Riddle") {
                    if (!room.isTimeEnd()) {
                        io.in(room.roomID).emit("GAME.tick", {timerText: room.getTimeRemain()});
                        console.log('Room '+room.roomID+' | Time Left:'+room.getTimeRemain());
                    } else {
                        io.in(room.roomID).emit("GAME.stop", {reason: 'Times Up!'});
                        console.log("Game.stop");
                        checkGameWins(room);
                    }
                } else if (room.maps === "Map_TicTacToe") {
                    if (!room.isTimeEnd()) {
                        io.in(room.roomID).emit("GAME.tick", {timerText: room.getTimeRemain()});
                        console.log('Room '+room.roomID+' | Time Left:'+room.getTimeRemain());
                    } else {
                        io.in(room.roomID).emit("GAME.stop", {reason: 'Times Up!'});
                        console.log("Game.stop");
                        checkGameWins(room);
                    }
                } else if (room.maps === "Map_FindMe") {
                    if (!room.isTimeEnd()) {
                        io.in(room.roomID).emit("GAME.tick", {timerText: room.getTimeRemain()});
                        console.log('Room '+room.roomID+' | Time Left:'+room.getTimeRemain());
                    } else {
                        io.in(room.roomID).emit("GAME.stop", {reason: 'Times Up!'});
                        console.log("Game.stop");
                        checkGameWins(room);
                    }
                }
            }, 1000, this.room);
        }
    });


    client.on('PLAYER.answer',function(data) {
        //data format {id,socketID,location (as in box name)(Ex:Q1) ,answer (Ex:12(String)),gameLocation(Ex:x_y)}
        //SYNC the room details on both client
        //Get is player1/plyr2 then check answer and give points and change round
        //Update Room pattern details

        /**************************
         * Start Custom Functions *
         **************************/
        console.log("++Player Answered++");
        console.log(data);
        console.log("--Player Answered--");
        function updatePuzzlePattern(roomRef,gameLocation,state,value,questionNumber) {
            var location_x,location_y;
            location_x = String(gameLocation).split('_')[0];
            location_y = String(gameLocation).split('_')[1];
            roomRef.updatePattern(location_x,location_y,state,value,questionNumber);
        }

        /************************
         * End Custom Functions *
         ************************/


        //Check is answer in valid form
		//TODO:Handle two player answer at the same time
        //if (data.location&&data.answer) {
        var questionID = null;
        var isCorrect = false;
        this.room = WinDow_lib.Array_nestedSearch(SYS_ROOMS, data.socketID, ['player1', 'player2'], 'socketID');

        if (data.answer) {
            //Check if answer is correct
            if (this.room.maps==="Map_TicTacToe") {
                //location:xyLocation,answer:answer,questionNumber:questionNumber
                if (data.location) {
                    console.log(data.questionNumber);
                    questionID = data.questionNumber;
                    this.answeringQuestion = WinDow_lib.Array_search(this.room.questions, parseInt(questionID), "questionID");
                    isCorrect = this.answeringQuestion.checkAnswer(data.answer);
                }
            } else if (this.room.maps==="Map_Puzzle") {
                if (data.location) {
                    questionID = data.location.replace('Q', '');
                    this.answeringQuestion = WinDow_lib.Array_search(this.room.questions, parseInt(questionID), "questionID");
                    isCorrect = this.answeringQuestion.checkAnswer(data.answer);
                } else {
                    //TODO:Calculate the total digit for the row/column
                    //data.gameLocation
                }
            } else if (this.room.maps==="Map_FindMe") {
                questionID = data.questionID;
                this.answeringQuestion = WinDow_lib.Array_search(this.room.questions, parseInt(questionID), "questionID");
                isCorrect = this.answeringQuestion.checkAnswer(data.answer);
            } else if (this.room.maps==="Map_Riddle") {
                if (this.room.questions[this.room.rounds].checkAnswer(data.answer)) {
                    isCorrect = true;
                    console.log('RIDDLE:True Answer');
                } else {
                    console.log('RIDDLE:False Answer');
                }
            } else {
                //Do nothing
            }
        } else {
            console.log(data);
            console.trace('FATAL ERROR:Malformed location and answer given');
        }

            if (isCorrect) {
                /************************
                 * Start Correct Answer *
                 ************************/
                if ((this.room.player1.socketID === data.socketID)/* && (this.room.playerTurns === this.room.player1)*/) {
                    /***********************
                     * Update Room Details *
                     ***********************/
                    this.room.addPlayer1Point();
                    if (this.room.maps==="Map_TicTacToe") {
                        this.pos = data.location.split('_');
                        this.x = this.pos[0];
                        this.y = this.pos[1];
                        this.room.updatePattern(this.x, this.y, "F");
                    } else if (this.room.maps==="Map_Puzzle") {
                        updatePuzzlePattern(this.room, data.gameLocation, "C", data.answer, questionID);
                    } else if (this.room.maps==="Map_FindMe") {
                        io.in(this.room.player1.socketID).emit('PLAYER.correct');
                    } else if (this.room.maps==="Map_Riddle") {
                        //???
                        io.in(this.room.roomID).emit("PLAYER.correct", {choice: data.answer});
                        this.room.addRounds();
                        setTimeout(function(room2) {
                            io.in(room2.roomID).emit('GAME.updateQuestion', {rounds: room2.rounds});
                            io.in(room2.roomID).emit('GAME.updatePoint', {player1Points: room2.player1Points, player2Points: room2.player2Points});
                        },3000,this.room);
                    } else {
                        //Do nothing
                    }
                } else if ((this.room.player2.socketID === data.socketID)/* && (this.room.playerTurns === this.room.player2)*/) {
                    this.room.addPlayer2Point();
                    if (this.room.maps==="Map_TicTacToe") {
                        this.pos = data.location.split('_');
                        this.x = this.pos[0];
                        this.y = this.pos[1];
                        this.room.updatePattern(this.x, this.y, "S");
                    } else if (this.room.maps==="Map_Puzzle") {
                        updatePuzzlePattern(this.room, data.gameLocation, "C", data.answer, questionID);
                    } else if (this.room.maps==="Map_FindMe") {
                        io.in(this.room.player2.socketID).emit('PLAYER.correct');
                    } else if (this.room.maps==="Map_Riddle") {
                        //???
                        io.in(this.room.roomID).emit("PLAYER.correct", {choice: data.answer});
                        this.room.addRounds();
                        setTimeout(function(room2) {
                            io.in(room2.roomID).emit('GAME.updateQuestion', {rounds: room2.rounds});
                            io.in(room2.roomID).emit('GAME.updatePoint', {player1Points: room2.player1Points, player2Points: room2.player2Points});
                        },3000,this.room);
                    } else {
                        //Do nothing
                    }
                } else {
                    console.trace('FATAL ERROR:Room \'' + this.room.roomID + '\' details out of sync!');
                }

                /**********************
                 * End Correct Answer *
                 **********************/
            } else {
                //TODO:Tell player answer is wrong and proceed to NEXT player
                /**********************
                 * Start Wrong Answer *
                 **********************/
                if ((this.room.player1.socketID === data.socketID)/* && (this.room.playerTurns === this.room.player1) */) {
                    if (this.room.maps==="Map_TicTacToe") {
                        //Do nothing
                    } else if (this.room.maps==="Map_Puzzle") {
                        updatePuzzlePattern(this.room, data.gameLocation, "W", data.answer, questionID);
                    } else if (this.room.maps==="Map_FindMe") {
                        this.room.player1False = true;
                    } else if (this.room.maps==="Map_Riddle") {
                        //this.room.reducePlayer1Point();
                        this.room.player1False = true;
                        client.emit("PLAYER.wrong", {choice: data.answer});
                    } else {
                        //Do nothing
                    }
                } else if ((this.room.player2.socketID === data.socketID)/* && (this.room.playerTurns === this.room.player2) */) {
                    if (this.room.maps==="Map_TicTacToe") {
                        //Do nothing
                    } else if (this.room.maps==="Map_Puzzle") {
                        updatePuzzlePattern(this.room, data.gameLocation, "W", data.answer, questionID);
                    } else if (this.room.maps==="Map_FindMe") {
                        this.room.player2False = true;
                    } else if (this.room.maps==="Map_Riddle") {
                        //this.room.reducePlayer2Point();
                        this.room.player2False = true;
                        client.emit("PLAYER.wrong", {choice: data.answer});
                    } else {
                        //Do nothing
                    }
                } else {
                    console.trace('FATAL ERROR:Room \'' + this.room.roomID + '\' details out of sync!');
                }
                client.emit("PLAYER.wrong", {location: data.location});
                /********************
                 * End Wrong Answer *
                 ********************/
            }

            //Update both client
            if (this.room.maps==="Map_Puzzle") {
                io.in(this.room.roomID).emit("GAME.updatePattern", {pattern: this.room.getPattern()});
                io.in(this.room.roomID).emit('GAME.updatePoint', {
                    player1Points: this.room.player1Points,
                    player2Points: this.room.player2Points
                });
            } else if (this.room.maps==="Map_Riddle") {
                if (this.room.isBothPlayerWrong()) {
                    //DEBUG:
                    // this.room.addRounds();
                    // io.in(this.room.roomID).emit('GAME.updateQuestion', {rounds: this.room.rounds});
                    //PRODUCTION:
                    // this.room.addRounds();
                    // setTimeout(function(room2) {
                    //     io.in(room2.roomID).emit('GAME.updateQuestion', {rounds: room2.rounds});
                    // },3000,this.room);
                }
            } else if (this.room.maps==="Map_TicTacToe") {
                io.in(this.room.roomID).emit("GAME.updatePattern", {pattern: this.room.getPattern()});
            } else if (this.room.maps==="Map_FindMe") {
                //Unblock the room either wrong or correct
                io.in(this.room.roomID).emit("GAME.questionUnblock");
                if (this.room.isBothPlayerWrong()) {
                    io.in(this.room.roomID).emit('GAME.updateQuestion');
                }
            }

            if (this.room.isGameFinish()) {
                checkGameWins(this.room);
            }
    });

    client.on('PLAYER.flipCard',function(data) {
        this.room = WinDow_lib.Array_nestedSearch(SYS_ROOMS,data.socketID,['player1','player2'],'socketID');
        this.loc = data.location.split("_");
        this.x1 = this.loc[0];
        this.y1 = this.loc[1];
        this.room.updatePattern(this.x1, this.y1, "O");
        io.in(this.room.roomID).emit("GAME.updatePattern", {pattern: this.room.getPattern()});
        //Check if is correct pattern for find me map(O_T)
        this.pattern = this.room.getPattern();
        for (var y=0;y<=2;y++) {
            for (var x=0;x<=2;x++) {
                if (this.pattern[y][x]==="O_T") {
                    if (this.room.player2.socketID === data.socketID) {
                        this.room.player2Points+=4;
                    } else if (this.room.player1.socketID === data.socketID) {
                        this.room.player1Points+=4;
                    } else {
                        //ERROR
                    }
                    this.room.addRounds();
                    this.room.randomizePattern();
                    io.in(this.room.roomID).emit("GAME.questionBlock");
                    setTimeout(function(room2) {io.in(room2.roomID).emit("GAME.updatePattern", {pattern: room2.getPattern()});io.in(room2.roomID).emit("GAME.questionUnblock");},2000,this.room);
                    if (this.room.isGameFinish()) {
                        checkGameWins(this.room);
                    }
                } else {
                    //Do nothing as the round havent win
                }
            }
        }
        io.in(this.room.roomID).emit('GAME.updateQuestion');
    });

	client.on('SYS_LATENCY', function (startTime, cb) {
	  cb(startTime);
	});

	client.on("PLAYER.requestAnswer",function(data) {
        this.room = WinDow_lib.Array_nestedSearch(SYS_ROOMS,data.socketID,['player1','player2'],'socketID');
        if (this.room.player1.socketID===data.socketID) {
            //Block other player
            console.log("Event:Block Player2");
            io.in(this.room.player2.socketID).emit("GAME.questionBlock");
            io.in(this.room.player1.socketID).emit("GAME.answer");
            //Unblock everyone
            setTimeout(function(room2) {io.in(room2.roomID).emit("GAME.questionUnblock")},3000,this.room);
        } else if (this.room.player2.socketID===data.socketID) {
            //Block other player
            console.log("Event:Block Player1");
            io.in(this.room.player1.socketID).emit("GAME.questionBlock");
            io.in(this.room.player2.socketID).emit("GAME.answer");
            //Unblock everyone
            setTimeout(function(room2) {io.in(room2.roomID).emit("GAME.questionUnblock")},3000,this.room);
        } else {
            console.log("Event:Block ERROR");
            //Error?
        }
    });

	client.on('GAME.requestResult',function(data) {
        this.room = WinDow_lib.Array_nestedSearch(SYS_ROOMS,data.socketID,['player1','player2'],'socketID');
	    checkGameWins(this.room);
    });

    // Client

    // socket.emit('SYS_LATENCY', Date.now(), function(startTime) {
    //     var latency = Date.now() - startTime;
    //     console.log(latency);
    // });

	function checkGameWins(room) {
            this.result = room.checkWins();
            if (this.result.win && this.result.lose) {
                io.in(this.result.win.socketID).emit('GAME.win');
                io.in(this.result.lose.socketID).emit('GAME.lose');
            } else if (this.result.draw) {
                io.in(room.player1.socketID).emit('GAME.draw');
                io.in(room.player2.socketID).emit('GAME.draw');
            } else {
                console.trace('FATAL ERROR: No valid result given.');
            }
            console.log('Destorying room');
            WinDow_lib.Array_remove(SYS_ROOMS,room.roomID,"roomID");
            room.destroyRoom();
            room = null;
            delete room;
            console.log('Destroyed Room');
    }

	function loadQuestion(room/*,questionAmount*/) {
        //FIND ME-15Q    = 15Q
        //RIDDLE -20Q+4Q = 24Q
        //TTT    -15Q+4Q = 19Q
        //Puzzle -8Q+4Q  = 12Q
            var ListOfQuestions = [];
            //PRODUCTION:*****************************************
            // connection.query('SELECT * FROM [question] WHERE QuestionType = ? ORDER BY RAND() LIMIT ?',[room.maps,questionAmount], function (error, results, fields) {
            //     if (error) throw error;
            //     if (results) {
            //         for (var i=0;i<results.length-1;i++) {
            //              var choices = results.questionChoice1?[results.questionChoice1,results.questionChoice2,results.questionChoice3,results.questionChoice4]:null;
            //              WinDow_lib.Array_shuffle(choices);
            //
            //              var question = new Question({questionID:results.questionID,questionFileName:questionType+'/'+results.questionFilePath,questionAnswer:results.questionAnswer,questionChoices:choices});
            //              ListOfQuestions.push(question);
            //         }
            //     } else {
            //      console.trace('No question fetched!');
            //     }
            // });
            //****************************************************
            //DEBUG:**********************************************
            //Map_Puzzle
            // var question1 = new Question({questionID:1,questionFileName:'puzzle/1.png',questionAnswer:'11',questionChoices:[1,2,3,4]});
            // var question2 = new Question({questionID:2,questionFileName:'puzzle/2.png',questionAnswer:'22',questionChoices:[1,2,3,4]});
            // var question3 = new Question({questionID:3,questionFileName:'puzzle/3.png',questionAnswer:'33',questionChoices:[1,2,3,4]});
            // var question4 = new Question({questionID:4,questionFileName:'puzzle/4.png',questionAnswer:'44',questionChoices:[1,2,3,4]});
            // var question5 = new Question({questionID:5,questionFileName:'puzzle/5.png',questionAnswer:'55',questionChoices:[1,2,3,4]});
            // var question6 = new Question({questionID:6,questionFileName:'puzzle/6.png',questionAnswer:'66',questionChoices:[1,2,3,4]});
            // var question7 = new Question({questionID:7,questionFileName:'puzzle/7.png',questionAnswer:'77',questionChoices:[1,2,3,4]});
            // var question8 = new Question({questionID:8,questionFileName:'puzzle/8.png',questionAnswer:'88',questionChoices:[1,2,3,4]});
            //Map_Riddle
            // var question1 = new Question({questionID:1,questionFileName:'riddle/1.png',questionAnswer:'11',questionChoices:['11','21','31','41']});
            // var question2 = new Question({questionID:2,questionFileName:'riddle/2.png',questionAnswer:'22',questionChoices:['12','22','32','42']});
            // var question3 = new Question({questionID:3,questionFileName:'riddle/3.png',questionAnswer:'33',questionChoices:['13','23','33','43']});
            // var question4 = new Question({questionID:4,questionFileName:'riddle/4.png',questionAnswer:'44',questionChoices:['14','24','34','44']});
            // var question5 = new Question({questionID:5,questionFileName:'riddle/5.png',questionAnswer:'55',questionChoices:['15','25','35','55']});
            // var question6 = new Question({questionID:6,questionFileName:'riddle/6.png',questionAnswer:'66',questionChoices:['16','26','66','46']});
            // var question7 = new Question({questionID:7,questionFileName:'riddle/7.png',questionAnswer:'77',questionChoices:['77','27','37','47']});
            // var question8 = new Question({questionID:8,questionFileName:'riddle/8.png',questionAnswer:'88',questionChoices:['18','88','38','48']});
            //Map_TicTacToe & Map_FindMe
            // var question1 = new Question({questionID:1,questionFileName:'ttc_fm/1.png',questionAnswer:'11',questionChoices:[1,2,3,4]});
            // var question2 = new Question({questionID:2,questionFileName:'ttc_fm/2.png',questionAnswer:'22',questionChoices:[1,2,3,4]});
            // var question3 = new Question({questionID:3,questionFileName:'ttc_fm/3.png',questionAnswer:'33',questionChoices:[1,2,3,4]});
            // var question4 = new Question({questionID:4,questionFileName:'ttc_fm/4.png',questionAnswer:'44',questionChoices:[1,2,3,4]});
            // var question5 = new Question({questionID:5,questionFileName:'ttc_fm/5.png',questionAnswer:'55',questionChoices:[1,2,3,4]});
            // var question6 = new Question({questionID:6,questionFileName:'ttc_fm/6.png',questionAnswer:'66',questionChoices:[1,2,3,4]});
            // var question7 = new Question({questionID:7,questionFileName:'ttc_fm/7.png',questionAnswer:'77',questionChoices:[1,2,3,4]});
            // var question8 = new Question({questionID:8,questionFileName:'ttc_fm/8.png',questionAnswer:'88',questionChoices:[1,2,3,4]});
            // var question9 = new Question({questionID:9,questionFileName:'ttc_fm/9.png',questionAnswer:'99',questionChoices:[1,2,3,4]});
            // var question10 = new Question({questionID:8,questionFileName:'ttc_fm/10.png',questionAnswer:'00',questionChoices:[1,2,3,4]});
            switch (room.maps) {
                case "Map_Puzzle":
                    var question1 = new Question({questionID:1,questionFileName:'puzzle/1.png',questionAnswer:'11',questionChoices:[1,2,3,4]});
                    var question2 = new Question({questionID:2,questionFileName:'puzzle/2.png',questionAnswer:'22',questionChoices:[1,2,3,4]});
                    var question3 = new Question({questionID:3,questionFileName:'puzzle/3.png',questionAnswer:'33',questionChoices:[1,2,3,4]});
                    var question4 = new Question({questionID:4,questionFileName:'puzzle/4.png',questionAnswer:'44',questionChoices:[1,2,3,4]});
                    var question5 = new Question({questionID:5,questionFileName:'puzzle/5.png',questionAnswer:'55',questionChoices:[1,2,3,4]});
                    var question6 = new Question({questionID:6,questionFileName:'puzzle/6.png',questionAnswer:'66',questionChoices:[1,2,3,4]});
                    var question7 = new Question({questionID:7,questionFileName:'puzzle/7.png',questionAnswer:'77',questionChoices:[1,2,3,4]});
                    var question8 = new Question({questionID:8,questionFileName:'puzzle/8.png',questionAnswer:'88',questionChoices:[1,2,3,4]});
                    ListOfQuestions.push(question1,question2,question3,question4,question5,question6,question7,question8,question9,question10);
                    break;
                case "Map_Riddle":
                    var question1 = new Question({questionID:1,questionFileName:'riddle/1.png',questionAnswer:'11',questionChoices:['11','21','31','41']});
                    var question2 = new Question({questionID:2,questionFileName:'riddle/2.png',questionAnswer:'22',questionChoices:['12','22','32','42']});
                    var question3 = new Question({questionID:3,questionFileName:'riddle/3.png',questionAnswer:'33',questionChoices:['13','23','33','43']});
                    var question4 = new Question({questionID:4,questionFileName:'riddle/4.png',questionAnswer:'44',questionChoices:['14','24','34','44']});
                    var question5 = new Question({questionID:5,questionFileName:'riddle/5.png',questionAnswer:'55',questionChoices:['15','25','35','55']});
                    var question6 = new Question({questionID:6,questionFileName:'riddle/6.png',questionAnswer:'66',questionChoices:['16','26','66','46']});
                    var question7 = new Question({questionID:7,questionFileName:'riddle/7.png',questionAnswer:'77',questionChoices:['77','27','37','47']});
                    var question8 = new Question({questionID:8,questionFileName:'riddle/8.png',questionAnswer:'88',questionChoices:['18','88','38','48']});
                    ListOfQuestions.push(question1,question2,question3,question4,question5,question6,question7,question8,question9,question10);
                    break;
                case "Map_TicTacToe":
                    var question1 = new Question({questionID:1,questionFileName:'ttc_fm/1.png',questionAnswer:'11',questionChoices:[1,2,3,4]});
                    var question2 = new Question({questionID:2,questionFileName:'ttc_fm/2.png',questionAnswer:'22',questionChoices:[1,2,3,4]});
                    var question3 = new Question({questionID:3,questionFileName:'ttc_fm/3.png',questionAnswer:'33',questionChoices:[1,2,3,4]});
                    var question4 = new Question({questionID:4,questionFileName:'ttc_fm/4.png',questionAnswer:'44',questionChoices:[1,2,3,4]});
                    var question5 = new Question({questionID:5,questionFileName:'ttc_fm/5.png',questionAnswer:'55',questionChoices:[1,2,3,4]});
                    var question6 = new Question({questionID:6,questionFileName:'ttc_fm/6.png',questionAnswer:'66',questionChoices:[1,2,3,4]});
                    var question7 = new Question({questionID:7,questionFileName:'ttc_fm/7.png',questionAnswer:'77',questionChoices:[1,2,3,4]});
                    var question8 = new Question({questionID:8,questionFileName:'ttc_fm/8.png',questionAnswer:'88',questionChoices:[1,2,3,4]});
                    var question9 = new Question({questionID:9,questionFileName:'ttc_fm/9.png',questionAnswer:'99',questionChoices:[1,2,3,4]});
                    var question10 = new Question({questionID:8,questionFileName:'ttc_fm/10.png',questionAnswer:'00',questionChoices:[1,2,3,4]});
                    ListOfQuestions.push(question1,question2,question3,question4,question5,question6,question7,question8,question9,question10);
                    break;
                case "Map_FindMe":
                    var question1 = new Question({questionID:1,questionFileName:'ttc_fm/1.png',questionAnswer:'11',questionChoices:[1,2,3,4]});
                    var question2 = new Question({questionID:2,questionFileName:'ttc_fm/2.png',questionAnswer:'22',questionChoices:[1,2,3,4]});
                    var question3 = new Question({questionID:3,questionFileName:'ttc_fm/3.png',questionAnswer:'33',questionChoices:[1,2,3,4]});
                    var question4 = new Question({questionID:4,questionFileName:'ttc_fm/4.png',questionAnswer:'44',questionChoices:[1,2,3,4]});
                    var question5 = new Question({questionID:5,questionFileName:'ttc_fm/5.png',questionAnswer:'55',questionChoices:[1,2,3,4]});
                    var question6 = new Question({questionID:6,questionFileName:'ttc_fm/6.png',questionAnswer:'66',questionChoices:[1,2,3,4]});
                    var question7 = new Question({questionID:7,questionFileName:'ttc_fm/7.png',questionAnswer:'77',questionChoices:[1,2,3,4]});
                    var question8 = new Question({questionID:8,questionFileName:'ttc_fm/8.png',questionAnswer:'88',questionChoices:[1,2,3,4]});
                    var question9 = new Question({questionID:9,questionFileName:'ttc_fm/9.png',questionAnswer:'99',questionChoices:[1,2,3,4]});
                    var question10 = new Question({questionID:8,questionFileName:'ttc_fm/10.png',questionAnswer:'00',questionChoices:[1,2,3,4]});
                    ListOfQuestions.push(question1,question2,question3,question4,question5,question6,question7,question8,question9,question10);
                    break;
            }
            //ListOfQuestions.push(question1,question2,question3,question4,question5,question6,question7,question8,question9,question10);
            //****************************************************
            room.questions = ListOfQuestions;
    }


	/*DEBUG:PLEASE REMOVE IT FOR PRODUCTION*/
	function loadPlayerData(data) {
        if (data.id == "1") {
            var playerData = new Player({ID: 1, name: "tim", rank: 1201, coin: 1001, socketID: data.socketID});
        } else if (data.id == "2") {
            var playerData = new Player({ID: 2, name: "john", rank: 1202, coin: 1002, socketID: data.socketID});
        } else {
            var playerData = new Player({ID: 3, name: "Welcc", rank: 1203, coin: 1003, socketID: data.socketID});
        }
        //TODO: Fetch player database
        return playerData;
    }






});
//To Do List
//Game.........
//Update pattern on client side
//Block client input on client side
//Dereference room object
//




//S=server, C=client
//*************EVENTS**************//   S    C
//1.Player join queue                   ✓   ✓
//2.Player leave queue                  ✓   ✓
//3.Player found queue                  ✓   ✓
//4.Player join game                    ✓   ✓
//5.Player leave game
//6.Player disconnect from game
//7.Game start load                     ✓   ✓
//8.Game ready (Means game done load)   ✓   ✓
//9.Game start                          ✓   ✓
//10.Game timer ticks                   ✓   ✓
//11.Game player1 move                  ✓   OTW (Map_Puzzle ✓)
//12.Game player2 move                  ✓   OTW (Map_Puzzle ✓)
//13.Game player3 move                  -   -
//14.Game player4 move                  -   -
//15.Game points recording              ✓   ✓
//16.Game fetch question                ✓   UI
//17.Game fetch hints                   -   -
//18.Game check answer                  ✓   OTW (Map_Puzzle ✓)
//18.Game answer correct                ✓   OTW (Map_Puzzle ✓)
//18.Game answer wrong                  ✓   OTW (Map_Puzzle ✓)
//19.Game check wins                    ✓   ✓
//20.Game stop                          Fix   ✓
//21.Stat add ranking
//22.Stat reduce ranking
//23.Stat add coin
//24.Stat reduce coin
//25.Player request leader board
//26.Player register                    ✓
//27.Player login                       ✓


//************UI DESIGN*************//
//1.How To Play
//2.Game Menu
//3.Game ready ***
//4.Game start
//5.Game your move
//6.Game wrong answer
//7.Game correct answer
//8.Game result
//9.Game end


//************SYSTEM OBJECT***************//
//      Player      \\
//******************//
//1.socketID (string)
//2.ID       (int)
//3.name     (string)
//4.rank     (int)
//5.coin     (int)
//6.history  (array) {date,map,points,rankingEarned,coinsEarned}
//*******************//
//      Room         \\
//*******************//
//1.roomID          (int)
//2.player1         (Player)
//3.player2         (Player)
//4.status          (string)
//5.maps            (string)
//6.rounds          (int)
//7.playerTurns     (Player)
//8.timeLimit       (int)(ms)
//9.startTime       (Date)
//10.player1Points  (int)
//11.player2Points  (int)
//12.questions      ([Question])
//*******************//
//      Question     \\
//*******************//
//1.questionID       (int)
//2.questionFileName (string)
//3.questionAnswer   (string)
//4.questionChoices   (array)

//FIND ME-15Q+4Q = 19Q
//RIDDLE -20Q+4Q = 24Q
//TTT    -15Q+4Q = 19Q
//Puzzle -8Q+4Q  = 12Q

//************SYSTEM VARIABLE*************//
//1.SYS_PLAYER
//1.SYS_QUEUE
//2.SYS_ROOMS
//*******UTILITIES********//
//3.SYS_LANTENCY (int)(ms)
//4.SYS_TOTALPLAYER (int)

//************DATABASE FIELDS****************// * = optional
//      Player     \\
//*****************//
//1.PlayerID (int)
//2.PlayerUsername* (string)
//3.PlayerPassword* (string)
//4.PlayerRanking (int)
//5.PlayerCoin (int)
//**********************//
//      Questions       \\
//**********************//
//1.QuestionID (int)
//2.QuestionFilePath (string)
//3.QuestionAnswer (string)
//4.QuestionHint* (string)
//5.QuestionChoice1 (string)
//6.QuestionChoice2 (string)
//7.QuestionChoice3 (string)
//8.QuestionChoice4 (string)
//9.QuestionType (enum) {ttt,puzzle,riddle,findme}
//**********************//
//         Game         \\
//**********************//
//1.GameID (int)
//2.GameDate (date)
//3.GameMap (enum) {ttt,puzzle,riddle,findme}
//4.GamePoints (int)
//5.GameRankEarned (int)
//6.GameCoinEarned (int)
//7.PlayerID (int) (FK)
