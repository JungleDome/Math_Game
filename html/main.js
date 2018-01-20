// Global Variables
var game = new Phaser.Game(400, 600, Phaser.CANVAS, 'game');

game.global = {
    playSound: true,
    playMusic: true,
    fontStyle: {font: '13pt opensans', align: 'center', boundsAlignH: 'center',boundsAlignV:'middle'},
    scoreFontStyle: {font: '18pt opensans', align: 'center', boundsAlignH: 'center',boundsAlignV:'middle', fontWeight: 'bold'},
    id: null,
    socketID: 111
}
;

Main = function () {};
Main.prototype = {
  preload: function () {
    game.load.image('stars',    'assets/images/splash.jpg');
    game.load.image('loading',  'assets/images/loading.png');
    game.load.image('brand',    'assets/images/logo.png');
    game.load.script('polyfill',   'lib/polyfill.js');
    game.load.script('utils',   'lib/utils.js');
    game.load.script('splash',  'states/Splash.js');
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

};

game.state.add('Main', Main);
game.state.start('Main');
