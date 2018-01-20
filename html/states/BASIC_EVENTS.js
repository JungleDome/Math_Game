var Map_Puzzle = function (game) {};

Map_Puzzle.prototype = {
    //TODO:Fix font anchor for answer box.
    createRectangle: function (x, y, w, h, color) {
    color = color || 11122891;//Phaser.Color.getRandomColor(100, 255);
    var sprite = game.add.graphics(x, y);
    //sprite.lineStyle(2, 5401742, 1);
    sprite.beginFill(color, 1);
    sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
    sprite.drawRoundedRect(0, 0, w, h, 4);
    sprite.beginFill(5401742, 1);
    sprite.drawRoundedRect(0,h,w,2,2);

    return sprite;
    //BLOCKED:3099761
    //ACTIVATE:5401742
    },

	createTextRectangle: function (x, y, boxType,text) {
        //CAUTION: Custom Function for this project!DO NOT USE IN OTHER PLACES//

		//Phaser.Color.getRandomColor(100, 255);
        var fillColor,borderColor,anchor;
		var width       = game.world.width*0.08;
		var height      = game.world.width*0.08;
		var fontStyle = {
			font: '13pt opensans',
			align: 'center',
			fill: '#FFFFFF'
            //F26247
		}
        var fontStyle2 = {
            font: '13pt opensans',
            align: 'center',
            fill: '#FFFFFF'
            //F26247
        }

        var sprite = game.add.graphics(x, y);
        var TextRect = game.add.group();
        var genText = game.add.text(0,0,text,fontStyle);
        var answerText = game.add.text(0,0,"",fontStyle2);

        switch (boxType) {
			case "empty":
				//Box properties
                fontStyle.font = '8pt opensans';
                fillColor      = 11122891;
                borderColor    = 5401742;
				anchor         = 0;

				//Box input properties
				sprite.inputEnabled  = true;
				TextRect.name        = "Q".concat(text);
                TextRect.isToggled   = false;
                TextRect.answer      = "";
                TextRect.onToggle    = function(game) {
                    if (!TextRect.isToggled) {
                        for (i=0;i<TextRect.parent.length-1;i++) {
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

                sprite.events.onInputUp.add(function() {
                    TextRect.onToggle(this);
                }, this);
				break;

            case "filled":
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
		var fontStyle = {
			font: '13pt opensans',
			align: 'center'
		}
		this.menu  = game.make.text(40,55,"Menu",fontStyle);
		this.menu.inputEnabled  = true;
		this.menu.events.onInputUp.add(function() {
			this.game.state.start("GameMenu");
		}, this);
		
		this.score = game.make.text(game.world.centerX,55,"Score: 0",fontStyle);
		this.help  = game.make.text(game.world.width-40,55,"?",fontStyle);
		this.help.inputEnabled  = true;
		this.help.events.onInputUp.add(function() {
			
		}, this);
		utils.centerGameObjects([this.score,this.menu,this.help]);
	},

    preload: function () {


        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    },
	
	create: function() {
		var fontStyle = {
			font: '13pt opensans',
			align: 'center'
		}
		var box = {
		width:game.world.width*0.08,
		height:game.world.width*0.08
		}
		//
		this.bg  = game.stage.backgroundColor = '#FFEEB0';
		game.add.existing(this.menu);
		game.add.existing(this.score);
		game.add.existing(this.help);
		
		this.box_1_1 = this.createTextRectangle(box.width+5   ,box.height*0   ,"empty" ,"1");
		this.box_1_2 = this.createTextRectangle(box.width*3+15,box.height*0   ,"empty" ,"2");
		this.box_2_1 = this.createTextRectangle(0             ,box.height*1+5 ,"empty" ,"3");
		this.box_2_2 = this.createTextRectangle(box.width*1+5 ,box.height*1+5 ,"filled","*");
		this.box_2_3 = this.createTextRectangle(box.width*2+10,box.height*1+5 ,"filled","14");
		this.box_2_4 = this.createTextRectangle(box.width*3+15,box.height*1+5 ,"filled","-");
		this.box_2_5 = this.createTextRectangle(box.width*4+20,box.height*1+5 ,"empty" ,"4");
		this.box_2_6 = this.createTextRectangle(box.width*5+25,box.height*1+5 ,"filled","=");
		this.box_2_7 = this.createTextRectangle(box.width*6+30,box.height*1+5 ,"empty" ,"");
		this.box_3_1 = this.createTextRectangle(box.width+5   ,box.height*2+10,"empty" ,"5");
		this.box_3_2 = this.createTextRectangle(box.width*3+15,box.height*2+10,"empty" ,"6");
		this.box_4_1 = this.createTextRectangle(box.width+5   ,box.height*3+15,"filled","÷");
		this.box_4_2 = this.createTextRectangle(box.width*3+15,box.height*3+15,"filled","+");
		this.box_5_1 = this.createTextRectangle(box.width+5   ,box.height*4+20,"empty" ,"7");
		this.box_5_2 = this.createTextRectangle(box.width*3+15,box.height*4+20,"empty" ,"8");
		this.box_6_1 = this.createTextRectangle(box.width+5   ,box.height*5+25,"filled","=");
		this.box_6_2 = this.createTextRectangle(box.width*3+15,box.height*5+25,"filled","=");
		this.box_7_1 = this.createTextRectangle(box.width+5   ,box.height*6+30,"empty" ,"");
		this.box_7_2 = this.createTextRectangle(box.width*3+15,box.height*6+30,"empty" ,"");
		
		this.box_group = game.add.group();
		this.box_group.name = "box_group";
		this.box_group.addMultiple([this.box_1_1,this.box_1_2,this.box_2_1,this.box_2_2,this.box_2_3,this.box_2_4,this.box_2_5,this.box_2_6,this.box_2_7,
		this.box_3_1,this.box_3_2,this.box_4_1,this.box_4_2,this.box_5_1,this.box_5_2,this.box_6_1,this.box_6_2,this.box_7_1,this.box_7_2]);
		
		//12271263
		//this.box_background = this.createRectangle(0,0,this.box_group.width,this.box_group.height,10671263);
		//this.box_group.addChildAt(this.box_background,0);
		this.box_group.x = (game.world.width*0.5-this.box_group.width*0.5);
		this.box_group.y = 100;
		//Question

        /*****************************************
         *   *   *   *   *   *   *   *   *   *   *
         * Start Loading Questions Image and BGM *
         *   *   *   *   *   *   *   *   *   *   *
         *****************************************/
        //load BGM

         /****************
         * Load Question *
         ****************/
        //PRODUCTION:
        // socket.emit('GAME.requestQuestion',{id:getCookie("id"),socketID:getCookie("socketID")},function (questions) {
        //    //TODO:load the question from url then emit game ready after the questions are loaded into client cache.
        // 	console.log(questions);
        //    loader = new Phaser.Loader(game);
        //    for (i=0;i<questions.length;i++) {
        //        //TODO:load the question
        //        loader.image('question-'.concat(i+1), questions.questionFileName);
        //        //(Question) {questionID,questionFileName,questionAnswer,questionChoices}
        //    }
        //    loader.onLoadComplete.addOnce(function() {
        //        console.log('everything is loaded and ready to be used')
        //    });
        //    loader.start();
        //    socket.emit('GAME.ready',{id:getCookie("id"),socketID:getCookie("socketID")});
        // });

        //DEBUG:
        loader = new Phaser.Loader(game);
        loader.image('question-'.concat(1), 'assets\\questions\\puzzle\\1.png');
        loader.onLoadComplete.addOnce(function() {
			function createRectangle(x, y, w, h, color) {
                color = color || 11122891;//Phaser.Color.getRandomColor(100, 255);
                var sprite = game.add.graphics(x, y);
                sprite.lineStyle(2, 5401742, 1);
                sprite.beginFill(color, 1);
                sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
                sprite.drawRect(0, 0, w, h);

                return sprite;
                //BLOCKED:3099761
                //ACTIVATE:5401742
            }
            function getCookie(cname) {
                var name = cname + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }
            //TODO:Display game ready
            socket.emit('GAME.ready',{id:getCookie("id"),socketID:getCookie("socketID")});
            console.log('everything is loaded and ready to be used');
        });
        loader.start();


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
                            var location = "";
                            var answer   = null;
                            game.world.forEach(function(children) {
                                if (children.name==="box_group") {
                                    children.forEach(function(children2) {
                                        if (children2.isToggled) {
                                            location = children2.name;
                                            answer = children2.getAnswer();
                                        }
                                    })
                                }
                            });

                            socket.emit('PLAYER.answer',{id:getCookie("id"),socketID:getCookie("socketID"),location:location,answer:answer});
                            game.world.forEach(function(children) {
                                if (children.name==="box_group") {
                                    children.input.enabled = false;
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




		socket.on('GAME.start',function(data) {
			//TODO:Display Game Start Notification
		});

		/*******************
		 *  *   *   *   *  *
	     * START DEBUGGING *
		 * 	*	*	*	*  *
		 *******************/



		socket.on('GAME.tick',function(data) {
			//TODO:display timer
			return data.timerText
		});

        socket.on('GAME.stop',function(data) {
            //TODO:display stop message
			return data.reason
        });



		socket.on('PLAYER.move',function(data) {
			//TODO:Show the choices and allow the player to choose and submit answer????
            //TODO:Notify player its their turn
            game.world.forEach(function(children) {
                if (children.name==="box_group") {
                    children.inputEnabled = true;
                }
            });

		});

		socket.on('PLAYER.correct',function(data) {
            
		});

		socket.on('PLAYER.wrong',function(data) {

		});

		socket.on('GAME.updatePoint',function(data) {
			//TODO:Display new point score for player
			//data:{player1Point,player2Point}
		});

        /*****************
         *   *   *   *   *
         * END DEBUGGING *
         *   *   *   *   *
         *****************/

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
	},

    showQuestion: function (questionNumber) {
    var fontStyle = {font: '13pt opensans', align: 'center'};

    this.question_box = this.createRectangle(0,0,350,180);

    this.question_number = game.make.text(5,7,questionNumber.concat('.'),fontStyle);
    this.question_image  = game.make.sprite(16,0,'question-'.concat(questionNumber));
    //this.question_2   = game.make.sprite(16,30,'question-1');
    //this.question_3   = game.make.sprite(16,60,'question-1');
    //this.question_4   = game.make.sprite(16,90,'question-1');
    //this.question_5   = game.make.sprite(16,120,'question-1');
    this.question_6   = game.make.text(40,150,"____________",fontStyle);
    this.question_submit = this.createRectangle(40,150,100,50,2401742);
    this.question_submit.inputEnabled = true;
    this.question_submit.events.onInputUp.add(function() {
        var location = "";
        var answer   = null;
        game.world.forEach(function(children) {
            if (children.name==="box_group") {
                children.forEach(function(children2) {
                    if (children2.isToggled) {
                        location = children2.name;
                        answer = children2.getAnswer();
                    }
                })
            }
        });

        socket.emit('PLAYER.answer',{id:getCookie("id"),socketID:getCookie("socketID"),location:location,answer:answer});
        game.world.forEach(function(children) {
            if (children.name==="box_group") {
                children.inputEnabled = false;
            }
        });

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    });
    this.submitText = game.add.text(40,150,"Submit",fontStyle);

    this.question_group = game.add.group();
    this.question_group.addMultiple([this.question_box,this.question_number,this.question_image,this.question_6,this.question_submit,this.submitText]);

    this.question_group.x = (game.world.width*0.5-this.question_group.width*0.5);
    this.question_group.y = 400;
    this.question_group.name = "Question_Group";
},

hideQuestion:function (questionNumber) {
    this.question_group.destroy();
},
    getCookie: function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
};
