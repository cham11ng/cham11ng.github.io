let canvas = document.getElementById('game');
let world = new World(canvas, 0, BACKGROUND_DISPLACEMENT);

document.onkeydown = birdEvent();
canvas.onclick = birdEvent();

function birdEvent() {
  return (event) => {
    if (world.bird.isDead === false && (event.type === 'click' || event.keyCode === 32)) {
      world.bird.fly();
    } else if (world.bird.isDead && event.keyCode === 13) {
      world.restart();
    }
  }
}