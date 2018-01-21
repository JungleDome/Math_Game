var IndividualMatch = function () {};
	
IndividualMatch.prototype = {
	
	createRectangle: function (x, y, w, h) {
        var sprite = game.add.graphics(x, y);
        sprite.beginFill(Phaser.Color.getRandomColor(100, 255), 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRect(0, 0, w, h);
        return sprite;
    },

	createTextRectangle: function (x,y,w,h,text) {
        var fontStyle={font:'26pt opensans',align:'center',fill:'#FFFFFF'};

        var group = game.add.group();
        var sprite = game.add.graphics(x, y);
        sprite.beginFill(Phaser.Color.getRandomColor(100, 255), 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRoundedRect(0, 0, w, h,4);


        var genText=game.add.text(0,0,text,fontStyle);
        genText.setTextBounds(x+w/3,y+h/4,w,h);

        group.addMultiple([sprite,genText]);
        return group;
	},

	createMatchSlot: function(matchNumber,map,player1,player2,moneyEarned,rankEarned,matchResult) {
		//Defining all variable
        var sequenceTextStyle = { font: '18pt opensans', fill: 'black', align: 'left', stroke: 'rgba(25,25,25,0.3)', strokeThickness: 2};
        var textStyle = {font: '14pt opensans', align: 'left', weight: 'bold'};
		var width = game.world.width*0.8;
		var height = 50;
		var color;

		//Determine box color depends on the match result (win=green,lose=red);
		switch (matchResult) {
			case "Win":
				color = 0x32FF32;
				break;
			case "Lose":
				color = 0xFF3232;
				break;
			default:
				color = 0xE5FFE5;
				break;
		}

		//Make a container
		var matchSlotContainer = game.add.group();
		//Draw background
		var background = game.add.graphics(0, 0);
        background.beginFill(color, 1);
        background.bounds = new PIXI.Rectangle(0, 0, width, height);
        background.drawRoundedRect(0, 0, width, height,4);

        //Draw text
		var sequenceText 	 = game.make.text(width*0.03,10,String(matchNumber+1).concat("."),sequenceTextStyle);
		var mapText      	 = game.make.text(width*0.1,15,map,textStyle);
        var matchResultText	 = game.make.text(width*0.3,15,matchResult,textStyle);
        // var player1Text  	 = game.make.text(width*0.6,3,player1,textStyle);
        // var player2Text      = game.make.text(width*0.6,23,player2,textStyle);
        var moneyEarnedText  = game.make.text(width*0.5,5,"Money Earned:"+moneyEarned,textStyle);
        var rankEarnedText   = game.make.text(width*0.5,25,"Rating Earned :"+rankEarned,textStyle);

        matchSlotContainer.addMultiple([background,sequenceText,mapText,matchResultText/*,player1Text,player2Text*/,moneyEarnedText,rankEarnedText]);
        matchSlotContainer.x = 0;
        matchSlotContainer.y = ((matchNumber+1)*height) - height;//(matchNumber * height) + (matchNumber * 7) + 100;

        return matchSlotContainer;
	},
	
	addMenuOption: function(text, callback) {
		var optionStyle = { font: '30pt opensans', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
		var txt = game.make.text(game.world.centerX, (this.optionCount * 60) + 400, text, optionStyle);
		txt.anchor.setTo(0.5);
		txt.stroke = "rgba(0,0,0,0)";
		txt.strokeThickness = 4;
		var onOver = function (target) {
		  target.fill = "#FEFFD5";
		  target.stroke = "rgba(200,200,200,0.5)";
		  txt.useHandCursor = true;
		};
		var onOut = function (target) {
		  target.fill = "white";
		  target.stroke = "rgba(0,0,0,0)";
		  txt.useHandCursor = false;
		};
		//txt.useHandCursor = true;
		txt.inputEnabled = true;
		txt.events.onInputUp.add(callback, this);
		txt.events.onInputOver.add(onOver, this);
		txt.events.onInputOut.add(onOut, this);
		this.optionCount ++;
		return txt;
	},
	
	init: function() {
		//Variables//
        //game.state.start("Map_TicTacToe");

		this.optionCount = 1;
		var fontStyle = {
			font: '13pt opensans',
			align: 'center'
		};

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

		//All elements here//
		this.findingTitle = game.make.text(game.world.centerX, 55, "You will be matched soon...",fontStyle);
        this.findingTitle.visible = false;
        this.findingTitle.name = "FindingTitle";
        this.historyTitle = game.make.text(game.world.centerX, 55, "Match History",fontStyle);
        this.historyTitle.name = "HistoryTitle";
		this.backButton   = this.addMenuOption('Back',function() {
            socket.emit('QUEUE.leave',{id:getCookie("id"),socketID:getCookie("socketID")});
			this.game.state.start("GameMenu");
		});

        this.findMatch   = this.addMenuOption('Find Match',function() {
        	console.log("Join queue");
            socket.emit('QUEUE.join',{id:getCookie("id"),socketID:getCookie("socketID")});
            game.world.forEach(function (children) {
                if (children.name === "History_Container") {
                    children.visible = false;
                } else if (children.name === "Map_Container") {
                    children.visible = true;
				} else if (children.name === "FindingTitle") {
                    children.visible = true;
				} else if (children.name === "HistoryTitle") {
                    children.visible = false;
                }
            });
        });
		
		//Positioning elements//
		utils.centerGameObjects([this.historyTitle,this.findingTitle,this.backButton,this.findMatch]);
	},

	create: function() {
		this.bg = game.add.tileSprite(0, 0,400,600, 'menu-bg');
        game.add.existing(this.historyTitle);
		game.add.existing(this.findingTitle);
		game.add.existing(this.backButton);
        game.add.existing(this.findMatch);
		
		//this.map_1 = this.createRectangle(game.world.width*0.5-((game.world.width*0.7)/2),100,game.world.width*0.7,game.world.width*0.7);

		this.historyContainer = game.add.group();
		this.historyContainer.width = game.world.width*0.7;
        this.historyContainer.height = game.world.width*0.7;
        this.historyContainer.x = game.world.width*0.5-((game.world.width*0.7)/2);
        this.historyContainer.y = 100;
        this.historyContainer.name = "History_Container";




        // game.world.forEach(function (children) {
        //     if (children.name === "History_Container") {
        //     	var history = IndividualMatch.prototype.createMatchSlot(1,"Riddle","Tim","John","200","35","Win");
        //     	history.x = -17;
			// 	children.add(history);
        //     }
        // });

        var mapContainer = game.add.group();
        mapContainer.name = "Map_Container";
        mapContainer.x = 0;
        mapContainer.y = 0;
        mapContainer.visible = false;


        this.map1 = this.createTextRectangle(game.world.width*0.5-((game.world.width*0.7)/2)-(game.world.width*0.7*0),200,game.world.width*0.7,game.world.width*0.2,"Riddle");
        this.map2 = this.createTextRectangle(game.world.width*0.5-((game.world.width*0.7)/2)-(game.world.width*0.7*1)-100,200,game.world.width*0.7,game.world.width*0.2,"Puzzle");
        this.map3 = this.createTextRectangle(game.world.width*0.5-((game.world.width*0.7)/2)-(game.world.width*0.7*2)-200,200,game.world.width*0.7,game.world.width*0.2,"Tic Tac Toe");
        this.map4 = this.createTextRectangle(game.world.width*0.5-((game.world.width*0.7)/2)-(game.world.width*0.7*3)-300,200,game.world.width*0.7,game.world.width*0.2,"Find Me");
        mapContainer.addMultiple([this.map1,this.map2,this.map3,this.map4]);


        function isMap2Displayed(mapContainer) {
        	return (mapContainer.x == game.world.width-20);
		}

        function isMap1Displayed(mapContainer) {
            return (mapContainer.x == game.world.width-400);
        }

        function isMap3Displayed(mapContainer) {
            return (mapContainer.x == game.world.width+360);
        }
        function isMap4Displayed(mapContainer) {
            return (mapContainer.x == game.world.width+740);
        }


        var rollerAnimation = setInterval(function(map1) {
			var increasingX =10;
			map1.x += increasingX;

			if (map1.x>=game.world.width*3.72) {
                map1.x = game.world.width * 0.5 - ((game.world.width * 0.7) / 2) - (game.world.width * 0.7 * 1.5);
            }
        },30,mapContainer);
		/*********
		 * DEBUG *
		 *********/
		// setTimeout(function() {
		// 	game.state.start("Map_FindMe");
		// },10);

		//TODO:get database
        socket.emit('PLAYER.getMatchHistory',{id:getCookie("id"),socketID:getCookie("socketID")});

        socket.on('PLAYER.matchHistory',function(data) {
        	console.log("Receive match history");
        	console.log(data);
        	game.world.forEach(function (children) {
        		if (children.name === "History_Container") {
                    for (var i = 0; i < data.matchHistory.length; i++) {
                        var match = data.matchHistory[i];
                        var history = IndividualMatch.prototype.createMatchSlot(i, match.maps, match.player1, match.player2, match.moneyEarned, match.rankEarned, match.result);
						history.x = -17;
                        children.add(history);
                    }
                }
			});
		});

		console.log(getCookie("id"));

        socket.on('QUEUE.wait',function(data) {
            //TODO:Notice player to wait longer
			console.log("QUEUE.wait:Wait for other player");
        });


        socket.on('QUEUE.found',function(data) {
        	//TODO:Notice player game found
			console.log("QUEUE.found:Wait for server");
            socket.emit('ROOM.join',{id:getCookie("id"),socketID:getCookie("socketID"),roomID:data.roomID});
		});

        socket.on('GAME.startload',function(data) {
        	console.log("GAME.startload:Game loading");
        	console.log(data);

			switch (data.mapName) {
				case "Map_Riddle":
                    setInterval(function(map1) {
                        if (isMap1Displayed(map1)) {
                            clearInterval(rollerAnimation);
                        }
                    },60,mapContainer);
					break;
				case "Map_Puzzle":
                    setInterval(function(map1) {
                        if (isMap2Displayed(map1)) {
                            clearInterval(rollerAnimation);
                        }
                    },60,mapContainer);
					break;
				case "Map_TicTacToe":
                    setInterval(function(map1) {
                        if (isMap3Displayed(map1)) {
                            clearInterval(rollerAnimation);
                        }
                    },60,mapContainer);
					break;
				case "Map_FindMe":
                    setInterval(function(map1) {
                        if (isMap4Displayed(map1)) {
                            clearInterval(rollerAnimation);
                        }
                    },60,mapContainer);
					break;
			}

            setTimeout(function() {
            	game.state.start(data.mapName);
            },3000);
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
	}
};