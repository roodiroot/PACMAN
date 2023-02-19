export class Boundary {
  static width = 40;
  static height = 40;
  constructor(c, { position }) {
    this.c = c;
    this.position = position;
    this.width = 40;
    this.height = 40;
  }
  draw() {
    this.c.fillStyle = 'blue';
    this.c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
