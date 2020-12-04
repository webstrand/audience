import type { Audience, Spectator } from "./index";

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
