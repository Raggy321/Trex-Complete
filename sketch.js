var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle3, obstacle4

var score;

var gameOverImg, restartImg
var jumpSound, checkPointSound, dieSound

var sunIMG, sun;

function preload() {
  trex_running = loadAnimation("trex_1.png", "trex_2.png", "trex_3.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  sunIMG = loadImage("sun.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);


  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.2;

  sun = createSprite(width - 100, 60)
  sun.addImage(sunIMG)
  sun.scale = 0.1

  ground = createSprite(width / 2, height / 2, width+100,50);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.scale = 1.5

  gameOver = createSprite(width/2, height/2-200);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width/2, height/2-100  );
  restart.addImage(restartImg);

  gameOver.scale = 1;
  restart.scale = 1;

  invisibleGround = createSprite(width / 2, height / 2 -45, width, 10);
  invisibleGround.visible = false;

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  console.log("Hello" + 5);

  trex.setCollider("rectangle", 0, 0, 400,180);
  trex.debug = true

  score = 0;

}

function draw() {
  background(180);
  //displaying score
  textSize(30)
  text("Score: " + score, width/1.3, 50);

  if (score % 100 == 0) {
    checkPointSound.play()
  }




  if (gameState === PLAY) {
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -4;
    //scoring
    score = score + Math.round(frameCount / 60);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //jump when the space key is pressed
    if (touches.length>0||keyDown("space") && trex.y >= (height/2) -100) {
      trex.velocityY = -16;
      jumpSound.play()
    }



    //add gravity
    trex.velocityY = trex.velocityY + 0.8

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play()
      //trex.velocityY = -12
    }
  }
  else if (gameState === END) {

    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    trex.velocityY = 0

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    obstaclesGroup.destroyEach();

    if (mousePressedOver(restart)) {
      reset()
    }
  }


  //stop trex from falling down
  trex.collide(invisibleGround);



  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(width+500, invisibleGround.y-20, 10, 40);
    obstacle.velocityX = -6;
obstacle.debug = true
    obstacle.setCollider("rectangle",0,0,450,150)
    //generate random obstacles
    var rand = Math.round(random(3,4));
    switch (rand) {
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 380;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(width + 50, 100, 40, 10);
    cloud.y = Math.round(random(100, 200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 400;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adding cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset() {
  gameState = PLAY
  score = 0
  obstaclesGroup.destroyEach()
  trex.changeAnimation("running", trex_running);
  cloudsGroup.destroyEach()
}

