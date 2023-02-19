export class Player {
  constructor(c, { position, velocity }) {
    this.c = c;
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
  }
  draw() {
    this.c.beginPath();
    this.c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    this.c.fillStyle = 'yellow';
    this.c.fill();
    this.c.closePath();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
export class Ghost {
  static speed = 5;
  constructor(c, { position, velocity, color = 'red' }) {
    this.c = c;
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.color = color;
    this.prevCollisions = [];
    this.speed = 5;
  }
  draw() {
    this.c.beginPath();
    this.c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    this.c.fillStyle = this.color;
    this.c.fill();
    this.c.closePath();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
