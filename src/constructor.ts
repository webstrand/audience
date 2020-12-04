import type { Audience, Spectator } from "./index";

/**
 * Set-based implementation of `Audience.Iterable`. Users should not normally
 * construct instance of this class directly because it can cause issues with
 * inheritance if the natural type is exposed. Users should instead use the
 * Audience constructor exported by index
 */
export class AudienceSet<Spec extends Spectator<(...msg: never) => unknown>> implements Audience.Iterable<Spec> {
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
}
