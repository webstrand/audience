export { emit } from "./emit";
export { poll } from "./poll";
import { AudienceSet } from "./constructor";

/**
 * A constructor for a `Set` based implementation of an [[Audience]].
 */
export const Audience: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	prototype: Audience.Iterable<any>;
	/**
	 * Construct a new [[Audience.Iterable]] based on `Set`s.
	 *
	 * @typeParam Spec - Type of [[Spectator]] that are permitted to be members
	 * of the Audience.
	 */
	new <Spec extends Spectator<(...msg: never) => unknown>>(): Audience.Iterable<Spec>;
} = AudienceSet;

/**
 * A spectator is a handle object that can be `join`ed an `Audiences`. It has
 * only one required property, `fn`, which is used as the callback function to
 * receive messages.
 *
 * @typeParam F - Function type used to receive messages.
 */
export interface Spectator<F extends (...msg: never) => unknown> {
	/**
	 * Function callback that receives and responds to messages.
	 */
	fn: F
}

/*
 * An `Audience` is a collection of [[Spectator|Spectators]] that can receive
 * messages of a particular type.
 *
 * @typeParam Spec - Type of [[Spectator]] that are members of the Audience.
 */
export interface Audience<Spec extends Spectator<(...msg: never) => unknown>> {
	/**
	 * Add a [[Spectator]] object to the Audience. If the `spectator` has
	 * already joined, the call has no effect.
	 *
	 * @typeParam S - Some sub-type of `Spec`, users may add custom properties
	 * to the `spectator` object and access those properties via `this` inside
	 * of `fn`.
	 * @param spectator - The spectator object to add. May contain arbitrary
	 * user-defined properties.
	 *
	 * @returns The spectator object that was passed in.
	 */
	join<S>(spectator: S & Spec): typeof spectator;
	/** @private */
	join(spectator: Spec): unknown; // Important for assignability.

	/**
	 * Remove a [[Spectator]] object from the Audience. If the `spectator` has
	 * not already joined, the call has no effect.
	 *
	 * @param spectator - A spectator object to remove. Any object is permitted.
	 */
	part<S extends Readonly<Spec>>(spectator: S | null | undefined): void;

	/**
	 * Check if a particular [[Spectator]] has been added to the Audience. Also
	 * works as a type-guard, determining that an object is compatible with
	 * `Spec` if it already belongs to the Audience.
	 *
	 * @returns true if the object is currently joined and false otherwise.
	 *
	 * @param spectator - A spectator object to check membership of. Any object
	 * is permitted.
	 */
	joined<S extends Readonly<Spec>>(spectator: S | null | undefined): spectator is S;

	/**
	 * Dissolve the audience, removing all spectators and then resetting the
	 * Audience to its initial state.
	 */
	dissolve(): void;
}

export declare namespace Audience {
	/**
	 * A collection of [[Spectator]] that exposes individual spectators through
	 * an iterator. Use this interface when you need to be able to [[emit]] or
	 * [[poll]] the audience.
	 *
	 * Constructors implementing [[Audience]] should return this type.
	 * Otherwise, incautious users of the constructor may pollute their own
	 * classes with implementation details and make inheritance tricky.
	 */
	export interface Iterable<Spec extends Spectator<(...msg: never) => unknown>> extends Audience<Spec> {
		/**
		 * Returns an iterator that is stable in the face of concurrent
		 * mutations:
		 *
		 * - The iterator must not skip spectators if the underlying
		 *   [[Audience]] has mutated.
		 * - The iterator must not return spectators that have parted unless
		 *   they have rejoined.
		 * - The iterator must not return the same spectator twice unless the
		 *   spectator has since parted and then rejoined.
		 */
		[Symbol.iterator](): IterableIterator<Readonly<Spec>>;
	}
}
