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