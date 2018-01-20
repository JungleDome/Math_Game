var Map_Riddle = function (game) {};

Map_Riddle.playerFontStyle = 3;
Map_Riddle.scoreFontStyle = 3;
Map_Riddle.backgroundColor = '#947AAC';
Map_Riddle.defaultFontStyle = {font: '13pt opensans', align: 'center'};
Map_Riddle.buttonFontStyle = {font: '15pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', fill: '#000000',fontWeight:'bold'};
Map_Riddle.captionFontStyle = {font: '20pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', align: 'center', fill: '#000000',fontWeight:'bold'};
Map_Riddle.blockInput = false;

Map_Riddle.prototype = {
    createCenterNotification: function(text,color,border) {
        color = color || 0x526CFF;
        border = border || 0x3751E5;
        var h = 50;
        var w = game.world.width;
        var x = 0;
        var y = 0;
        var gameCenterY = game.world.centerY;

        this.popup = game.add.group();
        this.sprite = game.add.graphics(x, y);
        this.sprite.name = "sprite";
        this.captionText = game.add.text(x,y,text,Map_Riddle.captionFontStyle);
        this.captionText.name = "captionText";
        this.captionText.setTextBounds(0,0,w,h);
        this.captionText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 10);

        this.sprite.beginFill(border, 1);
        this.sprite.drawRoundedRect(0,1,w+3,h+2,3);
        this.sprite.beginFill(color, 1);
        this.sprite.drawRoundedRect(0, 0, w, h, 4);

        this.popup.addMultiple([this.sprite,this.captionText]);
        this.popup.y = -(this.popup.height);
        this.popup.showScreen = function(object,onCompleteCallback) {
            this.tween = game.add.tween(object).to( { y: gameCenterY }, 2000, Phaser.Easing.Quintic.Out, true,300);
            this.tween.onComplete.add(function() {onCompleteCallback(object)});
        };
        this.popup.hideScreen = function(object) {
            this.tween2 = game.add.tween(object).to( { y: -(object.height) }, 2000, Phaser.Easing.Quintic.Out, true,0);
            this.tween2.onComplete.add(function() {
                object.destroy();
            });
        };
        return this.popup;
    },

    createRectangle: function (x, y, w, h, color) {
        color = color || 0xD8DFE8;
        var sprite = game.add.graphics(x, y);
        sprite.beginFill(color, 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRoundedRect(0, 0, w, h, 4);
        sprite.beginFill(0x526C8E, 1);
        sprite.drawRoundedRect(0,h,w,2,2);

        return sprite;
        //BLOCKED:0x2F4C71
        //ACTIVATE:0x526C8E
    },

    createPopUp: function (x, y, w, h, color,border,caption,text) {
        //Create button function
        function createCircleButton(x,y,d,color,border,text,callback) {
            color = color?color:0xD8DFE8;
            border = border?border:0x526C8E;

            var buttonGroup = game.add.group();
            var buttonText = game.add.text(x,y,text,Map_Riddle.buttonFontStyle);
            buttonText.setTextBounds(0,0,0,0);
            var sprite = game.add.graphics(x, y);
            sprite.beginFill(border, 1);
            sprite.drawCircle(0,0,d+5);
            sprite.bounds = new PIXI.Circle(0,0,d+2);
            sprite.beginFill(color, 1);
            sprite.drawCircle(0,0,d);


            buttonGroup.addMultiple([sprite,buttonText]);
            sprite.inputEnabled = true;
            sprite.events.onInputUp.add(callback,this);

            return buttonGroup
        }
        color = color || 0xD8DFE8;//Phaser.Color.getRandomColor(100, 255);
        border = border || 0x526C8E;
        var captionFontStyle = {font: '16pt opensans', boundsAlignH: 'center',boundsAlignV:'top', align: 'center', fill: '#000000',fontWeight:'bold'};
        var fontStyle = {font: '13pt opensans',boundsAlignH: 'center',boundsAlignV:'top', align: 'center', fill: '#000000'};

        var popup = game.add.group();
        var sprite = game.add.graphics(x, y);
        var captionText = game.add.text(x,y,caption,captionFontStyle);
        captionText.setTextBounds(0,0,w,h);
        var contentText = game.add.text(x,y+35,text,fontStyle);
        contentText.setTextBounds(0,5,w,h);


        sprite.beginFill(border, 1);
        sprite.drawRoundedRect(0,1,w+3,h+2,3);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.beginFill(color, 1);
        sprite.drawRoundedRect(0, 0, w, h, 4);

        //Create button
        var exitButton = createCircleButton(x+(w*0.9),y,30,color,border,"X",function() {
            popup.destroy();
        });

        popup.addMultiple([sprite,exitButton,captionText,contentText]);
        return popup;
        //OTHER: 0xA9B8CB
        //BLOCKED:0x2F4C71
        //ACTIVATE:0x526C8E
    },

    createAnswerBox: function(x,y,text,selectionText,questionNumber) {
        var fillColor      = 0xA9B8CB;
        var borderColor    = 0x526C8E;
        var width          = 160;
        var height         = 40;
        var choiceFontStyle={font:'13pt opensans',align:'center',fill:'#FFFFFF',fontWeight:'bold'};
        var answerFontStyle={font:'13pt opensans',align:'center',fill:'#FFFFFF'};

        var sprite=game.add.graphics(x, y);
        var TextRect=game.add.group();
        var choiceText = game.add.text(0,0,selectionText,choiceFontStyle);
        var answerText=game.add.text(0,0,text,answerFontStyle);

        TextRect.questionNumber = questionNumber;
        TextRect.answer = String(text);
        TextRect.name = String(text);

        sprite.inputEnabled    = true;
        sprite.events.onInputUp.add(function() {
            //Toggle event handler
            if (!Map_Riddle.blockInput) {
                socket.emit('PLAYER.answer', {id: game.global.id, socketID: game.global.socketID, questionNumber: TextRect.questionNumber, answer: String(TextRect.answer)});
            }
        });
        TextRect.toggleWrong = function() {
            Map_Riddle.blockInput = true;
            sprite.tint = 0xFF3232;
        };
        TextRect.toggleCorrect = function() {
            Map_Riddle.blockInput = true;
            sprite.tint = 0x00B200;
        };

        sprite.lineStyle(2, borderColor, 1);
        sprite.beginFill(fillColor, 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, width, height);
        sprite.drawRect(0, 0, width, height);

        choiceText.x    = x + 5;
        choiceText.y    = y + (height * 0.2);
        answerText.x = x + (width * 0.2 + 5);
        answerText.y = y + (height * 0.2);

        TextRect.addMultiple([sprite, choiceText, answerText]);
        return TextRect;
    },

	init: function() {
        this.menu  = game.make.text(40,55,"Menu",Map_Riddle.defaultFontStyle);
        this.menu.inputEnabled  = true;
        this.menu.events.onInputUp.add(function() {
            this.game.state.start("GameMenu");
        }, this);
        this.timer = game.make.text(game.world.centerX+60,55,"Timer: 00:00",Map_Riddle.defaultFontStyle);
        this.timer.name = "Timer";
        // this.score = game.make.text(game.world.centerX-60,55,"Score: 0",Map_Riddle.defaultFontStyle);
        // this.score.name = "Score";
        this.help  = game.make.text(game.world.width-40,55,"?",Map_Riddle.defaultFontStyle);
        this.help.inputEnabled  = true;
        this.help.events.onInputUp.add(function() {
            this.createPopUp(this.game.width*0.05,this.game.height*0.5-100,this.game.width*0.9,200,null,null,"How to play!","1.Answer all the question.\n2.The highest score will win the game.");
        }, this);

        this.player1Name = game.make.text(0,30,"Player1",game.global.fontStyle);
        this.player1Name.name = "Player1Name";
        this.player1Name.setStyle({fontSize:9, align: 'right', boundsAlignH: 'right',boundsAlignV:'middle'});
        this.player1Name.setTextBounds(0,0,game.world.width*0.35,this.player1Name.height);

        this.player1Score = game.make.text(0,45,"0",game.global.scoreFontStyle);
        this.player1Score.name = "Player1Score";
        this.player1Score.setTextBounds(game.world.width*0.35,5,-this.player1Name.width,this.player1Name.height);

        this.player2Name = game.make.text(0,30,"Player2",game.global.fontStyle);
        this.player2Name.name = "Player2Name";
        this.player2Name.setStyle({fontSize:9, align: 'left', boundsAlignH: 'left',boundsAlignV:'middle'});
        this.player2Name.setTextBounds(game.world.width*0.38,0,game.world.width*0.35,this.player2Name.height);

        this.player2Score = game.make.text(0,45,"0",game.global.scoreFontStyle);
        this.player2Score.name = "Player2Score";
        this.player2Score.setTextBounds(game.world.width*0.38,5,this.player2Name.width,this.player2Name.height);

        utils.centerGameObjects([this.menu,this.timer,this.help]);
	},

	
	create: function() {
        var questionArray = [];

        game.stage.backgroundColor = Map_Riddle.backgroundColor;
        game.add.existing(this.menu);
        //game.add.existing(this.score);
        game.add.existing(this.timer);
        game.add.existing(this.help);
        game.add.existing(this.player1Name);
        game.add.existing(this.player1Score);
        game.add.existing(this.player2Name);
        game.add.existing(this.player2Score);

        // this.answer_group = game.add.group();
        // this.answer_1     = this.createRectangle(0,0,160,40);
        // this.answer_2     = this.createRectangle(0,60,160,40);
        // this.answer_3     = this.createRectangle(170,0,160,40);
        // this.answer_4     = this.createRectangle(170,60,160,40);
        // this.answer_group.addMultiple([this.answer_1,this.answer_2,this.answer_3,this.answer_4]);
        //
        // this.answer_group.x = this.question_box.x+5;
        // this.answer_group.y = this.question_box.y+this.question_box.height+30;


        socket.emit('GAME.requestRoomDetails',{id:game.global.id,socketID:game.global.socketID},function(data) {
            console.log(data);
            if (data) {
                //Load Username
                game.world.forEach(function (children) {
                    if (children.name === "Player1Name") {
                        children.setText(data.room.player1.name);
                        children.update();
                        console.log('(Done)Loading player 1 name');
                    } else if (children.name === "Player2Name") {
                        children.setText(data.room.player2.name);
                        children.update();
                        console.log('(Done)Loading player 2 name');
                    } else if (children.name==="Player1Score") {
                        children.setText(data.room.player1Points);
                    } else if (children.name==="Player2Score") {
                        children.setText(data.room.player2Points);
                    }
                });
                //Load Question
                var loader = new Phaser.Loader(game);
                for (var i=0;i<Object.keys(data.questions).length;i++) {
                    questionArray[i] = data.questions[i];
                    loader.image('question-'.concat(data.questions[i].questionID),data.questions[i].questionFileName);

                    //(Question) {questionID,questionFileName,questionAnswer,questionChoices}
                }
                loader.onLoadComplete.addOnce(function() {
                    console.log('(Done)Loading Questions');
                });
                loader.start();
                socket.emit('GAME.ready',{id:game.global.id,socketID:game.global.socketID});
            } else {
                console.log('(ERROR)No room details returned from server.');
            }
        });

        socket.on('GAME.start',function(data) {
            this.gameStart = Map_Riddle.prototype.createCenterNotification("Ready!");
            game.add.existing(this.gameStart);
            this.gameStart.showScreen(this.gameStart,function(parent) {
                this.list = parent.filter(function(child) {
                    return child.name==="captionText"
                }, true);
                this.captionText = this.list.list[0];
                this.captionText.setText('3');
                setTimeout(function(ref) {ref.setText('2')},1000,this.captionText);
                setTimeout(function(ref) {ref.setText('1')},2000,this.captionText);
                setTimeout(function(ref) {ref.setText('Start!')},3000,this.captionText);
                setTimeout(function(ref) {ref.hideScreen(ref)},4000,parent);
            });
        });

        socket.on('PLAYER.correct',function(data) {
            game.world.forEach(function(children) {
                if (children.name==="Answer_Group") {
                    children.forEach(function(children2) {
                        if (children2.name===data.choice) {
                            children2.toggleCorrect();
                        }
                    });
                }
            });
        });

        socket.on('PLAYER.wrong',function(data) {
            game.world.forEach(function(children) {
                if (children.name==="Answer_Group") {
                    children.forEach(function(children2) {
                        if (children2.name===data.choice) {
                            children2.toggleWrong();
                        }
                    });
                }
            });
        });

        socket.on('GAME.updatePoint',function(data) {
            //data:{player1Points,player2Points}
            game.world.forEach(function(children) {
                if (children.name==="Player1Score") {
                    children.setText(data.player1Points);
                } else if (children.name==="Player2Score") {
                    children.setText(data.player2Points);
                }
            });
        });

        socket.on('GAME.updateQuestion',function(data) {
            Map_Riddle.blockInput = false;
            Map_Riddle.prototype.hideQuestion();
            Map_Riddle.prototype.showQuestion(questionArray[data.rounds].questionID,questionArray[data.rounds].questionChoices);
        });

        socket.on('GAME.tick',function(data) {
            //Display time left
            game.world.forEach(function(children) {
                if (children.name==="Timer") {
                    children.setText("Timer: " + data.timerText);
                }
            });
        });

        socket.on('GAME.win',function() {
            this.gameResult = Map_Puzzle.prototype.createCenterNotification("Game Ends!");
            game.add.existing(this.gameResult);
            this.gameResult.showScreen(this.gameResult,function(parent) {
                this.list = parent.filter(function(child) {
                    return child.name==="captionText"
                }, true);
                this.captionText = this.list.list[0];
                setTimeout(function(ref) {ref.setText('Victory! :)')},500,this.captionText);
                setTimeout(function(ref) {ref.hideScreen(ref);},2500,parent);
                setTimeout(this.game.state.start('GameMenu'),3000);
            });
        });

        socket.on('GAME.lose',function() {
            this.gameStop = Map_Puzzle.prototype.createCenterNotification("Game Ends!");
            game.add.existing(this.gameStop);
            this.gameStop.showScreen(this.gameStop,function(parent) {
                this.list = parent.filter(function(child) {
                    return child.name==="captionText"
                }, true);
                this.captionText = this.list.list[0];
                setTimeout(function(ref) {ref.setText('Defeated :(')},500,this.captionText);
                setTimeout(function(ref) {ref.hideScreen(ref)},2500,parent);
                setTimeout(this.game.state.start('GameMenu'),3000);
            });
        });

        socket.on('GAME.draw',function() {
            this.gameStop = Map_Puzzle.prototype.createCenterNotification("Game Ends!");
            game.add.existing(this.gameStop);
            this.gameStop.showScreen(this.gameStop,function(parent) {
                this.list = parent.filter(function(child) {
                    return child.name==="captionText"
                }, true);
                this.captionText = this.list.list[0];
                setTimeout(function(ref) {ref.setText('Draw :|')},500,this.captionText);
                setTimeout(function(ref) {ref.hideScreen(ref)},2500,parent);
                setTimeout(this.game.state.start('GameMenu'),3000);
            });
        });
	},

	showQuestion: function(questionNumber,questionChoices) {
        var fontStyle = {font: '15pt opensans', align: 'center',fontWeight:'bold'};
        this.question_group = game.add.group();

        this.question_box    = this.createRectangle(0,0,340,350);
        this.question_number = game.make.text(5, 10, String(questionNumber).concat('.'), fontStyle);
        this.question_image  = game.make.sprite(25, 10, 'question-'.concat(questionNumber));
        this.question_image.width = 300;
        //this.question_image.height = 340;

        this.question_group.addMultiple([this.question_box,this.question_number, this.question_image]);
        this.question_group.x = 30;
        this.question_group.y = 100;
        this.question_group.name = "Question_Group";

        this.answer_group = game.add.group();
        this.answer_group.name = "Answer_Group";

        this.answerBox1 = Map_Riddle.prototype.createAnswerBox(0,0,questionChoices[0],"A",questionNumber);
        this.answerBox2 = Map_Riddle.prototype.createAnswerBox(0,60,questionChoices[1],"B",questionNumber);
        this.answerBox3 = Map_Riddle.prototype.createAnswerBox(170,0,questionChoices[2],"C",questionNumber);
        this.answerBox4 = Map_Riddle.prototype.createAnswerBox(170,60,questionChoices[3],"D",questionNumber);

        this.answer_group.addMultiple([this.answerBox1,this.answerBox2,this.answerBox3,this.answerBox4]);
        this.answer_group.x = this.question_group.x+5;
        this.answer_group.y = this.question_group.y+this.question_box.height+30;

        // this.answer1_box   = this.createRectangle(0,0,160,40);
        // this.answer1_text = game.make.text(5, 5, , Map_Riddle.defaultFontStyle);
        // this.answer2_box     = this.createRectangle(0,60,160,40);
        // this.answer2_image = game.make.sprite(0, 60, 'question'.concat(questionNumber).concat('_choice2'));
        // this.answer3_box     = this.createRectangle(170,0,160,40);
        // this.answer3_image = game.make.sprite(170, 0, 'question'.concat(questionNumber).concat('_choice3'));
        // this.answer4_box     = this.createRectangle(170,60,160,40);
        // this.answer4_image = game.make.sprite(170, 60, 'question'.concat(questionNumber).concat('_choice4'));
        //this.answer_group.addMultiple([this.answer1_box,this.answer1_image,this.answer2_box,this.answer2_image,this.answer3_box,this.answer3_image,this.answer4_box,this.answer4_image]);
    },

    hideQuestion:function () {
        game.world.forEach(function (children) {
            if (children.name === "Question_Group") {
                children.destroy();
            } else if (children.name === "Answer_Group") {
                children.destroy();
            }
        });
    }
};