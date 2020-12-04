import type { Audience, Spectator } from "./index";

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
	function bind<As extends readonly unknown[], Bs extends readonly unknown[]>(thisArg: unknown, audience: Audience.Iterable<Spectator<(...args: [...As, ...Bs]) => unknown> & emit.Options>, ...args: As): (...args: Bs) => void;
}
