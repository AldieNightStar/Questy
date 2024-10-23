export { Collection, Entity } from "./Collection";

export class Canvas {
	constructor(
		private _canvas: HTMLCanvasElement,
		private _ctx: CanvasRenderingContext2D,
		private _game: Game,
	) {
		this.font("System");
	}

	private lastColor = "black";
	private tileWidth = 24;
	private tileHeight = 24;
	private _timer = 0;
	private _timeDelta = new TimeDelta();

	/**
	 * Create Canvas
	 */
	static create(w: number, h: number, g: Game) {
		const c = document.createElement("canvas");
		const ctx = c.getContext("2d");
		c.width = w;
		c.height = h;
		c.style.imageRendering = "pixelated";
		if (!ctx) throw new Error("Can't load Context from canvas. Browser is not supporting!");
		return new Canvas(c, ctx, g);
	}

	/**
	 * Create Canvas for full screen
	 */
	static createFull(g: Game) {
		return this.create(window.innerWidth, window.innerHeight, g)._absolutePos();
	}

	/**
	 * Append element to some other element
	 */
	appendTo(where: HTMLElement): this {
		this._canvas.tabIndex = 0;
		this._canvas.addEventListener("keydown", (e) => this._onKey(e));
		this._canvas.addEventListener("mousedown", (e) => this._onMouse(e));

		where.appendChild(this._canvas);
		return this;
	}

	/**
	 * Set new color
	 */
	color(color: string) {
		this._ctx.fillStyle = color;
		this._ctx.strokeStyle = color;
		this.lastColor = color;
	}

	font(name: string) {
		this._ctx.font = "bold " + this.tileWidth + "px " + name;
	}

	/**
	 * Change size per tile
	 */
	size(w: number, h: number): this {
		this.tileWidth = w;
		this.tileHeight = h;
		return this;
	}

	/**
	 * Draw single character
	 */
	char(c: string, x: number, y: number) {
		this._ctx.fillText(
			c[0] || " ",
			x * this.tileWidth,
			y * this.tileHeight + (this.tileHeight * 0.75),
			this.tileWidth);
	}

	/**
	 * Draw single character with a rectangle
	 */
	charRect(c: string, x: number, y: number, rectColor: string) {
		const prevColor = this.lastColor;
		this.color(rectColor)
		this.rect(x, y);
		this.color(prevColor);
		this.char(c, x, y);
	}

	/**
	 * Print text onto Canvas
	 */
	print(t: string, x: number, y: number) {
		let count = 0;
		for (let c of t) {
			this.char(c, x + count++, y);
		}
	}

	/**
	 * Draw rectangle instead of character
	 */
	rect(x: number, y: number) {
		this._ctx.fillRect(
			x * this.tileWidth, y * this.tileWidth, this.tileWidth, this.tileHeight
		);
	}

	printRect(t: string, x: number, y: number, rectColor: string) {
		let count = 0;
		for (let c of t) {
			this.charRect(c, x + count++, y, rectColor);
		}
	}

	/**
	 * Start the game
	 */
	start(): this {
		clearInterval(this._timer);
		this._timer = setInterval(() => {
			this.clear();
			this._game.draw(this, this._timeDelta.delta());
		}, 16);
		return this;
	}

	/**
	 * Clear the canvas. Doing that under the hood
	 */
	private clear() {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}

	private _onKey(e: KeyboardEvent) {
		this._game.key(e.code);
		e.stopPropagation();
	}

	private _onMouse(e: MouseEvent) {
		const x = Math.floor(e.clientX / this.tileWidth);
		const y = Math.floor(e.clientY / this.tileHeight);
		this._game.mouse(x, y);
		e.stopPropagation();
	}

	private _absolutePos(): this {
		this._canvas.style.position = "absolute";
		this._canvas.style.left = "0px";
		this._canvas.style.top = "0px";
		return this;
	}


}

export interface Game {
	key(code: string): void
	mouse(x: number, y: number): void
	draw(c: Canvas, delta: number): void
}

export function isGame(o: any): o is Game {
	return o.key instanceof Function
		&& o.mouse instanceof Function
		&& o.draw instanceof Function;
}

export class TimeDelta {
	constructor() {
		this._time = Date.now() / 1000;
	}

	private _time: number
	
	delta() {
		const now = Date.now() / 1000
		const delta = now - this._time;
		this._time = now;
		return delta;
	}
}

export class TimeSpan {

	constructor(public intervalSec: number) {}

	private _time = 0;

	count(delta: number) {
		this._time += delta;
		if (this._time >= this.intervalSec) {
			this._time -= this.intervalSec;
			return true;
		}
		return false;
	}
}