type SignalHandler<T> = (dat: T) => void

/**
 * Signal. Made for collecting and emitting data
 */
export class Signal<T> {
	private _waiters: SignalHandler<T>[] = [];

	/**
	 * Creates Promise that will wait for data to be emit
	 */
	wait(): Promise<T> {
		return new Promise(ok => {
			this._waiters.push((dat) => { ok(dat); });
		});
	}

	/**
	 * Send new data to waiters
	 */
	emit(dat: T) {
		const waiters = this._waiters;
		this._waiters = [];
		waiters.forEach(w => w(dat));
	}
}