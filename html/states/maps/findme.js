var Map_FindMe = function (game) {};
Map_FindMe.box = {width:game.world.width*0.15, height:game.world.width*0.15};
Map_FindMe.captionFontStyle = {font: '20pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', align: 'center', fill: '#000000',fontWeight:'bold'};
Map_FindMe.buttonFontStyle = {font: '15pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', fill: '#000000',fontWeight:'bold'};
Map_FindMe.defaultFontStyle = {font: '13pt opensans', align: 'center'};
Map_FindMe.backgroundColor = '#788DA7';
Map_FindMe.allowFlip = false;
Map_FindMe.lastQuestionNumber = 0;

Map_FindMe.prototype = {
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
        this.captionText = game.add.text(x,y,text,Map_FindMe.captionFontStyle);
        this.captionText.name = "captionText";
        this.captionText.setTextBounds(0,0,w,h);
        this.captionText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 10);

        //sprite.lineStyle(2, 5401742, 1);
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
    createPopUp: function (x, y, w, h, color,border,caption,text) {
        //Create button function
        function createCircleButton(x,y,d,color,border,text,callback) {
            color = color?color:0xD8DFE8;
            border = border?border:0x526C8E;

            var buttonGroup = game.add.group();
            var buttonText = game.add.text(x,y,text,Map_FindMe.buttonFontStyle);
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
    createRectangle: function (x, y, w, h, color) {
        color = color || 14213096;
        var sprite = game.add.graphics(x, y);
        sprite.beginFill(color, 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRoundedRect(0, 0, w, h, 4);
        sprite.beginFill(5401742, 1);
        sprite.drawRoundedRect(0,h,w,2,2);

        return sprite;
        //BLOCKED:3099761
        //ACTIVATE:5401742
    },

    createFlipableBox: function(x, y, boxState,xyLocation,isCorrectCard) {
        //CAUTION: Custom Function for this project!DO NOT USE IN OTHER PLACES//
        var fillColor = 0xD8DFE8;
        var borderColor = 0x526C8E;

        var width  = Map_FindMe.box.width;
        var height = Map_FindMe.box.height;

        var box_group = game.add.group();
        var sprite    = game.add.graphics(x, y);

        box_group.gameLocation = xyLocation;
        box_group.isOpen = false;


        if (boxState === "O") {
            box_group.isOpen = true;
            if (isCorrectCard==="T") {
                var symbol = game.make.sprite(x + width / 6, y + height / 6, 'ttc_circle');
                symbol.width = width / 1.5;
                symbol.height = height / 1.5;
                box_group.add(symbol);
            } else if ((isCorrectCard==="F")) {
                var symbol = game.make.sprite(x + width / 6, y + height / 6, 'ttc_cross');
                symbol.width = width / 1.5;
                symbol.height = height / 1.5;
                box_group.add(symbol);
            }
        } else if (boxState === "C") {
            box_group.isOpen = false;
        } else {
            box_group.isOpen = false;
        }


        sprite.beginFill(fillColor, 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, width, height);
        sprite.drawRoundedRect(0, 0, width, height, 4);
        sprite.beginFill(borderColor, 1);
        sprite.drawRoundedRect(0,height,width,2,2);

        sprite.inputEnabled    = true;
        sprite.events.onInputUp.add(function() {
            //Flip the card
            console.log(box_group.isOpen);
            console.log(Map_FindMe.allowFlip);
            if (Map_FindMe.allowFlip&&!box_group.isOpen) {
                console.log("FlipCard");
                socket.emit('PLAYER.flipCard',{id:game.global.id,socketID:game.global.socketID,location:xyLocation});
            }
        });

        box_group.addAt(sprite,0);
        return box_group;
    },
    showFlipMessageBox: function() {
        var messageFontStyle = {font: '17pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', align: 'center', fill: '#000000',fontWeight:'bold'};
        var fillColor = 0x38D828;
        var borderColor = 0x526C8E;
        var width  = 340;
        var height = 150;
        var margin = 20;

        var messageGroup = game.add.group();
        var bgContainer = game.add.graphics(0, 0);
        bgContainer.beginFill(fillColor, 1);
        bgContainer.bounds = new PIXI.Rectangle(0, 0, width+2, height+2);
        bgContainer.drawRoundedRect(2, 2, width-4, height-4, 4);
        bgContainer.beginFill(borderColor, 1);
        bgContainer.drawRoundedRect(0,0,width,height,4);
        var messageText = game.make.text(margin,30,"Please select a box to open.",messageFontStyle);
        messageText.setTextBounds(120,30,50,50);

        messageGroup.name = "message_box";
        messageGroup.x = 30;
        messageGroup.y = game.world.height-25-140;
        messageGroup.addMultiple([bgContainer,messageText]);
    },
    hideFlipMessageBox: function() {
        game.world.forEach(function (children) {
            if (children.name === "message_box") {
                children.destroy();
            }
        });
    },

    showPopupQuestion: function(questionNumber) {
        var fillColor = 0xD8DFE8;
        var borderColor = 0x526C8E;
        var width  = 340;
        var height = 150;
        var margin = 20;
        var buttonFontStyle = {font: '15pt opensans', boundsAlignH: 'center',boundsAlignV:'bottom', fill: '#000000',fontWeight:'bold'};

        var questionGroup = game.add.group();
        var bgContainer = game.add.graphics(0, 0);
        bgContainer.beginFill(fillColor, 1);
        bgContainer.bounds = new PIXI.Rectangle(0, 0, width+2, height+2);
        bgContainer.drawRoundedRect(2, 2, width-4, height-4, 4);
        bgContainer.beginFill(borderColor, 1);
        bgContainer.drawRoundedRect(0,0,width,height,4);

        var question = game.make.sprite(0,0, "question-".concat(String(parseInt(questionNumber+1))));
        var answerField = game.make.text(margin,height-60,"",Map_FindMe.defaultFontStyle);
        var answerUnderline = game.make.text(margin,answerField.y+5,"_______________",Map_FindMe.defaultFontStyle);
        var questionAnswer = Map_TicTacToe.prototype.createRectangle(width - margin - 100,answerUnderline.y-50,100,35,0xFFFFFF,0x000000);
        var answerText      = game.add.text(width - margin - 100,answerUnderline.y-65,"Answer",buttonFontStyle);
        var questionSubmit = Map_TicTacToe.prototype.createRectangle(width - margin - 100,answerUnderline.y,100,35,0xFFFFFF,0x000000);
        var submitText      = game.add.text(width - margin - 100,answerUnderline.y-10,"Submit",buttonFontStyle);

        submitText.setTextBounds(0,0,100,50);
        answerText.setTextBounds(0,0,100,50);
        //Set question image width
        question.width = width;
        //Set answer button
        questionAnswer.inputEnabled = true;
        questionAnswer.events.onInputUp.add(function() {
            console.log("RequestAnswer");
            socket.emit('PLAYER.requestAnswer',{id:game.global.id,socketID:game.global.socketID,questionID:parseInt(questionNumber+1)});
        });
        //Set submit button
        questionSubmit.inputEnabled = true;
        questionSubmit.events.onInputUp.add(function() {
            var answer = answerField.getAnswer();
            socket.emit('PLAYER.answer',{id:game.global.id,socketID:game.global.socketID,answer:answer,questionID:parseInt(questionNumber+1)});
        });
        answerField.name = "answerField";
        answerField.answer = "";
        answerField.questionNumber = questionNumber;
        answerField.getAnswer = function() {
            return answerField.answer;
        };
        answerField.appendAnswer = function(text) {
            //Not longer than 4 character
            if ((answerField.answer==="")||(parseInt(answerField.answer)<=9999)) {
                answerField.answer += text;
                answerField.setText(answerField.answer);
            }
        };
        answerField.removeAnswer = function(count) {
            answerField.answer = answerField.answer.slice(0, count);
            answerField.setText(answerField.answer);
        };

        questionGroup.toggleBlock = function () {
            //TODO:Show gui for blocking
            var blockingBox  = game.add.graphics(0, 0);
            blockingBox.beginFill(fillColor, 1);
            blockingBox.bounds = new PIXI.Rectangle(0, 0, width+2, height+2);
            blockingBox.drawRoundedRect(2, 2, width-4, height-4, 4);
            blockingBox.name = "Blocking_Box";
            questionGroup.add(blockingBox);
            console.log("ToggleBlock:Blocking");
        };

        questionGroup.toggleUnblock = function() {
            //TODO:Hide blocking gui
            console.log("ToggleUnblock:Unblocking");
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="Blocking_Box") {
                            children2.destroy();
                        }
                    });
                }
            });
        };

        questionGroup.toggleWrong = function() {
            bgContainer.tint = 0xFF1919;
        };

        questionGroup.addMultiple([bgContainer,question,answerUnderline,answerField,questionAnswer,answerText,questionSubmit,submitText]);
        questionGroup.name = "question_group";
        questionGroup.x = 30;
        questionGroup.y = game.world.height-25-140;
        return questionGroup;
    },
    hidePopupQuestion: function() {
        game.world.forEach(function (children) {
            if (children.name === "question_group") {
                children.destroy();
            }
        });
    },

    buildPattern: function(pattern) {
        game.world.forEach(function(children) {
            if (children.name==="box_group") {
                children.destroy();
            }
        });

        var counter = 1;
        var box_group = game.add.group();
        box_group.name = "box_group";

        for (var i=0;i<pattern.length;i++) {
            for (var j=0;j<pattern[i].length;j++) {
                var array = pattern[i][j].split('_');

                var state = array[0];
                var value = array[1];

                var posX      = (Map_FindMe.box.width+5)*j;
                var posX_margin = 5*j;
                var posY      = (Map_FindMe.box.height+5)*i;
                var posY_margin = 5*i;

                var box = Map_FindMe.prototype.createFlipableBox(posX + posX_margin, posY + posY_margin,state,String(i).concat('_').concat(String(j)),value);
                box_group.add(box);
                counter++;
            }
        }

        // box_group.x = (game.world.width*0.5-box_group.width*0.5);
        // box_group.y = (game.world.height*0.5-box_group.height*0.5);
        box_group.x = (game.world.width*0.5-box_group.width*0.5);
        box_group.y = 80;
    },

	init: function() {
        //Reset variable everytime it loads
        Map_FindMe.box = {width:game.world.width*0.15, height:game.world.width*0.15};
        Map_FindMe.captionFontStyle = {font: '20pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', align: 'center', fill: '#000000',fontWeight:'bold'};
        Map_FindMe.buttonFontStyle = {font: '15pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', fill: '#000000',fontWeight:'bold'};
        Map_FindMe.defaultFontStyle = {font: '13pt opensans', align: 'center'};
        Map_FindMe.backgroundColor = '#788DA7';
        Map_FindMe.allowFlip = false;
        Map_FindMe.lastQuestionNumber = 0;

        //Create all display element
        this.menu  = game.make.text(40,55,"Menu",Map_FindMe.defaultFontStyle);
        this.menu.inputEnabled  = true;
        this.menu.events.onInputUp.add(function() {
            this.game.state.start("GameMenu");
        }, this);

        this.timer = game.make.text(game.world.centerX+60,55,"Timer: 00:00",Map_FindMe.defaultFontStyle);
        this.timer.name = "Timer";

        this.help  = game.make.text(game.world.width-40,55,"?",Map_FindMe.defaultFontStyle);
        this.help.inputEnabled  = true;
        this.help.events.onInputUp.add(function() {
            this.createPopUp(this.game.width*0.05,this.game.height*0.5-100,this.game.width*0.9,200,0xD8DFE8,0xA9B8CB,"How to play!","1.Fill up all the boxes.\n2.The highest score will win the game.");
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

        game.stage.backgroundColor = Map_FindMe.backgroundColor;
        game.add.existing(this.menu);
        game.add.existing(this.timer);
        game.add.existing(this.help);
        game.add.existing(this.player1Name);
        game.add.existing(this.player2Name);

        //
        // this.box_group = game.add.group();
        // this.box_group.addMultiple([this.box_1_1,this.box_1_2,this.box_1_3,this.box_1_4,this.box_1_5,this.box_2_1,this.box_2_2,this.box_2_3,this.box_2_4,this.box_2_5,
        //     this.box_3_1,this.box_3_2,this.box_3_3,this.box_3_4,this.box_3_5,this.box_4_1,this.box_4_2,this.box_4_3,this.box_4_4,this.box_4_5,this.box_5_1,this.box_5_2,this.box_5_3,this.box_5_4,this.box_5_5]);
        // this.box_group.x = (game.world.width*0.5-this.box_group.width*0.5);
        // this.box_group.y = 100;

        /****************************
         * Game Client Socket Event *
         ****************************/
        /*****************************************
         *   *   *   *   *   *   *   *   *   *   *
         * Start Loading Questions Image and BGM *
         *   *   *   *   *   *   *   *   *   *   *
         *****************************************/
        //load BGM
        socket.emit('GAME.requestRoomDetails',{id:game.global.id,socketID:game.global.socketID},function(data) {
            console.log('+GAME.requestRoomDetails+');
            console.log(data);
            console.log('-GAME.requestRoomDetails-');
            if (data) {
                //Load Username
                game.world.forEach(function (children) {
                    if (children.name === "Player1Name") {
                        children.setText(data.room.player1.name);
                        children.update();
                        console.log('(✓) Loading player 1 name');
                    } else if (children.name === "Player2Name") {
                        children.setText(data.room.player2.name);
                        children.update();
                        console.log('(✓) Loading player 2 name');
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
                    console.log('(✓) Loading Questions');
                });
                loader.start();
                socket.emit('GAME.ready',{id:game.global.id,socketID:game.global.socketID});
            } else {
                console.log('(✘)No room details returned from server.');
            }
        });

        socket.on('GAME.start',function(data) {
            Map_FindMe.prototype.buildPattern(data.room.findmePattern);
            this.gameStart = Map_FindMe.prototype.createCenterNotification("Ready!");
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

        socket.on('GAME.tick',function(data) {
            game.world.forEach(function(children) {
                if (children.name==="Timer") {
                    children.setText("Timer: " + data.timerText);
                }
            });
        });

        socket.on('PLAYER.move',function(data) {
            //TODO:Player chooses which box he wants to tick then show question and choices for it.
            //TODO:Block the player from pressing things/submitting button
            Map_FindMe.gameStarted = true;
        });

        socket.on('GAME.updateQuestion',function(data) {
            console.log("Event:UpdateQuestion");
            Map_FindMe.allowFlip = false;
            Map_FindMe.prototype.hideFlipMessageBox();
            Map_FindMe.prototype.hidePopupQuestion();
            Map_FindMe.prototype.showPopupQuestion(Map_FindMe.lastQuestionNumber);
            Map_FindMe.lastQuestionNumber++;
        });

        socket.on('GAME.questionBlock',function() {
            console.log("Event:QuestionBlock");
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.toggleBlock();
                }
            });
        });

        socket.on('GAME.questionUnblock',function() {
            console.log("Event:QuestionUnblock");
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="Blocking_Box") {
                            children2.destroy();
                        }
                    });
                }
            });
        });

        socket.on('GAME.updatePattern',function(data) {
            console.log("Event:UpdatePattern");
            Map_FindMe.prototype.buildPattern(data.pattern);
            Map_FindMe.prototype.hideFlipMessageBox();
        });

        socket.on('PLAYER.correct',function() {
            console.log("Event:Correct");
            Map_FindMe.allowFlip = true;
            Map_FindMe.prototype.showFlipMessageBox();
        });

        socket.on('PLAYER.wrong',function(data) {
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.toggleWrong();
                }
            });
            Map_FindMe.allowFlip = false;
        });

        socket.on('GAME.win',function() {
            this.gameResult = Map_FindMe.prototype.createCenterNotification("Victory! :)");
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
            this.gameStop = Map_FindMe.prototype.createCenterNotification("Defeated :(");
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
            this.gameStop = Map_FindMe.prototype.createCenterNotification("Game Ends!");
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

        socket.on('GAME.stop',function(data) {
            this.gameResult = Map_FindMe.prototype.createCenterNotification("Times Up!");
            game.add.existing(this.gameResult);
            this.gameResult.showScreen(this.gameResult,function(parent) {
                this.list = parent.filter(function(child) {
                    return child.name==="captionText"
                }, true);
                this.captionText = this.list.list[0];
                setTimeout(function(ref) {ref.hideScreen(ref);},100,parent);
            });
        });

        /********************************
         * Start Handles Keyboard Input *
         ********************************/
        var key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        key1.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="answerField") {
                            children2.appendAnswer("1");
                        }
                    })
                }
            });
        },this);

        var key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        key2.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="answerField") {
                            children2.appendAnswer("2");
                        }
                    })
                }
            });
        },this);

        var key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        key3.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="answerField") {
                            children2.appendAnswer("3");
                        }
                    })
                }
            });
        },this);

        var key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        key4.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="answerField") {
                            children2.appendAnswer("4");
                        }
                    })
                }
            });
        },this);

        var key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
        key5.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="answerField") {
                            children2.appendAnswer("5");
                        }
                    })
                }
            });
        },this);

        var key6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
        key6.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="answerField") {
                            children2.appendAnswer("6");
                        }
                    })
                }
            });
        },this);

        var key7 = game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
        key7.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="answerField") {
                            children2.appendAnswer("7");
                        }
                    })
                }
            });
        },this);

        var key8 = game.input.keyboard.addKey(Phaser.Keyboard.EIGHT);
        key8.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="answerField") {
                            children2.appendAnswer("8");
                        }
                    })
                }
            });
        },this);

        var key9 = game.input.keyboard.addKey(Phaser.Keyboard.NINE);
        key9.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="answerField") {
                            children2.appendAnswer("9");
                        }
                    })
                }
            });
        },this);

        var key0 = game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
        key0.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="answerField") {
                            children2.appendAnswer("0");
                        }
                    })
                }
            });
        },this);

        var keyBackspace = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
        keyBackspace.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="answerField") {
                            children2.removeAnswer(-1);
                        }
                    })
                }
            });
        },this);

        var keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        keyEnter.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="question_group") {
                    children.forEach(function(children2) {
                        if (children2.name==="answerField") {
                            var questionNumber = children2.questionNumber;
                            var answer = children2.getAnswer();
                            var xyLocation = children2.location;
                            socket.emit('PLAYER.answer',{id:game.global.id,socketID:game.global.socketID,location:xyLocation,answer:answer,questionNumber:parseInt(questionNumber+1)});
                            children.destroy();
                        }
                    })
                }
            });
        },this);

        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ONE);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.TWO);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.THREE);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.FOUR);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.FIVE);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SIX);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SEVEN);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.EIGHT);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.NINE);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ZERO);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.BACKSPACE);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ENTER);

        /*****************************
         * End Handles Keyboard Input *
         *****************************/
	}
};