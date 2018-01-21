var Map_TicTacToe = function (game) {};
Map_TicTacToe.defaultFontStyle  = {font: '13pt opensans', align: 'center', fill: '#000000'};
Map_TicTacToe.buttonFontStyle = {font: '15pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', fill: '#000000',fontWeight:'bold'};
Map_TicTacToe.captionFontStyle = {font: '20pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', align: 'center', fill: '#000000',fontWeight:'bold'};
Map_TicTacToe.lastQuestionNumber = 0;
Map_TicTacToe.backgroundColor = '#788DA7';
Map_TicTacToe.gameStarted = false;
Map_TicTacToe.isQuestionAnswered = true;

Map_TicTacToe.prototype = {
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
        this.captionText = game.add.text(x,y,text,Map_TicTacToe.captionFontStyle);
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
            var buttonText = game.add.text(x,y,text,Map_TicTacToe.buttonFontStyle);
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
        color = color || 0xD8DFE8;
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
    createRectangle: function (x, y, w, h, color,border) {
        color = color || 0x526C8E;
        border = border || 0xA9B8CB;

        var sprite = game.add.graphics(x, y);
        sprite.beginFill(border, 1);
        sprite.drawRoundedRect(0,0,w,h,2);
        sprite.beginFill(color, 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRoundedRect(3, 3, w-3, h-3, 4);

        return sprite;
        //BLOCKED:3099761
        //ACTIVATE:5401742
    },

    createTickableBox: function(x, y, w, h, player, xyLocation) {
        var fillColor = 0xD8DFE8;
        var borderColor = 0x526C8E;

        var group = game.add.group();
        var sprite = game.add.graphics(x, y);
        //sprite.lineStyle(2, 5401742, 1);
        sprite.beginFill(fillColor, 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRoundedRect(0, 0, w, h, 4);
        sprite.beginFill(borderColor, 1);
        sprite.drawRoundedRect(0,h,w,2,2);

        //Draw symbol
        var symbol;
        if (player==="F") {
            //First player
            symbol = game.make.sprite(x+w/6,y+h/6, 'ttc_circle');
            symbol.width = w/1.5;
            symbol.height = h/1.5;
        } else if (player==="S") {
            //Second player
            symbol = game.make.sprite(x+w/4,y+h/4, 'ttc_cross');
            symbol.width = w/2;
            symbol.height = h/2;
        } else {
            //Non-populated box
            symbol = game.make.sprite(x,y, 'ttc_circle');
            symbol.width = 0;
            symbol.height = 0;
            //To allow only non-ticked box to be answered
            sprite.inputEnabled    = true;
            sprite.events.onInputUp.add(function() {
                //Check if other question is answered
                if (Map_TicTacToe.isQuestionAnswered) {
                    Map_TicTacToe.prototype.showPopupQuestion(xyLocation);
                    Map_TicTacToe.lastQuestionNumber++;
                    Map_TicTacToe.isQuestionAnswered = false;
                }
            });
        }


        group.addMultiple([sprite,symbol]);
        return group;
    },

    buildPattern: function(tictactoePattern) {
        game.world.forEach(function(children) {
            if (children.name==="box_group") {
                children.destroy();
            }
        });
        //Load Pattern
        var box = {width: game.world.width*0.16, height: game.world.width*0.16};
        var box_group = game.add.group();

        box_group.name = "box_group";

        for (var a = 0;a<=tictactoePattern.length-1;a++) { //y
            for (var b=0;b<=tictactoePattern[a].length-1;b++) { //x
                var box_box;
                var x      = (box.width+5)*b;
                var x_margin = 5*b;
                var y      = (box.height+5)*a;
                var y_margin = 5*a;

                box_box = Map_TicTacToe.prototype.createTickableBox(x + x_margin, y + y_margin,box.width,box.height,tictactoePattern[a][b],String(b).concat("_").concat(a));

                box_group.add(box_box);
            }
        }

        box_group.x = (game.world.width*0.5-box_group.width*0.5);
        box_group.y = (game.world.height*0.5-box_group.height*0.5);
    },

    showQuestion: function (questionNumber) {
        var fontStyle = {font: '15pt opensans', align: 'center',fontWeight:'bold'};

        //Display question
        if (questionNumber) {
            //Create group box with background color
            this.question_group = game.add.group();

            this.question_box    = this.createRectangle(0,0,350,180);
            this.question_number = game.make.text(5, 10, questionNumber.concat('.'), fontStyle);
            this.question_image  = game.make.sprite(20, 0, 'question-'.concat(questionNumber));
            this.question_fill   = game.make.text(40, 120, "____________", fontStyle);
            this.question_submit = this.createRectangle(200,120,100,50,0x2F4C71,0xF2FC8E);
            this.submitText      = game.add.text(200,120,"Submit",Map_Puzzle.buttonFontStyle);
            this.submitText.setTextBounds(0,0,100,50);

            this.question_submit.inputEnabled = true;
            this.question_submit.events.onInputUp.add(function() {
                //Submit answer
                game.world.forEach(function (children) {
                    if (children.name === "box_group") {
                        children.forEach(function (children2) {
                            if (children2.isToggled) {
                                var location = children2.name;
                                var answer = children2.getAnswer();
                                socket.emit('PLAYER.answer',{id:game.global.id,socketID:game.global.socketID,location:location,answer:answer});
                            }
                        })
                    }
                });
            });

            this.question_group.addMultiple([this.question_box,this.question_number, this.question_image, this.question_fill,this.question_submit, this.submitText]);
            this.question_group.x = (game.world.width*0.5-this.question_group.width*0.5);
            this.question_group.y = 400;
            this.question_group.name = "Question_Group";
        }
    },

    showPopupQuestion: function(xyLocation) {
        var questionNumber = Map_TicTacToe.lastQuestionNumber;
        var fillColor = 0xD8DFE8;
        var borderColor = 0x526C8E;
        var width  = game.world.width*0.8;
        var height = game.world.height*0.5;
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
        var answerField = game.make.text(margin,height-60,"",Map_TicTacToe.defaultFontStyle);
        var answerUnderline = game.make.text(margin,answerField.y+5,"__________",Map_TicTacToe.defaultFontStyle);
        var questionSubmit = Map_TicTacToe.prototype.createRectangle(width - margin - 100,answerUnderline.y-20,100,50,0xFFFFFF,0x000000);
        var submitText      = game.add.text(width - margin - 100,answerUnderline.y-20,"Submit",buttonFontStyle);
        submitText.setTextBounds(0,0,100,50);
        //Set question image width
        question.width = width;
        //Set submit button
        questionSubmit.inputEnabled = true;
        questionSubmit.events.onInputUp.add(function() {
            var answer = answerField.getAnswer();
            socket.emit('PLAYER.answer',{id:game.global.id,socketID:game.global.socketID,location:xyLocation,answer:answer,questionNumber:parseInt(questionNumber+1)});
            Map_TicTacToe.isQuestionAnswered = true;
            questionGroup.destroy();
        });
        answerField.name = "answerField";
        answerField.answer = "";
        answerField.location = xyLocation;
        answerField.questionNumber = questionNumber;
        answerField.getAnswer = function() {
            return answerField.answer;
        };
        answerField.appendAnswer = function(text) {
            //Not longer than 2 character
            if ((answerField.answer==="")||(parseInt(answerField.answer)<=99)) {
                answerField.answer += text;
                answerField.setText(answerField.answer);
            }
        };
        answerField.removeAnswer = function(count) {
            answerField.answer = answerField.answer.slice(0, count);
            answerField.setText(answerField.answer);
        };

        questionGroup.addMultiple([bgContainer,question,answerUnderline,answerField,questionSubmit,submitText]);
        questionGroup.name = "question_group";
        questionGroup.x = game.world.width*0.1;
        questionGroup.y = game.world.height*0.25;
        return questionGroup;
    },
    hidePopupQuestion: function() {
        game.world.forEach(function (children) {
            if (children.name === "question_group") {
                children.destroy();
            }
        });
    },

    init: function() {
        //Reset variable everytime it loads
        Map_TicTacToe.defaultFontStyle  = {font: '13pt opensans', align: 'center', fill: '#000000'};
        Map_TicTacToe.buttonFontStyle = {font: '15pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', fill: '#000000',fontWeight:'bold'};
        Map_TicTacToe.captionFontStyle = {font: '20pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', align: 'center', fill: '#000000',fontWeight:'bold'};
        Map_TicTacToe.lastQuestionNumber = 0;
        Map_TicTacToe.backgroundColor = '#788DA7';
        Map_TicTacToe.gameStarted = false;
        Map_TicTacToe.isQuestionAnswered = true;

        //Create all display element
        var fontStyle = {font: '13pt opensans', align: 'center'};
        this.menu  = game.make.text(40,55,"Menu",fontStyle);
        this.menu.inputEnabled  = true;
        this.menu.events.onInputUp.add(function() {
            this.game.state.start("GameMenu");
        }, this);

        this.timer = game.make.text(game.world.centerX+60,55,"Timer: 00:00",Map_TicTacToe.defaultFontStyle);
        this.timer.name = "Timer";

        this.help  = game.make.text(game.world.width-40,55,"?",fontStyle);
        this.help.inputEnabled  = true;
        this.help.events.onInputUp.add(function() {
            this.createPopUp(this.game.width*0.05,this.game.height*0.5-100,this.game.width*0.9,200,0xD8DFE8,0xA9B8CB,"How to play!","1.Fill up all the boxes.\n2.The highest score will win the game.");
        }, this);

        this.player1Name = game.make.text(0,35,"Player1",game.global.fontStyle);
        this.player1Name.name = "Player1Name";
        this.player1Name.setStyle({fontSize:9, align: 'right', boundsAlignH: 'right',boundsAlignV:'middle'});
        this.player1Name.setTextBounds(0,0,game.world.width*0.46,this.player1Name.height);

        this.player2Name = game.make.text(0,35,"Player2",game.global.fontStyle);
        this.player2Name.name = "Player2Name";
        this.player2Name.setStyle({fontSize:9, align: 'left', boundsAlignH: 'left',boundsAlignV:'middle'});
        this.player2Name.setTextBounds(game.world.width*0.54,0,game.world.width*0.46,this.player2Name.height);

        utils.centerGameObjects([this.menu,this.timer,this.help]);
    },

    create: function() {
        game.stage.backgroundColor = Map_TicTacToe.backgroundColor;
        game.add.existing(this.menu);
        game.add.existing(this.timer);
        game.add.existing(this.help);
        game.add.existing(this.player1Name);
        game.add.existing(this.player2Name);

        // //Demo
        // this.tictactoePattern = [[0,"F",0,"F",0],["S",0,"S",0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
        // Map_TicTacToe.prototype.buildPattern(this.tictactoePattern);


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
                        console.log('(Done)Loading player 1 name');
                    } else if (children.name === "Player2Name") {
                        children.setText(data.room.player2.name);
                        children.update();
                        console.log('(Done)Loading player 2 name');
                    }
                });
                //Load Question
                var loader = new Phaser.Loader(game);
                for (var i=0;i<Object.keys(data.questions).length;i++) {
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
            Map_TicTacToe.prototype.buildPattern(data.room.tictactoePattern);
            this.gameStart = Map_TicTacToe.prototype.createCenterNotification("Ready!");
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
            Map_TicTacToe.gameStarted = true;
        });

        socket.on('GAME.updatePattern',function(data) {
            Map_TicTacToe.prototype.buildPattern(data.pattern);
        });

        //TODO:Clear and rewrite the code
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

        socket.on('GAME.win',function() {
            this.gameResult = Map_TicTacToe.prototype.createCenterNotification("Game Ends!");
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
            this.gameStop = Map_TicTacToe.prototype.createCenterNotification("Game Ends!");
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
            this.gameStop = Map_TicTacToe.prototype.createCenterNotification("Game Ends!");
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
            this.gameResult = Map_TicTacToe.prototype.createCenterNotification("Times Up!");
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
                            Map_TicTacToe.isQuestionAnswered = true;
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