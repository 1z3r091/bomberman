/**
 * Project Name:    Bomberman
 * Project URL:     https://kevinpagtakhan.github.io/bomberman/
 * Description:     This is a game inspired by the original Bomberman developed using JavaScript and Phaser.
 * Version:         1.0.0
 * Author:          Kevin Pagtakhan
 * Author URI:      https://github.com/kevinpagtakhan
 **/

var MAX_SPEED = 350;
var MAX_LIFE = 3;
var MAX_PLAYER = 3 ;

var scoreBoard = document.querySelectorAll(".score"); // get every element with class = score in index.html 
var lives = document.querySelectorAll(".lives");

var players = [];

var Player = function(x, y, speed, power, drop) {
    this.player = game.add.sprite(x, y, 'bomber');
    this.player.scale.setTo(0.8, 0.8);
    game.physics.arcade.enable(this.player);
    
    this.playerSpeed = speed;
    this.playerPower = power;
    this.playerDrop = drop;
};

// mainState object functions like main function
var mainState = {


    // get/load every game resource like image, audio, etc. in preload function
    preload: function () {

        // Map sprites
        game.load.image('ground', 'assets/ground.png');
        game.load.image('grass', 'assets/grass.png');
        game.load.image('wall', 'assets/wall.png');
        game.load.image('brick', 'assets/brick.png');
        game.load.image('blue-flag', 'assets/blue-flag.png');
        game.load.image('red-flag', 'assets/red-flag.png');

        // Weapon sprites
        game.load.image('bomb', 'assets/bomb.png');
        game.load.image('bomb2', '/assets/bomb2.png');
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

    create: function () {
        this.BLOCK_COUNT = 11; // BLOCK_LENGTH
        this.PIXEL_SIZE = GAME_SIZE / this.BLOCK_COUNT; // get PIXEL_SIZE 
        //-> here 600/15 = 40, because every image element has pixel size of 40

        music = game.add.audio('bg-music', 1, true); // get background music
        music.play(); // play background music

        game.stage.backgroundColor = "#49311C"; // not really necessary cause the background is visible for like 0.1 sec
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true; // all sprites created by the game object will have physics body enabled

        // Adds ground to entire map
        for (var x = 0; x < this.BLOCK_COUNT; x++) {
            for (var y = 0; y < this.BLOCK_COUNT; y++) {
                this.addGround(x, y);
            }
        }

        // Group container of game sprites
        this.grassList = game.add.group();
        this.wallList = game.add.group();
        this.bootList = game.add.group(); // boot for speedUp
        this.starList = game.add.group(); // star for explosion powerUp
        this.bombItemList = game.add.group();
        this.brickList = game.add.group();
        this.bombList = game.add.group(); // for player 1
        this.bombList_2 = game.add.group(); // for player 2
        this.flagList = game.add.group(); // add player's flags
        this.addPlayers();
        this.explosionList = game.add.group(); // for player 1
        this.explosionList_2 = game.add.group(); // for player 2

        // set player lives
        this.setLife();
        
        // Adds walls, bricks and powerups
        this.createMap();

//        // Players 1's intial properties
//        this.playerSpeed = 150;
//        this.playerPower = 0;
//        this.playerDrop = true;
//        // Players 2's intial properties
//        this.playerSpeed_2 = 150;
//        this.playerPower_2 = 0;
//        this.playerDrop_2 = true;

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
        this.messageStyle = {
            font: "60px Arcade",
            fill: "#FFFFFF",
            boundsAlignV: "middle",
            boundsAlignH: "center",
            align: "center",
            wordWrapWidth: 600
        };
        this.infoStyle = {
            font: "30px Arcade",
            fill: "#FFFFFF",
            boundsAlignV: "middle",
            boundsAlignH: "center",
            align: "center",
            wordWrapWidth: 600
        };

        // Adds audio clips to game
        bombSound = game.add.audio('bomb-sound');
        powerUp = game.add.audio('power-up');
        winner = game.add.audio('winner');
        intro = game.add.audio('intro');
        gameStart = game.add.audio('game-start');
        roundEnd = game.add.audio('round-end');

        // Shows splash screen with game instruction
        if (!gameInPlay) {
            this.showRoundWinner(null);
        }
    },

    // game update loop
    update: function () {
        for (var i = 0; i < MAX_PLAYER; i++) {
            var life = Number(lives[i].innerText);
            //if (life > 0 && 
        }
        // keyboard input handler - player 2
        if (this.cursor.down.isDown || this.cursor.up.isDown || this.cursor.right.isDown || this.cursor.left.isDown) {
            if (this.cursor.left.isDown) {
                players[0].player.body.velocity.x = -(players[0].playerSpeed); // player move left
                players[0].player.loadTexture('bomber-left', 0); // show player left sprite
            }
            if (this.cursor.right.isDown) {
                players[0].player.body.velocity.x = (players[0].playerSpeed);
                players[0].player.loadTexture('bomber-right', 0);
            }
            if (this.cursor.up.isDown) {
                players[0].player.body.velocity.y = -(players[0].playerSpeed);
                players[0].player.loadTexture('bomber-back', 0);
            }
            if (this.cursor.down.isDown) {
                players[0].player.body.velocity.y = (players[0].playerSpeed);
                players[0].player.loadTexture('bomber-front', 0);
            }
        } else {
            players[0].player.body.velocity.x = 0;
            players[0].player.body.velocity.y = 0;
        }

        if (this.enterKey.justUp) { // if enter key is pressed
            if (gameInPlay) // and if game is running
                this.dropBomb(1); // dropBomb(playerNumber)
        }

        // keyboard input handler - player 1
        if (this.aKey.isDown || this.sKey.isDown || this.dKey.isDown || this.wKey.isDown) {
            if (this.aKey.isDown) {
                players[1].player.body.velocity.x = -(players[1].playerSpeed);
                players[1].player.loadTexture('bomber-left', 0);
                // players[1].player.body.velocity.y = 0;
            }
            if (this.dKey.isDown) {
                players[1].player.body.velocity.x = (players[1].playerSpeed);
                players[1].player.loadTexture('bomber-right', 0);
                // players[1].player.body.velocity.y = 0;
            }
            if (this.wKey.isDown) {
                players[1].player.body.velocity.y = -(players[1].playerSpeed);
                players[1].player.loadTexture('bomber-back', 0);
                // players[1].player.body.velocity.x = 0;
            }
            if (this.sKey.isDown) {
                players[1].player.body.velocity.y = (players[1].playerSpeed);
                players[1].player.loadTexture('bomber-front', 0);
                // players[1].player.body.velocity.x = 0;
            }
        } else {
            players[1].player.body.velocity.x = 0;
            players[1].player.body.velocity.y = 0;
        }

        if (this.spaceKey.justUp) {
            if (gameInPlay)
                this.dropBomb(2);
        }

        game.physics.arcade.collide(players[0].player, this.wallList);
        game.physics.arcade.collide(players[0].player, this.brickList);

        game.physics.arcade.collide(players[1].player, this.wallList);
        game.physics.arcade.collide(players[1].player, this.brickList);

        game.physics.arcade.overlap(players[0].player, this.explosionList, function () {
            this.burn(1);
        }, null, this);
        game.physics.arcade.overlap(players[0].player, this.explosionList_2, function () {
            this.burn(1);
        }, null, this);

        game.physics.arcade.overlap(players[1].player, this.explosionList_2, function () {
            this.burn(2);
        }, null, this);
        game.physics.arcade.overlap(players[1].player, this.explosionList, function () {
            this.burn(2);
        }, null, this);

        game.physics.arcade.overlap(this.explosionList, this.flagList.children[0], function () {
            this.getFlag(1);
        }, null, this);
        game.physics.arcade.overlap(this.explosionList_2, this.flagList.children[1], function () {
            this.getFlag(2);
        }, null, this);

        game.physics.arcade.overlap(players[0].player, this.bootList,function (player, item) {
            this.speedUp(player, item , 1)
        }, null, this);
        game.physics.arcade.overlap(players[1].player, this.bootList, function (player, item) {
            this.speedUp(player, item, 2)
        }, null, this);
        
        game.physics.arcade.overlap(players[0].player, this.bombItemList,function (player, item) {
            this.bombUp(player, item , 1)
        }, null, this);
        game.physics.arcade.overlap(players[1].player, this.bombItemList, function (player, item) {
            this.bombUp(player, item, 2)
        }, null, this);

//        game.physics.arcade.overlap(players[0].player, this.starList, function () {
//            this.starUp(1);
//        }, null, this);
//        game.physics.arcade.overlap(players[1].player, this.starList, function () {
//            this.starUp(2);
//        }, null, this);
    },

    createMap: function () {
        for (var x = 0; x < this.BLOCK_COUNT; x++) {
            for (var y = 0; y < this.BLOCK_COUNT; y++) {

                // this if statement is not necessary
                // because the flag positions are defined in the functions
                if (x == 1 && x == y) {
                    this.addBlueFlag();
                    this.addRedFlag();
                }

                // if you change the game size,
                // you need to expand the walls here too
                if (x === 0 || y === 0 || x == this.BLOCK_COUNT - 1 || y == this.BLOCK_COUNT - 1) {
                    this.addWall(x, y);
                }

                // if x and y are even numbers, create walls
                // you can make a new map changing the position of the walls here
                else if (x % 2 === 0 && y % 2 === 0) {
                    this.addWall(x, y);
                }

                // fill the player start position with grass with 3x3 size
                else if (x < 4 && y < 4 || x < 4 && y > 6 || x > 6 && y > 6 || x > 6 && y < 4) {
                    //this.addGrass(x, y);
                }

                // fill the rest ground randomly with bricks
                else {

                    // add bricks -> need to be changed if players are added
                    if (Math.floor(Math.random() * 10)) {
                        this.addBrick(x, y);

                        // add speedUp and powerUp items randomly
                        if (Math.floor(Math.random() * 10.02)) {
                            this.addBoots(x, y);
                        }
                        if (Math.floor(Math.random() * 1.02)) {
                            this.addBomb(x, y);
                        }
                    }

                    // fill the unfilled grounds with grass
                    else {
                        this.addGrass(x, y);
                    }
                }
            }
        }
    },

    setLife: function () {
        for (var i = 0; i < lives.length; i++) {
            var life = Number(lives[i].innerText);
            lives[i].innerText = MAX_LIFE;
        }
    },

    // if player overlap with explosion
    burn: function (player) {
        if (player == 1) { // if player 1 is hit
            players[0].player.kill(); // kill sprite
        } else {
            players[1].player.kill();
        }

        if (gameInPlay) {
            var score = Number(scoreBoard[player - 1].innerText); // change scoreBoard string into number
            //scoreBoard[player - 1].innerText = score + 1; // increase score
            
            var life = Number(lives[player - 1].innerText);
            lives[player - 1].innerText = life - 1;
            // if score reached 5, show who win the game
            if (score + 1 === 5) {
                this.showGameWinner(player);
                winner.play();
            }

            // else show who win the round
            //else {
            //    this.showRoundWinner(player);
            //    roundEnd.play();
            //}
        }

        //gameInPlay = false;
    },

    // if player overlap with enemy's flag
    getFlag: function (player) {

        if (gameInPlay) {
            var score = Number(scoreBoard[player - 1].innerText);
            scoreBoard[player - 1].innerText = score + 1;

            if (score + 1 === 5) {
                this.showGameWinner(player);
            } else {
                this.showRoundWinner(player);
            }
        }

        gameInPlay = false;
    },

    // if player overlap with speedUp item(=boot)
    speedUp: function (player, item, id) {
        powerUp.play();
        
        if (players[id - 1].playerSpeed < MAX_SPEED)
            players[id - 1].playerSpeed += 200;
//        if (player == 1 && this.playerSpeed < SPEED_LIMIT) {
//            this.playerSpeed = 350;
//        } else {
//            this.playerSpeed_2 = 350;
//        }
        
        item.kill();
//        this.bootList.forEach(function (element) {
//            element.kill(); // kill boot sprite
//        });
    },

    addBoots: function (x, y) {
        var boots = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'boots');
        game.physics.arcade.enable(boots);
        boots.body.immovable = true;
        this.bootList.add(boots);
    },

    // if player overlap with star
    bombUp : function (player, item, id) {
         powerUp.play();

        //if (player == 1) {
            players[id - 1].playerPower += 1;
        //} else {
        //    this.playerPower_2 += 1;
        //}
        item.kill();
        //this.bombItemList.forEach(function (element) {
        //    element.kill();
        //});
    },
    
    starUp: function (player) {
//        powerUp.play();
//
//        if (player == 1) {
//            this.playerPower += 1;
//        } else {
//            this.playerPower_2 += 1;
//        }
//
//        this.starList.forEach(function (element) {
//            element.kill();
//        });
    },

    addBomb: function (x, y) {
        var bomb2 = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'bomb2');
        game.physics.arcade.enable(bomb2);
        bomb2.body.immovable = true;
        this.bombItemList.add(bomb2);
    },
    addStar: function (x, y) {
        var star = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'star');
        game.physics.arcade.enable(star);
        star.body.immovable = true;
        this.starList.add(star);
    },

    // add all players in create function
    addPlayers: function () {
        var newPlayer = new Player(GAME_SIZE - 2 * this.PIXEL_SIZE, GAME_SIZE - 2 * this.PIXEL_SIZE, 150, 0, true);
        players[0] = newPlayer;
        
//        this.player = game.add.sprite(GAME_SIZE - 2 * this.PIXEL_SIZE, GAME_SIZE - 2 * this.PIXEL_SIZE, 'bomber');
//        this.player.scale.setTo(0.8, 0.8);
//        game.physics.arcade.enable(this.player);

        newPlayer = new Player(this.PIXEL_SIZE, this.PIXEL_SIZE, 150, 0, true);
        players[1] = newPlayer;
        //players[1].player = game.add.sprite(this.PIXEL_SIZE, this.PIXEL_SIZE, 'bomber');
        
        //players[1].player.scale.setTo(0.8, 0.8);
        //game.physics.arcade.enable(players[1].player);
        newPlayer = new Player(this.PIXEL_SIZE, GAME_SIZE - 2 * this.PIXEL_SIZE, 150, 0, true);
        players[2] = newPlayer;
        
        
//        players[2].scale.setTo(0.8, 0.8);
//        game.physics.arcade.enable(players[1].player);

    },

    addBlueFlag: function () {
        var blueFlag = game.add.sprite(1 * this.PIXEL_SIZE, 1 * this.PIXEL_SIZE, 'blue-flag');
        game.physics.arcade.enable(blueFlag);
        blueFlag.body.immovable = true;
        this.flagList.add(blueFlag);

    },

    addRedFlag: function () {
        var redFlag = game.add.sprite((this.BLOCK_COUNT - 2) * this.PIXEL_SIZE, (this.BLOCK_COUNT - 2) * this.PIXEL_SIZE, 'red-flag');
        game.physics.arcade.enable(redFlag);
        redFlag.body.immovable = true;
        this.flagList.add(redFlag);

    },

    addWall: function (x, y) {
        var wall = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'wall');
        game.physics.arcade.enable(wall);
        wall.body.immovable = true;
        this.wallList.add(wall);

    },

    addBrick: function (x, y) {
        var brick = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'brick');
        game.physics.arcade.enable(brick);
        brick.body.immovable = true;
        this.brickList.add(brick);

    },

    addGrass: function (x, y) {
        var grass = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'grass');
        game.physics.arcade.enable(grass);
        grass.body.immovable = true;
        this.grassList.add(grass);

    },

    // bomb explosion
    detonateBomb: function (player, x, y, explosionList, wallList, brickList) {
        bombSound.play();

        // explosion power upgrade is limited -> need to be changed
        var fire = [
            game.add.sprite(x, y, 'explosion'),
            game.add.sprite(x, y + 40, 'explosion'),
            game.add.sprite(x, y - 40, 'explosion'),
            game.add.sprite(x + 40, y, 'explosion'),
            game.add.sprite(x - 40, y, 'explosion')
        ];
        if (player == 1 && players[0].playerPower) {
            for (var i = 1; i <= players[0].playerPower; i++) {
            fire.push(game.add.sprite(x, y + 40 + (40 * i), 'explosion'));
            fire.push(game.add.sprite(x, y - 40 - (40 * i), 'explosion'));
            fire.push(game.add.sprite(x + 40 + (40 * i), y, 'explosion'));
            fire.push(game.add.sprite(x - 40 - (40 * i), y, 'explosion'));
            }
        } else if (player == 2 && mainState.playerPower_2) {
            fire.push(game.add.sprite(x, y + 80, 'explosion'));
            fire.push(game.add.sprite(x, y - 80, 'explosion'));
            fire.push(game.add.sprite(x + 80, y, 'explosion'));
            fire.push(game.add.sprite(x - 80, y, 'explosion'));

        }

        for (var i = 0; i < fire.length; i++) {
            fire[i].body.immovable = true;
            explosionList.add(fire[i]);
        }

        for (i = 0; i < fire.length; i++) {
            // if explosion overlap with wall
            if (game.physics.arcade.overlap(fire[i], wallList)) {
                fire[i].kill();

                // if explosion power is upgraded
                if (i > 0 && fire[i + 4] !== undefined) {
                    fire[i + 4].kill(); // kill explosion, otherwise the explosion will reach through the wall
                }
            }
        }

        setTimeout(function () {
            explosionList.forEach(function (element) {
                element.kill();
            });

            // if explosion and brick position is equal
            // create new array temp with brick position
            var temp = brickList.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (element.x == fire[i].x && element.y == fire[i].y) {
                        return true;
                    }
                }
                return false;
            });

            // kill bricks overlapped with explosion
            temp.list.forEach(function (element) {
                element.kill();
            });
        }, 1000); // time for showing explosion 
    },

    dropBomb: function (player) {
        var self = this;
        var gridX;
        var gridY;
        var bomb;
        var detonateBomb;
        var explosionList;
        var wallList;
        var brickList;

        if (player == 1 && players[0].playerDrop) {
            players[0].playerDrop = false;
            gridX = players[0].player.x - players[0].player.x % 40; // bomb x-coordinate
            gridY = players[0].player.y - players[0].player.y % 40; // bomb y-coordinate

            bomb = game.add.sprite(gridX, gridY, 'bomb');
            game.physics.arcade.enable(bomb);
            bomb.body.immovable = true;
            this.bombList.add(bomb);

            // why can't we just using these by calling this.xy?
            // https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback

            detonateBomb = this.detonateBomb;
            explosionList = this.explosionList;
            wallList = this.wallList;
            brickList = this.brickList;

            setTimeout(function () {
                bomb.kill();
                self.detonateBomb(player, bomb.x, bomb.y, explosionList, wallList, brickList);
                mainState.enablePlayerBomb(1);
            }, 2000); // time count before explosion

            //setTimeout(this.thisEnableBomb, 2000);

        } else if (player == 2 && players[1].playerDrop) {
            players[1].playerDrop = false;
            gridX = players[1].player.x - players[1].player.x % 40;
            gridY = players[1].player.y - players[1].player.y % 40;

            bomb = game.add.sprite(gridX, gridY, 'bomb');
            game.physics.arcade.enable(bomb);
            bomb.body.immovable = true;
            this.bombList_2.add(bomb);

            detonateBomb = this.detonateBomb;
            explosionList_2 = this.explosionList_2;
            wallList = this.wallList;
            brickList = this.brickList;

            setTimeout(function () {
                bomb.kill();
                detonateBomb(player, bomb.x, bomb.y, explosionList_2, wallList, brickList);
                mainState.enablePlayerBomb(2);
            }, 2000);

        }

    },

    enablePlayerBomb: function (player) {
        players[player - 1].playerDrop = true;
//        if (player == 1) {
//            this.playerDrop = true;
//        } else {
//            this.playerDrop_2 = true;
//        }

    },

    addGround: function (x, y) {
        var wall = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'ground');
        wall.body.immovable = true;

    },

    showRoundWinner: function (player) {

        if (player !== null) {
            this.gameMessage = game.add.text(0, 0, "PLAYER " + player + " WINS", this.messageStyle);
            this.gameMessage.setTextBounds(0, 0, GAME_SIZE, GAME_SIZE - 40);
            this.button = game.add.button(GAME_SIZE - 290, GAME_SIZE - 130, 'next-round');
        } else {
            intro.play();
            this.background = game.add.tileSprite(GAME_SIZE - 400, GAME_SIZE - 400, GAME_SIZE - 80, GAME_SIZE - 80, 'grass');
            var introString = "LET'S PLAY BOMBERMAN" + "\n";
            introString += "Take control " + "\n";
            introString += "of you opponents base." + "\n";
            introString += "Drop bombs" + "\n";
            introString += "through the field." + "\n";

            this.gameMessage = game.add.text(0, 0, introString, this.infoStyle);
            this.gameMessage.setTextBounds(0, 0, GAME_SIZE, GAME_SIZE - 40);
            this.button = game.add.button(GAME_SIZE - 290, GAME_SIZE - 130, 'start-game');
        }

        this.button.onInputUp.add(this.restartGame, this);
    },

    showGameWinner: function (player) {

        this.gameMessage = game.add.text(0, 0, "GAME OVER!\nPLAYER " + player + " WINS", this.messageStyle);
        this.gameMessage.setTextBounds(0, 0, GAME_SIZE, GAME_SIZE - 40);
        this.button = game.add.button(GAME_SIZE - 290, GAME_SIZE - 130, 'play-again');

        this.button.onInputUp.add(function () {
            scoreBoard[0].innerText = 0;
            scoreBoard[1].innerText = 0;
            this.restartGame();
        }, this);
    },

    // initial start & restart
    restartGame: function () {
        gameInPlay = true;
        music.stop();
        gameStart.play();
        game.state.start('main');
    }

};

var GAME_SIZE = 440;
var gameInPlay = false;
var game = new Phaser.Game(GAME_SIZE, GAME_SIZE);
game.state.add('main', mainState);
game.state.start('main');
