/**
 * Project Name:    Bomberman
 * Project URL:     https://kevinpagtakhan.github.io/bomberman/
 * Description:     This is a game inspired by the original Bomberman developed using JavaScript and Phaser.
 * Version:         1.0.0
 * Author:          Kevin Pagtakhan
 * Author URI:      https://github.com/kevinpagtakhan
 **/

var scoreBoard = document.querySelectorAll(".score"); // get every element with class = score in index.html 

// mainState object functions like main function
var mainState = {
    
    // get/load every game resource like image, audio, etc. in preload function
    preload: function(){
        
        // Map sprites
        game.load.image('ground', 'assets/ground.png');
        game.load.image('grass', 'assets/grass.png');
        game.load.image('wall', 'assets/wall.png');
        game.load.image('brick', 'assets/brick.png');
        game.load.image('blue-flag', 'assets/blue-flag.png');
        game.load.image('red-flag', 'assets/red-flag.png');

        // Weapon sprites
        game.load.image('bomb', 'assets/bomb.png');
        game.load.image('explosion', 'assets/explosion.png');

        // Player sprites
        game.load.image('bomber', 'assets/bomber.png');
        game.load.image('bomber-front', 'assets/bomber-front.png');
        game.load.image('bomber-left', 'assets/bomber-left.png');
        game.load.image('bomber-right', 'assets/bomber-right.png');
        game.load.image('bomber-back', 'assets/bomber-back.png');

        // Button sprites
        game.load.image('next-round', 'assets/next-round.png');
        game.load.image('start-game', 'assets/start-game.png');
        game.load.image('play-again', 'assets/play-again.png');
        
        // Power up sprites
        game.load.image('boots', 'assets/boots.png');
        game.load.image('star', 'assets/star.png');
        
        // Audio clip sprites
        game.load.audio('bomb-sound', 'assets/bomb-sound.wav');
        game.load.audio('power-up', 'assets/power-up.wav');
        game.load.audio('winner', 'assets/winner.wav');
        game.load.audio('intro', 'assets/intro.wav');
        game.load.audio('game-start', 'assets/game-start.wav');
        game.load.audio('round-end', 'assets/round-end.wav');

        game.load.audio('bg-music', 'assets/48-battle.mp3');
    },

    create: function(){
        this.BLOCK_COUNT = 15; // BLOCK_LENGTH
        this.PIXEL_SIZE = GAME_SIZE / this.BLOCK_COUNT; // get PIXEL_SIZE 
        //-> here 600/15 = 40, because every image element has pixel size of 40

        music = game.add.audio('bg-music', 1, true); // get background music
        music.play(); // play background music

        game.stage.backgroundColor = "#49311C"; // not really necessary cause the background is visible for like 0.1 sec
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true; // all sprites created by the game object will have physics body enabled

        // Adds ground to entire map
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
                this.addGround(x, y);
            }
        }

        // Group container of game sprites
        this.grassList = game.add.group();
        this.wallList = game.add.group();
        this.bootList = game.add.group(); // boot for speedUp
        this.starList = game.add.group(); // start for explosion powerUp
        this.brickList = game.add.group();
        this.bombList = game.add.group(); // for player 1
        this.bombList_2 = game.add.group(); // for player 2
        this.flagList = game.add.group(); // add player's flags
        this.addPlayers();
        this.explosionList = game.add.group(); // for player 1
        this.explosionList_2 = game.add.group(); // for player 2


        // Adds walls, bricks and powerups
        this.createMap();

        // Players 1's intial properties
        this.playerSpeed = 150;
        this.playerPower = false;
        this.playerDrop = true;
        // Players 2's intial properties
        this.playerSpeed_2 = 150;
        this.playerPower_2 = false;
        this.playerDrop_2 = true;

        // Creates listeners for player 1's controls
        this.aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // Creates listeners for player 2's controls
        this.cursor = game.input.keyboard.createCursorKeys();
        this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // Creates game feedback message and game message styles which will be used in game.add.text
        this.gameMessage = "";
        this.messageStyle = { font: "60px Arcade", fill: "#FFFFFF", boundsAlignV: "middle", boundsAlignH: "center", align: "center", wordWrapWidth: 600};
        this.infoStyle = { font: "30px Arcade", fill: "#FFFFFF", boundsAlignV: "middle", boundsAlignH: "center", align: "center", wordWrapWidth: 600};

        // Adds audio clips to game
        bombSound = game.add.audio('bomb-sound');
        powerUp = game.add.audio('power-up');
        winner = game.add.audio('winner');
        intro = game.add.audio('intro');
        gameStart = game.add.audio('game-start');
        roundEnd = game.add.audio('round-end');

        // Shows splash screen with game instruction
        if(!gameInPlay){
            this.showRoundWinner(null);
        }
    },

    // game update loop
    update: function(){
        
        // keyboard input handler - player 2
        if (this.cursor.down.isDown || this.cursor.up.isDown || this.cursor.right.isDown || this.cursor.left.isDown){
            if (this.cursor.left.isDown){
                this.player.body.velocity.x = -(this.playerSpeed); // player move left
                this.player.loadTexture('bomber-left', 0); // show player left sprite
            }
            if (this.cursor.right.isDown){
                this.player.body.velocity.x = (this.playerSpeed);
                this.player.loadTexture('bomber-right', 0);
            }
            if (this.cursor.up.isDown){
                this.player.body.velocity.y = -(this.playerSpeed);
                this.player.loadTexture('bomber-back', 0);
            }
            if (this.cursor.down.isDown){
                this.player.body.velocity.y = (this.playerSpeed);
                this.player.loadTexture('bomber-front', 0);
            }
        } else{
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
        }

        if (this.enterKey.justUp){ // if enter key is pressed
            if(gameInPlay) // and if game is running
                this.dropBomb(1); // dropBomb(playerNumber)
        }
        
        // keyboard input handler - player 1
        if (this.aKey.isDown || this.sKey.isDown || this.dKey.isDown || this.wKey.isDown){
            if (this.aKey.isDown){
                this.player_2.body.velocity.x = -(this.playerSpeed_2);
                this.player_2.loadTexture('bomber-left', 0);
                // this.player_2.body.velocity.y = 0;
            }
            if (this.dKey.isDown){
                this.player_2.body.velocity.x = (this.playerSpeed_2);
                this.player_2.loadTexture('bomber-right', 0);
                // this.player_2.body.velocity.y = 0;
            }
            if (this.wKey.isDown){
                this.player_2.body.velocity.y = -(this.playerSpeed_2);
                this.player_2.loadTexture('bomber-back', 0);
                // this.player_2.body.velocity.x = 0;
            }
            if (this.sKey.isDown){
                this.player_2.body.velocity.y = (this.playerSpeed_2);
                this.player_2.loadTexture('bomber-front', 0);
                // this.player_2.body.velocity.x = 0;
            }
        } else{
            this.player_2.body.velocity.x = 0;
            this.player_2.body.velocity.y = 0;
        }

        if (this.spaceKey.justUp){
            if(gameInPlay)
                this.dropBomb(2);
        }

        game.physics.arcade.collide(this.player, this.wallList);
        game.physics.arcade.collide(this.player, this.brickList);

        game.physics.arcade.collide(this.player_2, this.wallList);
        game.physics.arcade.collide(this.player_2, this.brickList);

        game.physics.arcade.overlap(this.player, this.explosionList, function(){this.burn(1);}, null, this);
        game.physics.arcade.overlap(this.player, this.explosionList_2, function(){this.burn(1);}, null, this);

        game.physics.arcade.overlap(this.player_2, this.explosionList_2, function(){this.burn(2);}, null, this);
        game.physics.arcade.overlap(this.player_2, this.explosionList, function(){this.burn(2);}, null, this);

        game.physics.arcade.overlap(this.explosionList, this.flagList.children[0], function(){this.getFlag(1);}, null, this);
        game.physics.arcade.overlap(this.explosionList_2, this.flagList.children[1], function(){this.getFlag(2);}, null, this);

        game.physics.arcade.overlap(this.player, this.bootList, function(){this.speedUp(1);}, null, this);
        game.physics.arcade.overlap(this.player_2, this.bootList, function(){this.speedUp(2);}, null, this);

        game.physics.arcade.overlap(this.player, this.starList, function(){this.starUp(1);}, null, this);
        game.physics.arcade.overlap(this.player_2, this.starList, function(){this.starUp(2);}, null, this);
    },
