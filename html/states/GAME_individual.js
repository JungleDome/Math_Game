var IndividualMatch = function () {};
	
IndividualMatch.prototype = {
	
	createRectangle: function (x, y, w, h) {
        var sprite = game.add.graphics(x, y);
        sprite.beginFill(Phaser.Color.getRandomColor(100, 255), 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRect(0, 0, w, h);
        return sprite;
    },
	
	addMenuOption: function(text, callback) {
		var optionStyle = { font: '30pt opensans', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
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
		this.backButton   = this.addMenuOption('Back',function() {
            socket.emit('QUEUE.leave',{id:getCookie("id"),socketID:getCookie("socketID")});
			this.game.state.start("GameMenu");
		});

        this.findMatch   = this.addMenuOption('Find Match',function() {

        });
		
		//Positioning elements//
		utils.centerGameObjects([this.findingTitle,this.backButton,this.findMatch]);
	},

	create: function() {
		this.bg = game.add.tileSprite(0, 0,400,600, 'menu-bg');
		game.add.existing(this.findingTitle);
		game.add.existing(this.backButton);
        game.add.existing(this.findMatch);
		
		this.map_1 = this.createRectangle(game.world.width*0.5-((game.world.width*0.7)/2),100,game.world.width*0.7,game.world.width*0.7);

		/*********
		 * DEBUG *
		 *********/
		// setTimeout(function() {
		// 	game.state.start("Map_FindMe");
		// },10);

		//TODO:Show match history
		//TODO:get database


        socket.emit('QUEUE.join',{id:getCookie("id"),socketID:getCookie("socketID")});
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
            setTimeout(function() {
            	game.state.start(data.mapName);
            },1000);
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