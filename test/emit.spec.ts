/* eslint-disable @typescript-eslint/no-unused-vars */
import * as chai from "chai";
import { expect } from "chai";
import "mocha";
import * as sinonChai from "sinon-chai";
import * as sinon from "sinon";
chai.use(sinonChai);

import { emit } from "../src/emit";
import { Audience, Spectator } from "../src/index";
import { Exact } from "./spec";

/* eslint-disable @typescript-eslint/indent */
/* ////////////////////////////////// */namespace CheckEmit {// @ts-expect-error
if(1 as 0) return;
declare let a1: Audience<Spectator<(a: 1) => void>>;
declare let a2: Audience<Spectator<(a: 1) => void> & emit.Options>;
declare let a3: Audience.Iterable<Spectator<(a: 1, b: 2, c: 3, d: 4) => 5>>;
declare let a4: Audience.Iterable<Spectator<(a: 1, b: 2, c: 3, d: 4) => 5> & emit.Options>;
declare let a5: Audience.Iterable<Spectator<(a: 1, b: 2, c: 3, d: 4) => 5> & { once?: "foo" }>;
declare let a7: Audience.Iterable<Spectator<(a: 1, b: 2, c: 3, d: 4, ...e: string[]) => 5>>;

// -------------------------------------------------------------------------- //
// Emit must be callable on Audience.Iterable, regardless of whether or not it
// supports `emit.Options`.
emit(a3, 1, 2, 3, 4);
emit(a4, 1, 2, 3, 4);
emit(a7, 1, 2, 3, 4);
emit(a7, 1, 2, 3, 4, "f", "g", "h");
// -------------------------------------------------------------------------- //
// Emit must not be callable on a non-iterable Audiences.
// @ts-expect-error:
// Property '[Symbol.iterator]' is missing
emit(a1, 1);
// @ts-expect-error:
// Property '[Symbol.iterator]' is missing
emit(a2, 1);
// -------------------------------------------------------------------------- //
// Emit must not be callable when spectators have a type that's incompatible
// with `emit.Options`.
// @ts-expect-error:
// Types of property 'once' are incompatible.
// Type '"foo" | undefined' is not assignable to type 'boolean | undefined'.
emit(a5, 1, 2, 3, 4);
// -------------------------------------------------------------------------- //
// Emit must require all of the necessary parameters.
// @ts-expect-error:
// Type '4' is not assignable to parameter of type '1'.
emit(a3, 4, 5, 6, 7);
// @ts-expect-error:
// Expected 5 arguments, but got 3.
emit(a4, 1, 2);
// @ts-expect-error:
// Expected 5 arguments, but got 4.
emit(a7, 1, 2, 3);
// -------------------------------------------------------------------------- //
// emit.bind must be callable on the same objecs as emit.
Exact(emit.bind(null))(emit, true);
Exact(emit.bind(null, a3))<(a: 1, b: 2, c: 3, d: 4) => void>(true);
Exact(emit.bind(null, a3, 1))<(b: 2, c: 3, d: 4) => void>(true);
Exact(emit.bind(null, a3, 1, 2))<(c: 3, d: 4) => void>(true);
Exact(emit.bind(null, a4, 1, 2, 3))<(d: 4) => void>(true);
Exact(emit.bind(null, a4, 1, 2, 3, 4))<() => void>(true);
Exact(emit.bind(null, a7, 1, 2, 3))<(d: 4, ...args: string[]) => void>(true);
Exact(emit.bind(null, a7, 1, 2, 3, 4))<(...args: string[]) => void>(true);
Exact(emit.bind(null, a7, 1, 2, 3, 4, "f", "g", "h"))<(...args: string[]) => void>(true);
// -------------------------------------------------------------------------- //
// emit.bind must not be callable on non-iterable Audiences.
// @ts-expect-error:
// Property '[Symbol.iterator]' is missing
emit.bind(null, a1, 1);
// @ts-expect-error:
// Property '[Symbol.iterator]' is missing
emit.bind(null, a2, 1);
// -------------------------------------------------------------------------- //
// emit.bind must not be callable when spectators have a type that's
// incompatible with `emit.Options`.
// @ts-expect-error:
// Types of property 'once' are incompatible.
// Type '"foo" | undefined' is not assignable to type 'boolean | undefined'.
emit.bind(null, a5, 1);
// -------------------------------------------------------------------------- //
// emit.Options must be optional
Exact<emit.Options, Partial<emit.Options>>(true);
/* ///////////////////////////////////////////////////////////////////////// */}
/* eslint-enable @typescript-eslint/indent */

describe("emit", () => {
	const audience = new Audience<Spectator<(a: number, b: string) => void> & emit.Options>();
	beforeEach(() => audience.dissolve());

	it(`should do nothing with an empty audience`, () => {
		expect(() => emit(audience, 1, "foo")).to.not.throw();
	});

	it(`should send a message to every spectator`, () => {
		const a = audience.join({ fn: sinon.spy() });
		const b = audience.join({ fn: sinon.spy() });
		const c = audience.join({ fn: sinon.spy() });

		emit(audience, 1, "foo");

		expect(a.fn).calledOnceWithExactly(1, "foo");
		expect(b.fn).calledOnceWithExactly(1, "foo");
		expect(c.fn).calledOnceWithExactly(1, "foo");
	});

	it(`should remove spectators marked once`, () => {
		const a = audience.join({ fn: sinon.spy() });
		const b = audience.join({ fn: sinon.spy(), once: true });
		const c = audience.join({ fn: sinon.spy() });

		emit(audience, 1, "foo");

		expect(a.fn).calledOnceWithExactly(1, "foo");
		expect(b.fn).calledOnceWithExactly(1, "foo");
		expect(c.fn).calledOnceWithExactly(1, "foo");


		expect(audience.joined(a)).is.true;
		expect(audience.joined(b)).is.false;
		expect(audience.joined(c)).is.true;
	});

	it(`should not send messaged to dormant spectators`, () => {
		const a = audience.join({ fn: sinon.spy() });
		const b = audience.join({ fn: sinon.spy() });
		const c = audience.join({ fn: sinon.spy(), dormant: true as boolean });

		emit(audience, 1, "foo");

		expect(a.fn).calledOnceWithExactly(1, "foo");
		expect(b.fn).calledOnceWithExactly(1, "foo");
		expect(c.fn).not.called;

		expect(audience.joined(c)).is.true;
		c.dormant = false;

		emit(audience, 50, "bar");

		expect(c.fn).calledOnceWithExactly(50, "bar");
	});

	it(`should call spectator.fn with correct context`, () => {
		const a = audience.join({ fn: sinon.spy() });
		emit(audience, 1, "foo");
		expect(a.fn).calledOn(a);
	});
});
