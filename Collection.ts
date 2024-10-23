import { Canvas } from "./Questy"

/**
 * Entity interface
 */
export interface Entity {
	draw(c: Canvas, delta: number): void
	isAlive(): boolean
}

/**
 * Test that this is Entity
 */
export function isEntity(o: any): o is Entity {
	return o.draw instanceof Function
		&& o.isAlive instanceof Function
}

/**
 * Collection of entities
 */
export class Collection {
	private _entities: Entity[] = [];

	/**
	 * Add new entity
	 */
	add(ent: Entity) {
		this._entities.push(ent);
	}

	/**
	 * Draw entities and process in the same time
	 */
	draw(c: Canvas, delta: number): void {
		this._entities = this._entities.filter(e => {
			// Do the draw
			e.draw(c, delta)

			// Test that it is not dead
			return e.isAlive();
		});
	}

	/**
	 * Get all the entities
	 */
	all() {
		return [...this._entities];
	}

	/**
	 * Remove entity from the collection
	 */
	remove(ent: Entity) {
		this._entities = this._entities.filter(e => e !== ent);
	}

	/**
	 * Remove all the entities inside
	 */
	clear() {
		this._entities = [];
	}

	/**
	 * Get count of entities in the collection
	 */
	size(): number {
		return this._entities.length;
	}


}