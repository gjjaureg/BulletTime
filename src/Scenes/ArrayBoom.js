class ArrayBoom extends Phaser.Scene {
    constructor() {
        super("arrayBoom");

        // Initialize a class variable "my" which is an object.
        // The object has two properties, both of which are objects
        //  - "sprite" holds bindings (pointers) to created sprites
        //  - "text"   holds bindings to created bitmap text objects
        this.my = {sprite: {}, text: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 10;           // Don't create more than this many bullets
        this.my.sprite.laser = [];
        this.myScore = 0;       // record a score as a class variable
        // More typically want to use a global variable for score, since
        // it will be used across multiple scenes
        this.playerHealth = 10;

        this.counter = 0
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("elephant", "elephant.png");
        this.load.image("heart", "laserRed12.png");
        this.load.image("hippo", "shipBlue_manned.png");
        this.load.image("alien", "shipGreen_manned.png");
        this.load.image("laser", "laserBlue3.png");

        // For animation
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        // Sound asset from the Kenny Music Jingles pack
        // https://kenney.nl/assets/music-jingles
        this.load.audio("dadada", "jingles_NES13.ogg");
    }

    create() {
        let my = this.my;

        my.sprite.elephant = this.add.sprite(game.config.width/2, game.config.height - 40, "elephant");
        my.sprite.elephant.setScale(0.25);

        my.sprite.hippo = this.add.sprite(game.config.width/2, 80, "hippo");
        my.sprite.hippo.setScale(0.5);
        my.sprite.hippo.scorePoints = 25;

        my.sprite.hippo2 = this.add.sprite(game.config.width/2, 80, "hippo");
        my.sprite.hippo2.setScale(0.5);
        my.sprite.hippo2.scorePoints = 25;

        my.sprite.alien = this.add.sprite(game.config.width/2, 80, "alien");
        my.sprite.alien.setScale(0.5);
        my.sprite.alien.scorePoints = 10;

        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presses

        // Create white puff animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 5,
            hideOnComplete: true
        });

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 5;
        this.laserSpeed = 3;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Array Boom.js</h2><br>A: left // D: right // Space: fire/emit // S: Next Scene'

        // Put score on screen
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);

        my.text.health = this.add.bitmapText(200, 0, "rocketSquare", "Health " + this.playerHealth);
        // Put title on screen
        this.add.text(10, 5, "Fire Laser's!", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });

    }

    update() {
        let my = this.my;

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.elephant.x > (my.sprite.elephant.displayWidth/2)) {
                my.sprite.elephant.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.elephant.x < (game.config.width - (my.sprite.elephant.displayWidth/2))) {
                my.sprite.elephant.x += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.elephant.x, my.sprite.elephant.y-(my.sprite.elephant.displayHeight/2), "heart")
                );
            }
        }

        this.counter++;

        if (this.counter % 100 == 0) {
            my.sprite.laser.push(this.add.sprite(
                my.sprite.hippo.x, my.sprite.hippo.y-(my.sprite.hippo.displayHeight/4), "laser")
            );
        };

        if (this.counter % 100 == 0) {
            my.sprite.laser.push(this.add.sprite(
                my.sprite.hippo2.x, my.sprite.hippo2.y-(my.sprite.hippo2.displayHeight/4), "laser")
            );
        };

        if (my.sprite.alien.x < my.sprite.elephant.x){
            my.sprite.alien.x += 3
        }
        else {
            my.sprite.alien.x -= 3
        }

        console.log(my.sprite.laser.length)

        my.sprite.alien.y += 3
        // Remove all of the bullets which are offscreen
        // filter() goes through all of the elements of the array, and
        // only returns those which **pass** the provided test (conditional)
        // In this case, the condition is, is the y value of the bullet
        // greater than zero minus half the display height of the bullet? 
        // (i.e., is the bullet fully offscreen to the top?)
        // We store the array returned from filter() back into the bullet
        // array, overwriting it. 
        // This does have the impact of re-creating the bullet array on every 
        // update() call. 
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        my.sprite.laser = my.sprite.laser.filter((laser) => laser.y > -(laser.displayHeight/2));

        // Check for collision with the hippo
        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.hippo, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.hippo.x, my.sprite.hippo.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.hippo.visible = false;
                my.sprite.hippo.x = -100;
                // Update score
                this.myScore += my.sprite.hippo.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("dadada", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                // Have new hippo appear after end of animation
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.hippo.visible = true;
                    this.my.sprite.hippo.x = Math.random()*config.width;
                }, this);

            }
        }

        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.hippo2, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.hippo2.x, my.sprite.hippo2.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.hippo2.visible = false;
                my.sprite.hippo2.x = -100;
                // Update score
                this.myScore += my.sprite.hippo2.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("dadada", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                // Have new hippo appear after end of animation
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.hippo2.visible = true;
                    this.my.sprite.hippo2.x = Math.random()*config.width;
                }, this);

            }
        }

        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.alien, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.alien.x, my.sprite.alien.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.alien.visible = false;
                my.sprite.alien.x = -100;
                // Update score
                this.myScore += my.sprite.alien.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("dadada", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                // Have new hippo appear after end of animation
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.alien.visible = true;
                    this.my.sprite.alien.x = Math.random()*config.width;
                    this.my.sprite.alien.y = 80;
                }, this);

            }
        }

        for (let laser of my.sprite.laser) {
            if (this.collides(my.sprite.elephant, laser)) {
                // start animation
                
                // clear out bullet -- put y offscreen, will get reaped next update
                laser.y = -100;
                
                // Update score
                this.playerHealth -= 1;
                this.updateHealth();
                // Play sound
                this.sound.play("dadada", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });

            }
        }

        
        if (this.collides(my.sprite.elephant, my.sprite.alien)) {
                // start animation
            this.puff = this.add.sprite(my.sprite.elephant.x, my.sprite.elephant.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                
            my.sprite.alien.visible = false;

            my.sprite.alien.x = -100;
                // Update score
            this.playerHealth -= 1;
            this.updateHealth();
                // Play sound
            this.sound.play("dadada", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });
            this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.my.sprite.alien.visible = true;
                this.my.sprite.alien.x = Math.random()*config.width;
                this.my.sprite.alien.y = 80;
            }, this);
        }
        
       
        if (my.sprite.alien.y >= my.sprite.elephant.y + 5){
            this.my.sprite.alien.y = 80;
        }

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }
        for (let laser of my.sprite.laser){
            laser.y += this.laserSpeed;
        }
        if (this.playerHealth <= 0) {
            this.scene.start("fixedArrayBullet");
        }

    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }
    updateHealth(){
        let my = this.my
        my.text.health.setText("Health " + this.playerHealth);
    }

}
    