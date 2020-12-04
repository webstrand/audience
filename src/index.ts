export { emit } from "./emit";
export { poll } from "./poll";

import { AudienceConstructor } from "./constructor";
export const Audience = AudienceConstructor;

/**
 * Spectators recieve and respond to messages transmitted via audiences.
 */
export interface Spectator<F extends (...args: never) => unknown> {
	fn: F
}

/**
 * A collection of Spectators.
 */
export interface Audience<Spec extends Spectator<(...args: never) => unknown>> {
	/**
	 * Add a new Spectator to the audience. If the Spectator is currently a
	 * member of the audience, nothing happens.
	 *
	 * @param spectator - A Spectator object implementing the appropriate
	 * extensions for this Audience.
	 *
	 * @returns The spectator object that was passed in.
	 */
	join<S>(spectator: S & Spec): typeof spectator;
	/** @private */
	join(spectator: Spec): unknown; // Important for assignability.

	/**
	 * Remove a Spectator from the audience. If the Spectator is not currently a
	 * member of the audience, nothing happens.
	 *
	 * Implementations are recommended, but not required, to handle arbitrary
	 * objects as the `spectator` object.
	 *
	 * @param spectator - A Spectator object implementing the appropriate
	 * extensions for this Audience.
	 */
	part<S extends Readonly<Spec>>(spectator: S | null | undefined): void;

	/**
	 * Returns true if the provided spectator has joined the audience and has
	 * not yet parted.
	 *
	 * Implementations are recommended, but not required, to handle arbitrary
	 * objects as the `spectator` object.
	 *
	 * @param spectator Object that implements the spectator interface.
	 */
	joined<S extends Readonly<Spec>>(spectator: S | null | undefined): spectator is S;

	/**
	 * Restore the audience to its initial state, removing all joined
	 * spectators.
	 */
	dissolve(): void;
}

export declare namespace Audience {
	/**
	 * A collection of Spectators that exposes individual spectators through an
	 * iterator. Use this interface when you need to be able to {@link emit} or
	 * {@link poll} the audience.
	 */
	export interface Iterable<Spec extends Spectator<(...args: never) => unknown>> extends Audience<Spec> {
		/**
		 * Expose an iterator to allow iterating the spectators. Must return an
		 * iterator that handles concurrent mutation without skipping spectators
		 * or returning parted spectators.
		 */
		[Symbol.iterator](): IterableIterator<Readonly<Spec>>;
	}
}
