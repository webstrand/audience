import { AudienceConstructor as AudienceConstructor } from "./constructor";
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

/**
 * Emit a message to all of the spectators in a given audience. Spectators that
 * are {@link emit.Options#dormant|dormant} will be ignored and spectators that
 * are {@link emit.Options#once|once} will be removed from the audience after
 * receiving the message.
 *
 * @param audience - Audience to emit the message to.
 * @param args - Contents of the message.
 */
export function emit<As extends readonly unknown[]>(audience: Audience.Iterable<Spectator<(...args: As) => unknown> & emit.Options>, ...args: As): void {
	for(const s of audience) {
		if(s.dormant === true) continue;
		s.fn(...args);
		if(s.once) audience.part(s);
	}
}

export declare namespace emit {
	/**
	 * A mixin for the {@link Spectator | Spectator interface} with options that
	 * control how emit works.
	 */
	interface Options {
		/**
		 * When true, the spectator will part from the audience after receiving
		 * one message.
		 */
		once?: boolean;

		/**
		 * When true, even though the spectator is joined to the audience, it
		 * will not receive any messages.
		 */
		dormant?: boolean;
	}

	function bind(thisArg: unknown): typeof emit;
	function bind<As extends readonly unknown[], Bs extends readonly unknown[]>(thisArg: unknown, audience: Audience.Iterable<Spectator<(...args: [...As, ...Bs]) => unknown>>, ...args: As): (...args: Bs) => void;
}

export function poll<As extends readonly unknown[], Ret, Spec extends Spectator<(...args: never) => unknown> & poll.Options>(audience: Audience.Iterable<Spectator<(...args: As) => Ret> & Spec>, ...args: As): Map<Spec, Ret> {
	const results = new Map<Spec, Ret>();
	for(const s of audience) {
		if(s.dormant === true) continue;
		results.set(s, s.fn(...args));
		if(s.once) audience.part(s);
	}

	return results;
}

export declare namespace poll {
	/**
	 * A mixin for the {@link Spectator | Spectator interface} with options that
	 * control how poll works.
	 */
	interface Options {
		/**
		 * When true, the spectator will part from the audience after receiving
		 * one message.
		 */
		once?: boolean;

		/**
		 * When true, even though the spectator is joined to the audience, it
		 * will not receive any messages nor will it respond to the poll.
		 */
		dormant?: boolean;
	}

	function bind<As extends readonly unknown[], Bs extends readonly unknown[], Ret, Spec extends Spectator<(...args: never) => unknown> & poll.Options>(thisArg: unknown, audience: Audience.Iterable<Spectator<(...args: [...As, ...Bs]) => Ret> & Spec>, ...args: As): (...args: Bs) => Map<Spec, Ret>;
	function bind(thisArg: unknown): typeof poll;
}
