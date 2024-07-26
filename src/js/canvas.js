// Importing image assets
import platform from '../img/platform.png';
import hills from '../img/hills.png';
import background from '../img/background.png';
import platformSmallTall from '../img/platformSmallTall.png';
import spriteRunLeft from '../img/spriteRunLeft.png';
import spriteRunRight from '../img/spriteRunRight.png';
import spriteStandLeft from '../img/spriteStandLeft.png';
import spriteStandRight from '../img/spriteStandRight.png';

// Selecting the canvas element from the DOM
const canvas = document.querySelector('canvas');
// Getting the 2D rendering context for the canvas
const c = canvas.getContext("2d");

// Setting the canvas dimensions
canvas.width = 1024;
canvas.height = 576;

// Defining the gravity constant
const gravity = 1.5;

// Player class definition
class Player {
  constructor() {
    // Setting the player speed
    this.speed = 10;
    // Initial position of the player
    this.position = {
      x: 100,
      y: 100
    };
    // Initial velocity of the player
    this.velocity = {
      x: 0,
      y: 0
    };
    // Player dimensions
    this.width = 66;
    this.height = 150;

    // Loading the initial sprite image
    this.image = createImage(spriteStandRight);
    // Frame counter for sprite animation
    this.frames = 0;
    // Defining all sprite states and their properties
    this.sprites = {
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft),
        cropWidth: 177,
        width: 66
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875
      }
    };
    // Setting the current sprite and its properties
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  // Draw method to render the player sprite
  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  // Update method to handle player position, velocity, and animation frames
  update() {
    // Incrementing the frame counter
    this.frames++;
    // Resetting frames for standing sprites
    if (
      (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left) &&
      this.frames > 59
    ) {
      this.frames = 0;
      // Resetting frames for running sprites
    } else if (
      (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left) &&
      this.frames > 29
    ) {
      this.frames = 0;
    }


    // Drawing the player sprite
    this.draw();

    // Updating player position based on velocity
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    // Applying gravity if player is above the bottom of the canvas
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

// Platform class definition
class Platform {
  constructor({ x, y, image }) {
    // Setting the platform position
    this.position = {
      x,
      y
    };
    // Loading the platform image
    this.image = image;
    // Setting platform dimensions
    this.width = image.width;
    this.height = image.height;
  }
  // Draw method to render the platform
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}


// GenericObject class definition for background elements
class GenericObject {
  constructor({ x, y, image }) {
    // Setting the object's position
    this.position = {
      x,
      y
    };
    // Loading the object's image
    this.image = image;
    // Setting object dimensions
    this.width = image.width;
    this.height = image.height;
  }
  // Draw method to render the object
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

// Function to create and return a new Image object
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

// Variables to hold platform images
let platformImage = createImage(platform);
let platformSmallTallImage = createImage(platformSmallTall);
// Creating a new player instance
let player = new Player();

// Array to hold platform objects
let platforms = [];

// Array to hold generic objects (background elements)
let genericObject = [];

// Variable to track the current key being pressed
let currentKey;

// Object to track the state of movement keys
const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
};

// Variable to track the scroll offset of the game world
let scrollOffset = 0;

// Initialization function to set up the game state
function init() {
  // Recreate platform images to ensure proper state
  platformImage = createImage(platform);
  // Reset player position and state
  player = new Player();

  // Define platform positions and images
  platforms = [
    new Platform({
      x: platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTallImage.width,
      y: 270,
      image: createImage(platformSmallTall)
    }),
    new Platform({
      x: -1,
      y: 470,
      image: platformImage
    }),

    new Platform({
      x: platformImage.width - 3,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 2 + 100,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 3 + 300,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 4 + 300 - 2,
      y: 470,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 5 + 700 - 2,
      y: 470,
      image: platformImage
    })
  ];

  // Define generic objects (background elements) and their positions
  genericObject = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(background)
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(hills)
    })
  ];
  // Reset scroll offset
  scrollOffset = 0;
}

// Animation loop function
function animate() {
  // Request the next animation frame
  requestAnimationFrame(animate);
  // Clear the canvas with a white background
  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Draw generic objects (background elements)
  genericObject.forEach(genericObject => {
    genericObject.draw();
  });

  // Draw platforms
  platforms.forEach(platform => {
    platform.draw();
  });

  // Update player state
  player.update();

  // Handle player movement to the right
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
    // Handle player movement to the left
  } else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x < 0)) {
    player.velocity.x = -player.speed;
    // Handle player standing still
  } else {
    player.velocity.x = 0;

    // Scroll the game world to the right
    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach(platform => {
        platform.position.x -= player.speed;
      });
      genericObject.forEach(genericObject => {
        genericObject.position.x -= player.speed * 0.66;
      });
      // Scroll the game world to the left
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach(platform => {
        platform.position.x += player.speed;
      });
      genericObject.forEach(genericObject => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
  }

  // Check for collision with platforms
  platforms.forEach(platform => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >= platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  // Change player sprite to running right
  if (currentKey === 'right' && player.currentSprite !== player.sprites.run.right) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
    // Change player sprite to running left
  } else if (currentKey === 'left' && player.currentSprite !== player.sprites.run.left) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  }

  // Change player sprite to standing right
  if (!keys.right.pressed && currentKey === 'right' && player.currentSprite === player.sprites.run.right) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
    // Change player sprite to standing left
  } else if (!keys.left.pressed && currentKey === 'left' && player.currentSprite === player.sprites.run.left) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  // Check for win condition
  if (scrollOffset > platformImage.width * 5 + 300 - 2) {
    console.log('You win!');
  }

  // Check for lose condition
  if (player.position.y > canvas.height) {
    init();
  }
}

// Initialize the game state
init();
// Start the animation loop
animate();

// Event listener for keydown events to control the player
addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
    case 65: // 'A' key
      keys.left.pressed = true;
      currentKey = 'left';
      break;
    case 68: // 'D' key
      keys.right.pressed = true;
      currentKey = 'right';
      break;
    case 87: // 'W' key
      player.velocity.y -= 25;
      break;
  }
});

// Event listener for keyup events to control the player
addEventListener('keyup', ({ keyCode }) => {
  switch (keyCode) {
    case 65: // 'A' key
      keys.left.pressed = false;
      break;
    case 68: // 'D' key
      keys.right.pressed = false;
      break;
  }
});
