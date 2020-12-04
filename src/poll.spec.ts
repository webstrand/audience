/* eslint-disable @typescript-eslint/no-unused-vars */
import * as chai from "chai";
import { expect } from "chai";
import "mocha";
import * as sinonChai from "sinon-chai";
import * as sinon from "sinon";
chai.use(sinonChai);

import { Audience, Spectator } from "./index";
import { poll } from "./poll";
import { Exact } from "./spec";

/* eslint-disable @typescript-eslint/indent */
/* ////////////////////////////////// */namespace CheckPoll {// @ts-expect-error
if(1 as 0) return;

declare let a1: Audience<Spectator<(a: 1) => 5>>;
declare let a2: Audience<Spectator<(a: 1) => 5> & poll.Options>;
declare let a3: Audience.Iterable<Spectator<(a: 1, b: 2, c: 3, d: 4) => 5>>;
declare let a4: Audience.Iterable<Spectator<(a: 1, b: 2, c: 3, d: 4) => 5> & poll.Options>;
declare let a5: Audience.Iterable<Spectator<(a: 1, b: 2, c: 3, d: 4) => 5> & { once?: "foo" }>;
declare let a7: Audience.Iterable<Spectator<(a: 1, b: 2, c: 3, d: 4, ...e: string[]) => 5>>;
declare let a8: Audience.Iterable<Spectator<() => 5>>;

type RVa3 = Map<Spectator<(a: 1, b: 2, c: 3, d: 4) => 5>, 5>;
type RVa4 = Map<Spectator<(a: 1, b: 2, c: 3, d: 4) => 5> & poll.Options, 5>;
type RVa7 = Map<Spectator<(a: 1, b: 2, c: 3, d: 4, ...e: string[]) => 5>, 5>;

// -------------------------------------------------------------------------- //
// Poll must be callable on Audience.Iterable, regardless of whether or not it
// supports `poll.Options`.
Exact(poll(a3, 1, 2, 3, 4))<RVa3>(true);
Exact(poll(a4, 1, 2, 3, 4))<RVa4>(true);
Exact(poll(a7, 1, 2, 3, 4))<RVa7>(true);
Exact(poll(a7, 1, 2, 3, 4, "f", "g", "h"))<RVa7>(true);
// -------------------------------------------------------------------------- //
// Poll must not be callable on a non-iterable Audiences.
// @ts-expect-error:
// Property '[Symbol.iterator]' is missing
poll(a1, 1);
// @ts-expect-error:
// Property '[Symbol.iterator]' is missing
poll(a2, 1);
// -------------------------------------------------------------------------- //
// Poll must not be callable when spectators have a type that's incompatible
// with `poll.Options`.
// @ts-expect-error:
// Types of property 'once' are incompatible.
// Type '"foo" | undefined' is not assignable to type 'boolean | undefined'.
poll(a5, 1, 2, 3, 4);
// -------------------------------------------------------------------------- //
// Poll must require all of the necessary parameters.
// @ts-expect-error:
// Type '4' is not assignable to parameter of type '1'.
poll(a3, 4, 5, 6, 7);
// @ts-expect-error:
// Expected 5 arguments, but got 3.
poll(a4, 1, 2);
// @ts-expect-error:
// Expected 5 arguments, but got 4.
poll(a7, 1, 2, 3);
// -------------------------------------------------------------------------- //
// poll.bind must be callable on the same objecs as poll.
Exact(poll.bind(null))(poll, true);
Exact(poll.bind(null, a3))<(a: 1, b: 2, c: 3, d: 4) => RVa3>(true);
Exact(poll.bind(null, a3, 1))<(b: 2, c: 3, d: 4) => RVa3>(true);
Exact(poll.bind(null, a3, 1, 2))<(c: 3, d: 4) => RVa3>(true);
Exact(poll.bind(null, a4, 1, 2, 3))<(d: 4) => RVa4>(true);
Exact(poll.bind(null, a4, 1, 2, 3, 4))<() => RVa4>(true);
Exact(poll.bind(null, a7, 1, 2, 3))<(d: 4, ...args: string[]) => RVa7>(true);
Exact(poll.bind(null, a7, 1, 2, 3, 4))<(...args: string[]) => RVa7>(true);
Exact(poll.bind(null, a7, 1, 2, 3, 4, "f", "g", "h"))<(...args: string[]) => RVa7>(true);
// -------------------------------------------------------------------------- //
// poll.bind must not be callable on non-iterable Audiences.
// @ts-expect-error:
// Property '[Symbol.iterator]' is missing
poll.bind(null, a1, 1);
// @ts-expect-error:
// Property '[Symbol.iterator]' is missing
poll.bind(null, a2, 1);
// -------------------------------------------------------------------------- //
// poll.bind must not be callable when spectators have a type that's
// incompatible with `poll.Options`.
// @ts-expect-error:
// Types of property 'once' are incompatible.
// Type '"foo" | undefined' is not assignable to type 'boolean | undefined'.
poll.bind(null, a5, 1);
// -------------------------------------------------------------------------- //
// poll.Options must be optional
Exact<poll.Options, Partial<poll.Options>>(true);
/* ///////////////////////////////////////////////////////////////////////// */}
/* eslint-enable @typescript-eslint/indent */

