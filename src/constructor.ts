import { Audience, Spectator } from "./index";

export const AudienceConstructor: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	prototype: Audience.Iterable<any>;
	new <Spec extends Spectator<(...args: never) => unknown>>(): Audience.Iterable<Spec>;
} = class Audience<Spec extends Spectator<(...args: never) => unknown>> implements Audience.Iterable<Spec> {
	members: Set<Readonly<Spec>> = new Set(); // TODO: use #members, when supported

	join<S>(spectator: S & Spec): typeof spectator {
		this.members.add(spectator);
		return spectator;
	}

	part<S extends Readonly<Spec>>(spectator: S | null | undefined): void {
		// This is safe, Set.prototype.delete accepts any value as it's
		// argument.
		this.members.delete(spectator as Spec);
	}

	joined<S extends Readonly<Spec>>(spectator: S | null | undefined): spectator is S {
		// This is safe, Set.prototype.has accepts any value as it's argument.
		return this.members.has(spectator as Spec);
	}

	dissolve(): void {
		this.members.clear();
	}

	[Symbol.iterator](): IterableIterator<Readonly<Spec>> {
		return this.members.values();
	}
};
