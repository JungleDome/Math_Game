var GameMenu = function() {};


GameMenu.prototype = {

  menuConfig: {
    startY: 260,
    startX: 30
  },
  
  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt opensans', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.make.text(game.world.centerX, (this.optionCount * 60) + 200, text, optionStyle);
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

    createMatchSlot: function(matchNumber,player) {
        //Defining all variable
        var sequenceTextStyle = { font: '20pt opensans', fill: 'black', align: 'left', stroke: 'rgba(25,25,25,0.3)', strokeThickness: 4};
        var textStyle = {font: '22pt opensans', align: 'left'};
        var width = game.world.width*0.8;
        var height = 50;
        var color = 0xE5FFE5;

        //Make a container
        var matchSlotContainer = game.add.group();
        //Draw background
        var background = game.add.graphics(0, 0);
        background.beginFill(color, 1);
        background.bounds = new PIXI.Rectangle(0, 0, width, height);
        background.drawRoundedRect(0, 0, width, height,4);

        //Draw text
        var sequenceText 	 = game.make.text(width*0.05,10,String(matchNumber).concat("."),sequenceTextStyle);
        var playerText  	 = game.make.text(width*0.2,10,player,textStyle);

        matchSlotContainer.addMultiple([background,sequenceText,playerText]);
        matchSlotContainer.x = game.world.centerX - (matchSlotContainer.width/2);
        matchSlotContainer.y = (matchNumber * height) + (matchNumber * 7) + 100;

        return matchSlotContainer;
    },
  
  init: function () {
	// this.game.ListView = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
	//
	// this.game.ListView.configure({
	// 	kineticMovement: true,
	// 	timeConstantScroll: 325, //really mimic iOS
	// 	horizontalScroll: false,
	// 	verticalScroll: true,
	// 	horizontalWheel: true,
	// 	verticalWheel: true,
	// 	deltaWheel: 40
	// });
	
	//this.game.ListView.start();
	var fontStyle = {
	font: '13pt opensans',
    align: 'center'
	}
    this.optionCount = 1;
	//Elements for main menu container//
    this.logo        = game.make.sprite(game.world.centerX, 200, 'brand');
    this.username    = game.make.text(game.world.width*0.1,55, "????",fontStyle);
    this.username.name = "username";
	this.coin_ico      = game.make.sprite(game.world.width*0.3, 50, 'coin-ico');
	this.coin_text     = game.make.text(game.world.width*0.3+50,55, "0000",fontStyle);
	this.coin_text.name = "coin";
	this.trophy_ico    = game.make.sprite(game.world.width*0.6, 50, 'trophy-ico');
	this.trophy_text   = game.make.text(game.world.width*0.6+50,55, "0000",fontStyle);
      this.trophy_text.name = "trophy";
	this.copyrightText = game.make.text(game.world.centerX, game.world.height-10, "2017 Copyright Reserved @ The Cake Team", {
      font: '11pt opensans',
      fill: '#ABCDEF',
      align: 'center'
    });
    this.copyrightText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.rank_ico      = game.make.sprite(game.world.width*0.9, 50, 'ranking-ico');
	
	//Elements for global ranking container//
	this.rankTitle      = game.make.text(game.world.centerX, 60, "GLOBAL RANKING",fontStyle);
	
	utils.centerGameObjects([this.logo,this.username,this.coin_ico,this.coin_text,this.trophy_ico,this.trophy_text,this.rank_ico,this.copyrightText,this.rankTitle]);
  },

  create: function () {
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
	//Handling background music
    if (music.name !== "MainMenu-1" && gameOptions.playMusic) {
      music.stop();
      music = game.add.audio('MainMenu-1');
      music.loop = true;
      music.play();
    }
	
	//Prevent the game to be stopped when browser is unfocused//
    game.stage.disableVisibilityChange = true;
	
	//this.game.world.setBounds(0, 0, this.game.width, this.game.height);
	
	//Initialize background image//
    this.bg = game.add.tileSprite(0, 0,400,600, 'menu-bg');
	this.bg.alpha = 0;

	//Animating ease in transition//
    game.add.tween(this.bg).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
	
	//Create  multiple container to contains element//
	this.menuContainer = game.add.group();
	this.rankingContainer = game.add.group();
	this.menuContainer.name = "Menu_Container";
    this.rankingContainer.name = "Rank_Container";
	//Adding evey element into the stage//
	this.menuContainer.addMultiple([this.copyrightText,this.username,this.coin_text,this.trophy_text,this.logo,this.coin_ico,this.trophy_ico,this.rank_ico]);
	this.logo.scale.setTo(0.5);
	this.coin_ico.scale.setTo(0.1);
	this.trophy_ico.scale.setTo(0.1);
	this.rank_ico.scale.setTo(0.2);



	this.rankingContainer.addMultiple([this.rankTitle]);
	this.ranking_backBtn = this.addMenuOption('Back', function () {
        this.menuContainer.visible = true;
        this.rankingContainer.visible = false;
    });
	this.ranking_backBtn.y = 500;
	this.rankingContainer.add(this.ranking_backBtn);
	this.rankingContainer.visible = false;
	
	//Adding menu buttons using custom function//
	this.menuContainer.add(this.addMenuOption('Individual Match', function () {
		this.game.add.tween(this.bg).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
		this.game.state.start("IndividualMatch");
	}));
	this.menuContainer.add(this.addMenuOption('Custom Match', function () {
		this.game.state.start("CustomMatch");
	}));

	this.rank_ico.inputEnabled = true;
  	this.rank_ico.events.onInputUp.add(function() {
        this.rankingContainer.visible = true;
        this.menuContainer.visible = false;
  	},this);
    //this.menuContainer.add(this.addMenuOption('Start', function () {game.state.start("Game");}));
    //this.menuContainer.add(this.addMenuOption('Options', function () {game.state.start("Options");}));
    //this.menuContainer.add(this.addMenuOption('Credits', function () {game.state.start("Credits");}));

      game.global.id = getCookie("id");
      game.global.socketID = getCookie("socketID");

	  socket.emit('MENU.Handshake',{id:game.global.id,socketID:game.global.socketID},function () {
          console.log("(✓) Connected to server");
      });

  		socket.emit('PLAYER.getStats',{id:game.global.id,socketID:game.global.socketID},function(data) {
            game.world.forEach(function (children) {
            	if (children.name === "Menu_Container") {
            		children.forEach(function (children2) {
                        if (children2.name === "coin") {
                            console.log(data.coin);
                            children2.setText(String(data.coin));
                            children2.update();
                        } else if (children2.name === "trophy") {
                            children2.setText(String(data.rank));
                            children2.update();
                        } else if (children2.name === "username") {
                            children2.setText(String(data.name));
                            children2.update();
						}
                    });
				} else if (children.name === "Rank_Container") {
                    this.top1 = GameMenu.prototype.createMatchSlot(1,data.name);
                    this.top2 = GameMenu.prototype.createMatchSlot(2,"Micheal");
                    this.top3 = GameMenu.prototype.createMatchSlot(3,"WWWWWWW");
            	    children.addMultiple([this.top1,this.top2,this.top3]);
            	    children.update();
                }

            });
		console.log("(✓) Player details showed");
		  console.log(data);
	  	});

      // socket.emit('SYS_LATENCY', Date.now(), function(startTime) {
      //     var latency = Date.now() - startTime;
      //     console.log(latency);
      // });

	  console.log(this.socketID);
  },
  
  
  update: function() {
	//Animating background//
	this.bg.tilePosition.x += 0.5;

  }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
