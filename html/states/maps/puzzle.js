var Map_Puzzle = function (game) {};

Map_Puzzle.playerFontStyle = 3;
Map_Puzzle.scoreFontStyle = 3;
Map_Puzzle.boxFontStyle = 3;
Map_Puzzle.buttonFontStyle = {font: '15pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', fill: '#000000',fontWeight:'bold'};
Map_Puzzle.captionFontStyle = {font: '20pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', align: 'center', fill: '#000000',fontWeight:'bold'};
Map_Puzzle.gameStarted = false;
Map_Puzzle.isSinglePlayer = false;
Map_Puzzle.questionArray = [];

Map_Puzzle.backgroundColor = '#FFEEB0';

Map_Puzzle.prototype = {
    //TODO:Fix font anchor for answer box.
    //TODO:Cancel answer when the user dont want to answer the box? (Optional)
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
        this.captionText = game.add.text(x,y,text,Map_Puzzle.captionFontStyle);
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
    showHintMessageBox: function(text) {
        function createCircleButton(x,y,d,color,border,text,callback) {
            color = color?color:0xD8DFE8;
            border = border?border:0x526C8E;

            var buttonGroup = game.add.group();
            var buttonText = game.add.text(0,0,text,Map_Riddle.buttonFontStyle);
            buttonText.setTextBounds(x-d/2,y-d/2,d,d*1.15);
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
        var messageFontStyle = {font: '17pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', align: 'center', fill: '#000000',fontWeight:'bold'};
        var fillColor = 0x38D828;
        var borderColor = 0x526C8E;
        var width  = 340;
        var height = 150;
        var margin = 20;
        var x = 40;

        var messageGroup = game.add.group();
        var bgContainer = game.add.graphics(0, 0);
        bgContainer.beginFill(fillColor, 1);
        bgContainer.bounds = new PIXI.Rectangle(0, 0, width+2, height+2);
        bgContainer.drawRoundedRect(2, 2, width-4, height-4, 4);
        bgContainer.beginFill(borderColor, 1);
        bgContainer.drawRoundedRect(0,0,width,height,4);
        var messageText = game.make.text(margin,30,text,messageFontStyle);
        messageText.setTextBounds(120,30,50,50);
        var exitButton = createCircleButton(width-20,20,30,fillColor,borderColor,"✖",function() {
            messageGroup.destroy();
        });

        messageGroup.addMultiple([bgContainer,messageText,exitButton]);
        messageGroup.name = "hint_box";
        messageGroup.x = 35;
        messageGroup.y = game.world.height-height-40;
    },
    createGameTextBox: function(x, y, boxType,text,minitext,name,xyLocation) {
    //CAUTION: Custom Function for this project!DO NOT USE IN OTHER PLACES//
    var fillColor,borderColor,anchor;
    var width=game.world.width*0.08;
    var height=game.world.width*0.08;
    var fontStyle={font:'13pt opensans',align:'center',fill:'#FFFFFF'};
    var fontStyle2={font:'13pt opensans',align:'center',fill:'#FFFFFF'};

    var sprite=game.add.graphics(x, y);
    var TextRect=game.add.group();
    var genText=game.add.text(0,0,minitext,fontStyle);
    var answerText=game.add.text(0,0,text,fontStyle2);

    TextRect.gameLocation = xyLocation;
    TextRect.name = name;
        switch (boxType) {
            case "B":
                borderColor = 0xFFEEB0;
                fillColor   = 0xFFEEB0;
                anchor      = 0;

                sprite.inputEnabled = false;
                break;
            case "N":
                fontStyle.font = '8pt opensans';
                fillColor      = 0xA9B8CB;
                borderColor    = 0x526C8E;
                anchor         = 0;

                sprite.inputEnabled    = true;
                TextRect.isToggled     = false;
                TextRect.isAnswerWrong = false;
                TextRect.answer        = "";

                TextRect.getAnswer = function() {
                    return TextRect.answer;
                };
                TextRect.appendAnswer = function(text) {
                    //Not longer than 2 character
                    if ((TextRect.answer==="")||(parseInt(TextRect.answer)<=99)) {
                        TextRect.answer += text;
                        answerText.setText(TextRect.answer);
                    }
                };
                TextRect.removeAnswer = function(count) {
                    TextRect.answer = TextRect.answer.slice(0, count);
                    answerText.setText(TextRect.answer);
                };
                TextRect.onToggle = function() {
                    if (!TextRect.isToggled) {
                        //Untoggle other question
                        for (var i=0;i<TextRect.parent.length-1;i++) {
                            if (TextRect.parent.children[i].isToggled) {
                                TextRect.parent.children[i].onToggle();
                            }
                        }
                        Map_Puzzle.prototype.showQuestion(minitext);
                        sprite.tint = 0xA2A2A2;
                        TextRect.isToggled = true;
                    } else {
                        Map_Puzzle.prototype.hideQuestion(minitext);
                        sprite.tint = 0xFFFEFF;
                        TextRect.isToggled = false;
                    }
                };
                sprite.events.onInputUp.add(function() {
                    if (Map_Puzzle.gameStarted) {
                        TextRect.onToggle();
                    }
                });
                break;
            case "C" :
                fontStyle.font = '8pt opensans';
                fillColor      = 0x00B200;
                borderColor    = 0x007C00;
                anchor         = 0;

                sprite.inputEnabled    = true;
                TextRect.isToggled     = false;
                TextRect.isAnswerWrong = false;
                TextRect.answer        = "";

                TextRect.onToggle = function() {
                    if (!TextRect.isToggled) {
                        //Untoggle other question
                        for (var i=0;i<TextRect.parent.length-1;i++) {
                            if (TextRect.parent.children[i].isToggled) {
                                TextRect.parent.children[i].onToggle();
                            }
                        }
                        Map_Puzzle.prototype.showQuestion(minitext);
                        sprite.tint = 0xA2A2A2;
                        TextRect.isToggled = true;
                    } else {
                        Map_Puzzle.prototype.hideQuestion(minitext);
                        sprite.tint = 0xFFFEFF;
                        TextRect.isToggled = false;
                    }
                };
                sprite.events.onInputUp.add(function() {
                    if (Map_Puzzle.gameStarted) {
                        TextRect.onToggle();
                    }
                });
                break;
            case "W" :
                fontStyle.font = '8pt opensans';
                fillColor      = 0xFF3232;
                borderColor    = 0xB22323;
                anchor         = 0;

                sprite.inputEnabled    = true;
                TextRect.isToggled     = false;
                TextRect.isAnswerWrong = true;
                TextRect.answer        = "";

                TextRect.getAnswer = function() {
                    return TextRect.answer;
                };
                TextRect.appendAnswer = function(text) {
                    //Not longer than 2 character
                    if ((TextRect.answer==="")||(parseInt(TextRect.answer)<=99)) {
                        TextRect.answer += text;
                        answerText.setText(TextRect.answer);
                    }
                };
                TextRect.removeAnswer = function(count) {
                    TextRect.answer = TextRect.answer.slice(0, count);
                    answerText.setText(TextRect.answer);
                };
                TextRect.onToggle = function() {
                    if (!TextRect.isToggled) {
                        //Untoggle other question
                        for (var i=0;i<TextRect.parent.length-1;i++) {
                            if (TextRect.parent.children[i].isToggled) {
                                TextRect.parent.children[i].onToggle();
                            }
                        }
                        Map_Puzzle.prototype.showQuestion(minitext);
                        sprite.tint = 0xA2A2A2;
                        TextRect.isToggled = true;
                    } else {
                        Map_Puzzle.prototype.hideQuestion(minitext);
                        sprite.tint = 0xFFFEFF;
                        TextRect.isToggled = false;
                    }
                };
                sprite.events.onInputUp.add(function() {
                    if (Map_Puzzle.gameStarted) {
                        TextRect.onToggle();
                    }
                });
                break;
            case "S":
                borderColor = 3099761;
                fillColor   = 3099761;
                anchor      = 0.2;
                break;
            default:
                break;
        }

        sprite.lineStyle(2, borderColor, 1);
        sprite.beginFill(fillColor, 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, width, height);
        sprite.drawRect(0, 0, width, height);

        genText.x    = x + (width * anchor + 5);
        genText.y    = y + (height * anchor);
        answerText.x = x + (width * 0.2 + 5);
        answerText.y = y + (height * 0.2);

        TextRect.addMultiple([sprite, genText, answerText]);
        return TextRect;
    },
    createPopUp: function (x, y, w, h, color,border,caption,text) {
    //Create button function
        function createCircleButton(x,y,d,color,border,text,callback) {
            color = color?color:0xD9D8DB;
            border = border?border:0xB2BCBE;

            var buttonGroup = game.add.group();
            var buttonText = game.add.text(0,0,text,Map_Puzzle.buttonFontStyle);
            buttonText.setTextBounds(x-d/2,y-d/2,d,d*1.15);
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
    color = color || 0xA9B8CB;//Phaser.Color.getRandomColor(100, 255);
    border = border || 0x526C8E;
    var captionFontStyle = {font: '16pt opensans', boundsAlignH: 'center',boundsAlignV:'top', align: 'center', fill: '#000000',fontWeight:'bold'};
    var fontStyle = {font: '13pt opensans',boundsAlignH: 'center',boundsAlignV:'top', align: 'center', fill: '#000000'};

    var popup = game.add.group();
    var sprite = game.add.graphics(x, y);
    var captionText = game.add.text(x,y,caption,captionFontStyle);
    captionText.setTextBounds(0,0,w,h);
    var contentText = game.add.text(x,y+35,text,fontStyle);
    contentText.setTextBounds(0,5,w,h);


    //sprite.lineStyle(2, 5401742, 1);
    sprite.beginFill(border, 1);
    sprite.drawRoundedRect(0,1,w+3,h+2,3);
    sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
    sprite.beginFill(color, 1);
    sprite.drawRoundedRect(0, 0, w, h, 4);

    //Create button
    var exitButton = createCircleButton(x+(w*0.9),y,30,color,border,"✖",function() {
        popup.destroy();
    });

    popup.addMultiple([sprite,exitButton,captionText,contentText]);
    return popup;
    //OTHER: 0xA9B8CB
    //BLOCKED:0x2F4C71
    //ACTIVATE:0x526C8E
    },
    createRectangle: function (x, y, w, h, color,border) {
        color = color || 0x526C8E;//Phaser.Color.getRandomColor(100, 255);
        border = border || 0xA9B8CB;
        var sprite = game.add.graphics(x, y);
        sprite.beginFill(color, 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRoundedRect(0, 0, w, h, 4);
        sprite.beginFill(border, 1);
        sprite.drawRoundedRect(3,3,w,h,2);

        return sprite;
        //BLOCKED:3099761
        //ACTIVATE:5401742
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
            this.question_submit = this.createRectangle(225,110,100,50,0x2F4C71,0x526C8E);
            this.submitText      = game.add.text(225,115,"Submit",Map_Puzzle.buttonFontStyle);
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
                                var gameLocation = children2.gameLocation;
                                socket.emit('PLAYER.answer',{id:game.global.id,socketID:game.global.socketID,location:location,answer:answer,gameLocation:gameLocation});
                            }
                        })
                    }
                });
            });

            this.question_group.addMultiple([this.question_box,this.question_number, this.question_image, this.question_fill,this.question_submit, this.submitText]);
            this.question_group.x = (game.world.width*0.5-this.question_group.width*0.5);
            this.question_group.y = 400;
            this.question_group.name = "Question_Group";

            if (Map_Puzzle.isSinglePlayer) {
                this.showHintBtn = game.add.sprite(140, 110, 'hint-ico');
                this.showHintBtn.scale.setTo(0.13);
                this.showHintBtn.inputEnabled = true;
                this.showHintBtn.events.onInputUp.add(function () {
                    Map_Puzzle.prototype.showHintMessageBox(Map_Puzzle.questionArray[parseInt(questionNumber)-1].questionHint);
                });
                this.question_group.add(this.showHintBtn);
            }
        }
    },
    hideQuestion:function () {
        game.world.forEach(function (children) {
            if (children.name === "Question_Group") {
                children.destroy();
            }
        });
    },

    buildPattern: function(puzzlePattern) {
        game.world.forEach(function(children) {
            if (children.name==="box_group") {
                children.destroy();
            }
        });
        //Load Pattern
        var box = {width: game.world.width*0.08, height: game.world.width*0.08};

        var box_group = game.add.group();
        box_group.name = "box_group";

        for (var a = 0;a<=puzzlePattern.length-1;a++) { //y
            for (var b=0;b<=puzzlePattern[a].length-1;b++) { //x
                var boxType,box_box,text,minitext;
                if (puzzlePattern[a][b]==="B") {
                    boxType = puzzlePattern[a][b];
                    text = "";
                    minitext="";
                } else {
                    boxType = puzzlePattern[a][b].split('_')[0];
                    text = puzzlePattern[a][b].split('_')[1];
                    minitext = puzzlePattern[a][b].split('_')[2];
                }
                var x      = (box.width+5)*b;
                var x_margin = 5*b;
                var y      = (box.height+5)*a;
                var y_margin = 5*a;

                if (minitext) {
                    box_box = Map_Puzzle.prototype.createGameTextBox(x + box.width + x_margin, y + box.height + y_margin, boxType, text, minitext, "Q".concat(minitext),String(b).concat('_'+a));
                } else {
                    box_box = Map_Puzzle.prototype.createGameTextBox(x + box.width + x_margin, y + box.height + y_margin, boxType, text, minitext, "",String(b).concat('_'+a));
                }
                box_group.add(box_box);
            }
        }

        box_group.x = (game.world.width*0.5-box_group.width*0.5);
        box_group.y = 64;
    },
	
	init: function() {
        //Reset variable everytime it loads
        Map_Puzzle.playerFontStyle = 3;
        Map_Puzzle.scoreFontStyle = 3;
        Map_Puzzle.boxFontStyle = 3;
        Map_Puzzle.buttonFontStyle = {font: '15pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', fill: '#000000',fontWeight:'bold'};
        Map_Puzzle.captionFontStyle = {font: '20pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', align: 'center', fill: '#000000',fontWeight:'bold'};
        Map_Puzzle.gameStarted = false;

        //Create all display element
		this.menu  = game.make.text(40,55,"Menu",game.global.fontStyle);
		this.menu.inputEnabled  = true;
		this.menu.events.onInputUp.add(function() {
			this.game.state.start("GameMenu");
		}, this);
		

		this.help  = game.make.text(game.world.width-40,55,"?",game.global.fontStyle);
		this.help.inputEnabled  = true;
		this.help.events.onInputUp.add(function() {
			this.createPopUp(this.game.width*0.05,this.game.height*0.5-100,this.game.width*0.9,200,0xD8DFE8,0xA9B8CB,"How to play!","1.Fill up all the boxes.\n2.The highest score will win the game.");
		}, this);

		this.player1Name = game.make.text(0,35,"Player1",game.global.fontStyle);
		this.player1Name.name = "Player1Name";
		this.player1Name.setStyle({fontSize:9, align: 'right', boundsAlignH: 'right',boundsAlignV:'middle'});
		this.player1Name.setTextBounds(0,0,game.world.width*0.46,this.player1Name.height);

        this.player1Score = game.make.text(0,50,"0",game.global.scoreFontStyle);
        this.player1Score.name = "Player1Score";
        this.player1Score.setTextBounds(game.world.width*0.46,5,-this.player1Name.width,this.player1Name.height);

        this.player2Name = game.make.text(0,35,"Player2",game.global.fontStyle);
        this.player2Name.name = "Player2Name";
        this.player2Name.setStyle({fontSize:9, align: 'left', boundsAlignH: 'left',boundsAlignV:'middle'});
        this.player2Name.setTextBounds(game.world.width*0.54,0,game.world.width*0.46,this.player2Name.height);

        this.player2Score = game.make.text(0,50,"0",game.global.scoreFontStyle);
        this.player2Score.name = "Player2Score";
        this.player2Score.setTextBounds(game.world.width*0.54,5,this.player2Name.width,this.player2Name.height);

		utils.centerGameObjects([this.menu,this.help]);
    },

    create: function() {
		game.stage.backgroundColor = Map_Puzzle.backgroundColor;
		game.add.existing(this.menu);
		game.add.existing(this.help);
		game.add.existing(this.player1Name);
        game.add.existing(this.player1Score);
        game.add.existing(this.player2Name);
        game.add.existing(this.player2Score);

        /*****************************************
         *   *   *   *   *   *   *   *   *   *   *
         * Start Loading Questions Image and BGM *
         *   *   *   *   *   *   *   *   *   *   *
         *****************************************/
        //load BGM

		socket.on('GAME.start',function(data) {
            Map_Puzzle.prototype.buildPattern(data.room.puzzlePattern);
            this.gameStart = Map_Puzzle.prototype.createCenterNotification("Ready!");
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


		socket.emit('GAME.requestRoomDetails',{id:game.global.id,socketID:game.global.socketID},function(data) {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.inputEnabled = false;
                }
            });
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
                    Map_Puzzle.questionArray[i] = data.questions[i];

                    loader.image('question-'.concat(data.questions[i].questionID),data.questions[i].questionFileName);
                    //(Question) {questionID,questionFileName,questionAnswer,questionChoices}
                }
                loader.onLoadComplete.addOnce(function() {
                    console.log('(Done)Loading Questions');
                });
                loader.start();

                Map_Puzzle.isSinglePlayer = data.room.isSinglePlayer;
                socket.emit('GAME.ready',{id:game.global.id,socketID:game.global.socketID});
            } else {
		        console.log('(ERROR)No room details returned from server.');
            }
        });

		/*******************
		 *  *   *   *   *  *
	     * START DEBUGGING *
		 * 	*	*	*	*  *
		 *******************/

		socket.on('GAME.tick',function(data) {
		    //TIMER IS IGNORED IN THIS MAP
			return data.timerText;
		});

        socket.on('GAME.win',function() {
            this.gameResult = Map_Puzzle.prototype.createCenterNotification("Victory! :)");
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
            this.gameStop = Map_Puzzle.prototype.createCenterNotification("Defeated :(");
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
            this.gameStop = Map_Puzzle.prototype.createCenterNotification("Draw :|");
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
            this.gameResult = Map_Puzzle.prototype.createCenterNotification("Times Up!");
            game.add.existing(this.gameResult);
            this.gameResult.showScreen(this.gameResult,function(parent) {
                this.list = parent.filter(function(child) {
                    return child.name==="captionText"
                }, true);
                this.captionText = this.list.list[0];
                setTimeout(function(ref) {ref.hideScreen(ref);},100,parent);
            });
        });

		socket.on('PLAYER.move',function(data) {
            Map_Puzzle.gameStarted = true;
		});

		socket.on('GAME.updatePattern',function(data) {
            Map_Puzzle.prototype.buildPattern(data.pattern);
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

        /*****************
         *   *   *   *   *
         * END DEBUGGING *
         *   *   *   *   *
         *****************/
        /*******************************
         * Start Handles Keyboard Input *
         *******************************/
        var key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        key1.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function(children2) {
                        if (children2.isToggled) {
                            children2.appendAnswer("1");
                        }
                    })
                }
            });
        },this);

        var key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        key2.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function(children2) {
                        if (children2.isToggled) {
                            children2.appendAnswer("2");
                        }
                    })
                }
            });
        },this);

        var key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        key3.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function(children2) {
                        if (children2.isToggled) {
                            children2.appendAnswer("3");
                        }
                    })
                }
            });
        },this);

        var key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        key4.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function(children2) {
                        if (children2.isToggled) {
                            children2.appendAnswer("4");
                        }
                    })
                }
            });
        },this);

        var key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
        key5.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function(children2) {
                        if (children2.isToggled) {
                            children2.appendAnswer("5");
                        }
                    })
                }
            });
        },this);

        var key6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
        key6.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function(children2) {
                        if (children2.isToggled) {
                            children2.appendAnswer("6");
                        }
                    })
                }
            });
        },this);

        var key7 = game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
        key7.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function(children2) {
                        if (children2.isToggled) {
                            children2.appendAnswer("7");
                        }
                    })
                }
            });
        },this);

        var key8 = game.input.keyboard.addKey(Phaser.Keyboard.EIGHT);
        key8.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function(children2) {
                        if (children2.isToggled) {
                            children2.appendAnswer("8");
                        }
                    })
                }
            });
        },this);

        var key9 = game.input.keyboard.addKey(Phaser.Keyboard.NINE);
        key9.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function(children2) {
                        if (children2.isToggled) {
                            children2.appendAnswer("9");
                        }
                    })
                }
            });
        },this);

        var key0 = game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
        key0.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function(children2) {
                        if (children2.isToggled) {
                            children2.appendAnswer("0");
                        }
                    })
                }
            });
        },this);

        var keyBackspace = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
        keyBackspace.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function(children2) {
                        if (children2.isToggled) {
                            children2.removeAnswer(-1);
                        }
                    })
                }
            });
        },this);

        var keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        keyEnter.onDown.add(function() {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function(children2) {
                        if (children2.isToggled) {
                            //Submit answer (Duplicated)
                            game.world.forEach(function(children) {
                                if (children.name==="box_group") {
                                    children.forEach(function(children2) {
                                        if (children2.isToggled) {
                                            var location = children2.name;
                                            var answer = children2.getAnswer();
                                            var gameLocation = children2.gameLocation;
                                            socket.emit('PLAYER.answer',{id:game.global.id,socketID:game.global.socketID,location:location,answer:answer,gameLocation:gameLocation});
                                        }
                                    })
                                }
                            });
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
