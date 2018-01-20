var Map_TicTacToe = function (game) {};
Map_TicTacToe.defaultFontStyle  = {font: '13pt opensans', align: 'center', fill: '#000000'};
Map_TicTacToe.lastQuestionNumber = 0;

Map_TicTacToe.prototype = {
    createPopUp: function (x, y, w, h, color,border,caption,text) {
        //Create button function
        function createCircleButton(x,y,d,color,border,text,callback) {
            color = color?color:0xD8DFE8;
            border = border?border:0x526C8E;

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

        sprite.inputEnabled    = true;
        sprite.events.onInputUp.add(function() {
            //Toggle event handler
            Map_TicTacToe.prototype.showPopupQuestion(xyLocation);
            Map_TicTacToe.lastQuestionNumber++;
            //socket.emit('PLAYER.answer', {id: game.global.id, socketID: game.global.socketID, questionNumber: TextRect.questionNumber, answer: String(TextRect.answer)});
        });


        //Draw symbol
        var symbol;
        if (player==="F") {
            symbol = game.make.sprite(x+w/6,y+h/6, 'ttc_circle');
            symbol.width = w/1.5;
            symbol.height = h/1.5;
        } else if (player==="S") {
            symbol = game.make.sprite(x+w/4,y+h/4, 'ttc_cross');
            symbol.width = w/2;
            symbol.height = h/2;
        } else {
            //Do nothing
            symbol = game.make.sprite(x,y, 'ttc_circle');
            symbol.width = 0;
            symbol.height = 0;
        }


        group.addMultiple([sprite,symbol]);
        return group;
    },
    
    buildPattern: function(tictactoePattern) {
        //TODO: loop through tictactoe pattern
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

    showPopupQuestion: function(xyLocation) {
        var questionNumber = Map_TicTacToe.lastQuestionNumber;
        var fillColor = 0xD8DFE8;
        var borderColor = 0x526C8E;
        var width  = game.world.width*0.8;
        var height = game.world.height*0.5;
        var margin = 2;

        var questionGroup = game.add.group();
        var bgContainer = game.add.graphics(0, 0);
        bgContainer.beginFill(fillColor, 1);
        bgContainer.bounds = new PIXI.Rectangle(0, 0, width+2, height+2);
        bgContainer.drawRoundedRect(2, 2, width-4, height-4, 4);
        bgContainer.beginFill(borderColor, 1);
        bgContainer.drawRoundedRect(0,0,width,height,4);

        var question = game.make.sprite(0,0, "question-".concat(String(parseInt(questionNumber+1))));
        var answerField = game.make.text(margin,question.height+margin,"",Map_TicTacToe.defaultFontStyle);
        var answerUnderline = game.make.text(margin,answerField.y+(margin*2),"__________",Map_TicTacToe.defaultFontStyle);
        var questionSubmit = Map_TicTacToe.prototype.createRectangle(width - margin - 100,answerUnderline.y,100,50,0xD8DFE8,0x526C8E);
        questionSubmit.inputEnabled = true;
        questionSubmit.events.onInputUp.add(function() {
            var answer = answerField.getAnswer();
            socket.emit('PLAYER.answer',{id:game.global.id,socketID:game.global.socketID,location:xyLocation,answer:answer,questionNumber:questionNumber});
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

        questionGroup.addMultiple([bgContainer,question,answerUnderline,answerField,questionSubmit]);
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
        var fontStyle = {font: '13pt opensans', align: 'center'};
        this.menu  = game.make.text(40,55,"Menu",fontStyle);
        this.menu.inputEnabled  = true;
        this.menu.events.onInputUp.add(function() {
            this.game.state.start("GameMenu");
        }, this);
        this.timer = game.make.text(game.world.centerX+60,55,"Timer: 00:00",fontStyle);
        this.score = game.make.text(game.world.centerX-60,55,"Score: 0",fontStyle);
        this.help  = game.make.text(game.world.width-40,55,"?",fontStyle);
        this.help.inputEnabled  = true;
        this.help.events.onInputUp.add(function() {
            this.createPopUp(this.game.width*0.05,this.game.height*0.5-100,this.game.width*0.9,200,0xD8DFE8,0xA9B8CB,"How to play!","1.Fill up all the boxes.\n2.The highest score will win the game.");
        }, this);
        utils.centerGameObjects([this.menu,this.timer,this.score,this.help]);
    },

    create: function() {
        game.add.existing(this.menu);
        game.add.existing(this.score);
        game.add.existing(this.timer);
        game.add.existing(this.help);

        //
        // this.box_1_1 = this.createRectangle(0,0,box.width,box.height);
        // this.box_1_2 = this.createRectangle(box.width+5,0,box.width,box.height);
        // this.box_1_3 = this.createRectangle(box.width*2+10,0,box.width,box.height);
        // this.box_1_4 = this.createRectangle(box.width*3+15,0,box.width,box.height);
        // this.box_1_5 = this.createRectangle(box.width*4+20,0,box.width,box.height);
        //
        // this.box_2_1 = this.createRectangle(0,box.height*1+5,box.width,box.height);
        // this.box_2_2 = this.createRectangle(box.width+5,box.height*1+5,box.width,box.height);
        // this.box_2_3 = this.createRectangle(box.width*2+10,box.height*1+5,box.width,box.height);
        // this.box_2_4 = this.createRectangle(box.width*3+15,box.height*1+5,box.width,box.height);
        // this.box_2_5 = this.createRectangle(box.width*4+20,box.height*1+5,box.width,box.height);
        //
        // this.box_3_1 = this.createRectangle(0,box.height*2+10,box.width,box.height);
        // this.box_3_2 = this.createRectangle(box.width+5,box.height*2+10,box.width,box.height);
        // this.box_3_3 = this.createRectangle(box.width*2+10,box.height*2+10,box.width,box.height);
        // this.box_3_4 = this.createRectangle(box.width*3+15,box.height*2+10,box.width,box.height);
        // this.box_3_5 = this.createRectangle(box.width*4+20,box.height*2+10,box.width,box.height);
        //
        // this.box_4_1 = this.createRectangle(0,box.height*3+15,box.width,box.height);
        // this.box_4_2 = this.createRectangle(box.width+5,box.height*3+15,box.width,box.height);
        // this.box_4_3 = this.createRectangle(box.width*2+10,box.height*3+15,box.width,box.height);
        // this.box_4_4 = this.createRectangle(box.width*3+15,box.height*3+15,box.width,box.height);
        // this.box_4_5 = this.createRectangle(box.width*4+20,box.height*3+15,box.width,box.height);
        //
        // this.box_5_1 = this.createRectangle(0,box.height*4+20,box.width,box.height);
        // this.box_5_2 = this.createRectangle(box.width+5,box.height*4+20,box.width,box.height);
        // this.box_5_3 = this.createRectangle(box.width*2+10,box.height*4+20,box.width,box.height);
        // this.box_5_4 = this.createRectangle(box.width*3+15,box.height*4+20,box.width,box.height);
        // this.box_5_5 = this.createRectangle(box.width*4+20,box.height*4+20,box.width,box.height);
        //
        // this.box_group = game.add.group();
        // this.box_group.addMultiple([this.box_1_1,this.box_1_2,this.box_1_3,this.box_1_4,this.box_1_5,this.box_2_1,this.box_2_2,this.box_2_3,this.box_2_4,this.box_2_5,
        //     this.box_3_1,this.box_3_2,this.box_3_3,this.box_3_4,this.box_3_5,this.box_4_1,this.box_4_2,this.box_4_3,this.box_4_4,this.box_4_5,this.box_5_1,this.box_5_2,this.box_5_3,this.box_5_4,this.box_5_5]);
        // this.box_group.x = (game.world.width*0.5-this.box_group.width*0.5);
        // this.box_group.y = 130;

        //this.question_box = this.createRectangle(30,game.world.height-25-140,340,150);

        //Demo
        this.tictactoePattern = [[0,"F",0,"F",0],["S",0,"S",0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
        Map_TicTacToe.prototype.buildPattern(this.tictactoePattern);


        //TODO:Use picture to display equation
        //this.question_text = this.addTextToRectangle(this.question_box,"1. ABC+DEF = ???" ,0.03);
        //this.question_box.alpha = 0;
        //this.question_text.alpha = 0;

        this.bg  = game.stage.backgroundColor = '#788DA7';


        socket.on('PLAYER.move',function(data) {
            //TODO:Player chooses which box he wants to tick then show question and choices for it.
            //TODO:Send the box that the player chooses as [x,y] to server
            socket.emit('PLAYER.answer',{id:getCookie("id"),socketID:getCookie("socketID"),location:{x:1,y:1}/*TODO:Location here*/});
            //TODO:Block the player from pressing things/submitting button
        });

        /*******************************
         * Start Handles Keyboard Input *
         *******************************/
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
                //Submit answer (Duplicated)
                game.world.forEach(function(children) {
                    if (children.name==="question_group") {
                        children.forEach(function(children2) {
                            if (children2.name==="answerField") {
                                var questionNumber = children2.questionNumber;
                                var answer = children2.getAnswer();
                                var xyLocation = children2.location;
                                socket.emit('PLAYER.answer',{id:game.global.id,socketID:game.global.socketID,location:xyLocation,answer:answer,questionNumber:questionNumber});
                            }
                        })
                    }
                });
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