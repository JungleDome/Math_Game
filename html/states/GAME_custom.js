var CustomMatch = function (game) {};

CustomMatch.choosenMap = null;

CustomMatch.prototype = {
	
	createRectangle: function (x, y, w, h) {
        var sprite = game.add.graphics(x, y);
        sprite.beginFill(Phaser.Color.getRandomColor(100, 255), 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRect(0, 0, w, h);
        return sprite;
    },

    createTextRectangle: function (x,y,w,h,text,callback) {
        var fontStyle={font:'20pt opensans',boundsAlignH:'center',boundsAlignV:'middle',fill:'#FFFFFF'};

        var group = game.add.group();
        var sprite = game.add.graphics(x, y);
        sprite.beginFill(Phaser.Color.getRandomColor(100, 255), 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRoundedRect(0, 0, w, h,4);
        sprite.inputEnabled = true;
        sprite.events.onInputUp.add(callback);


        var genText=game.add.text(0,0,text,fontStyle);
        genText.setTextBounds(x,y,w,h);

        group.addMultiple([sprite,genText]);
        return group;
    },
	
	addMenuOption: function(text, callback) {
		var optionStyle = { font: '30pt opensans', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
		var txt = game.make.text(game.world.centerX, (this.optionCount * 60) + 450, text, optionStyle);
		txt.anchor.setTo(0.5);
		txt.stroke = "rgba(0,0,0,0";
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
		this.optionCount = 1;
		var fontStyle = {
			font: '13pt opensans',
			align: 'center'
		};
		
		//All elements here//
		this.findingTitle = game.make.text(game.world.centerX, 55, "Please select a level to play",fontStyle);
		this.backButton   = this.addMenuOption('Back',function() {
			this.game.state.start("GameMenu");
		});
		
		//Positioning elements//
		utils.centerGameObjects([this.findingTitle,this.backButton]);
	},

	create: function() {
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

		this.bg = game.add.tileSprite(0, 0,400,600, 'menu-bg');

        this.map1 = this.createTextRectangle(30,80,150,150,"Find Me",function() {
            socket.emit('QUEUE.joinCustom', {
                id: getCookie("id"),
                socketID: getCookie("socketID"),
				mapID: 2
            });
        });
		this.map2 = this.createTextRectangle(30,280,150,150,"Riddle",function() {
            socket.emit('QUEUE.joinCustom', {
                id: getCookie("id"),
                socketID: getCookie("socketID"),
                mapID: 3
            });
		});
        this.map3 = this.createTextRectangle(220,280,150,150,"Tic Tac Toe",function() {
            socket.emit('QUEUE.joinCustom', {
                id: getCookie("id"),
                socketID: getCookie("socketID"),
                mapID: 1
            });
            console.log(getCookie("id"));
        });
        this.map4 = this.createTextRectangle(220,80,150,150,"Puzzle",function() {
            socket.emit('QUEUE.joinCustom', {
                id: getCookie("id"),
                socketID: getCookie("socketID"),
                mapID: 0
            });
		});

		game.add.existing(this.backButton);
        game.add.existing(this.findingTitle);
		game.add.existing(this.map1);
        game.add.existing(this.map2);
        game.add.existing(this.map3);
        game.add.existing(this.map4);
		
		//this.map_1 = this.createRectangle(game.world.width*0.5-((game.world.width*0.7)/2),100,game.world.width*0.7,game.world.width*0.7);


        socket.on('QUEUE.found',function(data) {
            console.log("QUEUE.found:Wait for server");
			socket.emit('ROOM.joinCustom', {
				id: getCookie("id"),
				socketID: getCookie("socketID"),
				roomID: data.roomID
			});
        });

        socket.on('GAME.startload',function(data) {
            console.log("GAME.startload:Game loading");
            console.log(data);

			game.state.start(data.mapName);
        });
	}
};