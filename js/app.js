document.getElementById('bgm').volume = "0.2";

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed*dt;
    if(this.x > 505){
      this.x = -100;
      this.y = getEnemyPos();
      this.speed = getEnemyVel();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

  this.sprite = localStorage.getItem('sprite');
  this.x = 202;
  this.y = 404;
  this.h = 0;
  this.v = 0;
  this.score = 0;
  this.lives = 3;
};

Player.prototype.update = function(dt) {

  var hmove = this.h*101;
  var vmove = this.v*83;

  this.x += hmove;
  this.y += vmove;

  if(this.x < 0 || this.x > 404)
    this.x -= hmove;
  if(this.y < -83 || this.y > 404){
    this.y -= vmove;
  }
  if(this.y < 0){
      this.score++;
      document.getElementById("score").innerHTML = "Score: "+this.score;
      setTimeout(restart, 10);
  }

  this.v = 0;
  this.h = 0;
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {

  switch (key) {
    case 'up':
        this.v = -1;
        break;
    case 'down':
        this.v = 1;
        break;
    case 'left':
        this.h = -1;
        break;
    case 'right':
        this.h = 1;
        break;
  }
};

var getEnemyVel = function() {
  return Math.floor(Math.random() * 271) + 170;
}

var getEnemyPos = function() {
  return 60 + Math.floor(Math.random() * 3) * 83;
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for(var i=0; i<4; i++){
  allEnemies.push(new Enemy(-100, getEnemyPos(), getEnemyVel()));
}
var player = new Player();

var restart = function() {
    player.x = 202;
    player.y = 404;
}

var intersects = function(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {
  if(a1x > b2x || b1x > a2x)
    return false;
  if(a1y > b2y || b1y > a2y)
    return false;
  return true;
}

var checkCollisions = function() {
  for(var i=0; i<allEnemies.length; i++){
    if(intersects(player.x, player.y, player.x+64, player.y+64, allEnemies[i].x, allEnemies[i].y, allEnemies[i].x+84, allEnemies[i].y+64)){
      player.lives--;
      checkLife();
      document.getElementById("lives").innerHTML = player.lives;
      setTimeout(restart, 10);
      break;
    }
  }
}

var checkLife = function(){
  if(player.lives < 1){
    // Game over
    localStorage.setItem('score', player.score);
    window.location = "gameover.html";
  }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    //setTimeout(player.handleInput(allowedKeys[e.keyCode]), 300);
    player.handleInput(allowedKeys[e.keyCode]);
});
