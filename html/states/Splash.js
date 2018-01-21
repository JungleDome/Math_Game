var Splash = function () {};

Splash.prototype = {

  loadScripts: function () {
    game.load.script('style', 'lib/style.js');
    game.load.script('mixins', 'lib/mixins.js');
    game.load.script('WebFont', 'vendor/webfontloader.js');
    game.load.script('GameMenu','states/gamemenu.js');
    game.load.script('Login','states/login.js');
    game.load.script('Register','states/register.js');
    game.load.script('Game', 'states/Game.js');
    game.load.script('GameOver','states/gameover.js');
    game.load.script('Credits', 'states/credits.js');
    game.load.script('Options', 'states/options.js');
	game.load.script('IndividualMatch', 'states/GAME_individual.js');
	game.load.script('CustomMatch', 'states/GAME_custom.js');
	game.load.script('Map_FindMe', 'states/maps/findme.js');
	game.load.script('Map_Puzzle', 'states/maps/puzzle.js');
	game.load.script('Map_Riddle', 'states/maps/riddle.js');
	game.load.script('Map_TicTacToe', 'states/maps/tictactoe.js');
  },

  loadBgm: function () {
    // thanks Kevin Macleod at http://incompetech.com/
    game.load.audio('dangerous', 'assets/bgm/Dangerous.mp3');
    game.load.audio('exit', 'assets/bgm/Exit the Premises.mp3');
    game.load.audio('MainMenu-1', 'assets/bgm/Make It Shine By Sophonic (Music).mp3');
  },
  // varios freebies found from google image search
  loadImages: function () {
    game.load.image('menu-bg', 'assets/images/menu-bg(new).png');
    game.load.image('gameover-bg', 'assets/images/gameover-bg.jpg');
	game.load.image('options-bg', 'assets/images/options-bg.jpg');
	game.load.image('coin-ico', 'assets/images/coin.png');
	game.load.image('trophy-ico', 'assets/images/trophy.png');
    game.load.image('ranking-ico', 'assets/images/ranking.png');
	game.load.image('ttc_circle','assets/images/circle.png');
	game.load.image('ttc_cross','assets/images/cross.png');
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['TheMinion','opensans'],
        urls: ['assets/style/theminion.css','assets/style/opensans.css']
      }
    }
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
    this.logo       = game.make.sprite(game.world.centerX, 200, 'brand');
    this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    utils.centerGameObjects([this.logo, this.status]);
    game.stage.disableVisibilityChange = true;
  },

  preload: function () {
    game.add.sprite(0, 0, 'stars');
    game.add.existing(this.logo).scale.setTo(0.5);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();

  },

  addGameStates: function () {

    game.state.add("GameMenu",GameMenu);
    game.state.add("Login",Login);
    game.state.add("Register",Register);
    game.state.add("Game",Game);
	game.state.add("IndividualMatch",IndividualMatch);
	game.state.add("CustomMatch",CustomMatch);
	game.state.add("Map_Puzzle",Map_Puzzle);
	game.state.add("Map_Riddle",Map_Riddle);
	game.state.add("Map_FindMe",Map_FindMe);
	game.state.add("Map_TicTacToe",Map_TicTacToe);
    game.state.add("GameOver",GameOver);
    game.state.add("Credits",Credits);
    game.state.add("Options",Options);
  },

  addGameMusic: function () {
    music = game.add.audio('dangerous');
    music.loop = true;
    music.play();
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      game.state.start("Login");
    }, 1000);
  }
};
