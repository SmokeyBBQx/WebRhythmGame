const drumCircleX = 412 / 2;
const drumCircleY = 915 - 60;
let score = 0;
let don, kat, song, blueTile, redTile, bg;
let songJSON, musicTitle, fileLocation, donData, katData;

const speedFactor = 10;
let tiles = [];
let songs = ['songs/dejavu.json', 'songs/tetris.json'];

function preload() {
  const randomIndex = Math.floor(Math.random() * songs.length);
  const chosenSong = songs[randomIndex];
  songJSON = loadJSON(chosenSong, assignJSONData);

  soundFormats('mp3', 'ogg');
  don = loadSound('assets/don');
  kat = loadSound('assets/kat');
  redTile = loadImage('assets/red_tile.png');
  blueTile = loadImage('assets/blue_tile.png');
  bg = loadImage('assets/background.png');
}

function assignJSONData(songData) {
  donData = songData.donData;
  katData = songData.katData;
  musicTitle = songJSON.songTitle;
  fileLocation = songData.fileLocation;

  if (donData && katData) {
    tiles = donData.map(value => ({ value, type: 1 })).concat(katData.map(value => ({ value, type: 2 })));
  }

  song = loadSound(fileLocation);
}

function setup() {
  createCanvas(412, 915);
  textSize(24);

  don.setVolume(5.0);
  kat.setVolume(5.0);
  song.play();
}

function draw() {
  image(bg, 200, 457, 425, 920);
  strokeWeight(4);
  fill('black');
  text('Score: ' + score, 20, height - 50);
  fill(203,190,138);
  ellipse(drumCircleX, drumCircleY, 100);
  ellipse(drumCircleX, drumCircleY, accelerationX * 1.5);

  let currentTime = song.currentTime() + 1.5;

  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].value <= currentTime) {
      let beatTemp = tiles[i].value;

      const elapsedTime = currentTime - beatTemp;
      let beatPosition = elapsedTime * 60 * speedFactor;

      const tile = new Tile(tiles[i].type, beatPosition);
      tile.draw();

      if (accelerationX > 15 || keyIsPressed) {
        score += calculateScore(tile, 1, i);
      } else if (accelerationY > 15 || accelerationZ > 15 || mouseIsPressed) {
        score += calculateScore(tile, 2, i);
      }
    }
  }
}


function calculateScore(tile, move, index) {
  const tileType = tile.type;
  const tilePos = tile.position;
  let scoreResult = 0;

  let distance = Math.abs(drumCircleY - tilePos);
  let maxDistance = 40;

  if (tileType == move && distance < maxDistance) {
    tiles[index] = 0;
    scoreResult = Math.floor(maxDistance - distance);
    if (tileType == 1) {
      don.play();
    } else if (tileType == 2) {
      kat.play();
    }
  }

  return scoreResult;
}

class Tile {
  constructor(type, position) {
    this.type = type;
    this.position = position;
  }

  draw() {
    if (this.type == 1) {
        imageMode(CENTER);
        image(redTile, width / 2, this.position, 120, 120)
    } else {
        imageMode(CENTER);
        image(blueTile, width / 2, this.position, 120, 120)
    }
  }
}
