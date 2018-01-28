var Register = function() {};
Register.buttonFontStyle = {font: '15pt opensans', boundsAlignH: 'center',boundsAlignV:'middle', fill: '#000000',fontWeight:'bold'};

Register.prototype = {

    menuConfig: {
        startY: 260,
        startX: 30
    },

    createButton: function(x,y,text,callback) {
        color = 0x6495ED;
        border = 0x526C8E;
        w = 100;
        h = 50;

        var buttonGroup = game.add.group();
        var buttonText = game.add.text(x,y,text,Register.buttonFontStyle);
        buttonText.setTextBounds(3,3,w,h);
        var sprite = game.add.graphics(x, y);
        sprite.beginFill(color, 1);
        sprite.bounds = new PIXI.Rectangle(0, 0, w, h);
        sprite.drawRoundedRect(0, 0, w, h, 4);
        sprite.beginFill(border, 1);
        sprite.drawRoundedRect(0,h,w,2,2);


        buttonGroup.addMultiple([sprite,buttonText]);
        sprite.inputEnabled = true;
        sprite.events.onInputUp.add(callback,this);
    },

    addMenuOption: function(text, callback) {
        var optionStyle = { font: '30pt opensans', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
        var txt = game.make.text(game.world.centerX, (this.optionCount * 60) + 100, text, optionStyle);
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

    init: function () {
        game.add.plugin(PhaserInput.Plugin);
        var fontStyle = {
            font: '13pt opensans',
            align: 'center'
        };

        //Elements for main menu container//
        this.logo        = game.make.sprite(game.world.centerX, 150, 'brand');
        this.username_lbl     = game.make.text(game.world.width*0.08+50,250, "Username",fontStyle);
        this.username_text     = game.add.inputField(game.world.width*0.7, 250, {
            font: '18px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: 150,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
        });
        this.password_lbl    = game.make.text(game.world.width*0.2, 330, "Password",fontStyle);
        this.password_text    = game.add.inputField(game.world.width*0.7, 330 ,{
            font: '18px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: 150,
            padding: 8,
            borderWidth: 0,
            borderColor: '#000',
            borderRadius: 6,
            type: PhaserInput.InputType.password
        });
        this.copyrightText = game.make.text(game.world.centerX, game.world.height-10, "2017 Copyright Reserved @ The Cake Team", {
            font: '11pt opensans',
            fill: '#ABCDEF',
            align: 'center'
        });
        this.copyrightText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

        utils.centerGameObjects([this.logo,this.username_lbl,this.username_text,this.password_lbl,this.password_text,this.copyrightText]);
    },

    create: function () {

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

        //Adding evey element into the stage//
        this.menuContainer.addMultiple([this.logo]);
        this.menuContainer.add(this.username_lbl);
        this.menuContainer.add(this.username_text);
        this.menuContainer.add(this.password_lbl);
        this.menuContainer.add(this.password_text);
        this.menuContainer.add(this.copyrightText);
        this.logo.scale.setTo(0.7);

        this.register_btn  = this.createButton(230,400,"Register",function() {
            socket.emit('PLAYER.register',{username:this.username_text.value,password:this.password_text.value});
        });
        this.back_btn  = this.createButton(60,400,"Back",function() {
            game.state.start("Login");
        });


        socket.on('PLAYER.registerSuccess',function() {
            game.state.start("Login");
        });

        socket.on('PLAYER.registerFailed',function() {
            alert('Failed to register');
        });
    },


    update: function() {
        //Animating background//
        this.bg.tilePosition.x += 0.5;

    }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);