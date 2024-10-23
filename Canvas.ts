import { Coordinates } from "./Coordinates";
import { Signal } from "./Signal";
import { TimeDelta } from "./Time";

export class Canvas {
	constructor(
		private _canvas: HTMLCanvasElement,
		private _ctx: CanvasRenderingContext2D
	) {
		this.font("System");
	}

	private lastColor = "black";
	private tileWidth = 24;
	private tileHeight = 24;
	private _timeDelta = new TimeDelta();

	/**
	 * Mouse Click/Touch coordinates
	 */
	mouse = new Signal<Coordinates>();

	/**
	 * Key pressed
	 */
	keys = new Signal<string>();

	/**
	 * Create Canvas
	 */
	static create(w: number, h: number): Canvas {
		const c = document.createElement("canvas");
		const ctx = c.getContext("2d");``
		c.width = w;
		c.height = h;
		c.style.imageRendering = "pixelated";
		if (!ctx) throw new Error("Can't load Context from canvas. Browser is not supporting!");
		return new Canvas(c, ctx);
	}

	/**
	 * Create Canvas for full screen
	 */
	static createFull() {
		return this.create(window.innerWidth, window.innerHeight).resizeToFull();
	}

	/**
	 * Append element to some other element
	 */
	appendTo(where: HTMLElement, tabIndex = 0): this {
		this._canvas.tabIndex = tabIndex;
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
	 * Get Delta time
	 */
	delta(): number {
		return this._timeDelta.delta();
	}

	/**
	 * Clear the canvas. Doing that under the hood
	 */
	clear() {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}

	private _onKey(e: KeyboardEvent) {
		this.keys.emit(e.code);
		e.stopPropagation();
	}

	private _onMouse(e: MouseEvent) {
		const x = Math.floor(e.clientX / this.tileWidth);
		const y = Math.floor(e.clientY / this.tileHeight);
		this.mouse.emit(new Coordinates(x, y));
		e.stopPropagation();
	}

	/**
	 * Resize canvas to Full size
	 */
	resizeToFull(): this {
		this._canvas.style.position = "absolute";
		this._canvas.style.left = "0px";
		this._canvas.style.top = "0px";
		this._canvas.width = window.innerWidth;
		this._canvas.height = window.innerHeight;
		return this;
	}


}