describe("poll", () => {
	const audience = new Audience<Spectator<(a: number, b: string) => number> & poll.Options>();
	beforeEach(() => audience.dissolve());

	it(`should do nothing with an empty audience`, () => {
		poll(audience, 1, "foo");
	});

	it(`should send a message to every spectator and collect their responses`, () => {
		const a = audience.join({ fn: sinon.spy(() => 5) });
		const b = audience.join({ fn: sinon.spy(() => 6) });
		const c = audience.join({ fn: sinon.spy(() => 7) });

		expect(Array.from(poll(audience, 1, "foo"))).to.deep.equal([ [ a, 5 ], [ b, 6 ], [ c, 7 ] ]);

		expect(a.fn).calledOnceWithExactly(1, "foo");
		expect(b.fn).calledOnceWithExactly(1, "foo");
		expect(c.fn).calledOnceWithExactly(1, "foo");
	});

	it(`should remove spectators marked once`, () => {
		const a = audience.join({ fn: sinon.spy(() => 5) });
		const b = audience.join({ fn: sinon.spy(() => 6), once: true });
		const c = audience.join({ fn: sinon.spy(() => 7) });

		expect(Array.from(poll(audience, 1, "foo"))).to.deep.equal([ [ a, 5 ], [ b, 6 ], [ c, 7 ] ]);

		expect(a.fn).calledOnceWithExactly(1, "foo");
		expect(b.fn).calledOnceWithExactly(1, "foo");
		expect(c.fn).calledOnceWithExactly(1, "foo");

		expect(audience.joined(a)).is.true;
		expect(audience.joined(b)).is.false;
		expect(audience.joined(c)).is.true;
	});

	it(`should not send messaged to dormant spectators`, () => {
		const a = audience.join({ fn: sinon.spy(() => 5) });
		const b = audience.join({ fn: sinon.spy(() => 6) });
		const c = audience.join({ fn: sinon.spy(() => 7), dormant: true as boolean });

		expect(Array.from(poll(audience, 1, "foo"))).to.deep.equal([ [ a, 5 ], [ b, 6 ] ]);

		expect(a.fn).calledOnceWithExactly(1, "foo");
		expect(b.fn).calledOnceWithExactly(1, "foo");
		expect(c.fn).not.called;

		expect(audience.joined(c)).is.true;
		c.dormant = false;

		expect(Array.from(poll(audience, 50, "bar"))).to.deep.equal([ [ a, 5 ], [ b, 6 ], [ c, 7 ] ]);


		expect(c.fn).calledOnceWithExactly(50, "bar");
	});
});
