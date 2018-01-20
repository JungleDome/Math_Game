var Map_Puzzle = function (game) {};

Map_Puzzle.playerFontStyle = 3;
Map_Puzzle.scoreFontStyle = 3;
Map_Puzzle.boxFontStyle = 3;
Map_Puzzle.buttonFontStyle = {font: '15pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', fill: '#000000',fontWeight:'bold'};
Map_Puzzle.captionFontStyle = {font: '20pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', align: 'center', fill: '#000000',fontWeight:'bold'};

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

    createGameTextBox: function(x, y, boxType,text,minitext,name,location) {
    //CAUTION: Custom Function for this project!DO NOT USE IN OTHER PLACES//
    var fillColor,borderColor,anchor;var width=game.world.width*0.08;var height=game.world.width*0.08;var fontStyle={font:'13pt opensans',align:'center',fill:'#FFFFFF'};var fontStyle2={font:'13pt opensans',align:'center',fill:'#FFFFFF'};
    var sprite=game.add.graphics(x, y);var TextRect=game.add.group();var genText=game.add.text(0,0,minitext,fontStyle);var answerText=game.add.text(0,0,text,fontStyle2);
    TextRect.gameLocation = location;
    TextRect.name = name;
    console.log("Name:"+name);
    switch (boxType) {
        case "B":borderColor=0xFFEEB0;fillColor=0xFFEEB0;anchor=0;sprite.inputEnabled=false;break;
        case "N":
            fontStyle.font='8pt opensans';fillColor=11122891;borderColor=5401742;anchor=0;sprite.inputEnabled=true;
            TextRect.isToggled=false;TextRect.isAnswerWrong=false;TextRect.answer="";
            TextRect.onToggle=function() {
                if (!TextRect.isToggled) {
                    for (var i=0;i<TextRect.parent.length-1;i++) {if (TextRect.parent.children[i].isToggled) {TextRect.parent.children[i].onToggle();}}
                    Map_Puzzle.prototype.showQuestion(text);sprite.tint=11122891;TextRect.isToggled=true;
                } else {Map_Puzzle.prototype.hideQuestion(text);sprite.tint=0xFFFEFF;TextRect.isToggled=false;}
            };
            TextRect.appendAnswer=function(text) {TextRect.answer+=text;answerText.setText(TextRect.answer);console.log(TextRect.answer);};
            TextRect.getAnswer=function(){return TextRect.answer;};
            TextRect.removeAnswer=function(count){TextRect.answer=TextRect.answer.slice(0,count);answerText.setText(TextRect.answer);console.log(TextRect.answer);};
            TextRect.onAnswerWrong=function(game) {
                if (TextRect.isAnswerWrong) {sprite.tint = 16724530}
                else {
                    if (!TextRect.isToggled) {
                        for (var i = 0; i < TextRect.parent.length - 1; i++) {if (TextRect.parent.children[i].isToggled) {TextRect.parent.children[i].onToggle();}}
                        Map_Puzzle.prototype.showQuestion(text);sprite.tint=11122891;TextRect.isToggled=true;
                    } else {Map_Puzzle.prototype.hideQuestion(text);sprite.tint=0xFFFEFF;TextRect.isToggled=false;}
                }
            };
            sprite.events.onInputUp.add(function() {TextRect.onToggle()});break;
        case "S":borderColor=3099761;fillColor=3099761;anchor=0.2;break;
        default:break;}

    sprite.lineStyle(2,borderColor,1);sprite.beginFill(fillColor,1);sprite.bounds=new PIXI.Rectangle(0,0,width,height);sprite.drawRect(0,0,width,height);
    genText.x=x+(width*anchor+5);genText.y=y+(height*anchor);answerText.x=x+(width*0.2+5);answerText.y=y+(height*0.2);TextRect.addMultiple([sprite,genText,answerText]);
    return TextRect;
},

    createPopUp: function (x, y, w, h, color,border,caption,text) {
    //Create button function
        function createCircleButton(x,y,d,color,border,text,callback) {
            color = color?color:0xD9D8DB;
            border = border?border:0xB2BCBE;

            var buttonGroup = game.add.group();
            var buttonText = game.add.text(x,y,text,Map_Puzzle.buttonFontStyle);
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


    buildPattern: function(puzzlePattern) {
        game.world.forEach(function(children) {
            if (children.name==="box_group") {
                children.destroy();
            }
        });
        //Load Pattern
        var box = {width: game.world.width*0.08, height: game.world.width*0.08};
        var counter = 0;

        box_group = game.add.group();
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
        box_group.y = 100;
    },

	createTextRectangle: function (x, y, boxType,text,name) {
        //CAUTION: Custom Function for this project!DO NOT USE IN OTHER PLACES//
        var fillColor,borderColor,anchor;
		var width       = game.world.width*0.08;
		var height      = game.world.width*0.08;
		var fontStyle = {font: '13pt opensans', align: 'center', fill: '#FFFFFF'};
        var fontStyle2 = {font: '13pt opensans', align: 'center', fill: '#FFFFFF'/*F26247*/};

        var sprite = game.add.graphics(x, y);
        var TextRect = game.add.group();
        var genText = game.add.text(0,0,text,fontStyle);
        var answerText = game.add.text(0,0,"",fontStyle2);


        //B = NONE, S = SystemDefined, N = EmptyValue, C = CorrectAnswer, W = WrongAnswer
        switch (boxType) {
            case "B":
                borderColor    = 0xFFEEB0;
                fillColor      = 0xFFEEB0;
                anchor         = 0;

                sprite.inputEnabled    = false;

                TextRect.name          = name;
                break;
			case "N":
				//Box properties
                fontStyle.font = '8pt opensans';
                fillColor      = 11122891;
                borderColor    = 5401742;
				anchor         = 0;

				//Box input properties
				sprite.inputEnabled    = true;

                TextRect.name          = name;
                TextRect.isToggled     = false;
                TextRect.isAnswerWrong = false;
                TextRect.answer        = "";
                TextRect.onToggle      = function(game) {
                    if (!TextRect.isToggled) {
                        for (var i=0;i<TextRect.parent.length-1;i++) {
                            if (TextRect.parent.children[i].isToggled) {
                                TextRect.parent.children[i].onToggle();
                            }
                        }
                        game.showQuestion(text);
                        sprite.tint = 11122891;
                        TextRect.isToggled = true;
                    } else {
                        game.hideQuestion(text);
                        sprite.tint = 0xFFFEFF;
                        TextRect.isToggled = false;
                    }
                };
                TextRect.appendAnswer = function(text) {
                    TextRect.answer += text;
                    answerText.setText(TextRect.answer);
                    console.log(TextRect.answer);
                };
                TextRect.getAnswer = function () {
                    return TextRect.answer;
                };
                TextRect.removeAnswer = function(count) {
                    TextRect.answer = TextRect.answer.slice(0,count);
                    answerText.setText(TextRect.answer);
                    console.log(TextRect.answer);
                };
                TextRect.onAnswerWrong    = function(game) {
                    if (TextRect.isAnswerWrong) {
                        sprite.tint = 16724530//RED;
                    }
                    else {
                        if (!TextRect.isToggled) {
                            for (var i = 0; i < TextRect.parent.length - 1; i++) {
                                if (TextRect.parent.children[i].isToggled) {
                                    TextRect.parent.children[i].onToggle();
                                }
                            }
                            game.showQuestion(text);
                            sprite.tint = 11122891;
                            TextRect.isToggled = true;
                        } else {
                            game.hideQuestion(text);
                            sprite.tint = 0xFFFEFF;
                            TextRect.isToggled = false;
                        }
                    }
                };

                sprite.events.onInputUp.add(function() {
                    TextRect.onToggle(this);
                }, this);
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

        genText.x    = x+(width*anchor+5);
        genText.y    = y+(height*anchor);
        answerText.x = x+(width*0.2+5);
        answerText.y = y+(height*0.2);
        TextRect.addMultiple([sprite,genText,answerText]);

        return TextRect;
		//BLOCKED:3099761
		//ACTIVATE:5401742
    },
	
	init: function() {
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

        // var box = {width: game.world.width*0.08, height: game.world.width*0.08};
		//
		// this.box_1_1 = this.createTextRectangle(box.width+5   ,0              ,"empty" ,"1","Q1");
		// this.box_1_2 = this.createTextRectangle(box.width*3+15,0              ,"empty" ,"2","Q2");
		// this.box_2_1 = this.createTextRectangle(0             ,box.height*1+5 ,"empty" ,"3","Q3");
		// this.box_2_2 = this.createTextRectangle(box.width*1+5 ,box.height*1+5 ,"filled","*","O1");
		// this.box_2_3 = this.createTextRectangle(box.width*2+10,box.height*1+5 ,"filled","14","O2");
		// this.box_2_4 = this.createTextRectangle(box.width*3+15,box.height*1+5 ,"filled","-","O3");
		// this.box_2_5 = this.createTextRectangle(box.width*4+20,box.height*1+5 ,"empty" ,"4","Q4");
		// this.box_2_6 = this.createTextRectangle(box.width*5+25,box.height*1+5 ,"filled","=","O4");
		// this.box_2_7 = this.createTextRectangle(box.width*6+30,box.height*1+5 ,"empty" ,"","T1");
		// this.box_3_1 = this.createTextRectangle(box.width+5   ,box.height*2+10,"empty" ,"5","Q5");
		// this.box_3_2 = this.createTextRectangle(box.width*3+15,box.height*2+10,"empty" ,"6","Q6");
		// this.box_4_1 = this.createTextRectangle(box.width+5   ,box.height*3+15,"filled","÷","O5");
		// this.box_4_2 = this.createTextRectangle(box.width*3+15,box.height*3+15,"filled","+","O6");
		// this.box_5_1 = this.createTextRectangle(box.width+5   ,box.height*4+20,"empty" ,"7","Q7");
		// this.box_5_2 = this.createTextRectangle(box.width*3+15,box.height*4+20,"empty" ,"8","Q8");
		// this.box_6_1 = this.createTextRectangle(box.width+5   ,box.height*5+25,"filled","=","O7");
		// this.box_6_2 = this.createTextRectangle(box.width*3+15,box.height*5+25,"filled","=","O8");
		// this.box_7_1 = this.createTextRectangle(box.width+5   ,box.height*6+30,"empty" ,"","A2");
		// this.box_7_2 = this.createTextRectangle(box.width*3+15,box.height*6+30,"empty" ,"","A3");
		//
		// this.box_group = game.add.group();
		// this.box_group.name = "box_group";
		// this.box_group.addMultiple([this.box_1_1,this.box_1_2,this.box_2_1,this.box_2_2,this.box_2_3,this.box_2_4,this.box_2_5,this.box_2_6,this.box_2_7,
		// this.box_3_1,this.box_3_2,this.box_4_1,this.box_4_2,this.box_5_1,this.box_5_2,this.box_6_1,this.box_6_2,this.box_7_1,this.box_7_2]);
		//
		// //12271263
		// //this.box_background = this.createRectangle(0,0,this.box_group.width,this.box_group.height,10671263);
		// //this.box_group.addChildAt(this.box_background,0);
		// this.box_group.x = (game.world.width*0.5-this.box_group.width*0.5);
		// this.box_group.y = 100;



        /*****************************************
         *   *   *   *   *   *   *   *   *   *   *
         * Start Loading Questions Image and BGM *
         *   *   *   *   *   *   *   *   *   *   *
         *****************************************/
        //load BGM

		socket.on('GAME.start',function(data) {
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
                Map_Puzzle.prototype.buildPattern(data.room.puzzlePattern);
                //Load Question
                loader = new Phaser.Loader(game);
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


		socket.on('PLAYER.move',function(data) {
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.inputEnabled = true;
                }
            });
		});

		socket.on('PLAYER.correct',function(data) {
		    //data {location=box name}
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function(children2) {
                        if (children2.name==data.location) {
                            children2.isAnswerWrong = false;
                            children2.onAnswerWrong();
                        }
                    });
                }
            });
		});

		socket.on('PLAYER.wrong',function(data) {
            //data {location=box name}
            console.log("Data="+data.location);
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.forEach(function (children2) {
                        if (children2.name==data.location) {
                            children2.isAnswerWrong = true;
                            children2.onAnswerWrong();
                        }
                    });
                }
            });
		});

		socket.on('GAME.updatePattern',function(data) {
		    //TODO:display pattern
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
            this.question_submit = this.createRectangle(200,120,100,50,0x2F4C71,0x526C8E);
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
            this.question_group.y = 375;
            this.question_group.name = "Question_Group";
        }
    },

    hideQuestion:function () {
        game.world.forEach(function (children) {
            if (children.name === "Question_Group") {
                children.destroy();
            }
        });
    }
};
