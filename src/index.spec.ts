/* eslint-disable @typescript-eslint/no-unused-vars */
import * as chai from "chai";
import { expect } from "chai";
import "mocha";
import * as sinonChai from "sinon-chai";
import * as sinon from "sinon";
chai.use(sinonChai);

import { Exact, Assignable } from "./spec";
import { Audience, Spectator, emit, poll } from "./index";


/* eslint-disable @typescript-eslint/indent */
/* ///////////////// */namespace CheckAudienceAssignability {// @ts-expect-error
if(1 as 0) return;

type To<T> = T;
interface Foo { x: string }
interface Bar extends Foo { x: "bar" }

type FooParam = Spectator<(x: Foo) => void>;
type BarParam = Spectator<(x: Bar) => void>;
type FooRet = Spectator<(x: 1) => Foo>;
type BarRet = Spectator<(x: 1) => Bar>;

// -------------------------------------------------------------------------- //
// Since `Bar` extends `Foo`, an `Audience.Iterable<BarParam>` should be a
// subclass of `Audience<FooParam>` since a `(x: Foo) => void` function can be
// called with a `Bar` object without error.
Assignable<Audience.Iterable<BarParam>, To<Audience<FooParam>>>(true);

interface Base1 { onEvent: Audience<FooParam> }
declare class Child1 implements Base1 { onEvent: Audience.Iterable<BarParam>; }
// -------------------------------------------------------------------------- //
// `Audience.Iterable<BarParam>` should not be a subclass of
// `Audience.Iterable<FooParam>` however, because if it were, the
// `[Symbol.iterator]()` method would return functions that accept only
// `(x: Bar) => void` with the type signature `(x: Foo) => void` which is a type
// error.
Assignable<Audience.Iterable<BarParam>, To<Audience.Iterable<FooParam>>>(false);

interface Base2 { onEvent: Audience.Iterable<FooParam> }
// @ts-expect-error:
// Type 'IterableIterator<Readonly<Spectator<(x: Bar) => void>>>' is not
// assignable to type 'IterableIterator<Readonly<Spectator<(x: Foo) => void>>>'.
declare class Child2 implements Base2 { onEvent: Audience.Iterable<BarParam>; }
// -------------------------------------------------------------------------- //
// Since `Bar` extends `Foo`, an `Audience.Iterable<BarRet>` should be a
// subclass of `Audience.Iterable<FooRet>` since `(x: 1) => Bar` can be assigned
// to `(x: 1) => Foo`.
Assignable<Audience.Iterable<BarRet>, To<Audience<FooRet>>>(true);
Assignable<Audience.Iterable<BarRet>, To<Audience.Iterable<FooRet>>>(true);

interface Base3 { onEvent: Audience.Iterable<FooRet> }
declare class Child3 implements Base3 { onEvent: Audience.Iterable<BarRet>; }
// -------------------------------------------------------------------------- //
// Incompatible function signatures must not be assignable to one another. Fixed
// this issue by adding a non-generic overload to [[Audience#join]].
Assignable<Audience<BarRet>, To<Audience<FooParam>>>(false);
Assignable<Audience<FooParam>, To<Audience<BarRet>>>(false);
Assignable<Audience.Iterable<BarRet>, To<Audience.Iterable<FooParam>>>(false);
Assignable<Audience.Iterable<FooParam>, To<Audience.Iterable<BarRet>>>(false);

interface Base4 { onEvent: Audience<FooParam> }
// @ts-expect-error:
// Type '(x: Foo) => void' is not assignable to type '(x: 1) => Bar'.
declare class Child4 implements Base4 { onEvent: Audience.Iterable<BarRet>; }
// -------------------------------------------------------------------------- //
// Audiences should be assignable when their Spectator types are assignable.
Assignable<Audience<BarParam & { x?: 1 }>, To<Audience<FooParam>>>(true);
Assignable<Audience<BarParam & { x: 1 }>, To<Audience<FooParam>>>(false);
Assignable<Audience<BarParam & { x?: 1 }>, To<Audience<FooParam & { x: 1 }>>>(true);
// -------------------------------------------------------------------------- //
declare let a1: Audience<Spectator<(x: "foo") => "foo"> & { test?: true }>;

// Join must infer the parameters and return type of fn.
const j1 = a1.join({ fn(x) { Exact(x)<"foo">(true); return x }, x: 1 });
const j2 = a1.join({ fn(x) { Exact(x)<"foo">(true); return x } });

// Join must infer the correct this-type for fn.
a1.join({ fn(x) {
	Exact(this.x)<number>(true);
	Exact(this.test)<undefined | true>(true);
	return x;
}, x: 7 });

// Join must not accept wrong function types
// @ts-expect-error:
// Type '(x: number) => string' is not assignable to type '(x: "foo") => "foo"'.
a1.join({ fn(x: number) { return "foo" } });

// Join must not return `unknown` and must return the same type as the provided
// spectator.
Exact(j1)<{ fn(x: "foo"): "foo", x: number } & { test?: true } & Spectator<(x: "foo") => "foo">>(true);
Exact(j2)<{ fn(x: "foo"): "foo" } & { test?: true } & Spectator<(x: "foo") => "foo">>(true);

// Part must accept normal types
a1.part(j1);
a1.part(j2);
a1.part(null);
a1.part(undefined);
a1.part({ fn(x) { return x } });
// @ts-expect-error:
// Property 'fn' is missing in type '{}'
a1.part({ test: true });

// Joined should work as a type-guard
declare let j3: typeof j1 | null;
Exact(j1, j3, false);
if(a1.joined(j3)) { Exact(j1, j3, true) }

// Dissolve exists
a1.dissolve();
// -------------------------------------------------------------------------- //
declare let a2: Audience.Iterable<Spectator<(x: "foo") => "foo"> & { test?: true }>;

// [Symbol.iterator] produces correctly typed spectator objects.
const j4 = a2[Symbol.iterator]();
Exact(j4)<IterableIterator<Readonly<Spectator<(x: "foo") => "foo"> & { test?: true }>>>(true);
/* ///////////////////////////////////////////////////////////////////////// */}

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
// emit.Options must be optional
Exact<emit.Options, Partial<emit.Options>>(true);
/* ///////////////////////////////////////////////////////////////////////// */}

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
// poll.Options must be optional
Exact<poll.Options, Partial<poll.Options>>(true);
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
});

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
