import type { Audience, Spectator } from "./index";

/**
 * Poll an [[Audience]] by sending a message to all of the
 * [[Spectator|Spectators]] in the audience and collecting their return values.
 *
 * Optional properties on the Spectator objects control poll behavior:
 *
 * - `once` – The spectator will be removed immediately after receiving the
 *   message.
 * - `dormant` – The spectator will not receive the message, nor will `once` be
 *   applied if it is set.
 *
 * These optional properties do not need to be set. But [[Audience|Audiences]]
 * with conflicting spectator types will be incompatible with `poll`. See
 * [[poll.Options]].
 *
 * Returns a `Map` from [[Spectator]] handles to their return values.
 *
 * @param audience - The selected audience to send the message to. Must be an
 * [[Audience.Iterable]].
 * @param message - Contents of the message to be emitted.
 */
export function poll<Msg extends readonly unknown[], Ret, Spec extends Spectator<(...args: never) => unknown> & poll.Options>(audience: Audience.Iterable<Spectator<(...msg: Msg) => Ret> & Spec>, ...msg: Msg): Map<Spec, Ret> {
	const results = new Map<Spec, Ret>();
	for(const s of audience) {
		if(s.dormant === true) continue;
		results.set(s, s.fn(...msg));
		if(s.once) audience.part(s);
	}

	return results;
}

export declare namespace poll {
	/**
	 * A mixin for the [[Spectator]] interface that adds optional properties on
	 * every spectator which control how [[poll]] behaves when it polls them.
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

	function bind<Msg extends readonly unknown[], Rem extends readonly unknown[], Ret, Spec extends Spectator<(...msg: never) => unknown> & poll.Options>(thisArg: unknown, audience: Audience.Iterable<Spectator<(...msg: [...Msg, ...Rem]) => Ret> & Spec>, ...msg: Msg): (...msg: Rem) => Map<Spec, Ret>;
	function bind(thisArg: unknown): typeof poll;
}
