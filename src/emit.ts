import type { Audience, Spectator } from "./index";

/**
 * Emit a message to all of the [[Spectator|Spectators]] in the selected
 * [[Audience]].
 *
 * Optional properties on the Spectator objects control emit behavior:
 *
 * - `once` – The spectator will be removed immediately after receiving the
 *   message.
 * - `dormant` – The spectator will not receive the message, nor will `once` be
 *   applied if it is set.
 *
 * These optional properties do not need to be set. But [[Audience|Audiences]]
 * with conflicting spectator types will be incompatible with `emit`. See
 * [[emit.Options]]
 *
 * @param audience - The selected audience to send the message to. Must be an
 * [[Audience.Iterable]].
 * @param msg - Contents of the message to be emitted.
 */
export function emit<Msg extends readonly unknown[]>(audience: Audience.Iterable<Spectator<(...msg: Msg) => unknown> & emit.Options>, ...msg: Msg): void {
	for(const s of audience) {
		if(s.dormant === true) continue;
		s.fn(...msg);
		if(s.once) audience.part(s);
	}
}

export declare namespace emit {
	/**
	 * A mixin for the [[Spectator]] interface that adds optional properties on
	 * every spectator which control how `emit` behaves when it emits messages
	 * to them.
	 */
	interface Options {
		/**
		 * The spectator will be removed immediately after receiving the
		 * message.
		 */
		once?: boolean;

		/**
		 * The spectator will not receive the message, nor will `once` be
		 * applied if it is set.
		 */
		dormant?: boolean;
	}

	function bind(thisArg: unknown): typeof emit;
	function bind<Msg extends readonly unknown[], Rem extends readonly unknown[]>(thisArg: unknown, audience: Audience.Iterable<Spectator<(...msg: [...Msg, ...Rem]) => unknown> & emit.Options>, ...msg: Msg): (...msg: Rem) => void;
}
