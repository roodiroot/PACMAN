import { Boundary } from './Boundary/Boundary';
import { Ghost, Player } from './Player/Player';
import { circleCollidesWithRectangle } from './utils/circleCollidesWithRectangle';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// ДОБАВЛЕНИЕ ОБЪЕКТОВ НА СЦЕНУ
const baundaries = [];
const ghosts = [
  new Ghost(c, {
    position: {
      x: Boundary.width * 2 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
    color: 'red',
  }),
];
const player = new Player(c, {
  position: { x: Boundary.width + Boundary.width / 2, y: Boundary.height + Boundary.height / 2 },
  velocity: { x: 0, y: 0 },
});
const keys = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};
let lastKey = '';

const map = [
  ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
  ['-', ' ', '-', ' ', '-', '-', '-', ' ', '-', ' ', '-'],
  ['-', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', '-'],
  ['-', ' ', '-', '-', ' ', ' ', ' ', '-', '-', ' ', '-'],
  ['-', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', '-'],
  ['-', ' ', '-', ' ', '-', '-', '-', ' ', '-', ' ', '-'],
  ['-', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', '-'],
  ['-', ' ', '-', '-', ' ', ' ', ' ', '-', '-', ' ', '-'],
  ['-', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', '-'],
  ['-', ' ', '-', ' ', '-', '-', '-', ' ', '-', ' ', '-'],
  ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
];

map.forEach((row, i) => {
  row.forEach((el, j) => {
    switch (el) {
      case '-':
        baundaries.push(
          new Boundary(c, { position: { x: Boundary.width * j, y: Boundary.height * i } }),
        );
        break;
    }
  });
});

const animate = (t) => {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  if (keys.w.pressed && lastKey == 'w') {
    for (let i = 0; i < baundaries.length; i++) {
      const baundary = baundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: -5,
            },
          },
          rectangle: baundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = -5;
      }
    }
  } else if (keys.a.pressed && lastKey == 'a') {
    for (let i = 0; i < baundaries.length; i++) {
      const baundary = baundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: {
              x: -5,
              y: 0,
            },
          },
          rectangle: baundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = -5;
      }
    }
  } else if (keys.s.pressed && lastKey == 's') {
    for (let i = 0; i < baundaries.length; i++) {
      const baundary = baundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: 5,
            },
          },
          rectangle: baundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = 5;
      }
    }
  } else if (keys.d.pressed && lastKey == 'd') {
    for (let i = 0; i < baundaries.length; i++) {
      const baundary = baundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: {
              x: 5,
              y: 0,
            },
          },
          rectangle: baundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = 5;
      }
    }
  }

  // РЕНДЕР
  ghosts.forEach((ghost) => {
    ghost.update();
    const collisions = [];

    baundaries.forEach((baundary) => {
      if (
        !collisions.includes('right') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: ghost.speed,
              y: 0,
            },
          },
          rectangle: baundary,
        })
      ) {
        collisions.push('right');
      }
      if (
        !collisions.includes('left') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: -ghost.speed,
              y: 0,
            },
          },
          rectangle: baundary,
        })
      ) {
        collisions.push('left');
      }
      if (
        !collisions.includes('down') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: ghost.speed,
            },
          },
          rectangle: baundary,
        })
      ) {
        collisions.push('down');
      }
      if (
        !collisions.includes('up') &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: -ghost.speed,
            },
          },
          rectangle: baundary,
        })
      ) {
        collisions.push('up');
      }
    });

    if (collisions.length > ghost.prevCollisions.length) {
      ghost.prevCollisions = collisions;
    }

    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
      if (ghost.velocity.x > 0) {
        ghost.prevCollisions.push('right');
      } else if (ghost.velocity.x < 0) {
        ghost.prevCollisions.push('left');
      } else if (ghost.velocity.y < 0) {
        ghost.prevCollisions.push('up');
      } else if (ghost.velocity.y > 0) {
        ghost.prevCollisions.push('down');
      }
      const pathways = ghost.prevCollisions.filter((el) => {
        return !collisions.includes(el);
      });

      const direction = pathways[Math.floor(Math.random() * pathways.length)];

      console.log({ direction });
      switch (direction) {
        case 'right':
          ghost.velocity.x = ghost.speed;
          ghost.velocity.y = 0;
          break;
        case 'left':
          ghost.velocity.x = -ghost.speed;
          ghost.velocity.y = 0;
          break;
        case 'up':
          ghost.velocity.x = 0;
          ghost.velocity.y = -ghost.speed;
          break;
        case 'down':
          ghost.velocity.x = 0;
          ghost.velocity.y = ghost.speed;
          break;
      }
      ghost.prevCollisions = [];
    }
  });

  baundaries.forEach((baundary) => {
    baundary.draw();

    if (circleCollidesWithRectangle({ circle: player, rectangle: baundary })) {
      player.velocity.x = 0;
      player.velocity.y = 0;
    }
  });
  player.update();
};

animate();

// УПРАВЛЕНИЕ
addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'w':
      keys.w.pressed = true;
      lastKey = 'w';
      break;
    case 's':
      keys.s.pressed = true;
      lastKey = 's';
      break;
    case 'a':
      keys.a.pressed = true;
      lastKey = 'a';
      break;
    case 'd':
      keys.d.pressed = true;
      lastKey = 'd';
      break;
  }
});
addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'w':
      keys.w.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  }
});
